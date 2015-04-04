/**
 * Created by Shaun on 4/2/2015.
 */
var fs = require('fs'),
    scores = [],
    nextId = 0;

fs.readFile('score.txt', 'utf8', function(err, data){
    if(err){
        console.log("Error reading from file!");
        fs.writeFile('score.txt','',function(err){
            console.log("Attempting to create File!");
            if(err){
                console.log("Couldn't create file!");
            }
            else{
                console.log("File create successfully!");
            }
        })
    }
    else{
        var highScoreArray = data.split('-');
        for(var i = 0; i < highScoreArray.length; i++){
            var newScore = highScoreArray[i].split("/");
            scores.push({});
            scores[i].name = newScore[0];
            scores[i].score = newScore[1];
        }
    }
});

function sortScores(){
    scores.sort(function(a,b){
        return b.score - a.score;
    });
}

exports.all = function(request, response){
    sortScores();
    console.log('find all scores called');
    response.writeHead(200, {'content-type': 'application/json'});
    response.end(JSON.stringify(scores));
};

exports.add = function(request, response) {
    console.log('add new score called');
    console.log('Name: ' + request.query.name);
    console.log('Score: ' + request.query.score);

    var newName = request.query.name,
        newScore = request.query.score,
        appendString = '-' + newName + '/' + newScore;

        fs.appendFile('score.txt', appendString, function (err) {
            if (err) {
                console.log("Error Writing to File!");
            }
        });


    var now = new Date();
    scores.push( {
        id : nextId,
        name : newName,
        score : newScore,
        date : now.toLocaleDateString(),
        time : now.toLocaleTimeString()
    });
    nextId++;

    response.writeHead(200);
    response.end();
};