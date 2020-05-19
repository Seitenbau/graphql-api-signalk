var express = require('express');
var fetch = require('node-fetch');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/updateRoute', function(req, res, next) {
  fetch('http://localhost:3000/signalk/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `
      mutation {
        updateRoute(uuid:"3f441c99-67c1-48cd-8e97-9db483621eff", feature: {
          geometry: {
            coordinates:[[50.0, 50.0], [51.0, 51.0], [52.0, 52.0]]
          }
        }) {
          feature {
            geometry {
              coordinates
            }
          },
          name
        }
      }
    `})
  })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      res.render('index', { title: JSON.stringify(data) });
    });
});

module.exports = router;
