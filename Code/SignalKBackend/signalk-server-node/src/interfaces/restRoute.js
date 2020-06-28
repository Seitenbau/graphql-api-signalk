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
var ObjectId = require("node-time-uuid");

module.exports = function (app) {

    let db = new Database();

    return {
        start: function () {

            // Gibt alle abgespeicherten Routen aus
            app.get('/signalk/v2/api/routes', async function (req, res, next) {
                var result = await db.getRoutesData()
                return res.json(result)
            })

            // Gibt alle abgespeicherten Routen nach HATEOAS-Prinzip aus
            app.get('/signalk/v2/api/routesHateoas', async function (req, res, next) {
                var result = await db.getRoutesDataHATEOAS()
                return res.json(result)
            })

            // Fügt eine neue Route hinzu
            app.post('/signalk/v2/api/routes', async function (req, res, next) {
                var route = req.body.route;
                var date = new Date();
                var timestamp = date.getTime();
                route.uuid = new ObjectId().toString("pretty");
                route.timestamp = timestamp;
                var result = await db.addRoute(route)
                return res.json(result)
            })

            // Gibt die Route mit uuid aus
            app.get('/signalk/v2/api/routes/:uuid', async function (req, res, next) {
                var uuid = req.params.uuid;
                var result = await db.getRouteData(uuid)
                return res.json(result)
            })

            // Aktualisiert eine Route
            app.patch('/signalk/v2/api/routes/:uuid', async function (req, res, next) {
                var route = req.body.route;
                var uuid = req.params.uuid;
                var result = await db.updateRoute(uuid, route)
                return res.json(result);
            })

            // Löschen einer Route
            app.delete('/signalk/v2/api/routes/:uuid', async function (req, res, next) {
                var uuid = req.params.uuid;
                var result = await db.deleteRoute(uuid)
                return res.json(result)
            })

            // Endpunkt, welcher nur die Daten einer Route ausgibt, welche für eine Liste nötig sind
            app.get('/signalk/v2/api/routesList', async function (req, res, next) {
                var result = await db.getRoutesListData()
                return res.json(result)
            })


            // Endpunkt bei dem ausgeählt werden kann, welche Felder man erhalten soll
            app.get('/signalk/v2/api/routes/fields/:fields', async function (req, res, next) {
                var results = await db.getRoutesData()
                var answers = [];
                var fields = req.params.fields;
                if (fields) {
                    fields = req.params.fields.split(',')
                    for (const result of results) {
                        var answer = {};
                        const keys = Object.keys(result)
                        for (const key of keys) {
                            if (fields.includes(key)) {
                                answer[key] = result[key];
                            }
                        }
                        answers.push(answer);
                    }
                }
                return res.json(answers)
            })


            // Endpunkt, welcher den Nutzen von Caching testen soll
            app.get('/signalk/v2/api/caching/routes/:uuid', async function (req, res, next) {
                // Um den Effekt von Caching zu testen, wird die Datenbankabfrage schlafen und deswegen lange brauchen

                var uuid = req.params.uuid;
                var result = await db.getRouteDataSleep(uuid)
                res.set('Cache-Control', 'max-age=10')
                return res.json(result)
            })
        }
    }
}