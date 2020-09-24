'use strict'
const MINE = '💣'
const FLAG = '🚩'
var gSize = 4
var gBoard;
var gMineNum = 2
var gLives = 3
var gTimerInterval;
var gFirstnum = 0
var gFlagsCount = 0
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var victory = false
var cellCount;

function init() {
    gBoard = buildBoard(gMineNum, gSize)
    createMines(2, gBoard)
    countMines(gBoard)
    renderBoard(gBoard)
    createStatus()
    cellCount = 0
    gLives = 3
    gFlagsCount = 0
    gFirstnum = 0
    if (gTimerInterval) clearInterval(gTimerInterval)
    var elBtn = document.querySelector('.smiley-btn')
    elBtn.innerText = createStatus()
    var elLives = document.querySelector(".lives")
    elLives.innerText = `Lives left: ${gLives}`
}

function buildBoard(mineNum, size) {
    var board = [];
    console.log(cell, '111')
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = createCell(i, j)
            board[i][j] = cell
        }
    }
    board = createMines(mineNum, board)
    return board
}

function createCell(i, j) {
    var cell = {
        position: {
            i: i,
            j: j
        },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    };
    return cell
}
function createMines(mineNum, board) {
    console.log('create mines')
    for (var x = 0; x < mineNum - 1; x++) {
        // console.log(boar)
        var rndI = getRandomIntInclusive(0, board.length - 1)////check!!
        var rndJ = getRandomIntInclusive(0, board.length - 1)
        board[rndI][rndJ].isMine = true
    }
    return board
}

function renderCell(i, j, currCell, board) {
    var strCell = ''
    var tdClass = `cell-${i}-${j}`;
    strCell += `<td class="covered"   
        onclick="cellClicked(this,${i},${j},event)" oncontextmenu="onRightClick(event,${i},${j})">`
    if (currCell.isMarked === true) {
        strCell += FLAG
    } else {
        if (currCell.isShown === false) {
            strCell += ''
        } else if (currCell.isMine === true) {
            strCell += MINE
        } else if (currCell.minesAroundCount !== 0) {
            strCell += `${currCell.minesAroundCount}`
        } else if (currCell.isMarked === true) {
            strCell += FLAG
        } else {
            strCell += `.`
        }
    }
    strCell += '</td>';
    return strCell
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var currCell = board[i][j]
            strHtml += renderCell(i, j, currCell)
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function onRightClick(event, i, j) {
    event.preventDefault();
    gBoard[i][j].isMarked = true
    gFlagsCount++
    checkVictory()
    renderBoard(gBoard)
}

function cellClicked(elCell, i, j, event) {
    while (gFirstnum === 0 && gBoard[i][j].isMine === true) {
        init()
    }
    gFirstnum++
    var currCell = gBoard[i][j]
    gBoard[i][j].isShown === true
    // var elCover = document.querySelector(".covered")
    // console.log(elCover)
    // elCover.classList.remove("covered")
    // console.log(elCover)
    cellCount++
    if (cellCount === 1) {
        startTimer()
    }
    if (currCell.isMine) {
        currCell.isShown = true
        minusLife()
        var elLives = document.querySelector('.lives')
        elLives.innerText = `Lives left: ${gLives}`
        if (gLives === 0) {

            gameOver()
        } else if (gLives < 0) {
            elLives.innerText = 'GAME OVER!'
        }

    }
    cellOpening(i, j)
    checkVictory()
    renderBoard(gBoard)
}

function createStatus() {
    var elStatus = document.querySelector('.smiley-btn')
    if (+gLives > 0) {
        elStatus.innerText = '😃'
    } else if (gLives === 0 && gGame.isOn === false) {
        elStatus.innerText = '😡'
    }
    return elStatus.innerText
}

function countMinesLocal(board, rowIdx, colIdx) {
    var countNegs = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                (j < 0 || j > board.length - 1)) continue;
            var cell = board[i][j];
            if (cell.isMine) countNegs++;
        }
    }
    return countNegs
}
function countMines(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        for (var j = 0; j < row.length; j++) {
            board[i][j].minesAroundCount = countMinesLocal(board, i, j)
        }
    }
    return board
}

function cellOpening(i, j) {
    if (i < 0 || j < 0 || i > gBoard[0].length - 1 || j > gBoard[0].length - 1) return
    if (gBoard[i][j].isMine === true) return
    if (gBoard[i][j].isShown === true) return
    gBoard[i][j].isShown = true
    if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
        cellOpening(i - 1, j)///recurssion
        cellOpening(i + 1, j)
        cellOpening(i, j + 1)
        cellOpening(i, j - 1)
    }
}

function minusLife() {
    gLives--
    return gLives
}

function gameOver() {
    var elLives = document.querySelector(".lives")
    var elTime = document.querySelector(".timer")
    elLives.innerText = 'GAME OVER!'
    elTime.innerText = ''
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine === true) {
                cell.isShown = true
            }
        }
    }
    renderBoard(gBoard)
    clearInterval(gTimerInterval)
    createStatus()
}
function chooseLevel(level, mineNum) {
    gSize = level
    gMineNum = mineNum
    init()
}
function checkVictory() {
    var pointCounter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine === true && cell.isMarked === true) {
                pointCounter++
            }
        }
    }
    if (pointCounter === gMineNum && gMineNum === gFlagsCount) {
        alert('Victory!!')
        var elStatus = document.querySelector('.smiley-btn')
        elStatus.innerText = '😁'
        var elLives = document.querySelector(".lives")
        elLives.innerText = 'GREAT JOB!'
        clearInterval(gTimerInterval)
        var timer = document.querySelector(".timer");
        timer.innerText = 'AWESOME!'
    }
}
function startTimer() {
    var timer = document.querySelector(".timer");
    var sec = 1
    var min = 0;
    gTimerInterval = setInterval(function () {
        timer.innerHTML = `${min} ${sec}`;
        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }
    }, 1000);
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}
