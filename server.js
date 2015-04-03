/**
 * Created by Shaun on 4/2/2015.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    scores = require('./scripts/scores'),
    app = express();


app.set('port',process.env.PORT || 3000);
app.engine('html',require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use('/style',express.static(path.join(__dirname, '/style')));
app.use('/views', express.static(__dirname + 'views'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/sounds', express.static(__dirname + '/sounds'));
app.use('/images', express.static(__dirname + '/images'));

app.get('/', function(request, response){
    response.render('index.html');
});

app.get('/v1/high-scores', scores.all);
app.post('/v1/high-scores', scores.add);

app.all('/v1/*', function(request, response){
    response.writeHead(501);
    response.end();
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express Server Listening on port ' + app.get('port'));
});