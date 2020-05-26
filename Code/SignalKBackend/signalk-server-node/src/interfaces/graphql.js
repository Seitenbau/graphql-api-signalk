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

const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');
var app = express();

module.exports = function (app) {

    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    let db = new sqlite3.Database(":memory:");


    let sql1 = `CREATE TABLE geometry (
        geometry_id integer PRIMARY KEY AUTOINCREMENT,
        type text NOT NULL,
        coordinates text NOT NULL
    );`;

    let sql2 = `CREATE TABLE feature (
        feature_id integer PRIMARY KEY AUTOINCREMENT,
        type text NOT NULL,
        id text,
        geometry_id integer NOT NULL,
        FOREIGN KEY (geometry_id) 
            REFERENCES geometry (geometry_id)
            ON DELETE SET NULL
    );`;

    let sql3 = `CREATE TABLE routes (
        route_id integer PRIMARY KEY AUTOINCREMENT,
        uuid text,
        distance real NOT NULL,
        start text,
        end text,
        description text,
        name text NOT NULL,
        timestamp text,
        source text,
        feature_id integer NOT NULL,
        FOREIGN KEY (feature_id) 
            REFERENCES feature (feature_id) 
            ON DELETE SET NULL
    );`;

    let coordinates = [[23.395420074462887, 59.916457640310426], [23.456703186035153, 59.917662281506665], [23.50820159912109, 59.9293622351139]];
    let coordinates2 = [[15.456703186035153, 22.917662281506665], [45.50820159912109, 23.9293622351139]];
    let coordinates3 = [[22.456703186035153, 17.917662281506665], [61.50820159912109, 13.9293622351139]];

    let sql4 = `INSERT INTO geometry(type,coordinates)
                VALUES('LineString', '` + JSON.stringify(coordinates) + `'),
                ('LineString', '` + JSON.stringify(coordinates2) + `'),
                ('LineString', '` + JSON.stringify(coordinates3) + `');`

    let sql5 = `INSERT INTO feature(type,id,geometry_id)
                VALUES('Feature', '', 1),
                ('Feature', '', 2),
                ('Feature', '', 3);`

    let sql6 = `INSERT INTO routes(uuid,distance,start,end,description,name,timestamp,source,feature_id)
                VALUES('3f441c99-67c1-48cd-8e97-9db483621eff', 6571.329987262973, NULL, NULL, 'Hallo', 'Test4', NULL, 'TEST', 1),
                ('abcde-67c1-48cd-8e97-9db483621eff', 7000.329987262973, NULL, NULL, 'Hallo', 'Test2', NULL, 'TEST2', 2),
                ('fghijk-67c1-48cd-8e97-9db483621eff', 8000.329987262973, NULL, NULL, 'Hallo', 'Test3', NULL, 'TEST3', 3);`;


    db.serialize(() => {
        // Queries scheduled here will be serialized.
        db.run(sql1)
            .run(sql2)
            .run(sql3)
            .run(sql4)
            .run(sql5)
            .run(sql6)
    });

    var resourcePath = './resources/routes';

    /*
    type PageInfo {
        endCursor: String!,
        hasNextPage: Boolean!
    },
    */

    var schema = buildSchema(`
        type Query {
            hello(name: String!): String,
            routes(first: Int!, after: Int!): [Routes],
            route(uuid: String!): Route
        },

        type Routes {
            node: Route!,
            cursor: Int!
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
        hello: () => 'Hello World!',

        async routes(args) {
            let sql = `
            SELECT route_id,uuid,distance,start,end,description,name,timestamp,source, feature.type feature_type, feature.id, geometry.type geometry_type, geometry.coordinates
            FROM routes
            INNER JOIN feature on routes.feature_id = feature.feature_id
            INNER JOIN geometry on feature.geometry_id = geometry.geometry_id
            WHERE route_id > ?
            ORDER BY route_id
            LIMIT ?;`
            var rows;
            var result = new Promise((resolve, reject) => {
                db.all(sql, [args.after, args.first], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                });
            });
            var rows = await result;
            console.log(rows);
            var routes = [];
            rows.forEach(row => {
                let nodeJson = row;
                row.feature = {
                    id: row.id,
                    type: row.feature_type,
                    geometry: {
                        type: row.geometry_type,
                        coordinates: JSON.parse(row.coordinates)
                    }
                }
                let json = {
                    node: row,
                    cursor: row.route_id
                }
                routes.push(json);
            });

            return routes;
        },

        route(args) {
            let file = fs.readFileSync(resourcePath + '/' + args.uuid); // Ignoring the security issues here
            let json = JSON.parse(file);
            json.uuid = args.uuid;
            return json;
        },

        async getRoutes(args) {

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
