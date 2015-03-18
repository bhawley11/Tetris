/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['menu'] = (function(main) {
    'use strict';

    function init() {
        document.getElementById('menu-button-newGame').addEventListener('click', function () {
            main.showScreen('game');
        }, false);

        document.getElementById('menu-button-highScores').addEventListener('click', function () {
            main.showScreen('highScores');
        }, false);

        document.getElementById('menu-button-controls').addEventListener('click', function () {
          main.showScreen('controls');
        }, false);

        document.getElementById('menu-button-credits').addEventListener('click', function () {
            main.showScreen('credits');
        }, false);
    }

    function run() { }

    return {
        init : init,
        run : run
    };
}(TETRIS.main));