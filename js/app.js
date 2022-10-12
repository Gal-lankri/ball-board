'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'

const BALL = 'BALL'
const GAMER = 'GAMER'

const GAMER_IMG = '\n\t\t<img src="img/gamer.png">\n'
const BALL_IMG = '\n\t\t<img src="img/ball.png">\n'

// Model:
var gBoard
var gGamerPos

function initGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    var board = []

    // TODO: Create the Matrix 10 * 12 
    board = createMat(10, 12)
    
    // TODO: Put FLOOR everywhere and WALL at edges
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            board[i][j] = { type: FLOOR, gameElement: null }
            if(i === 0 || i === board.length - 1) board[i][j].type = WALL
            else if(j === 0 || j === board[i].length - 1) board[i][j].type = WALL
        }
    }
    
    // TODO: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[4][7].gameElement = BALL
    board[3][3].gameElement = BALL

    console.log(board);
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    console.log('strHTML is:')
    console.log(strHTML)
    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {

    var targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i)
    var jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
        }

        // TODO: Move the gamer
        // Update the Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        
        // DOM:
        renderCell(gGamerPos, '')
        
        // Update the Model:
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        
        // DOM:
        renderCell(gGamerPos, GAMER_IMG)
        
    } else console.log('TOO FAR', iAbsDiff, jAbsDiff)

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i
    var j = gGamerPos.j


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break;
        case 'ArrowRight':
            moveTo(i, j + 1)
            break;
        case 'ArrowUp':
            moveTo(i - 1, j)
            break;
        case 'ArrowDown':
            moveTo(i + 1, j)
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

