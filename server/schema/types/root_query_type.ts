import { GraphQLObjectType, GraphQLID } from "graphql";

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    dummyField: { type: GraphQLID },
  },
});

export default RootQueryType;
