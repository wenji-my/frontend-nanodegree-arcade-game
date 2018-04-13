var starTimer = true;
var startMillisecond = Date.now();
var stopMillisecond = 0;//暂停时的毫秒数
var stopSecond = 0;//暂停期间经过的毫秒数
function timing() {
    if (starTimer) {
        //开始计时
        if (stopMillisecond) {
            //如果暂停了，计算暂停期间经过多少毫秒
            stopSecond += Date.now() - stopMillisecond
        }
        var temp = Date.now() - startMillisecond - stopSecond;
        stopMillisecond = 0;
        var millisecondStr;
        if (temp % 1000 < 10) {
            millisecondStr = '00' + temp % 1000;
        } else if (temp % 1000 >= 10 && temp % 1000 < 100) {
            millisecondStr = '0' + temp % 1000;
        } else if (temp % 1000 >= 100 && temp % 1000 < 1000) {
            millisecondStr = temp % 1000;
        }
        if (millisecondStr) {
            var useTime = `${Math.ceil(temp/1000)}.${millisecondStr}`;
        }
    }
}

//计时器
var timer = setInterval(timing,10);

var DomHandler = (function () {
    var scoreSpan = document.getElementById('score'),
        menu = document.getElementById('btn-menu'),
        menuList = document.getElementById('menu-list'),
        roleBtn = document.getElementById('btn-role'),
        roleList = document.getElementById('role-list'),
        instruction = document.getElementById('btn-instruction'),
        instructionBoard = document.getElementById('instruction-board'),
        closeInstruction = document.getElementById('btn-close-instruction'),
        life = document.getElementById('life'),
        title = document.getElementById('title'),
        restartBtn = document.getElementById('btn-restart');

    var isHideMenu = true;
    var score = 0;//分数
    var propArea = [];//道具和障碍物可落的区域

    //初始化道具和障碍物可落的区域
    for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 5; k++) {
            propArea.push(`${101 * k},${j * 83 + 65}`)
        }
    }

    //初始化生命值
    function initHearts() {
        updateLife();
    }

    function updateLife() {
        var hearts = '';
        switch (player.lives) {
            case 1:
                hearts = '❤';
                break;
            case 2:
                hearts = '❤❤';
                break;
            case 3:
                hearts = '❤❤❤';
                break;
        }
        life.textContent = hearts;
    }

    function updateTitle(what) {
        var titleContent = '';
        switch (what) {
            case 0:
                titleContent = '过河小游戏';
                title.style.color = 'white';
                break;
            case 1:
                titleContent = '恭喜你过关了！';
                title.style.color = 'yellow';
                break;
            case 2:
                titleContent = '你被敌人碰到啦！';
                title.style.color = 'red';
                break;
            case 3:
                titleContent = '游戏结束！';
                title.style.color = 'red';
                break;
        }
        title.textContent = titleContent;
    }

//显示菜单
    function showMenu() {
        menuList.style.height = '186px';
        isHideMenu = false;
        starTimer = false;
        stopMillisecond = Date.now();//得到暂停时的毫秒数
        Engine.pauseGame();
    }

//隐藏菜单
    function hideMenu() {
        menuList.style.height = '0';
        isHideMenu = true;
        starTimer = true;
        Engine.runGame();
    }

//菜单按钮的点击事件
    menu.onclick = function (e) {
        e.stopPropagation();//阻止事件向上传播
        if (isHideMenu) {
            showMenu();
        } else {
            hideMenu();
        }
    };

//菜单列表的点击事件
    menuList.onclick = function (e) {
        e.stopPropagation();
    };

//点击菜单以外的地方要隐藏菜单
    document.onclick = function () {
        if (!isHideMenu) {
            hideMenu();
        }
    };

//显示角色列表
    function showRoleList() {
        roleList.style.width = '310px'
    }

//隐藏角色列表
    function hideRoleList() {
        roleList.style.width = '0'
    }

//鼠标在角色按钮上和角色列表上时显示角色列表，移出时隐藏列表
    roleBtn.onmouseover = function () {
        showRoleList();
    };

    roleBtn.onmouseout = function () {
        hideRoleList();
    };

    roleList.onmouseover = function () {
        showRoleList();
    };

    roleList.onmouseout = function () {
        hideRoleList();
    };

    var roleImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

//切换角色
    for (var i = 0; i < roleImages.length; i++) {
        var roleImage = document.getElementById('role-'+i);
        (function (index) {
            roleImage.onclick = function () {
                player.sprite = roleImages[index];
                hideRoleList();//切换成功后隐藏角色列表
            }
        })(i)
    }

//显示游戏说明
    function showInstruction() {
        instructionBoard.style.display = 'block';
        Engine.pauseGame();
        starTimer = false;
    }

//隐藏游戏说明
    function hideInstruction() {
        instructionBoard.style.display = 'none';
        Engine.runGame();
        starTimer = true;
    }

    //游戏说明点击事件
    instruction.onclick = function () {
        hideMenu();
        showInstruction();
    };

//关闭游戏说明
    closeInstruction.onclick = function () {
        hideInstruction();
    };

    //重新开始点击事件
    restartBtn.onclick = function () {
        hideMenu();
        score = 0;
        player.sprite = 'images/char-boy.png';
        player.lives = 3;
        player.initLocation();
        updateLife();//重置生命值
        updateTitle(0);//重置标题
        updateScore(0);//重置分数
        Engine.reset();
        startMillisecond = Date.now();//重置开始计时的毫秒数
        stopMillisecond = 0;//重置暂停时的毫秒数
        stopSecond = 0;//重置暂停期间经过的毫秒数
    }

    //更新分数
    function updateScore(opt) {
        scoreSpan.textContent = `分数：${score+=opt}`;
    }

    return {
        initHearts: initHearts,
        updateLife: updateLife,
        updateTitle: updateTitle,
        updateScore: updateScore,
        propArea: propArea,
        starTimer: starTimer
    }
})();