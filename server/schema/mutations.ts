import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import { Request } from "express";
import UserType from "./types/user_type";
import * as AuthService from "../services/auth";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(
        _parentValue: unknown,
        args: { [argName: string]: unknown },
        req: Request
      ) {
        return AuthService.signup({
          email: String(args.email),
          password: String(args.password),
          req,
        });
      },
    },
  },
});

export default mutation;
