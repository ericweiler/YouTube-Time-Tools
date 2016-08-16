var button = document.getElementById("toggle");
var pauseTotals = document.getElementById("pauseTotals");
var resetTotals = document.getElementById("resetTotals");
var pauseSaved = document.getElementById("pauseSaved");
var resetSaved = document.getElementById("resetSaved");

var Tyears = document.getElementById("Tyears");
var Tdays = document.getElementById("Tdays"); 
var Thours = document.getElementById("Thours"); 
var Tminutes = document.getElementById("Tminutes"); 
var Tseconds = document.getElementById("Tseconds"); 

var Syears = document.getElementById("Syears"); 
var Sdays = document.getElementById("Sdays"); 
var Shours = document.getElementById("Shours"); 
var Sminutes = document.getElementById("Sminutes"); 
var Sseconds = document.getElementById("Sseconds"); 

var mode;

function formatTime(time){
	var formattedTime = "";
	time = Math.ceil(time);
	var addZero = false;
	if(time >= 3600){
		addZero = true;
		formattedTime += Math.floor(time / 3600);
		formattedTime += ":";
		time -= Math.floor(time/3600)*3600;
	}
	if(Math.floor(time/60) < 10  && addZero)
		formattedTime += "0";
	formattedTime += Math.floor(time/60);
	formattedTime += ":";
	time -= Math.floor(time/60)*60;
	if(time < 10)
		formattedTime += "0";
	formattedTime += time;
	return formattedTime;
}

function formatTotals(seconds){
	if(seconds >= 3153600){
		Tyears.innerHTML = Math.floor(seconds / 3153600);
		seconds -= Math.floor(seconds / 3153600)*3153600;
	}
	if(seconds >= 86400){
		Tdays.innerHTML = Math.floor(seconds / 86400);
		seconds -= Math.floor(seconds / 86400)*86400;
	}
	if(seconds >= 3600){
		Thours.innerHTML = Math.floor(seconds / 3600);
		seconds -= Math.floor(seconds / 3600)*3600;
	}
	if(seconds >= 60){
		Tminutes.innerHTML = Math.floor(seconds / 60);
		seconds -= Math.floor(seconds / 60)*60;
	}
	Tseconds.innerHTML = seconds;


	// Syears.innerHTML = "365";
	// Sdays.innerHTML = "365";
	// Shours.innerHTML = "365";
	// Sminutes.innerHTML = "365";
	// Sseconds.innerHTML = "365";
	
}
pauseTotals.onclick = function(){
	chrome.storage.sync.get("paused", function(object){
		if(object.paused == true){
			chrome.storage.sync.set({"paused": false});
			pauseTotals.innerHTML = "Pause";
		}
		else{
			chrome.storage.sync.set({"paused": true});
			pauseTotals.innerHTML = "Play";
		}
	});
}

resetTotals.onclick = function(){
	chrome.storage.sync.set({"overall": 0})
}

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

chrome.storage.sync.get(["overall", "paused"], function(object){
	if(object.overall === undefined)
		chrome.storage.sync.set({"overall": 0});
	if(object.paused === undefined)
		chrome.storage.sync.set({"paused": false});
	if(object.paused == false)
		pauseTotals.innerHTML = "Pause";
	else
		pauseTotals.innerHTML = "Play";
	formatTotals(object.overall);
});

chrome.storage.onChanged.addListener(function(object, namespace){
	formatTotals(object.overall.newValue);
});


