"use strict"

const WALL = "WALL"
const FLOOR = "FLOOR"
const PASSEGE = "PASSEGE"

const BALL = "BALL"
const GAMER = "GAMER"
const GLUE = "GLUE"
const STUCK = "STUCK"

const STUCK_IMG = '\n\t\t<img src="img/gamer-purple.png">\n'
const GLUE_IMG = '\n\t\t<img src="img/spot.png">\n'
const GAMER_IMG = '\n\t\t<img src="img/gamer.png">\n'
const BALL_IMG = '\n\t\t<img src="img/ball.png">\n'

// Model:
var gBoard
var gGamerPos
var gInterval
var gSetTimeout
var gBallsCollectCount = 0
var gCollectBallAudio = new Audio("sounds/wee-sound-effect.mp3")

function initGame() {
  var elH2 = document.querySelector("h2")
  var elBtn = document.querySelector(".restart-btn")

  elH2.innerHTML = "Score:"
  elBtn.classList.add("hide")
  gBallsCollectCount = 0

  gGamerPos = { i: 2, j: 9 }
  gBoard = buildBoard()
  renderBoard(gBoard)
  gInterval = setInterval(addBalls, 3000)
}
function buildBoard() {
  var board = []

  // TODO: Create the Matrix 10 * 12
  board = createMat(10, 12)

  // TODO: Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = { type: FLOOR, gameElement: null }
      if (
        (i === 0 && j === 5) ||
        (i === board.length - 1 && j === 5) ||
        (i === 5 && j === 0) ||
        (i === 5 && j === board[i].length - 1)
      ) {
        board[i][j].type = PASSEGE
      } else if (i === 0 || i === board.length - 1) board[i][j].type = WALL
      else if (j === 0 || j === board[i].length - 1) board[i][j].type = WALL
    }
  }

  // TODO: Place the gamer and two balls
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
  board[4][7].gameElement = BALL
  board[3][3].gameElement = BALL

  // Place GLUE
  board[5][4].gameElement = GLUE
  board[2][8].gameElement = GLUE
  board[8][3].gameElement = GLUE
  board[3][2].gameElement = GLUE
  board[3][2].gameElement = GLUE
  board[7][7].gameElement = GLUE

  return board
}

function addBalls() {
  var emptyCells = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].type === FLOOR && gBoard[i][j].gameElement === null) {
        emptyCells.push({ i, j })
      }
    }
  }
  var randomIdx = getRandomIntInclusive(0, emptyCells.length - 1)
  var currIdx = emptyCells[randomIdx]

  gBoard[currIdx.i][currIdx.j].gameElement = BALL
  renderCell(currIdx, BALL_IMG)
}

// Render the board to an HTML table
function renderBoard(board) {
  var elBoard = document.querySelector(".board")
  var strHTML = ""

  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n"

    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]

      var cellClass = getClassName({ i, j })

      if (currCell.type === FLOOR) cellClass += " floor"
      if (currCell.type === PASSEGE) cellClass += " floor"
      else if (currCell.type === WALL) cellClass += " wall"

      strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">`

      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG
      }
      if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG
      }
      if (currCell.gameElement === GLUE) {
        strHTML += GLUE_IMG
      } else if (currCell.gameElement === STUCK) {
        strHTML += STUCK_IMG
      }

      strHTML += "\t</td>\n"
    }
    strHTML += "</tr>\n"
  }
  console.log("strHTML is:")
  console.log(strHTML)
  elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
  if (stopToMove(i, j)) {
    gSetTimeout = setTimeout(moveTo(i, j), 3000)
    clearTimeout(gSetTimeout)
  }
  var targetCell = gBoard[i][j]
  console.log(targetCell)
  if (targetCell.type === WALL) return
  if (targetCell.type === PASSEGE) {
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
    renderCell(gGamerPos, "")
    if (i === 0 && j === 5) {
      targetCell.gameElement = GAMER
      gGamerPos = { i: gBoard.length - 1, j }
      renderCell(gGamerPos, GAMER_IMG)
    }
    if (i === gBoard.length - 1) {
      targetCell.gameElement = GAMER
      gGamerPos = { i: 0, j }
      renderCell(gGamerPos, GAMER_IMG)
    }
    if (i === 5 && j === gBoard[i].length - 1) {
      targetCell.gameElement = GAMER
      gGamerPos = { i, j: 0 }
      renderCell(gGamerPos, GAMER_IMG)
    }
    if (j === 0) {
      targetCell.gameElement = GAMER
      gGamerPos = { i, j: gBoard[i].length - 1 }
      renderCell(gGamerPos, GAMER_IMG)
    }
  }
  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i)
  var jAbsDiff = Math.abs(j - gGamerPos.j)

  // If the clicked Cell is one of the four allowed
  if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
    if (targetCell.gameElement === BALL) {
      gCollectBallAudio.play()
      console.log("Collecting!")
      gBallsCollectCount++
      getCurrScore()
      targetCell.gameElement = ""
    }
    isGameOver()

    // TODO: Move the gamer
    // Update the Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

    // DOM:
    renderCell(gGamerPos, "")

    // Update the Model:
    targetCell.gameElement = GAMER
    gGamerPos = { i, j }

    // DOM:
    renderCell(gGamerPos, GAMER_IMG)
  } else console.log("TOO FAR", iAbsDiff, jAbsDiff)
  restartGame()
}

function getCurrScore() {
  var elH2 = document.querySelector(".score")
  elH2.innerText = `Score: ${gBallsCollectCount}`
}
function isGameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].gameElement === BALL) return false
    }
  }
  clearInterval(gInterval)
  return true
}

function restartGame() {
  if (isGameOver()) {
    var elBtn = document.querySelector(".restart-btn")
    elBtn.classList.remove("hide")
  } else return
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location)
  var elCell = document.querySelector(cellSelector)
  elCell.innerHTML = value
}
function stopToMove(i, j) {
  var targetCell = gBoard[i][j]
  if (targetCell.gameElement === GLUE) {
    return true
  }
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i
  var j = gGamerPos.j

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1)
      break
    case "ArrowRight":
      moveTo(i, j + 1)
      break
    case "ArrowUp":
      moveTo(i - 1, j)
      break
    case "ArrowDown":
      moveTo(i + 1, j)
      break
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j
  return cellClass
}
