/**
 * Created on 3/17/2015.
 */

TETRIS.main = (function() {
    'use strict';

    function showScreen(screenName) {
        var screen = 0,
            screens = null;

        screens = document.getElementsByClassName('active');
        for (screen = 0; screen < screens.length; ++screen) {
            screens[screen].classList.remove('active');
        }

        TETRIS.screens[screenName].run();
        document.getElementById(screenName).classList.add('active');
    }

    function init() {
        var screen = null;

        console.log('Game Initializing...');

        for (screen in TETRIS.screens) {
            if (TETRIS.screens.hasOwnProperty(screen)) {
                TETRIS.screens[screen].init();
            }
        }

        showScreen('menu');
    }

    return {
        init : init,
        showScreen : showScreen
    };
}());