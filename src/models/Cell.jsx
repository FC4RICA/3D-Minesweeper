class Cell {
  constructor(isMined, adjacentMines, isRevealed = false, isFlagged = false) {
    this.isMined = isMined
    this.adjacentMines = adjacentMines
    this.isRevealed = isRevealed
    this.isFlagged = isFlagged
  }
}

export default Cell;