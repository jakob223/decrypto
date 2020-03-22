var wordList;

function loadWordList() {
    var wordList;

    $.ajax({
        url: "wordlist.txt",
        dataType: "text",
        success: function(data) {
            wordList = data.split("\n");
        },
        async: false
    });
    return wordList;
}

function pickWords(numWords, seed) {
    return sample(wordList, numWords, seed);
}

function generateCode() {
    var code = _.sample([1, 2, 3, 4], 3);
    Cookies.set("code", code);
    setCode(code);
    $('#codeModal').modal('show');
}

function setCode(code) {
    for (idx = 0; idx < 3; idx++) {
        $('#code' + idx).text(code[idx]);
    }
    $('#revealCodeButton').show();
}

function setWords(words) {
    for (idx = 0; idx < 4; idx++) {
        $('#word' + idx).text(words[idx]);
    }
}

function loadWords() {
    return Cookies.getJSON("words");
}

function loadCode() {
    var code = Cookies.getJSON("code");
    if (code) {
        setCode(code);
    } else {
        $('#revealCodeButton').hide();
    }
}

function newGame(roomCode, team) {
    var words = pickWords(4, roomCode + team);
    Cookies.set("words", words);
    Cookies.remove("code");
    $('#revealCodeButton').hide();
    return words;
}

function toggleFullScreen() {
    if (screenfull.isFullscreen) {
        screenfull.exit();
    } else {
        screenfull.request();
    }
    setFullScreenIcon();
}

function setFullScreenIcon() {
    if (screenfull.isFullscreen) {
        $('#enableFullScreen').hide();
        $('#disableFullScreen').show();
    } else {
        $('#enableFullScreen').show();
        $('#disableFullScreen').hide();
    }
}

function startNewGame() {
    var roomCode = document.getElementById("roomCode").value;
    var team = document.getElementById('red').checked ? 'red' : document.getElementById('blue').checked ? 'blue' : ''
    if ((roomCode && !team) || (!roomCode && team)) {
        alert("If you select one of a room code and a team, you must also select the other too.")
        return;
    }
    setWords(newGame(roomCode, team));
}

function disableScreenLock() {
    var noSleep = new NoSleep();
    noSleep.enable();
}

function initScreenfull() {
    var noSleep = new NoSleep();

    if (screenfull.enabled) {
        screenfull.on('change', () => {
            if (screenfull.isFullscreen) {
                noSleep.enable();
            } else {
                noSleep.disable();
            }
        });
        setInterval(setFullScreenIcon, 200);
    } else {
        $('#fullScreenButton').hide();
        $('#disableScreenLockModal').modal('show');
    }
}

function initialize() {
    initScreenfull();

    wordList = loadWordList();
    loadCode();

    var words = loadWords();

    if (words) {
        setWords(words);
    } else {
        /*
        startNewGame();
        $('#newGameModalCancelButton').hide();
        $('#newGameModal').modal({
        	show: true,
        	keyboard: false,
        	backdrop: 'static'
        });
        */
        $('#newGameModal').modal('show');
    }
}


function forceInputUppercase(e) {
    var start = e.target.selectionStart;
    var end = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(start, end);
}

function sample(arr, n, seed) {
    var myrng = seed ? new Math.seedrandom(seed) : Math.random

    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(myrng() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}