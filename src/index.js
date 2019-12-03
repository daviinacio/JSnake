function Snake(){
    var canvas, ctx, frames = 0, width = 720, height = 720, length = 16, state = {
        players: [
            {
                x: 0,
                y: 0
            }
        ],
    },
    theme = {
        background: "#50beff",
        playercolor: "#ff0000"
    };

    function setup(canvasId){
        canvas = document.getElementById(canvasId);

        canvas.width = width;
        canvas.height = height;
        
        ctx = canvas.getContext("2d");

        document.addEventListener('keydown', keydown);

        run();
    }

    function run(){
        draw();
        window.requestAnimationFrame(run);
    }

    function draw(){
        // Draw background
        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, width, height);

        // Draw players
        state.players.forEach(function(player) {
            ctx.fillStyle = theme.playercolor;
            ctx.fillRect(player.x * (width/length), player.y * (width/length), width/length, height/length);
        });
    }

    var playerMove = {
        'ArrowUp': function(player){
            if(player.y > 0)
                player.y--;
        },
        'ArrowDown': function(player){
            if(player.y < length - 1)
                player.y++;
        },
        'ArrowLeft': function(player){
            if(player.x > 0)
                player.x--;
        },
        'ArrowRight': function(player){
            if(player.x < length - 1)
                player.x++;
        },
    }

    function keydown(e){
        const keyName = e.key;
        //console.log('keydown event\n\n' + 'key: ' + keyName);

        const player = state.players[0];

        const move = playerMove[keyName];

        if(move)
            move(player);

        /*switch(e.key){
            case 'ArrowUp':     player.y--; break;
            case 'ArrowDown':   player.y++; break;
            case 'ArrowLeft':   player.x--; break;
            case 'ArrowRight':  player.x++;break;  
        }*/
    }

    return {
        setup,
        state
    }
}


const game = new Snake();

game.setup('game');