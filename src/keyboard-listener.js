export default function KeyboardListener(input, canvas){
    canvas.addEventListener('keydown', function(e){
        const keyName = e.key;
        const knownKeys = {
            'ArrowUp': input.up,
            'ArrowDown': input.down,
            'ArrowLeft': input.left,
            'ArrowRight': input.right,
            'p': input.togglePlayPause,
            'q': input.toggleAssets
        };

        const move = knownKeys[keyName];

        if(move){
            move();
            
            if(keyName != 'p')
                input.resume();
        }
    });

    return {
        
    }
};