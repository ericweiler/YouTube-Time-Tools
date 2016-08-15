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

function durationchange(){
	if(!isNaN(video.duration/video.playbackRate)){
		duration.textContent = formatTime(video.duration/video.playbackRate);
		currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
	}
}

function ratechange(){
	if(!isNaN(video.duration/video.playbackRate)){
		duration.textContent = formatTime(video.duration/video.playbackRate);
		currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
	}
}

function durationShiftOn(){
	var videoElsReady = setInterval(function(){
		if(document.getElementsByTagName("video").item(0) != null){
			if(document.getElementsByClassName("ytp-time-current") != null){
				if(document.getElementsByClassName("ytp-time-duration") != null){
					clearInterval(videoElsReady);
					currentTime = document.getElementsByClassName("ytp-time-current").item(0);
					currentTime.outerHTML = "<span1 class='ytp-time-current'></span>";
					currentTime = document.getElementsByTagName("span1").item(0);
					duration = document.getElementsByClassName("ytp-time-duration").item(0);
					
					clearInterval(refreshCurrentTime);
					refreshCurrentTime = setInterval(function(){
						currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
					},1000);

					if(!isNaN(video.duration/video.playbackRate)){
						duration.textContent = formatTime(video.duration/video.playbackRate);
						currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
					}
					video.addEventListener("durationchange", durationchange);
					video.addEventListener("ratechange", ratechange);
				}
			}
		}
	},100);
}

function incrimentTotals(totalType){
	if(totalType == "overall"){
		chrome.storage.sync.get("overall", function(object){
			if(object.overall === undefined)
				chrome.storage.sync.set({"overall": 0})
			chrome.storage.sync.set({"overall": (object.overall + 1)});
		});
	}
	if(totalType == "timeSaved"){

	}
}

function durationShiftOff(){
	video.removeEventListener("durationchange", durationchange);
	video.removeEventListener("ratechange", ratechange);
	duration.textContent = formatTime(video.duration);
	clearInterval(refreshCurrentTime);
	refreshCurrentTime = setInterval(function(){
		currentTime.textContent = formatTime(video.currentTime);
	},1000);
}

function setup(){
	video = document.getElementsByTagName("video").item(0);
	Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    	get: function(){
        	return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    	}
	});
	chrome.storage.sync.get("setting", function(object){
		if(object.setting === undefined)
			chrome.storage.sync.set({"setting": true});
		if(object.setting == true)
			durationShiftOn();
	});
	chrome.storage.onChanged.addListener(function(object, namespace){
		if(object.setting.newValue == true)
			durationShiftOn();
		else
			durationShiftOff();
	});
	var trackTime = setInterval(function(){
		if(video.playing)
			incrimentTotals("overall");
	}, 1000)
}

var video;
var currentTime;
var duration;
var refreshCurrentTime;

var videoReady = setInterval(function(){
	if(document.getElementsByTagName("video").item(0) != null){
		clearInterval(videoReady);
		setup();
	}
},100);







