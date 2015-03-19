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
    function GameBoard(spec) {
        var that = {},
            playScreen = undefined,
            nextPieceScreen = undefined;

        that.draw = function() {
            playScreen = PlayScreen({
                origin : { x : 75, y : 50 },
                to : { x : 350, y : 700 },
                innerColor : 'rgba(14, 13, 29, 0.75)',
                outerColor : 'rgba(166, 241, 255, 0.1)',
                outerWidth : 3
            }).draw();

            nextPieceScreen = NextPieceScreen({
                origin : { x : 475, y : 50 },
                to : { x : 450, y : 300 },
                innerColor : 'rgba(14, 13, 29, 0.25)',
                outerColor : 'rgba(166, 241, 255, 0.1)',
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

        return that;
    }

    return {
        GameBoard : GameBoard,

        clear : clear
    }
}());
