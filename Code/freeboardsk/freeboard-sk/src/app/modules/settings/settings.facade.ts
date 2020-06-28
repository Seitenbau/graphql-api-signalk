/** Settings abstraction Facade
 * ************************************/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AppInfo } from 'src/app/app.info';
import { SignalKClient } from 'signalk-client-angular';

@Injectable({ providedIn: 'root' })
export class SettingsFacade  {

   // **************** Settings Dialog Support ***************************
	
    availableUnits= {
        distance: new Map([ 
            ['m', 'Kilometres'], ['ft', 'Nautical Miles']
        ]),
        depth: new Map([ 
            ['m', 'metres'], ['ft', 'feet']
        ])
    }   

    preferredValues= {
        heading: [ 
            ['navigation.headingTrue', 'True'], ['navigation.headingMagnetic', 'Magnetic']
        ],
        wind: new Map([ 
            [false, 'Wind True'], [true, 'Wind Apparent']
        ])
    }

    list= {
        minZoom: [8,9,10,11,12,13,15,16,17],
        resourceRadius: [ 5, 10,20, 50, 100, 150, 200, 500 ],
        applications: [],
        favourites: []
    }

    alarmOptions= {
        smoothing: new Map( [ [5000,'5 secs'],[10000,'10 secs'],[20000,'20 secs'],[30000,'30 secs'] ])
    }

    darkModeOptions= new Map( [ [0,'Use OS setting'], [1,'Use Signal K Mode'] ]);  

    // *****************************************************
    settings:any= this.app.config;
    data:any= this.app.data;

    update$() { return this.app.settings$ }
    saved$() { return this.configSavedSource.asObservable() }
    loaded$() { return this.configLoadedSource.asObservable() }

    // ******************************************************
    private configSavedSource= new Subject<any>();
    private configLoadedSource= new Subject<any>();
   // *******************************************************    

    constructor(private app: AppInfo, 
                public signalk: SignalKClient) { 
        this.app.settings$.subscribe( r=> {
            if(r.setting=='config') {
                if(r.action=='load') { this.configLoadedSource.next(r) }
                if(r.action=='save') { this.configSavedSource.next(r) }
            }
        })

    }

    // refresh dynamic data from sources
    refresh() { this.getApps() }

    // ** populate applications list **
    private getApps() {
        // apps list - default an entry to stored config value
        if(this.app.config.plugins.instruments) { 
            this.list.applications.push(this.app.config.plugins.instruments);
        } 

        this.signalk.apps.list().subscribe( 
            (a: Array<any>)=> {
                this.list.applications= a.map( i=> { 
                    if(i.name=='@signalk/freeboard-sk') { return null }
                    if(!i._location && !i.location) { // npm linked app
                        return {
                            name: i.name,
                            description: i.description, 
                            url: `/${i.name}`
                        }                    
                    }
                    if(typeof i._location!=='undefined') { // legacywebapps list
                        let x= i._location.indexOf('/signalk-server/');
                        return {
                            name: i.name,
                            description: i.description, 
                            url: (x==-1) ? i._location : i._location.slice(15)
                        }
                    }
                    else if(typeof i.location!=='undefined') {
                        return {
                            name: i.name,
                            description: i.description, 
                            url: i.location
                        }                        
                    }
                }).filter(e=> {return e} );

                this.list.applications.unshift({
                    name:  'None',
                    description: '', 
                    url: null
                });

                this.buildFavouritesList();
            },
            err=> { this.app.debug('ERROR retrieving AppList!') }
        );
    } 

    // ** favourites **
    buildFavouritesList() { 
        this.list.favourites= this.list.applications.slice(1); 
        let i= this.app.config.selections.pluginFavourites.indexOf(this.app.config.plugins.instruments);
        if(i!=-1) { this.app.config.selections.pluginFavourites.splice(i,1) }
    }

    applySettings() {
        this.app.debug('Saving Settings..');
        this.app.saveConfig();        
    }
    
}