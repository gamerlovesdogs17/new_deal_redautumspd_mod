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
      window.renderCongressBoard();
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

  window.congressChamber = 'house';
  window.congressFocusParty = null;

  var congressParties = [
    {
      key: 'dem',
      name: 'Democratic Party',
      shortName: 'DEM',
      className: 'party-dem',
      color: '#2f65a8',
      hSeats: 'spd_h_seats',
      sSeats: 'spd_s_seats',
      hPct: 'spd_h',
      sPct: 'spd_s',
      interaction: 'Sets the New Deal agenda when it can organize the chamber; faction discipline still determines how much of that agenda survives.'
    },
    {
      key: 'spa',
      name: 'Socialist Party of America',
      shortName: 'SPA',
      className: 'party-spa',
      color: '#8B0000',
      hSeats: 'kpd_h_seats',
      sSeats: 'kpd_s_seats',
      hPct: 'kpd_h',
      sPct: 'kpd_s',
      interaction: 'Can supply left votes for labor and relief, but may withhold support if the administration stays too moderate.'
    },
    {
      key: 'fl',
      name: 'Farmer-Labor',
      shortName: 'FL',
      className: 'party-fl',
      color: '#111111',
      hSeats: 'z_h_seats',
      sSeats: 'z_s_seats',
      hPct: 'z_h',
      sPct: 'z_s',
      interaction: 'A pivotal agrarian-labor bloc; farm relief and public works decide whether it bargains with or against the New Deal.'
    },
    {
      key: 'liberty',
      name: 'Liberty League',
      shortName: 'LL',
      className: 'party-liberty',
      color: '#9a7a00',
      hSeats: 'ddp_h_seats',
      sSeats: 'ddp_s_seats',
      hPct: 'ddp_h',
      sPct: 'ddp_s',
      interaction: 'Can cooperate on narrow stabilization, but litigation and business backlash push it toward obstruction.'
    },
    {
      key: 'gop',
      name: 'Republican Party',
      shortName: 'GOP',
      className: 'party-gop',
      color: '#C1121F',
      hSeats: 'dvp_h_seats',
      sSeats: 'dvp_s_seats',
      hPct: 'dvp_h',
      sPct: 'dvp_s',
      interaction: 'The main constitutional opposition; moderate wings bargain, old guard factions obstruct, and national conservatives court reactionary pressure.'
    },
    {
      key: 'nusj',
      name: 'National Union for Social Justice',
      shortName: 'NUSJ',
      className: 'party-nusj',
      color: '#954B00',
      hSeats: 'dnvp_h_seats',
      sSeats: 'dnvp_s_seats',
      hPct: 'dnvp_h',
      sPct: 'dnvp_s',
      interaction: 'Uses radio populism and crisis politics to pressure both parties; unreliable for ordinary coalition government.'
    },
    {
      key: 'silver',
      name: 'Silver Legion',
      shortName: 'SL',
      className: 'party-silver',
      color: '#666666',
      hSeats: 'nsdap_h_seats',
      sSeats: 'nsdap_s_seats',
      hPct: 'nsdap_h',
      sPct: 'nsdap_s',
      interaction: 'An extremist bloc whose legislative presence signals deeper street and militia danger.'
    },
    {
      key: 'other',
      name: 'Other independents',
      shortName: 'OTH',
      className: 'party-other',
      color: '#8f8f8f',
      hSeats: 'other_h_seats',
      sSeats: 'other_s_seats',
      hPct: null,
      sPct: null,
      interaction: 'Small regional and issue members; they matter most when a chamber is close.'
    }
  ];

  function qValue(key, fallback) {
      var q = window.dendryUI && window.dendryUI.dendryEngine ? window.dendryUI.dendryEngine.state.qualities : {};
      var value = q ? q[key] : undefined;
      return (value === undefined || value === null || Number.isNaN(value)) ? fallback : value;
  }

  function chamberTotal(chamber) {
      return chamber == 'senate' ? 96 : 435;
  }

  function chamberMajority(chamber) {
      return chamber == 'senate' ? 49 : 218;
  }

  function chamberLabel(chamber) {
      return chamber == 'senate' ? 'Senate' : 'House';
  }

  function supportEstimate(value) {
      value = value || 0;
      if (value >= 62) return 'secure';
      if (value >= 52) return 'workable';
      if (value >= 45) return 'fragile';
      return 'failing';
  }

  function getPartySeats(party, chamber) {
      var total = chamberTotal(chamber);
      var seatKey = chamber == 'senate' ? party.sSeats : party.hSeats;
      var pctKey = chamber == 'senate' ? party.sPct : party.hPct;
      var seats = qValue(seatKey, null);
      if (seats === null && pctKey) {
          seats = Math.round(total * (qValue(pctKey, 0) || 0) / 100);
      }
      return Math.max(0, Math.round(seats || 0));
  }

  function getCongressData(chamber) {
      var total = chamberTotal(chamber);
      var data = congressParties.map(function(party) {
          var seats = getPartySeats(party, chamber);
          return Object.assign({}, party, {seats: seats});
      });
      var assigned = data.filter(function(party) { return party.key != 'other'; })
          .reduce(function(sum, party) { return sum + party.seats; }, 0);
      var other = data.find(function(party) { return party.key == 'other'; });
      if (other && other.seats <= 0) {
          other.seats = Math.max(0, total - assigned);
      }
      var drift = total - data.reduce(function(sum, party) { return sum + party.seats; }, 0);
      if (drift !== 0 && other) {
          other.seats = Math.max(0, other.seats + drift);
      }
      return data;
  }

  function setCongressFocus(partyKey) {
      window.congressFocusParty = partyKey;
      $('.congress-seat-group').toggleClass('dimmed', !!partyKey);
      $('.congress-seat-group[data-party="' + partyKey + '"]').removeClass('dimmed').addClass('focused');
      $('.congress-seat-group').not('[data-party="' + partyKey + '"]').removeClass('focused');
      $('.congress-legend-item').toggleClass('dimmed', !!partyKey);
      $('.congress-legend-item[data-party="' + partyKey + '"]').removeClass('dimmed').addClass('focused');
      $('.congress-legend-item').not('[data-party="' + partyKey + '"]').removeClass('focused');
      window.updateCongressInfoPanel(partyKey);
  }

  function clearCongressFocus() {
      window.congressFocusParty = null;
      $('.congress-seat-group, .congress-legend-item').removeClass('dimmed focused');
      window.updateCongressInfoPanel(null);
  }

  function renderCongressMap(data, chamber) {
      var svg = document.getElementById('congress_map');
      if (!svg) {
          return;
      }
      var total = chamberTotal(chamber);
      var columns = chamber == 'senate' ? 16 : 29;
      var dotSize = chamber == 'senate' ? 8 : 5.2;
      var gap = chamber == 'senate' ? 4 : 2.4;
      var rows = Math.ceil(total / columns);
      var width = columns * (dotSize + gap) + gap;
      var height = rows * (dotSize + gap) + gap;
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.innerHTML = '';
      var seatIndex = 0;
      data.forEach(function(party) {
          for (var i = 0; i < party.seats && seatIndex < total; i++) {
              var x = gap + (seatIndex % columns) * (dotSize + gap) + dotSize / 2;
              var y = gap + Math.floor(seatIndex / columns) * (dotSize + gap) + dotSize / 2;
              var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
              group.setAttribute('class', 'congress-seat-group');
              group.setAttribute('data-party', party.key);
              group.setAttribute('tabindex', '0');
              group.addEventListener('mouseenter', function() { setCongressFocus(this.getAttribute('data-party')); });
              group.addEventListener('focus', function() { setCongressFocus(this.getAttribute('data-party')); });
              group.addEventListener('mouseleave', clearCongressFocus);
              group.addEventListener('blur', clearCongressFocus);
              var hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              hit.setAttribute('cx', x);
              hit.setAttribute('cy', y);
              hit.setAttribute('r', (dotSize + gap) * 0.55);
              hit.setAttribute('class', 'congress-seat-hit');
              var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              dot.setAttribute('cx', x);
              dot.setAttribute('cy', y);
              dot.setAttribute('r', dotSize / 2);
              dot.setAttribute('fill', party.color);
              dot.setAttribute('class', 'congress-seat');
              group.appendChild(hit);
              group.appendChild(dot);
              svg.appendChild(group);
              seatIndex++;
          }
      });
  }

  function renderCongressLegend(data) {
      var legend = $('#congress_legend');
      if (!legend.length) {
          return;
      }
      legend.empty();
      data.forEach(function(party) {
          if (party.seats <= 0) {
              return;
          }
          var item = $('<button type="button" class="congress-legend-item"></button>');
          item.attr('data-party', party.key);
          item.append($('<span class="congress-swatch"></span>').css('background-color', party.color));
          item.append($('<span></span>').text(party.shortName + ' ' + party.seats));
          item.on('mouseenter focus', function() { setCongressFocus(party.key); });
          item.on('mouseleave blur', clearCongressFocus);
          legend.append(item);
      });
  }

  function branchInfoRows(chamber) {
      if (chamber == 'senate') {
          return [
              ['Control', qValue('non_dem_senate_control', 0) ? 'opposition-led or blocked' : 'Democratic-led'],
              ['Bill coalition', qValue('bill_coalition_viable', 0) ? 'viable' : 'not viable'],
              ['Governing support', supportEstimate(qValue('governing_senate_support', 0))],
              ['Majority line', chamberMajority(chamber) + ' seats'],
              ['Current read', qValue('bill_coalition_viable', 0) ? 'The Senate can carry legislation if coalition discipline holds.' : 'The Senate is the main bottleneck for legislation and appointments.']
          ];
      }
      return [
          ['Control', qValue('non_dem_house_control', 0) ? 'opposition-led or blocked' : 'Democratic-led'],
          ['Speaker', qValue('speaker_elected', 0) ? 'secured' : 'not secured'],
          ['Governing support', supportEstimate(qValue('governing_house_support', 0))],
          ['Majority line', chamberMajority(chamber) + ' seats'],
          ['Current read', qValue('speaker_elected', 0) ? 'The House can organize committees and bring New Deal bills forward.' : 'The House cannot reliably organize leadership, slowing every bill.']
      ];
  }

  window.updateCongressInfoPanel = function(partyKey) {
      var chamber = window.congressChamber || 'house';
      var data = getCongressData(chamber);
      var panel = $('#congress_branch_info');
      if (!panel.length) {
          return;
      }
      var party = data.find(function(p) { return p.key == partyKey; });
      var title = party ? party.name : chamberLabel(chamber);
      var seatLine = party ? party.seats + ' of ' + chamberTotal(chamber) + ' seats' : 'Majority: ' + chamberMajority(chamber) + ' seats';
      panel.empty();
      panel.append($('<h3></h3>').text(title));
      panel.append($('<div class="congress-info-kicker"></div>').text(seatLine));
      if (party) {
          panel.append($('<p></p>').text(party.interaction));
      }
      var rows = $('<div class="congress-info-rows"></div>');
      branchInfoRows(chamber).forEach(function(row) {
          var item = $('<div class="congress-info-row"></div>');
          item.append($('<span></span>').text(row[0]));
          item.append($('<strong></strong>').text(row[1]));
          rows.append(item);
      });
      panel.append(rows);
      panel.append($('<div class="congress-note"></div>').text(party ? 'Hover another bloc to compare pressure points.' : 'Hover a dot or legend item to isolate a party bloc and see how it is likely to behave.'));
  };

  window.setCongressChamber = function(chamber) {
      window.congressChamber = chamber == 'senate' ? 'senate' : 'house';
      $('#congress_house_button').toggleClass('active', window.congressChamber == 'house');
      $('#congress_senate_button').toggleClass('active', window.congressChamber == 'senate');
      window.renderCongressBoard();
  };

  window.renderCongressBoard = function() {
      if (!window.dendryUI || !window.dendryUI.dendryEngine) {
          return;
      }
      var chamber = window.congressChamber || 'house';
      var data = getCongressData(chamber);
      $('#congress_board_subtitle').text(chamberLabel(chamber) + ' composition and governing pressure');
      renderCongressMap(data, chamber);
      renderCongressLegend(data);
      window.updateCongressInfoPanel(null);
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

  function getNotesStorageKey() {
      return TITLE + '_field_notes';
  }

  function getNotesPositionKey() {
      return TITLE + '_field_notes_position';
  }

  function rectsOverlap(a, b) {
      return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  }

  function getBlockedDisplayRects() {
      var selectors = ['#content', '#congress_board', '#stats_sidebar', '#strategy_sidebar', '#music_player', '#options', '#save'];
      var rects = [];
      selectors.forEach(function(selector) {
          var el = document.querySelector(selector);
          if (!el || window.getComputedStyle(el).display == 'none') {
              return;
          }
          rects.push(el.getBoundingClientRect());
      });
      return rects;
  }

  function noteWouldOverlap(left, top) {
      var panel = document.getElementById('field_notes');
      if (!panel) {
          return false;
      }
      var width = panel.offsetWidth;
      var height = panel.offsetHeight;
      var proposed = {left: left, top: top, right: left + width, bottom: top + height};
      return getBlockedDisplayRects().some(function(rect) {
          return rectsOverlap(proposed, rect);
      });
  }

  function applyNotesPosition(left, top, persist) {
      var panel = document.getElementById('field_notes');
      if (!panel) {
          return;
      }
      var maxLeft = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
      var maxTop = Math.max(8, window.innerHeight - panel.offsetHeight - 72);
      var nextLeft = Math.min(Math.max(8, left), maxLeft);
      var nextTop = Math.min(Math.max(8, top), maxTop);
      if (noteWouldOverlap(nextLeft, nextTop)) {
          panel.classList.add('blocked');
          return false;
      }
      panel.classList.remove('blocked');
      panel.style.left = nextLeft + 'px';
      panel.style.top = nextTop + 'px';
      if (persist && typeof localStorage !== 'undefined') {
          localStorage[getNotesPositionKey()] = JSON.stringify({left: nextLeft, top: nextTop});
      }
      return true;
  }

  function restoreNotesPanel() {
      var panel = document.getElementById('field_notes');
      var text = document.getElementById('field_notes_text');
      if (!panel || !text || typeof localStorage === 'undefined') {
          return;
      }
      text.value = localStorage[getNotesStorageKey()] || '';
      var savedPosition = null;
      try {
          savedPosition = JSON.parse(localStorage[getNotesPositionKey()] || 'null');
      } catch (e) {
          savedPosition = null;
      }
      var left = savedPosition && typeof savedPosition.left == 'number' ? savedPosition.left : 18;
      var top = savedPosition && typeof savedPosition.top == 'number' ? savedPosition.top : 128;
      if (!applyNotesPosition(left, top, false)) {
          applyNotesPosition(window.innerWidth - panel.offsetWidth - 18, 128, false);
      }
  }

  window.toggleNotesPanel = function() {
      var panel = document.getElementById('field_notes');
      if (!panel) {
          return;
      }
      panel.style.display = panel.style.display == 'none' || !panel.style.display ? 'block' : 'none';
      if (panel.style.display != 'none') {
          restoreNotesPanel();
          var text = document.getElementById('field_notes_text');
          if (text) {
              text.focus();
          }
      }
  };

  function initializeNotesPanel() {
      var panel = document.getElementById('field_notes');
      var handle = document.getElementById('field_notes_handle');
      var text = document.getElementById('field_notes_text');
      if (!panel || !handle || !text) {
          return;
      }
      restoreNotesPanel();
      text.addEventListener('input', function() {
          if (typeof localStorage !== 'undefined') {
              localStorage[getNotesStorageKey()] = text.value;
          }
      });
      var drag = null;
      handle.addEventListener('mousedown', function(evt) {
          if (evt.target.tagName.toLowerCase() == 'button') {
              return;
          }
          drag = {
              offsetX: evt.clientX - panel.offsetLeft,
              offsetY: evt.clientY - panel.offsetTop,
              lastLeft: panel.offsetLeft,
              lastTop: panel.offsetTop
          };
          evt.preventDefault();
      });
      document.addEventListener('mousemove', function(evt) {
          if (!drag) {
              return;
          }
          var left = evt.clientX - drag.offsetX;
          var top = evt.clientY - drag.offsetY;
          if (applyNotesPosition(left, top, false)) {
              drag.lastLeft = panel.offsetLeft;
              drag.lastTop = panel.offsetTop;
          }
      });
      document.addEventListener('mouseup', function() {
          if (!drag) {
              return;
          }
          applyNotesPosition(drag.lastLeft, drag.lastTop, true);
          drag = null;
      });
      window.addEventListener('resize', function() {
          applyNotesPosition(panel.offsetLeft, panel.offsetTop, true);
      });
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
    initializeNotesPanel();
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());
