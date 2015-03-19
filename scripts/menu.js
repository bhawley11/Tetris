/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['menu'] = (function() {
    'use strict';

    function init() {
        document.getElementById('menu-button-newGame').addEventListener('click', function () {
            TETRIS.main.showScreen('game');
        }, false);

        document.getElementById('menu-button-highScores').addEventListener('click', function () {
            TETRIS.main.showScreen('highScores');
        }, false);

        document.getElementById('menu-button-controls').addEventListener('click', function () {
          TETRIS.main.showScreen('controls');
        }, false);

        document.getElementById('menu-button-credits').addEventListener('click', function () {
            TETRIS.main.showScreen('credits');
        }, false);
    }

    function run() {
        TETRIS.menuMusic = new Audio('/Tetris/sounds/music/title_theme.mp3');
        TETRIS.menuMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        TETRIS.menuMusic.play();
    }

    return {
        init : init,
        run : run
    };
}());