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
        console.log('Game Initializing...');
        document.getElementById('game').style.display = 'none';
        showScreen('menu');
    }

    return {
        init : init,
        showScreen : showScreen
    };
}());