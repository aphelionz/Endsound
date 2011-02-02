// jQuery UI inits
var reverbOn = true;
var delayOn = false;
$(function() {
	//$("#reverb").button();
	$("#reverb").click(function(){
		reverbOn = this.checked;
	});
	reverbOn = $("#reverb").attr('checked');

	//$("#delay").button();
	$("#delay").click(function(){
		delayOn = this.checked;
	});
	delayOn = $("#delay").attr('checked');

	$("#masterVolumeLabel").html(0.8);
	//$("#masterVolume").slider({ min:0.0, max:1.2, step: 0.01, value:0.8 });
	$("#masterVolume").bind("slide", function(event, ui) {
		$("#masterVolumeLabel").html(ui.value);
		volume.setVolume(ui.value);
	});
	
	$("#bufferLabel").html(prebufferSize + ' samples, ' + (1000*prebufferSize/sampleRate).toFixed(0) + ' ms latency');
	//$("#buffer").slider({ min:1, max:10, step: 1, value:6 });
	$("#buffer").bind("slide", function(event, ui) {
		prebufferSize = ui.value * 1024;
		$("#bufferLabel").html(prebufferSize + ' samples, ' + (1000*prebufferSize/sampleRate).toFixed(0) + ' ms latency');
	});	
});

Volume = function(volume){
	this.volume = volume;
}

Volume.prototype.setVolume = function (volume){
	this.volume = volume;
}

Volume.prototype.process = function (samples){
	// change the volume of the samples in place
	for(var i=0; i<samples.length; i++){
		samples[i] = samples[i] * this.volume;
	}
}

var generator = [700, 1200];
var sampleRate = 44100;
var bufferSize = 1024; 
var prebufferSize = 8*1024; // defines the latency
var currentWritePosition = 0;
var lastSampleOffset = 0;

// load the synthesizer
var synthesizer = new KSPlayer(bufferSize, sampleRate);

// load the keyboard
var keyBoard = new Keyboard(this, function(event){
	synthesizer.play(event.keyId, event.hz, event.volume);
	socket.send({
		play : {
			keyId : event.keyId,
			hz : event.hz,
			volume : event.volume
		}
	});
	lastHz = event.hz;  // for display purposes

	// Updating the screen causes audio stuttering
}, function(event){
	synthesizer.stop(event.keyId);
	socket.send({
		stop : {
			keyId : event.keyId
		}
	});
}, function(event){
	synthesizer.setSustain(event);
	socket.send({
		sustain : {
			keyId : event.keyId,
			hz : event.hz,
			volume : event.volume
		}
	});
   });

keyBoard.setGenerator(generator);

// Audio processors
var multiDelay = new MultiDelay(sampleRate*5, sampleRate*0.5, 0.9, 0.4);
var reverb = new Reverb(sampleRate*5, 3000, 0.9, 0.4, 0.9, 8000);
var volume = new Volume(0.8);


var outputAudio = new Audio();

// function that describes the audio chain
var currentWritePosition = 0;
var lastSampleOffset = 0;
function writeAudio() {
	var currentSampleOffset = outputAudio.mozCurrentSampleOffset();
	var playHasStopped = currentSampleOffset == lastSampleOffset; // if audio stopped playing, just send data to trigger it to play again.
	while (currentSampleOffset + prebufferSize >= currentWritePosition || playHasStopped ) {

		// automatic latency control
		/*if (playHasStopped) {
			prebufferSize += 10;
			//console.log(prebufferSize);
		} else { 
			prebufferSize -= .01;
		}*/

		var audioData = synthesizer.generate();
		
		if(delayOn){
			audioData = multiDelay.process(audioData);
		}
		if(reverbOn){
			audioData = reverb.process(audioData);
		}
		
		//volume.process(audioData);
		
		var written = outputAudio.mozWriteAudio(audioData);
		currentWritePosition += written;
		currentSampleOffset = outputAudio.mozCurrentSampleOffset();
		playHasStopped = 0;
		if (written < audioData.length) { // firefox buffer is full, stop writing
			//console.log('Buffer overflow ' + written + '/' + audioData.length + ' written, buffer: ' + (currentWritePosition - outputAudio.mozCurrentSampleOffset()));
			return;
		}
	}
	lastSampleOffset = outputAudio.mozCurrentSampleOffset();
	
}

// setup audio output
var audioTimer;
if(outputAudio.mozSetup) {
	outputAudio.mozSetup(1, sampleRate);
	writeAudio(); // initial write
	var writeInterval = Math.floor(1000 * bufferSize / sampleRate);
	audioTimer = setInterval(writeAudio, writeInterval);
	//setInterval(updateScreen, 500); // even high interval screen updating causes stutter
}