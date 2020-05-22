"use strict";
/*
 * Copyright 2020 David Wolpers <da721wol@htwg-konstanz.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./database/db.json')
const db = low(adapter)


var fs = require('fs');
var app = express();

module.exports = function (app) {
    'use strict';

    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    db.defaults({ routes: [] })
        .write()

    db.get('routes')
        .push({ uuid: "3f441c99-67c1-48cd-8e97-9db483621eff", distance: 6571.329987262973, feature: { type: "Feature", geometry: { type: "LineString", coordinates: [[23.395420074462887, 59.916457640310426], [23.456703186035153, 59.917662281506665], [23.50820159912109, 59.9293622351139]] }, id: "" }, start: null, end: null, description: "Hallo", name: "Test4", timestamp: null, source: "Test" })
        .write()

    var resourcePath = './resources/routes';

    var schema = buildSchema(`
        type Query {
            hello(name: String!): String,
            routes: [Route],
            route(uuid: String!): Route
        },

        type Route {
            uuid: String,
            distance: Float,
            feature: FeatureObject,
            start: String,
            end: String,
            description: String,
            name: String,
            timestamp: String,
            source: String
        },

        type FeatureObject {
            type: String,
            geometry: GeometryObject,
            id: String
        },

        type GeometryObject {
            type: String,
            coordinates: [[Float]]
        }

    `);

    var root = {
        hello: () => JSON.stringify(db.get('routes')
            .filter(route => { return route.title.startsWith('lowdb'); })
            .value()),

        routes() {
            var routes = db.get('routes').value();
            return routes;
        },

        route(args) {
            let file = fs.readFileSync(resourcePath + '/' + args.uuid); // Ignoring the security issues here
            let json = JSON.parse(file);
            json.uuid = args.uuid;
            return json;
        }
    };
    return {
        start: function () {
            app.use(apiPathPrefix, graphqlHTTP({
                schema: schema,
                rootValue: root,
                graphiql: true,
            }));
        }
    };
};
