export default function Snake(){
    var canvas, ctx, frames = 0, length = 15, state = {
        players: [],
        foods: [],
        obstacles: []
    },
    theme = {
        level_background: "#50beff",
        player_foreground: "#ff0000",
        playerbody_foreground: "#ff9900",
        food_foreground: "#00ff00",
        obstacle_foreground: "#0000ff",
        pause_background: "#222",
        pause_foreground: "#0a4",
    },
    threads = [],
    intervals = {
        speed: 300
    },
    running = true,
    assets = [],
    assets_path = "src/assets/skin/snake",
    assets_resolution = 16,
    draw_img = true;
    

    function setup(canvasId, _length){
        canvas = document.getElementById(canvasId);

        if(typeof(_length) != 'undefined')
            length = _length;

        loadAssets();

        canvas.width = canvas.height = assets_resolution * length;

        console.log(canvas.width, canvas.height, length);
        
        ctx = canvas.getContext("2d");

        document.addEventListener('keydown', keydown);
        canvas.addEventListener('click', resume);

        reset();

        run();
    }

    function loadAssets(){
        var img_assets = document.createElement('div');

        img_assets.id = 'img_assets';
        img_assets.style.display = 'none';

        assets = {
            head: [],
            body: [],
            corner: [],
            food: []
        };

        assets.head.push(newImgAsset('head_up'));
        assets.head.push(newImgAsset('head_down'));
        assets.head.push(newImgAsset('head_left'));
        assets.head.push(newImgAsset('head_right'));

        assets.body.push(newImgAsset('body_up'));
        assets.body.push(newImgAsset('body_down'));
        assets.body.push(newImgAsset('body_left'));
        assets.body.push(newImgAsset('body_right'));

        assets.corner[0] = [];
        assets.corner[0][2] = newImgAsset('corner_up_left');
        assets.corner[0][3] = newImgAsset('corner_up_right');

        assets.corner[1] = [];
        assets.corner[1][2] = newImgAsset('corner_down_left');
        assets.corner[1][3] = newImgAsset('corner_down_right');

        assets.corner[2] = [];
        assets.corner[2][0] = newImgAsset('corner_left_up');
        assets.corner[2][1] = newImgAsset('corner_left_down');

        assets.corner[3] = [];
        assets.corner[3][0] = newImgAsset('corner_right_up');
        assets.corner[3][1] = newImgAsset('corner_right_down');

        assets.food.push(newImgAsset('food_2'));


        assets.head.forEach(function(head){
            img_assets.append(head);
        });

        assets.body.forEach(function(body){
            img_assets.append(body);
        });

        assets.corner.forEach(function(cornerX){
            cornerX.forEach(function(corner){
                img_assets.append(corner);
            });
        });

        assets.food.forEach(function(food){
            img_assets.append(food);
        });

        document.body.append(img_assets);

    }

    function newImgAsset(filename){
        var img = document.createElement('img');
        img.src = assets_path + '/' + filename + '.png';

        return img;
    }

    //      Canvas       Canvas      Canvas      Canvas      Canvas
    function run(){
        draw();
        window.requestAnimationFrame(run);
    }

    // Draw states
    function draw(){
        // Draw pause
        if(!running){
            const middle = parseInt(length / 2);

            drawRect(theme.pause_background, 0, 0, canvas.width, canvas.height);

            drawRect(theme.pause_foreground, (middle - 1), (middle - 1), undefined, 3);
            drawRect(theme.pause_foreground, (middle + 1), (middle - 1), undefined, 3);
            return;
        }

        // Draw background
        drawRect(theme.level_background, 0, 0, canvas.width, canvas.height);

        // Draw players
        state.players.forEach(function(player) {
            // Draw players body
            player.body.forEach(function(body) {
                if(draw_img){
                    if(typeof(body.corner) == 'undefined' || body.corner == -1)
                        drawImage(assets.body[body.dir], body.x, body.y);
                    else
                        drawImage(assets.corner[body.corner.by][body.corner.to], body.x, body.y);
                }
                else
                    drawRect(theme.playerbody_foreground, body.x, body.y);
            });

            if(draw_img){
                drawImage(assets.head[player.dir], player.x, player.y);
            }
            else
                drawRect(theme.player_foreground, player.x, player.y);
        });
        
        //Draw foods
        state.foods.forEach(function(food){
            if(draw_img){
                drawImage(assets.food[food.type], food.x, food.y);
            }
            else
                drawRect(theme.food_foreground, food.x, food.y);
        });

        //Draw obstacles
        state.obstacles.forEach(function(obstacle){
            drawRect(theme.obstacle_foreground, obstacle.x, obstacle.y);
        });
    }

    // Draw on canvas
    function drawRect(color, x, y, _width, _height){
        const { width, height } = _drawFixWidthHeight(_width, _height);
            
        ctx.fillStyle = color;
        ctx.fillRect(
            x * (canvas.width/length), y * (canvas.width/length),
            width, height
        );
    }

    function drawImage(asset, x, y, _width, _height){
        const { width, height } = _drawFixWidthHeight(_width, _height);
            
        ctx.drawImage(
            asset, 
            x * (canvas.width/length), y * (canvas.width/length),
            width, height
        );
    }

    function _drawFixWidthHeight(width, height){
        if(typeof(width) == 'undefined')
            var width = canvas.width/length;
        else
        if(width <= length)
            width = (canvas.height/length) * width;

        
        if(typeof(height) == 'undefined')
            var height = canvas.height/length;
        else
        if(height <= length)
            height = (canvas.height/length) * height;

        return {
            width, height
        }
    }

    //      Game        Game         Game          Game          Game      
    function reset(){
        state.foods = [];
        state.players = [];
        state.obstacles = [];
        state.speed = intervals.speed;

        newPlayer();

        next();
    }

    function next(){
        if(threads.speed) clearInterval(threads.speed);

        threads.speed = setInterval(function(){
            state.players.forEach(function(player){
                playerMoving(player);
            });
        }, state.speed);

        // Multiples foods on level
        for(var i = 0; i < state.players.length; i++) newFood();
        state.foods = state.foods.slice(0, state.players.length);
    }

    function pause(){
        running = false;
    }

    function resume(){
        running = true;
    }

    function drawImg(enabled){
        if(typeof(enabled) != 'undefined')
            draw_img = enabled;
        return draw_img;
    }

    //      Objects     Objects     Objects     Objects     Objects
    function newFood(){
        state.foods.push({
            x: parseInt(Math.random() * (length)),
            y: parseInt(Math.random() * (length)),
            type: parseInt(Math.random() * (assets.food.length))
        });
    }

    function newPlayer(x, y){
        if(typeof(x) === 'undefined')
            x = parseInt(Math.random() * (length - 0));

        if(typeof(y) === 'undefined')
            y = parseInt(Math.random() * (length - 0));

        state.players.push({
            x, y,
            length: 3,
            body: [],
            score: 0,
            dir: parseInt(Math.random() * (4 - 0))
        });
    }

    //      Player      Player      Player      Player      Player
    function registerBody(player){
        const { x, y, dir, length } =  player;
        const oldMember = player.body[0];

        var member = {
            x, y, dir
        };

        if(typeof(oldMember) != 'undefined'){
            // Direction was changed
            if(oldMember.dir != member.dir){
                member.corner = {
                    by: oldMember.dir,
                    to: member.dir
                }

                //console.log(member.corner);
            }
        }
        
        player.body.unshift(member);
        player.body = player.body.slice(0, length);
    }

    function checkColision(player){
        // Player eat a food
        state.foods.forEach(function(food, i, a){
            if(player.x == food.x && player.y == food.y){
                a.splice(i, 1);
                player.length++;
                player.score += 100;
                state.speed -= 10;
                next();
            }
        });

        // Player eat herself
        player.body.forEach(function(member){
            if(player.x == member.x && player.y == member.y){
                alert("Você não pode se comer");
                reset();
            }
        });

        // Player colides with borders
        if(player.x < 0 || player.x >= length || player.y < 0 || player.y >= length){
            alert("Você não pode colidir com as paredes");
            reset();
        }

    }

    var colisionEvent = {

    }

    function playerMoving(player){
        if(!running) return;

        registerBody(player);

        switch(player.dir){
            //  [Up]
            case 0: player.y--; break;
            
            //  [Down]
            case 1: player.y++; break;

            //  [Left]
            case 2: player.x--; break;

            //  [Right]
            case 3: player.x++; break;
        }

        checkColision(player);
    }

    var keyboardInput = {
        'ArrowUp': function(player){
            if(player.dir != 1 && player.dir != 0){
                player.dir = 0;
                return true;
            }
        },
        'ArrowDown': function(player){
           if(player.dir != 0 && player.dir != 1){
                player.dir = 1;
                return true;
           }
        },
        'ArrowLeft': function(player){
            if(player.dir != 3 && player.dir != 2){
                player.dir = 2;
                return true;
            }
        },
        'ArrowRight': function(player){
            if(player.dir != 2 && player.dir != 3){
                player.dir = 3;
                return true;
            }
        }
    }

    function keydown(e){
        const keyName = e.key;

        const player = state.players[0];
        
        const move = keyboardInput[keyName];

        if(move && player){
            if(move(player))
                playerMoving(player);
        }

        if(keyName == '\'')
            drawImg(!drawImg());

        if(keyName == 'p')
            running = !running;
        else
            resume();
    }

    function externalMovement() {
        const player = state.players[0];

        return {
            up(){
                keyboardInput['ArrowUp'](player);
            },
            down(){
                keyboardInput['ArrowDown'](player);
            },
            left(){
                keyboardInput['ArrowLeft'](player);
            },
            right(){
                keyboardInput['ArrowRight'](player);
            }
        }
    }

    return {
        setup,
        state,
        resume,
        pause,
        externalMovement,
        drawImg
    }
}