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
var fs = require('fs');
var app = express();
var ObjectId = require("node-time-uuid");

module.exports = function (app) {
    'use strict';
    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    const resourcePath = './resources/routes';

    var schema = buildSchema(`
        type Query {
            hello(name: String!): String,
            routes: [Route],
            route(uuid: String!): Route
        },

        type Mutation {
            addRoute(distance: Float!, feature: FeatureInput!, start: String, end: String, description: String, name: String!): Route,
            deleteRoute(uuid: String!): String,
            updateRoute(uuid: String!, activated: Boolean, distance: Float, feature: FeatureInput, start: String, end: String, description: String, name: String): Route
        },

        type Route {
            uuid: String!,
            distance: Float,
            feature: FeatureObject!,
            start: String,
            end: String,
            description: String,
            name: String!,
            timestamp: String,
            source: String,
            activated: Boolean
        },

        type FeatureObject {
            type: String!,
            geometry: GeometryObject!,
            id: String
        },

        type GeometryObject {
            type: String!,
            coordinates: [[Float!]!]!
        },

        input GeometryInput {
            type: String
            coordinates: [[Float!]!]!
        },

        input FeatureInput {
            type: String,
            geometry: GeometryInput!,
            id: String
        }
         

    `);

    var root = {
        hello(args) {
            let name = args.name;
            return name;
        },

        routes() {
            let routes = [];
            let files = fs.readdirSync('./resources/routes');
            for (var fileId in files) {
                let file = files[fileId];
                let data = fs.readFileSync(resourcePath + '/' + file);
                let json = JSON.parse(data);
                json.uuid = file;
                routes.push(json);
            }
            return routes;
        },

        route(args) {
            let file = fs.readFileSync(resourcePath + '/' + args.uuid); // Ignoring the security issues here
            let json = JSON.parse(file);
            json.uuid = args.uuid;
            return json;
        },

        addRoute(args) {
            const feature = args.feature;
            const geometry = feature.geometry
            var date = new Date();
            var timestamp = date.getTime();
            const route = {
                uuid: new ObjectId().toString("pretty"),
                distance: args.distance,
                feature: {
                    type: (feature.type || "Feature"),
                    geometry: {
                        type: (geometry.type || "LineString"),
                        coordinates: geometry.coordinates
                    },
                    id: (feature.id || "")
                },
                start: (args.start || ""),
                end: (args.end || ""),
                description: (args.description || ""),
                name: args.name,
                timestamp: timestamp,
                source: "",
                activated: false
            };
            var jsonData = JSON.stringify(route);
            fs.writeFile(resourcePath + '/' + route.uuid, jsonData, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            return route;
        },

        deleteRoute(args) {
            let file = fs.unlinkSync(resourcePath + '/' + args.uuid); // Ignoring the security issues here
            return args.uuid;
        },

        updateRoute(args) {
            let file = fs.readFileSync(resourcePath + '/' + args.uuid); // Ignoring the security issues here
            let route = JSON.parse(file);

            var keys = Object.keys(args)

            for (var keyId in keys) {
                var key = keys[keyId];
                if(typeof args[key] !== 'object') {
                    route[key] = args[key];
                }
            }
            console.log(args.feature);
            if (args.feature) {
                const feature = args.feature;
                if(feature.type) {
                    route.feature.type = feature.type;
                }
                if(feature.id) {
                    route.feature.id = feature.id;
                }
                console.log(args.geometry);
                if(feature.geometry) {
                    const geometry = feature.geometry;
                    if(geometry.type) {
                        route.feature.geometry.type = geometry.type;
                    }
                    console.log(geometry.coordinates);
                    if(geometry.coordinates) {
                        route.feature.geometry.coordinates = geometry.coordinates;
                    }
                }
            }
            var jsonData = JSON.stringify(route);
            fs.writeFile(resourcePath + '/' + route.uuid, jsonData, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            return route;
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
