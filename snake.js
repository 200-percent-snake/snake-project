
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// BASIC 'UNIT' OF MOVEMENT SPEED AND SIZE OF INDIVIDUAL SNAKE HEAD + SEGMENTS

var unit = 20;

var food = {
    x: Math.round(Math.floor(Math.random() * 400) / 20) * 20,
    y: Math.round(Math.floor(Math.random() * 400) / 20) * 20
    }

// FUNCTION TO START A NEW INSTANCE OF THE GAME

var SnakeGame = function() {

    this.snake = {};

    this.allObjects = [];

}

// THIS FUNCTION WILL ANIMATE ALL OBJECTS (INCLUDING SNAKES) ON THE CANVAS, AT A RATE OF 250MS (IE. EVERY -SECOND).
// "GLOBAL TICK" REFERS TO THIS SWEEP EVERY .5 SECONDS TO UPDATE THE GAME SPACE.

SnakeGame.prototype.globalTick = function(tickRate) {

    var that = this;

    setInterval(function(){
        
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // SWITCH TO MOVE SNAKE BASED ON DIRECTION IT'S FACING

        
        switch (theGame.snake.directionFacing) {

            case 'UP':
            if (that.snake.canMove(that.snake.x, that.snake.y - unit, that.allObjects)) {
                that.snake.y -= unit;
                that.snake.segments.unshift({x: that.snake.x, y: that.snake.y});
                if (that.snake.segments.length > that.snake.maxSegments) { that.snake.segments.pop() };
                }
            break;

            case 'DOWN':
            if (that.snake.canMove(that.snake.x, that.snake.y + unit, that.allObjects)) {
                that.snake.y += unit;
                that.snake.segments.unshift({x: that.snake.x, y: that.snake.y});
                if (that.snake.segments.length > that.snake.maxSegments) { that.snake.segments.pop() };
                }
            break;

            case 'RIGHT':
            if (that.snake.canMove(that.snake.x + unit, that.snake.y, that.allObjects)) {
                that.snake.x += unit;
                that.snake.segments.unshift({x: that.snake.x, y: that.snake.y});
                if (that.snake.segments.length > that.snake.maxSegments) { that.snake.segments.pop() };
                }
            break;

            case 'LEFT':
            if (that.snake.canMove(that.snake.x - unit, that.snake.y, that.allObjects)) {
                that.snake.x -= unit;
                that.snake.segments.unshift({x: that.snake.x, y: that.snake.y});
                if (that.snake.segments.length > that.snake.maxSegments) { that.snake.segments.pop() };
                }
            break;                
        }

        // DRAWING THE SNAKE BODY SEGMENTS
        
        ctx.fillStyle = 'green';
        theGame.snake.segments.forEach(function(eachSegment, index) {
            ctx.fillRect(eachSegment.x, eachSegment.y, unit-1, unit-1);
            });
        
        // EDGE BOUNDARY LOOPING
        
            // IF SNAKE GOES TO LEFT EDGE
        
        if (that.snake.x < 0) {
    
            that.snake.x = canvas.width;
        
            // IF SNAKE GOES TO RIGHT EDGE
        
        } else if (that.snake.x + unit > canvas.width) {
        
            that.snake.x = 0 - unit;
        
        }
        
            // IF SNAKE GOES TO TOP EDGE
        
        if (that.snake.y < 0) {
        
            that.snake.y = canvas.height;
        
            // IF SNAKE GOES TO BOTTOM EDGE
        
        } else if (that.snake.y + unit > canvas.height) {
        
            that.snake.y = 0 - unit;

        }

        // ctx.drawImage(theImage, that.snake.x, that.snake.y, that.snake.width, that.snake.height);

        that.snake.drawSnake();
        that.snake.drawFood();
        that.snake.eatFood();
        that.allObjects.splice(0, that.snake.segments.length, that.snake.segments);
    
    }, tickRate);
    
    

}

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

}

// FUNCTION TO SPAWN NEW FOOD AT RANDOM LOCATION

Snake.prototype.spawnFood = function() {

    food = {
        x: Math.round(Math.floor(Math.random() * 400) / 20) * 20,
        y: Math.round(Math.floor(Math.random() * 400) / 20) * 20
    }
}

Snake.prototype.drawSnake = function(){
    
    var that = this;
    
    theImage = new Image();
    
    theImage.src = that.img;
    
    theImage.onload = function(){
    
        ctx.drawImage(theImage, that.x, that.y, unit, unit);
    }
  }

Snake.prototype.resetSnake = function() {
    
    var that = this;
    
    that.segments = [];
    that.x = 200;
    that.y = 200;
    that.maxSegments = 4;

}

// FUNCTION FOR SNAKE EATING FOOD

Snake.prototype.eatFood = function() {

    var that = this;
    
    if (theGame.snake.segments[0].x === food.x && theGame.snake.segments[0].y === food.y) {

        console.log('collision with food');
        
        that.maxSegments++;
        that.spawnFood();
    
    } else {
        console.log('NO COLLISION');
    }
}

Snake.prototype.drawFood = function () {

    ctx.fillRect(food.x,food.y,20,20);

}

  // FUNCTION TO CHECK IF SNAKE CAN MOVE

Snake.prototype.canMove = function (snakeFutureX, snakeFutureY, objectsArray) {

    var that = this;
    
    for (var i = 0; i < objectsArray.length; i++) {
        for (j = 0; j < objectsArray[i].length; j++) {
            if (objectsArray[i][j].x === snakeFutureX && objectsArray[i][j].y === snakeFutureY) {
                
                theGame.snake.resetSnake();
                return false;
                }
            }
        }
        return true;
        
}

// FUNCTION TO CHANGE DIRECTION OF THE SNAKE

Snake.prototype.changeDirection = function() {
    
    var that = this;
    
    document.addEventListener('keydown', function(e) {
    
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
        };
    });
}

// ALL DOM FUNCTIONS PUSHED TO BOTTOM OF JS FILE

document.getElementById("start-button").onclick = function() {

        theGame = new SnakeGame();
        theSnake = new Snake(200,200,1,10);
        
        theGame.snake = theSnake;
    
        theGame.snake.drawSnake();
        
        theGame.globalTick(250);

        // theGame.snake.edgeLoop();

        theGame.snake.changeDirection();

        theGame.allObjects = [{x: 0, y: 0}];

}