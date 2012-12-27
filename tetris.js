var Tetris = {};

Tetris.canvas = document.getElementById("board");
Tetris.context = Tetris.canvas.getContext("2d");
Tetris.sqSize = 20;
Tetris.boardW = 10;
Tetris.boardH = 20;
Tetris.active = false;
	//Makes an array to keep track of occupied squares
Tetris.array = Array(22);
Tetris.wall = 8;
Tetris.empty = 0;
Tetris.timer = null;
Tetris.game = false;
Tetris.score = 0;
Tetris.clearedLines = 0;
/* FUNCTION DEFINITIONS:
 *		definitions of functions for game functionality.
 */

Tetris.start = function () {
	$('#target').keydown(function(event) {
		if (Tetris.active == true){
			Tetris.react(event);
		};
	});

	$('#start').on('click', function(e) {
		if (Tetris.game == false) {
			Tetris.game = true;
			Tetris.active = true;
		}
		Tetris.timer = window.setInterval( "Tetris.click()", 400);
		Tetris.newGame();
	});
	$('#pause').on('click', function(e) {
		if (Tetris.game != false) {
			Tetris.pause();
		};

	});
};

Tetris.click = function () {
	if (Tetris.canMove(1,0)){
		Tetris.move(1,0);
	}
	else {
		Tetris.fallen();
	};
};

Tetris.pause = function () {
	if (Tetris.active == true) {
		Tetris.active = false;
		window.clearInterval(Tetris.timer);
		$('#pause').html("<i class='icon-play icon-white'></i> Resume");
	}

	else {
		Tetris.active = true;
		Tetris.timer = window.setInterval( "Tetris.click()", 400);
		$('#pause').html("<i class='icon-pause icon-white'></i>  Pause ");
	};
};

Tetris.newGame = function () {
	Tetris.context.clearRect(Tetris.sqSize, Tetris.sqSize, 10*Tetris.sqSize, 20*Tetris.sqSize);
	for (var r = 1; r < 21; r ++) {
		for (var c = 1; c < 11; c ++) {
			Tetris.array[r][c] = 0;
		};
	};
	Tetris.newPiece();
	Tetris.repaintBoard();
};

Tetris.react = function (event) {

	switch (event.which) {

		case 37:
			if (Tetris.canMove(0,-1)) {
				Tetris.move(0,-1);
			};
			break;

		case 38:
			if (Tetris.canRotate(1)) {
				Tetris.rotate(1);
			};
			break;

		case 39:
			if (Tetris.canMove(0,1)) {
				Tetris.move(0,1);
			};
			break;

		case 40:
			if (Tetris.canMove(1,0)) {
				Tetris.move(1,0);
			}
			else {
				Tetris.fallen();
			}
			break;

		case 32:
			while (Tetris.canMove(1,0)) {
				Tetris.move(1,0);
			};
			Tetris.fallen();
			break;

		default:
			console.log("Sorry! Not a valid key press.");

	};
};

Tetris.move = function (row, col) {
	Tetris.clearOld();
	Tetris.loc[0] = Tetris.loc[0] + col;
	Tetris.loc[1] = Tetris.loc[1] + row;
	Tetris.repaintBoard();
};

Tetris.rotate = function (dir) {

	var rotatePiece = new Array(4);
	for (var i = 0; i < 4; i ++ ){
		rotatePiece[i] = new Array(4);
	};

	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {

				var newCoord = Tetris.rotate90((r + 0.5 - Tetris.COR[0]),(c + 0.5 - Tetris.COR[1]),dir);
				var newR = newCoord[0] - 0.5 + Tetris.COR[0];
				var newC = newCoord[1] - 0.5 + Tetris.COR[1];

				rotatePiece[newR][newC] = Tetris.piece[r][c];
			};
		};
	};

	Tetris.clearOld();
	Tetris.piece = rotatePiece;
	Tetris.repaintBoard();

};

Tetris.newPiece = function () {

	Tetris.piece = new Array(4);
	Tetris.loc = [4,0];
	Tetris.COR = [1.5,1.5];

	for (var i = 0; i < 4; i ++ ){
		Tetris.piece[i] = new Array(4);
	};

	var rand = Math.floor(Math.random()*7+1);

	switch(rand) {
		//Yellow O
		case 1:
			Tetris.piece[1][1] = 1;
			Tetris.piece[1][2] = 1;
			Tetris.piece[2][1] = 1;
			Tetris.piece[2][2] = 1;
			Tetris.COR = [2,2];
			break;

		//Cyan I
		case 2:
			Tetris.piece[1][0] = 2;
			Tetris.piece[1][1] = 2;
			Tetris.piece[1][2] = 2;
			Tetris.piece[1][3] = 2;
			Tetris.COR = [2,2];
			break;

		//Purple T	
		case 3:
			Tetris.piece[1][0] = 3;
			Tetris.piece[1][1] = 3;
			Tetris.piece[1][2] = 3;
			Tetris.piece[2][1] = 3;
			break;

		//Green S	
		case 4:
			Tetris.piece[2][0] = 4;
			Tetris.piece[1][1] = 4;
			Tetris.piece[1][2] = 4;
			Tetris.piece[2][1] = 4;
			break;

		//Red Z	
		case 5:
			Tetris.piece[1][0] = 5;
			Tetris.piece[1][1] = 5;
			Tetris.piece[2][2] = 5;
			Tetris.piece[2][1] = 5;
			break;

		//Blue J	
		case 6:
			Tetris.piece[1][0] = 6;
			Tetris.piece[1][1] = 6;
			Tetris.piece[1][2] = 6;
			Tetris.piece[2][2] = 6;
			break;

		//Orange L	
		case 7:
			Tetris.piece[1][0] = 7;
			Tetris.piece[1][1] = 7;
			Tetris.piece[1][2] = 7;
			Tetris.piece[2][0] = 7;
			break;

		//Should never get here!!	
		default:
			console.log("ERROR in switch");
	};

};

Tetris.drawPiece = function () {
	for (var row = 0; row < 4; row ++) {
		for (var col = 0; col < 4; col ++) {
			if (Tetris.piece[row][col] > 0) {
				var rgb = this.getRGB(Tetris.piece[row][col]);
				Tetris.context.fillStyle = "rgb("+rgb[0]+","+ rgb[1]+","+ rgb[2]+")";
				Tetris.context.fillRect((col+Tetris.loc[0])*Tetris.sqSize, (row+Tetris.loc[1])*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
				Tetris.context.strokeRect((col+Tetris.loc[0])*Tetris.sqSize, (row+Tetris.loc[1])*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
			};
		};
	};
};

Tetris.drawInit = function () {
	for (var r = 0; r<22; r++) {

		Tetris.array[r] = Array(12);

		for (var c = 0; c<12; c++) {
			if (r == 0 || r == 21 || c == 0 || c == 11) {

				Tetris.array[r][c] = Tetris.wall;

				Tetris.context.fillRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize-1, Tetris.sqSize-1);

			}

			else {
				Tetris.array[r][c] = Tetris.empty;
			};
		};
	};
	Tetris.nextPieceBox();
};

Tetris.clearOld = function () {
		for (var row = 0; row < 4; row ++) {
			for (var col = 0; col < 4; col ++) {
				if (Tetris.piece[row][col] > 0) {
					Tetris.context.clearRect((col+Tetris.loc[0])*Tetris.sqSize-1, (row+Tetris.loc[1])*Tetris.sqSize-1, Tetris.sqSize+2, Tetris.sqSize+2);
			};
		};
	};
};

Tetris.canMove = function (row, col) {
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {
				if (Tetris.array[(row+r+Tetris.loc[1])][(col+c+Tetris.loc[0])] > 0) {
					return false;
				};
			};
		};
	};
	return true;
};

Tetris.canRotate = function (dir) {
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {

			if (Tetris.piece[r][c] > 0) {

				//The O (in this case 1) should never rotate
				if (Tetris.piece[r][c] == 1) {
					return false;
				};

				var newCoord = Tetris.rotate90((r + 0.5 - Tetris.COR[0]),(c + 0.5 - Tetris.COR[1]),dir);
				var newR = newCoord[0] - 0.5 + Tetris.COR[0];
				var newC = newCoord[1] - 0.5 + Tetris.COR[1];

				if ((newR+Tetris.loc[1]) > 20 || (newR+Tetris.loc[1]) < 1) {
					return false;
				}
				else if ((newC + Tetris.loc[0]) > 10 || (newC + Tetris.loc[0]) < 1) {
					return false;
				}
				else if (Tetris.array[(newR + Tetris.loc[1])][(newC + Tetris.loc[0])] > 0){
					return false;
				};
			};
		};
	};	
	return true;
};

Tetris.repaintBoard = function () {
	Tetris.context.clearRect(Tetris.sqSize, Tetris.sqSize, 10*Tetris.sqSize, 20*Tetris.sqSize);
	for (var r = 1; r < 21; r ++) {
		for (var c = 1; c < 11; c ++) {
			var rgb = Tetris.getRGB(Tetris.array[r][c]);
			if (rgb != undefined){
				Tetris.context.fillStyle = "rgb("+rgb[0]+","+ rgb[1]+","+ rgb[2]+")";
				Tetris.context.fillRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
				Tetris.context.strokeRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
			};
		};
	};
	Tetris.drawPiece();

};

Tetris.getRGB = function (piece) {

	switch (piece) {

		case (1):
			//yellow
			return [255,255,0];

		case (2):
			//cyan
			return [0,255,255];

		case (3):
			//purple
			return [153,0,204];

		case (4):
			//green
			return [0,255,0];

		case (5):
			//red
			return [255,0,0];

		case (6):
			//blue
			return [0,0,255];

		case (7):
			//orange
			return [255,102,0];

		default:
			//
			return undefined;
	};	
};

Tetris.fallen = function () {
	console.log("Tetris.fallen()");
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {
				Tetris.array[r+Tetris.loc[1]][c+Tetris.loc[0]] = Tetris.piece[r][c];
			};
		};
	};
	Tetris.fullLines();
	if (Tetris.isGameOver()){
		Tetris.gameOver();
	}
	else {
		Tetris.newPiece();
		Tetris.repaintBoard();
	}
};


Tetris.gameOver = function () {
	window.clearInterval(Tetris.timer);
	Tetris.game = false;
	Tetris.active = false;
	Tetris.context.fillStyle = "rgb(255,255,255)"
	Tetris.context.fillRect(40,210,160,60);
	Tetris.context.strokeRect(40,210,160,60);
	Tetris.context.fillStyle = "rgb(0,0,0)";
	Tetris.context.font = "bold 28px sans-serif";
	Tetris.context.fillText("Game Over", 44, 248);
};

Tetris.fullLines = function () {
	console.log("Tetris.fullLines()");
	var full = true;
	var num = 0;
	for (var r = 1; r < 21; r ++) {
		for (var c = 1; c < 11; c ++) {
			if (Tetris.array[r][c] == 0) {
				console.log("not full because of r "+r+" c "+c);
				full = false;
				break;
			};
		};
		if (full == true) {
			Tetris.clearLine(r);
			num ++;
		};
		full = true;
	};
	Tetris.repaintBoard();
};

Tetris.clearLine = function (row) {
	console.log("Tetris.clearLine("+row+")");
	for (var r = row; r > 1; r --) {
		for (var c = 1; c < 11; c ++) {
			Tetris.array[r][c] = Tetris.array[r-1][c];
		};
	};
};

Tetris.nextPieceBox = function () {
	var canvas = document.getElementById("next");
	var context = canvas.getContext("2d");
	for (var r = 0; r < 6; r ++) {
		for (var c = 0; c < 10; c ++) {
			if (r == 0 || r == 5 || c == 0 || c == 9) {
				context.fillRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
			};
		};
	};
};

Tetris.isGameOver = function () {
	for (var c = 1; c < 11; c ++) {
		if (Tetris.array[1][c] > 0) {
			return true;
		};
	};
};

Tetris.rotate90 = function (r, c, dir) {
	if (dir == 1) {
		return [c, -r];
	}
	else if (dir == -1) {
		return [-c, r];
	}
	else {
		console.log("Invalid Direction for rotation!!");
	}
};

$(document).ready(function () {
	Tetris.start();
	Tetris.drawInit();
});