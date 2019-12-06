export default function TouchscreenListener(input, canvas){
    canvas.addEventListener('mousedown', function(e){
        const { offsetX, offsetY } = e;
        const { offsetWidth, offsetHeight } = canvas;

        const move = input;

        // Quadrante 1/4
        if(offsetX < (offsetWidth / 2) && offsetY < (offsetHeight / 2)){
            if(offsetX < offsetY)   move.left();
            else                    move.up();
        }
        else
        // Quadrante 2/4
        if(offsetX >= (offsetWidth / 2) && offsetY < (offsetHeight / 2)){
            if((offsetWidth - offsetX) > offsetY)   move.up();
            else                                    move.right();
        }
        else
        // Quadrante 3/4
        if(offsetX < (offsetWidth / 2) && offsetY >= (offsetHeight / 2)){
            if(offsetX < (offsetHeight - offsetY))  move.left();
            else                                    move.down();
        }
        else
        // Quadrante 4/4
        if(offsetX >= (offsetWidth / 2) && offsetY >= (offsetHeight / 2)){
            if(offsetX < offsetY)   move.down()
            else                    move.right();
        }

        input.resume();
    });
    
    return {
        
    }
};