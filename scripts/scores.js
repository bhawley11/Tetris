/**
 * Created by Shaun on 4/2/2015.
 */
var fs = require('fs'),
    scores = [];



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
                var defaultContent = 'NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0-NORECORD/0';
                fs.appendFile('score.txt',defaultContent,function(err){
                    if(err){
                        console.log("Couldn't fill file with default content!");
                    }
                    else{
                        var highScoreArray = defaultContent.split('-');
                        for (var i = 0; i < highScoreArray.length; i++) {
                            var newRecord = highScoreArray[i].split("/");
                            scores.push({});
                            scores[i].name = newRecord[0];
                            scores[i].score = newRecord[1];
                        }
                        console.log("Filled File with default content!");
                    }
                } )
            }
        })
    }
    else{
        var highScoreArray = data.split('-');
        for (var i = 0; i < highScoreArray.length; i++) {
            var newRecord = highScoreArray[i].split("/");
            scores.push({});
            scores[i].name = newRecord[0];
            scores[i].score = newRecord[1];
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

    var i = 0,
        newName = request.query.name,
        newScore = request.query.score,
        appendString ='';

    scores.push({name : newName, score:newScore});
    sortScores();
    scores.splice(10, scores.length - 10);
    for(i; i < 10; i++){
        if(i === 0){
            appendString = scores[i].name + '/' + scores[i].score;
            fs.writeFile('score.txt', appendString, function(err){
                if(err){
                    console.log("Error Writing File!");
                }
            })
        }
        else{
            appendString = '-' + scores[i].name + '/' + scores[i].score;
            fs.appendFile('score.txt', appendString, function (err) {
                if (err) {
                    console.log("Error Writing to File!");
                }
            });
        }
    }

    response.writeHead(200);
    response.end();
};