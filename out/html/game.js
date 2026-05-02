(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };

  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };
  
  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };
  
  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
      window.syncMusicPlayerState();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
      window.syncMusicPlayerState();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
      window.updateStrategySidebar();
  };

  window.updateStrategySidebar = function() {
      var strategyPanel = $('#strategic_qualities');
      if (!strategyPanel.length) {
          return;
      }
      strategyPanel.empty();
      var scene = dendryUI.game.scenes['status.strategic_dashboard'];
      if (!scene) {
          return;
      }
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      strategyPanel.append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };

  var musicTracks = [
    {
      title: "Brother, Can You Spare a Dime?",
      note: "breadline ballad",
      src: "music/1930_1950/brother_can_you_spare_a_dime.mp3"
    },
    {
      title: "The Boulevard of Broken Dreams",
      note: "late-night dance hall",
      src: "music/1930_1950/the_boulevard_of_broken_dreams.mp3"
    }
  ];
  var currentMusicTrack = 0;

  function getMusicTrackBySrc(src) {
      for (var i = 0; i < musicTracks.length; i++) {
          if (src && src.indexOf(musicTracks[i].src) >= 0) {
              return i;
          }
      }
      return -1;
  }

  function updateMusicDisplay(index, noteOverride) {
      if (musicTracks.length === 0) {
          return;
      }
      currentMusicTrack = ((index % musicTracks.length) + musicTracks.length) % musicTracks.length;
      var track = musicTracks[currentMusicTrack];
      $('#music_track_title').text(track.title);
      $('#music_track_note').text(noteOverride || track.note);
  }

  function playBaseMusicTrack(index, autoplay) {
      if (!window.dendryUI || musicTracks.length === 0) {
          return;
      }
      var trackIndex = ((index % musicTracks.length) + musicTracks.length) % musicTracks.length;
      var track = musicTracks[trackIndex];
      var audio = window.dendryUI.currentAudio;
      if (!audio) {
          audio = new Audio(track.src);
          window.dendryUI.currentAudio = audio;
      } else if (audio.src.indexOf(track.src) < 0) {
          audio.pause();
          audio.src = track.src;
      }
      audio.loop = false;
      audio.volume = Math.min(audio.volume || 0.35, 0.45);
      audio.onended = function() {
          window.shuffleMusicTrack(true);
      };
      window.dendryUI.currentAudioURL = track.src;
      updateMusicDisplay(trackIndex);
      if (autoplay && !window.dendryUI.disable_audio) {
          audio.play().then(function() {
              $('#music_play_button').text('Pause');
          }).catch(function() {
              $('#music_play_button').text('Play');
              $('#music_track_note').text('Click again to start the record.');
          });
      }
  }

  window.syncMusicPlayerState = function() {
      if (!window.dendryUI) {
          return;
      }
      var audio = window.dendryUI.currentAudio;
      var currentTrack = audio ? getMusicTrackBySrc(audio.currentSrc || audio.src) : -1;
      if (currentTrack >= 0) {
          updateMusicDisplay(currentTrack);
      }
      if (window.dendryUI && window.dendryUI.disable_audio) {
          $('#music_play_button').text('Play');
          $('#music_track_note').text('Music disabled in options.');
      } else if (audio && !audio.paused) {
          $('#music_play_button').text('Pause');
      } else {
          $('#music_play_button').text('Play');
      }
  };

  window.toggleMusicPlayer = function() {
      if (!window.dendryUI) {
          return;
      }
      if (window.dendryUI.disable_audio) {
          window.enableAudio();
      }
      var audio = window.dendryUI.currentAudio;
      if (!audio) {
          playBaseMusicTrack(currentMusicTrack, true);
          return;
      }
      if (audio.paused) {
          audio.play().then(function() {
              $('#music_play_button').text('Pause');
              window.syncMusicPlayerState();
          }).catch(function() {
              $('#music_track_note').text('Click again to start the record.');
          });
      } else {
          audio.pause();
          $('#music_play_button').text('Play');
      }
  };

  window.shuffleMusicTrack = function(forcePlay) {
      if (!window.dendryUI) {
          return;
      }
      var audio = window.dendryUI.currentAudio;
      var wasPlaying = forcePlay || (audio && !audio.paused);
      var nextTrack = currentMusicTrack;
      if (musicTracks.length > 1) {
          while (nextTrack === currentMusicTrack) {
              nextTrack = Math.floor(Math.random() * musicTracks.length);
          }
      }
      playBaseMusicTrack(nextTrack, wasPlaying);
      $('#music_play_button').text(wasPlaying ? 'Pause' : 'Play');
  };

  function initializeMusicPlayer() {
      updateMusicDisplay(currentMusicTrack, 'Using the game music channel.');
      window.syncMusicPlayerState();
  }


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    initializeMusicPlayer();
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());
