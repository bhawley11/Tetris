/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var gameBoard = null,
        keyboard = TETRIS.input.Keyboard();

    function init() {
        console.log('Tetris initializing...');

        keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            TETRIS.main.showScreen('menu');
        });

        gameBoard = TETRIS.graphics.GameBoard();
    }

    function gameLoop(time) {
        TETRIS.elapsedTime = time - TETRIS.lastTime;
        TETRIS.lastTime = time;

        update();
        render();

        TETRIS.sessionID = requestAnimationFrame(gameLoop);
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
        TETRIS.sessionID = requestAnimationFrame(gameLoop);
    }

    function update() {

    }

    return {
        init : init,
        run : run
    };
}());