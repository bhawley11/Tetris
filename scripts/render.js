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


    function GameBoard() {
        var that = {};

        that.draw = function() {
            ctx.save();
            ctx.beginPath();
            ctx.rect(25, 25, 450, 750);
            ctx.fillStyle = 'rgba(240, 245, 255,.35)';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#a6f1ff';
            ctx.stroke();
            ctx.restore();
        };

        return that;
    }

    function Rectangle(spec) {
        var that = {};

        that.draw = function() {
            ctx.save();
            ctx.fillStyle = spec.color;
            ctx.fillRect(spec.origin.x, spec.origin.y, spec.width, spec.height);
            ctx.restore();
        };

        return that;
    }

    return {
        GameBoard : GameBoard,

        clear : clear
    }
}());
