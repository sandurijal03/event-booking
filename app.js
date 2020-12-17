const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

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

    type User {
      _id: ID!
      email: String!
      password:String
    }
    
    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }



    type RootQuery {
      events: [Event!]!
      users: [User!]!
    }

    type RootMutation {
      createEvent(eventInput:EventInput!): Event
      createUser(userInput: UserInput): User
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
          creator: '5fdbd6200f5d98a3e0d8cd33',
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc, _id: event._doc._id.toString() };
            return User.findById('5fdbd6200f5d98a3e0d8cd33');
          })
          .then((user) => {
            if (!user) {
              throw new Error('Users not exists');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error('User exists already');
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, _id: result.id, password: null };
          })
          .catch((err) => {
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
