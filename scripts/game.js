/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var cancelNextRequest = false,
        gameBoard = null,
        keyboard = TETRIS.input.Keyboard(),
        scoreBoard = null,
        theHog = null;

    function init() {
        console.log('Tetris initializing...');

        keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            cancelNextRequest = true;
            TETRIS.main.showScreen('menu');

        });

        gameBoard = TETRIS.graphics.GameBoard({
            pieceBackgroundImage : 'images/backgrounds/fud.jpg'
        });

        scoreBoard = TETRIS.graphics.StatScreen({
            level : 1,
            lines : 0,
            score : 0,
            topScore : 0
        });

        theHog = TETRIS.graphics.Texture({
                image : TETRIS.images['images/warthog/warthog_angle_flat.png'],
                center : { x : 700, y : 650 },
                width : 175, height : 125
        });
    }

    function gameLoop(time) {
        TETRIS.elapsedTime = time - TETRIS.lastTime;
        TETRIS.lastTime = time;

        update();
        render();

        if (!cancelNextRequest) {
            TETRIS.sessionID = requestAnimationFrame(gameLoop);
        }
    }

    function render() {
        TETRIS.graphics.clear();
        gameBoard.draw();
        scoreBoard.draw();
        theHog.draw();
    }

    function run() {
        if(TETRIS.sessionID != null) {
            cancelAnimationFrame(TETRIS.sessionID);
            TETRIS.sessionID = null;
        }

        TETRIS.menuMusic.pause();
        TETRIS.lastTime = performance.now();

        cancelNextRequest = false;
        TETRIS.sessionID = requestAnimationFrame(gameLoop);
    }

    function update() {
        keyboard.update(TETRIS.elapsedTime);
    }

    return {
        init : init,
        run : run
    };
}());