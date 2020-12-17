const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(express.json());

const events = [];

app.use(
  '/',
  graphqlHTTP({
    schema: buildSchema(`
    
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    
    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput:EventInput!): Event
    }


    schema {
      query: RootQuery
      mutation: RootMutation
    }
    `),
    rootValue: {
      events: (parent, args, context, info) => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(),
        };
        events.push(event);
        return event;
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
