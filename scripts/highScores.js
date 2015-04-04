/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['highScores'] = (function() {
    'use strict';

    function init() {
        document.getElementById('highScores-back').addEventListener('click', function () {
            TETRIS.main.showScreen('menu');
        }, false);
    }

    function showScores(){
        $.ajax({
            url: 'http://localhost:3000/v1/high-scores',
            cache : false,
            type: 'GET',
            error: function() {alert('GET failed');},
            success: function(data){
                var list = $('#highScores-list'),
                    value,
                    text;

                list.empty();
                for(value = 0; value < 5; value++){
                    text = (data[value].name + ' : ' + data[value].score);
                    list.append($('<li>', {text:text}));
                }
            }
        });
    }

    function addScore(name, newScore) {
        $.ajax({
            url: 'http://localhost:3000/v1/high-scores?name=' + name + '&score=' + newScore,
            type: 'POST',
            error: function() { alert('POST failed'); },
            success: function() {
                console.log("Added Score Successfully!");
            }
        });
    }

    function run() {
        showScores();
    }

    return {
        addScore : addScore,
        init : init,
        run : run
    };
}());
