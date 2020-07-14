export default function KeyboardListener(input, canvas){
    canvas.addEventListener('keydown', function(e){
        const keyName = e.code;
        const knownKeys = {
            // Direction
            'ArrowUp': input.up,
            'ArrowDown': input.down,
            'ArrowLeft': input.left,
            'ArrowRight': input.right,

            'KeyW': input.up,
            'KeyS': input.down,
            'KeyA': input.left,
            'KeyD': input.right,

            // Controls
            'KeyP': input.togglePlayPause,
            'Space': input.togglePlayPause,

            // Special keys
            'KeyQ': input.toggleAssets
        };
        
        const move = knownKeys[keyName];

        if(move){
            move();
            
            if(keyName != 'KeyP' && keyName != 'Space')
                input.resume();
        }
    });

    return {
        
    }
};