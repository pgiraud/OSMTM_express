An attempt to do the same as in OSMTM but using javascript (nodejs, expressjs,
couchdb) instead of python (pyramid, imposm).

Installation
------------

Install node.

Install some node modules

    npm install express
    npm install jade
    npm install cradle

Install couchdb by following instructions.

Create the database and some data
    
    node setup.js

The above may need to be launch several times.

Launch application
    
    node app.js

Or

    npm install -g supervisor
    supervisor -p app.js

