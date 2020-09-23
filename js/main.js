'use strict'

const MINE = '💣'
const FLAG = '🚩'
var size = 4

var gBoard;
function init() {
    var gBoard = buildBoard(2)
    createMines(2, gBoard)
    countMines(gBoard)
    renderBoard(gBoard)
}
function buildBoard(mineNum) {///input cells objects

    var size = 4;
    var board = [];
    console.log(cell, '111')
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = createCell(i, j)
            board[i][j] = cell
            // var currI = cell.position.i
            // var currJ = cell.position.j

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
    for (var x = 0; x < mineNum; x++) {
        console.log(x, 'x')
        console.log(size)
        var rndI = getRandomIntInclusive(0, size - 1)
        var rndJ = getRandomIntInclusive(0, size - 1)
        // console.log(board, 'board')
        // console.log(board[rndI][rndJ], 'randommm')
        board[rndI][rndJ].isMine = true
        // console.log(rndI, rndJ, 'randoms')
    }
    return board
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var currCell = board[i][j]
            var tdClass = `cell-${i}-${j}`;
            strHtml += `<td class="covered" class= "${tdClass}"  onclick="cellClicked(this,${i},${j})">`
            var elCell=document.querySelector(`${tdClass}`)
            // if (currCell.isShown === false) {
            //     // currCell.className=("covered")
            //     elCell.classList.add("covered")

            // }
            console.log(currCell)
            if (currCell.isMine === true) {
                strHtml += MINE
            } else if (currCell.minesAroundCount !== 0) {
                strHtml += `${currCell.minesAroundCount}`
            } else {
                strHtml += ` `

            }
            strHtml += '</td>';
            // console.log('cellclass,',currCell)
        }
        strHtml += '</tr>';
    }
    // console.log(board.length, 'board len')
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function cellClicked(elCell, i, j) {
    // elCell.innerText =
    elCell.innerText = 'danny'
    console.log(elCell, i, j)
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
    console.log('negs')
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




function renderCell(i, j, val) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = val;
}







// function createMine(board) {////when size comes from html-mine num  will change fix it
//     console.log(board)
//     var rndI = getRandomIntInclusive(0, size - 1)
//     var rndJ = getRandomIntInclusive(0, size - 1)
//     var cell = board[rndI][rndJ]
//     console.log('board', board)
//     console.log('randi,randj', rndI, rndJ)
//     console.log('cell', cell)
//     var elMine = document.querySelector(`.cell-${rndI}-${rndJ}`)
//     elMine.innerText=`${rndI},${rndJ}`
//     // elMine.innerText='rea'
//     console.log(rndI, rndJ)
//     console.log(elMine)
//     // elMine.innerHTML=
//     if (elMine.innerText === `${rndI},${rndJ}`) {
//         elMine.isMine=true
//         console.log('hey')
//         console.log(board)

//     }
// var mineNum = 2
// console.log('board 22' ,board)
// for (var i = 0; i <= 1; i++) {
//     if (cell.classList=`cell-${rndI}-${rndJ}`) {
//         cell.classList+='mone'
//         // cell.isMine = true
//     }
// }
// // console.log(board)
// renderBoard(board)
// console.log('cell',cell)
// }




// function createMine(board) {////when size comes from html-mine num  will change fix it
//     var rndI = getRandomIntInclusive(0, size - 1)
//     var rndJ = getRandomIntInclusive(0, size - 1)
//     var cell = board[rndI][rndJ]
//     var mineNum=2
//     for (var i = 0; i <= mineNum; i++) {
//         if (!cell.isMine) {
//             cell.isMine = true
//         }else{
//             cell.isMine=false
//         }
//         console.log(cell)
//     }
//     renderBoard(board)
//     // console.log('cell',cell)
// }


// function createMines(board) {////when size comes from html-mine num  will change fix it
//     var mineNum = 2
//     for (var i = 0; i < mineNum; i++) {
//         createMine(board)
//     }
//     renderBoard(board)
// }










// function setMinesNegsCount() {
//     console.log('hey')
// }





function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}
