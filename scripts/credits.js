/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['credits'] = (function() {
    'use strict';

    function init() {
        //document.getElementById('credits-back').addEventListener('click', function () {
        //    TETRIS.main.showScreen('menu');
        //}, false);

        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            console.log('working');
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
