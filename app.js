const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(express.json());

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
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
