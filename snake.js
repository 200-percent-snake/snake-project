 
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// BASIC 'UNIT' OF MOVEMENT SPEED AND SIZE OF INDIVIDUAL SNAKE HEAD + SEGMENTS

var unit = 20;

var food = {
    x: Math.round(Math.floor(Math.random() * 900) / 20) * 20,
    y: Math.round(Math.floor(Math.random() * 600) / 20) * 20
};

var speed = {
    x: Math.round(Math.floor(Math.random() * 900) / 20) * 20,
    y: Math.round(Math.floor(Math.random() * 600) / 20) * 20
};
    
var scoreSnakeOne = document.getElementById('snake1_score');
var scoreSnakeTwo = document.getElementById('snake2_score');

// FUNCTION TO START A NEW INSTANCE OF THE GAME

var SnakeGame = function () {

    this.allObjects = [];
    this.speedBoost = {};
    this.freezeSnake = {};
    this.xPowerUp = {};

};

SnakeGame.prototype.powerUpSelector = function () {
    
    var powerUps = ["speed", "freeze", "xPowerUp"];
    var x = Math.floor(Math.random() * 3);
   
    return powerUps[x];

};

// SnakeGame.prototype.powerUpSpawnDraw = function (randPower) {
    
//     if (randPower === "speed") {
        
//     }

    
// };

SnakeGame.prototype.winCheck = function () {

    if (theGame.theSnake1.segments.length >= 15) {

        setTimeout(function () {
            
            alert('Green Snake is the winner!');
            window.location.reload();

        }, 250);

    }

    if (theGame.theSnake2.segments.length >= 15) {

        setTimeout(function () {
            
            alert('Orange Snake is the winner!');
            window.location.reload();

        }, 250);
    }

};

// FUNCTION TO SPAWN NEW FOOD AT RANDOM LOCATION

SnakeGame.prototype.spawnFood = function () {

    food = {
        x: Math.round(Math.floor(Math.random() * 900) / 20) * 20,
        y: Math.round(Math.floor(Math.random() * 600) / 20) * 20
    };
};


SnakeGame.prototype.drawFood = function () {

    ctx.fillStyle = 'red';
    
    ctx.fillRect(food.x, food.y, 20, 20);

};


SnakeGame.prototype.spawnSpeed = function () {

    speed = {
        x: Math.round(Math.floor(Math.random() * 900) / 20) * 20,
        y: Math.round(Math.floor(Math.random() * 600) / 20) * 20
    };
};


SnakeGame.prototype.drawSpeed = function () {

    ctx.fillStyle = '#ffeb3b';
    
    ctx.fillRect(speed.x, speed.y, 20, 20);

};



// -------------------------------------------------------------------------

// THIS FUNCTION WILL ANIMATE ALL OBJECTS (INCLUDING SNAKES) ON THE CANVAS, AT A RATE OF 250MS (IE. EVERY -SECOND).
// "GLOBAL TICK" REFERS TO THIS SWEEP EVERY .5 SECONDS TO UPDATE THE GAME SPACE.

SnakeGame.prototype.globalTick = function (tickRate) {

    var that = this;

    setInterval(function () {
        
        // CLEARING ENTIRE CANVAS ON EACH CYCLE
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // SPLICING CURRENT POSITIONS OF ALL OF BOTH SNAKES' SEGMENTS INTO ALLOBJECTS ARRAY FOR COLLISION DETECTON

        that.allObjects.splice(0, that.theSnake1.segments.length, that.theSnake1.segments);
        that.allObjects.splice(1, that.theSnake2.segments.length, that.theSnake2.segments);

        // TURNING ON BOTH SNAKES' KEYDOWN LISTENER FUNCTIONS FOR CHANGING DIRECTION
        
        theGame.theSnake1.changeDirection1();
        theGame.theSnake2.changeDirection2();
        
        // SWITCH TO MOVE SNAKE BASED ON DIRECTION IT'S FACING

        that.theSnake1.move();
        that.theSnake2.move();
        
        // DRAWING THE SNAKE BODY SEGMENTS
        
        ctx.fillStyle = '#8bc34a';
        that.theSnake1.drawSnake();
        ctx.fillStyle = '#ff5722';
        that.theSnake2.drawSnake();
        
        // CHECKING THAT SNAKES ARE WITHIN-BOUNDS -- IF NOT, LOOPING THEM BACK AROUND ON OTHER SIDE
        
        that.theSnake1.boundaryCheck();
        that.theSnake2.boundaryCheck();
        
        // DRAWING FOOD OBJECT FROM GLOBAL GAME CONSTRUCTOR IN ITS CURRENT (RANDOMIZED) POSITION

        that.drawFood();
        that.drawSpeed();
        
        // CHECKS BOTH SNAKES IF IT ATE FOOD/SPEED
        var eatingFood = false;
        var eatingSpeed = false;

        for (var i = 0; i < that.theSnake1.segments.length; i++) {
            
            if (that.theSnake1.segments[i].x === food.x && that.theSnake1.segments[i].y === food.y) {
                eatingFood = true;
            }
            
            if (that.theSnake1.segments[i].x === speed.x && that.theSnake1.segments[i].y === speed.y) {
                eatingSpeed = true;
            }
        }
        
        if (eatingFood) {
            that.theSnake1.eatFood();
            eatingFood = false;

        }
        
        if (eatingSpeed) {
            that.theSnake1.eatSpeed();
            eatingSpeed = false;
        }


        for (var i = 0; i < that.theSnake2.segments.length; i++) {
            
            if (that.theSnake2.segments[i].x === food.x && that.theSnake2.segments[i].y === food.y) {
                eatingFood = true;
                
            }
            if (that.theSnake2.segments[i].x === speed.x && that.theSnake2.segments[i].y === speed.y) {
                eatingSpeed = true;
            }
        }

        if (eatingFood) {
            that.theSnake2.eatFood();
            eatingFood = false;

        }
        
        if (eatingSpeed) {
            that.theSnake2.eatSpeed();
            eatingSpeed = false;
        }


        // UPDATING THE SCORE (IE. SNAKES' LENGTHS) IN DOM
        
        scoreSnakeOne.innerHTML = "Snake 1:  " + theGame.theSnake1.maxSegments + " pts";    
        scoreSnakeTwo.innerHTML = "Snake 2:  " + theGame.theSnake2.maxSegments + " pts";
        
        // CHECKING TO SEE IF WIN CONDITION HAS BEEN MET

        that.winCheck();

    }, tickRate);
    
};

// -------------------------------------------------------------------------

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
                
                that.resetSnake(that);
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

                for (var i = 1; i <= (this.speed / 20); i++) {
                    that.y -= unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
                }
            }
            break;

        case 'DOWN':
            if (that.canMove(that.x, that.y + unit, theGame.allObjects)) {
                for (var i = 1; i <= (this.speed / 20); i++) {
                
                    that.y += unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
        
            }
        }
            break;

        case 'RIGHT':
            if (that.canMove(that.x + unit, that.y, theGame.allObjects)) {
                for (var i = 1; i <= (this.speed / 20); i++) {
                that.x += unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
            }
        }
            break;

        case 'LEFT':
            if (that.canMove(that.x - unit, that.y, theGame.allObjects)) {
                for (var i = 1; i <= (this.speed / 20); i++) {
                that.x -= unit;
                that.segments.unshift({ x: that.x, y: that.y });
                if (that.segments.length > that.maxSegments) {
                    that.segments.pop();
                }
            }
        }
            break;
    }
};
    
Snake.prototype.resetSnake = function (whichSnake) {
    
    whichSnake.segments = [];
    whichSnake.x = Math.round(Math.floor(Math.random() * 900) / 20) * 20;
    whichSnake.y = Math.round(Math.floor(Math.random() * 600) / 20) * 20;
    whichSnake.maxSegments = 4;

};

// FUNCTION FOR SNAKE EATING FOOD

Snake.prototype.eatFood = function () {

    var that = this;
    
    that.maxSegments++;
    theGame.spawnFood();

};

Snake.prototype.eatSpeed = function () {

    var that = this;
    
    that.speed = 2*that.speed;
    theGame.spawnSpeed();

    setTimeout(function () { that.speed = that.speed/2; }, 10000);

};

Snake.prototype.drawSnake = function () {
    
    var that = this;
    
    theImage = new Image();
    
    theImage.src = that.img;
    
    theImage.onload = function () {
    
        ctx.drawImage(theImage, that.x, that.y, unit, unit);
    };
        that.segments.forEach(function (eachSegment, index) {
            ctx.fillRect(eachSegment.x, eachSegment.y, unit, unit);
        });
};



// FUNCTION TO CHANGE DIRECTION OF THE SNAKE

Snake.prototype.changeDirection1 = function () {
    
    var that = this;
    
    document.addEventListener('keydown', function (e) {
        
        switch (e.which) {
        
            case 38:
                
                if (that.directionFacing != 'DOWN') {
                    e.preventDefault();
                    that.directionFacing = 'UP';
                    that.img = 'snake_head_up.png';
                }
                break;

            case 40:

                if (that.directionFacing != 'UP') {
                    e.preventDefault();
                    that.directionFacing = 'DOWN';
                    that.img = 'snake_head_down.png';
                }
                break;
    
            case 39:
            
                if (that.directionFacing != 'LEFT') {
                    e.preventDefault();
                    that.directionFacing = 'RIGHT';
                    that.img = 'snake_head_right.png';
                }
                break;
    
            case 37:
                if (that.directionFacing != 'RIGHT') {
                    e.preventDefault();
                    that.directionFacing = 'LEFT';
                    that.img = 'snake_head_left.png';
                }
                break;
        }
    });
};

Snake.prototype.changeDirection2 = function () {
    
    var that = this;
    
    document.addEventListener('keydown', function (e) {
    
        switch (e.which) {
        
            case 87:
                
                if (that.directionFacing != 'DOWN') {
                    e.preventDefault();
                    that.directionFacing = 'UP';
                    that.img = 'snake_head2_up.png';
                }
                break;

            case 83:

                if (that.directionFacing != 'UP') {
                    e.preventDefault();
                    that.directionFacing = 'DOWN';
                    that.img = 'snake_head2_down.png';
                }
                break;
    
            case 68:
            
                if (that.directionFacing != 'LEFT') {
                    e.preventDefault();
                    that.directionFacing = 'RIGHT';
                    that.img = 'snake_head2_right.png';
                }
                break;
    
            case 65:
                if (that.directionFacing != 'RIGHT') {
                    e.preventDefault();
                    that.directionFacing = 'LEFT';
                    that.img = 'snake_head2_left.png';
                }
                break;
        }
    });
};


// ALL DOM FUNCTIONS PUSHED TO BOTTOM OF JS FILE

document.getElementById("start-button").onclick = function () {

    theGame = new SnakeGame();
    theSnake1 = new Snake(100, 200, 1, unit);
    theSnake2 = new Snake(300, 200, 1, unit);
        
    
        
    // theGame.snake = theSnake;
    theGame.theSnake1 = theSnake1;
    theGame.theSnake2 = theSnake2;

    // theGame.theSnake2.img = 'snake_head2_up.png';
    
    // theGame.snake.drawSnake();
    // theGame.theSnake1.drawSnake();
    // theGame.theSnake2.drawSnake();
        
    theGame.spawnFood();
    theGame.drawFood();
    
    theGame.globalTick(100);

    theGame.allObjects = [{ x: 0, y: 0 }];

};