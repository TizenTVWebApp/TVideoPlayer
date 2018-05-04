(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[PlayerMultiApp]: ', msg);
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var audioInput = null,
        realAudioInput = null,
        effectInput = null,
        wetGain = null,
        dryGain = null,
        outputMix = null,
        currentEffectNode = null,
        reverbBuffer = null,
        dtime = null,
        dregen = null,
        lfo = null,
        cspeed = null,
        cdelay = null,
        cdepth = null,
        scspeed = null,
        scldelay = null,
        scrdelay = null,
        scldepth = null,
        scrdepth = null,
        fldelay = null,
        flspeed = null,
        fldepth = null,
        flfb = null,
        sflldelay = null,
        sflrdelay = null,
        sflspeed = null,
        sflldepth = null,
        sflrdepth = null,
        sfllfb = null,
        sflrfb = null,
        rmod = null,
        mddelay = null,
        mddepth = null,
        mdspeed = null,
        lplfo = null,
        lplfodepth = null,
        lplfofilter = null,
        awFollower = null,
        awDepth = null,
        awFilter = null,
        ngFollower = null,
        ngGate = null,
        bitCrusher = null,
        btcrBits = 16,   // between 1 and 16
        btcrNormFreq = 1; // between 0.0 and 1.0
    var constraints = 
    {
      audio: {
          optional: [{ echoCancellation: false }]
      }
    };

    function gotStream(stream) {
        // Create an AudioNode from the stream.
//        realAudioInput = audioContext.createMediaStreamSource(stream);
        var input = audioContext.createMediaStreamSource(stream);

    /*
        realAudioInput = audioContext.createBiquadFilter();
        realAudioInput.frequency.value = 60.0;
        realAudioInput.type = realAudioInput.NOTCH;
        realAudioInput.Q = 10.0;

        input.connect( realAudioInput );
    */
        audioInput = input;
        /*audioInput = convertToMono( input );

        if (useFeedbackReduction) {
            audioInput.connect( createLPInputFilter() );
            audioInput = lpInputFilter;
            
        }*/
        // create mix gain nodes
        outputMix = audioContext.createGain();
        dryGain = audioContext.createGain();
        wetGain = audioContext.createGain();
        effectInput = audioContext.createGain();
        audioInput.connect(dryGain);
       // audioInput.connect(analyser1);
        audioInput.connect(effectInput);
        dryGain.connect(outputMix);
        wetGain.connect(outputMix);
        outputMix.connect( audioContext.destination);
       // outputMix.connect(analyser2);
        //crossfade(1.0);
       // changeEffect();
        //cancelAnalyserUpdates();
        //updateAnalysers();
    }
    
    function initAudio() {
        /*var irRRequest = new XMLHttpRequest();
        irRRequest.open("GET", "sounds/cardiod-rear-levelled.wav", true);
        irRRequest.responseType = "arraybuffer";
        irRRequest.onload = function() {
            audioContext.decodeAudioData( irRRequest.response, 
                function(buffer) { reverbBuffer = buffer; } );
        }
        irRRequest.send();

        o3djs.require('o3djs.shader');

        analyser1 = audioContext.createAnalyser();
        analyser1.fftSize = 1024;
        analyser2 = audioContext.createAnalyser();
        analyser2.fftSize = 1024;

        analyserView1 = new AnalyserView("view1");
        analyserView1.initByteBuffer( analyser1 );
        analyserView2 = new AnalyserView("view2");
        analyserView2.initByteBuffer( analyser2 );*/

        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!navigator.getUserMedia)
            return(alert("Error: getUserMedia not supported!"));

        navigator.getUserMedia(constraints, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });

       /* if ((typeof MediaStreamTrack === 'undefined')||(!MediaStreamTrack.getSources)){
            console.log("This browser does not support MediaStreamTrack, so doesn't support selecting sources.\n\nTry Chrome Canary.");
        } else {
            MediaStreamTrack.getSources(gotSources);
        }

        document.getElementById("effect").onchange=changeEffect;*/
    }
    

    var player;

    // flag to monitor UHD toggling
    var uhdStatus = false;

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = [
            'MediaPause',
            'MediaPlay',
            'MediaPlayPause',
            'MediaFastForward',
            'MediaRewind',
            'MediaStop',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9'            
        ];

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
        	console.log(e.keyCode);
            switch (e.keyCode) {
                case 13:    // Enter
                    player.toggleFullscreen();
                    break;
                case 10252: // MediaPlayPause
                	//player.playPause();
                	break;
                case 415:   // MediaPlay
                	//player.play();
                	break;
                case 19:    // MediaPause
                    //player.pause();
                    break;
                case 413:   // MediaStop
                    //player.stop();
                    break;
                case 417:   // MediaFastForward
                    //player.ff();
                    break;
                case 412:   // MediaRewind
                    //player.rew();
                    break;
                case 48: //Key 0
                	player.play();
                    break;
                case 49: //Key 1
                	player.setSpeed(1.0);
                    //setUhd();
                    break;
                case 50: //Key 2
                	player.setSpeed(1.0);
                	player.setSpeed(2.0);
                    //player.getTracks();
                    break;
                case 51: //Key 3
                	player.setSpeed(1.0);
                	player.setSpeed(0.5);
                    //player.getProperties();
                    break;
                case 52: //Key 4
                	console.log("4 press");
                	console.log(player.getBuffered().start(0));
                	console.log(player.getBuffered().end(0));
                	console.log(player.getBufferedEnd());
                	console.log(player.getVideoPlayer());
                    //player.getProperties();
                    break;
                case 53: //Key 5
                	console.log("5 press");
                	console.log(player.getBufferPercent());
                    //player.getProperties();
                    break;
                case 54: //Key 6
                	console.log("6 press");
                	console.log(player.getBuffered());
                    //player.getProperties();
                    break;
                case 10009: // Return
                    /*if (webapis.avplay.getState() !== 'IDLE' && webapis.avplay.getState() !== 'NONE') {
                        player.stop();
                    } else {
                       // tizen.application.getCurrentApplication().hide();
                    }*/
                    break;
                default:
                    console.log("Unhandled key");
            }
        });
    }

    function registerMouseEvents() {
        document.querySelector('.video-controls .play').addEventListener(
            'click',
            function () {
                player.playPause();
                document.getElementById('streamParams').style.visibility = 'visible';
            }
        );
        document.querySelector('.video-controls .stop').addEventListener(
            'click',
            function () {
                player.stop();
                document.getElementById('streamParams').style.visibility = 'hidden';
            }
        );
        document.querySelector('.video-controls .pause').addEventListener(
            'click',
            player.playPause
        );
        document.querySelector('.video-controls .ff').addEventListener(
            'click',
            player.ff
        );
        document.querySelector('.video-controls .rew').addEventListener(
            'click',
            player.rew
        );
        document.querySelector('.video-controls .fullscreen').addEventListener(
            'click',
            player.toggleFullscreen
        );
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }

    /**
     * Enabling uhd manually in order to play uhd streams
     */
    function setUhd() {
        if (!uhdStatus) {
            if (webapis.productinfo.isUdPanelSupported()) {
                log('4k enabled');
                uhdStatus = true;
            } else {
                log('this device does not have a panel capable of displaying 4k content');
            }

        } else {
            log('4k disabled');
            uhdStatus = false;
        }
        player.setUhd(uhdStatus);
    }


    /**
     * Function initialising application.
     */
    window.onload = function () {

        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeys();
        registerKeyHandler();

        /**
         * Enable multitasking
         */
        document.addEventListener("visibilitychange",function(){
            //When going away from this app suspend player
            if( document.hidden ){ // PAUSE
                log("lifecycle [pause]");
                //player.suspend();

            } else { // RESUME
                //When going back to this app resume player
                log("lifecycle [resume]");
                //player.resume();
            }
        });

        /**
         * Player configuration object.
         *
         * @property {String}    url                     - content url
         * @property {HTML Element} player           - application/avplayer object
         * @property {HTML Div Element} controls     - player controls
         * @property {HTLM Div Element} info         - place to display stream info
         */
        var config = {
        	//url:'http://www.1ting.com/mv/video/vhd/67174999.flv',
        	url:'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8',
        	type:'application/x-mpegURL',
            //url: 'http://t010.vod05.icntvcdn.com/media/new/2013/icntv2/media/2017/03/14/HD1Mb7f485084a8840eb9c02fcc2d87a5e5b.ts',//'http://playready.directtaps.net/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/Manifest',
            playerdiv: 'video-player',
            playertype:'videojs',
            //playerdiv:'av-player',
            //playertype:'avplay',
            controls: document.querySelector('.video-controls'),
            info: document.getElementById('info'),
            logger: log, //Function used for logging

            playlist:[{
            	sources: [{
            	    src: 'http://cache.m.ptqy.gitv.tv/mus/text/208853801/edb1217147959738081edd7b4fb26dcc/afbe8fd3d73448c9//20180205/df/e1/11dbefbd8e654f764b20e25157f324ad.m3u8?qd_originate=tmts_py&tvid=925446900&bossStatus=0&qd_vip=0&px=&qd_src=04075022081000000000&prv=&previewType=&previewTime=&from=&qd_time=1519808492162&qd_p=ddef5632&qd_asc=c855c94dd4bcc9b40dafc101312c21cf&qypid=925446900_04000000001000000000_4&qd_k=04b354059bbebd66b6a774213a486138&isdol=0&code=2&vf=026065678e81cc5c60990ab8a66cb796&np_tag=nginx_part_tag&APPID_IS_IQIYI=true',
            	    type: 'application/x-mpegURL'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/sintel/poster.png'
            },{
            	sources: [{
            	    src: 'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8',
            	    type: 'application/x-mpegURL'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/sintel/poster.png'
            },{
            	  sources: [{
            	    src: 'http://img.ksbbs.com/asset/Mon_1605/25d705200a4eab4.mp4',
            	    type: 'video/mp4'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/sintel/poster.png'
            	}, {
            	  sources: [{
            	    src: 'http://www.1ting.com/mv/video/vhd/67174999.flv',
            	    type: 'video/mp4'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
            	}/*, {
            	  sources: [{
            	    src: 'http://vjs.zencdn.net/v/oceans.mp4',
            	    type: 'video/mp4'
            	  }],
            	  poster: 'http://www.videojs.com/img/poster.jpg'
            	}, {
            	  sources: [{
            	    src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
            	    type: 'video/mp4'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
            	}, {
            	  sources: [{
            	    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
            	    type: 'video/mp4'
            	  }],
            	  poster: 'http://media.w3.org/2010/05/video/poster.png'
            	}*/]
            /*Smooth Streaming examples*/
            //	url:'http://playready.directtaps.net/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/Manifest',
            // url: 'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/Manifest'
        };


        //Check the screen width so that the AVPlay can be scaled accordingly
        tizen.systeminfo.getPropertyValue(
            "DISPLAY",
            function (display) {
                log("The display width is " + display.resolutionWidth);
                config.resolutionWidth = 1920;//display.resolutionWidth;

                // initialize player - loaded from videoPlayer.js
                if(config.playertype =="avplay"){
                	player = new VideoPlayer(config);
                }else if(config.playertype=="videojs"){
                	player = new VideoJSPlayer(config);
                }else{
                	
                }
                registerMouseEvents();
            },
            function(error) {
                log("An error occurred " + error.message);
            }
        );
        
        //
        initAudio();

    }
}());
