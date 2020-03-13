const fetch = require("node-fetch");

var titleFilter = 'T';
var sides = 6;
var query = `query AllBooks($titleFilter: String!) {
    allBooks(title: $titleFilter) {
        id,
        title
    }
}`;

const run = async () => {
    const books = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {titleFilter},
        })
    })
        .then(r => r.json())
        .then(data => {
            return data
        });
    console.log(books);
};

run();