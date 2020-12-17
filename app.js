const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');

const app = express();

app.use(express.json());

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
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: event._doc._id.toString() };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
    pretty: true,
  }),
);

mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_COLLECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) =>
    console.log(
      'Failed to connect to thee database please verify uri or interneet connection',
    ),
  );

const port = process.env.PORT;
app.listen(port, () => {
  console.log('Server is running on http://localhost:3001/graphql');
});
