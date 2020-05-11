var express = require('express');
var fetch = require('node-fetch');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  fetch('http://localhost:3000/signalk/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: "{ hello }"})
  })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      res.render('index', { title: JSON.stringify(data) });
    });
});

module.exports = router;
