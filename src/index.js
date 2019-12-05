function Snake(){
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
    assets_path = "src/assets/snake",
    assets_resolution = 32,
    draw_img = false;
    

    function setup(canvasId, _length){
        canvas = document.getElementById(canvasId);

        if(typeof(_length) != 'undefined')
            length = _length;

        loadAssets();

        canvas.width = canvas.height = assets_resolution * length;

        console.log(canvas.width, canvas.height, length);




        /*if(length < canvas.width || length < canvas.height){
            if(canvas.width > canvas.height)
                length = canvas.width;
            else
            if(canvas.width < canvas.height)
                length = canvas.height;
        }*/
        
        ctx = canvas.getContext("2d");

        document.addEventListener('keydown', keydown);

        document.addEventListener('click', function(){
            drawImg(!drawImg());
        });

        reset();

        run();
    }

    function loadAssets(){
        var img_assets = document.getElementById('img_assets');

        assets = {
            head: [],
            body: [],
            corner: []
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
        assets.corner[0][2] = newImgAsset('corner_down_left');
        assets.corner[0][3] = newImgAsset('corner_down_right');

        assets.corner[1] = [];
        assets.corner[1][2] = newImgAsset('corner_up_left');
        assets.corner[1][3] = newImgAsset('corner_up_right');

        assets.corner[2] = [];
        assets.corner[2][0] = newImgAsset('corner_right_up');
        assets.corner[2][1] = newImgAsset('corner_right_down');

        assets.corner[3] = [];
        assets.corner[3][0] = newImgAsset('corner_left_up');
        assets.corner[3][1] = newImgAsset('corner_left_down');



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

    function draw(){
        if(!running){
            const middle = parseInt(length / 2);
            //const middleX = parseInt((canvas))

            ctx.fillStyle = theme.pause_background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = theme.pause_foreground;
            ctx.fillRect((middle - 1) * (canvas.width/length), (middle - 1) * (canvas.width/length), canvas.width/length, (canvas.height/length) * 3);
            ctx.fillRect((middle + 1) * (canvas.width/length), (middle - 1) * (canvas.width/length), canvas.width/length, (canvas.height/length) * 3);
            
            return;
        }


        // Draw background
        ctx.fillStyle = theme.level_background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw players
        state.players.forEach(function(player) {
            // Draw players body
            player.body.forEach(function(body) {
                if(draw_img){
                    if(typeof(body.corner) == 'undefined' || body.corner == -1)
                        ctx.drawImage(assets.body[body.dir], body.x * (canvas.width/length), body.y * (canvas.width/length), canvas.width/length, canvas.height/length);
                    else
                        ctx.drawImage(assets.corner[body.corner.by][body.corner.to], body.x * (canvas.width/length), body.y * (canvas.width/length), canvas.width/length, canvas.height/length);
                }
                else {
                    ctx.fillStyle = theme.playerbody_foreground;
                    ctx.fillRect(body.x * (canvas.width/length), body.y * (canvas.width/length), canvas.width/length, canvas.height/length);
                }
            });

            if(draw_img){
                ctx.drawImage(assets.head[player.dir], player.x * (canvas.width/length), player.y * (canvas.width/length), canvas.width/length, canvas.height/length);
            }
            else {
                ctx.fillStyle = theme.player_foreground;
                ctx.fillRect(player.x * (canvas.width/length), player.y * (canvas.width/length), canvas.width/length, canvas.height/length);
            }
            

        });
        
        //Draw foods
        state.foods.forEach(function(food){
            ctx.fillStyle = theme.food_foreground;
            ctx.fillRect(food.x * (canvas.width/length), food.y * (canvas.width/length), canvas.width/length, canvas.height/length);
        });

        //Draw obstacles
        state.foods.forEach(function(food){
            ctx.fillStyle = theme.food_foreground;
            ctx.fillRect(food.x * (canvas.width/length), food.y * (canvas.width/length), canvas.width/length, canvas.height/length);
        });
    }

    // 

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
            x: parseInt(Math.random() * (length - 0)),
            y: parseInt(Math.random() * (length - 0))
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

                console.log(member.corner);
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


const game = new Snake();
const inputs = game.externalMovement();

game.setup('game');



