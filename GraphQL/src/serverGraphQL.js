var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    allBooks(title: String): [Book]
  },
  type Book {
    id: Int
    author: String
    title: String
    url: String
  }
`);

var bookData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

var getAllBooks = function (filter) {
    console.log(filter);
    if (filter.title) {
        var title = filter.title;
        return bookData.filter(book => book.title.startsWith(title))
    }
    return bookData;
};

// The root provides a resolver function for each API endpoint
var root = {
    allBooks: getAllBooks
};

var app = express();
app.use('/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(3000);
console.log('Running a GraphQL API server at http://localhost:3000/');