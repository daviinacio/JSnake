import KeyboardListener from './keyboard-listener.js';
import TouchscreenListener from './touchscreen-listener.js';
import AssetsLoader from './assets-loader.js';

import levels from './levels.js';

export default function Snake({ length = 15 }) {
    var canvas, ctx, frames = 0, time = 0,
        running = 'play',
        assets_resolution = 16,
        assets_enabled = true,
        cache = {};

    const assets = new AssetsLoader('src/assets/skin').load('snake');
    const inputs = [];
    const threads = [];
    const events = [];

    const speed_delay = 300;

    const default_colors = {
        map: "#50beff",
        player_head: "#e80",
        player_body: "#f90",
        player_corder: "#f90",
        player_eaten_stop: "d70",
        food: "#f00",
        obstacle: "#00f",
        dark_bg: "#222",
        pause_fg: "#0a4",
        stop_fg: "#c51a1a",
        hud: "#000"
    };

    const state = {
        players: [],
        foods: [],
        obstacles: [],
        time: 0
    };


    function setup(canvasElement, _length) {
        canvas = document.querySelector(canvasElement);

        if (typeof (_length) != 'undefined')
            length = _length;

        canvas.width = canvas.height = assets_resolution * length;

        //console.log(canvas.width, canvas.height, length);

        ctx = canvas.getContext("2d");

        inputs.push(new KeyboardListener(input_interface, document));
        inputs.push(new TouchscreenListener(input_interface, canvas));

        threads.fps = setInterval(function () {
            if (typeof (cache.last_check) == 'undefined')
                cache.last_check = frames;

            state.fps = frames - cache.last_check;

            cache.last_check = frames;

            if (running === 'play') state.time++;

            handleEvents('fps', state.fps);
            handleEvents('time', state.time);

        }, 1000);

        //console.log(state.obstacles);

        reset();

        run();
    }

    //      Canvas       Canvas      Canvas      Canvas      Canvas
    function run() {
        render();
        window.requestAnimationFrame(run);
    }

    // Draw states
    function render() {
        frames++;

        // Draw pause
        if (running === 'pause') {
            const middle = parseInt(length / 2);

            draw(undefined, 0, 0, default_colors.dark_bg, canvas.width, canvas.height);

            draw(undefined, (middle - 1), (middle - 2), default_colors.pause_fg, undefined, 5);
            draw(undefined, (middle + 1), (middle - 2), default_colors.pause_fg, undefined, 5);
            return;
        }

        // Draw stop
        if (running === 'stop') {
            const middle = parseInt(length / 2);

            draw(undefined, 0, 0, default_colors.dark_bg, canvas.width, canvas.height);

            draw(undefined, (middle - 2), (middle - 2), default_colors.stop_fg, 5, 5);
            draw(undefined, (middle - 1), (middle - 1), default_colors.dark_bg, 3, 3);
            draw(undefined, middle, middle, default_colors.stop_fg, 1, 1);
            return;
        }

        // Draw background
        draw(undefined, 0, 0, default_colors.map, canvas.width, canvas.height);

        // Draw players
        state.players.forEach(function (player) {
            // Draw players body
            player.body.forEach(function (chunk) {
                if (typeof (chunk.corner) == 'undefined' || chunk.corner == -1)
                    draw(assets.body[chunk.dir], chunk.x, chunk.y, default_colors.player_body);
                else
                    draw(assets.corner[chunk.corner.by][chunk.corner.to], chunk.x, chunk.y, default_colors.player_corder);
            });

            draw(assets.head[player.dir], player.x, player.y, default_colors.player_head);
        });

        //Draw foods
        state.foods.forEach(function (food) {
            draw(assets.food[food.type], food.x, food.y, default_colors.food);
        });

        //console.log(state.obstacles);

        //Draw obstacles
        state.obstacles.forEach(function (obstacle) {
            //console.log(obstacle);

            draw(undefined, obstacle.x, obstacle.y, default_colors.obstacle, obstacle.width, obstacle.height);
        });
    }

    // Draw on canvas
    function draw(asset, x, y, alternative_color, width, height) {
        if (typeof (width) == 'undefined')
            var width = canvas.width / length;
        else
            if (width <= length)
                width = (canvas.height / length) * width;

        if (typeof (height) == 'undefined')
            var height = canvas.height / length;
        else
            if (height <= length)
                height = (canvas.height / length) * height;

        // Reverse position
        if (x < 0) x = length + x - 1;
        if (y < 0) y = length + y - 1;

        if (typeof (alternative_color) === 'undefined')
            alternative_color = "#fff";

        if (assets_enabled && asset) {
            ctx.drawImage(
                asset,
                x * (canvas.width / length), y * (canvas.width / length),
                width, height
            );
        }
        else {
            ctx.fillStyle = alternative_color;
            ctx.fillRect(
                x * (canvas.width / length), y * (canvas.width / length),
                width, height
            );
        }

    }

    //      Game        Game         Game          Game          Game      
    function reset() {
        running = 'play';
        state.foods = [];
        state.players = [];
        state.obstacles = [];
        state.speed = 1;
        state.time = 0;

        state.obstacles = levels[0].obstacles;

        spawnPlayer();
        handleEvents('score', 0);

        next();
        spawnFood();
    }

    function next() {
        moveThread();
        spawnFood();
    }

    function pause() {
        if (running === 'stop')
            return;

        running = 'pause';
    }

    function resume() {
        if (running === 'stop')
            return;

        running = 'play';
    }

    function stop() {
        running = 'stop';
    }

    function togglePlayPause() {
        if (running === 'play')
            running = 'pause';
        else
            if (running === 'pause')
                running = 'play';
            else
                running = 'stop';
    }

    function toggleAssets(enabled) {
        if (typeof (enabled) != 'undefined')
            assets_enabled = enabled;
        assets_enabled = !assets_enabled;
    }

    function addEventListener(variable, callback) {
        if (typeof (variable) === 'string' && typeof (callback) === 'function') {
            events.push({
                variable, callback
            });
        }
    }

    function handleEvents(variable, value) {
        events.forEach(function (event) {
            if (event.variable == variable &&
                typeof (variable) != 'undefined' &&
                typeof (value) != 'undefined') {
                event.callback({
                    value
                });
            }
        });
    }

    //      Objects     Objects     Objects     Objects     Objects
    function spawnFood() {
        const { x, y } = getEmptyPlace();

        state.foods.push({
            x, y,
            type: parseInt(Math.random() * (assets.food.length))
        });
    }

    function spawnPlayer() {
        const { x, y } = getEmptyPlace();

        state.players.push({
            x, y,
            length: 3,
            body: [],
            score: 0,
            dir: parseInt(Math.random() * (4 - 0)),
            canMove: true
        });
    }

    //      Player      Player      Player      Player      Player
    function registerBody(player) {
        const { x, y, dir, length } = player;
        const oldMember = player.body[0];

        var member = {
            x, y, dir
        };

        if (typeof (oldMember) != 'undefined') {
            // Direction was changed
            if (oldMember.dir != member.dir) {
                member.corner = {
                    by: oldMember.dir,
                    to: member.dir
                }
            }
        }

        player.body.unshift(member);
        player.body = player.body.slice(0, length);
    }

    function checkCollision(player) {
        const content = findPlaceContent({
            x: player.x, y: player.y
        });

        content.forEach(function (item) {
            switch (item.type) {
                case 'food':
                    state.foods = state.foods.filter(
                        (f) => !(f.x === player.x && f.y == player.y)
                    );

                    player.length++;
                    player.score += 1;
                    state.speed += 0.1;

                    handleEvents('score', player.score);

                    next();
                    break;

                case 'player_body':
                    stop();

                    handleEvents('lose', {});
                    handleEvents('self', {
                        reset
                    });

                    break;

                case 'obstacle':
                    stop();

                    handleEvents('lose', {});
                    handleEvents('obstacle', {
                        reset
                    });
                    break;
            };
        });
    }

    function findPlaceContent({ x, y }) {
        let content = [];

        // There is some foods
        state.foods.forEach(function (food) {
            if (x == food.x && y == food.y) {
                content.push({
                    ...food, ...{
                        type: 'food'
                    }
                })
            }
        });

        // There is some players
        state.players.forEach((player) => {

            // There is some player head
            if (x == player.x && y == player.y) {
                content.push({
                    ...player, ... {
                        type: 'player_head'
                    }
                });
            }

            // There is some player bodies
            player.body.forEach(function (chunk) {
                if (x == chunk.x && y == chunk.y) {
                    content.push({
                        ...chunk, ... {
                            type: 'player_body'
                        }
                    });
                }
            });
        })

        // There is some obstacles
        state.obstacles.forEach(function (obstacle) {
            if (obstacle.x < 0) obstacle.x = length + obstacle.x - 1;
            if (obstacle.y < 0) obstacle.y = length + obstacle.y - 1;

            if (x >= obstacle.x && x < obstacle.x + (obstacle.width || 1) &&
                y >= obstacle.y && y < obstacle.y + (obstacle.height || 1)) {

                content.push({
                    ...obstacle, ... {
                        type: 'obstacle'
                    }
                });
            }
        });

        return content;
    }

    function getEmptyPlace() {
        var x = 0, y = 0;

        while (true) {
            x = parseInt(Math.random() * (length));
            y = parseInt(Math.random() * (length));

            if (findPlaceContent({ x, y }).length == 0)
                break;
        }

        return {
            x, y
        }
    }

    function moveThread() {
        if (threads.speed) clearInterval(threads.speed);

        threads.speed = setInterval(function () {
            state.players.forEach(function (player) {
                if (running !== 'play') return;

                registerBody(player);

                // Player direction
                switch (player.dir) {
                    //  [Up]
                    case 0: player.y--; break;

                    //  [Down]
                    case 1: player.y++; break;

                    //  [Left]
                    case 2: player.x--; break;

                    //  [Right]
                    case 3: player.x++; break;
                }

                checkCollision(player);

                // Teleport the player through the walls
                if (player.dir == 0 && player.y < 0)
                    player.y = length - 1;

                else
                    if (player.dir == 1 && player.y >= length)
                        player.y = 0;

                    else
                        if (player.dir == 2 && player.x < 0)
                            player.x = length - 1;

                        else
                            if (player.dir == 3 && player.x >= length)
                                player.x = 0;

                player.canMove = true;
            });
        }, speed_delay / state.speed);
    }

    const input_interface = {
        up() {
            const player = state.players[0];
            if (player.dir != 1 && player.dir != 0 && player.canMove) {
                player.dir = 0;
                player.canMove = false;
                return true;
            }
        },
        down() {
            const player = state.players[0];
            if (player.dir != 0 && player.dir != 1 && player.canMove) {
                player.dir = 1;
                player.canMove = false;
                return true;
            }
        },
        left() {
            const player = state.players[0];
            if (player.dir != 3 && player.dir != 2 && player.canMove) {
                player.dir = 2;
                player.canMove = false;
                return true;
            }
        },
        right() {
            const player = state.players[0];
            if (player.dir != 2 && player.dir != 3 && player.canMove) {
                player.dir = 3;
                player.canMove = false;
                return true;
            }
        },
        resume, pause, toggleAssets, togglePlayPause
    };

    return {
        setup,
        state,
        resume,
        pause,
        stop,
        addEventListener
    }
}
