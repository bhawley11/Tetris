/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var cancelNextRequest = false,
        gameOver = false,

        currentShape = null,
        shapeOnDeckImage = null,
        gameBoard = null,

        playScreen = null,
        scoreBoard = null,
        theHog = null,

        ticTime = 0,
        shapeHistory = [],
        listOfShapes = ['B','LL','RL','LZ','RZ','T','I'],
        abbrevForNextShape = '',
    
        score = 0,
        topScore,
        level,
        multiplier,
        pointsForOneLine,
        pointsForTwoLines,
        pointsForThreeLines,
        pointsForFourLines,
        speed,
        linesCleared,
        linesToNextDiff = 0,
        particleStartIndexes = [];


    function beginGameMusic() {
        var gameMusic = TETRIS.sounds['sounds/music/ascendancy_remix.' + TETRIS.audioExt];
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


    function init() {
        console.log('Tetris initializing...');

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            TETRIS.onGameScreen = false;
            if(TETRIS.grid != null){
                TETRIS.grid.clearGrid();
            }
            cancelNextRequest = true;
            TETRIS.sounds['sounds/music/ascendancy_remix.' + TETRIS.audioExt].pause();
            TETRIS.main.showScreen('menu');
        });

        playScreen = TETRIS.graphics.GameBoard({
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
        playScreen.draw();
        scoreBoard.draw();
        theHog.draw();

        TETRIS.graphics.drawGrid(gameBoard.getGrid());

        if (shapeOnDeckImage !== null) {
            shapeOnDeckImage.draw();
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


    function playRowDeleteVoiceEffect(numDeleted) {
        var voice = null;

        switch(numDeleted) {
            case 2:
                voice = TETRIS.sounds['sounds/voice/double_kill.' + TETRIS.audioExt];
                break;
            case 3:
                voice = TETRIS.sounds['sounds/voice/triple_kill.' + TETRIS.audioExt];
                break;
            case 4:
                voice = TETRIS.sounds['sounds/voice/overkill.' + TETRIS.audioExt];
                break;
            case 5:
                voice = TETRIS.sounds['sounds/voice/killtacular.' + TETRIS.audioExt];
                break;
            case 6:
                voice = TETRIS.sounds['sounds/voice/killtrocity.' + TETRIS.audioExt];
                break;
            case 7:
                voice = TETRIS.sounds['sounds/voice/killimanjaro.' + TETRIS.audioExt];
                break;
            case 8:
                voice = TETRIS.sounds['sounds/voice/killtastrophe.' + TETRIS.audioExt];
                break;
            case 9:
                voice = TETRIS.sounds['sounds/voice/killpocalypse.' + TETRIS.audioExt];
                break;
            case 10:
                voice = TETRIS.sounds['sounds/voice/killionaire.' + TETRIS.audioExt];
                break;
        }

        if(voice !== null) {
            voice.currentTime = 0;
            voice.play();
        }
    };


    function run() {
        var nextShapeSpec;

        multiplier = 1;
        score = 0;
        level = 1;
        pointsForOneLine = 40;
        pointsForTwoLines = 100;
        pointsForThreeLines = 300;
        pointsForFourLines = 1200;
        speed = .75;
        linesCleared = 0;
        particleStartIndexes.length = 0;
        gameOver = false;
        TETRIS.onGameScreen = true;
        cancelNextRequest = false;

        TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();

        TETRIS.lastTime = performance.now();

        TETRIS.keyboard.clearKeyboardState();

        beginGameMusic();

        if(TETRIS.sessionID != null) {
            cancelAnimationFrame(TETRIS.sessionID);
            TETRIS.sessionID = null;
        }

        for(var i = 0; i < 4; i++) {
            shapeHistory.push('LZ');
        }

        $.ajax({
            url: 'http://localhost:3000/v1/high-scores',
            cache : false,
            type: 'GET',
            error: function() {alert('GET failed');},
            success: function(data){
                topScore = data[0].score;
            }
        });

        gameBoard = TETRIS.objects.GameBoard();
        gameBoard.createGameBoard();

        currentShape =  TETRIS.objects.Shape();
        currentShape.createShape(nextShape());
        currentShape.spawn(gameBoard);

        abbrevForNextShape = nextShape();

        nextShapeSpec = getNextShapeDetails(abbrevForNextShape);
        shapeOnDeckImage = TETRIS.graphics.Texture({
            image : nextShapeSpec.image,
            center : { x : nextShapeSpec.center.x, y : nextShapeSpec.center.y },
            width : nextShapeSpec.width, height : nextShapeSpec.height
        });

        TETRIS.sessionID = requestAnimationFrame(gameLoop);
    }


    function update() {
        var linesDeletedThisUpdate = 0,
            nextShapeSpec,
            soundEffect = TETRIS.sounds['sounds/effects/boltshot_shot.' + TETRIS.audioExt];

        if(gameOver){
            var name = prompt("Please enter your name", "Chief");

            if(name === ''){
                name = 'Unknown';
            }
            TETRIS.screens['highScores'].addScore(name, score);
            TETRIS.onGameScreen = false;

            TETRIS.sounds['sounds/music/ascendancy_remix.' + TETRIS.audioExt].pause();
            cancelNextRequest = true;
            TETRIS.main.showScreen('menu');
        }
        else{
            if(ticTime/1000 > speed) {
                if (!currentShape.softDrop(gameBoard)) {
                    particleStartIndexes = 0;

                   do {
                        particleStartIndexes = gameBoard.checkForCompleteLines();
                        beginEffect(particleStartIndexes,gameBoard);
                        gameBoard.deleteLines(particleStartIndexes, gameBoard);
                        gameBoard.fillIn(gameBoard);

                       if(particleStartIndexes.length != 0){
                           if(particleStartIndexes.length === 1){
                               score += multiplier * pointsForOneLine;
                           }
                           else if(particleStartIndexes.length === 2){
                               score += multiplier * pointsForTwoLines;
                           }
                           else if(particleStartIndexes.length === 3){
                               score += multiplier * pointsForThreeLines;
                           }
                           else{
                               score += multiplier * pointsForFourLines;
                           }
                       }

                       linesDeletedThisUpdate += particleStartIndexes.length;
                       linesCleared += particleStartIndexes.length;
                       linesToNextDiff += particleStartIndexes.length;

                    } while(particleStartIndexes.length > 0);

                    if(linesDeletedThisUpdate === 0) {
                        soundEffect.play();
                    } else {
                        console.log(linesDeletedThisUpdate);
                        playRowDeleteVoiceEffect(linesDeletedThisUpdate);
                    }

                    if(linesToNextDiff >= 10){
                        speed = speed - .10;
                        multiplier += 1;
                        level += 1;
                        if(speed < 0){
                            speed = .10;
                        }
                        linesToNextDiff = 0;
                    }

                    currentShape = TETRIS.objects.Shape();
                    currentShape.createShape(abbrevForNextShape);

                    if(currentShape.checkSpawnLocation(gameBoard)) {
                        currentShape.spawn(gameBoard);

                        // Next Shape
                        abbrevForNextShape = nextShape();
                        nextShapeSpec = getNextShapeDetails(abbrevForNextShape);

                        shapeOnDeckImage = TETRIS.graphics.Texture({
                            image: nextShapeSpec.image,
                            center: {x: nextShapeSpec.center.x, y: nextShapeSpec.center.y},
                            width: nextShapeSpec.width, height: nextShapeSpec.height
                        });
                    } else {
                        gameOver = true;
                    }
                }
                score++;
                particleStartIndexes.length = 0;
                ticTime = 0;
            }
            TETRIS.keyboard.update(TETRIS.elapsedTime);
        }
        updateScoreBoard();
    }

    function updateScoreBoard(){
        scoreBoard.setLevel(level);
        scoreBoard.setScore(score);
        scoreBoard.setLines(linesCleared);
        scoreBoard.setTopScore(topScore);
    }


    function rotateLeft(){
        var soundEffect = TETRIS.sounds['sounds/effects/magnum_scope_out.' + TETRIS.audioExt];
        if(currentShape.rotate(gameBoard, 'l')){
            soundEffect.currentTime = 0;
            soundEffect.play();
        }
    }

    function rotateRight(){
        var soundEffect = TETRIS.sounds['sounds/effects/magnum_scope_in.' + TETRIS.audioExt];
        if(currentShape.rotate(gameBoard, 'r')){
            soundEffect.currentTime = 0;
            soundEffect.play();
        }
    }

    function moveLeft(){
        var soundEffect = TETRIS.sounds['sounds/effects/br_scope_out.' + TETRIS.audioExt];
        if(currentShape.moveLeft(gameBoard)) {
            soundEffect.currentTime = 0;
            soundEffect.play();
        }
    }

    function moveRight(){
        var soundEffect = TETRIS.sounds['sounds/effects/br_scope_in.' + TETRIS.audioExt];
        if(currentShape.moveRight(gameBoard)) {
            soundEffect.currentTime = 0;
            soundEffect.play();
        }
    }

    function hardDrop(){
        score += currentShape.hardDrop(gameBoard);
        ticTime = speed * 1000 + 1;
    }

    function softDrop(){
        var soundEffect = TETRIS.sounds['sounds/effects/button_noise.' + TETRIS.audioExt];
        soundEffect.volume = .05;
        if(currentShape.softDrop(gameBoard)) {
            soundEffect.currentTime = 0;
            soundEffect.play();
            return true;
        }
        return false;
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