var button = document.getElementById("Save");
var input = document.getElementById("input");
var output = document.getElementById("output");

button.onclick = function(){
	chrome.storage.sync.set({"setting": input.value}, function(){
	});
};

chrome.storage.sync.get("setting", function(object){
	output.innerHTML = object.setting;
});

chrome.storage.onChanged.addListener(function(object, namespace){
	output.innerHTML = object.setting.newValue;

});



// chrome.storage.sync.get("setting", function(object){
// 	output.textarea = object.setting
// });

//  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {msg: "video"}, function(x){
//   	document.getElementById("status").innerHTML = "Response2: " + x;
//   });
// });

