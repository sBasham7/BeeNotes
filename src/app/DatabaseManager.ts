import { Inject, Injectable } from '@angular/core';

import { WindowRef } from './WindowRef';

import * as localForage from 'localforage';

@Injectable()
export class DatabaseManager {

    private _db_scripts: {[key: string]: Array<String>; } = {
        '201712271652': [
            ( " CREATE TABLE IF NOT EXISTS BeeNotes_db_version ( "
                + " version_id INTEGER PRIMARY KEY, " 
                + " version_date NUMERIC NOT NULL); " ),
            ( " INSERT OR REPLACE into BeeNotes_db_version ("  
                + " version_date "
                + " )values(201712271652);" ),
            ( " CREATE TABLE IF NOT EXISTS BeeNotes_Notes ( "
                + " note_id INTEGER PRIMARY KEY, " 
                + " note_date NUMERIC, " 
                + " title text, " 
                + " note text, " 
                + " checked INTEGER, " 
                + " color text);" ),
            ( " CREATE TABLE IF NOT EXISTS BeeNotes_Lists ( "
                + " list_id INTEGER PRIMARY KEY, " 
                + " list_date NUMERIC, " 
                + " title text, " 
                + " color text);" ),
            ( " CREATE TABLE IF NOT EXISTS BeeNotes_List_To_Note ( "
                + " id INTEGER PRIMARY KEY, " 
                + " note_id INTEGER, " 
                + " list_id INTEGER); " )]
    };


    private _db_debug_scripts: {[key: string]: Array<String>; } = {
        'notes-1': [
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'LOREM\',\'VESTIBULUM\',\'0\',\'#FF0000\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'IPSUM\',\'MAURIS\',\'0\',\'#FF0000\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'HABITANT\',\'NUNC\',\'0\',\'#FF6600\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'DONEC\',\'VULPUTATE\',\'0\',\'#FF6600\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'LOREM\',\'LOBORTIS\',\'0\',\'#FFEE00\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'IPSUM\',\'MOLLIS\',\'0\',\'#FFEE00\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'HABITANT\',\'VESTIBULUM\',\'0\',\'#00FF00\')',
            'insert into BeeNotes_Lists (list_date, title, color) VALUES (?, \'LOREM-LIST\', \'#9900FF\')'
        ],
        'notes-2': [
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'DONEC\',\'MAURIS\',\'0\',\'#00FF00\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'LOREM\',\'NUNC\',\'0\',\'#00FF00\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'IPSUM\',\'VULPUTATE\',\'\',\'#0099FF\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'HABITANT\',\'MOLLIS\',\'0\',\'#0099FF\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'DONEC\',\'VESTIBULUM\',\'0\',\'#4400FF\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'LOREM\',\'MAURIS\',\'0\',\'#4400FF\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'IPSUM\',\'NUNC\',\'0\',\'#9900FF\')',
            'insert into BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?, \'HABITANT\',\'VULPUTATE\',\'0\',\'#9900FF\')',
            'insert into BeeNotes_Lists (list_date, title, color) VALUES (?, \'IPSUM-LIST\', \'#4400FF\')'
        ]
    };

    private _db: any;

    public init() {

        for(let key in this._db_scripts) {
            for(let index in this._db_scripts[key]){
                this.run(this._db_scripts[key][index], []);
            }
        }

        if (this.windowRef.nativeWindow.cordova.platformId === 'browser') {
            const tmpTime = new Date();
    
            tmpTime.setHours(0);
            tmpTime.setMinutes(0);
            tmpTime.setSeconds(0);
            tmpTime.setMilliseconds(0);

            for(let key in this._db_debug_scripts) {
                tmpTime.setDate(tmpTime.getDate() + 1);
                for(let index in this._db_debug_scripts[key]){
                    this.run(this._db_debug_scripts[key][index], [tmpTime.getTime()]);
                }
            }
        }
        

    }

    public webExport() {
        const arraybuff: Uint8Array = this._db.export();

        const tmpBlob: Blob = new Blob([arraybuff]);

        return tmpBlob;
    }

    public run(sql: String, parameters: any) {

        const results: Array<Object> = new Array<Object>();

        if (this.windowRef.nativeWindow.cordova.platformId !== 'browser'
                && this.windowRef.nativeWindow.sqlitePlugin !== undefined) {

            const tmpResults = this._db.executeSql(sql, parameters);

            for (let tmp in tmpResults.rows) {
                results.push(tmpResults.rows[tmp]);
            }

        } else {

            const stmt = this._db.prepare(sql);
    
            stmt.bind(parameters);
            while (stmt.step()) { //
                results.push(stmt.getAsObject());
            }
        }

        return results;
    }

    constructor(@Inject(WindowRef) private windowRef) {

        if (this.windowRef.nativeWindow.cordova.platformId !== 'browser'
            && this.windowRef.nativeWindow.sqlitePlugin !== undefined) {

            this._db = new windowRef.nativeWindow.sqlitePlugin.openDatabase({
                name: 'BeeNotes.db',
                location: 'default',
                androidDatabaseImplementation: 2,
                androidLockWorkaround: 1
            });

        } else {

            this._db = new this.windowRef.nativeWindow.SQL.Database(localForage.getItem('BeeNotes.db'));
        
        }

        this.init();
        
    }

}
