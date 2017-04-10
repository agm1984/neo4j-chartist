'use strict';

//const Path = require('path');
import moduleTest from './test';

async function getTimestamp () {
  var value = await Promise
    .resolve(1)
    .then(x => x * 3)
    .then(x => x + 5)
    .then(x => x / 2);
  return value;
}
getTimestamp().then(x => console.log(`x: ${x}`));


const runTimestamp = new Promise((resolve, reject) => {
    try {
        const currentTime = new Date().getTime();
        if (currentTime) {
            Promise.resolve(currentTime);
            console.log("Timestamp: " + runTimestamp);
        }
    } catch(err) {
        Promise.reject(err);
  }
});

moduleTest('Babel');

import _ from 'lodash';
const Hapi = require('hapi');
const Hoek = require('hoek');
// Load Neo4j DB Driver
const neo4j = require('neo4j-driver').v1;

const server = new Hapi.Server();
server.connection({port: 3000, host: 'localhost'});

// Vision controls view templates and handlebars is the templating engine
server.register([require('vision'), require('inert')], (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        // Use templates folder for view templates
        relativeTo: __dirname,
        path: './templates'
    });

    server.route({
        method: 'GET',
        path: '/public/layout.css',
        handler: function (request, reply) {
            // reply.file() expects the file path as parameter
            reply.file('./public/layout.css')
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.view('index');
        }
    });
});

server.start();


// Connect to Neo4j DB
//new config();
//config.db = "bolt://35.165.107.226";
//var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "d1c4b9f0f6d88eddfdc028d97105d8fa6eddf322db5fa628c1c08c5b8c7e8b03"));
var driver = neo4j.driver("bolt://35.165.107.226", neo4j.auth.basic("neo4j", "enthusiastsneodev"));

driver.onCompleted = function() {
    // proceed with using the driver, it was successfully instantiated
};

driver.onError = function(error) {
    console.log('Driver instantiation failed', error);
};

var session = driver.session();

// Enthusiast query
session.run("MATCH (n:Enthusiast{ family_name: {family_name} }) RETURN n AS Enthusiast", { family_name: 'Mackintosh' }).then(result => {
    result.records.forEach((record, count) => {
        //console.log(JSON.stringify(record, null, 3));
        console.log("------------------------------------------");
        console.log("User ID: " + record._fields[0].identity.low);
        console.log("First Name: " + record._fields[0].properties.given_name);
        console.log("Last Name: " + record._fields[0].properties.family_name);
        console.log("Email: " + record._fields[0].properties.email);
        console.log("Username: " + record._fields[0].properties.username);
        console.log("------------------------------------------");
    });
    session.close();
}).catch(error => {
    console.log(error);
});

// Relationships query
session.run("MATCH (a:Enthusiast)-[]-(b:City) RETURN a,b AS Cities").then(result => {
    result.records.forEach((record, count) => {
        console.log(JSON.stringify(record, null, 3));

    });
    session.close();
}).catch(error => {
    console.log(error);
});

// Bonus script (need to install 'fs')
//const packageJSON = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
//console.log(packageJSON.version);
