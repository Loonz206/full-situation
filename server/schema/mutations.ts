import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./types/user_type";
import * as AuthService from "../services/auth";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve(_parentValue: unknown, args: Record<string, any>, req: any) {
        return AuthService.signup({
          email: args.email,
          password: args.password,
          req,
        });
      },
    },
  },
});

export default mutation;
