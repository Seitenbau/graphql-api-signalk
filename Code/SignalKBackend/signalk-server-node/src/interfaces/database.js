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

const sqlite3 = require('sqlite3').verbose();

module.exports = class database {

    constructor() {
        this.db = this.setup()
    }

    setup() {
        let db = new sqlite3.Database(":memory:")
        let sql1 = `CREATE TABLE routes (
            route_id integer PRIMARY KEY AUTOINCREMENT,
            uuid text,
            start text,
            end text,
            description text,
            name text NOT NULL,
            timestamp text,
            distance real NOT NULL,
            coordinates text NOT NULL
        );`;
        let coordinates = [[15.456703186035153, 22.917662281506665], [45.50820159912109, 23.9293622351139]];
        let coordinates2 = [[22.456703186035153, 17.917662281506665], [61.50820159912109, 13.9293622351139]];
        let coordinates3 = [[23.395420074462887, 59.916457640310426], [23.456703186035153, 59.917662281506665], [23.50820159912109, 59.9293622351139]];
        let sql2 = `INSERT INTO routes(uuid,start,end,description,name,timestamp,distance,coordinates)
                    VALUES('3f441c99-67c1-48cd-8e97-9db483621eff', 'Rostock', 'Kiel', 'Kurzer Trip', 'Ostsee', NULL, 6571.329987262973, '` + JSON.stringify(coordinates) + `'),
                    ('abcde-67c1-48cd-8e97-9db483621eff', 'Dangast', 'Wangerooge', 'Samstagsausflug', 'Nordsee', NULL, 7000.329987262973, '` + JSON.stringify(coordinates2) + `'),
                    ('fghijk-67c1-48cd-8e97-9db483621eff', 'Kopenhagen', 'Hamburg', 'Lange Toern', 'Daenemark', NULL, 8000.329987262973, '` + JSON.stringify(coordinates3) + `');`;
        db.serialize(() => {
            // Queries scheduled here will be serialized.
            db.run(sql1)
                .run(sql2);
        });
        return db;
    }

    getRoutesData = async function () {
        let sql = `
        SELECT *
        FROM routes`
        var rows;
        var result = new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
        var rows = await result;
        var routes = [];
        rows.forEach(row => {
            row.geometry = {
                distance: row.distance,
                coordinates: JSON.parse(row.coordinates)
            }
            delete row["distance"];
            delete row["coordinates"];
            routes.push(row);
        });
        return routes;
    }

    getRoutesDataHATEOAS = async function () {
        let sql = `
        SELECT routes.uuid, routes.name
        FROM routes`
        var rows;
        var result = new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
        var rows = await result;
        var routes = {};
        routes.self = {
            href: '/routes',
            addRoute: '/routes'
        }
        routes.data = []
        rows.forEach(row => {
            row.get = '/routes/' + row.uuid
            row.delete = '/routes/' + row.uuid
            row.patch = '/routes/' + row.uuid
            routes.data.push(row)
        });
        return routes;
    }


    getRoutesListData = async function () {
        let sql = `
        SELECT routes.name, routes.start, routes.end
        FROM routes`
        var rows;
        var result = new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
        return await result;
    }

    addRoute = async function (route) {
        let geometry = route.geometry;
        geometry.distance = this.calculateDistance(geometry.coordinates);
        this.db.run(`INSERT INTO routes(uuid, start, end, description, name, timestamp, distance, coordinates) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [route.uuid, route.start, route.end, route.description, route.name, route.timestamp, geometry.distance, JSON.stringify(geometry.coordinates)], function (err) {
            if (err) {
                throw err;
            }
        });

        return route;
    }

    getRouteData = async function (uuid) {
        var result = this.getRoute(uuid)
        var route = await result;
        if (route) {
            route.geometry = {
                distance: route.distance,
                coordinates: JSON.parse(route.coordinates)
            }
            delete route["distance"];
            delete route["coordinates"];
        }
        return route;
    }

    // Caching-Tests
    getRouteDataSleep = async function (uuid) {
        await new Promise(r => setTimeout(r, 2000));
        var result = this.getRoute(uuid)
        var route = await result;
        if (route) {
            route.geometry = {
                distance: route.distance,
                coordinates: JSON.parse(route.coordinates)
            }
            delete route["distance"];
            delete route["coordinates"];
        }
        return route;
    }

    updateRoute = async function (uuid, route) {

        var result = this.getRoute(uuid)
        var row = await result;

        if (!row) {
            return null;
        }

        const updateParameters = ['start', 'end', 'description', 'name', 'coordinates'];

        for (var key in route) {
            if (updateParameters.includes(key)) {
                row[key] = route[key];
                if (key == 'coordinates') {

                    /* Beispiel für Validierung der Koordinaten mit folgenden Eigenschaften:
                    *     - Es muss ein Array aus Arrays sein
                    *     - Der Äußere Array muss mindestens 2 Arrays enthalten
                    *     - Die inneren Arrays müssen immer aus genau zwei Zahlen bestehen
                    *     - Die Zahlen müssen zwischen 0-360 liegen
                    *     - Bsp.: [[123.231, 331.213], [321.231, 221.321]]
                    */
                    var coordinates = route['coordinates'];

                    if (coordinates.length < 2) {
                        throw "Es müssen mindestens zwei Wegpunkte angegeben werden"
                    }

                    coordinates.forEach(function (item) {
                        console.log(item)
                        if (item.length != 2) {
                            throw "Jeder Wegpunkt muss aus genau 2 Zahlen bestehen"
                        }

                        if (item[0] < 0 || item[0] > 360 || item[1] < 0 || item[1] > 360) {
                            throw "Die Angaben der Koordinaten müssen zwischen 0 und 360 liegen"
                        }
                    })

                    row['distance'] = this.calculateDistance(route['coordinates'])
                }
            }
        }

        let sql2 = `
        UPDATE routes
        SET start = ?, end = ?, description = ?, name = ?, distance = ?, coordinates = ?
        WHERE uuid = ?`

        result = new Promise((resolve, reject) => {
            this.db.get(sql2, [row.start, row.end, row.description, row.name, row.distance, JSON.stringify(row.coordinates), uuid], function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });

        row = await result;

        result = this.getRoute(uuid)
        row = await result;

        row.geometry = {
            distance: row.distance,
            coordinates: JSON.parse(row.coordinates)
        }
        delete row["distance"];
        delete row["coordinates"];
        return row;
    }

    deleteRoute = async function (uuid) {
        let sql = `
        DELETE FROM routes
        WHERE uuid = ?`

        this.db.run(sql, [uuid], function (err) {
            if (err) {
                return console.error(err.message);
            }
        });
        return uuid;
    }

    getRoute = async function (uuid) {
        let sql = `
        SELECT *
        FROM routes
        WHERE uuid = ?`
        var result = new Promise((resolve, reject) => {
            this.db.get(sql, [uuid], function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
        return result
    }

    calculateDistance = function (coordinates) {
        let distance = 0;
        for (var arrayIdx in coordinates) {
            if (arrayIdx + 1 < coordinates.length) {
                let array1 = coordinates[arrayIdx]
                let array2 = coordinates[parseInt(arrayIdx) + 1]
                let dx = 71.5 * (array2[0] - array1[0])
                let dy = 111.3 * (array2[1] - array1[1])
                distance = distance + Math.sqrt(dx * dx + dy * dy)
            }
        }
        return distance;
    }
}