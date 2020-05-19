var express = require('express');
var fetch = require('node-fetch');


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addRoute', function (req, res, next) {
  fetch('http://localhost:3000/signalk/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: "mutation { " +
        " addRoute(distance: 2.4, feature: { " +
        " geometry: { " +
        " coordinates: [[123.4, 212.5], [123.12, 222.41], [123.2, 332.1]] " +
        " } " +
        " }, " +
        " name:\"Test\") { " +
        " uuid, " +
        " name}}"
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      res.render('index', { title: JSON.stringify(data) });
    });
});

module.exports = router;
