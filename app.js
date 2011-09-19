
/**
 * Module dependencies.
 */

var express = require('express'),
    cradle = require('cradle');

var app = module.exports = express.createServer();

var conn = new cradle.Connection();
var db = conn.database('jobs');

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'your secret here' }));
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index', {
        title: 'Express'
    });
});

app.get('/jobs', function(req, res){
    db.view('jobs/all', function(error, result) {
        var docs = [];
        result.forEach(function(row) {
            docs.push(row);
        });
        res.render('jobs', {
            title: 'Jobs',
            jobs: docs
        });
    });
});

app.get('/job/new', function(req, res){
    res.render('job_new', {
        title: 'New job'
    });
});

app.post('/job/new', function(req, res) {
    db.save({
        type: 'job',
        name: req.param('name'),
        description: req.param('description')
    }, function(error, docs) {
        res.redirect('/jobs');
    });
});

app.get('/job/:id', function(req, res){
    db.get(req.params.id, function(error, job) {

        db.view('tasks/by_job', {key: req.params.id}, function(error, result) {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            res.render('job', {
                title: 'Job',
                tasks: docs,
                job: job
            });
        });
    });
});

app.get('/job/:id/task', function(req, res){
    db.view('tasks/by_job', {key: req.params.id}, function(error, result) {
        var docs = [];
        result.forEach(function(row) {
            docs.push(row);
        });
        res.render('tasks', {
            title: 'Tasks',
            tasks: docs
        });
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
