Overview
============================================

A Tetris implementation using Javascript.  
To run open the file 'tetris.html' in any web browser.
Within the same folder containing the file 'tetris.html' you must also have the bootstrap folder as downloaded [here](http://twitter.github.com/bootstrap/).
JQuery is automatically accessed from Google APIs.  
Sample can also be played [here](http://aishaferrazares.weebly.com/).

Actions can be performed by pressing keyboard keys.

	* Move Left -- Left Arrow
	* Move Right -- Right Arrow
	* Soft Drop -- Down Arrow
	* Hard Drop -- Spacebar
	* CW Rotate -- Up Arrow, "X"
	* CCW Rotate -- Ctrl, "Z"
	* Pause -- Esc, F1, "P"	


Credits
============================================

Rules and Guidlines based on Official Tetris Guidlines.  
Layout using HTML5 canvas.  
Buttons with Bootstrap.  
Icons thanks to Glyphicons.  


Scoring
============================================

Score increments for each row dropped.  Double points for hard drops.  
Score for a line clear = level * 50 * (lines * (lines + 1)  
level  = (lines / 10) + 1  
