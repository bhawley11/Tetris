/**
 * Created by Brenton on 3/23/2015.
 */

TETRIS.objects = function () {
    'use strict';


    function Shape() {
        var that = {},
            currentRotationState = 0,
            pieces = [],
            shape = '';


        that.checkSpawnLocation = function (gameBoard) {
            var i = 0,
                loc = null;

            for (i = 0; i < 4; ++i) {
                loc = pieces[i].getLocation();
                if (!gameBoard.isEmpty(loc)) {
                    return false;
                }
            }
            return true;
        };


        that.containsPiece = function (piece) {
            var found = false,
                loc = null,
                locToMatch = null,
                i = 0;

            if (piece !== null && piece !== undefined) {
                loc = piece.getLocation();
                for (i = 0; i < pieces.length; ++i) {
                    locToMatch = pieces[i].getLocation();

                    if (loc.x == locToMatch.x && loc.y == locToMatch.y) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        };


        that.createShape = function (s) {
            var amtOfPieces = 4,
                i = 0;

            currentRotationState = 0;
            shape = s;
            pieces.length = 0;

            for (i = 0; i < amtOfPieces; ++i) {
                pieces[i] = Piece();
            }

            switch (shape) {
                case 'B':
                    pieces[0].createPiece({x: 4, y: 0}, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[1].createPiece({x: 5, y: 0}, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[2].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/green_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 1}, TETRIS.images['images/squares/green_square.png'], this);
                    break;
                case 'LL':
                    pieces[0].createPiece({x: 3, y: 0}, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[1].createPiece({x: 3, y: 1}, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[2].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/blue_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 1}, TETRIS.images['images/squares/blue_square.png'], this);
                    break;
                case 'RL':
                    pieces[0].createPiece({x: 3, y: 1}, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[1].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[2].createPiece({x: 5, y: 1}, TETRIS.images['images/squares/light_blue_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 0}, TETRIS.images['images/squares/light_blue_square.png'], this);
                    break;
                case 'LZ':
                    pieces[0].createPiece({x: 3, y: 0}, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[1].createPiece({x: 4, y: 0}, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[2].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/orange_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 1}, TETRIS.images['images/squares/orange_square.png'], this);
                    break;
                case 'RZ':
                    pieces[0].createPiece({x: 3, y: 1}, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[1].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[2].createPiece({x: 4, y: 0}, TETRIS.images['images/squares/gray_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 0}, TETRIS.images['images/squares/gray_square.png'], this);
                    break;
                case 'T':
                    pieces[0].createPiece({x: 4, y: 0}, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[1].createPiece({x: 3, y: 1}, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[2].createPiece({x: 4, y: 1}, TETRIS.images['images/squares/brown_square.png'], this);
                    pieces[3].createPiece({x: 5, y: 1}, TETRIS.images['images/squares/brown_square.png'], this);
                    break;
                case 'I':
                    pieces[0].createPiece({x: 3, y: 0}, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[1].createPiece({x: 4, y: 0}, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[2].createPiece({x: 5, y: 0}, TETRIS.images['images/squares/navy_square.png'], this);
                    pieces[3].createPiece({x: 6, y: 0}, TETRIS.images['images/squares/navy_square.png'], this);
                    break;
                default:
                    console.log('Shape is not registered: Spawn');
                    return;
            }

            that.setUpShapeBoundaries();
        };


        that.createShapeFromPieces = function (ps) {
            var amtOfPieces = pieces.length,
                i = 0;

            for (i = 0; i < amtOfPieces; ++i) {
                pieces.push(ps[i]);
            }

            that.setUpShapeBoundaries();
        };


        that.getPieces = function () {
            return (pieces.length > 0) ? pieces : null;
        };


        that.getShapeAbbrev = function() {
            return shape;
        };


        that.hardDrop = function (gameBoard) {
            var able = true;

            do {
                able = that.softDrop(gameBoard);
            } while (able);
        };


        that.moveLeft = function (gameBoard) {
            var able = true,
                amtOfPieces = pieces.length,
                i = 0,
                loc = undefined;

            for (i = 0; i < amtOfPieces; ++i) {
                if (pieces[i].getIsLeft()) {
                    loc = pieces[i].getLocation();
                    if (!gameBoard.isEmpty({x: loc.x - 1, y: loc.y})) {
                        able = false;
                    }
                }
            }

            if (able) {
                gameBoard.moveShape(this, 'L');
            }
            return able;
        };


        that.moveRight = function (gameBoard) {
            var able = true,
                amtOfPieces = pieces.length,
                i = 0,
                loc = undefined;

            for (i = 0; i < amtOfPieces; ++i) {
                if (pieces[i].getIsRight()) {
                    loc = pieces[i].getLocation();
                    if (!gameBoard.isEmpty({x: loc.x + 1, y: loc.y})) {
                        able = false;
                    }
                }
            }

            if (able) {
                gameBoard.moveShape(this, 'R');
            }
            return able;
        };


        that.removePiece = function (piece) {
            var indexOf = pieces.indexOf(piece);
            pieces.splice(indexOf, 1);
        };


        that.rotate = function (gameBoard, dir) {
            var attemptedOffsets,
                offsetsA = [],
                offsetsB = [],
                offsetsC = [],
                offsetsD = [],
                offsetsSelected = null,
                toState = 0,
                grid = gameBoard.getGrid(),

                attemptRotation = function (offsets) {
                    var able = true,
                        amtOfPieces = pieces.length,
                        loc = null,
                        newX = 0,
                        newY = 0,
                        i = 0;

                    for (i = 0; i < amtOfPieces; ++i) {
                        loc = pieces[i].getLocation();
                        newX = loc.x + offsets[i].x;
                        newY = loc.y + offsets[i].y;

                        if (!gameBoard.isEmpty({ x : newX, y : newY })) {                                                   // If the new location is not within bounds or is not empty
                            if (newX < 0 || newX > 9 || newY < 0 || newY > 21) {                                                // If the new point is not within bounds
                                able = false;
                            }   else if (!that.containsPiece(grid[loc.x + offsets[i].x][loc.y + offsets[i].y])) {           // If the new point contains something not in this shape
                                able = false;
                            }
                        }
                    }

                    if (able) {
                        return offsets;
                    }
                    return null;

                };

            switch (shape) {
                case 'B':
                    return; // Box's don't need to rotate
                case 'LL':
                    offsetsA.push({x: 0, y: -2});
                    offsetsA.push({x: -1, y: -1});
                    offsetsA.push({x: 0, y: 0});
                    offsetsA.push({x: 1, y: 1});

                    offsetsB.push({x: 2, y: 0});
                    offsetsB.push({x: 1, y: -1});
                    offsetsB.push({x: 0, y: 0});
                    offsetsB.push({x: -1, y: 1});

                    offsetsC.push({x: 0, y: 2});
                    offsetsC.push({x: 1, y: 1});
                    offsetsC.push({x: 0, y: 0});
                    offsetsC.push({x: -1, y: -1});

                    offsetsD.push({x: -2, y: 0});
                    offsetsD.push({x: -1, y: 1});
                    offsetsD.push({x: 0, y: 0});
                    offsetsD.push({x: 1, y: -1});
                    break;
                case 'RL':
                    offsetsA.push({x: -1, y: -1});
                    offsetsA.push({x: 0, y: 0});
                    offsetsA.push({x: 1, y: 1});
                    offsetsA.push({x: 2, y: 0});

                    offsetsB.push({x: 1, y: -1});
                    offsetsB.push({x: 0, y: 0});
                    offsetsB.push({x: -1, y: 1});
                    offsetsB.push({x: 0, y: 2});

                    offsetsC.push({x: 1, y: 1});
                    offsetsC.push({x: 0, y: 0});
                    offsetsC.push({x: -1, y: -1});
                    offsetsC.push({x: -2, y: 0});

                    offsetsD.push({x: -1, y: 1});
                    offsetsD.push({x: 0, y: 0});
                    offsetsD.push({x: 1, y: -1});
                    offsetsD.push({x: 0, y: -2});
                    break;
                case 'LZ':
                    offsetsA.push({x: 0, y: -2});
                    offsetsA.push({x: 1, y: -1});
                    offsetsA.push({x: 0, y: 0});
                    offsetsA.push({x: 1, y: 1});

                    offsetsB.push({x: 2, y: 0});
                    offsetsB.push({x: 1, y: 1});
                    offsetsB.push({x: 0, y: 0});
                    offsetsB.push({x: -1, y: 1});

                    offsetsC.push({x: 0, y: 2});
                    offsetsC.push({x: -1, y: 1});
                    offsetsC.push({x: 0, y: 0});
                    offsetsC.push({x: -1, y: -1});

                    offsetsD.push({x: -2, y: 0});
                    offsetsD.push({x: -1, y: -1});
                    offsetsD.push({x: 0, y: 0});
                    offsetsD.push({x: 1, y: -1});
                    break;
                case 'RZ':
                    offsetsA.push({x: -1, y: -1});
                    offsetsA.push({x: 0, y: 0});
                    offsetsA.push({x: 1, y: -1});
                    offsetsA.push({x: 2, y: 0});

                    offsetsB.push({x: 1, y: -1});
                    offsetsB.push({x: 0, y: 0});
                    offsetsB.push({x: 1, y: 1});
                    offsetsB.push({x: 0, y: 2});

                    offsetsC.push({x: 1, y: 1});
                    offsetsC.push({x: 0, y: 0});
                    offsetsC.push({x: -1, y: 1});
                    offsetsC.push({x: -2, y: 0});

                    offsetsD.push({x: -1, y: 1});
                    offsetsD.push({x: 0, y: 0});
                    offsetsD.push({x: -1, y: -1});
                    offsetsD.push({x: 0, y: -2});
                    break;
                case 'T':
                    offsetsA.push({x: 1, y: -1});
                    offsetsA.push({x: -1, y: -1});
                    offsetsA.push({x: 0, y: 0});
                    offsetsA.push({x: 1, y: 1});

                    offsetsB.push({x: 1, y: 1});
                    offsetsB.push({x: 1, y: -1});
                    offsetsB.push({x: 0, y: 0});
                    offsetsB.push({x: -1, y: 1});

                    offsetsC.push({x: -1, y: 1});
                    offsetsC.push({x: 1, y: 1});
                    offsetsC.push({x: 0, y: 0});
                    offsetsC.push({x: -1, y: -1});

                    offsetsD.push({x: -1, y: -1});
                    offsetsD.push({x: -1, y: 1});
                    offsetsD.push({x: 0, y: 0});
                    offsetsD.push({x: 1, y: -1});
                    break;
                case 'I':
                    offsetsA.push({x: -1, y: -2});
                    offsetsA.push({x: 0, y: -1});
                    offsetsA.push({x: 1, y: 0});
                    offsetsA.push({x: 2, y: 1});

                    offsetsB.push({x: 2, y: -1});
                    offsetsB.push({x: 1, y: 0});
                    offsetsB.push({x: 0, y: 1});
                    offsetsB.push({x: -1, y: 2});

                    offsetsC.push({x: 1, y: 2});
                    offsetsC.push({x: 0, y: 1});
                    offsetsC.push({x: -1, y: 0});
                    offsetsC.push({x: -2, y: -1});

                    offsetsD.push({x: -2, y: 1});
                    offsetsD.push({x: -1, y: 0});
                    offsetsD.push({x: 0, y: -1});
                    offsetsD.push({x: 1, y: -2});
                    break;
                default:
                    console.log('Shape is not registered: Rotate');
                    break;
            }

            if (dir == 'r') {
                toState = (currentRotationState < 3) ? currentRotationState + 1 : 0;
            }
            else {
                toState = (currentRotationState > 0) ? currentRotationState - 1 : 3;
            }

            switch (toState) {
                case 0:
                    if (dir == 'r') {
                        offsetsSelected = offsetsA;
                    } else {
                        offsetsSelected = offsetsD;
                    }
                    break;
                case 1:
                    if (dir == 'r') {
                        offsetsSelected = offsetsB;
                    } else {
                        offsetsSelected = offsetsA;
                    }
                    break;
                case 2:
                    if (dir == 'r') {
                        offsetsSelected = offsetsC;
                    } else {
                        offsetsSelected = offsetsB;
                    }
                    break;
                case 3:
                    if (dir == 'r') {
                        offsetsSelected = offsetsD;
                    } else {
                        offsetsSelected = offsetsC;
                    }
                    break;
            }

            attemptedOffsets = attemptRotation(offsetsSelected);
            if (attemptedOffsets !== null) {            // This actually performs the rotation
                gameBoard.rotateShape(this, attemptedOffsets);
                currentRotationState = toState;
                that.setUpShapeBoundaries();
            }
        };


        that.setUpShapeBoundaries = function () {
            var amtOfPieces = pieces.length,
                i = 0;

            for (i = 0; i < amtOfPieces; ++i) {
                pieces[i].computeTop(pieces);
                pieces[i].computeBottom(pieces);
                pieces[i].computeLeft(pieces);
                pieces[i].computeRight(pieces);
            }
        };


        that.softDrop = function (gameBoard) {
            var able = true,
                amtOfPieces = pieces.length,
                i = 0,
                loc = undefined;

            for (i = 0; i < amtOfPieces; ++i) {              // Check if all bottom pieces are empty below them
                if (pieces[i].getIsBottom()) {
                    loc = pieces[i].getLocation();

                    if (!gameBoard.isEmpty({x: loc.x, y: loc.y + 1})) {
                        able = false;
                    }
                }
            }

            if (able) {
                gameBoard.moveShape(this, 'D');
            }
            return able;
        };


        that.spawn = function (gameBoard) {
            if (that.checkSpawnLocation(gameBoard)) {
                gameBoard.addShape(this);
            }
            else {
                return false;
            }
        };


        return that;
    }


    function Piece() {
        var that = {},
            father = null,
            image = null,
            isBottom = true,
            isLeft = true,
            isRight = true,
            isTop = true,
            location = undefined;


        that.computeBottom = function (pList) {
            var amtOfPieces = pList.length,
                currentPiece = null,
                currentLocation = null,
                pieceLocation = null,
                i = 0,
                j = 0;

            if (amtOfPieces === 1) {                                 // If there is only one piece, it is automatically the bottom
                pList[0].setIsBottom(true);
            }

            for (i = 0; i < amtOfPieces; ++i) {                      // For each piece in the shape
                currentPiece = pList[i];
                currentPiece.setIsBottom(true);
                currentLocation = currentPiece.getLocation();

                for (j = 0; j < amtOfPieces; ++j) {                  // For each piece in the shape
                    pieceLocation = pList[j].getLocation();

                    if (currentLocation !== pieceLocation) {         // Don't check against yourself
                        if (currentLocation.x === pieceLocation.x) {
                            if (currentLocation.y < pieceLocation.y) {
                                currentPiece.setIsBottom(false);
                            }
                        }
                    }
                }
            }
        };


        that.computeLeft = function (pList) {
            var amtOfPieces = pList.length,
                currentPiece = null,
                currentLocation = null,
                pieceLocation = null,
                i = 0,
                j = 0;

            if (amtOfPieces === 1) {
                pList[0].setIsLeft(true);
            }

            for (i = 0; i < amtOfPieces; ++i) {
                currentPiece = pList[i];
                currentPiece.setIsLeft(true);
                currentLocation = currentPiece.getLocation();

                for (j = 0; j < amtOfPieces; ++j) {
                    pieceLocation = pList[j].getLocation();

                    if (currentLocation !== pieceLocation) {         // Only check pieces that aren't us
                        if (currentLocation.y === pieceLocation.y) {
                            if (currentLocation.x > pieceLocation.x) {
                                currentPiece.setIsLeft(false);
                            }
                        }
                    }
                }
            }
        };


        that.computeRight = function (pList) {
            var amtOfPieces = pList.length,
                currentPiece = null,
                currentLocation = null,
                pieceLocation = null,
                i = 0,
                j = 0;

            if (amtOfPieces === 1) {
                pList[0].setIsRight(true);
            }

            for (i = 0; i < amtOfPieces; ++i) {
                currentPiece = pList[i];
                currentPiece.setIsRight(true);
                currentLocation = currentPiece.getLocation();

                for (j = 0; j < amtOfPieces; ++j) {
                    pieceLocation = pList[j].getLocation();

                    if (currentLocation !== pieceLocation) {         // Only check pieces that aren't us
                        if (currentLocation.y === pieceLocation.y) {
                            if (currentLocation.x < pieceLocation.x) {
                                currentPiece.setIsRight(false);
                            }
                        }
                    }
                }
            }
        };


        that.computeTop = function (pList) {
            var amtOfPieces = pList.length,
                currentPiece = null,
                currentLocation = null,
                pieceLocation = null,
                i = 0,
                j = 0;

            if (amtOfPieces === 1) {
                pList[0].setIsTop(true);
            }

            for (i = 0; i < amtOfPieces; ++i) {
                currentPiece = pList[i];
                currentPiece.setIsTop(true);
                currentLocation = currentPiece.getLocation();

                for (j = 0; j < amtOfPieces; ++j) {
                    pieceLocation = pList[j].getLocation();

                    if (currentLocation !== pieceLocation) {         // Only check pieces that aren't us
                        if (currentLocation.x === pieceLocation.x) {
                            if (currentLocation.y > pieceLocation.y) {
                                currentPiece.setIsTop(false);
                            }
                        }
                    }
                }
            }
        };


        that.createPiece = function (loc, img, shape) {
            location = loc;
            image = img;
            father = shape;
        };


        that.getFather = function () {
            if (father != null) {
                return father;
            }
            console.log("father piece is null");
        };


        that.getImage = function () {
            if (image !== null) {
                return image;
            }
            console.log("image is null");
        };


        that.getIsBottom = function () {
            return isBottom;
        };


        that.getIsLeft = function () {
            return isLeft;
        };


        that.getIsRight = function () {
            return isRight;
        };


        that.getIsTop = function () {
            return isTop;
        };


        that.getLocation = function () {
            return location;
        };


        that.setIsBottom = function (is) {
            isBottom = is;
        };


        that.setIsLeft = function (is) {
            isLeft = is;
        };


        that.setIsRight = function (is) {
            isRight = is;
        };


        that.setIsTop = function (is) {
            isTop = is;
        };


        that.setLocation = function (loc) {
            location.x = (loc.x !== undefined) ? loc.x : location.x;
            location.y = (loc.y !== undefined) ? loc.y : location.y;
        };


        return that;
    }


    function GameBoard() {
        var that = {},
            grid = [[]],
            currentShapes = [];

        that.addShape = function (s) {
            var amtOfPieces = s.getPieces().length,
                loc = null,
                pieces = s.getPieces(),
                i = 0;

            for (i = 0; i < amtOfPieces; ++i) {
                loc = pieces[i].getLocation();
                grid[loc.x][loc.y] = pieces[i];
            }
            currentShapes.push(s);
        };


        that.isEmpty = function (loc) {
            if (loc.x !== undefined && loc.y !== undefined) {                                   // Check if the location passed in is valid
                if (loc.x >= 0 && loc.x < 10 && loc.y >= 0 && loc.y < 22) {                      // Check if the location is within bound
                    return (grid[loc.x][loc.y] === null);                                       // Check if the location doesn't contain null
                }
            }
            return false;
        };


        that.clearGrid = function () {
            that.createGameBoard();
        };


        that.checkForCompleteLines = function () {
            var everyCellEmpty = true,
                everyCellFull = true,
                listOfFullRowIndexes = [],
                tempLocation = null,
                y= 21,
                x = 0;

            for(y = 21; y >= 0; --y) {              // For each row starting at the bottom, working up
                everyCellEmpty = true;
                everyCellFull = true;

                for(x = 0; x < 10; ++x) {           // For each cell in the row
                    tempLocation = { x : x, y : y };

                    if(that.isEmpty(tempLocation)) {
                        everyCellFull = false;
                    } else {
                        everyCellEmpty = false;
                    }
                }

                if(everyCellEmpty) {                // This will stop the loop at an empty row
                    break;                          // NOTE: This might cause issues with a deleted row stopping the loop
                }

                if(everyCellFull) {
                    listOfFullRowIndexes.push(y);
                }
            }

            if(listOfFullRowIndexes.length > 0) {
                that.deleteLines(listOfFullRowIndexes);
            }

            return listOfFullRowIndexes;            // We will return the list of indexes for scoring and particle effects
        };


        that.createGameBoard = function () {
            var columns = 10,
                rows = 22,
                i = 0,
                j = 0;

            for (i = 0; i < columns; ++i) {
                if (!grid[i]) grid[i] = [];
                for (j = 0; j < rows; ++j) {
                    grid[i][j] = null;
                }
            }

            currentShapes.length = 0;
        };


        that.deleteLines = function (listOfIndexes) {
            var amtOfIndexes = listOfIndexes.length,
                currentShape = null,
                listOfEditedShapes = [],
                row = null,
                index = 0,
                i = 0,

                containsShape = function(list, sh) {
                    var i = 0;
                    for(i = 0; i < list.length; ++i) {
                        if(list[i] === sh) {
                            return true;
                        }
                    }
                    return false;
                };

            for(index = 0; index < amtOfIndexes; ++index) {
                row = listOfIndexes[index];

                for(i = 0; i < 10; ++i) {
                    currentShape = grid[i][row].getFather();

                    if(!containsShape(listOfEditedShapes, currentShape)) {          // Add shape to the list for split calculations
                        listOfEditedShapes.push(currentShape);
                    }

                    currentShape.removePiece(grid[i][row]);
                    grid[i][row] = null;
                }
            }

            for(i = 0; i < listOfEditedShapes.length; ++i) {                        // This will update each pieces knowledge after deletions
                currentShape = listOfEditedShapes[i].setUpShapeBoundaries();
            }
        };


        that.fillIn = function () {

        };


        that.getGrid = function () {
            return grid;
        };


        that.moveShape = function (sh, dir) {
            var amtOfPieces = sh.getPieces().length,
                i = 0,
                locX = 0,
                locY = 0,
                offset = null,
                pieces = sh.getPieces();

            switch (dir) {
                case 'D':
                    offset = {x: 0, y: 1};
                    break;
                case 'L':
                    offset = {x: -1, y: 0};
                    break;
                case 'R':
                    offset = {x: 1, y: 0};
                    break;
            }

            for (i = 0; i < amtOfPieces; ++i) {
                locX = pieces[i].getLocation().x;
                locY = pieces[i].getLocation().y;
                pieces[i].setLocation({x: locX + offset.x, y: locY + offset.y});
                grid[locX + offset.x][locY + offset.y] = pieces[i];

                switch (dir) {
                    case 'D':
                        if (pieces[i].getIsTop()) {
                            grid[locX][locY] = null;
                        }
                        break;
                    case 'L':
                        if (pieces[i].getIsRight()) {
                            grid[locX][locY] = null;
                        }
                        break;
                    case 'R':
                        if (pieces[i].getIsLeft()) {
                            grid[locX][locY] = null;
                        }
                        break;
                }
            }
        };


        that.removeShape = function (s) {
            var amtOfPieces = s.getPieces().length,
                index = currentShapes.indexOf(s),
                loc = null,
                pieces = s.getPieces(),
                i = 0;

            currentShapes.splice(index, 1);                      // Remove the shape from the grid's list of shapes

            for (i = 0; i < amtOfPieces; ++i) {
                loc = pieces[i].getLocation();
                grid[loc.x][loc.y] = null;                      // Set the grid to null where piece was located
            }
        };


        that.rotateShape = function (sh, offsetList) {
            var amtOfPieces = sh.getPieces().length,
                i = 0,
                j = 0,
                locX = 0,
                locY = 0,
                oldLoc = null,
                pieces = sh.getPieces();

            for(i = 0; i < amtOfPieces; ++i) {
                locX = pieces[i].getLocation().x;
                locY = pieces[i].getLocation().y;
                grid[locX][locY] = null;
            }

            for (i = 0; i < amtOfPieces; ++i) {
                locX = pieces[i].getLocation().x;
                locY = pieces[i].getLocation().y;

                pieces[i].setLocation({x: locX + offsetList[i].x, y: locY + offsetList[i].y});
                grid[locX + offsetList[i].x][locY + offsetList[i].y] = pieces[i];       // Make grid contain this piece
            }
        };


        return that;
    }

    return {
        Shape: Shape,
        GameBoard: GameBoard
    };
}();


