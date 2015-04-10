/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['menu'] = (function() {
    'use strict';

    function init() {
        document.getElementById('menu-button-newGame').addEventListener('click', function () {
            TETRIS.AIRunning = true;
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
        var menuMusic = TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt];
        menuMusic.volume = .1;
        menuMusic.currentTime = 0;
        if(menuMusic === undefined || menuMusic.paused) {
            menuMusic.addEventListener('ended', function () {
                menuMusic.currentTime = 0;
                menuMusic.play();
            }, false);
            menuMusic.play();
        }
    }

    return {
        init : init,
        run : run
    };
}());