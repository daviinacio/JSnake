export default function KeyboardListener(input, canvas){
    canvas.addEventListener('keydown', function(e){
        const keyName = e.key;
        const knownKeys = {
            'ArrowUp': input.up,
            'ArrowDown': input.down,
            'ArrowLeft': input.left,
            'ArrowRight': input.right,
            'p': input.pause,
            'q': input.toggleAssets
        };

        console.log();

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