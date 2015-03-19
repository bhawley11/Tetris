/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['controls'] = (function() {
    'use strict';

    function init() {
        document.getElementById('controls-back').addEventListener('click', function () {
            TETRIS.main.showScreen('menu');
        }, false);
    }

    function run() {

    }

    return {
        init : init,
        run : run
    };
}());