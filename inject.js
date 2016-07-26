chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.msg == "video"){
		var x = document.getElementsByTagName("video").length;
		sendResponse(x);
	}
});


