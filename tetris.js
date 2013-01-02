$(document).ready(function () {
	Tetris.start();
	Tetris.drawInit();
});

var Tetris = {};

/* Variable definitions:
 *		~ Board characteristics such as size for extensibility (width/height/size)
 *		~ Game state variables (active/paused)
 *		~ Data structures (board array/piece)
 *		~ etc.
 */

//HTML5 canvas
Tetris.canvas = document.getElementById("board");

//2d canvas used for drawing onto canvas
Tetris.context = Tetris.canvas.getContext("2d");

//Square size in pixels
Tetris.sqSize = 20;

//Guideline width of 10 squares
Tetris.boardW = 10;

//Guideline height of 20 squares
Tetris.boardH = 20;

//Border is 1 square wide
Tetris.borderW = 1;

//Number of invisible squares above the visible board (for rotation)
Tetris.skySpace = 2;

//Total height of the canvas
Tetris.totH = Tetris.boardH + 2*Tetris.borderW + Tetris.skySpace;

//Total width of the canvas
Tetris.totW = Tetris.boardW + 2*Tetris.borderW;

//Makes an array to keep track of occupied squares
Tetris.array = Array(Tetris.totH);

//Wall squares are 8s
Tetris.wall = 8;

//Empty squares are 0s
Tetris.empty = 0;

//Array representing bonuses for line clears
Tetris.clearBonus = [0,100,300,500,800];

//Score counter
Tetris.score = 0;

//Line counter
Tetris.clearedLines = 0;
Tetris.toNext = 10;

//Level = (Tetris.clearedLines/10) + 1
Tetris.level = 1;

//Game state variables
Tetris.paused = false;
Tetris.gameActive = false;





/* 
 * USER INTERACTION:
 * functions for user interactions.
 *			
 *		key clicks
 *		"New Game" button
 *		"Pause/Resume" button
 *
 */

//Wrapper function maps buttons/keys to other functions
Tetris.start = function () {
	$('#target').keydown(function(event) {
		if (Tetris.gameActive == true){
			Tetris.react(event);
		};
	});

	$('#start').on('click', function(e) {
		if (Tetris.gameActive == false) {
			Tetris.timerStart();
		};
		Tetris.newGame();
	});

	$('#pause').on('click', function(e) {

		if (Tetris.gameActive != false) {
			Tetris.pause();
		};

	});

};

Tetris.react = function (event) {

	//Switch statements for pause actions happen in all cases
	switch (event.which) {

		//Pause - Esc
		case 27:
			if (Tetris.gameActive != false) {
				Tetris.pause();
			};
			break;

		//Pause - F1
		case 112:
			if (Tetris.gameActive != false) {
				Tetris.pause();
			};
			break;		

		//Pause - P
		case 80:
			if (Tetris.gameActive != false) {
				Tetris.pause();
			};
			break;					

		default:
			console.log("Sorry! Not a valid key press.");

	};


	//Game functionality key presses only registered if the game is not paused
	if (Tetris.paused == false) {
		event.preventDefault();
		switch (event.which) {
			//Move Left - Left arrow
			case 37:

				if (Tetris.canMove(0,-1)) {
					Tetris.move(0,-1);
				};
				break;

			//Move Right - Right arrow
			case 39:

				if (Tetris.canMove(0,1)) {
					Tetris.move(0,1);
				};
				break;

			//Soft Drop - Down arrow
			case 40:

				//Soft drop
				if (Tetris.canMove(1,0)) {
					Tetris.move(1,0);
				}
				else {
					console.log("about to fall");
					Tetris.fallen();
				};
				break;

			//Hard Drop - Space bar
			case 32:

				//Hard drop
				while (Tetris.canMove(1,0)) {
					Tetris.move(1,0);
					//Extra score point for hard drop (2 total/row)
					Tetris.score ++;
				};

				Tetris.fallen();
				Tetris.updateScoring();
				break;

			//Rotate Clockwise - Up arrow
			case 38:

				if (Tetris.canRotate(1)) {
					Tetris.rotate(1);
				};
				break;

			//Rotate Clockwise - X
			case 88:

				if (Tetris.canRotate(1)) {
					Tetris.rotate(1);
				};
				break;

			//Rotate Counter-Clockwise - Z
			case 90:

				if (Tetris.canRotate(-1)) {
					Tetris.rotate(-1);
				};
				break;

			//Rotate Counter-Clockwise - Ctrl
			case 17:

				if (Tetris.canRotate(-1)) {
					Tetris.rotate(-1);
				};
				break;
		};
	};
};


//Function called every time the timer clicks -- moves piece down one row
Tetris.click = function () {
	console.log("click");
	if (Tetris.canMove(1,0)){
		Tetris.move(1,0);
	}

	else {
		console.log("about to fall")
		Tetris.fallen()
	};
};


//Method that stops the main game timer
Tetris.timerStop = function () {
	console.log("Timer stop");
	window.clearInterval(Tetris.timer);
};


//Method that starts the main game timer using a time interval based on the level.
Tetris.timerStart = function () {
	console.log("Timer start");
	Tetris.timer = window.setInterval('Tetris.click()',Tetris.interval(Tetris.level));
};


//Function called every time the "New Game" button is clicked -- resets board
Tetris.newGame = function () {

	//if the game was paused, unpause it
	if (Tetris.paused == true) {
		Tetris.pause();
	};

	Tetris.gameActive = true;

	//Reset graphics and logic array
	Tetris.context.clearRect(Tetris.sqSize*Tetris.borderW, Tetris.sqSize*(Tetris.borderW + Tetris.skySpace), Tetris.boardW*Tetris.sqSize, Tetris.boardH*Tetris.sqSize);
	for (var r = Tetris.skySpace; r < (Tetris.totH - Tetris.borderW); r ++) {
		for (var c = Tetris.borderW; c < (Tetris.totW - Tetris.borderW); c ++) {
			Tetris.array[r][c] = 0;
		};
	};

	//Reset score
	Tetris.score = 0;
	Tetris.clearedLines = 0;
	//Tetris.level = 1;
	Tetris.updateScoring();

	//Generate new piece and draw
	Tetris.newPiece();
	Tetris.drawPiece();
};


//Function called when the "Pause" or "Resume" button is clicked
Tetris.pause = function () {

	//If the game wasn't paused: pause it
	if (Tetris.paused == false) {
		Tetris.paused = true;
		Tetris.timerStop();
		$('#pause').html("<i class='icon-play icon-white'></i> Resume");
	}

	//If the game was paused: resume it
	else {
		Tetris.paused = false;
		Tetris.timerStart()
		$('#pause').html("<i class='icon-pause icon-white'></i>  Pause ");
	};
};





/* 
 * TETRIMINO MOVEMENT:
 * functions for checking if moves are valid
 * functions for manipulation of tetris pieces or "tetriminos"
 *		
 *		canMove (left, right, down)	
 *		move (left, right, down)
 *		canRotate
 *		rotation
 *
 */

//Parameters: row or col change  --  returns if the piece can move to new location 
Tetris.canMove = function (row, col) {

	//For all of the positions in the piece bounding box
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {

			//If there is a square in given bounding box position
			if (Tetris.piece[r][c] > 0) {

				//If the corresponding array position is not empty
				if (Tetris.array[(row+r+Tetris.loc[1])][(col+c+Tetris.loc[0])] > 0) {

					//Piece can't move here!
					return false;
				};
			};
		};
	};
	return true;
};


//Parameters: row or col change  --  moves piece to new location (only called when valid)
Tetris.move = function (row, col) {
	Tetris.clearOld();
	Tetris.loc[0] = Tetris.loc[0] + col;
	Tetris.loc[1] = Tetris.loc[1] + row;
	Tetris.repaintBoard();
	if (row == 1) {
		Tetris.score ++;
		Tetris.updateScoring();
	};
};


//Parameters: dir1 = cw, dir-1 = ccw  --  Calculates rotated coordinates and then checks if those coordinates are valid
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

				if ((newR+Tetris.loc[1]) < 1) {
					return false;
				}
				else if ((newC + Tetris.loc[0]) > Tetris.boardW || (newC + Tetris.loc[0]) < Tetris.borderW) {
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


//Parameters: dir1 = cw, dir-1 = ccw  --  Calculates rotated coordinates and then sets piece to those coordinates
Tetris.rotate = function (dir) {

	//Will need to transfer rotated piece to new 4*4 bounding box
	var rotatePiece = new Array(4);
	for (var i = 0; i < 4; i ++ ){
		rotatePiece[i] = new Array(4);
	};

	//For each occupied position in the bounding box AKA for each piece square
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {

				//Calculate rotated coordinates
				var newCoord = Tetris.rotate90((r + 0.5 - Tetris.COR[0]),(c + 0.5 - Tetris.COR[1]),dir);
				var newR = newCoord[0] - 0.5 + Tetris.COR[0];
				var newC = newCoord[1] - 0.5 + Tetris.COR[1];

				//Move square
				rotatePiece[newR][newC] = Tetris.piece[r][c];

			};
		};
	};

	//Clear piece's previous location
	Tetris.clearOld();

	//Rotated bounding box replaces previous piece bounding box
	Tetris.piece = rotatePiece;

	//Repaint board
	Tetris.repaintBoard();
};


//Parameters: r = original row, c = original column, dir1 = cw, dir-1 = ccw  -- rotating helper method
Tetris.rotate90 = function (r, c, dir) {

	//dir == 1 represents clockwise rotation
	if (dir == 1) {
		return [c, -r];
	}

	//dir == -1 represents counter-clockwise rotation
	else if (dir == -1) {
		return [-c, r];
	}

	//should never have input other than +1, -1
	else {
		console.log("Invalid Direction for rotation!!");
	}
};





/* 
 * GAME LOGIC:
 * functions for game logic.
 *			
 *		random piece generation
 *		adding fallen piece to array
 *		identifying/clearing full lines
 *		checking for game over and behaving accordingly
 *
 */

//Generates a new piece
Tetris.newPiece = function () {


	Tetris.loc = [4,Tetris.skySpace];
	Tetris.COR = [1.5,1.5];

	Tetris.piece = new Array(4);
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

Tetris.fallen = function () {
	console.log("fallen");
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
	};

	
};

Tetris.fullLines = function () {
	var full = true;
	var num = 0;
	for (var r = (Tetris.skySpace + Tetris.borderW); r < (Tetris.totH - Tetris.borderW); r ++) {
		for (var c = Tetris.borderW; c < Tetris.totW - Tetris.borderW; c ++) {
			if (Tetris.array[r][c] == 0) {
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
	Tetris.score += Tetris.clearBonus[num];
	Tetris.clearedLines += num;
	Tetris.toNext -= num;
	if (Tetris.toNext <= 0) {
		Tetris.newLevel();
		Tetris.toNext += 10; 
	}
	Tetris.updateScoring();
	Tetris.repaintBoard();
};

Tetris.clearLine = function (row) {

	for (var r = row; r > (Tetris.skySpace + Tetris.borderW); r --) {
		for (var c = Tetris.borderW; c < Tetris.totW - Tetris.borderW; c ++) {
			Tetris.array[r][c] = Tetris.array[r-1][c];
		};
	};
};

Tetris.newLevel = function () {
	Tetris.level ++;
	Tetris.timerStop();
	Tetris.timerStart();

};

Tetris.interval = function (level) {
	var interval = Math.pow((0.8 - ((Tetris.level - 1) * 0.007)),(Tetris.level-1));
	return 1000*interval;
};

Tetris.isGameOver = function () {
	for (var c = Tetris.borderW; c < (Tetris.totW - Tetris.borderW); c ++) {
		if (Tetris.array[(Tetris.borderW + Tetris.skySpace)][c] > 0) {
			return true;
		};
	};
};

Tetris.gameOver = function () {
	Tetris.timerStop();
	Tetris.game = false;
	Tetris.active = false;
	Tetris.context.fillStyle = "rgb(255,255,255)"
	Tetris.context.fillRect(40,210,160,60);
	Tetris.context.strokeRect(40,210,160,60);
	Tetris.context.fillStyle = "rgb(0,0,0)";
	Tetris.context.font = "bold 28px sans-serif";
	Tetris.context.fillText("Game Over", 44, 248);
};





/* 
 * RENDERING:
 * functions for updating canvas/drawing shapes.
 *			
 *		initial graphics generation
 *		repainting board
 *			repainting piece
 *		clearing piece
 *		updating HTML with score/cleared lines
 *		getRGB to repaint based on array numbers
 */

Tetris.drawInit = function () {
	for (var r = Tetris.skySpace; r < Tetris.totH; r++) {

		Tetris.array[r] = Array(Tetris.totH - Tetris.borderW);

		for (var c = 0; c<(Tetris.totW); c++) {

			if (r == Tetris.skySpace || r == (Tetris.totH - Tetris.borderW) || c == 0 || c == (Tetris.totW - Tetris.borderW)) {

				Tetris.array[r][c] = Tetris.wall;

				Tetris.context.fillRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize-1, Tetris.sqSize-1);

			}

			else {
				Tetris.array[r][c] = Tetris.empty;
			};
		};
	};

	//Tetris.nextPieceBox();
};

Tetris.repaintBoard = function () {
	Tetris.context.clearRect((Tetris.borderW*Tetris.sqSize)-1, (Tetris.borderW + Tetris.skySpace)*Tetris.sqSize, Tetris.boardW*Tetris.sqSize+1, Tetris.boardH*Tetris.sqSize);
	for (var r = (Tetris.skySpace + Tetris.borderW); r < (Tetris.totH - Tetris.borderW); r ++) {
		for (var c = 1; c < (Tetris.totW - Tetris.borderW); c ++) {
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

Tetris.drawPiece = function () {
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {
				if (r+Tetris.loc[1] < Tetris.skySpace+Tetris.borderW) {
					break;
				};
				var rgb = this.getRGB(Tetris.piece[r][c]);
				Tetris.context.fillStyle = "rgb("+rgb[0]+","+ rgb[1]+","+ rgb[2]+")";
				Tetris.context.fillRect((c+Tetris.loc[0])*Tetris.sqSize, (r+Tetris.loc[1])*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
				Tetris.context.strokeRect((c+Tetris.loc[0])*Tetris.sqSize, (r+Tetris.loc[1])*Tetris.sqSize, Tetris.sqSize, Tetris.sqSize);
			};
		};
	};
};

Tetris.clearOld = function () {
	for (var r = 0; r < 4; r ++) {
		for (var c = 0; c < 4; c ++) {
			if (Tetris.piece[r][c] > 0) {
				if (r + Tetris.loc[1] < Tetris.skySpace+Tetris.borderW) {
					break;
				}
				Tetris.context.clearRect((c+Tetris.loc[0])*Tetris.sqSize-1, (r+Tetris.loc[1])*Tetris.sqSize-1, Tetris.sqSize+1, Tetris.sqSize+1);
			};
		};
	};
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
			return undefined;
	};	
};

Tetris.updateScoring = function () {
	$('#scoring').html("Level: "+Tetris.level + " <br/> Score: "+Tetris.score+" <br/> Lines Cleared: "+Tetris.clearedLines+" ");  
};




/*
 * EXTRA FUNCTIONALITY:
 *	
 *		next piece box
 *		ghost piece
 *
 */

Tetris.nextPieceBox = function () {
	var canvas = document.getElementById("next");
	var context = canvas.getContext("2d");
	for (var r = 0; r < 6; r ++) {
		for (var c = 0; c < 10; c ++) {
			if (r == 0 || r == 5 || c == 0 || c == 9) {
				context.fillRect(c*Tetris.sqSize, r*Tetris.sqSize, Tetris.sqSize-1, Tetris.sqSize-1);
			};
		};
	};
};




