//I have two "errors" when validating this file. Both are along the lines of:
//"Function declared within loop referencing an outer scope variable may lead to confusing semantics"
//I don't know how I could fix that without making a bunch of new variables to make it "less confusing".
//I feel like my code should be straight forward enough

//All of the code "loads" when the game loads
window.onload = function ()
{
	//The structure of the code in this onload function is heavily inspired by various demo games that I have found online.
	//What I borrowed, for the most part, is the looping through squares/separaing the image by squares, and the idea of using
	//classes to set the letious metrics and attributes for the individual squares. Everything else was coded on my own.

	//Declaring all of the (non-global) variables here
	let positionX = '300px';
	let positionY = '300px';
	let puzzleArea = document.getElementById('puzzlearea');
	let squares = puzzleArea.getElementsByTagName('div'); //retrieve all of the squares in the grid
	//Checks if the piece is moveable and returns the appropriate boolean
	const isMoveable = function(position) {
		if (left(positionX, positionY) == (position-1))
			return true;
	
		if (down(positionX, positionY) == (position-1))
			return true;
	
		if (up(positionX, positionY) == (position-1))
			return true;
	
		if (right(positionX, positionY) == (position-1))
			return true;
	};
	
	//Checks if all the pieces are in their respective places
	const finishedPuzzle = function() {
		let end = true;

		//This was an algorithm borrowed from StackOverflow, which I "paraphrased" to fit my coding needs
		//This loop basically checks each and every square to see if their top/left values are in the correct place
		//If the top/left values are in the right place, then the puzzle is complete!
		for (let i = 0; i < squares.length; i++) {
			let top = parseInt(squares[i].style.top);
			let left = parseInt(squares[i].style.left);
			if (left != (i%4*100) || top != parseInt(i/4)*100) {
				end = false;
				break;
			}
		}
		return end;
	};

	//Figures out how far to the left the puzzle piece should reposition
	const left = function(x, y) {
		
		x = parseInt(x);
		y = parseInt(y);
	
		if (x > 0) {
			for (let i = 0; i < squares.length; i++) {
				if (parseInt(squares[i].style.left) + 100 == x && parseInt(squares[i].style.top) == y) {
					return i;
				}
			}
		}
		else {
			return -1;
		}
	};
	
	//Figures out how far to the right the puzzle piece should reposition
	const right = function(x, y) {

		x = parseInt(x);
		y = parseInt(y);
	
		if (x < 300) {
			for (let i =0; i<squares.length; i++) {
				if (parseInt(squares[i].style.left) - 100 == x && parseInt(squares[i].style.top) == y) {
					return i;
				}
			}
		}
		else {
			return -1;
		} 
	};
	
	//Figures out how far up the puzzle piece should reposition
	const up = function(x, y) {

		x = parseInt(x);
		y = parseInt(y);
	
		if (y > 0) {
			for (let i=0; i<squares.length; i++) {
				if (parseInt(squares[i].style.top) + 100 == y && parseInt(squares[i].style.left) == x) {
					return i;
				}
			} 
		}
		else {
			return -1;
		}
	};
	
	//Figures out how far down the puzzle piece should reposition
	const down = function(x, y) {

		x = parseInt(x);
		y = parseInt(y);
	
		if (y < 300) {
			for (let i=0; i<squares.length; i++) {
				if (parseInt(squares[i].style.top) - 100 == y && parseInt(squares[i].style.left) == x) {
					return i;
				}
			}
		}
		else {
			return -1;
		} 
	};

	//This is my attempt at directly translating a Python algorithm into JavaScript, with the help of StackOverflow
	//I hope this code is fundamentally sound
	function move (position) {
		let tempSquare = squares[position].style.top;
		squares[position].style.top = positionY;
		positionY = tempSquare;
		tempSquare = squares[position].style.left;
		squares[position].style.left = positionX;
		positionX = tempSquare;
	}
	
	for (let i=0; i<squares.length; i++) {

		//The idea of making each individual square a class is genius. I took this idea from online, and I implemented it myself
		squares[i].style.backgroundImage="url('genshin.jpg')"; //This is the fun puzzle image that I used
		squares[i].className = 'squarepiece'; //This is just so the CSS file can format each of the squares properly
		squares[i].style.left = (i%4*100)+'px'; //This is a recurring piece of code that I found on StackOverflow. Calculates the x-position
		squares[i].style.top = (parseInt(i/4)*100) + 'px'; //Calculates the y-position

		//This basically gives each puzzle piece a "chunk" of the background image, which makes the background moveable
		squares[i].style.backgroundPosition= '-' + squares[i].style.left + ' ' + '-' + squares[i].style.top; 

		//If you hover over a square, and it's a moveable square, this if statement returns true
		squares[i].onmouseover = function() {
			if (isMoveable(parseInt(this.innerHTML))) {
				this.style.border = "2px solid red"; //changes to red when a puzzle piece is near an empty space
				this.style.color = "red"; //text color changes to green when a puzzle piece is near an empty space
				this.style.textDecoration = "underline"; //underlines the number of the puzzle piece piece
			}
		};

		//If your mouse leaves one of the squares, then it's original border is reset to it's original state
		squares[i].onmouseout = function() {
			this.style.border = "2px solid black"; //reverts to its original size border 
			this.style.color = "black"; //reverts to original text color
			this.style.textDecoration = "none"; //reverts to original text state
		};

		//activates when mouse clicks on a puzzle piece and checks if the piece is moveable in its current state
		squares[i].onclick = function(){
			if (isMoveable(parseInt(this.innerHTML)))
			{
				move(this.innerHTML-1); //moves into an empty space if true
					if (finishedPuzzle()) //checks when the all the 15 pieces are in its right space
					setTimeout(function () {
						window.alert('Congrats on solving the puzzle! Shuffle and play again!');
					}, 100); //alerts the player that they have won the game
				return;
			}
		};

		//Activated when the shuffle button is clicked
		document.getElementById('shufflebutton').onclick = function() {
			for (let i=0; i<300; i++) {
				let temp;
				//This was an idea that was borrowed from the internet
				//Once again, the actual implementation was done on my own, but the rand idea was found on the internet to randomly move pieces
				let rand = parseInt(Math.random()* 100) %4;
				if (rand == 0) {
					temp = up(positionX, positionY);
					if (temp != -1)
						move(temp);
				}

				if (rand == 1) {
					temp = down(positionX, positionY);
					if (temp != -1) 
						move(temp);
				}

				if (rand == 2) {
					temp = left(positionX, positionY);
					if (temp != -1){
						move(temp);}
				}

				if (rand == 3) {
					temp = right(positionX, positionY);
					if (temp != -1)
						move(temp);
				}
			}
		};
	}
};