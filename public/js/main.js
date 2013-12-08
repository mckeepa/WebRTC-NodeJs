navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var webRtcLearn = webRtcLearn || {};


(function( videoHelper, $, undefined ) {
    //Private Property
    var isHot = true;
    var video;
	var constraints;

    //Public Property
    videoHelper.constraints = "Bacon Strips";
    videoHelper.video = "Bacon Strips";

    //Public Method
    videoHelper.start = function(videoElement) {
		constraints = {audio: true, video: true};
		//video = document.querySelector("video");
		video = videoElement;
		navigator.getUserMedia(constraints, successCallback, errorCallback);
    };


    videoHelper.stop = function(videoElement){

    	videoElement.src = "";
    	window.stream.stop();

		// if (!!stream) {
		//     video.src = null;
		//     stream.stop();
		// }
    };

    //Private Method
	function successCallback(stream) {
	  window.stream = stream; // stream available to console
	  if (window.URL) {
	    video.src = window.URL.createObjectURL(stream);
	  } else {
	    video.src = stream;
	  }
	  video.play();
	}

	function errorCallback(error){
	  console.log("navigator.getUserMedia error: ", error);
	}

}( webRtcLearn.videoHelper = webRtcLearn.videoHelper || {}, jQuery ));



 $( document ).ready(function() {

    $( "#startVideo").click(function() {
    	var videoElement = document.querySelector("video");
	  	webRtcLearn.videoHelper.start(videoElement);
	});

  $( "#stopVideo").click(function() {
    	var videoElement = document.querySelector("video");
	  	webRtcLearn.videoHelper.stop(videoElement);
	});

  });



// var constraints = {audio: false, video: true};
// var video = document.querySelector("video");

// function successCallback(stream) {
//   window.stream = stream; // stream available to console
//   if (window.URL) {
//     video.src = window.URL.createObjectURL(stream);
//   } else {
//     video.src = stream;
//   }
//   video.play();
// }

// function errorCallback(error){
//   console.log("navigator.getUserMedia error: ", error);
// }

// navigator.getUserMedia(constraints, successCallback, errorCallback);