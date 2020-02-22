function Toast(){
	const element = (function(){
		const overlay = document.createElement('div');
		overlay.id = 'toast-overlay';
		
		const container = document.createElement('div');
		
		const title = document.createElement('span');
		title.classList.add('title');
		
		const message = document.createElement('span');
		message.classList.add('message');
		
		const button_container = document.createElement('div');
		button_container.id = 'button-container';
		
		container.appendChild(title);
		container.appendChild(message);
		container.appendChild(button_container);
		
		overlay.appendChild(container);
		document.body.appendChild(overlay);
		
		return {
			overlay,
			title,
			message,
			button_container
		}
	})(document);
	
	function show(args){
		const { title, message } = args;
		
		element.overlay.classList.add('focus');
		
		element.title.innerHTML = title;
		
		if(Array.isArray(message))
			element.message.innerHTML = message[Math.floor(Math.random() * message.length)];
		else
			element.message.innerHTML = message;
		
		
	}
	
	function dismiss(){
		element.overlay.classList.remove('focus');
	}
	
	return {
		show
	};
};

export default new Toast();