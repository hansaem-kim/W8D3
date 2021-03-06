// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i=0; i < 8; i++) {
    // grid[i] = new Array(8);
    grid.push(new Array(8));
  }


  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let row = pos[0];
  let column = pos[1];

  if ((row < 8 && row >= 0) && (column < 8 && column >= 0)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error ("Not valid pos!")
  }
  return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if(this.isOccupied(pos)){
    return this.grid[pos[0]][pos[1]].color === color;
  }
  return false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.grid[pos[0]][pos[1]] instanceof Piece;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  if(!piecesToFlip){
    piecesToFlip = [];
  }else{
    piecesToFlip.push(pos);
  }

  let tempPos = [pos[0] + dir[0], pos[1] + dir[1]];
  if(!this.isValidPos(tempPos) || !this.isOccupied(tempPos, color)){
    return [];
  }else if(this.isMine(tempPos, color)){
    return piecesToFlip;
  }else{
    return this._positionsToFlip(tempPos, color, dir, piecesToFlip)
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if(this.isOccupied(pos)){
    return false; 
  }

  posDirections = [[1, 1], [-1, 0], [0, -1], [1, -1], [-1,1], [1, 0], [0, 1], [-1, -1]];
  // let flipped = [];
  // let piecesToFlip = [];

  for(let i = 0; i < posDirections.length; i++){
    // let piecesToFlip = [];
    if(this._positionsToFlip(pos, color, posDirections[i]).length > 0){
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if(!this.validMove(pos, color)){
    throw new Error("Invalid move!");
  }

  this.grid[pos[0]][pos[1]] = new Piece(color);
  let posToFlip = [];

  for (let i = 0; i < posDirections.length; i++) {
    posToFlip = posToFlip.concat(this._positionsToFlip(pos, color, posDirections[i]));
  }
  // console.log(posToFlip);
  for(let i = 0; i < posToFlip.length; i++){
    this.getPiece(posToFlip[i]).flip()
  }

};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validPos = [];

  for(let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++) {
       if(this.validMove([i,j], color)){
         validPos.push([i,j]);
       } 
    }
  }
  return validPos;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if(this.hasMove("white") || this.hasMove("black")){
    return false;
  }
  return true;
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE