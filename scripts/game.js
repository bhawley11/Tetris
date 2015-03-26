/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var cancelNextRequest = false,
        gameBoard = null,
        scoreBoard = null,
        theHog = null,
        ticTime = 0,
        shapeHistory = [],
        listOfShapes = ['B','LL','RL','LZ','RZ','T','I'];

    function init() {
        console.log('Tetris initializing...');

        TETRIS.grid = TETRIS.objects.Grid();
        TETRIS.grid.init();
        TETRIS.currentShape = null;
        TETRIS.nextShape = null;

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
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
        ticTime += TETRIS.elapsedTime;
        if(ticTime/1000 > .75) {
            if(TETRIS.currentShape.fall()){
            }
            else{
                TETRIS.currentShape = TETRIS.nextShape;
                if (TETRIS.currentShape.canSpawn()) {
                    TETRIS.currentShape.spawn();
                }
                TETRIS.nextShape = TETRIS.objects.Shape(nextShape());
            }
            ticTime= 0;
        }
            update();
            render();

        TETRIS.particleSystem.update(TETRIS.elapsedTime);
        if (!cancelNextRequest) {
            TETRIS.sessionID = requestAnimationFrame(gameLoop);
        }
    }

    function render() {
        TETRIS.graphics.clear();
        gameBoard.draw();
        scoreBoard.draw();
        theHog.draw();
        TETRIS.grid.draw();
    }

    function nextShape(){
        var i = 0,
            randomChoice = listOfShapes[Math.floor(Math.random()*listOfShapes.length)];

            for(i; i<6;i++){
                if(inHistory(randomChoice)){
                    randomChoice = listOfShapes[Math.floor(Math.random()*listOfShapes.length)];
                }
                else{
                    shapeHistory.splice(0,1);
                    shapeHistory.push(randomChoice);
                    return randomChoice;
                }
            }
        shapeHistory.splice(0,1);
        shapeHistory.push(randomChoice);
        return randomChoice;
    }

    function inHistory(shape){
        var i = 0;
        for(i; i < shapeHistory.length; i++){
            if(shape === shapeHistory[i]){
                return true;
            }
        }
        return false;
    }

    function run() {
        if(TETRIS.sessionID != null) {
            cancelAnimationFrame(TETRIS.sessionID);
            TETRIS.sessionID = null;
        }

        for(var i = 0; i < 4; i++)
        {
            shapeHistory.push('LZ');
        }

        TETRIS.currentShape = TETRIS.objects.Shape(nextShape());
        if(TETRIS.currentShape.canSpawn()) {
            TETRIS.currentShape.spawn();
        }
        TETRIS.nextShape = TETRIS.objects.Shape(nextShape());

        TETRIS.menuMusic.pause();
        TETRIS.lastTime = performance.now();

        cancelNextRequest = false;
        TETRIS.sessionID = requestAnimationFrame(gameLoop);
    }

    function update() {
        TETRIS.keyboard.update(TETRIS.elapsedTime);
    }

    function rotateLeft(){
        console.log("Rotating Left");
        TETRIS.currentShape.rotate('l');
    }

    function rotateRight(){
        console.log("Rotating Right");
        TETRIS.currentShape.rotate('r');
    }

    function moveLeft(){
        console.log("Moving Left");
        TETRIS.currentShape.moveLeft();
    }

    function moveRight(){
        console.log("Moving Right");
        TETRIS.currentShape.moveRight();
    }

    function hardDrop(){
        console.log("Hard Dropping");
        TETRIS.currentShape.hardDrop();
    }

    function softDrop(){
        console.log("Soft Dropping");
        TETRIS.currentShape.fall();
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