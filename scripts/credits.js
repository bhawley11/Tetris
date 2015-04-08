/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['credits'] = (function() {
    'use strict';
    var gameMusic = TETRIS.sounds['sounds/music/unwearied_heart.' + TETRIS.audioExt];

    function init() {
        document.getElementById('credits-back').addEventListener('click', function () {
            TETRIS.sounds['sounds/music/unwearied_heart.' + TETRIS.audioExt].pause();
            TETRIS.main.showScreen('menu');
        }, false);
    }

    function run() {

        TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();

        gameMusic.currentTime = 0;
        gameMusic.volume = .05;
        if(gameMusic === undefined || gameMusic.paused) {
            gameMusic.addEventListener('ended', function () {
                gameMusic.currentTime = 0;
                gameMusic.play();
            }, false);
            gameMusic.play();
        }
    }

    return {
        init : init,
        run : run
    };
}());
