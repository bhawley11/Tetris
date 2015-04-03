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
        listOfShapes = ['B','LL','RL','LZ','RZ','T','I'],
        gameOver = false;

    function init() {
        console.log('Tetris initializing...');

        TETRIS.grid = TETRIS.objects.Grid();
        TETRIS.grid.init();
        TETRIS.currentShape = null;
        TETRIS.nextShape = null;
        TETRIS.nextShapeImage = null;

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            TETRIS.onGameScreen = false;
            if(TETRIS.grid != null){
                TETRIS.grid.clearGrid();
            }
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

        update();
        render();

        TETRIS.particleSystem.update(TETRIS.elapsedTime);
        if (!cancelNextRequest) {
            TETRIS.sessionID = requestAnimationFrame(gameLoop);
        }
    }

    function getNextShapeDetails(shape) {
        switch(shape) {
            case 'B':
                return {
                    image : TETRIS.images['images/shapes/BShape.png'],
                    center : { x : 700, y : 200 },
                    width : 70, height : 70
                };
            case 'LL':
                return {
                    image : TETRIS.images['images/shapes/LLShape.png'],
                    center : { x : 700, y : 200 },
                    width : 105, height : 70
                };
            case 'RL':
                return {
                    image : TETRIS.images['images/shapes/RLShape.png'],
                    center : { x : 700, y : 200 },
                    width : 105, height : 70
                };
            case 'LZ':
                return {
                    image : TETRIS.images['images/shapes/LZShape.png'],
                    center : { x : 700, y : 200 },
                    width : 105, height : 70
                };
            case 'RZ':
                return {
                    image : TETRIS.images['images/shapes/RZShape.png'],
                    center : { x : 700, y : 200 },
                    width : 105, height : 70
                };
            case 'T':
                return {
                    image : TETRIS.images['images/shapes/TShape.png'],
                    center : { x : 700, y : 200 },
                    width : 105, height : 70
                };
            case 'I':
                return {
                    image : TETRIS.images['images/shapes/IShape.png'],
                    center : { x : 700, y : 200 },
                    width : 140, height : 35
                };
        }
    }

    function render() {
        TETRIS.graphics.clear();
        gameBoard.draw();
        scoreBoard.draw();
        theHog.draw();
        TETRIS.grid.draw();
        if (TETRIS.nextShapeImage !== null) {
            TETRIS.nextShapeImage.draw();
        }
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
        var abbrevForNextShape,
            nextShapeSpec;

        gameOver = false;
        TETRIS.onGameScreen = true;
        cancelNextRequest = false;

        TETRIS.menuMusic.pause();
        TETRIS.lastTime = performance.now();

        TETRIS.keyboard.clearKeyboardState();

        if(TETRIS.sessionID != null) {
            cancelAnimationFrame(TETRIS.sessionID);
            TETRIS.sessionID = null;
        }

        for(var i = 0; i < 4; i++) {
            shapeHistory.push('LZ');
        }

        TETRIS.currentShape = TETRIS.objects.Shape(nextShape());

        if(TETRIS.currentShape.canSpawn()) {
            TETRIS.currentShape.spawn();
        }

        abbrevForNextShape = nextShape();
        TETRIS.nextShape = TETRIS.objects.Shape(abbrevForNextShape);

        nextShapeSpec = getNextShapeDetails(abbrevForNextShape);
        TETRIS.nextShapeImage = TETRIS.graphics.Texture({
            image : nextShapeSpec.image,
            center : { x : nextShapeSpec.center.x, y : nextShapeSpec.center.y },
            width : nextShapeSpec.width, height : nextShapeSpec.height
        });

        TETRIS.sessionID = requestAnimationFrame(gameLoop);
    }

    function update() {
        var abbrevForNextShape,
            nextShapeSpec;

        if(gameOver){

        }
        else{
            if(ticTime/1000 > .75) {
                if(!TETRIS.currentShape.fall()){            // Goes in when shape is locked in place
                    TETRIS.grid.checkForFullRows();

                    TETRIS.currentShape = TETRIS.nextShape;

                    if (TETRIS.currentShape.canSpawn()) {
                        TETRIS.currentShape.spawn();
                    }
                    else{
                        gameOver = true;
                    }

                    abbrevForNextShape = nextShape();
                    TETRIS.nextShape = TETRIS.objects.Shape(abbrevForNextShape);
                    nextShapeSpec = getNextShapeDetails(abbrevForNextShape);

                    TETRIS.nextShapeImage = TETRIS.graphics.Texture({
                        image : nextShapeSpec.image,
                        center : { x : nextShapeSpec.center.x, y : nextShapeSpec.center.y },
                        width : nextShapeSpec.width, height : nextShapeSpec.height
                    });
                }
                ticTime= 0;
            }

            TETRIS.keyboard.update(TETRIS.elapsedTime);
        }

    }

    function rotateLeft(){
        TETRIS.currentShape.rotate('l');
    }

    function rotateRight(){
        TETRIS.currentShape.rotate('r');
    }

    function moveLeft(){
        TETRIS.currentShape.moveLeft();
    }

    function moveRight(){
        TETRIS.currentShape.moveRight();
    }

    function hardDrop(){
        TETRIS.currentShape.hardDrop();
    }

    function softDrop(){
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