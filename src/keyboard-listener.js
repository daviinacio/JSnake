export default function KeyboardListener(input, canvas){
    canvas.addEventListener('keydown', function(e){
        const keyName = e.code;
        const knownKeys = {
            'ArrowUp': input.up,
            'ArrowDown': input.down,
            'ArrowLeft': input.left,
            'ArrowRight': input.right,
            'KeyP': input.togglePlayPause,
            'Space': input.togglePlayPause,
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