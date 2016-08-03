
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {msg: "video"}, function(x){
  	document.getElementById("status").innerHTML = "Response2: " + x;
  });
});

