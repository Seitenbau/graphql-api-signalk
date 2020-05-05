			Analyse der benötigten Daten von verschiedenen Clients

SailingApp: 
	
	* Boat Details :
	
		* IST:
		
			* Daten werden vom ersten Log erstellen genommen
			
		* SOLL:
		
			* Daten werden beim ersten Aufruf der App abgefragt
			
			* Benötigte Daten:
			
				* Vessel-Uuid
				
				* Vessel-Name
				
				* Vessel-Mmsi (?)
				
	* Log:
	
		* IST:
		
			* Alle Daten werden beim erstellen eines neuen Logs über REST-API abgefragt
			
			* Die Daten bestehen aus allen aktuellen Sensorwerten des Bootes
			
			* Daten die ankommen:
			
				* uuid
    				
				* name
    				
				* navigation: {
        				Für jeden Sensorwert: {
            					meta: {
                					units
                					description
            					},
            					value 
            					$source 
            					timestamp 
            					sentence
        				},
				...

		* SOLL: 
			* Eigentlich werden nur folgende Daten benötigt:
				Für jeden Sensorwert: 
					units
		 			description
		 			value
		 			timestamp (?)
			* ABER: Die SignalK Datenmodell gibt die anderen Paramter vor
				

 

Alarm:
	* Aktuelle Daten des Schiffs gestreamt(?):
		Für jeden Sensorwert: 
			units
			description
			value
			
Dashboard:
	* Aktuelle Daten des Schiffs gestreamt(?):
		Für jeden Sensorwert: 
			units
			description
			value
			


https://github.com/signalk/sailgauge:
	* Ähnlicher Aufbau wie dashboard
	* Daten:
		* SOG - speed over ground (meters per second)
		* COG - course over ground
		* DBT - depth below transducer (meters)
		* reverse laylines, eg. 'how high can I point'
		* apparent & true wind m/s (true calculated if the data feed doesn't contain it)
		* distance and direction of mark/waypoint (if feed has it)

https://github.com/signalk/freeboard-sk:
	* Moving map display with the ability to use a combination of online and locally served charts
	* Verschiedene Plugins:
		* Anchor Alarm:
			* Position Anchor
			* Current Distance from Vessel to anchor
			* Max Radius for alarm
			* Possible States (?)
			* Fudge Factor
		* Routes:
			* GET:
				* Route Objects:
					* Coordinates
					* Always same type(useless?)
			 		* Empty Start & End parameter(useless?)
					* id(useless?)
					* Description
					* Name
					* Timestamp
					* Source
			* PUT:
				* Route Object:
					* Description
					* Distance
					* start(empty?)
					* end(empty?)
					* Coordinates
					* id(empty?)
					* Properties(empty?)
					* Type(Always the same)
					* name
		* Waypoints:
			* GET:
				* Objects:
					* Position
					* Coordinates (Same as position)
					* Always same type(useless?)
					* Name
					* id(empty?)
					* Timestamp
					* Source
			* PUT: 
				* Object:
					* Coordinates
					* id(empty?)
					* Type(Always the same)
					* cmt(Ist die description)
					* name
					* Position(Same as coordinates)
		* etc.

Datenmodell von SignalK:
	* Full Format:
		* Everything!
	* Delta Format:
		* context
		* source
		* timestamp
    		* values:
			* path
			* value

