// Ish.Go namespace declaration
var Ish = Ish || {};
Ish.Go = Ish.Go || {};

// begin Ish.Go.View namespace
Ish.Go.View = new function() {
	
	this.init = function() {
		gGameState = new GameState(
			9,
			9,
			new Player(Constants.Color.BLACK, Constants.PointState.BLACK),
			new Player(Constants.Color.WHITE, Constants.PointState.WHITE)
		);
		
		this.redraw();
	};
	
	this.startNewGame = function() {
		Ish.Go.Logic.newGame(9, 9);
		
		this.redraw();
	};
	
	this.redraw = function() {
		this.printBoard();
		this.printTurn();
		this.printScores();
	};
	
	this.printScores = function(aId) {	
		var id = aId || "score";
		
		Ish.Go.Logic.setScores();
		
		var p1 = gGameState.player1;
		var p2 = gGameState.player2;
		
		$("#" + id).html(
			p1.pointState + ": " + p1.score +
			", " +
			p2.pointState + ": " + p2.score);
	};

	this.printTurn = function(aId) {
		var id = aId || 'turn';
		$("#" + id).text("Turn: " + gGameState.currentPlayer.pointState);
	};

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
	
	this.pass = function() {
		alert("This feature doesn't work yet.");
	};
	
}; // end Ish.Go.View namespace