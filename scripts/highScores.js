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

    function run() {

    }

    return {
        init : init,
        run : run
    };
}());
