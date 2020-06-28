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

var Database = require('./database.js')
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fs = require('fs');
var ObjectId = require("node-time-uuid");

module.exports = function (app) {

    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    let db = new Database();

    var schema = buildSchema(`
        type Query {
            """Testschnittstelle"""
            health: String,

            """Gibt alle abgespeicherten Routen aus"""
            routes: [Route],
            
            """Gibt die Route mit uuid aus"""
            route(uuid: String): Route
        }
        
        type Mutation {
            """Fügt eine neue Route hinzu"""
            addRoute(route: RouteInput!): Route

            """Aktualisiert eine Route"""
            updateRoute(uuid: String!, update: RouteUpdateInput!): Route
            
            """Löscht eine Route"""
            deleteRoute(uuid: String!): String
        }

        """Eine Route"""
        type Route {
            """Eindeutiger Identifikator"""
            uuid: String,

            """Koordinatendaten"""
            geometry: GeometryObject,

            """Startort"""
            start: String,

            """Zielort"""
            end: String,

            """Beschreibung"""
            description: String,

            """Name"""
            name: String,

            """Erstellungszeitpunkt"""
            timestamp: String
        }

        """Objekt welches den Weg beschreibt"""
        type GeometryObject {
            """Ein Array aus Wepunkten, Werte sind in Grad"""
            coordinates: [[Float]],

            """Die gesamte Distanz der Route"""
            distance: Float
        }

        input RouteInput {
            geometry: GeometryInput!,
            start: String,
            end: String,
            description: String,
            name: String!
        }

        input GeometryInput {
            coordinates: [[Float!]!]!
        }

        input RouteUpdateInput {
            geometry: GeometryInput,
            start: String,
            end: String,
            description: String,
            name: String
        }

    `);

    var cachingSchema = buildSchema(`
        type Query {
            """Testet das Caching mit HTTP-GET"""
            cachingRoute(uuid: String): Route
        },

        type Route {
            uuid: String,
            geometry: GeometryObject,
            start: String,
            end: String,
            description: String,
            name: String,
            timestamp: String
        },

        type GeometryObject {
            coordinates: [[Float]],
            distance: Float
        }
    `);

    var root = {
        health() {
            return "Server is up and running"
        },

        async route(args) {
            var uuid = args.uuid;
            var result = await db.getRouteData(uuid)
            return result
        },

        async cachingRoute(args) {
            // Um den Effekt von Caching zu testen, wird die Datenbankabfrage schlafen und deswegen lange brauchen
            var uuid = args.uuid;
            var result = await db.getRouteDataSleep(uuid)
            return result
        },

        async routes() {
            var result = await db.getRoutesData()
            return result
        },

        async addRoute(args) {
            var date = new Date();
            var timestamp = date.getTime();
            var route = args.route;
            route.uuid = new ObjectId().toString("pretty");
            route.timestamp = timestamp;
            var result = await db.addRoute(route)
            return result
        },

        async deleteRoute(args) {
            var uuid = args.uuid;
            var result = await db.deleteRoute(uuid)
            return result
        },

        async updateRoute(args) {
            var uuid = args.uuid;
            var update = args.update;
            if ('geometry' in update) {
                update.coordinates = update.geometry.coordinates;
                delete update['geometry']
            }
            var result = await db.updateRoute(uuid, update)
            return result
        }
    };
    return {
        start: function () {
            app.post(apiPathPrefix, graphqlHTTP({
                schema: schema,
                rootValue: root,
                graphiql: true,
            }));

            // GET-Endpunkt, um Caching zu testen
            app.get(apiPathPrefix, graphqlHTTP((req, res) => {
                res.set('Cache-Control', 'max-age=10');
                return {
                    schema: cachingSchema,
                    rootValue: root,
                    graphiql: true,
                };
            }));
        }
    };
};
