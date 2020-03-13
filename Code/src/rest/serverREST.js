var express = require('express');

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
    if (filter && filter.title) {
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

var app = express();

app.get('/', (req, res) => {
    res.send(JSON.stringify(getAllBooks(null)));
});

app.get('/:title', (req, res) => {
    console.log(req.params);
    res.send(JSON.stringify(getAllBooks(req.params)));
});
app.listen(2000);
console.log('Running a REST API server at http://localhost:2000/');