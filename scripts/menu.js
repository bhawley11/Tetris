/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['menu'] = (function() {
    'use strict';
    var ai;

    function init() {
        document.getElementById('menu-button-newGame').addEventListener('click', function () {
            clearTimeout(ai);
            TETRIS.main.showScreen('game');
        }, false);

        document.getElementById('menu-button-highScores').addEventListener('click', function () {
            clearTimeout(ai);
            TETRIS.main.showScreen('highScores');
        }, false);

        document.getElementById('menu-button-controls').addEventListener('click', function () {
            clearTimeout(ai);
          TETRIS.main.showScreen('controls');
        }, false);

        document.getElementById('menu-button-credits').addEventListener('click', function () {
            clearTimeout(ai);
            TETRIS.main.showScreen('credits');
        }, false);
    }

    function run() {
        var menuMusic = TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt];
        TETRIS.AIRunning = false;
        menuMusic.volume = .1;
        menuMusic.currentTime = 0;
        if(menuMusic === undefined || menuMusic.paused) {
            menuMusic.addEventListener('ended', function () {
                menuMusic.currentTime = 0;
                menuMusic.play();
            }, false);
            menuMusic.play();
        }

        clearTimeout(ai);
        ai = setTimeout(function(){
                TETRIS.AIRunning = true;
                TETRIS.main.showScreen('game');
        }, 10000);

    }

    return {
        init : init,
        run : run
    };
}());