// Enemies our player must avoid  我们的玩家必须避免敌人
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,  我们用到的每个实例变量都在这里
    // we've provided one for you to get started  我们已经为你提供了一个开始

    // The image/sprite for our enemies, this uses  我们敌人的形象，这样使用
    // a helper we've provided to easily load images  我们提供了一个帮助用户轻松加载图像的助手。
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game  更新敌人的位置，游戏所需的方法
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter  你应该用DT参数乘以任何运动。
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 101*5) {
        this.x = -101;
    }
    this.x += dt*this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 95, 70, 120);
};

// Now write your own player class  现在编写你自己的player类
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.canMove = true;
    this.lives = 3;
};

Player.prototype.update = function () {
    if (this.canMove && Engine.checkCollisionsEnemy()) {
        //碰撞敌人
        this.canMove = false;
        Engine.pauseGame();
        if (this.lives > 0) {
            this.lives--;
            DomHandler.updateLife();
            if (this.lives === 0) {
                //最后一条命都没了，游戏结束
                DomHandler.updateTitle(3)
            } else {
                DomHandler.updateTitle(2);
                setTimeout(function () {
                    player.initLocation();
                    Engine.runGame();
                    DomHandler.updateTitle(0);
                },1500)
            }
        }
    }

};

//初始化角色位置
Player.prototype.initLocation = function () {
    this.x = 101 * 2;
    this.y = 83 * 4 + 72;
    this.canMove = true;
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (movement) {
    var self = this;
    if (self.canMove) {
        switch (movement) {
            case 'left':
                if (self.x > 0) {
                    self.x -= 101;
                    if (checkRockCollisions()) {
                        self.x += 101;
                    }
                }
                break;
            case 'right':
                if (self.x < 101 * 4) {
                    self.x += 101;
                    if (checkRockCollisions()) {
                        self.x -= 101;
                    }
                }
                break;
            case 'up':
                if (self.y > 0) {
                    self.y -= 83;
                    if (self.y < 0) {
                        //如果过关了，更新分数，1秒后刷新
                        DomHandler.updateScore(10);
                        DomHandler.updateTitle(1);
                        self.canMove =false;
                        setTimeout(function () {
                            Engine.reset();
                            self.initLocation();
                            DomHandler.updateTitle(0);
                        },1000)
                    }
                    if (checkRockCollisions()) {
                        self.y += 83;
                    }
                }
                break;
            case 'down':
                if (self.y < 83 * 4) {
                    self.y += 83;
                    if (checkRockCollisions()) {
                        self.y -= 83;
                    }
                }
                break;
        }
        handlePropCollisions();
    }
};

//检测与石头碰撞
function checkRockCollisions() {
    var collision = false;
    rocks.forEach(function (rock) {
        if (player.x === rock.x && player.y === rock.y + 7)
            collision = true;
    });
    return collision;
}

var Rock = function (x, y) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y;
};

//处理与道具碰撞
function handlePropCollisions() {
    var prop = Engine.checkCollisionsProp();
    if (prop) {
        //碰撞后清除道具
        allProps.splice(allProps.indexOf(prop),1);
        if (prop instanceof Heart) {
            if (player.lives < 3) {
                player.lives++;
                DomHandler.updateLife();
            } else {
                //如果角色已经有3条命，获得一些积分
                DomHandler.updateScore(50);
            }
        }
        if (prop instanceof Star) {
            //获得大量积分
            DomHandler.updateScore(100);
        }
        if (prop instanceof GemGreen) {
            //随机消除一个障碍物
            rocks.splice(Engine.getRandomInt(0,rocks.length),1);
        }
        if (prop instanceof GemBlue) {
            //将所有敌人移到屏幕外
            allEnemies.forEach(function (enemy) {
                enemy.x = -101;
            });
        }
    }
}

Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 20, 80, 130);
};

var Heart = function (x, y) {
    this.sprite = 'images/Heart.png';
    this.x = x;
    this.y = y;
};

Heart.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 45, 60, 100);
};

var Star = function (x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
};

Star.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 45, 60, 100);
};

var GemBlue = function (x, y) {
    this.sprite = 'images/Gem Blue.png';
    this.x = x;
    this.y = y;
};

GemBlue.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 45, 60, 100);
};

var GemGreen = function (x, y) {
    this.sprite = 'images/Gem Green.png';
    this.x = x;
    this.y = y;
};

GemGreen.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20, this.y + 45, 60, 100);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var rocks = [];//石头
var player = new Player(101 * 2,83 * 4 + 72);
var allPropType = ['Heart','Star','Gem Blue','Gem Green'];
var currentPropType = [];
var allProps = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

DomHandler.initHearts();
DomHandler.updateTitle(0);

