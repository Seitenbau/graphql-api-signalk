**Code der Bachelorarbeit**

Für die Bachelorarbeit wurde der Server der Routen-API sowohl in REST als auch in GraphQL aufgebaut. Der Code hierfür befindet sich in:

* /SignalKBackend/signalk-server-node/src/interfaces:

	* REST: restRoute.js
	* GraphQL: graphql.js
	* Datenbank für beide: database.js

Server starten:
* Terminal in /SignalKBackend/signalk-server-node öffnen
* npm install
* npm run build
* bin/nmea-from-file (Ausführbares Shellscript)

Schnittstellen:
* GraphQL: http://localhost:3000/signalk/v1/graphql
* REST: http://localhost:3000/signalk/v2/api/xxx

Client Code mit Beispielaufrufen für beide APIs kann gefunden werden in:

* /Client/routes/index.js

Client starten:
* Terminal in /Client öffnen
* npm install
* npm start

Aufrufe können nun vom Browser aus getestet werden:
* GraphQL: http://localhost:4000/graphql/xxx
* REST: http://localhost:4000/rest/xxx
