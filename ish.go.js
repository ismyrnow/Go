window.onload = function() {	
	Ish.Go.View.init();
}

var gGameState;

var Constants = new function() {
	this.Color = {
		BLACK : "black",
		WHITE : "white"
	};
	this.Direction = {
		NORTH : "north",
		EAST : "east",
		SOUTH : "south",
		WEST : "west",
		ALL : ["north", "east", "south", "west"]
	};
	this.PointState = {
		EMPTY : ".",
		BLACK : "X",
		WHITE : "O"
	};
	this.MoveError = {
		REPEAT : "The attempted move would result in a repeated board state.",
		OCCUPIED : "The selected intersection is occupied.",
		SUICIDE : "The attepted move would result in a suicide."
	};
	this.TerritoryOwner = {
		UNKNOWN : this.PointState.EMPTY,
		NEUTRAL : "-",
		BLACK : this.PointState.BLACK,
		WHITE : this.PointState.WHITE
	};
	this.GameStatus = {
		ACTIVE : "active",
		IDLE : "idle",
		ENDED : "ended"
	};
};

/**
 * OBJ: Defines changed points after a move is made.
 */
function MoveResult(player, newPoint, capturedPoints) {
    this.player = player;
    this.newPoint = newPoint;
    this.capturedPoints = capturedPoints;
}

/**
 * OBJ: Defines common attributes for board points/intersections.
 */
function Point(row, column) {
	this.row = row;
	this.column = column;
	this.getNeighborAt = function(side) {
		switch (side) {
			case Constants.Direction.NORTH:
				return new Point(this.row-1, this.column);
			case Constants.Direction.SOUTH:
				return new Point(this.row+1, this.column);
			case Constants.Direction.EAST:
				return new Point(this.row, this.column+1);
			case Constants.Direction.WEST:
				return new Point(this.row, this.column-1);
		}
	};
	this.toString = function() {
		return "(" + this.row + ", " + this.column + ")";
	};
	this.equals = function(other) {
		return (this.row == other.row &&
				this.column == other.column);
	};
	this.isInArray = function(array) {
		for (var i=0; i<array.length; i++) {
			if (this.equals(array[i])) {
				return true;
			}
		}
		return false;
	};
}

/**
 * OBJ: Defines common attributes for a territory.
 */
function Territory(points, owner) {
	this.points = points || new Array();
	this.owner = owner || Constants.TerritoryOwner.UNKNOWN;
}

/**
 * OBJ: Defines common attributes for a player.
 */
function Player(color, pointState, score) {
	this.color = color; 			// Constants.Color.(BLACK/WHITE)
	this.pointState = pointState;	// Constants.PointState.(BLACK/WHITE)
	this.score = score || 0;
	
	this.equals = function(other) {
		return (this.color == other.color);
	};	
	this.toString = function() {
		return this.color;
	};
}

/**
 * OBJ: Defines common attributes for a game of Go.
 */
function GameState(boardWidth, boardHeight, player1, player2, status) {	
	this.boardWidth = boardWidth;
	this.boardHeight = boardHeight;
	
	// Initialize board
	this.board = new Array(this.boardHeight);	
	for (var i = 0; i < this.boardHeight; i++) {
		this.board[i] = new Array(this.boardWidth);
		for (var j = 0; j < this.boardWidth; j++) {
			this.board[i][j] = Constants.PointState.EMPTY;
		}
	}
	
	this.previousBoard = $.extend(true, [], this.board);	
	this.player1 = player1;
	this.player2 = player2;	
	this.currentPlayer = player1;	
	this.moveError;
	this.status = status || Constants.GameStatus.ACTIVE;
	
	this.getPointStateAt = function(point) {
		return this.board[point.row][point.column];
	};
	this.setPointStateAt = function(point, pointState) {
		this.board[point.row][point.column] = pointState;
	};	
	this.isUniqueBoard = function() {
		// Compare board and previousBoard arrays
		for (var y = 0; y < this.boardHeight; y++) {
			for (var x = 0; x < this.boardWidth; x++) {
				if (this.board[y][x] != this.previousBoard[y][x]) {
					return true;
				}
			}
		}
		return false;
	};
	this.getBoardCopy = function() {
		return $.extend(true, [], this.board)
	};
	this.setBoardCopy = function(board) {
		this.board = $.extend(true, [], board);
	};
};