function Toast(){
    const element = (function(){
        const overlay = document.createElement('div');
        overlay.id = 'toast-overlay';
        
        const progress = document.createElement('div');
        progress.classList.add('progress');
        
        const progress_inner = document.createElement('div');
        
        progress.appendChild(progress_inner);

        const container = document.createElement('div');
        

        const title = document.createElement('span');
        title.classList.add('title');

        const message = document.createElement('span');
        message.classList.add('message');

        const button_container = document.createElement('div');
        button_container.id = 'button-container';
        
        const _button_container = document.createElement('div');
        button_container.appendChild(_button_container);

        container.appendChild(progress);
        container.appendChild(title);
        container.appendChild(message);
        container.appendChild(button_container);
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        return {
            overlay,
            title,
            message,
            button_container: _button_container,
            progress: progress_inner
        }
    })(document);

    function show(args){
        const { title, message, buttons, timeout, dismiss } = args;

        element.overlay.classList.add('focus');

        element.title.innerHTML = title;

        if(Array.isArray(message))
            element.message.innerHTML = message[Math.floor(Math.random() * message.length)];
        else
            element.message.innerHTML = message;
        
        if(Array.isArray(buttons)){
            buttons.reverse().forEach((button) => {
                var btn = document.createElement('button');
                btn.innerHTML = button.label;
                btn.addEventListener('click', (e) => {
                    button.callback(e);
                    dismiss();
                    _dismiss();
                });
                
                element.button_container.appendChild(btn);
            });
        }
        else {
            element.button_container.style.display = 'none';
        }
        
        if(timeout){
            var progress = 100;
            var interval = setInterval(() => {
                element.progress.style.width = progress + '%';
                progress--;
                
                if(progress <= 0){
                    clearInterval(interval)
                    dismiss();
                    _dismiss();
                }
            }, timeout / 100);
        }
	}

    function _dismiss(){
        element.overlay.classList.remove('focus');
    }

    return {
        show,
        dismiss: _dismiss
    };
};

export default new Toast();