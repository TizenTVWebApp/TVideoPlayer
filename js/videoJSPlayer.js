/**
 * Player object constructor.
 *
 * @param   {Object} config - Playback and player configuration.
 * @returns {Object}
 */
function VideoJSPlayer(config) {
	
	var isTizen = true;
	 if (window.tizen === undefined) {
         //log('This application needs to be run on Tizen device');
		 isTizen = false;
     }
	 
    var log = config.logger;

    /**
     * HTML av-player element
     */
    
    
    /**
     * HTML controls div
     */
    var controls = config.controls;

    /**
     * Fullscreen flag
     * @type {Boolean}
     */
    var isFullscreen = false;

    /**
     * HTML element o display stream properties.
     */
    var info = config.info;

    var defaultResolutionWidth = 1920;
    var resolutionWidth = config.resolutionWidth;

    var playerCoords = config.playerPosition|| {
        x: Math.floor(10 * resolutionWidth / defaultResolutionWidth)+'px',
        y: Math.floor(300 * resolutionWidth / defaultResolutionWidth)+'px',
        width: defaultResolutionWidth+'px',
        height: defaultResolutionWidth+'px'
    };

    /**
     * 4k flag
     * @type {Boolean}
     */
    var isUhd = false;
    
    var playlist = config.playlist;
    
    var containner ;
    
    if(document.getElementById(config.playerdiv)){}else{
    	containner = document.createElement("div");
    	containner.id= "videojsContainner";
    	containner.setAttribute("right","setfullscreen");  
    	var width = playerCoords.width;
    	var height = playerCoords.height;
    	var left = playerCoords.x;
    	var top = playerCoords.y;
    	containner.style.cssText = 'position:absolute; width:'+width+';height:'+height+';top:'+top+';left:'+left+';';
    	document.body.appendChild(containner);
    	var div = document.createElement("video");
    	div.id = config.playerdiv;
    	
    	//div.style.cssText = 'z-index:-99;width:'+width+';height:'+height+';top:0px;left:0px';         
    	div.setAttribute("class","video-js vjs-default-skin");  
    	div.setAttribute("controls",""); 
    	div.setAttribute("preload","auto");
    	
    	containner.appendChild(div);
    	
    }
    // create videojs Instance , fluid:true -> size is adaptive with the containner size
    var videoplayer = videojs(config.playerdiv,{
    	fluid:true,
    	plugins:{
    		//shoot:{}   can not capture video element in tizen because crossOrigin not support，
    		/*vttThumbnails:{
    			src:'lib/videojsPlugin/thumbnails/examples/test.vtt'
    		}*/
    	}});
    
    //if tizen , "progress" event disable, use manual loading buffered event
    if(isTizen){
    videoplayer.tech_.__proto__.featuresProgressEvents=false;
    videoplayer.tech_.__proto__.featuresVolumeControl=false;
    videoplayer.tech_.__proto__.featuresPlaybackRate =true;
    videoplayer.tech_.__proto__.featuresFullscreenResize =false;
    console.log(videoplayer.tech_);
    }    
    videoplayer.playlist(playlist);
    
    var that = this;
    console.log(this);
    containner.addEventListener("click", function(){
    	 if (videoplayer.isFullscreen() === false) {
             videoplayer.requestFullscreen();
         	//videoplayer.setDisplayRect(0, 0, 1920, 1080);
             //player.classList.add('fullscreenMode');
            // controls.classList.add('fullscreenMode');
             videoplayer.isFullscreen(true);
         }
    });
    //videoplayer.bitrateGraph();
    videoplayer.ready(function() {
    	  //enable hotkey handle
    	  console.log("ready");
    	  console.log(videoplayer);
		  this.hotkeys({
			    volumeStep: 0.1,
			    seekStep: 5,
			    alwaysCaptureHotkeys:false,
			    activeOnlyInFullScreen:true,
			    enableModifiersForNumbers: false
			  });
		  videoplayer.playlist.autoadvance(0);
			});
    

    return {
    	init:function(){
    		
    	},
        /**
         * Function to initialize the playback.
         * @param {String} url - content url, if there is no value then take url from config
         */
    	open: function(url,call){
    		/* Create listener object. */
           /* var listener = {
                onbufferingstart: function () {
                    log("Buffering start.");
                },
                onbufferingprogress: function (percent) {
                    //log("Buffering progress data : " + percent);
                },
                onbufferingcomplete: function () {
                    log("Buffering complete.");
                },
                oncurrentplaytime: function (currentTime) {
                    //log("Current playtime: " + currentTime);
                },
                onevent: function (eventType, eventData) {
                    log("event type: " + eventType + ", data: " + eventData);
                },
                onstreamcompleted: function () {
                    log("Stream Completed");
                    this.stop();
                }.bind(this),
                onerror: function (eventType) {
                    log("event type error : " + eventType);
                }
            };

            if (!url) {
                url = config.url;
            }
            log('videoPlayer open: ' + url);
            try {
                videoplayer.src(url);
                videoplayer.setDisplayRect(
                    playerCoords.x,
                    playerCoords.y,
                    playerCoords.width,
                    playerCoords.height
                );
                videoplayer.setListener(listener);
            } catch (e) {
                log(e);
            }*/
    		try {
    			if (!url) {
                    url = config.url;
                }
                log('videoPlayer open: ' + url);
                var timecode =0;
                var initdone = false;
                videoplayer.vttThumbnails({src:'lib/videojsPlugin/thumbnails/examples/test.vtt'});
                videoplayer.src(url);
                videoplayer.on("loadedmetadata",function(){
                	log("loadedmetadata");
                	videoplayer.currentTime(timecode);
                });
                videoplayer.on("canplaythrough",function(){
                	console.log("canplaythrough");
                	if(!initdone){
                		videoplayer.currentTime(timecode);
                		initdone = true;
                	}
                });
                videoplayer.on("timeupdate",function(){
                	//console.log(videoplayer.tech_);
                	//console.log("timeupdate"+videoplayer.currentTime());
                	});
                videoplayer.on("progress",function(){
                	console.log("progress"+videoplayer.bufferedPercent());
                	console.log("progress"+videoplayer.buffered());
                	});
                videoplayer.on("loadstart",function(){
                	log("loadstart");
                	});
                videoplayer.on("ended",function(){
                	log("ended");
                	});
                
                videoplayer.ready(function(){
                	log("ready");
                	var lengthOfVideo = videoplayer.duration();
                	call();
                });
    		}catch(e){
    			log(e);
    		}
    	},
    	
        play: function () {
            //set 4k
            /*if (isUhd) {
                this.set4K();
            } */   
        	console.log(videoplayer.readyState());
        	console.log(videoplayer.isReady_);
        	console.log(videoplayer.paused());
        	if (videoplayer.readyState()) {       		
        		if (videoplayer.paused()) {                
                    videoplayer.play();
                } else{
                	//videoplayer.play();
                }  
            }else {
            	this.open(config.url,function(){
                	console.log(videoplayer);
                	if (videoplayer.paused()) {                
                        videoplayer.play();
                    } else{
                    	videoplayer.play();
                    }  
                });
            }                      
        },
        playPause:function(){
        	if (videoplayer.paused()) {                
                videoplayer.play();
            } else{
            	videoplayer.pause();
            }
        },
        /**
         * Function to stop current playback.
         */
        stop: function () {
            videoplayer.dispose();

            //switch back from fullscreen to window if stream finished playing
            if (isFullscreen === true) {
                this.toggleFullscreen();
            }
            //clear stream information window
            info.innerHTML = '';
        },
        close: function () {
            videoplayer.dispose();

            
        },
        /**
         * Function to pause/resume playback.
         * @param {String} url - content url, if there is no value then take url from config
         */
        pause: function (url) {
            if (!url) {
                url = config.url;
            }
            videoplayer.pause();
        },
        /**
         * Jump forward 3 seconds (3000 ms).
         */
        ff: function () {
           // videoplayer.jumpForward('3000');
        	//var l = videoplayer.seeking(videoplayer.currentTime()+10);
        	var l = videoplayer.currentTime(videoplayer.currentTime()+10);
        	//console.log(videoplayer.playbackRate());
        	//var l = videoplayer.playbackRate(2);
        	//var l = videoplayer.setSpeed(2);
        	log("ff");
        	log(l);
        },
        /**
         * Rewind 3 seconds (3000 ms).
         */
        rew: function () {
            //videoplayer.jumpBackward('3000');
            //var l = videoplayer.seeking(videoplayer.currentTime()-10);
        	var l = videoplayer.currentTime(videoplayer.currentTime()-10);
        	//console.log(videoplayer.playbackRate());
        	//var l = videoplayer.playbackRate(0.5);
            log("rew");
        	log(l);
        },
        isFullScreen:function(){
        	return videoplayer.isFullscreen();
        },
        /**
         * Set flag to play UHD content.
         * @param {Boolean} isEnabled - Flag to set UHD.
         */
        setUhd: function (isEnabled) {
            isUhd = isEnabled;
        },
        setSpeed:function(rate){
        	videoplayer.playbackRate(rate);
        },
        getBuffered:function(){
        	console.log(videoplayer.buffered());
        	return videoplayer.buffered();
        },
        getBufferedEnd:function(){
        	console.log(videoplayer.bufferedEnd());
        	console.log(videoplayer.currentTime());
        	return videoplayer.bufferedEnd();
        },
        getBufferPercent:function(){
        	console.log(videoplayer.bufferedPercent());
        	return videoplayer.bufferedPercent();
        },
        getVideoPlayer:function(){
        	return videoplayer;
        },
        setExternalSubtitlePath:function(path){
        	videoplayer.setSilentSubtitle(true);
        	videoplayer.setExternalSubtitlePath(path);
        	log("123!");
        },
        /**
         * Set to TV to play UHD content.
         */
        set4K: function () {
            videoplayer.setStreamingProperty("SET_MODE_4K", "true");
        },
        /**
         * Function to set specific bitrates used to play the stream.
         * In case of Smooth Streaming STARTBITRATE and SKIPBITRATE values 'LOWEST', 'HIGHEST', 'AVERAGE' can be set.
         * For other streaming engines there must be numeric values.
         *
         * @param {Number} from  - Lower value of bitrates range.
         * @param {Number} to    - Higher value of the bitrates range.
         * @param {Number} start - Bitrate which should be used for initial chunks.
         * @param {Number} skip  - Bitrate that will not be used.
         */
        setBitrate: function (from, to, start, skip) {
            var bitrates = '|BITRATES=' + from + '~' + to;

            if (start !== '' && start !== undefined) {
                bitrates += '|STARTBITRATE=' + start;
            }
            if (to !== '' && to !== undefined) {
                bitrates += '|SKIPBITRATE=' + skip;
            }

            videoplayer.setStreamingProperty("ADAPTIVE_INFO", bitrates);
        },
        /**
         * Function to change current VIDEO/AUDIO/TEXT track
         * @param {String} type  - Streaming type received with videoplayer.getTotalTrackInfo(), possible values
         *     are: VIDEO, AUDIO, TEXT.
         * @param {Number} index - Track id received with videoplayer.getTotalTrackInfo().
         */
        setTrack: function (type, index) {
            videoplayer.setSelectTrack(type, index);
        },
        /**
         * Show information about all available stream tracks on the screen.
         */
        getTracks: function () {
            var trackInfo = videoplayer.getTotalTrackInfo();
            var text = 'type of track info: ' + typeof trackInfo + '<br />';
            text += 'length: ' + trackInfo.length + '<br />';
            for (var i = 0; i < trackInfo.length; i++) {
                text += 'index: ' + trackInfo[i].index + ' ';
                text += 'type: ' + trackInfo[i].type + ' ';
                text += 'extra_info: ' + trackInfo[i].extra_info + '<br />';
            }
            info.innerHTML = text;
        },
        /**
         * Show streaming properties on the screen.
         */
        getProperties: function () {
            var text = 'AVAILABLE_BITRATE: ' + videoplayer.getStreamingProperty("AVAILABLE_BITRATE") + '<br />';
            text += 'CURRENT_BANDWIDTH: ' + videoplayer.getStreamingProperty("CURRENT_BANDWITH") + '<br />';
            text += 'DURATION: ' + videoplayer.getStreamingProperty("DURATION") + '<br />';
            text += 'BUFFER_SIZE: ' + videoplayer.getStreamingProperty("BUFFER_SIZE") + '<br />';
            text += 'START_FRAGMENT: ' + videoplayer.getStreamingProperty("START_FRAGMENT") + '<br />';
            text += 'COOKIE: ' + videoplayer.getStreamingProperty("COOKIE") + '<br />';
            text += 'CUSTOM_MESSAGE: ' + videoplayer.getStreamingProperty("CUSTOM_MESSAGE");
            info.innerHTML = text;
        },
        /**
         * Switch between full screen mode and normal windowed mode.
         */
        toggleFullscreen: function () {
            if (videoplayer.isFullscreen() === false) {
                videoplayer.requestFullscreen();
            	//videoplayer.setDisplayRect(0, 0, 1920, 1080);
                //player.classList.add('fullscreenMode');
               // controls.classList.add('fullscreenMode');
                videoplayer.isFullscreen(true);
            } else {
                log('Fullscreen off');
                try {
                    /*videoplayer.setDisplayRect(
                        playerCoords.x,
                        playerCoords.y,
                        playerCoords.width,
                        playerCoords.height
                    );*/
                	videoplayer.exitFullscreen();
                	videoplayer.isFullscreen(false);
                } catch (e) {
                    log(e);
                }
                player.classList.remove('fullscreenMode');
                controls.classList.remove('fullscreenMode');
                isFullscreen = false;
            }
        }
    };
}
