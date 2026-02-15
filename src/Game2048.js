export default class Game2048 {
  constructor() {
    this.rows = 4
    this.columns = 4
    this.score = 0
    this.board = []
    this.isGameOver = false
    this.reset()
  }

  reset() {
    this.score = 0
    this.isGameOver = false
    this.board = Array.from({length: this.rows}, () => Array(this.columns).fill(0))
    this.addNewTile()
    this.addNewTile()
  }

  getNormalizedBoard() {
    return this.board.flat().map(val => val === 0 ? 0 : Math.log2(val))
  }

  addNewTile() {
    let emptyTiles = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push({r, c})
        }
      }
    }
    if (emptyTiles.length > 0) {
      let {r, c} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
      this.board[r][c] = Math.random() < 0.9 ? 2 : 4
      return true
    }
    return false
  }

  slideRow(row) {
    let filtered = row.filter(num => num !== 0)
    let scoreAdd = 0

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2
        scoreAdd += filtered[i]
        filtered[i + 1] = 0
      }
    }

    filtered = filtered.filter(num => num !== 0);
    while (filtered.length < 4) {
      filtered.push(0)
    }
    return { newRow: filtered, score: scoreAdd }
  }

  move(direction) {
    if (this.isGameOver) return { moved: false, score: 0 }

    let moved = false
    let scoreGained = 0
    let oldBoardJSON = JSON.stringify(this.board)


    if (direction === "left") {
      for (let r = 0; r < this.rows; r++) {
        let result = this.slideRow(this.board[r]);
        this.board[r] = result.newRow
        scoreGained += result.score
      }
    }
    else if (direction === "right") {
      for (let r = 0; r < this.rows; r++) {
        let row = this.board[r].slice().reverse()
        let result = this.slideRow(row)
        this.board[r] = result.newRow.reverse()
        scoreGained += result.score
      }
    }
    else if (direction === "up") {
      for (let c = 0; c < this.columns; c++) {
        let row = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]]
        let result = this.slideRow(row)
        for (let r = 0; r < this.rows; r++) {
          this.board[r][c] = result.newRow[r]
        }
        scoreGained += result.score
      }
    }
    else if (direction === "down") {
      for (let c = 0; c < this.columns; c++) {
        let row = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]].reverse()
        let result = this.slideRow(row)
        let newCol = result.newRow.reverse()
        for (let r = 0; r < this.rows; r++) {
          this.board[r][c] = newCol[r]
        }
        scoreGained += result.score
      }
    }

    if (JSON.stringify(this.board) !== oldBoardJSON) {
      moved = true;
      this.score += scoreGained
      this.addNewTile()

      if (!this.canMove()) {
        this.isGameOver = true
      }
    }

    return { moved, score: scoreGained }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) return true}}

    for (let r = 0; r < this.rows; r++){
      for (let c = 0; c < this.columns; c++){
        if (c < this.columns - 1){if (this.board[r][c] === this.board[r][c + 1]) return true}
        if (r < this.rows - 1){if (this.board[r][c] === this.board[r + 1][c]) return true}
      }
    }


    return false
  }
}