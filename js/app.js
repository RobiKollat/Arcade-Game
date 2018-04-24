/* Variables and Objects*/
var screenwidth = 500;
var gamestate = true;
var highscore = 0;

/* Creates enemies going to each row */
var rowsenemies = [50, 173, 326, 290];

/* Enemies */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/car.png';
    var randomrow = randomEnemies(0, rowsenemies.length -1);
    this.row = randomrow + 1;
    this.x = randomEnemies(-50, -500);
    this.y = rowsenemies[randomrow];
    this.speed = randomEnemies(100, 300);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt); 
    if (this.x > screenwidth) {
        this.x = -100;
        this.speed = randomEnemies(100, 300);
        var randomrow = randomEnemies(0, rowsenemies.length -1);
        this.row = randomrow + 1;
        this.y = rowsenemies[randomrow];
    }

    /*This will determine when the player gets hit and it will reset once you ran out of all lives*/
    if (this.row == player.row) {
        if (this.x + 70 >= player.x && this.x <= player.x + 70) {
            player.life -=1;
            player.reset();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Generates random enemies by finding the random number between both the minimum and maximum number of enemy rows.
function randomEnemies(min, max)
{
    return Math.floor(Math.random()*(max - min + 1) + min);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/mechanic-boy.png';
    this.row = 5;
    this.score = 0;
    gamestate = true;
    this.x = 202;
    this.y = 405;
    this.life = 3;

};

// This will update the player's position
// Note: Also uses 'dt' from Enemy.prototype.update for the time delta between ticks
Player.prototype.update = function(dt) {

    //If you ran out of lives, then the game will stop.
    if (this.life === 0) {
        gamestate = false;
    }

    //Each time you're making it to the end of the map, you'll get 1 point.
    //If you reset, then the score will go back to 0.
    if (this.y <= 60) {
        this.score += 1;
        this.reset();
    }


};

//This will give key inputs of moving your player, pause, and reset buttons.
Player.prototype.handleInput = function(key) {

    if (key == 'up' && this.y >= 60 && gamestate)
    {
        this.y = this.y - 83;
        this.row += -1;
    }

    if (key == 'down' && this.y <= 399 && gamestate)
    {
        this.y = this.y + 83;
        this.row += 1;
    }

    if (key == 'left' && this.x >= 1 && gamestate)
    {
        this.x = this.x - 101;
    }

    if (key == 'right' && this.x <= 402 && gamestate)
    {
        this.x = this.x + 101;
    }

    if (key == 'pause')
    {
        if (gamestate) {
            gamestate = false;
        } else {
            gamestate = true;
        }
    }

    if (key == 'reset')
    {
        this.newGame();
    }

};

//Draws the player and other features on the game screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillText('Score: ' + this.score, 355, 550);

    //The high score will remain the highest until you refresh the game so that it will go back to 0.
    ctx.fillText('High Score: ' + highscore, 155, 90);
    if(this.score > highscore){
        highscore += 1;
    }
    if (this.life === 0) {
        ctx.fillText('Game Over', 155, 345);
    
    }
};

//Creates a new game in which the player goes back to its original properties.
Player.prototype.newGame = function() {
    player = new Player();
};

//Resets the player back to its original position.
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 405;
    this.row = 5;
};

//This will show the player's lives
var lifehearts = function() {
    this.sprite = 'images/LifeMechanic.png';
};

//This will draw the player on the screen.
lifehearts.prototype.render = function() {
    var x = 10;
    for (var i = 0; i < player.life; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, 60);
        x += 35;   
    }
};

//Objects added after the additions for players, life, and enemies.
var player = new Player();
var life = new lifehearts();
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause',
        82: 'reset'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//This will disable scrolling when players are using their keys to move.
document.addEventListener('keydown', function(e) {
  if ([37, 38, 39, 40, 80, 82].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }  
}, false);

