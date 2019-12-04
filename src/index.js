function Snake(){
    var canvas, ctx, frames = 0, width = 720, height = 720, length = 15, state = {
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
    running = true;
    

    function setup(canvasId){
        canvas = document.getElementById(canvasId);

        canvas.width = width;
        canvas.height = height;
        
        ctx = canvas.getContext("2d");

        document.addEventListener('keydown', keydown);

        reset();

        run();
    }

    //      Canvas       Canvas      Canvas      Canvas      Canvas
    function run(){
        draw();
        window.requestAnimationFrame(run);
    }

    function draw(){
        if(!running){
            const middle = parseInt(length / 2);

            ctx.fillStyle = theme.pause_background;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = theme.pause_foreground;
            ctx.fillRect((middle - 1) * (width/length), (middle - 1) * (width/length), width/length, (height/length) * 3);
            ctx.fillRect((middle + 1) * (width/length), (middle - 1) * (width/length), width/length, (height/length) * 3);
            
            return;
        }


        // Draw background
        ctx.fillStyle = theme.level_background;
        ctx.fillRect(0, 0, width, height);

        // Draw players
        state.players.forEach(function(player) {
            // Draw players body
            player.body.forEach(function(body) {
                ctx.fillStyle = theme.playerbody_foreground;
                ctx.fillRect(body.x * (width/length), body.y * (width/length), width/length, height/length);
            });

            ctx.fillStyle = theme.player_foreground;
            ctx.fillRect(player.x * (width/length), player.y * (width/length), width/length, height/length);
        });
        
        //Draw foods
        state.foods.forEach(function(food){
            ctx.fillStyle = theme.food_foreground;
            ctx.fillRect(food.x * (width/length), food.y * (width/length), width/length, height/length);
        });

        //Draw obstacles
        state.foods.forEach(function(food){
            ctx.fillStyle = theme.food_foreground;
            ctx.fillRect(food.x * (width/length), food.y * (width/length), width/length, height/length);
        });
    }

    // 

    function reset(){
        state.foods = [];
        state.players = [];
        state.obstacles = [];
        state.speed = intervals.speed;

        state.players.push({
            x: parseInt(Math.random() * (length - 0)),
            y: parseInt(Math.random() * (length - 0)),
            length: 3,
            body: [],
            score: 0,
            dir: parseInt(Math.random() * (4 - 0))
        });

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

    //      Objects     Objects     Objects     Objects     Objects
    function newFood(){
        state.foods.push({
            x: parseInt(Math.random() * (length - 0)),
            y: parseInt(Math.random() * (length - 0))
        });
    }

    //      Player      Player      Player      Player      Player
    function registerBody(player){
        const { x, y, length } =  player;
        
        player.body.unshift({
            x, y
        });

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
            if(player.dir != 1){
                player.dir = 0;
                return true;
            }
        },
        'ArrowDown': function(player){
           if(player.dir != 0){
                player.dir = 1;
                return true;
           }
        },
        'ArrowLeft': function(player){
            if(player.dir != 3){
                player.dir = 2;
                return true;
            }
        },
        'ArrowRight': function(player){
            if(player.dir != 2){
                player.dir = 3;
                return true;
            }
        }
    }
    function keydown(e){
        const keyName = e.key;
        //console.log('keydown event\n\n' + 'key: ' + keyName);

        const player = state.players[0];
        
        const move = keyboardInput[keyName];

        if(move && player){
            if(move(player))
                playerMoving(player);
        }
    }

    return {
        setup,
        state,
        resume,
        pause
    }
}


const game = new Snake();

game.setup('game');