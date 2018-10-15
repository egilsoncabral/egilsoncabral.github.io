const UPPER_LIMIT = 50;
const INFERIOR_LIMIT = 380;
const LEFT_LIMIT = 0;
const RIGHT_LIMIT = 400;
const INITIAL_POSITION_X = 200;
const INITIAL_POSITION_Y = 380;


/**
 * Class representing a component on screen.
 */
class Component {
    constructor(x, y, sprite) {
      this.x = x;
      this.y = y;
      this.sprite = sprite;
    }
  
  /** Render the object on screen. */
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

/**
 * Class representing a enemy.
 * @extends Component
 */
class Enemy extends Component {
    /**
    * Create a enemy.
    * @constructor
    * @param {number} x - The horizontal coordinate.
    * @param {number} y - The vertical coordinate.
    * @param {number} speed - The enemies speed.
    * @param {Player} player - The player object.
    * @param {string} sprite - The image's path.
    */
    constructor (x, y, speed, player, sprite) {
        super(x,y,sprite);
        this.speed = speed;
        this.player = player;
    }
    /** Update the enemies positions on screen. */
    update (dt) {
      // responsible to move the enemies.
      this.x = this.x + this.speed * dt;
      //verify collisions
      if(this.player.x + 70> this.x && this.player.x < this.x + 100 && this.player.y + 85 > this.y && this.player.y < this.y + 60){
        this.player.hasCollided = true;
        if (!this.player.stillHaveHearts()) {
            gameOver();
        }
      }
    };
    
};


/**
 * Class representing a player.
 * @extends Component
 */
class Player extends Component{

    /**
    * Create a player.
    * @constructor
    * @param {number} x - The horizontal coordinate.
    * @param {number} y - The vertical coordinate.
    * @param {string} sprite - The image's path.
    * @param {Array} allHearts - The player's lives.
    */
    constructor(x, y, sprite, allHearts){
        super(x, y, sprite)
        this.hasCollided = false;
        this.allHearts = allHearts;
        this.hasWin = false;
        this.hasLost = false;
    }
    /** Update the player position. */
    update(){
        if (this.hasCollided) {
            this.x = INITIAL_POSITION_X;
            this.y = INITIAL_POSITION_Y;  
            this.hasCollided = false;
            this.allHearts.splice(0,1); 
        }
    }
    /** Render the player object and the lives on screen. */
    render(){
      super.render();
      //draw lives
      ctx.beginPath();
      ctx.font = "16pt Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Lives: ", 350, 30);
      ctx.closePath();
    }
    /** Verify if the player still have lives. */
    stillHaveHearts() {
        return this.allHearts.length > 1 ? true : false; 
    }

    /** Move the player to initial position. */
    reset(){
       this.x = INITIAL_POSITION_X;
       this.y = INITIAL_POSITION_Y;
       this.allHearts = allHearts;
       this.hasWin = false;
       this.hasLost = false;
    }
    
    /** Handle with keyboard inputs. */
    handleInput(value){
        if (!this.hasWin && !this.hasLost) {
            switch (value) {
                case ('up'):
                    if (this.y >= UPPER_LIMIT) {
                        this.y = this.y - 84;
                    } else {
                        this.y = -40;
                        this.hasWin = true;
                        document.getElementById('winner').style.display = "block";
                    }
                    break;
                case ('down'):
                    if (this.y < INFERIOR_LIMIT) {
                        this.y = this.y + 84;
                    } else {
                        this.y = INFERIOR_LIMIT;
                    }
                    break;
                case ('left'):
                    if (this.x > LEFT_LIMIT) {
                        this.x = this.x - 100;
                    } else {
                        this.x = LEFT_LIMIT;
                    }
                    break;
                case ('right'):
                    if (this.x < RIGHT_LIMIT) {
                        this.x = this.x + 100;
                    } else {
                        this.x = RIGHT_LIMIT
                    }
                    break;
            }
        }
    }
};

/**
 * Class representing a heart.
 * @extends Component
 */
class Heart extends Component{
    /**
    * Create a heart.
    * @constructor
    * @param {number} x - The horizontal coordinate.
    * @param {number} y - The vertical coordinate.
    * @param {string} sprite - The image's path.
    */
    constructor(x, y, sprite){
        super(x, y, sprite)
    }

    /** Update the hearts on screen. */
    update(){
        super.render()
    }
};

const enemySpawnLineX = [420, 450, 480];
const enemySpawnLineY = [60, 140, 220];
var allEnemies = new Set();
var allHearts = [];
createHearts();

var player = new Player(INITIAL_POSITION_X, INITIAL_POSITION_Y, 'images/char-boy.png', allHearts);
createEnemies();

setInterval(addEnemies, 1500);

/** Create 4 initial enemies so the screen will not begin empty */
function createEnemies(){
      
    for(i = 0; i < 4; i++){
        allEnemies.add(new Enemy(Math.random()*420, enemySpawnLineY[Math.floor(Math.random()*4)], Math.random()*100+30, player, 'images/enemy-bug.png'));
    }
}

/** Creates the player's lives */
function createHearts(){
    for(i = 0; i < 3; i++){
        allHearts.push(new Heart(enemySpawnLineX[i], 0, 'images/heart.png'));
    } 
}


/** This recognizes key clicks and sends keys to the player object. */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/** Add new elements to the screen */
function addEnemies() {
    allEnemies.add(new Enemy(-100, enemySpawnLineY[Math.floor(Math.random()*3)], Math.random()*100+30, player, 'images/enemy-bug.png'));
}

/** Reset the game and start again */
function playAgain() {
    document.getElementById('winner').style.display = "none";
    document.getElementById('game-over').style.display = "none";
    allHearts = [];
    createHearts();
    player.reset();
}

/** Show the game over message */
function gameOver(){
    player.hasLost = true;
    document.getElementById('game-over').style.display = "block";
}