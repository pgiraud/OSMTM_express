// In this file we setup the database
// Usage: node setup.js

//require('./job')
//var job = new Job();
//job.findAll(function(error, docs) {
    //console.log(docs);
//});
//job.save([{
    //name: 'A job', 
    //type: 'job'
//}], function() {
//});
var cradle = require('cradle'),
    sys = require('sys');

var conn = new cradle.Connection();
var db = conn.database('jobs');
db.exists(function(err, exists) {
    if (err) {
        consol.log('error', err);
    } else if (exists) {
    } else {
        db.create();
    }
});

sys.puts('Database Created');

var id;
db.save({name: 'My first job', type: 'job'}, function(err, res) {
    if (err) {
        console.log(err);
    } else {
        sys.puts(res);
        id = res.id;
        sys.puts('job created');
        db.save({name: 'My first task', type: 'task', job_id: id}, function(err, res) {
            sys.puts(res);
            sys.puts('task created');
        });
        db.save({name: 'My second task', type: 'task', job_id: id}, function(err, res) {
            sys.puts(res);
            sys.puts('task created');
        });
        db.save({name: 'My task something', type: 'task', job_id: "something"}, function(err, res) {
            sys.puts(res);
            sys.puts('task created');
        });
    }
});

// views
db.save('_design/jobs', {
    all: {
        map: function(doc) {
            if (doc.type && doc.type == 'job') {
                emit(null, doc);
            }
        }
    }
});

db.save('_design/tasks', {
    by_job: {
        map: function(doc) {
            if (doc.type && doc.type == 'task') {
                emit(doc.job_id, doc);
            }
        }
    }
});
