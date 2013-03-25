window.Game = (function() {

    var version = '0.1'
      , _clock = null
      , _rate = 10
      , _tick = 0

      , _debug = true
      , _paused = false
      , _controllers = [{}]

      , _screen = 'start'
      , _data = {
            'start': {
                selected: 1
            }

          , 'game': {
                config: {
                    controllers: 1
                }
              , turns: 0
              , player: 1
              , selected: {
                    x: 1
                  , y: 1
                }
            }

          , 'pause': {
            }

          , 'credits': {
            }
         }

      , log = function(msg) {
            if (_debug) {
                console.log(msg);
            }
        }

      , getScreen = function() {
            return _screen;
        }

      , setScreen = function(screenId) {
            var screens = $$('.screen')
              , activated = false
            ;

            [].forEach.call(screens, function(screen) {
                if (screen.id == screenId + '-screen') {
                    screen.style.display = 'block';
                    activated = true;
                } else {
                    screen.style.display = 'none';
                }
            });

            if (activated) {
                _screen = screenId;
            } else {
                xouya.showToast('unhandled screen: ' + screenId);
            }
        }
/*
      , animLoop = function() {
            window.cancelAnimFrame(_clock);
            _tick++;

            if (_tick % _rate == 0) {
                _controllers = pollControllers();
                msgbus.publish('game/tick');
            }

            _clock = window.requestAnimFrame(animLoop);
        }
*/
      , start = function() {
            // first run, initialize and load the start screen
            _data.game.config.controllers = 1;
            _data.start.selected = 1;                   // main menu
            _data.game.selected = { x: 1, y: 1 };       // game board
            //_clock = window.requestAnimFrame(animLoop);
            clearBoard();

            $('#option-controllers span.option').innerHTML = _data.game.config.controllers;

            setScreen('start');
            log('game started');
        }

      , isPaused = function() {
            return _paused;
        }

      , pause = function() {
            //window.cancelAnimFrame(_clock);
            $('#pause-screen').style.display = 'block';
            _paused = true;
        }

      , unpause = function() {
            //_clock = window.requestAnimFrame(animLoop);
            $('#pause-screen').style.display = 'none';
            _paused = false;
        }

      , setDebug = function(state) {
            _debug = state;
        }

      , clearBoard = function() {
            for (var y=0; y<3; y++) {
                for (var x=0; x<3; x++) {
                    var targetId = '#cell' + y + x;
                    $(targetId).innerHTML = '';
                }
            }
        }

      , checkBoard = function() {
            var maxTurns = 5
              , winFound = false
              , board = [
                    [0,0,0]
                  , [0,0,0]
                  , [0,0,0]
                ]
              , count = 0
            ;

            // copy the board 
            for (var y=0; y<3; y++) {
                for (var x=0; x<3; x++) {
                    var targetId = '#cell' + y + x
                      , targetContents = $(targetId).textContent
                    ;
                    board[y][x] = targetContents;
                    if (targetContents != '') {
                        count++;
                    }
                }
            }

            // check full board (stalemate)
            if (count == 9) {
                winFound = 3;
            }

            // scan rows
            for (var y=0; y<3; y++) {
                if (board[y][0] == board[y][1] && board[y][1] == board[y][2] && board[y][1] != '') {
                    winFound = (board[y][1] == 'X') ? 1 : 2;
                }
            }

            // scan columns
            for (var x=0; x<3; x++) {
                if (board[0][x] == board[1][x] && board[1][x] == board[2][x] && board[1][x] != '') {
                    winFound = (board[1][x] == 'X') ? 1 : 2;
                }
            }

            // scan top left to bottom right
            if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] != '') {
                winFound = (board[1][1] == 'X') ? 1 : 2;
            }

            // scan top right to bottom left
            if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[1][1] != '') {
                winFound = (board[1][1] == 'X') ? 1 : 2;
            }

            return winFound || (_data.game.turns > maxTurns);
        }
    ;

    return {
        version: version
      , start: start
      , pause: pause
      , unpause: unpause
      , isPaused: isPaused
      , setDebug: setDebug
      , log: log
      , setScreen: setScreen
      , getScreen: getScreen
      , data: _data
      , clearBoard: clearBoard
      , checkBoard: checkBoard
    }
})();

msgbus.subscribe('game/tick', function(topic) {
    // anim logic
});

msgbus.subscribe('hardware/menu', function(topic, data) {
//    xouya.finish();
});

msgbus.subscribe('hardware/controller', function(topic, cData) {
    // only accept input from current player's controller (while playing)
    if (Game.data.game.config.controllers == 2) {
        if (Game.getScreen() == 'game' && ((cData.player+1) != Game.data.game.player)) {
            return;
        }
    }

    if (cData) {
        var mode = Game.getScreen()
          , msg = ''
        ;

        if (cData.o == 1) {
            msg += 'o: ';

            switch (mode) {
                case 'start':
                    var targets = ['start', 'game', 'options', 'credits'];
                    var target = targets[Game.data.start.selected];

                    // launch a new game
                    if (target == 'game') {
                        Game.data.game.turns = 0;
                        Game.clearBoard();

                        var targetId = '#cell11'
                          , targetCell = $(targetId)
                          , targetCellX = parseInt(getComputedStyle(targetCell).left)
                          , targetCellY = parseInt(getComputedStyle(targetCell).top)
                        ;
                        $('#cell-selector').style.top = (targetCellY + 1) + 'px';
                        $('#cell-selector').style.left = (targetCellX + 1) + 'px';
                        $('#cell-selector').style.display = 'block';
                        msgbus.publish('game/turn/player1');
                    }

                    msg += 'set screen: ' + target;
                    Game.setScreen(target);
                    break;

                case 'game':
                    msgbus.publish('game/game/select');
                    break;

                case 'pause':
                    msg += 'select';
                    break;

                default:
                    msg += 'unhandled: ' + mode;
            }

        }

        if (cData.u == 1) {
            msg += 'u';
        }

        if (cData.y == 1) {
            msg += 'y';

            switch (mode) {
                case 'start':
                    break;

                case 'game':
                case 'pause':
                    if (Game.isPaused()) {
                        Game.unpause();
                    } else {
                        Game.pause();
                    }
                    break;

                default:
            }
        }

        if (cData.a == 1) {
            msg += 'a';

            switch(mode) {
                case 'start':
                    break;

                case 'game':
                case 'credits':
                    Game.setScreen('start');
                    break;

                case 'pause':
                    break;

                default:
                    Game.setScreen('start');
            }
        }

        if (cData.l1 == 1) {
            msg += 'l1';
        }

        if (cData.r1 == 1) {
            msg += 'r1';
        }

        if (cData.dpad.up == 1) {
            msg += 'up';

            switch(mode) {
                case 'start':
                    msgbus.publish('game/start/up');
                    break;

                case 'game':
                    msgbus.publish('game/game/up');
                    break;

                case 'pause':
                default:
            }
        }

        if (cData.dpad.down == 1) {
            msg += 'down';

            switch (mode) {
                case 'start':
                    msgbus.publish('game/start/down');
                    break;

                case 'game':
                    msgbus.publish('game/game/down');
                    break;

                case 'pause':
                default:
            }
        }

        if (cData.dpad.left == 1) {
            msg += 'left';
            switch (mode) {
                case 'game':
                    msgbus.publish('game/game/left');
                    break;

                case 'options':
                    msgbus.publish('game/options/left');
                    break;

                case 'start':
                case 'pause':
                default:
            }
        }

        if (cData.dpad.right == 1) {
            msg += 'right: ';
            switch (mode) {
                case 'game':
                    msgbus.publish('game/game/right');
                    break;

                case 'options':
                    msgbus.publish('game/options/right');
                    break;

                case 'start':
                case 'pause':
                default:
            }
        }

        if (cData.l3 == 1) {
            msg += 'l3: ';
        }

        if (cData.r3 == 1) {
            msg += 'r3: ';
        }

        //xouya.showToast(msg);
        //updateDebugPanels(cData);
    }
});


/* == Start Screen == */
msgbus.subscribe('game/start/up', function(topic, data) {
    var currentSelection = Game.data.start.selected
      , newSelection = (currentSelection > 1) ? currentSelection - 1 : 1
    ;

    Game.data.start.selected = newSelection;
    msgbus.publish('game/start/paint');
});

msgbus.subscribe('game/start/down', function(topic, data) {
    var currentSelection = Game.data.start.selected
      , newSelection = (currentSelection < 3) ? currentSelection + 1 : 3
    ;

    Game.data.start.selected = newSelection;
    msgbus.publish('game/start/paint');
});

msgbus.subscribe('game/start/paint', function(topic, data) {
    var buttons = $$('button')
      , selected = Game.data.start.selected
    ;

    [].forEach.call(buttons, function(button) {
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
        }
    });

    buttons[selected-1].classList.add('selected');
});


/* == Game Screen == */
// Move the active cell up (dpad up)
msgbus.subscribe('game/game/up', function(topic, data) {
    var currentSelectionX = Game.data.game.selected.x
      , currentSelectionY = Game.data.game.selected.y
      , newSelectionX = currentSelectionX
      , newSelectionY = (currentSelectionY > 0) ? currentSelectionY - 1 : 0
    ;

    Game.data.game.selected.x = newSelectionX;
    Game.data.game.selected.y = newSelectionY;

    msgbus.publish('game/game/paint');
});

// Move the active cell down (dpad down)
msgbus.subscribe('game/game/down', function(topic, data) {
    var currentSelectionX = Game.data.game.selected.x
      , currentSelectionY = Game.data.game.selected.y
      , newSelectionX = currentSelectionX
      , newSelectionY = (currentSelectionY < 2) ? currentSelectionY + 1 : 2
    ;

    Game.data.game.selected.x = newSelectionX;
    Game.data.game.selected.y = newSelectionY;

    msgbus.publish('game/game/paint');
});

// Move the active cell left (dpad left)
msgbus.subscribe('game/game/left', function(topic, data) {
    var currentSelectionX = Game.data.game.selected.x
      , currentSelectionY = Game.data.game.selected.y
      , newSelectionX = (currentSelectionX > 0) ? currentSelectionX - 1 : 0
      , newSelectionY = currentSelectionY
    ;

    Game.data.game.selected.x = newSelectionX;
    Game.data.game.selected.y = newSelectionY;

    msgbus.publish('game/game/paint');
});

// Move the active cell right (dpad right)
msgbus.subscribe('game/game/right', function(topic, data) {
    var currentSelectionX = Game.data.game.selected.x
      , currentSelectionY = Game.data.game.selected.y
      , newSelectionX = (currentSelectionX < 2) ? currentSelectionX + 1 : 2
      , newSelectionY = currentSelectionY
    ;

    Game.data.game.selected.x = newSelectionX;
    Game.data.game.selected.y = newSelectionY;

    msgbus.publish('game/game/paint');
});

// Select the active cell on the gameboard (O)
msgbus.subscribe('game/game/select', function(topic, data) {
    var targetId = '#cell' + Game.data.game.selected.y + Game.data.game.selected.x
      , targetCell = $(targetId)
      , targetCellX = parseInt(getComputedStyle(targetCell).left)
      , targetCellY = parseInt(getComputedStyle(targetCell).top)
      , currentPlayer = Game.data.game.player
      , activated = false
    ;

    if (targetCell.innerHTML == '') {
        if (currentPlayer == 1) {
            targetCell.innerHTML = '<span style="color:#00f;">X</span>';
            activated = true;
        } else {
            targetCell.innerHTML = '<span style="color:#f00;">O</span>';
            activated = true;
        }
    }

    var checkEndCondition = Game.checkBoard();
    if (checkEndCondition) {
        switch (checkEndCondition) {
            case 1:
                msgbus.publish('game/over/player1');
                break;

            case 2:
                msgbus.publish('game/over/player2');
                break;

            case 3:
                msgbus.publish('game/over/stalemate');
                break;

            default:
                xouya.showToast('unhandled end condition: ' + checkEndCondition);
        }

    } else {
        if (activated) {
            if (currentPlayer == 1) {
                msgbus.publish('game/turn/player2');
            } else {
                msgbus.publish('game/turn/player1');
            }
        }
    }
});

// Update the Game Screen
msgbus.subscribe('game/game/paint', function(topic, data) {
    var targetId = '#cell' + Game.data.game.selected.y + Game.data.game.selected.x
      , targetCell = $(targetId)
      , targetCellX = parseInt(getComputedStyle(targetCell).left)
      , targetCellY = parseInt(getComputedStyle(targetCell).top)
      , cellSelector = $('#cell-selector')
    ;

    cellSelector.style.left = (targetCellX + 1) + 'px';
    cellSelector.style.top = (targetCellY + 1) + 'px';
});


/* == Turn Handling == */
msgbus.subscribe('game/turn/player1', function(topic, data) {
    //xouya.showToast('Turn ' + Game.data.game.turns + ' Player 1');
    Game.data.game.player = 1;
    $('#cell-selector').style.backgroundColor = 'rgba(192,192,255,0.5)';

    Game.data.game.turns++;
});

msgbus.subscribe('game/turn/player2', function(topic, data) {
    //xouya.showToast('Turn ' + Game.data.game.turns + ' Player 2');
    Game.data.game.player = 2;
    $('#cell-selector').style.backgroundColor = 'rgba(255,192,192,0.5)';
});


/* == Game Over == */
msgbus.subscribe('game/over/player1', function(topic, data) {
    $('#cell-selector').style.display = 'none';
    xouya.showToast('GAME OVER: PLAYER 1 WINS');
    setTimeout(function() { Game.setScreen('start'); }, 3000);
});

msgbus.subscribe('game/over/player2', function(topic, data) {
    $('#cell-selector').style.display = 'none';
    xouya.showToast('GAME OVER: PLAYER 2 WINS');
    setTimeout(function() { Game.setScreen('start'); }, 3000);
});

msgbus.subscribe('game/over/stalemate', function(topic, data) {
    $('#cell-selector').style.display = 'none';
    xouya.showToast('GAME OVER: STALEMATE');
    setTimeout(function() { Game.setScreen('start'); }, 3000);
});


/* == Options Screen == */
msgbus.subscribe('game/options/left', function(topic, data) {
    Game.data.game.config.controllers = 1;
    msgbus.publish('game/options/paint');
});

msgbus.subscribe('game/options/right', function(topic, data) {
    Game.data.game.config.controllers = 2;
    msgbus.publish('game/options/paint');
});

msgbus.subscribe('game/options/paint', function(topic, data) {
    $('#option-controllers span.option').innerHTML = Game.data.game.config.controllers;
});

/*
function updateDebugPanels(cData) {
    // controller debug panels
    var domRoot = $('#controller' + (cData.player + 1));
    if (domRoot) {
        var fieldRoot = '#c' + (cData.player +1)
          , stickThreshold = 0.2
          , triggerThreshold = 0.2
          , lsx1 = (cData.ls.x > stickThreshold) ? parseFloat(cData.ls.x).toFixed(2) : 0
          , lsy1 = (cData.ls.y > stickThreshold) ? parseFloat(cData.ls.y).toFixed(2) : 0
          , rsx1 = (cData.rs.x > stickThreshold) ? parseFloat(cData.rs.x).toFixed(2) : 0
          , rsy1 = (cData.rs.y > stickThreshold) ? parseFloat(cData.rs.y).toFixed(2) : 0
          , l21 = (cData.l2 > triggerThreshold) ? parseFloat(cData.l2).toFixed(2) : 0
          , r21 = (cData.r2 > triggerThreshold) ? parseFloat(cData.r2).toFixed(2) : 0
        ;

        lsx1 = (cData.ls.x < stickThreshold*-1) ? parseFloat(cData.ls.x).toFixed(2) : lsx1;
        lsy1 = (cData.ls.y < stickThreshold*-1) ? parseFloat(cData.ls.y).toFixed(2) : lsy1;
        rsx1 = (cData.rs.x < stickThreshold*-1) ? parseFloat(cData.rs.x).toFixed(2) : rsx1;
        rsy1 = (cData.rs.y < stickThreshold*-1) ? parseFloat(cData.rs.y).toFixed(2) : rsy1;

        $(fieldRoot + '_o').value = cData.o;
        $(fieldRoot + '_u').value = cData.u;
        $(fieldRoot + '_y').value = cData.y;
        $(fieldRoot + '_a').value = cData.a;

        $(fieldRoot + '_lsx').value = lsx1;
        $(fieldRoot + '_lsy').value = lsy1;
        $(fieldRoot + '_rsx').value = rsx1;
        $(fieldRoot + '_rsy').value = rsy1;
        $(fieldRoot + '_l2').value = l21;
        $(fieldRoot + '_r2').value = r21;
    }
}
*/
