 
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// BASIC 'UNIT' OF MOVEMENT SPEED AND SIZE OF INDIVIDUAL SNAKE HEAD + SEGMENTS

var unit = 20;

var food = {
    x: Math.round(Math.floor(Math.random() * 400) / 20) * 20,
    y: Math.round(Math.floor(Math.random() * 400) / 20) * 20
};
    
var scoreSnakeOne = document.getElementById('snake1_score');

// FUNCTION TO START A NEW INSTANCE OF THE GAME

var SnakeGame = function () {

    this.allObjects = [];

};

// FUNCTION TO SPAWN NEW FOOD AT RANDOM LOCATION

SnakeGame.prototype.spawnFood = function () {

    food = {
        x: Math.round(Math.floor(Math.random() * 400) / 20) * 20,
        y: Math.round(Math.floor(Math.random() * 400) / 20) * 20
    };
};


SnakeGame.prototype.drawFood = function () {

    ctx.fillRect(food.x, food.y, 20, 20);

};


// THIS FUNCTION WILL ANIMATE ALL OBJECTS (INCLUDING SNAKES) ON THE CANVAS, AT A RATE OF 250MS (IE. EVERY -SECOND).
// "GLOBAL TICK" REFERS TO THIS SWEEP EVERY .5 SECONDS TO UPDATE THE GAME SPACE.

SnakeGame.prototype.globalTick = function (tickRate) {

    var that = this;

    setInterval(function () {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // SWITCH TO MOVE SNAKE BASED ON DIRECTION IT'S FACING

        that.theSnake1.move();
        that.theSnake2.move();
        

        // DRAWING THE SNAKE BODY SEGMENTS
        
        ctx.fillStyle = 'green';
        theGame.theSnake1.segments.forEach(function (eachSegment, index) {
            ctx.fillRect(eachSegment.x, eachSegment.y, unit - 1, unit - 1);
        });
        theGame.theSnake2.segments.forEach(function (eachSegment, index) {
            ctx.fillRect(eachSegment.x, eachSegment.y, unit - 1, unit - 1);
        });
        
        that.theSnake1.boundaryCheck();
        that.theSnake2.boundaryCheck();
        

        // ctx.drawImage(theImage, that.snake.x, that.snake.y, that.snake.width, that.snake.height);

        that.theSnake1.drawSnake();
        that.theSnake2.drawSnake();

        that.drawFood();

        that.allObjects.splice(0, that.theSnake1.segments.length, that.theSnake1.segments);

        if (that.theSnake1.segments[0].x === food.x && that.theSnake1.segments[0].y === food.y) {
            that.theSnake1.eatFood();
        }

        if (that.theSnake2.segments[0].x === food.x && that.theSnake2.segments[0].y === food.y) {
            that.theSnake2.eatFood();
        }

        
    
    }, tickRate);
    
};

// FUNCTION TO SPAWN A NEW SNAKE AT START OF GAME -- OR AT SOME LATER POINT

var Snake = function (startingX, startingY, lengthOfSnake, movementSpeed) {

    this.x = startingX;
    this.y = startingY;

    this.width = unit;
    this.height = unit;
    
    this.speed = movementSpeed;
    this.directionFacing = 'UP';

    this.maxSegments = 4;

    this.segments = [];

    this.img = 'snake_head_up.png';

    this.lastSegment = this.segments[this.segments.length - 1];

};

Snake.prototype.boundaryCheck = function () {
        
    // IF SNAKE GOES TO LEFT EDGE
    
    if (this.x < 0) {
        this.x = canvas.width;
    
        // IF SNAKE GOES TO RIGHT EDGE
    
    } else if (this.x + unit > canvas.width) {
        this.x = 0 - unit;
    }
    
    // IF SNAKE GOES TO TOP EDGE
    
    if (this.y < 0) {
        this.y = canvas.height;
    
        // IF SNAKE GOES TO BOTTOM EDGE
    
    } else if (this.y + unit > canvas.height) {
        this.y = 0 - unit;
    }
};

// FUNCTION TO CHECK IF SNAKE CAN MOVE

Snake.prototype.canMove = function (snakeFutureX, snakeFutureY, objectsArray) {

    var that = this;

    for (var i = 0; i < objectsArray.length; i++) {
        for (j = 0; j < objectsArray[i].length; j++) {
            if (objectsArray[i][j].x === snakeFutureX && objectsArray[i][j].y === snakeFutureY) {
                
                theGame.that.resetSnake();
                return false;
            }
        }
    }
    return true;
    
};


Snake.prototype.move = function () {

    var that = this;

    switch (that.directionFacing) {

        case 'UP':
            if (that.canMove(that.x, that.y - unit, theGame.allObjects)) {
                that.y -= unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
            }
            break;

        case 'DOWN':
            if (that.canMove(that.x, that.y + unit, theGame.allObjects)) {
                that.y += unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
        
            }
            break;

        case 'RIGHT':
            if (that.canMove(that.x + unit, that.y, theGame.allObjects)) {
                that.x += unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
            }
            break;

        case 'LEFT':
            if (that.canMove(that.x - unit, that.y, theGame.allObjects)) {
                that.x -= unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
            }
            break;
    }
};
    




// FUNCTION FOR SNAKE EATING FOOD

Snake.prototype.eatFood = function () {

    var that = this;
    
    that.maxSegments++;
    theGame.spawnFood();
    
    // } else return;

};



Snake.prototype.drawSnake = function () {
    
    var that = this;
    
    theImage = new Image();
    
    theImage.src = that.img;
    
    theImage.onload = function () {
    
        ctx.drawImage(theImage, that.x, that.y, unit, unit);
    };
};

Snake.prototype.resetSnake = function () {
    
    var that = this;
    
    that.segments = [];
    that.x = 200;
    that.y = 200;
    that.maxSegments = 4;

};







// FUNCTION TO CHANGE DIRECTION OF THE SNAKE

Snake.prototype.changeDirection = function () {
    
    var that = this;
    
    document.addEventListener('keydown', function (e) {
    
        switch (e.which) {
        
            case 38:
                
                if (that.directionFacing != 'DOWN') {
                    that.directionFacing = 'UP';
                    that.img = 'snake_head_up.png';
                }
                break;

            case 40:

                if (that.directionFacing != 'UP') {
                    that.directionFacing = 'DOWN';
                    that.img = 'snake_head_down.png';
                }
                break;
    
            case 39:
            
                if (that.directionFacing != 'LEFT') {
                    that.directionFacing = 'RIGHT';
                    that.img = 'snake_head_right.png';
                }
                break;
    
            case 37:
                if (that.directionFacing != 'RIGHT') {
                    that.directionFacing = 'LEFT';
                    that.img = 'snake_head_left.png';
                }
                break;
        }
    });
};

// ALL DOM FUNCTIONS PUSHED TO BOTTOM OF JS FILE

document.getElementById("start-button").onclick = function () {

    theGame = new SnakeGame();
    theSnake1 = new Snake(100, 200, 1, 10);
    theSnake2 = new Snake(300, 200, 1, 10);
        
    
        
    // theGame.snake = theSnake;
    theGame.theSnake1 = theSnake1;
    theGame.theSnake2 = theSnake2;
    
    // theGame.snake.drawSnake();
    theGame.theSnake1.drawSnake();
    theGame.theSnake2.drawSnake();
        
    theGame.spawnFood();
    theGame.drawFood();
    
    theGame.globalTick(250);

    theGame.theSnake1.changeDirection();
    theGame.theSnake2.changeDirection();

    theGame.allObjects = [{ x: 0, y: 0 }];

};