var express = require('express');
var fetch = require('node-fetch');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getRoute', function(req, res, next) {
  fetch('http://localhost:3000/signalk/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: "query { route(uuid: \"3f441c99-67c1-48cd-8e97-9db483621eff\") { uuid, name } }"})
  })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      res.render('index', { title: JSON.stringify(data.data) });
    });
});

router.get('/getRoutes', function(req, res, next) {
  fetch('http://localhost:3000/signalk/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: "query { routes { uuid, name }}"})
  })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      res.render('index', { title: JSON.stringify(data.data) });
    });
});

module.exports = router;
