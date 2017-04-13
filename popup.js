var button = document.getElementById("toggle");           //Duration shift toggle button
var pauseTotals = document.getElementById("pauseTotals"); //Total watch time tracking pause button
var resetTotals = document.getElementById("resetTotals"); //Total watch time tracking reset button
var pauseSaved = document.getElementById("pauseSaved");   //The next two are the similar just for total time saved tracking
var resetSaved = document.getElementById("resetSaved");

var Tyears = document.getElementById("Tyears");       //Fields for the y,d,h,m,s in Total watch time
var Tdays = document.getElementById("Tdays"); 
var Thours = document.getElementById("Thours"); 
var Tminutes = document.getElementById("Tminutes"); 
var Tseconds = document.getElementById("Tseconds"); 

var Syears = document.getElementById("Syears");       //Total saved time
var Sdays = document.getElementById("Sdays"); 
var Shours = document.getElementById("Shours"); 
var Sminutes = document.getElementById("Sminutes"); 
var Sseconds = document.getElementById("Sseconds"); 

var Ssince = document.getElementById("Ssince");
var since = document.getElementById("since");

var mode;   //boolean to represent the state of the Duration Shift button. Used to eliminate calling chrome.storage.get
            //just for mouseover events that just would change the css and not necesserily change the mode.

//Variables stored in chrome.storage:
//"paused" : boolean to store total watch time tracking setting
//"savedPaused" : boolean to store saved time saved tracking setting
//"overall" : stores total watch time in seconds
//"timeSaved" : stores total time saved in seconds
//"setting" : boolean to store Duration Shift setting

function getDate(){
  var today = new Date();
  if(today.getMonth() == 0)
    today = "January ";
  else if(today.getMonth() == 1)
    today = "February "; 
  else if(today.getMonth() == 2)
    today = "March ";
  else if(today.getMonth() == 3)
    today = "April ";
  else if(today.getMonth() == 4)
    today = "May ";
  else if(today.getMonth() == 5)
    today = "June ";
  else if(today.getMonth() == 6)
    today = "July ";
  else if(today.getMonth() == 7)
    today = "August ";
  else if(today.getMonth() == 8)
    today = "September ";
  else if(today.getMonth() == 9)
    today = "October ";
  else if(today.getMonth() == 10)
    today = "November ";
  else
    today = "December ";
  today += new Date().getDate();
  today += ", ";
  today += new Date().getFullYear();
  return today;
}

function formatTotals(seconds){   //takes time in seconds, formats, and then prints to Total Watch Time field
  if(seconds >= 3153600){         //no. of seconds in a year
    Tyears.innerHTML = Math.floor(seconds / 3153600);
    seconds -= Math.floor(seconds / 3153600)*3153600;
  }
  else
    Tyears.innerHTML = 0;
  if(seconds >= 86400){     //no. of seconds in a day
    Tdays.innerHTML = Math.floor(seconds / 86400);
    seconds -= Math.floor(seconds / 86400)*86400;
  }
  else
    Tdays.innerHTML = 0;
  if(seconds >= 3600){      //no. of seconds in an hour
    Thours.innerHTML = Math.floor(seconds / 3600);
    seconds -= Math.floor(seconds / 3600)*3600;
  }
  else
    Thours.innerHTML = 0;
  if(seconds >= 60){        //minutes
    Tminutes.innerHTML = Math.floor(seconds / 60);
    seconds -= Math.floor(seconds / 60)*60;
  }
  else
    Tminutes.innerHTML = 0;
  Tseconds.innerHTML = Math.floor(seconds);
}

function formatSaved(seconds){    //takes time in seconds, formats, and then prints to Total Watch Time field
  if(seconds >= 3153600){
    Syears.innerHTML = Math.floor(seconds / 3153600);
    seconds -= Math.floor(seconds / 3153600)*3153600;
  }
  else
    Syears.innerHTML = 0;
  if(seconds >= 86400){
    Sdays.innerHTML = Math.floor(seconds / 86400);
    seconds -= Math.floor(seconds / 86400)*86400;
  }
  else
    Sdays.innerHTML = 0;
  if(seconds >= 3600){
    Shours.innerHTML = Math.floor(seconds / 3600);
    seconds -= Math.floor(seconds / 3600)*3600;
  }
  else
    Shours.innerHTML = 0;
  if(seconds >= 60){
    Sminutes.innerHTML = Math.floor(seconds / 60);
    seconds -= Math.floor(seconds / 60)*60;
  }
  else
    Sminutes.innerHTML = 0;
  Sseconds.innerHTML = Math.floor(seconds);
}

pauseTotals.onclick = function(){ //play/pause toggle button, the state is stored as boolean "paused" in storage.
  chrome.storage.sync.get("paused", function(object){
    if(object.paused == true){
      chrome.storage.sync.set({"paused": false});
      pauseTotals.innerHTML = "Pause";
    }
    else{
      chrome.storage.sync.set({"paused": true});
      pauseTotals.innerHTML = "Resume";
    }
  });
}

resetTotals.onclick = function(){
  var today = getDate();
  chrome.storage.sync.set({"overall": 0});
  chrome.storage.sync.set({"since": today});
  since.innerHTML = "Since " + today;
}

pauseSaved.onclick = function(){
  chrome.storage.sync.get("savedPaused", function(object){
    if(object.savedPaused == true){
      chrome.storage.sync.set({"savedPaused": false});
      pauseSaved.innerHTML = "Pause";
    }
    else{
      chrome.storage.sync.set({"savedPaused": true});
      pauseSaved.innerHTML = "Resume";
    }
  });
}

resetSaved.onclick = function(){
  var today = getDate();
  chrome.storage.sync.set({"timeSaved": 0});
  chrome.storage.sync.set({"Ssince": today});
  Ssince.innerHTML = "Since " + today;
}

button.onclick = function(){  //Duration shift toggle
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
var secs = 0;

setInterval(function(){ //When the browser action is opened the update rate for the Totals and Time Saved fields is increased from every 5 seconds to every second 
  if(secs > 30)         //so that the gui behavior is more engaging as the user can see the time increasing in "real time". However, this is costly because at this rate
    window.close();     //MAX_WRITE_OPERATIONS_PER_HOUR would be violated very quickly. This interval will close the window automatically after 30 seconds in case the user forgets to close
  secs++;               //the window, allowing the extension to re-enter the low-update-rate state.
}, 1000)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){ //the content script sends a message every second to see if the browser action popup is open, if it isn't the update rate will be low,
  if(request.message == "You There?")                     //if it is, the update rate will be high.
    sendResponse("yes");
});

chrome.storage.sync.get("setting", function(object){
  if(object.setting === undefined){ //on first load set default value of "setting" to true. Duration Shift will be on.
    chrome.storage.sync.set({"setting": true});
    button.innerHTML = "Yeah!";
    button.style.backgroundColor = "#5AE87C";
    button.style.color = "white";
    mode = true;
  }
  else{ //if extension has been loaded before, get setting and change button css accordingly, red if off, green if on.
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

chrome.storage.sync.get("since", function(object){
  if(object.since === undefined){
    var today = getDate();
    chrome.storage.sync.set({"since": today});
    since.innerHTML = "Since " + today;
  }
  else{
    since.innerHTML = "Since " + object.since;
  }
});

chrome.storage.sync.get("Ssince", function(object){
  if(object.Ssince === undefined){
    var today = getDate();
    chrome.storage.sync.set({"Ssince": today});
    Ssince.innerHTML = "Since " + today;
  }
  else{
    Ssince.innerHTML = "Since " + object.Ssince;
  }
});


chrome.storage.sync.get(["overall", "paused", "savedPaused", "timeSaved"], function(object){
  if(object.overall === undefined)        //assign default values on first load.
    chrome.storage.sync.set({"overall": 0});
  if(object.paused === undefined)
    chrome.storage.sync.set({"paused": false});

  if(object.timeSaved === undefined)
    chrome.storage.sync.set({"timeSaved": 0});
  if(object.savedPaused === undefined)
    chrome.storage.sync.set({"savedPaused": false});
  chrome.storage.sync.get(["overall", "paused", "savedPaused", "timeSaved"], function(object){
    if(object.paused == false)          //assign correct text for toggle buttons.
      pauseTotals.innerHTML = "Pause";
    else
      pauseTotals.innerHTML = "Resume";

    if(object.savedPaused == false)
      pauseSaved.innerHTML = "Pause";
    else
      pauseSaved.innerHTML = "Resume";

    formatTotals(object.overall);       
    formatSaved(Math.floor(object.timeSaved));
  });

});



chrome.storage.onChanged.addListener(function(object, namespace){ //when content script updates chrome.storage values for overall/time saved, print to fields.
  formatTotals(object.overall.newValue);
});
chrome.storage.onChanged.addListener(function(object, namespace){
  formatSaved(Math.floor(object.timeSaved.newValue));
});

