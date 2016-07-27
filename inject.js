chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.msg == "video"){
		var video = document.getElementsByTagName("video").item(0);
		var currentTime = document.getElementsByClassName("ytp-time-current").item(0);
		var duration = document.getElementsByClassName("ytp-time-duration").item(0);
		currentTime.outerHTML = "<span1 class='ytp-time-current'>Halt</span>";
		duration.textContent = "Testing Control of Existing Elements";
		sendResponse("Executed");
	
	}
});


