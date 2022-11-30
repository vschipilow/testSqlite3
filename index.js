
"use strict";

const http = require('http');
const url = require('url');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const systemPort = process.env['WEB_APP_PORT'] ?? 8081;

console.log(systemPort);

http.createServer( (req, res) => {
    let result = [`
	<!DOCTYPE html>
	<html>
	    <head>
    	    	<meta name="viewport" content="width=device-width, initial-scale=1.0" charset="UTF-8">
	    	<title>Test Sqlite 3</title>
	    </head>
	    <body>
    		<table>
	
    `];
    let db = new sqlite3.Database('TestBikes.db');
    db.serialize( () => {
        db.each('SELECT BikeName FROM BikeList', (err, row) => {
            if (err) {
		console.log(err);
		res.end(`${result[0]}<tr><td>${err}</td></tr></table></body></html>`);
	    } else {
                result.push(`<tr><td>${row.BikeName}</td></tr>`);
	    }
        });
    });
    db.close ( (err) => {
        if (err) {
	    console.log(err);
	    res.end(`${result[0]}<tr><td>${err}</td></tr></table></body></html>`);
	} else {
	    result.push('</table></body></html>');
            res.end(result.join(''));
	    console.log('finished ok');
	}
    });
}).listen(systemPort);

