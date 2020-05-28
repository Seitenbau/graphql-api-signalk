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

var setupDatabase = require('./database.js')
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fs = require('fs');

module.exports = function (app) {

    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    let db = setupDatabase();

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
            route(uuid: String, name: String): Route
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
        hello: () => "Hello World!",

        async route(args) {
            let sql = `
                SELECT route_id,uuid,distance,start,end,description,name,timestamp,source, feature.type feature_type, feature.id, geometry.type geometry_type, geometry.coordinates
                FROM routes
                INNER JOIN feature on routes.feature_id = feature.feature_id
                INNER JOIN geometry on feature.geometry_id = geometry.geometry_id
                `
            var param;
            if (args.uuid) {
                param = args.uuid;
                sql = sql + `WHERE uuid = ?; `
            } else if (args.name) {
                param = args.name;
                sql = sql + `WHERE name = ?; `
            } else {
                return;
            }
            var result = new Promise((resolve, reject) => {
                db.get(sql, [param], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                });
            });
            var row = await result;
            if (row) {
                row.feature = {
                    id: row.id,
                    type: row.feature_type,
                    geometry: {
                        type: row.geometry_type,
                        coordinates: JSON.parse(row.coordinates)
                    }
                }
            }
            return row;
        },

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
