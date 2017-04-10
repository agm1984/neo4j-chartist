'use strict';

//const Path = require('path');
import test from './test';
test('Babel is working!');

//import _ from 'lodash';
const Hapi = require('hapi');
const Hoek = require('hoek');
// Load Neo4j DB Driver
const neo4j = require('neo4j-driver').v1;

const server = new Hapi.Server();
server.connection({port: 3000, host: 'localhost'});

// Vision controls view templates and handlebars is the templating engine
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        // Use templates folder for view templates
        path: 'templates'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

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

// Run a Cypher statement, reading the result in a streaming manner as records arrive:
session.run("MATCH (n:Enthusiast{ email: {email} }) RETURN n AS Enthusiast", { email: 'adam.mackintosh@enthusiasts.com' })
//.run("MERGE (alice:Person {name : {nameParam} }) RETURN alice.name", { nameParam:'Alice' })
    .subscribe({
    onNext: function(record) {
        //console.log(record._fields);
        const foundNode = JSON.stringify(record.get('Enthusiast'));
        console.log("Found Enthusiast: " + foundNode);
        console.log("Postal Code: " + foundNode['postal_code']);
        Object.entries(foundNode).forEach(
            ([key, value]) => console.log(key, value)
        );
    },
    onCompleted: function() {
        console.log("Done.");
        session.close();
        driver.close();
    },
    onError: function(error) {
        console.log(error);
        driver.close();
    }
});
