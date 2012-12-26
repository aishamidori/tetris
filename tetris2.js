var Tetris = {};

Tetris.canvas = document.getElementById("board");
Tetris.context = this.canvas.getContext("2d");
Tetris.sqSize = 20;
Tetris.boardW = 10;
Tetris.boardH = 20;

	//Makes an array to keep track of occupied squares
Tetris.array = Array(22);

/* FUNCTION DEFINITIONS:
 *		definitions of functions for game functionality.
 */

Tetris.start = function () {
	this.newPiece();
	this.drawPiece();
};

Tetris.newPiece = function () {
	Tetris.piece = new Array();
	var rand = Math.floor(Math.random()*7);

	switch(1) {
		//Yellow O
		case 1:
			Tetris.piece[1][1] = 1;
			Tetris.piece[1][2] = 1;
			Tetris.piece[2][1] = 1;
			Tetris.piece[2][2] = 1;
			Tetris.pieceCol = "#FFFFOO"; 
			break;

		//Cyan I
		case 2:
			break;

		//Purple T	
		case 3:
			break;

		//Green S	
		case 4:
			break;

		//Red Z	
		case 5:
			break;

		//Blue J	
		case 6:
			break;

		//Orange L	
		case 7:
			break;

		//Should never get here!!	
		default:
			console.log("ERROR in switch");
	}
};

Tetris.drawPiece = function () {
	this.piece.forEach(function(element, index, array) {
		console.log("a[" + index + "] = " + element);
	});
};

Tetris.drawInit = function () {
	for (var r = 0; r<22; r++) {

		Tetris.array[r] = Array(10);

		for (var c = 0; c<10; c++) {

			Tetris.array[r][c] = 0;

		};
	};

 	for (col = 0; col < 10; col++ ) {

 		for (row = 0; row < 20; row ++ ) {

 			Tetris.context.strokeRect(col*Tetris.sqSize, row*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);

 		};
 	};
};

$(document).ready(function() {
	//run();
	Tetris.drawInit();
	Tetris.start();

});
