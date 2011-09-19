express = require('express')
cradle = require('cradle')

app = module.exports = express.createServer()

conn = new cradle.Connection()
db = conn.database('jobs')

# Configuration

app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.bodyParser()
app.use express.methodOverride()
app.use express.cookieParser()
app.use express.session({ secret: 'your secret here' })
app.use app.router
app.use express.static(__dirname + '/public')

app.configure 'development', ->
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', ->
    app.use express.errorHandler()

# Routes
app.get '/', (req, res) ->
    res.render 'index', { title: 'Express' }

app.get '/jobs', (req, res) ->
    db.view 'jobs/all', (error, result) ->
        docs = []
        result.forEach (row) ->
            docs.push row
        res.render 'jobs', {
            title: 'Jobs',
            jobs: docs
        }

app.get '/job/new', (req, res) ->
    res.render 'job_new', {
        title: 'New job'
    }

app.post '/job/new', (req, res) ->
    db.save {
        type: 'job',
        name: req.param('name'),
        description: req.param('description')
    }, (error, docs) ->
        res.redirect '/jobs'

app.get '/job/:id', (req, res) ->
    db.get req.params.id, (error, job) ->
        db.view 'tasks/by_job', {key: req.params.id}, (error, result) ->
            docs = []
            result.forEach (row) ->
                docs.push row
            res.render 'job', {
                title: 'Job',
                tasks: docs,
                job: job
            }

app.listen 3000
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
