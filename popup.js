var button = document.getElementById("toggle");
var mode;

button.onclick = function(){
	chrome.storage.sync.get("setting", function(object){
		if(object.setting == true){
			chrome.storage.sync.set({"setting": false});
			button.innerHTML = "Nope";
			button.style.backgroundColor = "red";
			button.style.color = "white";
			mode = false;
		}
		else{
			document.getElementsByTagName('audio')[0].play();
			chrome.storage.sync.set({"setting": true});
			button.innerHTML = "Yeah!";
			button.style.backgroundColor = "#5AE87C";
			button.style.color = "white";
			mode = true;
		}
	});
};

button.onmouseover = function(){
	if(mode == false){
		button.style.backgroundColor = "#5AE87C";
		button.style.color = "white";
	}
	else{
		button.style.backgroundColor = "red";
		button.style.color = "white";
	}
}

button.onmouseout = function(){
	if(mode == true){
		button.style.backgroundColor = "#5AE87C";
		button.style.color = "white";
	}
	else{
		button.style.backgroundColor = "red";
		button.style.color = "white";
	}
}

chrome.storage.sync.get("setting", function(object){
	if(object.setting === undefined){
		chrome.storage.sync.set({"setting": true});
		button.innerHTML = "Yeah!";
		button.style.backgroundColor = "#5AE87C";
			button.style.color = "white";
	}
	else{
		if(object.setting == true){
			button.innerHTML = "Yeah!";
			button.style.backgroundColor = "#5AE87C";
			button.style.color = "white";
			mode = true;
		}
		else{
			button.innerHTML = "Nope";
			button.style.backgroundColor = "red";
			button.style.color = "white";
			mode = false;		
		}
	}	
});





// chrome.storage.sync.get("setting", function(object){
// 	output.textarea = object.setting
// });

//  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {msg: "video"}, function(x){
//   	document.getElementById("status").innerHTML = "Response2: " + x;
//   });
// });

