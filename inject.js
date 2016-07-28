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
	if(request.msg == "video"){
		var video = document.getElementsByTagName("video").item(0);
		var currentTime = document.getElementsByClassName("ytp-time-current").item(0);
		var duration = document.getElementsByClassName("ytp-time-duration").item(0);
		currentTime.outerHTML = "<span1 class='ytp-time-current'>CHANGED</span>";
		duration.textContent = formatTime(video.duration);
		sendResponse("Executed");
	
	}
});


