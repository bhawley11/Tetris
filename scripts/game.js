/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var gameBoard = null;

    function init() {
        console.log('Tetris initializing...');

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
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

    function rotateLeft(){
        console.log("Rotating Left");
    }

    function rotateRight(){
        console.log("Rotating Right");
    }

    function moveLeft(){
        console.log("Moving Left");
    }

    function moveRight(){
        console.log("Moving Right");
    }

    function hardDrop(){
        console.log("Hard Dropping");
    }

    function softDrop(){
        console.log("Soft Dropping");
    }

    return {
        moveLeft : moveLeft,
        moveRight : moveRight,
        softDrop : softDrop,
        hardDrop : hardDrop,
        rotateLeft : rotateLeft,
        rotateRight : rotateRight,
        init : init,
        run : run
    };
}());