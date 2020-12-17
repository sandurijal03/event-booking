const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(express.json());

app.use(
  '/',
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
        events: [String]!
      }

      type RootMutation {
        createEvent(name: String): String!
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: (parent, args, context, info) => {
        return ['Romantic', 'Cooking', 'Sailing', 'All night coding'];
      },
      createEvent: ({ name }) => {
        const eventName = name;
        return eventName;
      },
    },
    graphiql: true,
    pretty: true,
  }),
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server is runnin on http://localhost:3001/graphql');
});
