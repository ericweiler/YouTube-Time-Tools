function formatTime(time){    //format time for video duration field. Takes time in seconds, returns string with time formatted in HH:MM:SS format
  var formattedTime = "";
  time = Math.ceil(time);
  var addZero = false;
  if(time >= 3600){ 
    addZero = true; //if the video is an hour or longer, remember to pad minutes with zero if the minute value < 10
    formattedTime += Math.floor(time / 3600);
    formattedTime += ":";
    time -= Math.floor(time/3600)*3600;
  }
  if(Math.floor(time/60) < 10 && addZero) //if the video is an hour or longer, remember to pad minutes with zero if the minute value < 10
    formattedTime += "0";
  formattedTime += Math.floor(time/60);
  formattedTime += ":";
  time -= Math.floor(time/60)*60;
  if(time < 10)
    formattedTime += "0";
  formattedTime += time;
  return formattedTime;
}

//Formula to make video duration scale with video speed: scaled duration = original duration / playback rate.
//whenever formatTime() is called it will often be passed video.duration/video.playbackRate to achieve the scaled
//duration

function durationchange(){    //when video duration changes, a new video has been loaded, print the new video duration
  if(!isNaN(video.duration/video.playbackRate)){
    duration.textContent = formatTime(video.duration/video.playbackRate);
    currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
  }
}

function ratechange(){      //when video rate changed, print the new video duration and current time based upon new rate
  if(!isNaN(video.duration/video.playbackRate)){
    duration.textContent = formatTime(video.duration/video.playbackRate);
    currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
  }
}

function durationShiftOn(){
  var videoElsReady = setInterval(function(){   
    if(document.getElementsByTagName("video").item(0) != null){
      if(document.getElementsByClassName("ytp-time-current") != null){
        if(document.getElementsByClassName("ytp-time-duration") != null){              //test to see if the three elements to be modified exist
          clearInterval(videoElsReady);                   
          currentTime = document.getElementsByClassName("ytp-time-current").item(0);   //set references
          currentTime.outerHTML = "<span1 class='ytp-time-current'></span>";           //change tag from <span> to <span1> so that youtube.com loses reference to the current time field and will no longer update it.
          currentTime = document.getElementsByTagName("span1").item(0);                //reference was lost through the above line, get it again.
          duration = document.getElementsByClassName("ytp-time-duration").item(0);     //set references
          
          clearInterval(refreshCurrentTime);
          refreshCurrentTime = setInterval(function(){                //define new function to refresh the time.
            currentTime.textContent = formatTime(video.currentTime/video.playbackRate); //currentTime/playbackRate will allow the current time to display the proper current time when the video duration is scaled with playbackrate.
          },1000);                                    //a nice side effect is that the current time will tick once per second regardless of play back rate.

          if(!isNaN(video.duration/video.playbackRate)){                  //on new video load, sometimes the values for playbackrate and/or duration are undefined. Only print values if they are defined
            duration.textContent = formatTime(video.duration/video.playbackRate);   
            currentTime.textContent = formatTime(video.currentTime/video.playbackRate);
          }
          video.addEventListener("durationchange", durationchange);         //update duration and currentTime when new video loads
          video.addEventListener("ratechange", ratechange);             //update duration and currentTime when the rate changes
        }
      }
    }
  },100);
}

function incrimentTotals(totalType, value){ //This function updates the totals for either "overall" or "timeSaved" in chrome.storage. totalType can either be "overall" or "timeSaved", var value is only used for totalType = "timeSaved".
  if(totalType == "overall"){
    chrome.storage.sync.get("overall", function(object){
      if(object.overall === undefined)
        chrome.storage.sync.set({"overall": 0});
      chrome.storage.sync.set({"overall": (object.overall + value)});
    });
  }
  if(totalType == "timeSaved" && value > 0){
    chrome.storage.sync.get("timeSaved", function(object){
      if(object.timeSaved === undefined)
        chrome.storage.sync.set({"timeSaved": 0});
      chrome.storage.sync.set({"timeSaved": (object.timeSaved  + value)});
    });
  }
}

function durationShiftOff(){
  video.removeEventListener("durationchange", durationchange);
  video.removeEventListener("ratechange", ratechange);
  duration.textContent = formatTime(video.duration);
  clearInterval(refreshCurrentTime);
  refreshCurrentTime = setInterval(function(){          //since the control for updating the current time cannot be given back to youtube.com when the user turns the Duration Setting off, define a new function that does it manually. 
    currentTime.textContent = formatTime(video.currentTime);
  },1000);
}

function setup(){ //
  video = document.getElementsByTagName("video").item(0); //get <video> reference
  Object.defineProperty(HTMLMediaElement.prototype, 'playing', {  //define .playing for video elements. Credit: http://stackoverflow.com/questions/6877403/how-to-tell-if-a-video-element-is-currently-playing/6877530
    get: function(){
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
  });
  chrome.storage.sync.get(["setting", "paused", "savedPaused"], function(object){ //get settings.
    if(object.setting === undefined)                      //on first load set defaults.
      chrome.storage.sync.set({"setting": true});
    if(object.paused === undefined){
      chrome.storage.sync.set({"paused": false});
      paused = false;
    }
    if(object.savedPaused === undefined){
      chrome.storage.sync.set({"savedPaused": false});
      savedPaused = false;
    }

    if(object.paused == true)
      paused = true;
    else
      paused = false;
    if(object.savedPaused == true)
      savedPaused = true;
    else
      savedPaused = false;
    if(object.setting == true)
      durationShiftOn();    //if "setting" is true, run durationShiftOn to enable functionality
  });
  chrome.storage.onChanged.addListener(function(object, namespace){ //if the user changes the state of the "paused"/"savedPaused"/"setting" value in chrome.storage through the toggle button in the browser action page, store the new value locally so that the update time function wont increment the "overall" and "timeSaved" values in chrome.storage
    if(object.paused.newValue == true)
      paused = true;
    if(object.paused.newValue == false)
      paused = false;
  });
  chrome.storage.onChanged.addListener(function(object, namespace){ //^^
    if(object.savedPaused.newValue == true)
      savedPaused = true;
    if(object.savedPaused.newValue == false)
      savedPaused = false;
  });
  chrome.storage.onChanged.addListener(function(object, namespace){ //^^
    if(object.setting.newValue == true)
      durationShiftOn();
    if(object.setting.newValue == false)
      durationShiftOff();
  });
  /*
    To avoid breaking the MAX_WRITE_OPERATIONS_PER_HOUR limit, this script will only update the totals every five seconds UNLESS the browser action popup is open. If the browswer action popup is open
    the user is engaged with the GUI and the update rate is increased to once per second so that the totals fields in the popup look like a "ticking clock". This functionality is implemented below.
  */
  var trackTime = setInterval(function(){   //This interval checks to see if the browser action is open every second.
    chrome.runtime.sendMessage({message: "You There?"}, function(response) {  //is the browser action open?
      if(response == "yes"){                          //if it is
        if(video.playing && !paused)                    //so long as the video is playing and is not paused, increment the totals for the last second.
          incrimentTotals("overall", 1);
        if(video.playing && !savedPaused)
          incrimentTotals("timeSaved", 1 - (1/video.playbackRate));     //1 - 1/rate yields time saved
      }
      else{                                 //otherwise the browser action is not open
        if(everyFiveSeconds % 5 == 0){                    //if it has been five seconds since the last update
          if(video.playing && !paused)                  //so long as the video is playing and is not paused, increment the totals for the last five seconds.
            incrimentTotals("overall", 5);
          if(video.playing && !savedPaused)
            incrimentTotals("timeSaved", 5 - (5/video.playbackRate));
        }
      }
      everyFiveSeconds++;
    }); 
  }, 1000);
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.message == "opened"){
      alert("opened");
    }
    if(request.message == "closed"){
      alert("closed");
    }
  });
}

var video;  //video element reference
var currentTime;  //current time <span> reference
var duration;   //duration <span> reference
var refreshCurrentTime; //interval function variable
var paused; //boolean to store the state of the "paused" variable in chrome.storage so that interval function can reference it without having to call chrome.storage repeatedly
var savedPaused; //same thing, just for "savedPaused" in chrome.storage
var everyFiveSeconds = 0;


var videoReady = setInterval(function(){  //when a video element is detected (!= null) run the setup function.
  if(document.getElementsByTagName("video").item(0) != null){
    clearInterval(videoReady);
    setup();
  }
},100);







