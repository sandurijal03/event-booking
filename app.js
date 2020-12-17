const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server is runnin on http://localhost:3001/graphql');
});
