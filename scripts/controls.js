/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['controls'] = (function() {
    'use strict';
    var arrayID = [{key: 'A',id : 'left-control', value : KeyEvent.DOM_VK_A},{key : 'D', id: 'right-control', value : KeyEvent.DOM_VK_D},{key : 'Q', id: 'left-rotate-control', value: KeyEvent.DOM_VK_Q},
            {key : 'E', id: 'right-rotate-control', value:KeyEvent.DOM_VK_E},{key : 'S', id: 'soft-drop-control',value:KeyEvent.DOM_VK_S},{key : 'X', id:'hard-drop-control', value:KeyEvent.DOM_VK_X}],
        newKeyCode,
        newKeyChar,
        KeyCodes = {},
        gameMusic = TETRIS.sounds['sounds/music/africa_suite.' + TETRIS.audioExt];

    function init() {
        document.getElementById('controls-back').addEventListener('click', function () {
            gameMusic.pause();
            gameMusic.currentTime = 0;
            TETRIS.main.showScreen('menu');
        }, false);
        setKeys();
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_A, function() {TETRIS.screens['game'].moveLeft();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_D, function() {TETRIS.screens['game'].moveRight();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_S, function() {TETRIS.screens['game'].softDrop();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_X, function() {TETRIS.screens['game'].hardDrop();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_E, function() {TETRIS.screens['game'].rotateRight();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_Q, function() {TETRIS.screens['game'].rotateLeft();});
    }

    function getKeyCode(e) {
        var i = 0,
            duplicate = false;
        if(e.keyCode != 27){
            newKeyCode = e.keyCode;
            if (newKeyCode < 48 || newKeyCode > 90) {
                newKeyChar = getSymbols(newKeyCode).toUpperCase();
            }
            else {
                newKeyChar = String.fromCharCode(e.which).toUpperCase();
            }
            for (i; i < arrayID.length; i++) {
                if (arrayID[i].value === newKeyCode) {
                    duplicate = true;
                }
            }
            if (!duplicate) {
                updateControls();
            }
        }
    }

    function getSymbols(code){

        for(var i = 0; i < KeyCodes.length; i++)
        {
            if(KeyCodes[i].keyCode === code)
            {
                return KeyCodes[i].icon;
            }
        }
        return String.fromCharCode(code);
    }

    function updateControls(){
        var id = document.activeElement.id;

        if(id === 'left-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[0].value,newKeyCode);
            arrayID[0].value = newKeyCode;
            arrayID[0].key = newKeyChar;
        }
        else if(id === 'right-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[1].value, newKeyCode);
            arrayID[1].value = newKeyCode;
            arrayID[1].key = newKeyChar;
        }
        else if(id === 'soft-drop-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[4].value, newKeyCode);
            arrayID[4].value = newKeyCode;
            arrayID[4].key = newKeyChar;
        }
        else if(id === 'hard-drop-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[5].value, newKeyCode);
            arrayID[5].value = newKeyCode;
            arrayID[5].key = newKeyChar;
        }
        else if(id === 'left-rotate-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[2].value, newKeyCode);
            arrayID[2].value = newKeyCode;
            arrayID[2].key = newKeyChar;
        }
        else if(id === 'right-rotate-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[3].value, newKeyCode);
            arrayID[3].value = newKeyCode;
            arrayID[3].key = newKeyChar;
        }
        displayUserControls();
    }

    function addListener(){
        var id = document.activeElement.id,
            node = document.getElementById(id);
            node.addEventListener('keydown', getKeyCode,false);
    }

    function displayUserControls(){
        var node,
            i = 0;

        for(i ; i < arrayID.length; i++)
        {
            node = document.getElementById(arrayID[i].id);
            node.innerHTML = arrayID[i].key;
        }
    }


    function beginControlsMusic() {
        TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();

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


    function run() {
        var i = 0;
        var node;

        TETRIS.sounds['sounds/music/unsullied_memory.' + TETRIS.audioExt].pause();
        beginControlsMusic();


        displayUserControls();
        for(i; i < arrayID.length; i++)
        {
            node = document.getElementById(arrayID[i].id);
            node.addEventListener('focus', addListener);
        }
    }

    function setKeys() {
            KeyCodes = [
                {keyCode : 37, icon : 'left arrow'},
                {keyCode : 38, icon : 'up arrow'},
                {keyCode : 39, icon: 'right arrow'},
                {keyCode : 40, icon : 'down arrow'},
                {keyCode : 17, icon : 'ctrl'},
                {keyCode : 18, icon : 'alt'},
                {keyCode : 16, icon : 'shift'},
                {keyCode : 191, icon : '/'},
                {keyCode : 190, icon : '.'},
                {keyCode : 188, icon : ','},
                {keyCode : 20, icon : 'capslock'},
                {keyCode : 9, icon: 'tab'},
                {keyCode : 192, icon : '`'},
                {keyCode : 189, icon: '-'},
                {keyCode :187, icon: '='},
                {keyCode :8, icon : 'backspace'},
                {keyCode : 220, icon: '\\'},
                {keyCode :221, icon: ']'},
                {keyCode :219, icon: '['},
                {keyCode : 13, icon: 'enter'},
                {keyCode : 222, icon: '\''},
                {keyCode : 186, icon: ';'},
                {keyCode : 32, icon: 'space bar'},
                {keyCode : 33, icon: 'page up'},
                {keyCode : 34, icon: 'page down'},
                {keyCode : 36, icon: 'home'},
                {keyCode : 35, icon: 'end'}
            ];
    }

    function showBindText() {
        document.getElementById('controls-bind-text').style.visibility = 'visible';
    }

    function hideBindText() {
        document.getElementById('controls-bind-text').style.visibility = 'hidden';
    }

    return {
        init : init,
        hideBindText : hideBindText,
        run : run,
        showBindText : showBindText
    };
    }());