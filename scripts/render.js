/**
 * Created by Brenton on 3/7/2015.
 */

TETRIS.graphics = (function() {
    'use strict';

    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        ctx.clear();
    }

    /*
      Each piece section should be 35px by 35px
    */
    function Font(spec) {
        var that = {};

        that.draw = function() {
            ctx. save();
            ctx.fillStyle = spec.color;
            ctx.font = spec.font.style + ' ' + spec.font.size + ' ' + spec.font.type; //bold 14px Tahoma
            ctx.fillText(
                spec.text,
                spec.origin.x,
                spec.origin.y);
            ctx.restore();
        };

        that.setText = function(newText) {
            spec.text = newText;
        };

        return that;
    }

    function GameBoard(spec) {
        var that = {},
            playScreen = undefined,
            nextPieceScreen = undefined;

        that.draw = function() {
            playScreen = PlayScreen({
                origin : { x : 75, y : 50 },
                to : { x : 350, y : 700 },
                innerColor : 'rgba(14, 13, 29, 0.75)',
                outerColor : 'rgba(166, 241, 255, 1)',
                outerWidth : 3
            }).draw();

            nextPieceScreen = NextPieceScreen({
                origin : { x : 475, y : 50 },
                to : { x : 450, y : 300 },
                innerColor : 'rgba(14, 13, 29, 0.25)',
                outerColor : 'rgba(166, 241, 255, 1)',
                outerWidth : 3,
                image : spec.pieceBackgroundImage
            }).draw();
        };

        that.changePieceBackground = function(img) {
            spec.pieceBackgroundImage = img;
        };

        return that;
    }

    function Grid(spec) {
        var that = {},
            col = 0,
            row = 0;

        that.draw = function() {
            for (row = 1; row <= 20; ++row) {
                Line({
                    origin: {x: spec.origin.x, y: row * 35 + spec.origin.y },
                    to: {x: spec.width + spec.origin.x, y: row * 35 + spec.origin.y },
                    color: '#a6f1ff'
                }).draw();
            }

            for (col = 1; col <= 10; ++col) {
                Line({
                    origin: {x: col * 35 + spec.origin.x, y: spec.origin.y },
                    to: {x: col * 35 + spec.origin.x, y: spec.height + spec.origin.y },
                    color: '#a6f1ff'
                }).draw();
            }
        };

        return that;
    }

    function Line(spec) {
        var that = {};

        that.draw = function() {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(spec.origin.x, spec.origin.y);
            ctx.lineTo(spec.to.x, spec.to.y);
            ctx.strokeStyle = spec.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        };

        return that;
    }

    function NextPieceScreen(spec) {
        var that = {},
            backgroundImage = undefined;

        that.draw = function() {
            backgroundImage = Texture({
                image: TETRIS.images['' + spec.image],
                center: {x: spec.origin.x + (spec.to.x / 2), y: spec.origin.y + (spec.to.y / 2)},
                width: spec.to.x, height: spec.to.y
            }).draw();

            ctx.save();
            ctx.beginPath();
            ctx.rect(spec.origin.x, spec.origin.y, spec.to.x, spec.to.y);
            ctx.fillStyle = spec.innerColor;
            ctx.fill();
            ctx.lineWidth = spec.outerWidth;
            ctx.strokeStyle = spec.outerColor;
            ctx.stroke();
            ctx.restore();
        };

        return that;
    }

    function PlayScreen(spec) {
        var that = {};

        Grid({
            origin : { x : spec.origin.x, y : spec.origin.y},
            width : spec.to.x, height : spec.to.y
        }).draw();

        that.draw = function() {
            ctx.save();
            ctx.beginPath();
            ctx.rect(spec.origin.x, spec.origin.y, spec.to.x, spec.to.y);
            ctx.fillStyle = spec.innerColor;
            ctx.fill();
            ctx.lineWidth = spec.outerWidth;
            ctx.strokeStyle = spec.outerColor;
            ctx.stroke();
            ctx.restore();
        };

        return that;
    }

    function StatScreen(spec) {
        var that = {},
            levelFont = Font({
                color : '#35caff',
                font : { style : 'normal', size : '20px', type : 'Josefin Slab' },
                origin : { x : 515, y : 425 },
                text : 'LEVEL : ' + spec.level
            }),
            linesFont = Font({
                color : '#35caff',
                font : { style : 'normal', size : '20px', type : 'Josefin Slab' },
                origin : { x : 521, y : 485 },
                text : 'LINES : ' + spec.lines
            }),
            scoreFont = Font({
                color : '#35caff',
                font : { style : 'normal', size : '20px', type : 'Josefin Slab' },
                origin : { x : 725, y : 485 },
                text : 'SCORE : ' + spec.score
            }),
            topScoreFont = Font({
                color : '#35caff',
                font : { style : 'normal', size : '20px', type : 'Josefin Slab' },
                origin : { x : 680, y : 425 },
                text : 'TOP SCORE : ' + spec.topScore
            });

        that.draw = function() {
            ctx.save();
            ctx.beginPath();
            ctx.rect(475, 375, 450, 150);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(166, 241, 255, 1)';
            ctx.stroke();
            ctx.restore();

            levelFont.draw();
            linesFont.draw();
            scoreFont.draw();
            topScoreFont.draw();

        };

        that.getLevel = function() {
            return spec.level;
        };

        that.getLines = function() {
            return spec.lines;
        };

        that.getScore = function() {
            return spec.score;
        };

        that.getTopScore = function() {
            return spec.topScore;
        };

        that.setLevel = function(level) {
            spec.level = level;
        };

        that.setLines = function(lines) {
            spec.lines = lines;
        };

        that.setScore = function(score) {
            spec.score = score;
        };

        that.setTopScore = function(topScore) {
            spec.topScore = topScore;
        };

        return that;
    }

    function Texture(spec) {
        var that = {};

        that.draw = function() {
            ctx.save();
            ctx.drawImage(
                spec.image,
                spec.center.x - spec.width/2,
                spec.center.y - spec.height/2,
                spec.width, spec.height);
            ctx.restore();
        };

        that.setImage = function(img) {
            spec.image = img;
        };

        return that;
    }

    function drawParticles(particle){
        ctx.save();
        ctx.translate(particle.center.x, particle.center.y);
        ctx.rotate(particle.rotation);
        ctx.translate(-particle.center.x, -particle.center.y);
        ctx.drawImage(particle.image, particle.center.x - particle.size/2, particle.center.y - particle.size/2, particle.size, particle.size);
        ctx.restore();
    }


    function drawGrid(gameGrid) {
        var i = 0,
            j = 0,
            rows = 22,
            columns = 10;

        for(i = 0; i < columns; ++i) {
            for(j = 2; j < rows; ++j) {
                if(gameGrid[i][j] !== null) {
                    Texture({
                        image : gameGrid[i][j].getImage(),
                        center : { x : 35 * i + 17.5 + 75, y : 35 * j + 67.5 - 70 /* -70 because of the invisible top two rows */ },
                        width : 35, height : 35
                    }).draw();
                }
            }
        }
    }

    return {
        GameBoard : GameBoard,
        StatScreen : StatScreen,
        Texture : Texture,
        drawParticles : drawParticles,
        drawGrid : drawGrid,
        clear : clear
    }
}());
