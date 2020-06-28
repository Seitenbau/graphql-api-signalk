var express = require('express');
var fetch = require('node-fetch');


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/rest/getRoutes', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v2/api/routes')
        .then(r => r.json())
        .then(data => {
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
        });
});

router.get('/rest/getRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v2/api/routes/3f441c99-67c1-48cd-8e97-9db483621eff')
        .then(r => r.json())
        .then(data => {
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
        });
});

router.get('/rest/addRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v2/api/routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            route: {
                geometry: {
                    coordinates: [[123.212, 231.22231], [231.231, 111.231]]
                },
                name: "Test"
            }
        })
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
        });
});

router.get('/rest/updateRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v2/api/routes/3f441c99-67c1-48cd-8e97-9db483621eff', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            route: {
                name: 'Test'
            }
        })
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
        });
});

router.get('/rest/deleteRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v2/api/routes/3f441c99-67c1-48cd-8e97-9db483621eff', {
        method: 'DELETE'
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            res.render('index', { title: JSON.stringify(data) });
        });
});

router.get('/graphql/getRoutes', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query { 
                    routes { 
                        uuid, 
                        name 
                    }
                }
        `})
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            res.render('index', { title: JSON.stringify(data.data) });
        });
});

router.get('/graphql/getRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    route(uuid:"3f441c99-67c1-48cd-8e97-9db483621eff") { 
                        uuid, 
                        name
                    }
                }
        `})
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            res.render('index', { title: JSON.stringify(data.data) });
        });
});

router.get('/graphql/addRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    addRoute(route : {
                        geometry: {
                            coordinates: [[123.212, 231.22231], [231.231, 111.231]]
                        },
                        name:"Test"
                    }) {
                        uuid
                    }
                }
        `})
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            res.render('index', { title: JSON.stringify(data.data) });
        });
});

router.get('/graphql/deleteRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    deleteRoute(uuid:"3f441c99-67c1-48cd-8e97-9db483621eff")
                }
        `})
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            res.render('index', { title: JSON.stringify(data.data) });
        });
});

router.get('/graphql/updateRoute', function (req, res, next) {
    fetch('http://localhost:3000/signalk/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateRoute(uuid:"3f441c99-67c1-48cd-8e97-9db483621eff", update: {
                        name:"Test",
                    }) {
                        name
                    }
                }
        `})
    })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            res.render('index', { title: JSON.stringify(data.data) });
        });
});

module.exports = router;
