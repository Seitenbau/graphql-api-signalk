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


var app = express();

module.exports = function (app) {
    'use strict';

    const pathPrefix = '/signalk';
    const versionPrefix = '/v1';
    const apiPathPrefix = pathPrefix + versionPrefix + '/graphql';

    db.defaults({ routes: [] })
        .write()

    db.get('routes')
        .push({ id: 1, title: 'lowdb is awesome' })
        .write()

    db.get('routes')
        .push({ id: 2, title: 'lowdb is awesome2' })
        .write()

    var schema = buildSchema(`
        type Query {
            hello: String
        }
    `);

    var root = {
        hello: () => JSON.stringify(db.get('routes')
            .filter(route => {return route.title.startsWith('lowdb'); })
            .value())

    };

    return {
        start: function () {
            app.use(apiPathPrefix, graphqlHTTP({
                schema: schema,
                rootValue: root,
                graphiql: true,
            }));
        }
    }
}