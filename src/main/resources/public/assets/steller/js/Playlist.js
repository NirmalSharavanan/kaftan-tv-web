var PLAYER = PLAYER || {};
PLAYER.Playlist = function ($, video, options, mainContainer, element, preloader, preloaderAD, myVideo, canPlay, click_ev, params, pw, deviceAgent, agentID, youtube_array, isMobile) 
{
    //constructor
    var self = this;

    this.VIDEO = video;
    this.element = element;
	this.youtube_array = youtube_array;
	//if youtube playlist/channel fill options
	if(options.youtubePlaylistID != "" || options.youtubeChannelID != "")
		options.videos = self.youtube_array;
    this.canPlay = canPlay;
    this.CLICK_EV = click_ev;
	this.params = params;
    this.isMobile = isMobile;
    this.preloader = preloader;
    this.preloaderAD = preloaderAD;
    this.options = options;
    this.mainContainer = mainContainer;
    this.videoid = "VIDEOID";
    this.adStartTime = "ADSTARTTIME";
    this.videoAdPlayed = false;
	this.rand = Math.floor((Math.random() * (options.videos).length) + 0);
    this.ytQuality = options.youtubeQuality;
	this.youtubeSTARTED=false;
    this.deviceAgent = deviceAgent;
    this.agentID = agentID;
    this.YTAPI_onPlayerReady = false;
	this.vimeo_time;
    this.vimeo_duration;
	this.scrollingIsOn = false;
	this.itemHoverOn = false

    this.playlist = $("<div />");
    this.playlistContent= $("<div />");
	this.playlistBar= $("<div />");
	this.playlistBar.addClass("stellar_vp_bg"+" "+this.options.instanceTheme);
	this.playlist.append(this.playlistBar);
	
	this.playlistBarSearch= $("<div />");
	this.playlistBarSearch.addClass("stellar_vp_bg"+" "+this.options.instanceTheme);
	this.playlist.append(this.playlistBarSearch);
	
	this.nextTxtWrapper = $("<div />")
	this.playlistBar.append(this.nextTxtWrapper);
	this.nextTxtWrapper.append('<p class="stellar_vp_nextVideoInPlaylistText stellar_vp_controlsColor'+" "+self.options.instanceTheme+'">' + self.options.nextVideoInPlaylistText + '</p>');
	
	this.countTxtWrapper = $("<div />")
		.addClass("stellar_vp_countTxtWrapper");
	this.countTxtWrapper.append('<p class="stellar_vp_countVideoInPlaylistText stellar_vp_controlsColor'+" "+self.options.instanceTheme+'">' + '1 of 20' + '</p>');
	
	this.controlsBtnsWrapperLeft= $("<div />");
	this.controlsBtnsWrapperLeft.addClass("stellar_vp_controlsBtnsWrapperLeft");
	this.VIDEO.controls.append(this.controlsBtnsWrapperLeft);
	
	this.lastBtnIcon = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-step-forward")
		.attr("id", "stellar_vp_lastBtn")
    
	this.firstBtnIcon = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-step-backward")
		.attr("id", "stellar_vp_firstBtn")

	this.nextBtnIcon = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-step-forward")
		.attr("id", "stellar_vp_nextBtn")
	
	this.nextBtnIcon2 = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-chevron-right")
		.attr("id", "stellar_vp_nextBtn2")
	
	this.previousBtnIcon = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-chevron-left")   
		.attr("id", "stellar_vp_previousBtn")
	
	this.shuffleBtnIcon = $("<span />")
        .attr("aria-hidden","true")
		.attr("id", "stellar_vp_shuffleBtn")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-random")
		.addClass("stellar_vp_playerElement")
		
	this.toggleAutoplayBtnIcon = $("<span />")
        .attr("aria-hidden","true")
		.attr("id", "stellar_vp_toggleAutoplayBtn")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-toggle-on")
		.addClass("stellar_vp_playerElement")
	
	this.searchBtnIcon = $("<span />")
        .attr("aria-hidden","true")
        .addClass("fa-stellar")
        .addClass("stellar-icon-general")
		.addClass("stellar_vp_controlsColor"+" "+this.options.instanceTheme)
        .addClass("fa-stellar-search")
		.attr("id", "stellar_vp_searchBtn")
		
	this.lastBtn = $("<div />")
        .addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.lastBtn.append(this.lastBtnIcon);
	
	this.firstBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.firstBtn.append(this.firstBtnIcon);
	
	this.nextBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.nextBtn.append(this.nextBtnIcon);
	
	this.nextBtn2 = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.nextBtn2.append(this.nextBtnIcon2);

	this.previousBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.previousBtn.append(this.previousBtnIcon);
	
	this.shuffleBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.shuffleBtn.append(this.shuffleBtnIcon);
	
	this.toggleAutoplayBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.toggleAutoplayBtn.append(this.toggleAutoplayBtnIcon);
	
	this.searchBtn = $("<div />")
		.addClass("stellar_vp_controlsBtn")
		.addClass("stellar_vp_playerElement")
    this.searchBtn.append(this.searchBtnIcon);
	
	if(this.options.nextShow)
		this.controlsBtnsWrapperLeft.append(this.nextBtn);
	
	this.playlistControlsBtnsWrapperRight= $("<div />");
	this.playlistBar.append(this.playlistControlsBtnsWrapperRight);
	
	this.playlistControlsBtnsWrapperLeft= $("<div />");
	this.playlistBar.append(this.playlistControlsBtnsWrapperLeft);
	
	this.playlistControlsBtnsWrapperSearch= $("<div />");
	this.playlistBarSearch.append(this.playlistControlsBtnsWrapperSearch);
	
	this.playlistControlsBtnsWrapperRight.append(this.shuffleBtn);
	this.playlistControlsBtnsWrapperRight.append(this.toggleAutoplayBtn);
	
	this.playlistControlsBtnsWrapperLeft.append(this.previousBtn);
	this.playlistControlsBtnsWrapperLeft.append(this.countTxtWrapper);
	this.playlistControlsBtnsWrapperLeft.append(this.nextBtn2);
	
	this.playlistControlsBtnsWrapperSearch.append(this.searchBtn);
	
		
    switch(this.options.playlist){
        case "Right playlist":
			this.playlist.attr('id', 'stellar_vp_playlist');
			this.playlist.addClass("stellar_vp_playlist"+" "+this.options.instanceTheme)
            this.playlistContent.attr('id', self.options.instanceName + 'stellar_vp_playlistContent');
			
			this.playlistBar.addClass("stellar_vp_playlistBar")
			
			this.playlistBarSearch.addClass("stellar_vp_playlistBarSearch")
			this.searchBtn.append('<input type="text" id="stellar_vp_input" class="stellar_vp_themeColorThumbBorder stellar_vp_controlsColor'+ ' '+self.options.instanceTheme+'" placeholder="'+ this.options.playlistSearchText +'">')
			
			this.nextTxtWrapper.addClass("stellar_vp_nextTxtWrapper");
			this.playlistControlsBtnsWrapperSearch.addClass("stellar_vp_playlistControlsBtnsWrapperSearch");
			this.playlistControlsBtnsWrapperRight.addClass("stellar_vp_playlistControlsBtnsWrapperRight");
			this.playlistControlsBtnsWrapperLeft.addClass("stellar_vp_playlistControlsBtnsWrapperLeft");
            break;
        case "Bottom playlist":
            this.playlist.attr('id', 'stellar_vp_playlist_bottom');
			this.playlist.addClass("stellar_vp_playlist"+" "+this.options.instanceTheme)
            this.playlistContent.attr('id', self.options.instanceName + 'stellar_vp_playlistContent_bottom');

			this.playlistBar.addClass("stellar_vp_playlistBar_bottom")
			
			this.playlistBarSearch.addClass("stellar_vp_playlistBarSearch_bottom")
			this.searchBtn.append('<input type="text" id="stellar_vp_input" class="stellar_vp_themeColorThumbBorder stellar_vp_controlsColor'+ ' '+self.options.instanceTheme+'" placeholder="'+ this.options.playlistSearchText +'">')
			
			this.nextTxtWrapper.addClass("stellar_vp_nextTxtWrapper_bottom");
			this.playlistControlsBtnsWrapperSearch.addClass("stellar_vp_playlistControlsBtnsWrapperSearch_bottom");
			this.playlistControlsBtnsWrapperRight.addClass("stellar_vp_playlistControlsBtnsWrapperRight_bottom");
			this.playlistControlsBtnsWrapperLeft.addClass("stellar_vp_playlistControlsBtnsWrapperLeft_bottom");
            break;
    }
    self.videos_array=new Array();
    self.item_array=new Array();
	


    this.vimeoWrapper = $('<div></div>');
    this.vimeoWrapper.attr('id', 'stellar_vp_vimeoWrapper');
    if( self.element)
        self.element.append(self.vimeoWrapper);

    $('#stellar_vp_vimeoWrapper').html('<iframe id="vimeo_video" src="" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
	
    var offsetL=0;
    var offsetT=0;
	
    this.onPlayerReady = function (eventYoutubeReady) {
		self.YTAPI_onPlayerReady = true;
        if(options.videos[self.videoid].videoType=="youtube" || options.videoType=="YouTube")
        {
			self.VIDEO.playButtonScreen.hide();
			
			var startSec;
			if(options.loadRandomVideoOnStart){
				startSec = parseInt(self.videos_array[self.rand].youtubeIDStartSeconds);
				if(startSec == "")
					startSec = 0;
			}
			else{
				startSec = parseInt(self.videos_array[self.videoid].youtubeIDStartSeconds);
				if(startSec == "")
					startSec = 0;
			}
				
			//detect if IE cue first video as youtube
			var ms_ie = false;
			var ua = window.navigator.userAgent;
			var old_ie = ua.indexOf('MSIE ');
			var new_ie = ua.indexOf('Trident/');

			if ((old_ie > -1) || (new_ie > -1)) {
				ms_ie = true;
			}
			if ( ms_ie ) {
				//IE specific code goes here
				if(options.loadRandomVideoOnStart)
					self.VIDEO.youtubePlayer.loadVideoById(self.videos_array[self.rand].youtubeID, startSec);
				else
					self.VIDEO.youtubePlayer.loadVideoById(self.videos_array[self.videoid].youtubeID, startSec);
				self.VIDEO.youtubePlayer.pauseVideo();
			}
			else{
				if(options.loadRandomVideoOnStart)
					self.VIDEO.youtubePlayer.cueVideoById(self.videos_array[self.rand].youtubeID, startSec);
				else
				{
					self.VIDEO.youtubePlayer.cueVideoById(self.videos_array[self.videoid].youtubeID, startSec);
				}
			}
			self.VIDEO.youtubePlayer.setPlaybackQuality(self.ytQuality);
			
			if(options.autoplay){
				if(!self.isMobile.any())
					(self.VIDEO.youtubePlayer).playVideo();
			}
			
            self.VIDEO.resizeAll();

			if(pw){
                if(self.options.videos[0].title!="AD 5 sec + Pieces After Effects project" && self.options.videos[0].title!="Pieces After Effects project" && self.options.videos[0].title!="AD 5 sec + Space Odyssey After Effects Project" && self.options.videos[0].title!="AD 5 sec Swimwear Spring Summer" && self.options.videos[0].title!="i Create" && self.options.videos[0].title!="Swimwear Spring Summer" && self.options.youtubePlaylistID!="PLuFX50GllfgP_mecAi4LV7cYva-WLVnaM" && self.options.videos[0].title!="Google drive video example" && self.options.videos[0].title!="LiveStreaming HLS m3u8 video example" && self.options.videos[0].title!="Youtube 360 VR video"){
					self.VIDEO.pw();
                    if(self.VIDEO.youtubePlayer!= undefined){
                        self.VIDEO.youtubePlayer.stopVideo();
                        self.VIDEO.youtubePlayer.clearVideo();
                        self.VIDEO.youtubePlayer.setSize(1, 1);
                    }
                }
            }
			
			self.popupTimer = setInterval(function(){
					if(self.videos_array[self.videoid].popupAdShow)
						self.VIDEO.enablePopup();
            },1000);
        }
    }
    this.onPlayerStateChange = function (event) {
        var youtube_time = Math.floor(self.VIDEO.youtubePlayer.getCurrentTime());
		self.VIDEO.calculateYoutubeTotalTime(self.VIDEO.youtubePlayer.getDuration());
		if(event.data === 1 && youtube_time==0 ) {
			self.youtubeSTARTED=true;
		}
        if(event.data === 1) {
			//playing
			if(self.isMobile.any())
				self.VIDEO.playButtonScreen.addClass("stellar_vp_playButtonScreenHide");
			
			element.removeClass("vp_paused");
			element.addClass("stellar_vp_playing");
			video.change("stellar_vp_playing");
			self.VIDEO.play();
			
			self._timer = setInterval(function() {
				if(options.videos[self.videoid].videoType=="HTML5" || options.videoType=="HTML5 (self-hosted)")
				return;
				// //progress
				self.progressWidth = (self.VIDEO.youtubePlayer.getCurrentTime()/self.VIDEO.youtubePlayer.getDuration() )*self.VIDEO.videoTrack.width();
				self.VIDEO.videoTrackProgress.css("width", self.progressWidth);
				self.progressIdleWidth = (self.VIDEO.youtubePlayer.getCurrentTime()/self.VIDEO.youtubePlayer.getDuration() )*self.VIDEO.progressIdleTrack.width();
				self.VIDEO.progressIdle.css("width", self.progressIdleWidth);
				// //time
				self.VIDEO.calculateYoutubeElapsedTime(self.VIDEO.youtubePlayer.getCurrentTime());
				
				var endSec = parseInt(self.videos_array[self.videoid].youtubeIDEndSeconds);
				if(endSec == "")
					endSec = 0;
				
				if(parseInt(self.VIDEO.youtubePlayer.getCurrentTime()) == endSec)
				{
					self.VIDEO.youtubePlayer.stopVideo();
				}
				
				// //download
				self.buffered = self.VIDEO.youtubePlayer.getVideoLoadedFraction();
				self.downloadWidth = (self.buffered )*self.VIDEO.videoTrack.width();
				self.VIDEO.videoTrackDownload.css("width", self.downloadWidth);
				self.progressIdleDownloadWidth = (self.buffered)*self.VIDEO.progressIdleTrack.width();
				self.VIDEO.progressIdleDownload.css("width", self.progressIdleDownloadWidth);
				
				if(self.VIDEO.secondsFormat(self.VIDEO.youtubePlayer.getCurrentTime()) == self.videos_array[self.videoid].midrollAD_displayTime)
				{
					if(self.VIDEO.midrollPlayed)
						return
					self.VIDEO.midrollPlayed = true;
					if(self.videos_array[self.videoid].midrollAD==true || self.videos_array[self.videoid].midrollAD=="yes")
					{
						if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
						{
							self.canPlay = true;
							self.video_pathAD = self.videos_array[self.videoid].midroll_mp4;
						}
						self.VIDEO.youtubePlayer.pauseVideo();
						self.VIDEO.loadAD(self.video_pathAD, "midrollActive");
						self.VIDEO.openAD();
					}
				}
				if(self.VIDEO.secondsFormat(self.VIDEO.youtubePlayer.getCurrentTime()) >= self.VIDEO.secondsFormat(self.VIDEO.youtubePlayer.getDuration()-1) && self.VIDEO.youtubePlayer.getDuration()>0)
				{
					if(self.VIDEO.postrollPlayed)
						return
					self.VIDEO.postrollPlayed = true;
					if(self.videos_array[self.videoid].postrollAD==true || self.videos_array[self.videoid].postrollAD=="yes")
					{
						if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
						{
							self.canPlay = true;
							self.video_pathAD = self.videos_array[self.videoid].postroll_mp4;
						}
						self.VIDEO.youtubePlayer.pauseVideo();
						self.VIDEO.loadAD(self.video_pathAD, "postrollActive");
						self.VIDEO.openAD();
					}
				}
			}, 50);   
		}
		else if(event.data === 2) {
			clearInterval(self._timer);
			//paused
			element.addClass("vp_paused");
			element.removeClass("stellar_vp_playing");
			video.change("vp_paused");
			self.VIDEO.pause();
		}
        else if(event.data === 0) {
            //ended
			self.VIDEO.midrollPlayed = false;
			self.VIDEO.postrollPlayed = false;
				self.randEnd = Math.floor((Math.random() * (options.videos).length) + 0);
			
                self.videoAdPlayed=false;
                self.videoid = parseInt(self.videoid)+1;
                if (self.videos_array.length == self.videoid){
                    self.videoid = 0;
                }
                //play next on finish
                if(options.onFinish=="Play next video" && self.VIDEO.toggleAutoplayBtnEnabled)
                {
					if(self.VIDEO.shuffleBtnEnabled){
						self.VIDEO.setPlaylistItem(self.randEnd);
						self.videoid = self.randEnd;
					}
					else{
						self.VIDEO.setPlaylistItem(self.videoid);
					}
					self.VIDEO.playVideoById(self.videoid);
                }
                else if(options.onFinish=="Restart video")
                {
                    if(self.VIDEO.youtubePlayer!= undefined){
                        self.VIDEO.youtubePlayer.seekTo(0);
                        self.VIDEO.youtubePlayer.playVideo();
                    }

                }
                else if(options.onFinish=="Stop video")
                {
					//show poster 2
					if(options.posterImgOnVideoFinish != ""){
						
						self.VIDEO.showPoster2();

						if(options.videos[self.videoid].videoType=="youtube" || options.videoType=="YouTube")
						{
							self.VIDEO.closeAD();
							self.videoAdPlayed=false;
							self.VIDEO.ytWrapper.css({zIndex:501});
							self.VIDEO.ytWrapper.css({visibility:"visible"});
							self.VIDEO.removeHTML5elements();
							
							if(self.VIDEO.youtubePlayer!= undefined){
								
									var startSec = parseInt(self.videos_array[self.videoid].youtubeIDStartSeconds);
									if(startSec == "")
										startSec = 0;
									
								
								self.VIDEO.youtubePlayer.cueVideoById(self.videos_array[self.videoid].youtubeID, startSec);
								if(!self.isMobile.any()){
									(self.VIDEO.youtubePlayer).pauseVideo();
								}
							}
							self.VIDEO.youtubePlayer.setPlaybackQuality(self.ytQuality);
							
						}
					}
                }

        }
        //if prerollAD, play videoad
        if((event.data === 1 && youtube_time==0 )&& ((self.videos_array[self.videoid].prerollAD==true||self.videos_array[self.videoid].prerollAD=="yes") || self.options.showGlobalPrerollAds) ) {
            self.VIDEO.videoAdStarted = true;
            //check if ad played or not
            if(self.videoAdPlayed){
                self.VIDEO.youtubePlayer.playVideo();
            }
            else {
                self.VIDEO.youtubePlayer.pauseVideo();
                if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
                {
                    this.canPlay = true;
					if(options.showGlobalPrerollAds)
						self.video_pathAD = self.VIDEO.globalPrerollAds_arr[self.VIDEO.getGlobalPrerollRandomNumber()]
					else
						self.video_pathAD = self.videos_array[self.videoid].preroll_mp4;
                }
				if(self.VIDEO.poster2Showing)
					return
                self.VIDEO.loadAD(self.video_pathAD, "prerollActive");
                self.VIDEO.openAD();
            }
        }
		else if(event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.CUED){
			self.youtubePLAYING=true;
		}
    }
    function onPauseVimeo(id) {
        //console.log("vimeo paused")
    }
    function onFinishVimeo(id) {
        self.videoAdPlayed=false;
		//console.log("vimeo finished")
		self.randEnd = Math.floor((Math.random() * (options.videos).length) + 0);

        if(options.playlist=="Right playlist" || options.playlist=="Bottom playlist" || options.playlist=="Off")
        {
            self.videoid = parseInt(self.videoid)+1;
            if (self.videos_array.length == self.videoid){
                self.videoid = 0;
            }
            //play next on finish
            if(options.onFinish=="Play next video" && self.toggleAutoplayBtnEnabled)
            {
				if(self.VIDEO.shuffleBtnEnabled){
					self.VIDEO.setPlaylistItem(self.randEnd);
					self.videoid = self.randEnd;
				}
				else{
					self.VIDEO.setPlaylistItem(self.videoid);
				}
				self.VIDEO.playVideoById(self.videoid);
            }
            else if(options.onFinish=="Restart video")
            {
                self.vimeoPlayer.play();

            }
            else if(options.onFinish=="Stop video")
            {
                if(options.posterImgOnVideoFinish != ""){
					self.VIDEO.showPoster2();
				}
            }
        }
		else{
			if(options.onFinish=="Restart video")
            {
                self.vimeoPlayer.play();
            }
            else if(options.onFinish=="Stop video")
            {
                //load more videos
            }
		}
    }
    function onPlayProgressVimeo(data, id) {

        self.vimeo_time = Math.floor(data.seconds);
        self.vimeo_duration = Math.floor(data.duration);
		
        if(self.vimeo_time == 0 && (self.videos_array[self.videoid].prerollAD==true||self.videos_array[self.videoid].prerollAD=="yes")){
            //play ad
            self.VIDEO.videoAdStarted = true;

            if(self.videoAdPlayed){
                self.vimeoPlayer.play();
            }
            else {
                self.vimeoPlayer.pause();
                if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
                {
                    this.canPlay = true;
                    self.video_pathAD = self.videos_array[self.videoid].preroll_mp4;
                }
                self.VIDEO.loadAD(self.video_pathAD, "prerollActive");
                self.VIDEO.openAD();
            }
        }
		
		self.tim = setInterval(function() {
			
			if(options.videos[self.videoid].videoType=="HTML5" || options.videoType=="HTML5 (self-hosted)")
			return;
		
			if(self.VIDEO.secondsFormat(self.vimeo_time) == self.videos_array[self.videoid].midrollAD_displayTime)
			{
				if(self.VIDEO.midrollPlayed)
					return
				self.VIDEO.midrollPlayed = true;
				if(self.videos_array[self.videoid].midrollAD==true || self.videos_array[self.videoid].midrollAD=="yes")
				{
					if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
					{
						self.canPlay = true;
						self.video_pathAD = self.videos_array[self.videoid].midroll_mp4;
					}
					self.vimeoPlayer.pause();
					self.VIDEO.loadAD(self.video_pathAD, "midrollActive");
					self.VIDEO.openAD();
				}
			}
			if(self.VIDEO.secondsFormat(self.vimeo_time) >= self.VIDEO.secondsFormat(self.vimeo_duration-1) && self.vimeo_duration>0)
			{
				if(self.VIDEO.postrollPlayed)
					return
				self.VIDEO.postrollPlayed = true;
				if(self.videos_array[self.videoid].postrollAD==true || self.videos_array[self.videoid].postrollAD=="yes")
				{
					if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
					{
						self.canPlay = true;
						self.video_pathAD = self.videos_array[self.videoid].postroll_mp4;
					}
					self.vimeoPlayer.pause();
					self.VIDEO.loadAD(self.video_pathAD, "postrollActive");
					self.VIDEO.openAD();
				}
			}
		}, 50);
		
		if(self.videos_array[self.videoid].popupAdShow){
            self.VIDEO.enablePopup();
        }
    }

    function addVimeoListeners() {
        self.vimeoIframe = $('#vimeo_video')[0];
        // self.vimeoPlayer = $f(self.vimeoIframe);
		
		self.vimeoPlayer = new Vimeo.Player(self.vimeoIframe);
		
		// When the player is ready, add listeners for pause, finish, and playProgress
        // self.vimeoPlayer.addEvent('ready', function() {
            // console.log("vimeo ready");
			self.vimeoPlayer.on('pause', onPauseVimeo);
			self.vimeoPlayer.on('ended', onFinishVimeo);
			self.vimeoPlayer.on('timeupdate', onPlayProgressVimeo);
			
            // self.vimeoPlayer.addEvent('pause', onPauseVimeo);
            // self.vimeoPlayer.addEvent('finish', onFinishVimeo);
            // self.vimeoPlayer.addEvent('playProgress', onPlayProgressVimeo);
			if(pw){
                if(self.options.videos[0].title!="AD 5 sec + Pieces After Effects project" && self.options.videos[0].title!="Pieces After Effects project" && self.options.videos[0].title!="AD 5 sec + Space Odyssey After Effects Project" && self.options.videos[0].title!="AD 5 sec Swimwear Spring Summer" && self.options.videos[0].title!="i Create" && self.options.videos[0].title!="Swimwear Spring Summer" && self.options.youtubePlaylistID!="PLuFX50GllfgP_mecAi4LV7cYva-WLVnaM" && self.options.videos[0].title!="Google drive video example" && self.options.videos[0].title!="LiveStreaming HLS m3u8 video example" && self.options.videos[0].title!="Youtube 360 VR video"){
					self.VIDEO.pw();
                    self.vimeoWrapper.css({zIndex:0});
                    $('iframe#vimeo_video').attr('src','');
                }
            }
        // });
    }
	function setVimeoSrc() {
		if(!self.isMobile.any()){
			if(options.autoplay){
				if(options.loadRandomVideoOnStart)
					document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.rand].vimeoID+"?autoplay=1?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
				else
					document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.videoid].vimeoID+"?autoplay=1?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
			}
			else{
				if(options.loadRandomVideoOnStart)
					document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.rand].vimeoID+"?autoplay=0?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
				else
					document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.videoid].vimeoID+"?autoplay=0?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
			}
		}
		else{
			if(options.loadRandomVideoOnStart)
				document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.rand].vimeoID+"?autoplay=0?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
			else
				document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+self.videos_array[self.videoid].vimeoID+"?autoplay=0?api=1&player_id=vimeo_video"+"&color="+options.vimeoColor;
		}
	}

    var id=-1;

    $(options.videos).each(function loopingItems()
    {
        id= id+1;
        var obj=
        {
            id: id,
            title:this.title,
            videoType:this.videoType,
            youtubeID:this.youtubeID,
            youtubeIDStartSeconds:this.youtubeIDStartSeconds,
            youtubeIDEndSeconds:this.youtubeIDEndSeconds,
            vimeoID:this.vimeoID,
            video_path_mp4HD:this.mp4HD,
            video_path_mp4SD:this.mp4SD,
            enable_mp4_download:this.enable_mp4_download,
            imageUrl:this.imageUrl,
			imageTimer:this.imageTimer,
            prerollAD:this.prerollAD,
            prerollGotoLink:this.prerollGotoLink,
            preroll_mp4:this.preroll_mp4,
            prerollSkipTimer:this.prerollSkipTimer,
			midrollAD:this.midrollAD,
			midrollAD_displayTime:this.midrollAD_displayTime,
            midrollGotoLink:this.midrollGotoLink,
            midroll_mp4:this.midroll_mp4,
            midrollSkipTimer:this.midrollSkipTimer,
			postrollAD:this.postrollAD,
            postrollGotoLink:this.postrollGotoLink,
            postroll_mp4:this.postroll_mp4,
            postrollSkipTimer:this.postrollSkipTimer,
			popupImg:this.popupImg,
            popupAdShow:this.popupAdShow,
            popupAdStartTime:this.popupAdStartTime,
            popupAdEndTime:this.popupAdEndTime,
            popupAdGoToLink:this.popupAdGoToLink,
            description:this.description,
            thumbnail_image:this.thumbImg,
			info_text: this.info,
			currentTime: this.currentTime
        };
		
        self.videos_array.push(obj);

		self.itemHoverBox = $("<div />");
		self.itemHoverBox.addClass("stellar_vp_itemHoverBox");
		self.itemHoverBox.css({
			opacity:0
		})
		
		self.nowPlayingIndicatorIcon = $("<span />")
			.attr("aria-hidden","true")
			.addClass("stellar_vp_nowPlayingIndicator")
			.addClass("fa-stellar")
			.addClass("stellar_vp_themeColorText")
			.addClass("fa-stellar-play-indicator")
			.attr("id", "stellar_vp_nowPlayingIndicator")
			.hide()
		
		self.itemLeft = $("<div />");
		self.itemLeft.addClass("stellar_vp_itemLeft stellar_vp_themeColorThumbBorder");
		self.i = document.createElement('img');
		self.i.onload = function(){
			self.thumbImageW=this.width;
			self.thumbImageH=this.height;
		}
		self.i.src = obj.thumbnail_image;
		//auto youtube thumbnail
		if(options.videos[id].videoType=="youtube" || options.videoType=="YouTube"){
			if(obj.thumbnail_image == "auto" || obj.thumbnail_image == "")
				self.i.src = "http://img.youtube.com/vi/" + options.videos[id].youtubeID + "/1.jpg"
		}
		self.itemLeft.append(self.i);
		self.itemLeft.append(self.itemHoverBox);
		self.itemLeft.append(self.nowPlayingIndicatorIcon);
		
		
		$(self.i).addClass('stellar_vp_thumbnail_image');
		
        var itemRight = 
		'<div class="stellar_vp_itemRight">'
			+ '<div class="stellar_vp_title stellar_vp_themeColorText">' + obj.title + '</div>'
			+ '<div class="stellar_vp_description stellar_vp_controlsColor'+" "+self.options.instanceTheme+'"> ' + obj.description + '</div>'
		+ '</div>';
		
		var itemRight_bottom = 
		'<div class="stellar_vp_itemRight_bottom">'
			+ '<div class="stellar_vp_title stellar_vp_themeColorText">' + obj.title + '</div>'
			+ '<div class="stellar_vp_description stellar_vp_controlsColor'+" "+self.options.instanceTheme+'"> ' + obj.description + '</div>'
		+ '</div>';

        switch(options.playlist){
            case "Right playlist":
                self.item = $("<div />");
                self.item.addClass("stellar_vp_item").css("top",String(offsetT)+"px");
                self.item_array.push(self.item);
				self.item.addClass("stellar_vp_itemUnselected"+" "+self.options.instanceTheme);
                self.item.append(self.itemLeft);
                self.item.append(itemRight);
                offsetT += 88;
                break;
            case "Bottom playlist":
                self.item = $("<div />");
                self.item.addClass("stellar_vp_item").css("left",String(offsetL)+"px");
                self.item_array.push(self.item);
                self.item.addClass("stellar_vp_itemUnselected"+" "+self.options.instanceTheme);
                self.item.css("display","inline-flex");
                self.item.append(self.itemLeft);
                self.item.append(itemRight_bottom);
                break;
        }
        self.playlistContent.append(self.item);

        //play new video
		if(self.item!=undefined){
			self.item.bind(self.CLICK_EV, function()
			{
				if(self.scrollingIsOn && self.isMobile.any())
					return;
				if(self.preloader)
					self.preloader.stop().animate({opacity:1},0,function(){$(this).show()});
					
				self.videoid = obj.id;
				self.VIDEO.setPlaylistItem(self.videoid);
				self.VIDEO.resetPlayer();
				self.VIDEO.resetPlayerAD();
				self.VIDEO.resizeAll();
				if(options.videos[self.videoid].videoType=="vimeo" || options.videoType=="Vimeo"){
					setVimeoSrc();
					addVimeoListeners()
				}
				self.VIDEO.playVideoById(self.videoid);
				self.youtubeSTARTED=false;
				
				if(pw){
					if(self.options.videos[0].title!="AD 5 sec + Pieces After Effects project" && self.options.videos[0].title!="Pieces After Effects project" && self.options.videos[0].title!="AD 5 sec + Space Odyssey After Effects Project" && self.options.videos[0].title!="AD 5 sec Swimwear Spring Summer" && self.options.videos[0].title!="i Create" && self.options.videos[0].title!="Swimwear Spring Summer" && self.options.youtubePlaylistID!="PLuFX50GllfgP_mecAi4LV7cYva-WLVnaM" && self.options.videos[0].title!="Google drive video example"){
						self.VIDEO.pw();
					}
				}
			});
			self.item.bind('mouseenter', function(){
				$(this).find(".stellar_vp_itemHoverBox").stop().animate({
					// top: 0,
					opacity: 1
				},200,function() {
					// $(this).show();
				});
				$(this).find(".stellar_vp_thumbnail_image").css({
					  '-webkit-transform' : 'scale(' + 1.2 + ')',
					  '-moz-transform'    : 'scale(' + 1.2 + ')',
					  '-ms-transform'     : 'scale(' + 1.2 + ')',
					  '-o-transform'      : 'scale(' + 1.2 + ')',
					  'transform'         : 'scale(' + 1.2 + ')'
					});
			})
			self.item.bind('mouseleave', function(){
				$(this).find(".stellar_vp_itemHoverBox").stop().animate({
					opacity: 0
				},200,function() {
					
				});
				$(this).find(".stellar_vp_thumbnail_image").css({
					  '-webkit-transform' : 'scale(' + 1 + ')',
					  '-moz-transform'    : 'scale(' + 1 + ')',
					  '-ms-transform'     : 'scale(' + 1 + ')',
					  '-o-transform'      : 'scale(' + 1 + ')',
					  'transform'         : 'scale(' + 1 + ')'
					});
			})
		  }
	});
		if(options.loadRandomVideoOnStart)
			self.videoid = self.rand;
		else
			self.videoid = options.playSpecificVideo;
		
		if(self.params.id){
			self.videoid = self.rand = parseInt(self.params.id)
		}
        //play first from playlist
        switch(self.options.playlist){
            case "Right playlist":
				if(options.loadRandomVideoOnStart)
                {
					$(self.item_array[self.rand]).removeClass("stellar_vp_itemUnselected"+" "+this.options.instanceTheme).addClass("stellar_vp_itemSelected"+" "+this.options.instanceTheme);//first selected
					self.item_array[self.rand].find(".stellar_vp_thumbnail_image").removeClass("stellar_vp_thumbnail_image").addClass("stellar_vp_thumbnail_imageSelected");// selected
				}
				else
                {
					$(self.item_array[self.videoid]).removeClass("stellar_vp_itemUnselected"+" "+this.options.instanceTheme).addClass("stellar_vp_itemSelected"+" "+this.options.instanceTheme);//first selected
					self.item_array[self.videoid].find(".stellar_vp_thumbnail_image").removeClass("stellar_vp_thumbnail_image").addClass("stellar_vp_thumbnail_imageSelected");// selected
                }
				break;
            case "Bottom playlist":
				if(options.loadRandomVideoOnStart)
                {
					$(self.item_array[self.rand]).removeClass("stellar_vp_itemUnselected"+" "+this.options.instanceTheme).addClass("stellar_vp_itemSelected"+" "+this.options.instanceTheme);//first selected
					self.item_array[self.rand].find(".stellar_vp_thumbnail_image").removeClass("stellar_vp_thumbnail_image").addClass("stellar_vp_thumbnail_imageSelected");// selected
				}
				else
                {
					$(self.item_array[self.videoid]).removeClass("stellar_vp_itemUnselected"+" "+this.options.instanceTheme).addClass("stellar_vp_itemSelected"+" "+this.options.instanceTheme);//first selected
					self.item_array[self.videoid].find(".stellar_vp_thumbnail_image").removeClass("stellar_vp_thumbnail_image").addClass("stellar_vp_thumbnail_imageSelected");// selected
                }
                break;
        }
		$(self.playlistContent).mCustomScrollbar("scrollTo", self.item_array[self.videoid]);
		
		$(function($) {
			self.mainContainer.find('#stellar_vp_input').on('keyup', function() {
				var input, filter, container, item, text, i;
				input = document.getElementById('stellar_vp_input');
				filter = input.value.toUpperCase();
				container = document.getElementById("mCSB_1_container");
				item = container.getElementsByClassName('stellar_vp_item');
				for (i = 0; i < item.length; i++) {
					text = item[i].getElementsByClassName("stellar_vp_title")[0];
					if (text.innerHTML.toUpperCase().indexOf(filter) > -1) {
						$(item[i]).show();
						$(item[i]).stop().animate({
							opacity:1
						},300);
					} else {
						$(item[i]).stop().animate({
							opacity:0
						},300,function() {
							$(this).hide();
						});
					}
				}
				$(self.playlistContent).mCustomScrollbar("scrollTo","first");
			});
		});
		
		
		
		self.countTxtWrapper.find(".stellar_vp_countVideoInPlaylistText").html(self.videoid+1 + " " + self.options.countVideos + " " + self.item_array.length)

        if(options.videos[self.videoid].videoType=="youtube" || options.videoType=="YouTube")
        {	
			self.VIDEO.imageWrapper.css({zIndex:0});
			self.VIDEO.imageWrapper.css({visibility:"none"});
            self.VIDEO.hideVideoElements();

            self.preloader.stop().animate({opacity:0},0,function(){$(this).hide()});
            self.VIDEO.ytWrapper.css({zIndex:501});
            self.VIDEO.ytWrapper.css({visibility:"visible"});
            self.vimeoWrapper.css({zIndex:0});
        }
        else if(options.videos[self.videoid].videoType=="HTML5" || options.videoType=="HTML5 (self-hosted)")
        {
			self.VIDEO.imageWrapper.css({zIndex:0});
			self.VIDEO.imageWrapper.css({visibility:"none"});
			
            self.VIDEO.ytWrapper.css({zIndex:0});
            self.VIDEO.ytWrapper.css({visibility:"hidden"});
            self.vimeoWrapper.css({zIndex:0});
            if(myVideo.canPlayType && myVideo.canPlayType('video/mp4').replace(/no/, ''))
            {
                this.canPlay = true;
                if(options.loadRandomVideoOnStart){
					switch(options.HTML5VideoQuality){
						case "HD":
							self.video_path = self.videos_array[self.rand].video_path_mp4HD;
						break;
						case "SD":
							self.video_path = self.videos_array[self.rand].video_path_mp4SD;
						break;	
					}
					self.video_pathAD = self.videos_array[self.rand].preroll_mp4;
				}
				else{
					switch(options.HTML5VideoQuality){
						case "HD":
							self.video_path = self.videos_array[self.videoid].video_path_mp4HD;
						break;
						case "SD":
							self.video_path = self.videos_array[self.videoid].video_path_mp4SD;
						break;	
					}
					self.video_pathAD = self.videos_array[self.videoid].preroll_mp4;
				}
            }
            self.VIDEO.load(self.video_path, "0");
        }
        else if(options.videos[self.videoid].videoType=="vimeo" || options.videoType=="Vimeo")
        {
			self.VIDEO.imageWrapper.css({zIndex:0});
			self.VIDEO.imageWrapper.css({visibility:"none"});
			self.VIDEO.hideCustomControls();
			
            self.VIDEO.hideVideoElements();
            self.preloader.stop().animate({opacity:0},700,function(){$(this).hide()});
            self.vimeoWrapper.css({zIndex:501});

            setVimeoSrc();
            addVimeoListeners();
        }
		
		if(options.videos[self.videoid].imageUrl) {
			self.VIDEO.imageWrapper.css({zIndex:502});
			self.VIDEO.imageWrapper.css({visibility:"visible"});
			
			self.VIDEO.imageDisplayed.src = self.videos_array[self.videoid].imageUrl
			
			$(self.VIDEO.imageDisplayed).on("load",function() {
				if(options.autoplay)
					self.VIDEO.setImageTimer();
			});
		}
		
		//play next from playlist
		self.nextBtn.bind(self.CLICK_EV, function()
        {
			//random
			if(self.VIDEO.shuffleBtnEnabled)
			{
				self.VIDEO.generateRandomNumber();
				self.videoid = self.VIDEO.rand;
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			//in order
			else{
				//increase id by one
				self.videoid = self.videoid+1;
				if( self.videoid >= (options.videos).length)
					self.videoid=0;
					
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			self.VIDEO.playVideoById(self.videoid);
		});
		self.nextBtn2.bind(self.CLICK_EV, function()
        {
			//random
			if(self.VIDEO.shuffleBtnEnabled)
			{
				self.VIDEO.generateRandomNumber();
				self.videoid = self.VIDEO.rand;
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			//in order
			else{
				//increase id by one
				self.videoid = self.videoid+1;
				if( self.videoid >= (options.videos).length)
					self.videoid=0;
					
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			self.VIDEO.playVideoById(self.videoid);
		});
		self.previousBtn.bind(self.CLICK_EV, function()
        {
			//random
			if(self.VIDEO.shuffleBtnEnabled)
			{
				self.VIDEO.generateRandomNumber();
				self.videoid = self.VIDEO.rand;
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			//in order
			else{
				//decrease id by one
				self.videoid = self.videoid-1;
				if( self.videoid <0 )
					self.videoid=(options.videos).length-1;
				self.VIDEO.setPlaylistItem(self.videoid);
			}
			self.VIDEO.playVideoById(self.videoid);
		});
		self.shuffleBtn.bind(self.CLICK_EV, function(){
			self.VIDEO.toggleShuffleBtn();
        });
		self.toggleAutoplayBtn.bind(self.CLICK_EV, function(){
			self.VIDEO.toggleAutoplayBtn();
        });
		self.lastBtn.bind(self.CLICK_EV, function(){
			$(self.playlistContent).mCustomScrollbar("scrollTo","last");
        });
		self.firstBtn.bind(self.CLICK_EV, function(){
			$(self.playlistContent).mCustomScrollbar("scrollTo","first");
        });


    self.totalWidth = options.videoPlayerWidth;
    self.totalHeight = options.videoPlayerHeight;

    if(options.playlist=="Right playlist" || options.playlist=="Bottom playlist")
    {
        if( self.element){
            mainContainer.append(self.playlist);
            self.playlist.append(self.playlistContent);
        }
    }
    this.playlistW = this.playlist.width();
    this.playlistH = this.playlist.height();
	
    if(options.playlist=="Right playlist")
    {
        self.playlistContent.css("height",String(offsetT)+"px");

        self.playerWidth = self.totalWidth - self.playlist.width();
        self.playerHeight = self.totalHeight - self.playlist.height();

        self.playlist.css({
            height:"100%",
            top:0
        });
		
		self.playlistContent.height(mainContainer.height()-44-44);
		$(self.playlistContent).mCustomScrollbar({
				axis:"y",
				theme:self.options.playlistScrollType,
				scrollButtons:{enable:true},
				callbacks:{
					onScrollStart:function(){
						//remove click listener
						// console.log("onScrollStart")
						self.scrollingIsOn = true;
					},
					onScroll:function(){
						//add click listener
						// console.log("onScroll (end)")
						self.scrollingIsOn = false;
					}
				}	
		});
    }
    else if(options.playlist=="Bottom playlist")
    {
        self.playlistContent.css("width",String(offsetL)+"px");
        self.playerWidth = self.totalWidth;
        self.playerHeight = self.totalHeight - self.playlist.height();

        self.playlist.css({
            left:0,
            width:"100%",
			bottom:0
        });
		
		self.playlistContent.width(mainContainer.width());
		$(self.playlistContent).mCustomScrollbar({
			axis:"x",
			theme:self.options.playlistScrollType,
			scrollButtons:{enable:true},
			callbacks:{
				onScrollStart:function(){
					//remove click listener
					// console.log("onScrollStart")
					self.scrollingIsOn = true;
				},
				onScroll:function(){
					//add click listener
					// console.log("onScroll (end)")
					self.scrollingIsOn = false;
				}
			},
			advanced:{autoExpandHorizontalScroll:true},
			setHeight: 'auto',
			setWidth: 'auto',
		});
    }
	//scroll to specific video
	$(self.playlistContent).mCustomScrollbar("scrollTo", self.item_array[self.videoid]);
};

//prototype object, public functions
PLAYER.Playlist.prototype = {};

PLAYER.Playlist.prototype.hidePlaylist = function(){
	
	this.playlist.hide();
	
}
PLAYER.Playlist.prototype.showPlaylist = function(){
	
	this.playlist.show();
	
}
PLAYER.Playlist.prototype.resizePlaylist = function(val1, val2){
	
	var self=this;
	switch(this.options.playlist) {
		case 'Right playlist':
			this.playlist.css({
				right:0,
				height:"100%"
			});
			this.playlistContent.css({
				position: "absolute",
				top:44,
				height:self.mainContainer.height()-44,
				width:"100%"
			});
			this.playlistContent.height(this.mainContainer.height()-this.playlistBar.height()-this.playlistBarSearch.height());
			break;
		case 'Bottom playlist':
			this.playlist.css({
				left:0,
				width:"100%",
				bottom:0
			});
			this.playlistContent.height(this.playlist.height()-this.playlistBar.height());
			break;
	}	
}
PLAYER.Playlist.prototype.playYoutube = function(obj_id){

	var startSec = parseInt(this.videos_array[obj_id].youtubeIDStartSeconds);
	if(startSec == "")
		startSec = 0;
	
	if(this.VIDEO.youtubePlayer!= undefined){
		this.VIDEO.youtubePlayer.cueVideoById(this.videos_array[obj_id].youtubeID, this.videos_array[obj_id].youtubeIDStartSeconds);
		this.VIDEO.youtubePlayer.setPlaybackQuality(this.ytQuality);
		this.preloader.hide();
		this.VIDEO.ytWrapper.css({zIndex:501});
		this.VIDEO.ytWrapper.css({visibility:"visible"});
		if(!this.isMobile.any())
			this.VIDEO.youtubePlayer.playVideo();
	}
	this.VIDEO.resizeAll();
	
}
PLAYER.Playlist.prototype.playVimeo = function(obj_id){
	
	this.preloader.hide();
	this.vimeoWrapper.css({zIndex:501});
	if(!this.isMobile.any()){
		document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+this.videos_array[obj_id].vimeoID+"?autoplay=1?api=1&player_id=vimeo_video"+"&color="+this.options.vimeoColor;
	}
	else{
		document.getElementById("vimeo_video").src =self.VIDEO.vimeoProtocol+"://player.vimeo.com/video/"+this.videos_array[obj_id].vimeoID+"?autoplay=0?api=1&player_id=vimeo_video"+"&color="+this.options.vimeoColor;
	}
	
}