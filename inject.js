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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.msg == "video")
		sendResponse("Executedpbr");
});

function initialize(){

	setInterval(function(){
		currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
	},1000);

	if(!isNaN(video.duration/video.playbackRate)){
		duration.textContent = formatTime(video.duration/video.playbackRate);
		currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
	}
	video.addEventListener("durationchange", function(){
		if(!isNaN(video.duration/video.playbackRate)){
			duration.textContent = formatTime(video.duration/video.playbackRate);
			currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
		}
	});
	video.addEventListener("ratechange", function(){
		if(!isNaN(video.duration/video.playbackRate)){
			duration.textContent = formatTime(video.duration/video.playbackRate);
			currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
		}
	});
}

var video;
var currentTime;
var duration;

var videoElsReady = setInterval(function(){
	if(document.getElementsByTagName("video").item(0) != null){
		if(document.getElementsByClassName("ytp-time-current") != null){
			if(document.getElementsByClassName("ytp-time-duration") != null){
				clearInterval(videoElsReady);
				video = document.getElementsByTagName("video").item(0)
				currentTime = document.getElementsByClassName("ytp-time-current").item(0);
				currentTime.outerHTML = "<span1 class='ytp-time-current'></span>";
				currentTime = document.getElementsByTagName("span1").item(0);
				duration = document.getElementsByClassName("ytp-time-duration").item(0);
				initialize();
			}
		}
	}
},100);





