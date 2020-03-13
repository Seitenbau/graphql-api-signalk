var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema  } = require('graphql');

// Construct a schema, using GraphQL schema language
var schemaV1 = buildSchema(`
  type Query {
    allBooks(title: String): [Book],
    rollDice(numDice: Int!, numSides: Int): [Int]
    
  },
  type Book {
    id: Int
    author: String
    title: String
    url2:String @deprecated(reason: "Use url")
    url:String
  }
`);

var schemaV2 = buildSchema(`
  type Query {
    allBooks(title: String): [Book],
    rollDice(numDice: Int!, numSides: Int): [Int]
    
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
    },
    {
        id: 4,
        title: 'The JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

var getAllBooks = function (filter) {
    if (filter.title) {
        var title = filter.title;
        return bookData.filter(book => book.title.startsWith(title))
    }
    return bookData;
};

var rollDices = function (args) {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
        output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
};

// The root provides a resolver function for each API endpoint
var root = {
    allBooks: getAllBooks,
    rollDice: rollDices
};

var app = express();
app.use('/', graphqlHTTP({
    schema: schemaV1,
    rootValue: root,
    graphiql: true,
}));
app.listen(3000);
console.log('Running a GraphQL API server at http://localhost:3000/');

var app2 = express();
app2.use('/', graphqlHTTP({
    schema: schemaV2,
    rootValue: root,
    graphiql: true,
}));
app2.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/');