/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var cancelNextRequest = false,
        gameBoard = null,
        keyboard = TETRIS.input.Keyboard();

    function init() {
        console.log('Tetris initializing...');

        keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            cancelNextRequest = true;
            TETRIS.main.showScreen('menu');

        });

        gameBoard = TETRIS.graphics.GameBoard({
            pieceBackgroundImage : 'images/backgrounds/fud.jpg'
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
        gameBoard.draw();
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