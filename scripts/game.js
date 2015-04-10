/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['game'] = (function() {
    'use strict';

    var cancelNextRequest = false,
        gameOver = false,
        gainedTheLead = false,
        firstStrike = false,

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
        deletedIndexes = [],

        firstStrikeSound = TETRIS.sounds['sounds/voice/first_strike.' + TETRIS.audioExt],
        gainedTheLeadSound = TETRIS.sounds['sounds/voice/gained_the_lead.' + TETRIS.audioExt],
        pieceSetSound = TETRIS.sounds['sounds/effects/boltshot_shot.' + TETRIS.audioExt],
        rowCollapseSound = TETRIS.sounds['sounds/guns/assault_rifle_burst_1.' + TETRIS.audioExt],
        killStreakSound = null,
        queuedSounds = [];


    function addSound (sound) {
        var index;

        if(queuedSounds.length > 0) {
            if(!queuedSounds[0].paused) {       // Top element is currently playing
                queuedSounds.push(sound);
                return;
            }
        }

        queuedSounds.push(sound);
        index = queuedSounds.indexOf(sound);
        queuedSounds[index].addEventListener('ended', audioEnded);
        queuedSounds[index].play();
    }


    function audioEnded() {
        var currentSound = null;

        queuedSounds.shift();

        if(queuedSounds.length > 0) {
            currentSound = queuedSounds[0];
            currentSound.addEventListener('ended', audioEnded);
            currentSound.play();
        }
    }


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

        pieceSetSound.volume = .25;

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, killGame);

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


    function handleSounds(linesDeletedThisUpdate) {
        if(linesDeletedThisUpdate === 0) {
            addSound(pieceSetSound);
        } else {
            addSound(rowCollapseSound);

            if(linesDeletedThisUpdate > 1) {
                addSound(getRowDeleteVoiceEffect(linesDeletedThisUpdate));
            }

            if(!firstStrike) {
                addSound(firstStrikeSound);
                firstStrike = true;
            }
        }
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


    function killGame() {
        TETRIS.onGameScreen = false;
        cancelNextRequest = true;
        TETRIS.sounds['sounds/music/ascendancy_remix.' + TETRIS.audioExt].pause();
        TETRIS.killGame = false;
        TETRIS.main.showScreen('menu');
    }


    function namePrompt() {
        var name;

        name = prompt("Please enter your name", "Chief");

        if(name === ''){
            name = 'Unknown';
        }

        return name;
    }


    function nextLevel() {
        speed = speed - .10;
        multiplier += 1;
        level += 1;
        if(speed < 0){
            speed = .10;
        }
        linesToNextDiff = 0;
        updateNextPieceBackground(level);
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


    function getRowDeleteVoiceEffect(numDeleted) {
        killStreakSound = null;

        switch(numDeleted) {
            case 2:
                killStreakSound = TETRIS.sounds['sounds/voice/double_kill.' + TETRIS.audioExt];
                break;
            case 3:
                killStreakSound = TETRIS.sounds['sounds/voice/triple_kill.' + TETRIS.audioExt];
                break;
            case 4:
                killStreakSound = TETRIS.sounds['sounds/voice/overkill.' + TETRIS.audioExt];
                break;
            case 5:
                killStreakSound = TETRIS.sounds['sounds/voice/killtacular.' + TETRIS.audioExt];
                break;
            case 6:
                killStreakSound = TETRIS.sounds['sounds/voice/killtrocity.' + TETRIS.audioExt];
                break;
            case 7:
                killStreakSound = TETRIS.sounds['sounds/voice/killimanjaro.' + TETRIS.audioExt];
                break;
            case 8:
                killStreakSound = TETRIS.sounds['sounds/voice/killtastrophe.' + TETRIS.audioExt];
                break;
            case 9:
                killStreakSound = TETRIS.sounds['sounds/voice/killpocalypse.' + TETRIS.audioExt];
                break;
            case 10:
                killStreakSound = TETRIS.sounds['sounds/voice/killionaire.' + TETRIS.audioExt];
                break;
        }

        killStreakSound.currentTime = 0;
        return killStreakSound;
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


    function returnToMain(name) {
        if(name === '' || name === null){
            name = 'Unknown';
        }
        TETRIS.screens['highScores'].addScore(name, score);
        TETRIS.onGameScreen = false;

        TETRIS.sounds['sounds/music/ascendancy_remix.' + TETRIS.audioExt].pause();
        cancelNextRequest = true;
        TETRIS.main.showScreen('menu');
    }


    function run() {
        var nextShapeSpec;

        if(!TETRIS.AIRunning) {
            if (TETRIS.sessionID != null) {
                cancelAnimationFrame(TETRIS.sessionID);
                TETRIS.sessionID = null;
            }

            multiplier = 1;
            score = 0;
            level = 1;
            pointsForOneLine = 40;
            pointsForTwoLines = 100;
            pointsForThreeLines = 300;
            pointsForFourLines = 1200;
            speed = .75;
            linesCleared = 0;
            deletedIndexes.length = 0;
            gameOver = false;
            TETRIS.onGameScreen = true;
            cancelNextRequest = false;

            TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();

            TETRIS.lastTime = performance.now();

            TETRIS.keyboard.clearKeyboardState();

            beginGameMusic();
            updateNextPieceBackground(1);

            for (var i = 0; i < 4; i++) {
                shapeHistory.push('LZ');
            }

            serverCallHighScore();

            gameBoard = TETRIS.objects.GameBoard();
            gameBoard.createGameBoard();

            currentShape = TETRIS.objects.Shape();
            currentShape.createShape(nextShape());
            currentShape.spawn(gameBoard);

            abbrevForNextShape = nextShape();

            nextShapeSpec = getNextShapeDetails(abbrevForNextShape);
            shapeOnDeckImage = TETRIS.graphics.Texture({
                image: nextShapeSpec.image,
                center: {x: nextShapeSpec.center.x, y: nextShapeSpec.center.y},
                width: nextShapeSpec.width, height: nextShapeSpec.height
            });

            TETRIS.sessionID = requestAnimationFrame(gameLoop);
        } else {
            AIRun();
        }
    }


    function serverCallHighScore() {
        $.ajax({
            url: 'http://localhost:3000/v1/high-scores',
            cache : false,
            type: 'GET',
            error: function() {alert('GET failed');},
            success: function(data){
                topScore = data[0].score;
            }
        });
    }


    function update() {
        var linesDeletedThisUpdate = 0,
            nextShapeSpec,
            name = '';

        if(!gainedTheLead && score > topScore) {
            addSound(gainedTheLeadSound);
            gainedTheLead = true;
        }

        if(gameOver){
            queuedSounds.length = 0;
            addSound(TETRIS.sounds['sounds/voice/game_over.' + TETRIS.audioExt]);
            name = namePrompt();
            returnToMain(name);
        }
        else{
            if(ticTime/1000 > speed) {
                if (!currentShape.softDrop(gameBoard)) {
                    deletedIndexes = 0;

                   do {
                       deletedIndexes = gameBoard.checkForCompleteLines();
                       beginEffect(deletedIndexes,gameBoard);
                       gameBoard.deleteLines(deletedIndexes, gameBoard);

                       gameBoard.fillIn(gameBoard);

                       updateScore(deletedIndexes.length);

                       linesDeletedThisUpdate += deletedIndexes.length;
                       linesCleared += deletedIndexes.length;
                       linesToNextDiff += deletedIndexes.length;

                    } while(deletedIndexes.length > 0);

                    // PLAY SOUND
                    handleSounds(linesDeletedThisUpdate);

                    // ADVANCE TO NEXT LEVEL
                    if(linesToNextDiff >= 10){
                        nextLevel();
                    }

                    // NEXT SHAPE
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

                deletedIndexes.length = 0;
                ticTime = 0;
            }
            TETRIS.keyboard.update(TETRIS.elapsedTime);
        }
        updateScoreBoard();
    }


    function updateNextPieceBackground(level) {
        switch(level) {
            case 1:
                playScreen.changePieceBackground('images/backgrounds/fud.jpg');
                break;
            case 2:
                playScreen.changePieceBackground('images/backgrounds/requiem.png');
                break;
            case 3:
                playScreen.changePieceBackground('images/backgrounds/infinity.png');
                break;
            case 4:
                playScreen.changePieceBackground('images/backgrounds/reclaimer.png');
                break;
            case 5:
                playScreen.changePieceBackground('images/backgrounds/shutdown.png');
                break;
            case 6:
                playScreen.changePieceBackground('images/backgrounds/composer.png');
                break;
            case 7:
                playScreen.changePieceBackground('images/backgrounds/midnight.png');
                break;
            case 8:
                break;
        }
    }


    function updateScore(amountOfRows) {
        if(amountOfRows != 0){
            if(amountOfRows === 1){
                score += multiplier * pointsForOneLine;
            }
            else if(amountOfRows === 2){
                score += multiplier * pointsForTwoLines;
            }
            else if(amountOfRows === 3){
                score += multiplier * pointsForThreeLines;
            }
            else{
                score += multiplier * pointsForFourLines;
            }
        }
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


    /*********************** AI ***************************/

    function AIRun() {
        var nextShapeSpec;

        if (TETRIS.sessionID != null) {
            cancelAnimationFrame(TETRIS.sessionID);
            TETRIS.sessionID = null;
        }

        multiplier = 1;
        score = 0;
        level = 1;
        pointsForOneLine = 40;
        pointsForTwoLines = 100;
        pointsForThreeLines = 300;
        pointsForFourLines = 1200;
        speed = .5;
        linesCleared = 0;
        deletedIndexes.length = 0;
        gameOver = false;
        TETRIS.onGameScreen = true;
        cancelNextRequest = false;

        TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();

        TETRIS.lastTime = performance.now();

        TETRIS.keyboard.clearKeyboardState();

        beginGameMusic();
        updateNextPieceBackground(1);

        for (var i = 0; i < 4; i++) {
            shapeHistory.push('LZ');
        }

        serverCallHighScore();

        gameBoard = TETRIS.objects.GameBoard();
        gameBoard.createGameBoard();

        currentShape = TETRIS.objects.Shape();
        currentShape.createShape(nextShape());
        TETRIS.getDetailsOnce = true;
        TETRIS.pieceActive = true;

        abbrevForNextShape = nextShape();

        nextShapeSpec = getNextShapeDetails(abbrevForNextShape);
        shapeOnDeckImage = TETRIS.graphics.Texture({
            image: nextShapeSpec.image,
            center: {x: nextShapeSpec.center.x, y: nextShapeSpec.center.y},
            width: nextShapeSpec.width, height: nextShapeSpec.height
        });

        TETRIS.sessionID = requestAnimationFrame(AIGameLoop);
    }


    function AIGameLoop(time) {
        TETRIS.elapsedTime = time - TETRIS.lastTime;
        TETRIS.lastTime = time;
        ticTime += TETRIS.elapsedTime;

        if(TETRIS.killGame) {
            killGame();
        }

        AIUpdate();
        render();

        TETRIS.particleSystem.update(TETRIS.elapsedTime);
        if (!cancelNextRequest) {
            TETRIS.sessionID = requestAnimationFrame(AIGameLoop);
        }
    }


    function AIUpdate() {
        var moveMade = false,
            nextShapeSpec = '';

        if(TETRIS.getDetailsOnce) {
            TETRIS.bestDetails = getBestLocation(gameBoard, currentShape);
            currentShape.spawn(gameBoard);
            TETRIS.getDetailsOnce = false;
        }

        if (!TETRIS.pieceActive) {

            // Create new current shape
            currentShape = TETRIS.objects.Shape();
            currentShape.createShape(abbrevForNextShape);
            TETRIS.pieceActive = true;
            console.log(gameBoard.getShapes().length);

            TETRIS.bestDetails = getBestLocation(gameBoard, currentShape);

            if(currentShape.spawn(gameBoard)) {

                // Next Shape
                abbrevForNextShape = nextShape();
                nextShapeSpec = getNextShapeDetails(abbrevForNextShape);

                shapeOnDeckImage = TETRIS.graphics.Texture({
                    image: nextShapeSpec.image,
                    center: {x: nextShapeSpec.center.x, y: nextShapeSpec.center.y},
                    width: nextShapeSpec.width, height: nextShapeSpec.height
                });
            } else {
                addSound(TETRIS.sounds['sounds/voice/game_over.' + TETRIS.audioExt]);
                gameOver = true;
            }
        }


        if (ticTime / 1000 > speed) {
            if (!gameOver) {
                if (currentShape.softDrop(gameBoard)) {
                    if (!moveMade) {
                        // Make moves here

                        if (TETRIS.bestDetails.rotation !== currentShape.getCurrentRotationState()) {
                            currentShape.rotate(gameBoard, 'r');
                            moveMade = true;
                        } else if(TETRIS.bestDetails.loc.x > currentShape.getLowerLeftPieceLocation().x) {
                            moveRight();
                            moveMade = true;
                        } else if(TETRIS.bestDetails.loc.x < currentShape.getLowerLeftPieceLocation().x) {
                            moveLeft();
                            moveMade = true;
                        } else {
                            hardDrop();
                            TETRIS.pieceActive = false;
                        }

                    }
                } else {
                    TETRIS.pieceActive = false;
                }
                moveMade = false;
                ticTime = 0;
            } else {
                killGame();
            }
        }
    }

    function getBestLocation(gBoard, cShape) {
        var best = -9999,
            bestLocation = null,
            bestRotation = 0,
            canMoveLeft = true,
            canMoveRight = true,
            currentScore = 0,
            didDrop = false,
            i = 0,
            rightsToMove = 0,
            rightsMoved = 0,
            lowerLeftPieceLocation = null,
            rot = 0,
            tempBoard,
            tempShape;

        for(rot; rot < 4; ++rot) {
            rightsToMove = 0;

            while(rightsToMove < 11) {
                tempShape = cShape.clone(cShape.getShapeAbbrev());               // Reset the shape and clone it to the current shape
                tempBoard = gBoard.clone();

                tempShape.spawn(tempBoard);

                for (i; i < rot; ++i) {
                    lowerLeftPieceLocation = tempShape.getLowerLeftPieceLocation();
                    tempShape.rotate(tempBoard, 'r');
                    lowerLeftPieceLocation = tempShape.getLowerLeftPieceLocation();
                }

                canMoveLeft = true;
                canMoveRight = true;

                while (canMoveLeft) {          // Move the shape left or right until it lines up with the last left it was at (we will want to increment it by one)
                    canMoveLeft = tempShape.moveLeft(tempBoard);
                    lowerLeftPieceLocation = tempShape.getLowerLeftPieceLocation();
                }

                rightsMoved = 0;
                while (rightsMoved < rightsToMove && canMoveRight) {
                    rightsMoved++;
                    canMoveRight = tempShape.moveRight(tempBoard);
                    lowerLeftPieceLocation = tempShape.getLowerLeftPieceLocation();
                }

                do {                                                    // Move shape down until it can't go anymore
                    didDrop = tempShape.softDrop(tempBoard);
                    lowerLeftPieceLocation = tempShape.getLowerLeftPieceLocation();
                } while (didDrop);

                // Now the lower left piece is in the final place for this increment,
                // now we need to score it.
                currentScore = scoreGrid(tempBoard);

                if (currentScore > best) {
                    best = currentScore;
                    var location = tempShape.getLowerLeftPieceLocation();
                    bestLocation = { x : location.x, y : location.y } ;
                    bestRotation = tempShape.getCurrentRotationState();
                }
                else {
                    currentScore = 0;
                }
                rightsToMove++;
                tempBoard.clearGrid();
            }
        }

        return {
            loc : {
                x : bestLocation.x,
                y : bestLocation.y
            },
            rotation : bestRotation
        };
    }


    function scoreGrid(gBoard) {
        var aggHeight,
            bumpiness,
            completeLines,
            holes,
            score,

            heights,
            a = -0.66569,
            b = 0.99275,
            c = -0.46544,
            d = -0.24077;

        heights = getHeightsOfGrid(gBoard);

        aggHeight = getAggregateHeight(heights);
        completeLines = gBoard.checkForCompleteLines().length;
        holes = getHolesOfGrid(gBoard, heights);
        bumpiness = getBumpinessOfGrid(heights);

        score = a * aggHeight + b * completeLines + c * holes + d * bumpiness;
        return score;
    }

    function getHeightsOfGrid(gBoard) {
        var i = 0,
            j = 0,
            heights = [];

        for(i = 0; i < 10; ++i) {
            for(j = 0; j < 22; ++j) {
                if(!gBoard.isEmpty({x : i, y : j})) {
                    heights.push(22 - j);
                    break;
                } else if(j == 21) {
                    heights.push(0);
                    break;
                }
            }
        }

        return heights;
    }


    function getAggregateHeight(heights) {
        var aggHeight = 0,
            i = 0;

        for(i; i < heights.length; ++i) {
            aggHeight += heights[i];
        }
        return aggHeight;
    }


    function getHolesOfGrid(gBoard, heights) {
        var amtOfHoles = 0,
            top = 0,
            i = 0,
            j = 0;

        for(i; i < heights.length; ++i) {
            top = 22 - heights[i];

            for(j = top; j < 22; ++j) {
                if(gBoard.isEmpty({x : i, y : j})) {
                    amtOfHoles++;
                }
            }
        }

        return amtOfHoles;
    }


    function getBumpinessOfGrid(heights) {
        var i = 0,
            bumpiness = 0,
            length = heights.length;

        for(i; i < length - 1; ++i) {
            bumpiness += Math.abs(heights[i] - heights[i+1]);
        }

        return bumpiness;
    }
    
    return {
        moveLeft : moveLeft,
        moveRight : moveRight,
        softDrop : softDrop,
        hardDrop : hardDrop,
        rotateLeft : rotateLeft,
        rotateRight : rotateRight,
        init : init,
        killGame : killGame,
        run : run
    };
}());