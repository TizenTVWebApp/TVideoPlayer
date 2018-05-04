/*
 * Video.js Hotkeys
 * https://github.com/ctd1500/videojs-hotkeys
 *
 * Copyright (c) 2015 Chris Dougherty
 * Licensed under the Apache-2.0 license.
 */

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('videojs-hotkeys', ['video.js'], function (module) {
      return factory(module.default || module);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('video.js'));
  } else {
    factory(videojs);
  }
}(this, function (videojs) {
  "use strict";
  if (typeof window !== 'undefined') {
    window['videojs_hotkeys'] = { version: "0.2.20" };
  }

  var hotkeys = function(options) {
    var player = this;
    var pEl = player.el();
    var doc = document;
    var def_options = {
      volumeStep: 0.1,
      seekStep: 5,
      enableMute: true,
      activeOnlyInFullScreen:false,
      enableVolumeScroll: true,
      enableFullscreen: true,
      enableNumbers: true,
      enableJogStyle: false,
      alwaysCaptureHotkeys: false,
      enableModifiersForNumbers: true,
      enableInactiveFocus: true,
      skipInitialFocus: false,
      playPauseKey: playPauseKey,
      playKey:playKey,
      pauseKey:pauseKey,
      stopKey:stopKey,
      rewindKey: rewindKey,
      forwardKey: forwardKey,
      leftKey:leftKey,
      rightKey:rightKey,
      upKey:upKey,
      downKey:downKey,
      volumeUpKey: volumeUpKey,
      volumeDownKey: volumeDownKey,
      muteKey: muteKey,
      fullscreenKey: fullscreenKey,
      customKeys: {}
    };

    var cPlay = 1,
    	cPlaying = 2,
    	cPause = 3,
    	cStop =4,
      cRewind = 5,
      cForward = 6,
      cLeft = 7,
      cRight =8,
      cUp =9,
      cDown =10,
      cVolumeUp = 11,
      cVolumeDown = 12,
      cMute = 13,
      cFullscreen = 14;

    // Use built-in merge function from Video.js v5.0+ or v4.4.0+
    var mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;
    options = mergeOptions(def_options, options || {});

    var volumeStep = options.volumeStep,
      seekStep = options.seekStep,
      enableMute = options.enableMute,
      activeOnlyInFullScreen = options.activeOnlyInFullScreen,
      enableVolumeScroll = options.enableVolumeScroll,
      enableFull = options.enableFullscreen,
      enableNumbers = options.enableNumbers,
      enableJogStyle = options.enableJogStyle,
      alwaysCaptureHotkeys = options.alwaysCaptureHotkeys,
      enableModifiersForNumbers = options.enableModifiersForNumbers,
      enableInactiveFocus = options.enableInactiveFocus,
      skipInitialFocus = options.skipInitialFocus;

    // Set default player tabindex to handle keydown and doubleclick events
    if (!pEl.hasAttribute('tabIndex')) {
      pEl.setAttribute('tabIndex', '-1');
    }

    // Remove player outline to fix video performance issue
    pEl.style.outline = "none";

    if (alwaysCaptureHotkeys || !player.autoplay()) {
      if (!skipInitialFocus) {
        player.one('play', function() {
          pEl.focus(); // Fixes the .vjs-big-play-button handing focus back to body instead of the player
        });
      }
    }

    if (enableInactiveFocus) {
      player.on('userinactive', function() {
        // When the control bar fades, re-apply focus to the player if last focus was a control button
        var cancelFocusingPlayer = function() {
          clearTimeout(focusingPlayerTimeout);
        };
        var focusingPlayerTimeout = setTimeout(function() {
          player.off('useractive', cancelFocusingPlayer);
          if (doc.activeElement.parentElement == pEl.querySelector('.vjs-control-bar')) {
            pEl.focus();
          }
        }, 10);

        player.one('useractive', cancelFocusingPlayer);
      });
    }

    player.on('play', function() {
      // Fix allowing the YouTube plugin to have hotkey support.
      var ifblocker = pEl.querySelector('.iframeblocker');
      if (ifblocker && ifblocker.style.display === '') {
        ifblocker.style.display = "block";
        ifblocker.style.bottom = "39px";
      }
    });

    var isMoving = false,seekMoveTime;
    var keyUp = function keyDown(event){
    	console.log("keyUp videojs"+event.which);
    	
    }
    var keyDown = function keyDown(event) {
    	console.log("keyDown videojs"+event.which);
      var ewhich = event.which,  wasPlaying, seekTime;
      var ePreventDefault = event.preventDefault;
      var duration = player.duration();
      //if ActiveOnlyInFullScreen 
      if(activeOnlyInFullScreen&&!player.isFullscreen()){return;}
      console.log(player.userActive());
     
      // When controls are disabled, hotkeys will be disabled as well
      if (player.controls()) {

    	  player.userActive(true);
        // Don't catch keys if any control buttons are focused, unless alwaysCaptureHotkeys is true
        var activeEl = doc.activeElement;
        if (alwaysCaptureHotkeys ||
            activeEl == pEl ||
            activeEl == pEl.querySelector('.vjs-tech') ||
            activeEl == pEl.querySelector('.vjs-control-bar') ||
            activeEl == pEl.querySelector('.iframeblocker')) {
        	console.log(checkKeys(event,player));
          switch (checkKeys(event, player)) {
            // Spacebar toggles play/pause
            case cPlay:
              ePreventDefault();
              if (alwaysCaptureHotkeys) {
                // Prevent control activation with space
                event.stopPropagation();
              }

              if (player.paused()) {
                player.play();
              } else {
                player.pause();
              }
              break;
              
            case cPause:
            	 ePreventDefault();
                 if (alwaysCaptureHotkeys) {
                   // Prevent control activation with space
                   event.stopPropagation();
                 }

                 if (player.paused()) {
                   //player.play();
                 } else {
                   player.pause();
                 }
                 break;
            case cPlaying:
           	 ePreventDefault();
                if (alwaysCaptureHotkeys) {
                  // Prevent control activation with space
                  event.stopPropagation();
                }
                if (player.paused()) {
                  player.play();
                } else {
                  //player.pause();
                }
                break;
            case cStop:
              	 ePreventDefault();
                   if (alwaysCaptureHotkeys) {
                     // Prevent control activation with space
                     event.stopPropagation();
                   }

                   if (player.paused()) {
                     
                   } else {
                     player.pause();
                   }
                   break;
            // Seeking with the left/right arrow keys
            case cRewind: // Seek Backward
            	console.log("cRewind!");
            	var controlBar = player.controlBar;
                console.log(controlBar);
                var progressControl =controlBar.progressControl;
                var seekBar = controlBar.progressControl.seekBar;
                seekBar.stepBack();
              /*wasPlaying = !player.paused();
              ePreventDefault();
              if (wasPlaying) {
                player.pause();
              }
              seekTime = player.currentTime() - seekStep;
              // The flash player tech will allow you to seek into negative
              // numbers and break the seekbar, so try to prevent that.
              if (player.currentTime() <= seekStep) {
                seekTime = 0;
              }
              player.currentTime(seekTime);
              if (wasPlaying) {
                player.play();
              }*/
              break;
            case cForward: // Seek Forward
            	console.log("cForward!");
            	var controlBar = player.controlBar;
                console.log(controlBar);
                var progressControl =controlBar.progressControl;
                var seekBar = controlBar.progressControl.seekBar;
                seekBar.stepForward();
              /*wasPlaying = !player.paused();
              ePreventDefault();
              if (wasPlaying) {
                player.pause();
              }
              seekTime = player.currentTime() + seekStep;
              // Fixes the player not sending the end event if you
              // try to seek past the duration on the seekbar.
              if (seekTime >= duration) {
                seekTime = wasPlaying ? duration - .001 : duration;
              }
              player.currentTime(seekTime);
              if (wasPlaying) {
                player.play();
              }*/
              break;
            case cLeft: // Seek Forward
            	console.log("cLeft!");
                wasPlaying = !player.paused();
                ePreventDefault();
                
                var controlBar = player.controlBar;
                console.log(controlBar);
                var progressControl =controlBar.progressControl;
                var seekBar = controlBar.progressControl.seekBar;
                var seekTimeBar = seekBar.mouseTimeDisplay;
    
                progressControl.handleSeekingMove(0);
                
                break;
            case cRight: // Seek Forward
            	console.log("cRight!");
                wasPlaying = !player.paused();
                ePreventDefault();
                
                var controlBar = player.controlBar;
                console.log(controlBar);
                var progressControl =controlBar.progressControl;
                var seekBar = controlBar.progressControl.seekBar;
                var seekTimeBar = seekBar.mouseTimeDisplay;
    
                progressControl.handleSeekingMove(1);
                
                break;
            // Volume control with the up/down arrow keys
            case cVolumeDown:
              ePreventDefault();
              if (!enableJogStyle) {
                player.volume(player.volume() - volumeStep);
              } else {
                seekTime = player.currentTime() - 1;
                if (player.currentTime() <= 1) {
                  seekTime = 0;
                }
                player.currentTime(seekTime);
              }
              break;
            case cVolumeUp:
              ePreventDefault();
              if (!enableJogStyle) {
                player.volume(player.volume() + volumeStep);
              } else {
                seekTime = player.currentTime() + 1;
                if (seekTime >= duration) {
                  seekTime = duration;
                }
                player.currentTime(seekTime);
              }
              break;

            // Toggle Mute with the M key
            case cMute:
              if (enableMute) {
                player.muted(!player.muted());
              }
              break;

            // Toggle Fullscreen with the F key
            case  cFullscreen:
              if (enableFull) {
                if (player.isFullscreen()) {
                  player.exitFullscreen();
                } else {
                  player.requestFullscreen();
                }
              }
              break;

            default:
              // Number keys from 0-9 skip to a percentage of the video. 0 is 0% and 9 is 90%
             /* if ((ewhich > 47 && ewhich < 59) || (ewhich > 95 && ewhich < 106)) {
                // Do not handle if enableModifiersForNumbers set to false and keys are Ctrl, Cmd or Alt
                if (enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                  if (enableNumbers) {
                    var sub = 48;
                    if (ewhich > 95) {
                      sub = 96;
                    }
                    var number = ewhich - sub;
                    ePreventDefault();
                    player.currentTime(player.duration() * number * 0.1);
                  }
                }
              }*/

              // Handle any custom hotkeys
              for (var customKey in options.customKeys) {
                var customHotkey = options.customKeys[customKey];
                // Check for well formed custom keys
                if (customHotkey && customHotkey.key && customHotkey.handler) {
                  // Check if the custom key's condition matches
                  if (customHotkey.key(event)) {
                    ePreventDefault();
                    customHotkey.handler(player, options, event);
                  }
                }
              }
          }
        }
      }
    };

    var doubleClick = function doubleClick(event) {
      // When controls are disabled, hotkeys will be disabled as well
      if (player.controls()) {

        // Don't catch clicks if any control buttons are focused
        var activeEl = event.relatedTarget || event.toElement || doc.activeElement;
        if (activeEl == pEl ||
            activeEl == pEl.querySelector('.vjs-tech') ||
            activeEl == pEl.querySelector('.iframeblocker')) {

          if (enableFull) {
            if (player.isFullscreen()) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
          }
        }
      }
    };

    var mouseScroll = function mouseScroll(event) {
      // When controls are disabled, hotkeys will be disabled as well
      if (player.controls()) {
        var activeEl = event.relatedTarget || event.toElement || doc.activeElement;
        if (alwaysCaptureHotkeys ||
            activeEl == pEl ||
            activeEl == pEl.querySelector('.vjs-tech') ||
            activeEl == pEl.querySelector('.iframeblocker') ||
            activeEl == pEl.querySelector('.vjs-control-bar')) {

          if (enableVolumeScroll) {
            event = window.event || event;
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            event.preventDefault();

            if (delta == 1) {
              player.volume(player.volume() + volumeStep);
            } else if (delta == -1) {
              player.volume(player.volume() - volumeStep);
            }
          }
        }
      }
    };

    var checkKeys = function checkKeys(e, player) {
      // Allow some modularity in defining custom hotkeys

      // Play/Pause check
      if (options.playPauseKey(e, player)) {
        return cPlay;
      }
   // Play check
      if (options.playKey(e, player)) {
        return cPlaying;
      }
      // Pause check
      if (options.pauseKey(e, player)) {
          return cPause;
        }
   // Pause check
      if (options.stopKey(e, player)) {
          return cStop;
        }
      
      // Seek Backward check
      if (options.rewindKey(e, player)) {
        return cRewind;
      }

      // Seek Forward check
      if (options.forwardKey(e, player)) {
        return cForward;
      }
   // left check
      if (options.leftKey(e, player)) {
        return cLeft;
      }

      // right check
      if (options.rightKey(e, player)) {
        return cRight;
      }
      // up check
      if (options.upKey(e, player)) {
          return cUp;
        }

        // Seek Forward check
        if (options.downKey(e, player)) {
          return cDown;
        }
      // Volume Up check
      if (options.volumeUpKey(e, player)) {
        return cVolumeUp;
      }

      // Volume Down check
      if (options.volumeDownKey(e, player)) {
        return cVolumeDown;
      }

      // Mute check
      if (options.muteKey(e, player)) {
        return cMute;
      }

      // Fullscreen check
      if (options.fullscreenKey(e, player)) {
        return cFullscreen;
      }
    };

    function playPauseKey(e) {
      // Space bar or MediaPlayPause
      return (e.which === 10252 ||e.which === 32 || e.which === 179);
    }
    function playKey(e) {
        // Space bar or MediaPlayPause
        return (e.which === 415 || e.which === 32 );
      }
    function pauseKey(e) {
        // Space bar or MediaPlayPause
        return (e.which === 19 || e.which === 179);
      }
    function stopKey(e) {
    	//
    	return(e.which === 413);
    }
    function rewindKey(e) {
      // Left Arrow or MediaRewind
      return (e.which ===412  );
    }
    function forwardKey(e) {
        // Right Arrow or MediaForward
        return ( e.which ===417 );
      }
    function leftKey(e) {
        // Left Arrow or MediaRewind
        return (e.which === 37 );
      }
    function rightKey(e) {
        // Left Arrow or MediaRewind
        return ( e.which === 39);
      }
    function upKey(e) {
        // Left Arrow or MediaRewind
        return (e.which === 38 );
      }
    function downKey(e) {
        // Left Arrow or MediaRewind
        return ( e.which === 40);
      }
    function volumeUpKey(e) {
      // Up Arrow
      return (e.which === 38);
    }

    function volumeDownKey(e) {
      // Down Arrow
      return (e.which === 40);
    }

    function muteKey(e) {
      // M key
      return (e.which === 77);
    }

    function fullscreenKey(e) {
      // F key
      return (e.which === 70);
    }

    player.on('keydown', keyDown);
    player.on('keyup', keyUp);
    player.on('dblclick', doubleClick);
    player.on('mousewheel', mouseScroll);
    player.on("DOMMouseScroll", mouseScroll);

    return this;
  };

  var registerPlugin = videojs.registerPlugin || videojs.plugin;
  registerPlugin('hotkeys', hotkeys);
}));