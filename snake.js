// The Snake constructor
var Snake = function (snakeNumber) {

	this.snakeNumber = snakeNumber;

	this.score = 0;
	
	this.segments = [
		new Block(7, 5),
		new Block(6, 5),
		new Block(5, 5)
	];

	if (snakeNumber == 1) {
		this.direction = "right";
		this.nextDirection = "right";
	};

	if (snakeNumber == 2) {
		this.direction = "down2";
		this.nextDirection = "down2";
	};

};

// Draw a square for each segment of the snake's body
Snake.prototype.draw = function () {
	if (this.snakeNumber == 1) {
		for (var i = 0; i < this.segments.length; i++) {
			this.segments[i].drawSquare("Blue");
		};
	};
	if (this.snakeNumber == 2) {
		for (var i = 0; i < this.segments.length; i++) {
			this.segments[i].drawSquare("Aqua");
		};
	};
};

// Create a new head and add it to the beginning of the snake to move the snake in its current direction
Snake.prototype.move = function (otherSnake) {
	
	var head = this.segments[0];
	var newHead;

	this.direction = this.nextDirection;

	if (this.snakeNumber == 1) {
		if (this.direction === "right") {
			newHead = new Block(head.col + 1, head.row);
		} else if (this.direction === "down") {
			newHead = new Block(head.col, head.row + 1);
		} else if (this.direction === "left") {
			newHead = new Block(head.col - 1, head.row);
		} else if (this.direction === "up") {
			newHead = new Block(head.col, head.row - 1);
		};
	} 

	if (this.snakeNumber == 2) {
		if (this.direction === "right2") {
			newHead = new Block(head.col + 1, head.row);
		} else if (this.direction === "down2") {
			newHead = new Block(head.col, head.row + 1);
		} else if (this.direction === "left2") {
			newHead = new Block(head.col - 1, head.row);
		} else if (this.direction === "up2") {
			newHead = new Block(head.col, head.row - 1);
		};
	}
	
	if (this.checkCollision(newHead)) {
		gameOver();
		return;
	};

	this.segments.unshift(newHead);

	if (otherSnake !== undefined) {
		this.eatenOtherSnake(otherSnake, newHead);
	};

	var appleHit = this.hitApple(newHead);
	if (appleHit >= 0) {
		this.score++;
		apples[appleHit].move();
	} else if (newHead.equal(noWalls.position)) {
		this.score++;
		showWalls = false;
		if (timeoutId !== 0) {
			clearTimeout(timeoutId);
		};
		timeoutId = setTimeout(function () {
			showWalls = true;
			timeoutId = 0;
		}, 5000);
		noWalls.move();
	} else if (newHead.equal(threePoints.position)) {
		this.score += 3;
		addToBody = 2;
		threePoints.move();
	} else {
		var bombHit = this.hitBomb(newHead);
		if (bombHit >= 0) {
			this.score--;
			if (this.score < 0) {
				gameOver();
			};
			this.segments.pop();
			this.segments.pop();
			bombs[bombHit].move();
		} else{
			if (addToBody > 0) {
				addToBody--;
			} else {
				this.segments.pop();
			};
		};
	};

};

// Check if the snake has collided with the wall or itself 
Snake.prototype.checkCollision = function (head) {
	
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);

	if (showWalls) {
		var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	} else {
		var wallCollision = false;
		if (leftCollision) {
			head.col = widthInBlocks - 1;
		} else if (rightCollision) {
			head.col = 0;
		} else if (topCollision) {
			head.row = heightInBlocks - 1;
		} else if (bottomCollision) {
			head.row = 0;
		};
	};

	var selfCollision = false;

	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		};
	};

	return wallCollision || selfCollision;

};

// Check if the snake has colided with a apple
Snake.prototype.hitApple = function (head) {
	
	var appleHit = -1

	for (var i = 0; i < apples.length; i++) {
		if (head.equal(apples[i].position)) {
			appleHit = i;
		};	
	};

	return appleHit;

}

// Check if a snake has eaten another snake
Snake.prototype.eatenOtherSnake = function (otherSnake, head) {
	for (var i = 1; i < otherSnake.segments.length; i++) {
		if (otherSnake.segments[i].col == head.col && otherSnake.segments[i].row == head.row) {
			for (var j = i; j < otherSnake.segments.length; j++) {
				otherSnake.segments.pop();
				otherSnake.score--;
				this.score++;
				addToBody++;
			};
			addToBody--;
		};
	};
};

// Check if the snake has colided with a bomb
Snake.prototype.hitBomb = function (head) {
	
	var bombHit = -1

	for (var i = 0; i < bombs.length; i++) {
		if (head.equal(bombs[i].position)) {
			bombHit = i;
		};	
	};

	return bombHit;

}

// Set the snake's next direction based on the keyboard
Snake.prototype.setDirection = function (newDirection) {

	if (this.snakeNumber == 1) {
		if (this.direction === "up" && newDirection === "down") {
			return;
		} else if (this.direction === "right" && newDirection === "left") {
			return;
		} else if (this.direction === "down" && newDirection === "up") {
			return;
		} else if (this.direction === "left" && newDirection === "right") {
			return;
		};
	};

	if (this.snakeNumber == 2) {
		if (this.direction === "up2" && newDirection === "down2") {
			return;
		} else if (this.direction === "right2" && newDirection === "left2") {
			return;
		} else if (this.direction === "down2" && newDirection === "up2") {
			return;
		} else if (this.direction === "left2" && newDirection === "right2") {
			return;
		};
	};
	
	this.nextDirection = newDirection;

};
