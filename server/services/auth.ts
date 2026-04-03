import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Request } from "express";
import { IUser } from "../models/user";

const User = mongoose.model<IUser>("user");

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
  done(null, (user as IUser).id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id: string, done) => {
  User.findById(id, (err: Error | null, user: IUser | null) => {
    done(err, user);
  });
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne(
      { email: email.toLowerCase() },
      (err: Error | null, user: IUser | null) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Invalid Credentials" });
        }
        user.comparePassword(password, (err2, isMatch) => {
          if (err2) {
            return done(err2);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: "Invalid credentials." });
        });
      }
    );
  })
);

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
interface AuthParams {
  email: string;
  password: string;
  req: Request;
}

export function signup({ email, password, req }: AuthParams): Promise<IUser> {
  const user = new User({ email, password });
  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email in use");
      }
      return user.save();
    })
    .then((savedUser) => {
      return new Promise<IUser>((resolve, reject) => {
        req.logIn(savedUser, (err) => {
          if (err) {
            return reject(err);
          }
          resolve(savedUser);
        });
      });
    });
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
export function login({ email, password, req }: AuthParams): Promise<IUser> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line node/handle-callback-err
    passport.authenticate("local", (err: Error | null, user: IUser | false) => {
      if (!user) {
        reject(new Error("Invalid credentials."));
      } else {
        req.login(user, () => resolve(user));
      }
    })({ body: { email, password } } as Request, {} as never, () => undefined);
  });
}
