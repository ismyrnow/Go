// Ish.Go namespace declaration
var Ish = Ish || {};
Ish.Go = Ish.Go || {};

// begin Ish.Go.View namespace
Ish.Go.View = new function() {

	var isBoardMarked = false;
	
	/**
	 * Prints scores on web page
	 */
	this.printScores = function(aId) {	
		var id = aId || "score";
		
		Ish.Go.Logic.setScores();
		
		var p1 = gGameState.player1;
		var p2 = gGameState.player2;
		
		$("#" + id).html("Score:" +
			"<br>&nbsp;&nbsp;" +
			p1.color + ": " + p1.score +
			"<br>&nbsp;&nbsp;" +
			p2.color + ": " + p2.score);
	};

	/**
	 * Prints color of current turn on web page
	 */
	this.printTurn = function(aId) {
		var id = aId || 'turn';
		$("#" + id).text("Current turn: " + gGameState.currentPlayer.toString());
	};

	/**
	 * Prints board on web page
	 */
	this.printBoard = function(aId) {
		var id = aId || 'board';
		var sBoard = "";
		
		for (var y = 0; y < gGameState.boardHeight; y++) {
			for (var x = 0; x < gGameState.boardWidth; x++) {
				var point = new Point(y, x);
				sBoard += "<span class='point' onclick='Ish.Go.Logic.move(" + y + "," + x + ");Ish.Go.View.redraw()'>";
				sBoard += " " + gGameState.getPointStateAt(point) + " ";
				sBoard += "</span>";
			}
			sBoard += "<br>";
		}
		$("#" + id).html(sBoard);
	};

	/**
	 * Prints board marked with territies on web page
	 */
	this.printMarkedBoard = function(aId) {
		var id = aId || 'board';
		var markedBoard = Ish.Go.Logic.getMarkedBoard();
		var sBoard = "";
		
		for (var y = 0; y < gGameState.boardHeight; y++) {
			for (var x = 0; x < gGameState.boardWidth; x++) {
				sBoard += "<span class='point marked'>";
				sBoard += " " + markedBoard[y][x] + " ";
				sBoard += "</span>";
			}
			sBoard += "<br>";
		}
		$("#" + id).html(sBoard);
	};

	/**
	 * Prints code defining current game state on web page
	 */
	this.printGameState = function(aId) {
		var id = aId || 'gameState';
		var sBoard = "";

		// Initialize game state
		sBoard += "gGameState = new GameState(\n";
		sBoard += "\t" + gGameState.boardWidth + ",\n";
		sBoard += "\t" + gGameState.boardHeight + ",\n";
		sBoard += "\tnew Player(Constants.Color.BLACK, Constants.PointState.BLACK),\n";
		sBoard += "\tnew Player(Constants.Color.WHITE, Constants.PointState.WHITE)\n";
		sBoard += ");\n";
		
		// Set current player
		sBoard += "gGameState.currentPlayer = " +
			(gGameState.currentPlayer == gGameState.player1 ?
				"gGameState.player1;\n" :
				"gGameState.player2;\n");
		
		// Set board
		for (var y = 0; y < gGameState.boardHeight; y++) {
			sBoard += "gGameState.board[" + y + "] = [";
			for (var x = 0; x < gGameState.boardWidth; x++) {
				
				sBoard += "\"" + gGameState.board[y][x] + "\",";
			}
			sBoard = sBoard.substring(0, sBoard.length-1);
			sBoard += "];\n";
		}
		
		// Set previous board
		for (var y = 0; y < gGameState.boardHeight; y++) {
			sBoard += "gGameState.previousBoard[" + y + "] = [";
			for (var x = 0; x < gGameState.boardWidth; x++) {
				sBoard += "\"" + gGameState.previousBoard[y][x] + "\",";
			}
			sBoard = sBoard.substring(0, sBoard.length-1);
			sBoard += "];\n";
		}
		
		$("#" + id).html("<textarea>" + sBoard + "</textarea>");
	};
	
	/**
	 * Toggles between showing a regular or marked board.
	 * Merely calls appropriate print functions.
	 */
	this.toggleMarkedBoard = function() {
		isBoardMarked ?	this.printBoard() : this.printMarkedBoard();
		isBoardMarked = !isBoardMarked;
	};
	
	/**
	 * Prompts the user for a board size, and starts a new game.
	 */
	this.startNewGame = function() {
		var size = prompt("Please provide a board size:", "9x9").split("x");
		var width = parseInt(size[0]);
		var height = parseInt(size[1]);
		
		if ( isNaN(width) || isNaN(height) ) {
			alert("Invalid board size.");
			return;
		}
		
		Ish.Go.Logic.newGame(width, height);
		
		this.redraw();
	};
	
	this.redraw = function() {
		this.printBoard();
		this.printTurn();
		this.printScores();
	};
	
	this.init = function() {
		// Initialize game state
		gGameState = new GameState(
			9,
			9,
			new Player(Constants.Color.BLACK, Constants.PointState.BLACK),
			new Player(Constants.Color.WHITE, Constants.PointState.WHITE)
		);
		
		this.redraw();
	};
	
}; // end Ish.Go.View namespace