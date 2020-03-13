var Client = require('node-rest-client').Client;

var client = new Client();

var args = {
    path: { title: "T"}
};

client.get("http://localhost:2000/T", function (data, response) {
    // parsed response body as js object
    console.log(JSON.parse(data.toString()));
});