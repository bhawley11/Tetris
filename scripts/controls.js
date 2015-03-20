/**
 * Created by Brenton on 3/18/2015.
 */

TETRIS.screens['controls'] = (function() {
    'use strict';
    var arrayID = [{key: 'A',id : 'left-control', value : KeyEvent.DOM_VK_A},{key : 'D', id: 'right-control', value : KeyEvent.DOM_VK_D},{key : 'Q', id: 'left-rotate-control', value: KeyEvent.DOM_VK_Q},
            {key : 'E', id: 'right-rotate-control', value:KeyEvent.DOM_VK_E},{key : 'S', id: 'soft-drop-control',value:KeyEvent.DOM_VK_S},{key : 'X', id:'hard-drop-control', value:KeyEvent.DOM_VK_X}],
        newKeyCode,
        newKeyChar;

    function init() {
        document.getElementById('controls-back').addEventListener('click', function () {
            TETRIS.main.showScreen('menu');
        }, false);
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_A, function() {TETRIS.game.moveLeft();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_D, function() {TETRIS.game.moveRight();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_S, function() {TETRIS.game.softDrop();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_X, function() {TETRIS.game.hardDrop();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_E, function() {TETRIS.game.rotateRight();});
        TETRIS.keyboard.registerCommand(KeyEvent.DOM_VK_Q, function() {TETRIS.game.rotateLeft();});
    }

    function getKeyCode(e) {
        newKeyCode = e.keyCode;
        newKeyChar = String.fromCharCode(newKeyCode);
        updateControls();
    }

    function updateControls(){
        var id = document.activeElement.id;

        TETRIS.keyboard.printHandlers();

        if(id === 'left-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[0].value);
            TETRIS.keyboard.registerCommand(newKeyCode, function() {TETRIS.game.moveLeft();});
            arrayID[0].value = newKeyCode;
            arrayID[0].key = newKeyChar;
        }
        else if(id === 'right-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[1].value);
            TETRIS.keyboard.registerCommand(newKeyCode, function() {TETRIS.game.moveRight();});
            arrayID[1].value = newKeyCode;
            arrayID[1].key = newKeyChar;
        }
        else if(id === 'soft-drop-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[4].value);
            TETRIS.keyboard.registerCommand(newKeyCode, function() {TETRIS.game.softDrop();});
            arrayID[4].value = newKeyCode;
            arrayID[4].key = newKeyChar;
        }
        else if(id === 'hard-drop-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[5]);
            TETRIS.keyboard.registerCommand(newKeyCode, function() {TETRIS.game.softDrop();});
            arrayID[5].value = newKeyCode;
            arrayID[5].key = newKeyChar;
        }
        else if(id === 'left-rotate-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[2]);
            TETRIS.keyboard.registerCommand(newKeyCode, function(){TETRIS.game.softDrop();});
            arrayID[2].value = newKeyCode;
            arrayID[2].key = newKeyChar;
        }
        else if(id === 'right-rotate-control')
        {
            TETRIS.keyboard.unregisterCommand(arrayID[3]);
            TETRIS.keyboard.registerCommand(newKeyCode, function() {TETRIS.game.softDrop();});
            arrayID[3].value = newKeyCode;
            arrayID[3].key = newKeyChar;
        }

        TETRIS.keyboard.printHandlers();

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
            node.innerHTML = arrayID[i].key + ' Key';
        }
    }

    function run() {
        var i = 0;
        var node;
        displayUserControls();
        for(i; i < arrayID.length; i++)
        {
            node = document.getElementById(arrayID[i].id);
            node.addEventListener('focus', addListener);
        }
    }

    return {
        init : init,
        run : run
    };
}());