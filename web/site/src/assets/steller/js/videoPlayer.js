(function ($) {
	$.fn.Video = function (options, callback) {
		return (new Video(this, options));
	};
	var idleEvents = "mousemove keydown DOMMouseScroll mousewheel mousedown reset.idle";

	var defaults = {
		instanceName: "player1",
		instanceTheme: "dark",
		autohideControls: 5,
		hideControlsOnMouseOut: false,
		playerLayout: "fixedSize",
		playerOrientation: "LTR",
		videoPlayerWidth: 768,
		videoPlayerHeight: 432,
		videoRatio: 16 / 9,
		autoplay: false,
		colorAccent: "#00adef",
		videoAnimationTime: 350,
		playSpecificVideo: 0,
		progressBarThickness: 3,
		progressBarThicknessOnMouseover: 6,
		tooltipFontSize: 12,
		videoPlayerShadow: "effect1",
		loadRandomVideoOnStart: false,
		shuffle: false,
		posterImg: "",
		posterImgOnVideoFinish: "assets/images/images/poster2.jpg",
		onFinish: "Play next video",
		nowPlayingText: true,
		showAllControls: true,
		allowSkipAd: true,
		infoShow: true,
		nextShow: true,
		rewindShow: true,
		qualityShow: true,
		lightBox: false,
		lightBoxAutoplay: false,
		lightBoxThumbnail: "assets/images/images/poster.jpg",
		lightBoxThumbnailWidth: 400,
		lightBoxThumbnailHeight: 220,
		lightBoxCloseOnOutsideClick: true,
		playlist: "Right playlist",
		playlistScrollType: "inset-2",
		playlistBehaviourOnPageload: "opened (default)",
		youtubeControls: "custom controls",
		youtubeSkin: "dark",
		youtubeColor: "red",
		youtubeQuality: "default",
		youtubeShowRelatedVideos: true,
		HTML5VideoQuality: "SD",
		preloadSelfHosted: "none",
		rightClickMenu: true,
		hideVideoSource: false,
		shareShow: true,
		facebookShow: true,
		twitterShow: true,
		googlePlusShow: true,
		facebookShareName: "Stellar video player",
		facebookShareLink: "#",
		facebookShareDescription: "",
		facebookSharePicture: "#",
		twitterText: "Stellar video player",
		twitterLink: "#",
		twitterHashtags: "wordpressvideoplayer",
		twitterVia: "Creative media",
		googlePlus: "#",
		logoShow: true,
		logoClickable: true,
		logoPath: "assets/images/images/logo.png",
		logoGoToLink: "#",
		logoPosition: "bottom-left",
		embedShow: true,
		embedCodeSrc: "www.yourwebsite.com/videoplayer/index.html",
		embedShareLink: "www.yourwebsite.com/videoplayer/index.html",
		showGlobalPrerollAds: false,
		globalPrerollAds: "url1;url2;url3;url4;url5",
		globalPrerollAdsSkipTimer: 5,
		globalPrerollAdsGotoLink: "#",
		advertisementTitle: "Advertisement",
		skipAdvertisementText: "Skip advertisement",
		skipAdText: "You can skip this ad in",
		playBtnTooltipTxt: "Play",
		pauseBtnTooltipTxt: "Pause",
		rewindBtnTooltipTxt: "Rewind",
		downloadVideoBtnTooltipTxt: "Download video",
		qualityBtnOpenedTooltipTxt: "Close quality",
		qualityBtnClosedTooltipTxt: "Select quality",
		muteBtnTooltipTxt: "Mute",
		unmuteBtnTooltipTxt: "Unmute",
		fullscreenBtnTooltipTxt: "Fullscreen",
		exitFullscreenBtnTooltipTxt: "Exit fullscreen",
		infoBtnTooltipTxt: "Show info",
		embedBtnTooltipTxt: "Embed",
		shareBtnTooltipTxt: "Share",
		volumeTooltipTxt: "Volume",
		playlistBtnClosedTooltipTxt: "Show playlist",
		playlistBtnOpenedTooltipTxt: "Hide playlist",
		facebookBtnTooltipTxt: "Share on Facebook",
		twitterBtnTooltipTxt: "Share on Twitter",
		googlePlusBtnTooltipTxt: "Share on Google+",
		lastBtnTooltipTxt: "Go to last",
		firstBtnTooltipTxt: "Go to first",
		nextBtnTooltipTxt: "Next",
		previousBtnTooltipTxt: "Previous",
		playlistSearchText: "Search for media...",
		nextVideoInPlaylistText: "UP NEXT",
		autoplayNextVideoInPlaylistOn: "Autoplay next on",
		autoplayNextVideoInPlaylistOff: "Autoplay next off",
		countVideos: "of",
		shuffleBtnOnTooltipTxt: "Random on",
		shuffleBtnOffTooltipTxt: "Random off",
		embedWindowTitle2: "EMBED PLAYER IN YOUR SITE:",
		embedWindowTitle3: "SHARE CURRENT MEDIA:",
		copyTxt: "Copy",
		copiedTxt: "Copied!",
		youtubePlaylistID: "",
		youtubeChannelID: "",
		videos: []
	};

	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		},
		any: function () {
			return (isMobile.Android() || isMobile.BlackBerry() /*|| isMobile.iOS()*/ || isMobile.Opera() || isMobile.Windows());
		}
	};

	var CLICK_EV = isMobile.any() ? 'touchend' : 'click';
	var START_EV = isMobile.any() ? 'touchstart' : 'mousedown';
	var MOVE_EV = isMobile.any() ? 'touchmove' : 'mousemove';
	var END_EV = isMobile.any() ? 'touchend' : 'mouseup';
	var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize'

	var params = {
		id: null
	}

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var Video = function (parent, options) {
		var self = this;
		this._class = Video;
		this.parent = parent;
		this.parentWidth = this.parent.width();
		this.parentHeight = this.parent.height();
		this.windowWidth = $(window).width();
		this.windowHeight = $(window).height();
		this.options = $.extend({}, defaults, options);
		this.sources = this.options.srcs || this.options.sources;
		this.state = null;
		this._inFullscreen = false;
		this.stretching = false;
		this.infoOn = false;
		this.lightBoxOn = false;
		this.adOn = false;
		this.skipCountOn = false;
		this.skipBoxOn = false;
		this.nextVideoBoxOn = false;
		this.shareOn = false;
		this.videoPlayingAD = false;
		this.embedOn = false;
		pw = false;
		this.loaded = false;
		this.readyList = [];
		this.videoAdStarted = false;
		this.youtubeReady = false;
		this.ADTriggered = false;
		this.volPerc = 1;
		this.html5STARTED = false;
		this.YTAPIReady = false;
		this.isYoutubeAPICreated = false;
		this.ytSkin = this.options.youtubeSkin;
		this.ytColor = this.options.youtubeColor;
		this.ytSkin.toString();
		this.ytColor.toString();
		this.youtubeControls = this.options.youtubeControls;
		this.midrollPlayed = false;
		this.postrollPlayed = false;
		this.prerollActive = true;
		this.midrollActive = false;
		this.postrollActive = false;
		this.qualityBtnEnabled = false;
		this.lightBoxThumbnail;
		this.lightBoxOverlay;
		this.lightBoxInitiated = false;
		this.globalPrerollAds_arr = self.options.globalPrerollAds;
		this.poster2Showing = false;
		this.shareBtnEnabled = false;
		this.embedBtnEnabled = false;
		this.videoAnimationTime = self.options.videoAnimationTime;
		this._isAnimation = false;
		switch (this.options.youtubeShowRelatedVideos) {
			case true:
				self.ytShowRelatedVideos = 1;
				break;
			case false:
				self.ytShowRelatedVideos = 0;
				break;
		}
		this.isMobile = isMobile;

		this.RESIZE_EV = RESIZE_EV;
		this.CLICK_EV = CLICK_EV;
		this.START_EV = START_EV;
		this.MOVE_EV = MOVE_EV;
		this.END_EV = END_EV;

		this.canPlay = false;
		this.myVideo = document.createElement('video');
		self.deviceAgent = navigator.userAgent.toLowerCase();
		self.agentID = self.deviceAgent.match(/(iphone|ipod)/);

		//////////////////////
		////jQuery version////
		//////////////////////
		if (this.options.playerLayout == "fitToBrowser" || options.playerLayout == "fitToBrowser") {
			var videoplayers = $("#Stellar_video_player");
			$.each(videoplayers, function () {
				var fixedCont = $("<div />")
					.addClass("fixedCont")
					.css({
						position: 'fixed',
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						background: '#000000',
						zIndex: 2147483647
					});
				videoplayers.parent().append(fixedCont);
				videoplayers.appendTo(fixedCont);
			})
		}
		this.setupElement();
		this.setupElementAD();

		if (!this.options.rightClickMenu) {
			$("#Stellar_video_player").bind('contextmenu', function () {
				return false;
			});
			$(".Stellar_video_player").bind('contextmenu', function () {
				return false;
			});

			if (this.options.lightBox)
				$(".stellar_vp_mainContainer").bind('contextmenu', function () {
					return false;
				});
		}

		$(options.videos).each(function () {
			if (this.videoType == "youtube")
				self.includeYoutubeAPI = true;
		});

		if (!this.includeYoutubeAPI) {
			this.init();
		} else //youtube single / channel / playlist
		{
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // Include the API inside the page.

			if (this.youtubeControls == "default controls") {
				this.options.posterImg == "";
				this.element.css("visibility", "hidden");
			}

			if (this.options.videoType != "YouTube playlist" && this.options.videoType != undefined) {
				this.options.youtubePlaylistID = "";
			}
			if (this.options.videoType != "YouTube channel" && this.options.videoType != undefined) {
				this.options.youtubeChannelID = "";
			}

			if ((this.options.youtubePlaylistID != "" || this.options.youtubeChannelID != "") /*|| (this.options.videoType=="YouTube playlist")*/ ) {

				var youtubePlaylistID = this.options.youtubePlaylistID;
				var youtubeChannelID = this.options.youtubeChannelID;
				this.url;

				//===YOUTUBE CHANNEL====//
				//https://www.youtube.com/channel/USERNAME
				//var channelURL = 'http://gdata.youtube.com/feeds/api/users/'+youtubeChannelID+'/uploads?alt=json&orderby=published';
				var channelURL = 'https://www.googleapis.com/youtube/v3/search?order=date&maxResults=50&part=snippet&channelId=' + youtubeChannelID + '&key=AIzaSyClbVoeyPLBHb9n6Abm0z-AlrzNKeWLKTc';

				//===YOUTUBE PLAYLIST====//
				// var playListURL = 'http://gdata.youtube.com/feeds/api/playlists/'+youtubePlaylistID+'?v=2&alt=json';
				var playListURL = 'https://www.googleapis.com/youtube/v3/playlistItems?&maxResults=50&part=snippet&playlistId=' + youtubePlaylistID + '&key=AIzaSyClbVoeyPLBHb9n6Abm0z-AlrzNKeWLKTc';

				var videoURL = 'http://www.youtube.com/watch?v=';

				if (youtubePlaylistID != "")
					this.url = playListURL;
				else if (youtubeChannelID != "")
					this.url = channelURL;

				this.id = -1;
				this.youtube_array = new Array();
				this.ads_array = new Array();
				this.data;

				//if jquery
				$(this.options.videos).each(function loopingItems() {
					var obj = {
						prerollAD: this.prerollAD,
						prerollGotoLink: this.prerollGotoLink,
						preroll_mp4: this.preroll_mp4,
						prerollSkipTimer: this.prerollSkipTimer,
						midrollAD: this.midrollAD,
						midrollAD_displayTime: this.midrollAD_displayTime,
						midrollGotoLink: this.midrollGotoLink,
						midroll_mp4: this.midroll_mp4,
						midrollSkipTimer: this.midrollSkipTimer,
						postrollAD: this.postrollAD,
						postrollGotoLink: this.postrollGotoLink,
						postroll_mp4: this.postroll_mp4,
						postrollSkipTimer: this.postrollSkipTimer,
						popupAdShow: this.popupAdShow,
						popupImg: this.popupImg,
						popupAdStartTime: this.popupAdStartTime,
						popupAdEndTime: this.popupAdEndTime,
						popupAdGoToLink: this.popupAdGoToLink
					};
					self.ads_array.push(obj);
				});
				this.requestYTList();
			} else {
				this.init();
				this.waitAPIReady();
			}
		}
	};
	Video.fn = Video.prototype;

	Video.fn.waitAPIReady = function () {
		var self = this;
		var APIIsLoaded = false;
		if (!this.YTAPIReady) {
			if (typeof (YT) != 'undefined' && typeof (YT.Player) != 'undefined') {
				this.YTAPIReady = true;

				if (this.isYoutubeAPICreated) {
					this.createYoutubeInstance();
				} else {
					this.setupYoutubeAPI();
				}
			} else {
				var apiReadyInterval = setInterval(function () {
					if (typeof (YT.Player) == 'function' && !APIIsLoaded) {
						APIIsLoaded = true;
						clearInterval(apiReadyInterval);
						self.waitAPIReady();
					}
				}, 400);

			}
		}
	};

	Video.fn.setupYoutubeAPI = function () {
		var self = this;

		if (this.isYoutubeAPICreated) return;
		this.isYoutubeAPICreated = true;

		if (this.YTAPIReady) {
			this.createYoutubeInstance();
		} else {
			if (!window.onYouTubeIframeAPIReady) {
				window.onYouTubePlayerAPIReady = function () {
					self.YTAPIReady = true;
					self.createYoutubeInstance();
				}
			}
		}
	}

	Video.fn.createYoutubeInstance = function () {

		var self = this;

		if (this.options.youtubeControls == "custom controls") {
			this.youtubePlayer = new YT.Player(this.options.instanceName + 'youtube', {
				height: '100%',
				width: '100%',
				events: {
					'onReady': this._playlist.onPlayerReady,
					'onStateChange': this._playlist.onPlayerStateChange,
					'onPlaybackQualityChange': this.onPlayerPlaybackQualityChange
				},
				playerVars: {
					rel: this.ytShowRelatedVideos,
					wmode: 'transparent',

					controls: 0, //1 default controls, 0 hide controls
					enablejsapi: 1, //1 enables the player to be controlled via IFrame or JavaScript Player API calls
					iv_load_policy: 3, //1 show annotations, 3 hide annotations
					//modestbranding: 1,//1 prevent youtube logo in controlbar, 0 youtube logo displays
					showinfo: 0
					// autohide:1
				}
			});
		} else if (this.options.youtubeControls == "default controls") {
			this.youtubePlayer = new YT.Player(this.options.instanceName + 'youtube', {
				height: '100%',
				width: '100%',
				events: {
					'onReady': this._playlist.onPlayerReady,
					'onStateChange': this._playlist.onPlayerStateChange,
					'onPlaybackQualityChange': this.onPlayerPlaybackQualityChange
				},
				playerVars: {
					theme: this.ytSkin, //light,dark
					color: this.ytColor, //red, white
					rel: this.ytShowRelatedVideos,
					wmode: 'transparent',

					controls: 1, //1 default controls, 0 hide controls
					enablejsapi: 1, //1 enables the player to be controlled via IFrame or JavaScript Player API calls
					iv_load_policy: 3, //1 show annotations, 3 hide annotations
					modestbranding: 0, //1 prevent youtube logo in controlbar, 0 youtube logo displays
					showinfo: 1,
					autohide: 1
				}
			});
		}
	}

	Video.fn.requestYTList = function () {
		var self = this;

		if (self.nextPageToken != undefined)
			url = this.url + "&pageToken=" + self.nextPageToken
		else
			url = this.url

		$.ajax({
			url: url,
			success: function (data) {
				self.data = data;
				self.nextPageToken = data.nextPageToken;

				$.each(data.items, function (i, item) {

					self.id = self.id + 1;
					var feedTitle = item.snippet.title;
					var feedInfo = item.snippet.description;
					var authorName = item.snippet.channelTitle;
					if (self.options.youtubePlaylistID != "")
						var videoID = item.snippet.resourceId.videoId;
					if (self.options.youtubeChannelID != "")
						var videoID = item.id;
					var feedURL = 'https://www.youtube.com/watch?v=' + videoID;

					var thumb;
					if (item.snippet.thumbnails != undefined)
						thumb = item.snippet.thumbnails.default.url;
					else
						thumb = "";

					var _o = {
						prerollAD: false,
						prerollGotoLink: "prerollGotoLink",
						preroll_mp4: "preroll_mp4",
						prerollSkipTimer: "prerollSkipTimer",
						midrollAD: false,
						midrollAD_displayTime: "midrollAD_displayTime",
						midrollGotoLink: "midrollGotoLink",
						midroll_mp4: "midroll_mp4",
						midrollSkipTimer: "midrollSkipTimer",
						postrollAD: false,
						postrollGotoLink: "postrollGotoLink",
						postroll_mp4: "postroll_mp4",
						postrollSkipTimer: "postrollSkipTimer",
						popupAdShow: false,
						popupImg: "popupImg",
						popupAdStartTime: "popupAdStartTime",
						popupAdEndTime: "popupAdEndTime",
						popupAdGoToLink: "popupAdGoToLink"
					};
					self.ads_array.push(_o);

					var obj = {
						id: self.id,
						title: feedTitle,
						videoType: "youtube",
						youtubeID: videoID,
						youtubeIDStartSeconds: "youtubeIDStartSeconds",
						youtubeIDEndSeconds: "youtubeIDEndSeconds",
						video_path_mp4HD: this.mp4HD,
						enable_mp4_download: this.enable_mp4_download,
						prerollAD: self.ads_array[self.id].prerollAD,
						prerollGotoLink: self.ads_array[self.id].prerollGotoLink,
						preroll_mp4: self.ads_array[self.id].preroll_mp4,
						prerollSkipTimer: self.ads_array[self.id].prerollSkipTimer,
						midrollAD: self.ads_array[self.id].midrollAD,
						midrollAD_displayTime: self.ads_array[self.id].midrollAD_displayTime,
						midrollGotoLink: self.ads_array[self.id].midrollGotoLink,
						midroll_mp4: self.ads_array[self.id].midroll_mp4,
						midrollSkipTimer: self.ads_array[self.id].midrollSkipTimer,
						postrollAD: self.ads_array[self.id].postrollAD,
						postrollGotoLink: self.ads_array[self.id].postrollGotoLink,
						postroll_mp4: self.ads_array[self.id].postroll_mp4,
						postrollSkipTimer: self.ads_array[self.id].postrollSkipTimer,
						popupAdShow: self.ads_array[self.id].popupAdShow,
						popupImg: self.ads_array[self.id].popupImg,
						popupAdStartTime: self.ads_array[self.id].popupAdStartTime,
						popupAdEndTime: self.ads_array[self.id].popupAdEndTime,
						popupAdGoToLink: self.ads_array[self.id].popupAdGoToLink,
						description: authorName,
						thumbImg: thumb,
						info: feedInfo
					};
					self.youtube_array.push(obj);
				});

				if (data.nextPageToken != undefined) {
					self.requestYTList();
				} else {
					self.init();
					self.waitAPIReady();
				}
			}
		});
	}
	Video.fn.init = function init() {
		var self = this;

		self.preloader = $("<div />");
		self.preloader.addClass("stellar_vp_preloader");
		self.element.append(self.preloader);

		self.preloaderAD = $("<div />");
		self.preloaderAD.addClass("stellar_vp_preloader");
		self.elementAD.append(self.preloaderAD);

		this.videoElement = $("<video />");
		this.videoElement.addClass("stellar_vp_videoPlayer");
		this.videoElement.attr({
			width: this.options.width,
			height: this.options.height,
			preload: this.options.preloadSelfHosted,
			controls: this.options.controls
		});

		this.videoElementAD = $("<video />");
		this.videoElementAD.addClass("stellar_vp_videoPlayerAD");
		this.videoElementAD.attr({
			width: this.options.width,
			height: this.options.height,
			preload: this.options.preloadSelfHosted,
			controls: this.options.controls
		});

		if (isMobile.iOS()) {
			//enable iOS 10+ video inline
			this.videoElement.attr('playsinline', '').attr('webkit-playsinline', '');
			this.videoElementAD.attr('playsinline', '').attr('webkit-playsinline', '');
			//enable iOS 10+ autoplay
			if (this.options.autoplay) {
				this.videoElement.attr('muted', '')
				this.videoElement.muted = true;
				this.videoElement.attr('autoplay', 'autoplay')
			}
		}

		this.controls = $("<div />");
		this.controls.addClass("stellar_vp_controls");
		this.controls.addClass("stellar_vp_disabled");
		if (this.element)
			this.element.append(this.controls);
		if (!this.options.showAllControls)
			this.controls.hide();

		this.nowPlayingTitle = $("<div />")
			.addClass("stellar_vp_nowPlayingTitle")
			.bind(self.CLICK_EV, function () {
				self.togglePlay();
			});

		this.nowPlayingTitleControlBar = $("<div />")
			.addClass("stellar_vp_nowPlayingTitleControlBar");

		this.controls.addClass("stellar_vp_bg" + " " + this.options.instanceTheme);

		if (!this.options.showAllControls)
			this.nowPlayingTitle.hide();
		if (this.element)
			this.element.append(this.nowPlayingTitle);


		self._playlist = new PLAYER.Playlist($, self, self.options, self.mainContainer, self.element, self.preloader, self.preloaderAD, self.myVideo, this.canPlay, self.CLICK_EV, params, pw, self.deviceAgent, self.agentID, self.youtube_array, self.isMobile);

		if (self.options.playlist == "Right playlist") {
			self.playerWidth = self.options.videoPlayerWidth - self._playlist.playlistW;
			self.playerHeight = self.options.videoPlayerHeight;
		} else if (self.options.playlist == "Bottom playlist") {
			self.playerWidth = self.options.videoPlayerWidth;
			self.playerHeight = self.options.videoPlayerHeight - self._playlist.playlistH;
		} else if (self.options.playlist == "Off") {
			self.playerWidth = self.options.videoPlayerWidth;
			self.playerHeight = self.options.videoPlayerHeight;
		}

		self.playlistWidth = self._playlist.playlistW;

		self.initPlayer();
		self.resize();
		self.resizeAll();
		self.autohideControls();
	};

	Video.fn.initPlayer = function () {
		var self = this;
		this.setupHTML5Video();
		this.setupHTML5VideoAD();

		this.setupEvents();
		this.change("initial");
		this.setupControls();
		this.load();
		this.setupAutoplay();
		this.setupLightBox();
		this.setupElements();

		this.element.bind("idle", $.proxy(this.idle, this));
		this.element.bind("state.videoPlayer", $.proxy(function () {
			this.element.trigger("reset.idle");
		}, this))

		this.secondsFormat = function (sec) {
			if (isNaN(sec)) {
				sec = 0;
			}
			var result = [];

			var minutes = Math.floor(sec / 60);
			if (minutes > 60)
				minutes = minutes % 60
			var hours = Math.floor(sec / 3600);
			var seconds = (sec == 0) ? 0 : (sec % 60)
			seconds = Math.round(seconds);

			//to calclate tooltip time
			var pad = function (num) {
				if (num < 10)
					return "0" + num;
				return num;
			}

			if (hours > 0)
				result.push(pad(hours));

			result.push(pad(minutes));
			result.push(pad(seconds));

			return result.join(":");
		};

		var self = this;

		$(window).resize(function () {
			if (!self._inFullscreen)
				self.resizeAll();
		});

		//resize on browser click
		$(window).bind(this.RESIZE_EV, function (e) {
			self.resizeAll();
		});

		$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (e) {
			self.resize(e);
		});

		this.resize = function (e) {
			if (document.webkitIsFullScreen || document.fullscreenElement || document.mozFullScreen || document.msieFullScreen || document.msFullscreenElement) {
				self._playlist.hidePlaylist();
				self.element.addClass("stellar_vp_fullScreen");
				self.elementAD.addClass("stellar_vp_fullScreen");
				$(self.mainContainer).find(".fa-stellar-desktop-expand").removeClass("fa-stellar-desktop-expand").addClass("fa-stellar-desktop-compress");
				$(self.mainContainer).find(".fa-stellar-desktop-expand-zoom").removeClass("fa-stellar-desktop-expand-zoom").addClass("fa-stellar-desktop-compress");
				$(self.fsEnterADBox).find(".fa-stellar-expandAD").removeClass("fa-stellar-expandAD").addClass("fa-stellar-compressAD");
				self.element.width("100%");
				self.element.height("100%");
				self.elementAD.width("100%");
				self.elementAD.height("100%");
				self.mainContainer.width("100%");
				self.mainContainer.height("100%");
				self.mainContainer.css("position", "fixed");
				self.mainContainer.css("left", 0);
				self.mainContainer.css("top", 0);

				self.rewindBtnWrapper.show();
				self.resizeVideoTrack();

				self.mainContainer.parent().css("position", "");
				self._inFullscreen = true;
			} else {
				self._playlist.showPlaylist();
				self.element.removeClass("stellar_vp_fullScreen");
				self.elementAD.removeClass("stellar_vp_fullScreen");
				$(self.mainContainer).find(".fa-stellar-desktop-compress").removeClass("fa-stellar-desktop-compress").addClass("fa-stellar-desktop-expand");
				$(self.mainContainer).find(".fa-stellar-desktop-compress-zoom").removeClass("fa-stellar-desktop-compress-zoom").addClass("fa-stellar-desktop-expand");
				$(self.fsEnterADBox).find(".fa-stellar-compressAD").removeClass("fa-stellar-compressAD").addClass("fa-stellar-expandAD");
				// self.element.width(self.playerWidth);
				// self.element.height(self.playerHeight);

				// self.elementAD.width(self.playerWidth);
				// self.elementAD.height(self.playerHeight);

				self.mainContainer.css("left", "");
				self.mainContainer.css("top", "");
				if (self.options.playerLayout == "fitToContainer" || self.options.playerLayout == "fitToBrowser") {
					self.mainContainer.width("100%");
					self.mainContainer.height("100%");
				} else if (self.options.playerLayout == "fixedSize") {
					self.mainContainer.width(self.options.videoPlayerWidth);
					self.mainContainer.height(self.options.videoPlayerHeight);
				}
				self.mainContainer.css("position", "absolute");
				self.element.css({
					zIndex: 455558
				});

				if ((self._playlist.videos_array[self._playlist.videoid].prerollAD == true || self._playlist.videos_array[self._playlist.videoid].prerollAD == "yes") || self.options.showGlobalPrerollAds) {
					if (!self._playlist.videoAdPlayed && self.videoAdStarted) {
						self.elementAD.css({
							zIndex: 455559
						});
					} else {
						self.elementAD.css({
							zIndex: 455557
						});
					}
				}
				self.mainContainer.parent().css("zIndex", 1);
				self.mainContainer.css("zIndex", 999999);
				if (this.options.playerLayout == "fitToContainer" || this.options.playerLayout == "fixedSize")
					self.mainContainer.parent().css("position", "relative");
				self._inFullscreen = false;
				self.resizeAll();
				self.setInitialSize();
			}
			self.resizeVideoTrack();
			self.positionOverScreenButtons();
			self.positionLogo();
			self.positionPopup();
			self.positionQualityWindow();
			self.positionShareMask();
			self.resizeBars();
			if (self.options.hideControlsOnMouseOut)
				self.hideControls();

		}
	};
	Video.fn.setInitialSize = function () {
		var self = this;

		if (this._isAnimation)
			return;

		if (this.options.playerLayout == "fitToContainer" || this.options.playerLayout == "fitToBrowser") {
			var height = this.parent.width() / (this.options.videoRatio);
			this.parent.height(height);

			if (this.stretching) {
				if (this.options.playlist == "Right playlist") {
					this.element.width(this.parent.parent().width());
					this.element.height(this._playlist.playlist.height());
				} else if (this.options.playlist == "Bottom playlist") {
					this.element.width(this.parent.parent().width());
					this.element.height(this.mainContainer.height());
				} else if (this.options.playlist == "Off") {
					this.element.width(this.parent.parent().width());
					this.element.height(this.parent.parent().height());
				}
			} else {
				if (this.options.playlist == "Right playlist") {
					this.element.width(this.parent.parent().width() - this._playlist.playlist.width());
					this.element.height(this._playlist.playlist.height());
				} else if (this.options.playlist == "Bottom playlist") {
					this.element.width(this.parent.parent().width());
					this.element.height(this.mainContainer.height() - this._playlist.playlist.height());

				} else if (this.options.playlist == "Off") {
					this.element.width(this.parent.parent().width());
					this.element.height(this.parent.height());
				}
			}

			this.elementAD.width(this.element.width());
			this.elementAD.height(this.element.height());

		} else if (this.options.playerLayout == "fixedSize") {

			if (this.options.playlist == "Right playlist") {
				this.mainContainer.css({
					width: this.newPlayerWidth,
					height: this.newPlayerHeight
				});
				this.element.css({
					width: this.newPlayerWidth,
					height: this.newPlayerHeight
				});
			} else if (this.options.playlist == "Bottom playlist") {
				this.element.width(this.newPlayerWidth);
				this.mainContainer.css({
					width: this.newPlayerWidth,
					height: this.newPlayerHeight
				});
			} else if (this.options.playlist == "Off") {
				this.element.css({
					width: this.newPlayerWidth,
					height: this.newPlayerHeight
				});
				this.mainContainer.css({
					width: this.newPlayerWidth,
					height: this.newPlayerHeight
				});
			}
			if (this.stretching) {
				if (this.options.playlist == "Right playlist")
					this.element.width($(this.mainContainer).width());
				else if (this.options.playlist == "Bottom playlist")
					this.element.height(this.newPlayerHeight);
				else if (this.options.playlist == "Off")
					this.element.width($(this.mainContainer).width());
			} else {
				if (this.options.playlist == "Right playlist") {
					this.element.width($(this.mainContainer).width() - this._playlist.playlist.width());
					this._playlist.resizePlaylist(this.newPlayerWidth, this.newPlayerHeight);
				} else if (this.options.playlist == "Bottom playlist") {
					this.element.height(this.newPlayerHeight - this._playlist.playlistH);
					this._playlist.resizePlaylist(this.newPlayerWidth, this.newPlayerHeight);
				} else if (this.options.playlist == "Off")
					this.element.width($(this.mainContainer).width());
			}

		}
	}
	Video.fn.setupLightBox = function () {
		var self = this;
		///////////////////////
		//// lightbox mode ////
		///////////////////////
		if (this.options.lightBox) {
			this.options.playerLayout = "fixedSize"
			var videoplayers = this.mainContainer.parent();

			$.each(videoplayers, function () {
				self.lightBoxOverlay = $("<div />")
					.addClass("stellar_vp_lightBoxOverlay")
					.hide()
					.css({
						opacity: 0
					})

				self.lightBoxCloseBtnWrapper = $("<div />")
					.addClass("stellar_vp_lightBoxCloseBtnWrapper")
					.addClass("stellar_vp_bg" + " " + self.options.instanceTheme)
					.addClass("stellar_vp_playerElement")
					.bind(self.CLICK_EV, function () {
						self.toggleLightBox();
					});
				self.mainContainer.append(self.lightBoxCloseBtnWrapper)
				self.lightBoxCloseBtn = $("<span />")
					.attr("aria-hidden", "true")
					.attr("id", "stellar_vp_lightBoxCloseBtn")
					.addClass("fa-stellar")
					.addClass("stellar-icon-general")
					.addClass("stellar_vp_controlsColor" + " " + self.options.instanceTheme)
					.addClass("fa-stellar-times")
				self.lightBoxCloseBtnWrapper.append(self.lightBoxCloseBtn);

				self.lightBoxOverlayTransparent = $("<div />")
					.addClass("stellar_vp_lightBoxOverlayTransparent")
					.bind(self.CLICK_EV, function () {
						if (self.options.lightBoxCloseOnOutsideClick)
							self.toggleLightBox();
					})
					.appendTo(self.lightBoxOverlay);


				self.mainContainer.addClass("stellar_vp_lightBoxBorder");

				videoplayers.parent().append(self.lightBoxOverlay);
				self.mainContainer.appendTo(self.lightBoxOverlay);


				self.lightBoxThumbnailWrap = $("<div />")
					.addClass("stellar_vp_lightBoxThumbnailWrap")
					.bind(self.CLICK_EV, function () {
						self.toggleLightBox();
					})
					.css({
						cursor: 'pointer',
						width: self.options.lightBoxThumbnailWidth,
						height: self.options.lightBoxThumbnailHeight
					})
					.appendTo(videoplayers)

				self.lightBoxThumbnail = $('<img class="stellar_vp_lightBoxThumbnail">')
					.attr('src', self.options.lightBoxThumbnail)
					.appendTo(self.lightBoxThumbnailWrap)


				self.lightBoxPlayButton = $("<div />");
				self.lightBoxPlayButton.addClass("stellar_vp_playButtonScreen")
					.attr("aria-hidden", "true")
					.addClass("fa-stellar")
					.addClass("fa-stellar-playScreen" + " " + self.options.instanceTheme)
					.appendTo(self.lightBoxThumbnailWrap)
			})
		}
	}
	Video.fn.setColorAccent = function (colorAccent, btn) {
		var self = this;

		$('.fa-stellar-playScreen').css({
			"color": colorAccent
		});


		if ($(btn).hasClass('fa-stellar-random'))
			$(".fa-stellar-random").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-random-zoom'))
			$(".fa-stellar-random-zoom").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-toggle-off'))
			$(".fa-stellar-toggle-off").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-toggle-on'))
			$(".fa-stellar-toggle-on").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-toggle-off-zoom'))
			$(".fa-stellar-toggle-off-zoom").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-toggle-on-zoom'))
			$(".fa-stellar-toggle-on-zoom").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-cog'))
			$(".fa-stellar-cog").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-cog-zoom'))
			$(".fa-stellar-cog-zoom").css({
				"color": colorAccent
			});

		// if($(btn).hasClass('fa-stellar-chevron-right'))
		// $(".fa-stellar-chevron-right").css({"color":colorAccent});

		// if($(btn).hasClass('fa-stellar-chevron-left'))
		// $(".fa-stellar-chevron-left").css({"color":colorAccent});

		// if($(btn).hasClass('fa-stellar-chevron-right-zoom'))
		// $(".fa-stellar-chevron-right-zoom").css({"color":colorAccent});

		// if($(btn).hasClass('fa-stellar-chevron-left-zoom'))
		// $(".fa-stellar-chevron-left-zoom").css({"color":colorAccent});

		if ($(btn).hasClass('fa-stellar-external-link'))
			$(".fa-stellar-external-link").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-external-link-zoom'))
			$(".fa-stellar-external-link-zoom").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-code'))
			$(".fa-stellar-code").css({
				"color": colorAccent
			});

		if ($(btn).hasClass('fa-stellar-code-zoom'))
			$(".fa-stellar-code-zoom").css({
				"color": colorAccent
			});

		// if($(btn).hasClass('fa-stellar-download'))
		// $(".fa-stellar-download").css({"color":colorAccent});

		// if($(btn).hasClass('fa-stellar-download-zoom'))
		// $(".fa-stellar-download-zoom").css({"color":colorAccent});
	};
	Video.fn.removeColorAccent = function (btn) {
		if ($(btn).hasClass('fa-stellar-random'))
			$(".fa-stellar-random").css("color", "");

		if ($(btn).hasClass('fa-stellar-random-zoom'))
			$(".fa-stellar-random-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-toggle-off'))
			$(".fa-stellar-toggle-off").css("color", "");

		if ($(btn).hasClass('fa-stellar-toggle-off-zoom'))
			$(".fa-stellar-toggle-off-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-toggle-on'))
			$(".fa-stellar-toggle-on").css("color", "");

		if ($(btn).hasClass('fa-stellar-toggle-on-zoom'))
			$(".fa-stellar-toggle-on-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-cog'))
			$(".fa-stellar-cog").css("color", "");

		if ($(btn).hasClass('fa-stellar-cog-zoom'))
			$(".fa-stellar-cog-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-chevron-right'))
			$(".fa-stellar-chevron-right").css("color", "");

		if ($(btn).hasClass('fa-stellar-chevron-right-zoom'))
			$(".fa-stellar-chevron-right-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-chevron-left'))
			$(".fa-stellar-chevron-left").css("color", "");

		if ($(btn).hasClass('fa-stellar-chevron-left-zoom'))
			$(".fa-stellar-chevron-left-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-external-link'))
			$(".fa-stellar-external-link").css("color", "");

		if ($(btn).hasClass('fa-stellar-external-link-zoom'))
			$(".fa-stellar-external-link-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-code'))
			$(".fa-stellar-code").css("color", "");

		if ($(btn).hasClass('fa-stellar-code-zoom'))
			$(".fa-stellar-code-zoom").css("color", "");

		if ($(btn).hasClass('fa-stellar-download'))
			$(".fa-stellar-download").css("color", "");

		if ($(btn).hasClass('fa-stellar-download-zoom'))
			$(".fa-stellar-download-zoom").css("color", "");

	};
	Video.fn.resizeAll = function () {
		var self = this;

		if (self.options.playerLayout == "fitToContainer" || self.options.playerLayout == "fitToBrowser") {
			var height = this.parent.width() / (self.options.videoRatio);
			this.parent.height(height);
			// console.log(this.parent.width())
			// console.log(this.mainContainer.height())

			switch (self.options.playlist) {
				case "Right playlist":
					if (this.stretching) {
						if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
							if (this.parent.width() < 362)
								this.downloadBtnLink.hide();
							else
								this.downloadBtnLink.show();
						}
						this.qualityBtnWrapper.show();
						if (this.parent.width() < 327)
							this.shareBtnWrapper.hide();
						else
							this.shareBtnWrapper.show();
						this.embedBtnWrapper.show();
						this.rewindBtnWrapper.show();
						if (this.parent.width() < 300)
							this.volumeTrackWrapper.css("width", 48)
						else
							this.volumeTrackWrapper.css("width", 62)
					} else {
						if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
							if (this.parent.width() < 665)
								self.downloadBtnLink.hide();
							else
								self.downloadBtnLink.show();
						}
						if (self.options.shareShow) {
							if (this.parent.width() < 626)
								self.shareBtnWrapper.hide();
							else
								self.shareBtnWrapper.show();
						}
						if (self.options.embedShow) {
							if (this.parent.width() < 598)
								self.embedBtnWrapper.hide();
							else
								self.embedBtnWrapper.show();
						}
						if (this.parent.width() < 565)
							self.rewindBtnWrapper.hide();
						else
							self.rewindBtnWrapper.show();

						//resize playlist
						if (this.parent.width() < 522) {
							this.mainContainer.find(".stellar_vp_nextTxtWrapper").hide()
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperRight").hide()
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperLeft").css({
								left: 0
							})
							this._playlist.playlist.css({
								width: 130
							});
							this.mainContainer.find(".stellar_vp_itemRight").hide();
							this.mainContainer.find("#stellar_vp_input").css({
								width: 90
							})
							this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
								width: 90
							})
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperSearch").css({
								left: "50%",
								marginLeft: -45
							})

							if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
								if (this.parent.width() < 492)
									self.downloadBtnLink.hide();
								else
									self.downloadBtnLink.show();
							}
							if (self.options.shareShow) {
								if (this.parent.width() < 460)
									self.shareBtnWrapper.hide();
								else
									self.shareBtnWrapper.show();
							}
							if (self.options.embedShow) {
								if (this.parent.width() < 426)
									self.embedBtnWrapper.hide();
								else
									self.embedBtnWrapper.show();
							}
							this.rewindBtnWrapper.show();

							if (this.parent.width() < 394)
								this.rewindBtnWrapper.hide();
							else
								this.rewindBtnWrapper.show();
							if (this.parent.width() < 360)
								this.qualityBtnWrapper.hide();
							else
								this.qualityBtnWrapper.show();
							if (this.parent.width() < 332)
								this.volumeTrackWrapper.css("width", 48)
							else
								this.volumeTrackWrapper.css("width", 62)
							if (this.parent.width() < 330)
								this._playlist.nextBtn.hide();
							else
								this._playlist.nextBtn.show();
						} else {
							this._playlist.playlist.css({
								width: 300
							});
							this.mainContainer.find(".stellar_vp_nextTxtWrapper").show()
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperRight").show()
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperLeft").css({
								left: 73
							})
							this.mainContainer.find(".stellar_vp_itemRight").show();
							this.mainContainer.find("#stellar_vp_input").css({
								width: 200
							})
							this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
								width: 200
							})
							this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperSearch").css({
								left: "50px",
								marginLeft: ""
							})
						}
					}
					if (this.parent.width() < 522)
						this._playlist.playlist.css({
							width: 130
						});
					else
						this._playlist.playlist.css({
							width: 300
						});
					if (this.mainContainer.height() < 220) {
						this.transformElement(this.playButtonScreen, 0.8, "center center")
						this.transformElement(this.toggleAdPlayBox, 0.8, "center center")
						this.transformElement(this.skipAdCount, 0.8, "bottom right")
						this.transformElement(this.skipAdBox, 0.8, "bottom right")
						this.transformElement(this.nextVideoBox_mask, 0.8, "bottom left")
						this.transformElement(this.qualityWindow_mask, 0.8, "bottom center")
						this.transformElement(this.logoImg, 0.6, "bottom left")
						this.transformElement(this.adImg, 0.6, "center bottom")
						this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 0.6, "top left")
						$(this.nowPlayingTitle).css({
							height: 30
						})
						this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize - 2 + "px", 'important');
					} else {
						this.transformElement(this.playButtonScreen, 1, "center center")
						this.transformElement(this.toggleAdPlayBox, 1, "center center")
						this.transformElement(this.skipAdCount, 1, "bottom right")
						this.transformElement(this.skipAdBox, 1, "bottom right")
						this.transformElement(this.nextVideoBox_mask, 1, "bottom left")
						this.transformElement(this.qualityWindow_mask, 1, "bottom center")
						this.transformElement(this.logoImg, 1, "bottom left")
						this.transformElement(this.adImg, 1, "center bottom")
						this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 1, "top left")
						$(this.nowPlayingTitle).css({
							height: 70
						})
						this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize + "px", 'important');
					}
					break;

				case "Bottom playlist":
					if (this.parent.width() < 580) {
						this.transformElement(this.playButtonScreen, 0.8, "center center")
						this.transformElement(this.toggleAdPlayBox, 0.8, "center center")
						this.transformElement(this.skipAdCount, 0.8, "bottom right")
						this.transformElement(this.skipAdBox, 0.8, "bottom right")
						this.transformElement(this.nextVideoBox_mask, 0.8, "bottom left")
						this.transformElement(this.qualityWindow_mask, 0.8, "bottom center")
						this.transformElement(this.logoImg, 0.6, "bottom left")
						this.transformElement(this.adImg, 0.6, "center bottom")
						this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 0.6, "top left")
						$(this.nowPlayingTitle).css({
							height: 30
						})
						this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize - 2 + "px", 'important');

						$(this._playlist.playlist).css({
							height: 127
						})
						this._playlist.playlistH = $(this._playlist.playlist).height()

						if (this.parent.width() < 448) {
							//resize playlist
							this.mainContainer.find("#stellar_vp_input").css({
								width: 90
							})
							this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
								width: 90
							})
							$(this._playlist.playlist).css({
								height: 92
							})

							this._playlist.playlistH = $(this._playlist.playlist).height()

							this.mainContainer.find(".stellar_vp_itemLeft").css({
								width: 44,
								height: 44
							});
							this.mainContainer.find(".stellar_vp_itemSelected").css({
								width: 74,
								height: 44
							});
							this.mainContainer.find(".stellar_vp_itemUnselected").css({
								width: 74,
								height: 44
							});
							this.mainContainer.find(".stellar_vp_itemRight_bottom").hide();
							this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "100%")
							this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "100%")
							this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "100%")
							this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "100%")

							if (this.options.shareShow) {
								if (this.parent.width() < 330)
									this.shareBtnWrapper.hide();
								else
									this.shareBtnWrapper.show();
							}
							if (this.options.embedShow) {
								if (this.parent.width() < 294)
									this.embedBtnWrapper.hide();
								else
									this.embedBtnWrapper.show();
							}
							if (this.parent.width() < 264)
								this.rewindBtnWrapper.hide();
							else
								this.rewindBtnWrapper.show();
							if (this.parent.width() < 230)
								this.qualityBtnWrapper.hide();
							else
								this.qualityBtnWrapper.show();

							if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
								if (this.parent.width() < 362)
									this.downloadBtnLink.hide();
								else
									this.downloadBtnLink.show();
							}
						} else {
							//original size
							this.mainContainer.find("#stellar_vp_input").css({
								width: 200
							})
							this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
								width: 200
							})

							this._playlist.playlistH = $(this._playlist.playlist).height()

							this.mainContainer.find(".stellar_vp_itemLeft").css({
								width: 80,
								height: 80
							});
							this.mainContainer.find(".stellar_vp_itemSelected").css({
								width: 300,
								height: 86
							});
							this.mainContainer.find(".stellar_vp_itemUnselected").css({
								width: 300,
								height: 86
							});
							this.mainContainer.find(".stellar_vp_itemRight_bottom").show();
							this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "")
							this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "")
							this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "")
							this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "")
						}
					} else {
						this.transformElement(this.playButtonScreen, 1, "center center")
						this.transformElement(this.toggleAdPlayBox, 1, "center center")
						this.transformElement(this.skipAdCount, 1, "bottom right")
						this.transformElement(this.skipAdBox, 1, "bottom right")
						this.transformElement(this.nextVideoBox_mask, 1, "bottom left")
						this.transformElement(this.qualityWindow_mask, 1, "bottom center")
						this.transformElement(this.logoImg, 1, "bottom left")
						this.transformElement(this.adImg, 1, "center bottom")
						this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 1, "top left")
						$(this.nowPlayingTitle).css({
							height: 70
						})
						this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize + "px", 'important');
						//original size
						this.mainContainer.find("#stellar_vp_input").css({
							width: 200
						})
						this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
							width: 200
						})

						this._playlist.playlistH = $(this._playlist.playlist).height()

						this.mainContainer.find(".stellar_vp_itemLeft").css({
							width: 80,
							height: 80
						});
						this.mainContainer.find(".stellar_vp_itemSelected").css({
							width: 300,
							height: 86
						});
						this.mainContainer.find(".stellar_vp_itemUnselected").css({
							width: 300,
							height: 86
						});
						this.mainContainer.find(".stellar_vp_itemRight_bottom").show();
						this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "")
						this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "")
						this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "")
						this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "")

						$(this._playlist.playlist).css({
							height: 146
						})
					}
				case "Off":
					if (this.parent.width() < 289)
						self.rewindBtnWrapper.hide();
					else
						self.rewindBtnWrapper.show();
					break;

			}

			self._playlist.resizePlaylist();

			self.setInitialSize();

			self.resizeVideoTrack();
			self.positionOverScreenButtons();
			self.resizeBars();
			self.positionLogo();
			self.positionPopup();
			self.positionQualityWindow();
			self.positionShareMask();

			self.positionElementsDuringAnimation()
		} else if (self.options.playerLayout == "fixedSize") {

			self.newPlayerWidth = $(window).width() - self.mainContainer.position().left - 48;
			self.newPlayerHeight = self.newPlayerWidth / (self.options.videoPlayerWidth / self.options.videoPlayerHeight);
			// console.log(self.newPlayerWidth, self.newPlayerHeight)

			if (self.newPlayerWidth < self.options.videoPlayerWidth) {
				//lightbox resize
				if (this.options.lightBox) {
					$(self.mainContainer).css({
						position: 'absolute',
						left: 24,
						top: window.innerHeight / 2 - (self.newPlayerHeight / 2) - 10
					})
				}

				switch (self.options.playlist) {
					case "Right playlist":

						if (this.stretching) {
							if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
								if (self.newPlayerWidth < 362)
									this.downloadBtnLink.hide();
								else
									this.downloadBtnLink.show();
							}
							if (this.options.shareShow) {
								if (this.newPlayerWidth < 328)
									this.shareBtnWrapper.hide();
								else
									this.shareBtnWrapper.show();
							}
							if (this.options.embedShow) {
								if (this.newPlayerWidth < 297)
									this.embedBtnWrapper.hide();
								else
									this.embedBtnWrapper.show();
							}
							if (this.newPlayerWidth < 260)
								this.rewindBtnWrapper.hide();
							else
								this.rewindBtnWrapper.show();
							if (this.newPlayerWidth < 231)
								this.qualityBtnWrapper.hide();
							else
								this.qualityBtnWrapper.show();

							this.fsBtnWrapper.show();
						} else {
							if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
								if (this.newPlayerWidth < 665)
									this.downloadBtnLink.hide();
								else
									this.downloadBtnLink.show();
							}
							if (this.options.shareShow) {
								if (this.newPlayerWidth < 626)
									this.shareBtnWrapper.hide();
								else
									this.shareBtnWrapper.show();
							}
							if (this.options.embedShow) {
								if (this.newPlayerWidth < 598)
									this.embedBtnWrapper.hide();
								else
									this.embedBtnWrapper.show();
							}
							if (this.newPlayerWidth < 565)
								this.rewindBtnWrapper.hide();
							else
								this.rewindBtnWrapper.show();

							//playlist resize
							if (this.newPlayerWidth < 522) {
								this.mainContainer.find(".stellar_vp_nextTxtWrapper").hide()
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperRight").hide()
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperLeft").css({
									left: 0
								})
								this._playlist.playlist.css({
									width: 130
								});
								this.mainContainer.find(".stellar_vp_itemRight").hide();
								this.mainContainer.find("#stellar_vp_input").css({
									width: 90
								})
								this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
									width: 90
								})
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperSearch").css({
									left: "50%",
									marginLeft: -45
								})


								if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
									if (self.newPlayerWidth < 492)
										self.downloadBtnLink.hide();
									else
										self.downloadBtnLink.show();
								}
								if (self.options.shareShow) {
									if (self.newPlayerWidth < 460)
										self.shareBtnWrapper.hide();
									else
										self.shareBtnWrapper.show();
								}
								if (self.options.embedShow) {
									if (self.newPlayerWidth < 426)
										self.embedBtnWrapper.hide();
									else
										self.embedBtnWrapper.show();
								}

								if (self.newPlayerWidth < 394)
									this.rewindBtnWrapper.hide();
								else
									this.rewindBtnWrapper.show();
								if (self.newPlayerWidth < 363)
									this.qualityBtnWrapper.hide();
								else
									this.qualityBtnWrapper.show();
								if (self.newPlayerWidth < 330)
									this.fsBtnWrapper.hide();
								else
									this.fsBtnWrapper.show();
							} else {
								this._playlist.playlist.css({
									width: 300
								});
								this.mainContainer.find(".stellar_vp_nextTxtWrapper").show()
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperRight").show()
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperLeft").css({
									left: 73
								})
								this.mainContainer.find(".stellar_vp_itemRight").show();
								this.mainContainer.find("#stellar_vp_input").css({
									width: 200
								})
								this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
									width: 200
								})
								this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperSearch").css({
									left: "50px",
									marginLeft: ""
								})
							}
						}
						if (this.newPlayerWidth < 522)
							this._playlist.playlist.css({
								width: 130
							});
						else
							this._playlist.playlist.css({
								width: 300
							});
						//resizeing height
						if (this.newPlayerHeight < 220) {
							this.transformElement(this.playButtonScreen, 0.8, "center center")
							this.transformElement(this.toggleAdPlayBox, 0.8, "center center")
							this.transformElement(this.skipAdCount, 0.8, "bottom right")
							this.transformElement(this.skipAdBox, 0.8, "bottom right")
							this.transformElement(this.nextVideoBox_mask, 0.8, "bottom left")
							this.transformElement(this.qualityWindow_mask, 0.8, "bottom center")
							this.transformElement(this.logoImg, 0.6, "bottom left")
							this.transformElement(this.adImg, 0.6, "center bottom")
							this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 0.6, "top left")
							$(this.nowPlayingTitle).css({
								height: 30
							})
							this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize - 2 + "px", 'important');
						} else {
							this.transformElement(this.playButtonScreen, 1, "center center")
							this.transformElement(this.toggleAdPlayBox, 1, "center center")
							this.transformElement(this.skipAdCount, 1, "bottom right")
							this.transformElement(this.skipAdBox, 1, "bottom right")
							this.transformElement(this.nextVideoBox_mask, 1, "bottom left")
							this.transformElement(this.qualityWindow_mask, 1, "bottom center")
							this.transformElement(this.logoImg, 1, "bottom left")
							this.transformElement(this.adImg, 1, "center bottom")
							this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 1, "top left")
							$(this.nowPlayingTitle).css({
								height: 70
							})
							this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize + "px", 'important');
						}
						break;

					case "Bottom playlist":

						if (this.newPlayerWidth < 580) {
							this.transformElement(this.playButtonScreen, 0.8, "center center")
							this.transformElement(this.toggleAdPlayBox, 0.8, "center center")
							this.transformElement(this.skipAdCount, 0.8, "bottom right")
							this.transformElement(this.skipAdBox, 0.8, "bottom right")
							this.transformElement(this.nextVideoBox_mask, 0.8, "bottom left")
							this.transformElement(this.qualityWindow_mask, 0.8, "bottom center")
							this.transformElement(this.logoImg, 0.6, "bottom left")
							this.transformElement(this.adImg, 0.6, "center bottom")
							this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 0.6, "top left")
							$(this.nowPlayingTitle).css({
								height: 30
							})
							this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize - 2 + "px", 'important');

							$(this._playlist.playlist).css({
								height: 127
							})
							this._playlist.playlistH = $(this._playlist.playlist).height()

							if (this.newPlayerWidth < 448) {
								//resize playlist
								this.mainContainer.find("#stellar_vp_input").css({
									width: 90
								})
								this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
									width: 90
								})
								$(this._playlist.playlist).css({
									height: 92
								})

								this._playlist.playlistH = $(this._playlist.playlist).height()

								this.mainContainer.find(".stellar_vp_itemLeft").css({
									width: 44,
									height: 44
								});
								this.mainContainer.find(".stellar_vp_itemSelected").css({
									width: 74,
									height: 44
								});
								this.mainContainer.find(".stellar_vp_itemUnselected").css({
									width: 74,
									height: 44
								});
								this.mainContainer.find(".stellar_vp_itemRight_bottom").hide();
								this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "100%")
								this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "100%")
								this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "100%")
								this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "100%")

								if (this.options.shareShow) {
									if (this.newPlayerWidth < 330)
										this.shareBtnWrapper.hide();
									else
										this.shareBtnWrapper.show();
								}
								if (this.options.embedShow) {
									if (this.newPlayerWidth < 294)
										this.embedBtnWrapper.hide();
									else
										this.embedBtnWrapper.show();
								}
								if (this.newPlayerWidth < 264)
									this.rewindBtnWrapper.hide();
								else
									this.rewindBtnWrapper.show();
								if (this.newPlayerWidth < 230)
									this.qualityBtnWrapper.hide();
								else
									this.qualityBtnWrapper.show();

								if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
									if (this.newPlayerWidth < 362)
										this.downloadBtnLink.hide();
									else
										this.downloadBtnLink.show();
								}
							} else {
								//original size
								this.mainContainer.find("#stellar_vp_input").css({
									width: 200
								})
								this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
									width: 200
								})

								this._playlist.playlistH = $(this._playlist.playlist).height()

								this.mainContainer.find(".stellar_vp_itemLeft").css({
									width: 80,
									height: 80
								});
								this.mainContainer.find(".stellar_vp_itemSelected").css({
									width: 300,
									height: 86
								});
								this.mainContainer.find(".stellar_vp_itemUnselected").css({
									width: 300,
									height: 86
								});
								this.mainContainer.find(".stellar_vp_itemRight_bottom").show();
								this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "")
								this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "")
								this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "")
								this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "")
							}
						} else {
							this.transformElement(this.playButtonScreen, 1, "center center")
							this.transformElement(this.toggleAdPlayBox, 1, "center center")
							this.transformElement(this.skipAdCount, 1, "bottom right")
							this.transformElement(this.skipAdBox, 1, "bottom right")
							this.transformElement(this.nextVideoBox_mask, 1, "bottom left")
							this.transformElement(this.qualityWindow_mask, 1, "bottom center")
							this.transformElement(this.logoImg, 1, "bottom left")
							this.transformElement(this.adImg, 1, "center bottom")
							this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 1, "top left")
							$(this.nowPlayingTitle).css({
								height: 70
							})
							this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize + "px", 'important');
						}
						break;

					case "Off":

						if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
							if (self.newPlayerWidth < 320)
								this.downloadBtnLink.hide();
							else
								this.downloadBtnLink.show();
						}
						if (self.newPlayerWidth < 290)
							this.rewindBtnWrapper.hide();
						else
							this.rewindBtnWrapper.show();
						if (self.options.embedShow) {
							if (self.newPlayerWidth < 560)
								self.embedBtn.hide();
							else
								self.embedBtn.show();
						}
						//resizeing height
						if (this.newPlayerHeight < 190) {
							$(this.playButtonScreen).css({
								'-webkit-transform': 'scale(' + .8 + ')',
								'-moz-transform': 'scale(' + .8 + ')',
								'-ms-transform': 'scale(' + .8 + ')',
								'-o-transform': 'scale(' + .8 + ')',
								'transform': 'scale(' + .8 + ')'
							});
							$(this.toggleAdPlayBox).css({
								'-webkit-transform': 'scale(' + .8 + ')',
								'-moz-transform': 'scale(' + .8 + ')',
								'-ms-transform': 'scale(' + .8 + ')',
								'-o-transform': 'scale(' + .8 + ')',
								'transform': 'scale(' + .8 + ')'
							});
							$(this.skipAdCount).css({
								'-webkit-transform': 'scale(' + .6 + ')',
								'-moz-transform': 'scale(' + .6 + ')',
								'-ms-transform': 'scale(' + .6 + ')',
								'-o-transform': 'scale(' + .6 + ')',
								'transform': 'scale(' + .6 + ')',
								'transform-origin': 'bottom right'
							});
							$(this.skipAdBox).css({
								'-webkit-transform': 'scale(' + .6 + ')',
								'-moz-transform': 'scale(' + .6 + ')',
								'-ms-transform': 'scale(' + .6 + ')',
								'-o-transform': 'scale(' + .6 + ')',
								'transform': 'scale(' + .6 + ')',
								'transform-origin': 'bottom right'
							});
						} else {
							$(this.playButtonScreen).css({
								'-webkit-transform': 'scale(' + 1 + ')',
								'-moz-transform': 'scale(' + 1 + ')',
								'-ms-transform': 'scale(' + 1 + ')',
								'-o-transform': 'scale(' + 1 + ')',
								'transform': 'scale(' + 1 + ')'
							});
							$(this.toggleAdPlayBox).css({
								'-webkit-transform': 'scale(' + 1 + ')',
								'-moz-transform': 'scale(' + 1 + ')',
								'-ms-transform': 'scale(' + 1 + ')',
								'-o-transform': 'scale(' + 1 + ')',
								'transform': 'scale(' + 1 + ')'
							});
							$(this.skipAdCount).css({
								'-webkit-transform': 'scale(' + 1 + ')',
								'-moz-transform': 'scale(' + 1 + ')',
								'-ms-transform': 'scale(' + 1 + ')',
								'-o-transform': 'scale(' + 1 + ')',
								'transform': 'scale(' + 1 + ')',
								'transform-origin': 'bottom right'
							});
							$(this.skipAdBox).css({
								'-webkit-transform': 'scale(' + 1 + ')',
								'-moz-transform': 'scale(' + 1 + ')',
								'-ms-transform': 'scale(' + 1 + ')',
								'-o-transform': 'scale(' + 1 + ')',
								'transform': 'scale(' + 1 + ')',
								'transform-origin': 'bottom right'
							});
						}
						if (self.options.embedShow) {
							if (self.newPlayerHeight < 159)
								this.embedBtn.hide();
							else
								this.embedBtn.show();
						}
						if (self.options.shareShow) {
							if (self.newPlayerHeight < 123)
								this.shareBtn.hide();
							else
								this.shareBtn.show();
						}
						break;
				}
			} else {
				//lightbox resize
				if (this.options.lightBox) {
					$(self.mainContainer).css({
						position: 'absolute',
						left: window.innerWidth / 2 - (self.options.videoPlayerWidth / 2),
						top: window.innerHeight / 2 - (self.options.videoPlayerHeight / 2) - 10
					})
				}
				//initial fixed size
				self.newPlayerWidth = self.options.videoPlayerWidth;
				self.newPlayerHeight = self.options.videoPlayerHeight;
				////////////////////////////////
				/////show all init buttons//////
				////////////////////////////////
				this.showAllInitButtons()

			}
			self._playlist.resizePlaylist();

			self.setInitialSize();

			if (self.youtubePlayer != undefined) {
				if (self._inFullscreen) {
					self.element.width($(document).width());
					self.element.height($(document).height());
				}
				self.youtubePlayer.setSize("100%", "100%");
			}
			if (this.options.lightBox) {
				$(this.mainContainerBG).css({
					width: $(self.mainContainer).width() + 20,
					height: $(self.mainContainer).height() + 20
				})
			}

			if (self.options.infoShow) {
				$(self.infoWindow).find(".stellar_vp_infoText").css({
					'max-height': $(self.mainContainer).height() - 94 - self.controls.height()
				})
			}

			self.positionElementsDuringAnimation()

		}
	};
	Video.fn.positionElementsDuringAnimation = function () {
		this.positionShareMask()
		this.resizeVideoTrack();
		this.positionOverScreenButtons();
		this.resizeBars();
		this.positionLogo();
		this.positionPopup();
		this.positionQualityWindow();
		this.positionVolumeTrackWrapper()
		//adjust ads size to main video size
		this.elementAD.width(this.element.width());
		this.elementAD.height(this.element.height());
	}
	Video.fn.transformElement = function (element, scale, origin) {
		$(element).css({
			'-webkit-transform': 'scale(' + scale + ')',
			'-moz-transform': 'scale(' + scale + ')',
			'-ms-transform': 'scale(' + scale + ')',
			'-o-transform': 'scale(' + scale + ')',
			'transform': 'scale(' + scale + ')',
			'transform-origin': origin
		});
	}
	Video.fn.showAllInitButtons = function () {
		var self = this;
		this.rewindBtnWrapper.show();
		this.qualityBtnWrapper.show();
		if (this.options.shareShow)
			this.shareBtnWrapper.show();
		else
			this.shareBtnWrapper.hide();
		if (this.options.embedShow)
			this.embedBtnWrapper.show();
		else
			this.embedBtnWrapper.hide();
		if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes")
			this.downloadBtnLink.show();
		this.mainContainer.find(".stellar_vp_nextTxtWrapper").show()
		this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperRight").show()
		this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperLeft").css({
			left: 73
		})

		this.transformElement(this.playButtonScreen, 1, "center center")
		this.transformElement(this.toggleAdPlayBox, 1, "center center")
		this.transformElement(this.skipAdCount, 1, "bottom right")
		this.transformElement(this.skipAdBox, 1, "bottom right")
		this.transformElement(this.nextVideoBox_mask, 1, "bottom left")
		this.transformElement(this.qualityWindow_mask, 1, "bottom center")
		this.transformElement(this.logoImg, 1, "bottom left")
		this.transformElement(this.adImg, 1, "center bottom")
		this.transformElement(this.nowPlayingTitle.find(".stellar_vp_nowPlayingText"), 1, "top left")

		$(this.nowPlayingTitle).css({
			height: 70
		})

		if (this.options.playlist == "Right playlist") {
			// this._playlist.playlist.css({width:300});
			if (this.newPlayerWidth < 522)
				this._playlist.playlist.css({
					width: 130
				});
			else
				this._playlist.playlist.css({
					width: 300
				});
			this.mainContainer.find("#stellar_vp_input").css({
				width: 200
			})
			this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
				width: 200
			})
			this.mainContainer.find(".stellar_vp_playlistControlsBtnsWrapperSearch").css({
				left: "50px",
				marginLeft: ""
			})
		}
		if (this.options.playlist == "Bottom playlist") {
			$(this._playlist.playlist).css({
				height: 146
			})
		}
		this._playlist.playlistH = $(this._playlist.playlist).height()
		this.mainContainer.find("#stellar_vp_input").css({
			width: 200
		})
		this.mainContainer.find(".stellar_vp_playlistBarSearch_bottom").css({
			width: 200
		})
		this.mainContainer.find(".stellar_vp_itemLeft").css({
			width: 80,
			height: 80
		});
		this.mainContainer.find(".stellar_vp_itemSelected").css({
			width: 300,
			height: 86
		});
		this.mainContainer.find(".stellar_vp_itemUnselected").css({
			width: 300,
			height: 86
		});
		this.mainContainer.find(".stellar_vp_itemRight_bottom").show();
		this.mainContainer.find(".stellar_vp_thumbnail_image").css("height", "")
		this.mainContainer.find(".stellar_vp_thumbnail_imageSelected").css("height", "")
		this.mainContainer.find(".stellar_vp_itemHoverBox").css("height", "")
		this.mainContainer.find(".stellar_vp_itemHoverBox").css("width", "")

		this.mainContainer.find(".stellar_vp_itemRight").show();
		this.toolTip[0].style.setProperty('font-size', this.options.tooltipFontSize + "px", 'important');
	}
	Video.fn.autohideControls = function () {
		var element = this.element;
		var idle = false;
		var timeout = this.options.autohideControls * 1000;
		var interval = 1000;
		var timeFromLastEvent = 0;

		var reset = function () {
			if (idle)
				element.trigger("idle", false);
			idle = false;
			timeFromLastEvent = 0;
		};

		var check = function () {
			if (timeFromLastEvent >= timeout) {
				reset();
				idle = true;
				element.trigger("idle", true);
			} else {
				timeFromLastEvent += interval;
			}
		};

		element.bind(idleEvents, reset);

		var loop = setInterval(check, interval);

		element.on("unload", function () {
			clearInterval(loop);
		});
	};
	Video.fn.resizeBars = function () {

		if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube") {
			if (this.youtubePlayer != undefined && this._playlist.youtubeSTARTED) {
				//progress
				this.progressWidth = (this.youtubePlayer.getCurrentTime() / this.youtubePlayer.getDuration()) * this.videoTrack.width();
				this.videoTrackProgress.css("width", this.progressWidth);
				this.progressIdleWidth = (this.youtubePlayer.getCurrentTime() / this.youtubePlayer.getDuration()) * this.progressIdleTrack.width();
				this.progressIdle.css("width", this.progressIdleWidth);
				//download
				this.buffered = this.youtubePlayer.getVideoLoadedFraction();
				this.downloadWidth = (this.buffered) * this.videoTrack.width();
				this.videoTrackDownload.css("width", this.downloadWidth);
				this.progressIdleDownloadWidth = (this.buffered) * this.progressIdleTrack.width();
				this.progressIdleDownload.css("width", this.progressIdleDownloadWidth);
			}
		} else if (this._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || this.options.videoType == "HTML5 (self-hosted)") {
			this.downloadWidth = (this.buffered / this.video.duration) * this.videoTrack.width();
			this.videoTrackDownload.css("width", this.downloadWidth);

			this.progressWidth = (this.video.currentTime / this.video.duration) * this.videoTrack.width();
			this.videoTrackProgress.css("width", this.progressWidth);

			this.progressIdleDownloadWidth = (this.buffered / this.video.duration) * this.progressIdleTrack.width();
			this.progressIdleDownload.css("width", this.progressIdleDownloadWidth);

			this.progressIdleWidth = (this.video.currentTime / this.video.duration) * this.progressIdleTrack.width();
			this.progressIdle.css("width", this.progressIdleWidth);

			this.progressWidthAD = (this.videoAD.currentTime / this.videoAD.duration) * this.elementAD.width();
			this.progressAD.css("width", this.progressWidthAD);
		}
	};
	Video.fn.createPopup = function () {
		var self = this;
		//popup ads
		this.adImg = $("<div/>");
		this.adImg.addClass("stellar_vp_popup");

		this.image = new Image();
		this.image.src = this._playlist.videos_array[this._playlist.videoid].popupImg;

		$(this.image).on("load", function () {
			self.adImg.append(self.image);
			self.positionPopup();
			self.adImg.append(self.adClose);
		});
		this.element.append(this.adImg);
		this.adImg.hide();
		this.adImg.css({
			opacity: 0
		});
		this.popupBtnClose = $("<div />");
		this.popupBtnClose.addClass("stellar_vp_btnClose stellar_vp_themeColorText");
		this.infoWindow.append(this.popupBtnClose);
		this.popupBtnClose.css({
			bottom: 0
		});
		this.adImg.append(this.popupBtnClose);

		this.popupBtnCloseIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-times-circle")
			.addClass("stellar_vp_themeColor");
		this.popupBtnClose.append(this.popupBtnCloseIcon);

		this.popupBtnClose.bind(this.CLICK_EV, $.proxy(function () {
			self.adOn = true;
			self.togglePopup();
		}, this));

		this.popupBtnClose.mouseover(function () {
			$(this).stop().animate({
				opacity: 0.7
			}, 200);
		});
		this.popupBtnClose.mouseout(function () {
			$(this).stop().animate({
				opacity: 1
			}, 200);
		});
	}
	Video.fn.positionPopup = function () {

		var self = this;

		this.adImg.css({
			bottom: self.controls.height() + 20,
			left: self.element.width() / 2 - this.adImg.width() / 2
		});
	};
	Video.fn.newAd = function () {

		var self = this;

		this.adImg.hide();
		this.image.src = "";
		this.image.src = this._playlist.videos_array[this._playlist.videoid].popupImg;

		if (this.adOn)
			return

		$(this.image).bind(this.START_EV, function () {

			window.open(self._playlist.videos_array[self._playlist.videoid].popupAdGoToLink);

			if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
				self.youtubePlayer.pauseVideo();
			}
			if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
				self.pause();
			}
		})
	};
	Video.fn.createLogo = function () {
		var self = this;
		this.logoImg = $("<div/>");
		this.logoImg.addClass("stellar_vp_logo");
		this.img = new Image();
		this.img.src = self.options.logoPath;
		//
		$(this.img).on("load", function () {
			self.logoImg.append(self.img);
			self.positionLogo();
		});

		if (self.options.logoShow) {
			this.element.append(this.logoImg);
		}

		if (self.options.logoClickable) {
			this.logoImg.bind(this.CLICK_EV, $.proxy(function () {
				window.open(self.options.logoGoToLink);
			}, this));

			this.logoImg.mouseover(function () {
				$(this).stop().animate({
					opacity: 0.8
				}, 200);
			});
			this.logoImg.mouseout(function () {
				$(this).stop().animate({
					opacity: 1
				}, 200);
			});
			$('.stellar_vp_logo').css('cursor', 'pointer');
		}
	};
	Video.fn.positionVolumeTrackWrapper = function () {
		this.volumeTrackWrapper.css({
			// left: this._playlist.controlsBtnsWrapperLeft.position().left + this.playBtnWrapper.width()+ this._playlist.nextBtn.width() + this.unmuteBtnWrapper.width()
			left: this.unmuteBtnWrapper.position().left + this.unmuteBtnWrapper.width()
		})
	}
	Video.fn.positionLogo = function () {
		var self = this;
		var bottomMargin;

		if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
			bottomMargin = 70;
		else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
			bottomMargin = 70;

		if (self.options.logoPosition == "bottom-right") {
			this.logoImg.css({
				bottom: bottomMargin,
				right: buttonsMargin
			});
		} else if (self.options.logoPosition == "bottom-left") {
			this.logoImg.css({
				bottom: bottomMargin,
				left: buttonsMargin
			});
		}
	};
	Video.fn.positionQualityWindow = function () {
		var self = this;
		this.qualityWindow_mask.css({
			left: self.controlsBtnsWrapperRight.position().left + self.qualityBtnWrapper.position().left - 50 + 16 - 4,
			bottom: this.controls.height() + 6 + 20
		});
	};
	Video.fn.positionShareMask = function () {
		var self = this;

		this.shareWindow_mask.css({
			left: self.controlsBtnsWrapperRight.position().left + self.shareBtn.position().left - 111 / 2 + 16 - 5 / 2,
			bottom: this.controls.height() + 6 + 20
		});
	};
	Video.fn.showVideoElements = function () {
		this.videoElement.show();
		this.videoElementAD.show();
	};
	Video.fn.hideVideoElements = function () {
		this.videoElement.hide();
		this.videoElementAD.hide();
	};
	Video.fn.createAds = function () {
		var self = this;
		adsImg = $("<div/>");
		adsImg.addClass("ads");

		image = new Image();
		image.src = self._playlist.videos_array[0].adsPath;

		$(image).on("load", function () {
			adsImg.append(image);
			self.positionAds();
		});
		this.element.append(adsImg);
		adsImg.hide();
	};
	Video.fn.positionAds = function () {
		var self = this;
		adsImg.css({
			bottom: self.controls.height() + 5,
			left: self.element.width() / 2 - adsImg.width() / 2
		});
	};
	Video.fn.setupAutoplay = function () {
		var self = this;
		if (this.options.lightBox)
			return

		if (self.options.autoplay) {
			if (self.isMobile.any())
				self.playButtonScreen.show();
			else
				self.play();
		} else if (!self.options.autoplay) {
			self.pause();
			self.preloader.hide();
		}
	}
	Video.fn.createNowPlayingText = function () {
		var self = this;

		if (self.options.loadRandomVideoOnStart) {
			this.nowPlayingTitle.append('<p class="screen stellar_vp_nowPlayingText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[self._playlist.rand].title + '</p>');
			this.nowPlayingTitleControlBar.append('<p class="controls stellar_vp_nowPlayingText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[self._playlist.rand].title + '</p>');
		} else {
			this.nowPlayingTitle.append('<p class="screen stellar_vp_nowPlayingText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[0].title + '</p>');
			this.nowPlayingTitleControlBar.append('<p class="controls stellar_vp_nowPlayingText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[0].title + '</p>');
		}

		this.nowPlayingTitleW = this.nowPlayingTitle.width();

		if (!this.options.nowPlayingText)
			this.nowPlayingTitle.hide();
	};
	Video.fn.createInfoWindowContent = function () {
		var self = this;
		if (self.options.loadRandomVideoOnStart) {
			this.infoWindow.append('<p class="stellar_vp_infoTitle stellar_vp_themeColorText stellar_vp_titles">' + this._playlist.videos_array[self._playlist.rand].title + '</p>');
			this.infoWindow.append('<p class="stellar_vp_infoText stellar_vp_infoText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[self._playlist.rand].info_text + '</p>');
		} else {
			this.infoWindow.append('<p class="stellar_vp_infoTitle stellar_vp_themeColorText stellar_vp_titles">' + this._playlist.videos_array[0].title + '</p>');
			this.infoWindow.append('<p class="stellar_vp_infoText stellar_vp_infoText' + " " + this.options.instanceTheme + '">' + this._playlist.videos_array[0].info_text + '</p>');
		}


		this.infoWindow.css({
			top: self.screenBtnsWindow.position().top + self.infoBtn.height() + 10,
			right: -20,
			opecity: 0
		}).hide();
	};
	Video.fn.createNextVideoBox = function () {
		var self = this;

		this.nextVideoBox_mask = $("<div />");
		this.nextVideoBox_mask.addClass("stellar_vp_nextVideoBoxMask")
			.hide();
		if (this.element) {
			this.element.append(this.nextVideoBox_mask);
		}

		this.nextVideoBox = $("<div />")
			.addClass("stellar_vp_nextVideoBox")
			.addClass("stellar_vp_bg" + " " + this.options.instanceTheme)
		this.nextVideoBox_mask.append(this.nextVideoBox);

		this.i = document.createElement('img');
		this.i.src = self._playlist.videos_array[self._playlist.videoid + 1].thumbnail_image;
		this.nextVideoBox.append(this.i);
		$('.stellar_vp_nextVideoBox img').addClass('stellar_vp_nextVideoBoxImage stellar_vp_themeColorThumbBorder');

		this.nextVideoBoxTitle = $("<div />")
			.addClass("stellar_vp_nextVideoBoxContentLeft");
		this.nextVideoBox.append(this.nextVideoBoxTitle);

		this.nextVideoBoxTitle.append('<p class="stellar_vp_nextVideoBoxTitle">' + self._playlist.videos_array[self._playlist.videoid + 1].title + '</p>');
		$(this.nextVideoBoxTitle).find('.stellar_vp_nextVideoBoxTitle').addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)

		this.nextVideoBox_mask.css({
			left: self.timeElapsed.position().left + self.timeElapsed.width() + 10,
			bottom: self.controls.height() + 6
		});
		this.nextVideoBox.css({
			top: self.nextVideoBox.height(),
			opacity: 0
		});

		this._playlist.nextBtn.mouseover(function () {
			self.nextVideoBoxOn = false
			self.toggleNextVideoBox()
		})
		this._playlist.nextBtn.mouseout(function () {
			self.nextVideoBoxOn = true
			self.toggleNextVideoBox()
		});
	}
	Video.fn.createSkipAd = function () {
		var self = this;

		this.skipAdBox = $("<div />")
			.addClass("stellar_vp_skipAdBox")
			.bind(self.CLICK_EV, function () {
				self.closeAD();
			})
			.hide();
		this.elementAD.append(this.skipAdBox);

		this.skipAdBoxContentLeft = $("<div />")
			.addClass("stellar_vp_skipAdBoxContentLeft");
		this.skipAdBox.append(this.skipAdBoxContentLeft);

		this.skipAdBoxContentLeft.append('<p class="stellar_vp_skipAdTitle">' + this.options.skipAdvertisementText + '</p>');

		this.skipAdBoxIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-step-forward-ad")
		this.skipAdBox.append(this.skipAdBoxIcon);
	};
	Video.fn.createSkipAdCount = function () {
		var self = this;

		this.skipAdCount = $("<div />")
			.addClass("stellar_vp_skipAdCount")
			.hide();
		this.elementAD.append(this.skipAdCount);

		this.i = document.createElement('img');
		this.i.src = self._playlist.videos_array[self._playlist.videoid].thumbnail_image;
		this.skipAdCount.append(this.i);
		$('.stellar_vp_skipAdCount img').addClass('stellar_vp_skipAdCountImage stellar_vp_themeColorThumbBorder');

		this.skipAdCountContentLeft = $("<div />")
			.addClass("stellar_vp_skipAdCountContentLeft");
		this.skipAdCount.append(this.skipAdCountContentLeft);

		this.skipAdCountContentLeft.append('<p class="stellar_vp_skipAdCountTitle">' + "" + '</p>');

		this.skipAdCount.css({
			right: -(this.skipAdCount.width()),
			bottom: 28
		}).hide();
	};
	Video.fn.createAdTogglePlay = function () {
		var self = this;

		this.toggleAdPlayBox = $("<div />")
			.addClass("stellar_vp_toggleAdPlayBox")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-playScreen" + " " + this.options.instanceTheme)
			.bind(self.CLICK_EV, function () {
				self.togglePlayAD();
				self.ADTriggered = true; //ad is once enabled
			})
			.hide()
		this.elementAD.append(this.toggleAdPlayBox);
	};
	Video.fn.createVideoAdTitleInsideAD = function () {
		var self = this;
		this.videoAdBoxInside = $("<div />");
		this.videoAdBoxInside.addClass("stellar_vp_videoAdBoxInside");
		this.elementAD.append(this.videoAdBoxInside);

		this.videoAdBoxInside.append('<div class="stellar_vp_adsTitleInside">' + this.options.advertisementTitle + " " + '</div>');
		this.videoAdBoxInside.append(this.timeLeftInside);
		this.videoAdBoxInside.hide();
	};

	Video.fn.createEmbedWindowContent = function () {
		var self = this;
		$(this.embedWindow).append('<p class="stellar_vp_embedTitle2 stellar_vp_themeColorText stellar_vp_titles">' + self.options.embedWindowTitle2 + '</p>');

		this.embedTxt = $("<p />")
			.addClass('stellar_vp_embedText')
			.addClass("stellar_vp_embedText" + " " + this.options.instanceTheme);
		this.embedWindow.append(this.embedTxt);

		this.copy = $("<div />")
			.attr("title", "Copy to clipboard")
			.attr('id', 'stellar_vp_copy')
			.addClass('copyBtn')
			.addClass(this.options.instanceTheme);
		this.embedWindow.append(this.copy);
		$(this.embedWindow).find("#stellar_vp_copy").append('<p id="stellar_vp_copyInside" class="stellar_vp_copyInside' + " " + this.options.instanceTheme + '">' + self.options.copyTxt + '</p>');

		$(this.embedWindow).append('<p class="stellar_vp_embedTitle3 stellar_vp_themeColorText stellar_vp_titles">' + self.options.embedWindowTitle3 + '</p>');

		this.embedTxt2 = $("<p />")
			.addClass('stellar_vp_embedText2')
			.addClass('stellar_vp_embedText' + " " + this.options.instanceTheme);
		this.embedWindow.append(this.embedTxt2);

		this.copy2 = $("<div />")
			.attr("title", "Copy to clipboard")
			.attr('id', 'stellar_vp_copy2')
			.addClass('copyBtn')
			.addClass(this.options.instanceTheme);
		this.embedWindow.append(this.copy2);
		$(this.embedWindow).find("#stellar_vp_copy2").append('<p id="stellar_vp_copyInside" class="stellar_vp_copyInside' + " " + this.options.instanceTheme + '">' + self.options.copyTxt + '</p>');

		var s = this.options.embedCodeSrc;
		var w = this.options.videoPlayerWidth;
		var h = this.options.videoPlayerHeight;

		$(this.embedWindow).find(".stellar_vp_embedText").text("<iframe src='" + s + "' width='" + w + "' height='" + h + "' frameborder=0 webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");

		this.updateEmbedText2();

		this.copy.bind(this.CLICK_EV, function () {
			var $temp = $("<input>");
			$("body").append($temp);
			$temp.val(self.embedTxt.text()).select();
			document.execCommand("copy");
			$temp.remove();

			$(self.copy2).find('.stellar_vp_copyInside').text(self.options.copyTxt)
			$(this).find('.stellar_vp_copyInside').text(self.options.copiedTxt)
			// alert("Copied video player:   " + self.embedTxt.text());
			$(self.embedTxt).addClass("stellar_vp_highlightText")
			$(self.embedTxt2).removeClass("stellar_vp_highlightText")

			// self.setColorAccent(self.options.colorAccent, $(".stellar_vp_highlightText"));
		});
		this.copy2.bind(this.CLICK_EV, function () {
			var $temp = $("<input>");
			$("body").append($temp);
			$temp.val(self.embedTxt2.text()).select();
			document.execCommand("copy");
			$temp.remove();

			$(self.copy).find('.stellar_vp_copyInside').text(self.options.copyTxt)
			$(this).find('.stellar_vp_copyInside').text(self.options.copiedTxt)
			// alert("Copied current video:   " + self.embedTxt2.text());
			$(self.embedTxt2).addClass("stellar_vp_highlightText")
			$(self.embedTxt).removeClass("stellar_vp_highlightText")
		});

	};
	Video.fn.updateEmbedText2 = function () {

		var url = window.location.href

		if (url.indexOf("?id=") >= 0) {
			// console.log("url containes params")
			url = url.split('?')[0];
			$(this.embedWindow).find(".stellar_vp_embedText2").text(url + "?id=" + this._playlist.videoid);
		} else {
			// console.log("url doesnt contain params")
			$(this.embedWindow).find(".stellar_vp_embedText2").text(url + "?id=" + this._playlist.videoid);
		}

		$(this.copy).find('.stellar_vp_copyInside').text(this.options.copyTxt)
		$(this.copy2).find('.stellar_vp_copyInside').text(this.options.copyTxt)
		$(this.embedTxt).removeClass("stellar_vp_highlightText")
		$(this.embedTxt2).removeClass("stellar_vp_highlightText")
	}
	Video.fn.updateNextBtnImg = function () {
		this.i.src = this._playlist.videos_array[this._playlist.videoid].thumbnail_image;
	}
	Video.fn.ready = function (callback) {
		this.readyList.push(callback);
		if (this.loaded)
			callback.call(this);
	};

	Video.fn.load = function (srcs) {
		var self = this;
		if (srcs)
			this.sources = srcs;

		if (typeof this.sources == "string")
			this.sources = {
				src: this.sources
			};

		if (!$.isArray(this.sources))
			this.sources = [this.sources];

		this.ready(function () {
			this.change("loading");
			if (self._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
				this.video.loadSources(this.sources, self._playlist.videos_array[this._playlist.videoid].currentTime);
			}
		});
	};
	Video.fn.closeAD = function () {
		var self = this;
		if (self.options.allowSkipAd) {
			self.skipAdBox.hide();
			self.skipAdCount.hide();
		}

		var allAddPlayed = true;
		if ($.isArray(self.sourcesAD)) {
			self.sourcesAD.splice(0, 1);
			if (self.sourcesAD.length > 0 && !self.midrollActive) {
				allAddPlayed = false;
				self.loadAD(this.sourcesAD);
				self.openAD();
			}
		}

		if (allAddPlayed) {
			clearInterval(self.myInterval);

			self.videoPlayingAD = true;
			self.togglePlayAD();
			self.resetPlayerAD();
			self.elementAD.css({
				zIndex: 1
			});
			self.videoElementAD.empty();
			self.videoAdBoxInside.hide();
			self.removeListenerProgressAD();
			self.fsEnterADBox.hide();
			self.toggleAdPlayBox.hide();
			self.progressADBg.hide();

			self._playlist.videoAdPlayed = true;

			// self.elementAD.width(0);
			// self.elementAD.height(0);
			if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
				self.ytWrapper.css({
					visibility: "visible"
				});
				self.hideVideoElements();
				if (self.youtubePlayer != undefined)
					this.youtubePlayer.playVideo();
			} else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
				self.showVideoElements();
				self.togglePlay();
				self.video.play();
			}
		}
	};
	Video.fn.openAD = function () {
		var self = this;

		self.showVideoElements();
		self.progressADBg.show();
		self.elementAD.css({
			zIndex: 555559
		});
		self.ytWrapper.css({
			visibility: "hidden"
		});
		self.videoAdBoxInside.show();
		if (self.options.allowSkipAd) {
			self.skipBoxOn = true;
			self.toggleSkipAdBox();
			self.skipCountOn = false;
			self.toggleSkipAdCount();
		}

		self.fsEnterADBox.show();

		if (!self._inFullscreen)
			self.resizeAll();

		if (this.isMobile.any()) {
			if (!self.ADTriggered) {
				self.toggleAdPlayBox.show();
				self.videoPlayingAD = true;
				self.togglePlayAD();
			}
		} else
			self.toggleAdPlayBox.hide();

		if (this.options.allowSkipAd) {
			this.setSkipTimer();
			$(".stellar_vp_skipAdCountTitle").text(this.options.skipAdText + " " + self.counter + " s");
			this.i.src = self._playlist.videos_array[self._playlist.videoid].thumbnail_image;
		}
	};
	Video.fn.loadAD = function (srcs, active) {
		this.preloaderAD.stop().animate({
			opacity: 1
		}, 0, function () {
			$(this).show()
		});
		if (srcs)
			this.sourcesAD = srcs;

		if (typeof this.sourcesAD == "string")
			this.sourcesAD = {
				src: this.sourcesAD
			};

		if (!$.isArray(this.sourcesAD))
			this.sourcesAD = [this.sourcesAD];

		this.ready(function () {
			this.change("loading");
			this.videoAD.loadSources(this.sourcesAD);
		});

		switch (active) {

			case "prerollActive":
				this.prerollActive = true;
				this.midrollActive = false;
				this.postrollActive = false;
				break;
			case "midrollActive":
				this.prerollActive = false;
				this.midrollActive = true;
				this.postrollActive = false;

				break;
			case "postrollActive":
				this.prerollActive = false;
				this.midrollActive = false;
				this.postrollActive = true;
				break;
		}
	};
	Video.fn.play = function () {
		var self = this;
		this.playButtonScreen.hide();

		this.playBtn.removeClass("fa-stellar-play").addClass("fa-stellar-pause");
		if (self.mouseOverPlayBtn)
			this.playBtn.removeClass("fa-stellar-play-zoom").addClass("fa-stellar-pause-zoom");

		if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
			self.video.play();
		else if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
			self.video.pause();

		//not global ads
		if ((self._playlist.videos_array[self._playlist.videoid].prerollAD == true || self._playlist.videos_array[self._playlist.videoid].prerollAD == "yes") && self.videoAdStarted == false && !self.options.showGlobalPrerollAds) {
			self.video.pause();
			if (!self.videoAdStarted && (self._playlist.videos_array[self._playlist.videoid].prerollAD == true || self._playlist.videos_array[self._playlist.videoid].prerollAD == "yes")) {
				if (self.myVideo.canPlayType && self.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
					self.canPlay = true;
					self.video_pathAD = self._playlist.videos_array[self._playlist.videoid].preroll_mp4;
				}
				self.loadAD(self.video_pathAD, "prerollActive");
				self.openAD();
			}
			self.videoAdStarted = true;
		}
		//global ads
		// if (this.options.showGlobalPrerollAds && self.videoAdStarted == false) {
		// 	self.video.pause();
		// 	if (!self.videoAdStarted && self.options.showGlobalPrerollAds) {
		// 		if (self.myVideo.canPlayType && self.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
		// 			self.canPlay = true;
		// 			self.video_pathAD = this.globalPrerollAds_arr[this.getGlobalPrerollRandomNumber()];
		// 		}
		// 		self.loadAD(self.globalPrerollAds_arr);
		// 		self.openAD();
		// 	}
		// 	self.videoAdStarted = true;
		// }
	};
	Video.fn.pause = function () {
		var self = this;
		if (this._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || this.options.videoType == "HTML5 (self-hosted)") {
			if (this.html5STARTED || this.options.posterImg == "")
				if (!this.is_iOSVolumeButtonScreen)
					this.playButtonScreen.show();
				else
					this.playButtonScreen.hide();
		} else if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube") {
			if (self._playlist.youtubeSTARTED || this.options.posterImg == "") {
				this.playButtonScreen.show();
			} else
				this.playButtonScreen.hide();
		}

		this.playBtn.removeClass("fa-stellar-pause").addClass("fa-stellar-play");
		if (self.mouseOverPlayBtn)
			this.playBtn.removeClass("fa-stellar-pause-zoom").addClass("fa-stellar-play-zoom");
		self.video.pause();
	};
	Video.fn.stop = function () {
		this.seek(0);
		this.pause();
	};
	Video.fn.hideOverlay = function () {
		var self = this;
		if (self.overlay == undefined)
			return;

		self.overlay.hide();
		self.poster2Showing = false;
		self.playButtonPoster.hide();

		if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
			self.youtubePlayer.playVideo();
			if (self.options.youtubeControls == "default controls")
				self.element.css("visibility", "hidden");
		} else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
			self.togglePlay();
		}
	};
	Video.fn.togglePlay = function () {

		if (this.state == "stellar_vp_playing") {
			this.pause();
			if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube")
				this.youtubePlayer.pauseVideo();
		} else {
			this.play();
			if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube")
				this.youtubePlayer.playVideo();
		}
	};
	Video.fn.toggleNextVideoBox = function () {
		var self = this;

		if (this.nextVideoBoxOn) {
			this.nextVideoBox.stop().animate({
				top: self.nextVideoBox.height(),
				opacity: 0
			}, 200, function () {
				$(self.nextVideoBox_mask).hide();
			});
			this.nextVideoBoxOn = false;
		} else {
			this.nextVideoBox_mask.show();
			this.nextVideoBox.stop().animate({
				top: 0,
				opacity: 1
			}, 500);
			this.nextVideoBoxOn = true;
		}
	};
	Video.fn.toggleSkipAdBox = function () {
		var self = this;

		if (this.skipBoxOn) {
			this.skipAdBox.stop().animate({
				right: -(this.skipAdBox.width() - 2),
				bottom: 28
			}, 200, function () {
				$(this).hide();
			});
			this.skipBoxOn = false;
		} else {
			this.skipAdBox.show();
			this.addListenerProgressAD();
			this.skipAdBox.stop().animate({
				right: 10,
				bottom: 28
			}, 500);
			this.skipBoxOn = true;
		}
	};
	Video.fn.toggleSkipAdCount = function () {
		var self = this;

		if (this.skipCountOn) {
			this.skipAdCount.stop().animate({
				right: -(this.skipAdCount.width() - 2),
				bottom: 28
			}, 200, function () {
				$(this).hide();
			});
			this.skipCountOn = false;
		} else {
			this.skipAdCount.show();
			this.skipAdCount.stop().animate({
				right: 10,
				bottom: 28
			}, 500);
			this.skipCountOn = true;
		}
	};
	Video.fn.toggleInfoWindow = function () {
		var self = this;

		if (this.infoOn) {
			this.infoWindow.stop().animate({
				right: -20,
				opacity: 0
			}, 200, function () {
				$(this).hide();
			});
			this.infoOn = false;
		} else {
			this.infoWindow.show();
			this.infoWindow.stop().animate({
				// top:0
				right: 0,
				opacity: 1
			}, 200);
			this.infoOn = true;
		}
	};
	Video.fn.toggleLightBox = function () {
		var self = this;

		if (this.lightBoxOn) {
			this.lightBoxOverlay.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide();
			});
			this.lightBoxOn = false;

			this.pause();
			if (this.YTAPIReady)
				this.youtubePlayer.pauseVideo();

			this.videoPlayingAD = true;
			this.togglePlayAD();

			//thumbnail play button zindex
			$('.stellar_vp_lightBoxThumbnailWrap').each(function (i, obj) {
				$(this).find(".stellar_vp_playButtonScreen").css({
					zIndex: 2147483647
				})
			});
		} else {
			this.lightBoxOverlay.show();
			this.lightBoxOverlay.stop().animate({
				opacity: 1
			}, 300);
			this.lightBoxOn = true;

			if (this.options.lightBoxAutoplay) {

				if (!this.lightBoxInitiated) { //open lightbox and play video by id
					this.playVideoById(this._playlist.videoid);
					this.lightBoxInitiated = true;
				} else { //open lightbox and resume playing
					if ((this._playlist.videos_array[this._playlist.videoid].prerollAD == true || this._playlist.videos_array[this._playlist.videoid].prerollAD == "yes") || this.options.showGlobalPrerollAds) {
						if (!this._playlist.videoAdPlayed) {
							//play ad
							this.videoPlayingAD = false;
							this.togglePlayAD();
						} else {
							//dont play ad,play main video
							this.play();
							if (this.YTAPIReady)
								this.youtubePlayer.playVideo();
						}
					} else {
						this.play();
						if (this.YTAPIReady)
							this.youtubePlayer.playVideo();
					}

				}

			}
			//thumbnail play button zindex
			$('.stellar_vp_lightBoxThumbnailWrap').each(function (i, obj) {
				$(this).find(".stellar_vp_playButtonScreen").css({
					zIndex: 2147483646
				})
			});
		}
		this.resizeAll();
	};
	Video.fn.toggleQualityWindow = function (val) {
		var self = this;

		var delay;
		if (val)
			delay = val
		else
			delay = 0
		if (this.qualityOn) {
			this.qualityWindow.stop().delay(delay).animate({
				top: 200,
				opacity: 0
			}, 200, function () {
				$(self.qualityWindow_mask).hide();
			});
			this.qualityOn = false;
		} else {
			this.qualityWindow_mask.show();
			this.qualityWindow.stop().delay(delay).animate({
				top: 0,
				opacity: 1
			}, 500);
			this.qualityOn = true;
		}
	};
	Video.fn.togglePopup = function () {
		if (this.adOn) {
			this.adImg.animate({
				opacity: 0
			}, 0, function () {
				// Animation complete.
				$(this).hide();
			});
			this.adOn = false;
		} else if (!this.adOn) {
			this.adImg.show();
			this.adImg.animate({
				opacity: 1
			}, 500);
			this.adOn = true;

		}
	};
	Video.fn.toggleShuffleBtn = function () {
		var self = this;
		if (this.shuffleBtnEnabled) {
			this.removeColorAccent($("#stellar_vp_shuffleBtn"));
			$(this._playlist.shuffleBtnIcon).removeClass("stellar_vp_enabled_shuffle")
			this.shuffleBtnEnabled = false;
		} else {
			$(this.mainContainer).find(".fa-stellar-random").addClass("stellar_vp_themeColorButton");
			$(this.mainContainer).find(".fa-stellar-random-zoom").addClass("stellar_vp_themeColorButton");
			$(this._playlist.shuffleBtnIcon).addClass("stellar_vp_enabled_shuffle")
			this.shuffleBtnEnabled = true;
			this.setColorAccent($(".stellar_vp_Progress").css("backgroundColor"), $("#stellar_vp_shuffleBtn"));
		}
	};
	Video.fn.toggleAutoplayBtn = function () {
		var self = this;
		if (this.toggleAutoplayBtnEnabled) {
			this.removeColorAccent($("#stellar_vp_toggleAutoplayBtn"));
			$(this.mainContainer).find(".fa-stellar-toggle-on").removeClass("fa-stellar-toggle-on").addClass("fa-stellar-toggle-off");
			$(this.mainContainer).find(".fa-stellar-toggle-on-zoom").removeClass("fa-stellar-toggle-on-zoom").addClass("fa-stellar-toggle-off-zoom");
			$(this._playlist.toggleAutoplayBtnIcon).removeClass("stellar_vp_enabled_autoplay")
			this.toggleAutoplayBtnEnabled = false;

		} else {
			$(this.mainContainer).find(".fa-stellar-toggle-off").removeClass("fa-stellar-toggle-off").addClass("fa-stellar-toggle-on");
			$(this.mainContainer).find(".fa-stellar-toggle-off-zoom").removeClass("fa-stellar-toggle-off-zoom").addClass("fa-stellar-toggle-on-zoom");
			$(this.mainContainer).find(".fa-stellar-toggle-on").addClass("stellar_vp_themeColorButton");
			$(this._playlist.toggleAutoplayBtnIcon).addClass("stellar_vp_enabled_autoplay")
			this.toggleAutoplayBtnEnabled = true;
			this.setColorAccent($(".stellar_vp_Progress").css("backgroundColor"), $("#stellar_vp_toggleAutoplayBtn"));
		}
	};
	Video.fn.toggleQualityBtn = function () {
		var self = this;
		if (this.qualityBtnEnabled) {
			this.removeColorAccent($("#stellar_vp_qualityBtn"));
			this.qualityBtn.removeClass("stellar_vp_enabled_quality")
			this.qualityBtnEnabled = false;
		} else {
			$(this.mainContainer).find(".fa-stellar-cog").addClass("stellar_vp_themeColorButton");
			$(this.mainContainer).find(".fa-stellar-cog-zoom").addClass("stellar_vp_themeColorButton");
			this.qualityBtn.addClass("stellar_vp_enabled_quality")
			this.qualityBtnEnabled = true;
			this.setColorAccent($(".stellar_vp_Progress").css("backgroundColor"), $("#stellar_vp_qualityBtn"));


		}
	};
	Video.fn.toggleShareBtn = function () {
		var self = this;
		if (this.shareBtnEnabled) {
			this.removeColorAccent($("#stellar_vp_shareBtn"));
			this.shareBtn.removeClass("stellar_vp_enabled_share")
			this.shareBtnEnabled = false;
		} else {
			$(this.mainContainer).find(".fa-stellar-external").addClass("stellar_vp_themeColorButton");
			$(this.mainContainer).find(".fa-stellar-external-zoom").addClass("stellar_vp_themeColorButton");
			this.shareBtn.addClass("stellar_vp_enabled_share")
			this.shareBtnEnabled = true;
			this.setColorAccent($(".stellar_vp_Progress").css("backgroundColor"), $("#stellar_vp_shareBtn"));
		}
	};
	Video.fn.toggleEmbedBtn = function () {
		var self = this;
		if (this.embedBtnEnabled) {
			this.removeColorAccent($("#stellar_vp_embedBtn"));
			this.embedBtn.removeClass("stellar_vp_enabled_embed")
			this.embedBtnEnabled = false;
		} else {
			$(this.mainContainer).find(".fa-stellar-code").addClass("stellar_vp_themeColorButton");
			$(this.mainContainer).find(".fa-stellar-code-zoom").addClass("stellar_vp_themeColorButton");
			this.embedBtn.addClass("stellar_vp_enabled_embed")
			this.embedBtnEnabled = true;
			this.setColorAccent($(".stellar_vp_Progress").css("backgroundColor"), $("#stellar_vp_embedBtn"));
		}
	};
	Video.fn.toggleShareWindow = function () {
		var self = this;

		if (this.shareOn) {
			this.shareWindow.stop().delay(0).animate({
				top: 32,
				opacity: 0
			}, 200, function () {
				$(self.shareWindow_mask).hide();
			});
			this.shareOn = false;
		} else {
			this.shareWindow_mask.show();
			this.shareWindow.stop().delay(0).animate({
				top: 0,
				opacity: 1
			}, 200);
			this.shareOn = true;
		}
	};
	Video.fn.togglePlayAD = function () {
		var self = this;

		if (this.videoPlayingAD) {
			this.videoAD.pause();
			this.videoPlayingAD = false;
			this.toggleAdPlayBox.show();
		} else {
			this.videoAD.play();
			this.videoPlayingAD = true;
			this.toggleAdPlayBox.hide();
		}
	};
	Video.fn.toggleEmbedWindow = function () {
		var self = this;
		if (this.embedOn) {
			$(this.embedWindow).stop().animate({
				top: -(this.embedWindow.height())
			}, 200, function () {
				$(this).hide();
			});
			this.embedOn = false;
		} else {
			$(this.embedWindow).show();
			$(this.embedWindow).stop().animate({
				top: 0
			}, 500);
			this.embedOn = true;
		}
		this.adjustSidebarBtnVisibility();
	};
	Video.fn.adjustSidebarBtnVisibility = function () {

		if (this.embedOn) {
			if ((this.options.playlist == "Right playlist") && !this._inFullscreen && this.stretching)
				this.sidebarBtn.hide();
			if (this.options.playlist == "Bottom playlist")
				this.sidebarBtn.hide();
		} else {
			if ((this.options.playlist == "Right playlist") && !this._inFullscreen && this.stretching)
				this.sidebarBtn.show();
			if (this.options.playlist == "Bottom playlist")
				this.sidebarBtn.show();
		}
	}
	Video.fn.toggleFullScreen = function (element) {
		var self = this;
		// var element = $('html')[0];
		var element = document.body;

		if (this._inFullscreen) {

			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			//cancel
			if (this.options.playerLayout == "fitToContainer" || this.options.playerLayout == "fixedSize")
				this.mainContainer.parent().css("position", "relative");
			this._inFullscreen = false;
		} else {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
			//request
			this.mainContainer.parent().css("position", "");
			this._inFullscreen = true;
		}
		this.resize()
	};

	Video.fn.seek = function (offset) {
		this.video.setCurrentTime(offset);
	};

	Video.fn.setVolume = function (num) {
		this.video.setVolume(num);
	};

	Video.fn.getVolume = function () {
		return this.video.getVolume();
	};

	Video.fn.mute = function (state) {
		if (typeof state == "undefined") state = true;
		this.setVolume(state ? 1 : 0);
	};

	Video.fn.remove = function () {
		this.element.remove();
	};

	Video.fn.bind = function () {
		this.videoElement.bind.apply(this.videoElement, arguments);
	};

	Video.fn.one = function () {
		this.videoElement.one.apply(this.videoElement, arguments);
	};

	Video.fn.trigger = function () {
		this.videoElement.trigger.apply(this.videoElement, arguments);
	};
	// Proxy jQuery events
	var events = [
		"click",
		"dblclick",
		"onerror",
		"onloadeddata",
		"oncanplay",
		"ondurationchange",
		"ontimeupdate",
		"onprogress",
		"onpause",
		"onplay",
		"onended",
		"onvolumechange"
	];

	for (var i = 0; i < events.length; i++) {
		(function () {
			var functName = events[i];
			var eventName = functName.replace(/^(on)/, "");
			Video.fn[functName] = function () {
				var args = $.makeArray(arguments);
				args.unshift(eventName);
				this.bind.apply(this, args);
			};
		})();
	}
	Video.fn.triggerReady = function () {
		this.loaded = true;

		//multiple videos:
		$('video').each(function () {
			enableInlineVideo(this);
		});
	};
	Video.fn.setupElement = function () {
		var self = this;
		this.mainContainer = $("<div />");
		this.mainContainer.addClass("stellar_vp_mainContainer");
		if (this.options.playerLayout == "fitToContainer" || this.options.playerLayout == "fitToBrowser") {
			this.mainContainer.css({
				width: "100%",
				height: "100%",
				position: "absolute",
				background: "#000000",
				zIndex: 999999
			});
		} else if (this.options.playerLayout == "fixedSize") {
			this.mainContainer.css({
				width: this.options.videoPlayerWidth,
				height: this.options.videoPlayerHeight,
				position: "absolute",
				background: "#000000",
				zIndex: 999999
			});
		}
		switch (this.options.videoPlayerShadow) {
			case 'effect1':
				this.mainContainer.addClass("stellar_vp_effect1");
				break;
			case 'effect2':
				this.mainContainer.addClass("stellar_vp_effect2");
				break;
			case 'effect3':
				this.mainContainer.addClass("stellar_vp_effect3");
				break;
			case 'effect4':
				this.mainContainer.addClass("stellar_vp_effect4");
				break;
			case 'effect5':
				this.mainContainer.addClass("stellar_vp_effect5");
				break;
			case 'effect6':
				this.mainContainer.addClass("stellar_vp_effect6");
				break;
			case 'off':
				break;
		}
		this.parent.append(this.mainContainer);

		if (this.options.lightBox) {
			this.mainContainerBG = $("<div />");
			this.mainContainerBG.addClass("stellar_vp_mainContainerBG");
			this.mainContainer.append(this.mainContainerBG)
		}

		this.element = $("<div />");
		this.element.addClass("stellar_vp_videoPlayer");
		this.mainContainer.append(this.element);

		this.ytWrapper = $('<div></div>');
		this.ytWrapper.addClass('stellar_vp_ytWrapper');
		this.element.append(this.ytWrapper);

		this.ytPlayer = $('<div></div>');
		this.ytPlayer.attr("id", self.options.instanceName + "youtube");
		this.ytWrapper.append(this.ytPlayer);

		this.imageWrapper = $('<div></div>');
		this.imageWrapper.addClass('stellar_vp_imageWrapper');
		this.element.append(this.imageWrapper);

		this.imageDisplayed = document.createElement('img');
		this.imageWrapper.append(this.imageDisplayed);
		$('.stellar_vp_imageWrapper img').attr('id', 'stellar_vp_imageDisplayed');
	};
	Video.fn.setupElementAD = function () {
		this.elementAD = $("<div />");
		this.elementAD.addClass("stellar_vp_videoPlayerAD");
		this.mainContainer.append(this.elementAD);
	};
	Video.fn.idle = function (e, toggle) {
		var self = this;

		if (toggle) {
			if (this.state == "stellar_vp_playing") {
				if (!this.options.showAllControls)
					self.controls.hide();
				self.controls.stop().animate({
					bottom: -44
				}, 300, function () {
					self.videoTrackWrapper.hide();
				});
				self.progressIdleTrack.stop().delay(800).animate({
					bottom: 0
				}, 300);
				self.screenBtnsWindow.stop().animate({
					top: -self.screenBtnsWindow.height()
				}, 300);
				self.nowPlayingTitle.stop().animate({
					top: -self.nowPlayingTitle.height()
				}, 300);
				self.logoImg.stop().animate({
					opacity: 0
				}, 300);
				self.timeTotal.stop().animate({
					opacity: 0
				}, 300);
				self.timeElapsed.stop().animate({
					opacity: 0
				}, 300);

				this.qualityOn = true;
				this.toggleQualityWindow();
				this.qualityBtnEnabled = true;
				this.toggleQualityBtn();

				this.shareOn = true;
				this.toggleShareWindow();
				this.shareBtnEnabled = true;
				this.toggleShareBtn();

				this.embedOn = true;
				this.toggleEmbedWindow();
				this.embedBtnEnabled = true;
				this.toggleEmbedBtn();

				this.infoOn = true;
				this.toggleInfoWindow();

				$(this.toolTip).stop().animate({
					opacity: 0
				}, 50, function () {
					self.toolTip.hide()
				});
				self.invisibleWrapper.show();
			}
		} else {
			if (!self.options.showAllControls)
				self.controls.hide();

			self.videoTrackWrapper.show();
			self.controls.stop().animate({
				bottom: 0
			}, 300);
			self.progressIdleTrack.stop().animate({
				bottom: -self.options.progressBarThicknessOnMouseover
			}, 100);
			self.screenBtnsWindow.stop().animate({
				top: 0
			}, 300);
			self.nowPlayingTitle.stop().animate({
				top: 0
			}, 300);
			self.logoImg.stop().animate({
				opacity: 1
			}, 300);
			self.timeTotal.stop().animate({
				opacity: 1
			}, 300);
			self.timeElapsed.stop().animate({
				opacity: 1
			}, 300);

			this.invisibleWrapper.hide();
		}
	};
	Video.fn.hideControls = function () {
		var self = this;

		$(this.element).hover(function () {
			if (!self.options.showAllControls)
				self.controls.hide();

			self.videoTrackWrapper.show();
			self.controls.stop().animate({
				bottom: 0
			}, 300);
			self.progressIdleTrack.stop().animate({
				bottom: -self.options.progressBarThicknessOnMouseover
			}, 100);
			self.screenBtnsWindow.stop().animate({
				top: 0
			}, 300);
			self.nowPlayingTitle.stop().animate({
				top: 0
			}, 300);
			self.logoImg.stop().animate({
				opacity: 1
			}, 300);
			self.timeTotal.stop().animate({
				opacity: 1
			}, 300);
			self.timeElapsed.stop().animate({
				opacity: 1
			}, 300);

		}, function () {
			if (!self.options.showAllControls)
				self.controls.hide();

			self.controls.stop().animate({
				bottom: -44
			}, 300, function () {
				self.videoTrackWrapper.hide();
			});
			self.progressIdleTrack.stop().delay(800).animate({
				bottom: 0
			}, 300);
			self.screenBtnsWindow.stop().animate({
				top: -self.screenBtnsWindow.height()
			}, 300);
			self.nowPlayingTitle.stop().animate({
				top: -self.nowPlayingTitle.height()
			}, 300);
			self.logoImg.stop().animate({
				opacity: 0
			}, 300);
			self.timeTotal.stop().animate({
				opacity: 0
			}, 300);
			self.timeElapsed.stop().animate({
				opacity: 0
			}, 300);
		});
	};
	Video.fn.change = function (state) {
		this.state = state;
		if (this.element) {
			this.element.attr("data-state", this.state);
			this.element.trigger("state.videoPlayer", this.state);
		}
	}
	Video.fn.setupHTML5Video = function () {
		if (this.element) {
			this.element.append(this.videoElement);
		}
		this.video = this.videoElement[0];

		if (this.element) {
			this.element.width(this.playerWidth);
			this.element.height(this.playerHeight);
		}
		var self = this;

		this.video.loadSources = function (srcs, currentTime) {
			self.video.setCurrentTime(currentTime || 0);
			self.videoElement.empty();

			for (var i in srcs) {
				if (srcs[i].src.indexOf('m3u8') != -1) {

					if (Hls.isSupported()) {

						var hls = new Hls();
						hls.loadSource(srcs[i].src);
						hls.attachMedia(self.video);
						hls.on(Hls.Events.MANIFEST_PARSED, function () {
							// video.play();
						});
					}
				} else {
					self.videoElement.attr('src', srcs[i].src);
				}
			}
			self.video.load();

		};

		this.video.getStartTime = function () {
			return (this.startTime || 0);
		};
		this.video.getEndTime = function () {
			if (this.duration == Infinity && this.buffered) {
				return (this.buffered.end(this.buffered.length - 1));
			} else {
				return ((this.startTime || 0) + this.duration);
			}
		};

		this.video.getCurrentTime = function () {
			try {
				return this.currentTime;
			} catch (e) {
				return 0;
			}
		};


		var self = this;

		this.video.setCurrentTime = function (val) {
			this.currentTime = val;
		};
		this.video.getVolume = function () {
			return this.volume;
		};
		this.video.setVolume = function (val) {
			if (val > 1)
				val = 1;
			if (self.options.showAllControls)
				this.volume = val;
			else
				this.volume = 1;
		};

		this.videoElement.dblclick($.proxy(function () {
			this.toggleFullScreen();
		}, this));
		this.videoElement.bind(this.CLICK_EV, $.proxy(function () {
			this.togglePlay();

		}, this));

		this.triggerReady();



	};
	Video.fn.setupHTML5VideoAD = function () {
		if (this.elementAD) {
			this.elementAD.append(this.videoElementAD);
		}
		this.videoAD = this.videoElementAD[0];

		if (this.elementAD) {
			this.elementAD.width(0);
			this.elementAD.height(0);
		}
		var self = this;
		this.videoAD.loadSources = function (srcs) {
			self.videoElementAD.empty();
			for (var i in srcs) {
				if (srcs[i].src.indexOf('m3u8') != -1) {
					if (Hls.isSupported()) {
						var hls = new Hls();
						hls.loadSource(srcs[i].src);
						hls.attachMedia(self.videoAD);
						hls.on(Hls.Events.MANIFEST_PARSED, function () {
							// self.videoElement[0].play();
						});
					}
				} else {
					// console.log('player in progress')
					self.videoElementAD.attr('src', srcs[i].src)
				}
				break;
			}
			self.videoAD.load();
			if (self.isMobile.any())
				self.videoPlayingAD = true;
			else
				self.videoPlayingAD = false;
			self.togglePlayAD();
		};

		this.videoAD.getStartTime = function () {
			return (this.startTime || 0);
		};
		this.videoAD.getEndTime = function () {
			if (isNaN(this.duration)) {
				/*self.timeTotal.text("--:--");*/
				// console.log('End of ad');
			} else {
				if (this.duration == Infinity && this.buffered) {
					// console.log('End of ad 2');
					return (this.buffered.end(this.buffered.length - 1));
				} else {
					// console.log('End of ad 1');
					return ((this.startTime || 0) + this.duration);
				}
			}

		};
		this.videoAD.getCurrentTime = function () {
			try {
				return this.currentTime;
			} catch (e) {
				return 0;
			}
		};
		this.videoAD.setCurrentTime = function (val) {
			this.currentTime = val;
		}
		this.videoAD.getVolume = function () {
			return this.volume;
		};
		this.videoAD.setVolume = function (val) {
			this.volume = val;
		};
		this.videoElementAD.dblclick($.proxy(function () {
			this.toggleFullScreen();
		}, this));
		this.triggerReady();
		this.videoElementAD.bind(this.CLICK_EV, $.proxy(function () {
			//global ads
			if (this.options.showGlobalPrerollAds) {
				if ((this.options.globalPrerollAdsGotoLink != "") && (this.options.globalPrerollAdsGotoLink != "globalPrerollAdsGotoLink")) {
					window.open(this.options.globalPrerollAdsGotoLink);
					this.videoPlayingAD = true;
					this.togglePlayAD();
				}
			} else {
				if ((this._playlist.videos_array[this._playlist.videoid].prerollGotoLink != "") && (this._playlist.videos_array[this._playlist.videoid].prerollGotoLink != "prerollGotoLink") && (this._playlist.videos_array[this._playlist.videoid].prerollAD == true || this._playlist.videos_array[this._playlist.videoid].prerollAD == "yes")) {
					if (this.prerollActive)
						window.open(this._playlist.videos_array[this._playlist.videoid].prerollGotoLink);
					this.videoPlayingAD = true;
					this.togglePlayAD();
				}
				if ((this._playlist.videos_array[this._playlist.videoid].midrollGotoLink != "") && (this._playlist.videos_array[this._playlist.videoid].midrollGotoLink != "midrollGotoLink") && (this._playlist.videos_array[this._playlist.videoid].midrollAD == true || this._playlist.videos_array[this._playlist.videoid].midrollAD == "yes")) {
					if (this.midrollActive)
						window.open(this._playlist.videos_array[this._playlist.videoid].midrollGotoLink);
					this.videoPlayingAD = true;
					this.togglePlayAD();
				}
				if ((this._playlist.videos_array[this._playlist.videoid].postrollGotoLink != "") && (this._playlist.videos_array[this._playlist.videoid].postrollGotoLink != "postrollGotoLink") && (this._playlist.videos_array[this._playlist.videoid].postrollAD == true || this._playlist.videos_array[this._playlist.videoid].postrollAD == "yes")) {
					if (this.postrollActive)
						window.open(this._playlist.videos_array[this._playlist.videoid].postrollGotoLink);
					this.videoPlayingAD = true;
					this.togglePlayAD();
				}
			}
		}, this));
	};
	Video.fn.setupButtonsOnScreen = function () {

		var self = this;
		this.screenBtnsWindow = $("<div></div>");
		this.screenBtnsWindow.addClass("stellar_vp_screenBtnsWindow");
		if (this.element)
			this.element.append(this.screenBtnsWindow);
		if (!this.options.showAllControls)
			this.screenBtnsWindow.hide();

		this.infoBtn = $("<div />")
			.addClass("stellar_vp_infoBtn")
			.addClass("stellar_vp_playerElement")
			.addClass("stellar_vp_btnOverScreen")
			.addClass("stellar_vp_bg" + " " + this.options.instanceTheme)

		if (this.element) {
			this.screenBtnsWindow.append(this.infoBtn);
		}
		this.infoBtnIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-overScreen")
			.addClass("stellar-icon-overScreen" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-info-circle");
		this.infoBtn.append(this.infoBtnIcon);

		//==sidebar btn==//
		this.sidebarBtn = $("<div />")
			.addClass("stellar_vp_sidebarBtn")
			.addClass("stellar_vp_playerElement")
			.addClass("stellar_vp_btnOverScreen")
			.addClass("stellar_vp_bg" + " " + this.options.instanceTheme)

		this.mainContainer.append(this.sidebarBtn);

		this.sidebarBtnIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-overScreen")
			.addClass("stellar-icon-overScreen" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-chevron-circle-right");
		this.sidebarBtn.append(this.sidebarBtnIcon);
		this.sidebarBtn.bind(this.CLICK_EV, function () {
			self.toggleStretch();
			self.resizeAll();
		});

		this.shareWindow = $("<div></div>");
		this.shareWindow.addClass("stellar_vp_shareWindow");

		this.shareWindow_mask = $("<div />");
		this.shareWindow_mask.addClass("stellar_vp_shareWindowMask")
			.hide();
		if (this.element) {
			this.element.append(this.shareWindow_mask);
		}
		this.shareWindow_mask.append(this.shareWindow)

		this.positionShareMask()

		this.shareWindow.css({
			top: 32,
			opacity: 0
		})

		this.facebookBtn = $("<div />")
			.addClass("stellar_vp_facebookBtn")
			.addClass("stellar_vp_playerElement")
			.addClass("stellar_vp_socialBtn")
			.addClass("stellar_vp_bg");
		if (this.element) {
			this.shareWindow.append(this.facebookBtn);
		}
		this.facebookBtnIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-overScreen")
			.addClass("fa-stellar-facebook");
		this.facebookBtn.append(this.facebookBtnIcon);

		this.twitterBtn = $("<div />")
			.addClass("stellar_vp_twitterBtn")
			.addClass("stellar_vp_playerElement")
			.addClass("stellar_vp_socialBtn")
			.addClass("stellar_vp_bg");
		if (this.element) {
			this.shareWindow.append(this.twitterBtn);
		}
		this.twitterBtnIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-overScreen")
			.addClass("fa-stellar-twitter");
		this.twitterBtn.append(this.twitterBtnIcon);

		this.mailBtn = $("<div />")
			.addClass("stellar_vp_mailBtn")
			.addClass("stellar_vp_playerElement")
			.addClass("stellar_vp_socialBtn")
			.addClass("stellar_vp_bg");
		if (this.element) {
			this.shareWindow.append(this.mailBtn);
		}
		this.mailBtnIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-overScreen")
			.addClass("fa-stellar-google-plus");
		this.mailBtn.append(this.mailBtnIcon);

		this.facebookBtn.bind(this.CLICK_EV, $.proxy(function () {
			self.pause();
			if (self.YTAPIReady)
				self.youtubePlayer.pauseVideo();

			var left = ($(window).width() / 2) - (600 / 2),
				top = ($(window).height() / 2) - (400 / 2),
				popup = window.open("https://www.facebook.com/dialog/feed?app_id=787376644686729" +
					"&display=popup" +
					"&name=" + self.options.facebookShareName +
					"&link=" + self.options.facebookShareLink +
					"&redirect_uri=https://facebook.com" +
					"&description=" + self.options.facebookShareDescription +
					"&picture=" + self.options.facebookSharePicture, "popup", "width=600, height=400, top=" + top + ", left=" + left);
			if (window.focus) {
				popup.focus();
			}
		}, this));

		this.twitterBtn.bind(this.CLICK_EV, $.proxy(function () {
			self.pause();
			if (self.YTAPIReady)
				self.youtubePlayer.pauseVideo();

			var left = ($(window).width() / 2) - (600 / 2),
				top = ($(window).height() / 2) - (400 / 2),
				popup = window.open("https://twitter.com/intent/tweet" +
					"?text=" + self.options.twitterText +
					"&url=" + self.options.twitterLink +
					"&hashtags=" + self.options.twitterHashtags +
					"&via=" + self.options.twitterVia, "popup", "width=600, height=400, top=" + top + ", left=" + left);
			if (window.focus) {
				popup.focus();
			}
		}, this));
		this.mailBtn.bind(this.CLICK_EV, $.proxy(function () {
			self.pause();
			if (self.YTAPIReady)
				self.youtubePlayer.pauseVideo();

			var left = ($(window).width() / 2) - (600 / 2),
				top = ($(window).height() / 2) - (400 / 2),
				popup = window.open("https://plus.google.com/share" +
					"?url=" + self.options.googlePlus, "popup", "width=600, height=400, top=" + top + ", left=" + left);
			if (window.focus) {
				popup.focus();
			}
		}, this));
		$(".stellar_vp_infoBtn, .stellar_vp_sidebarBtn, .stellar_vp_facebookBtn, .stellar_vp_twitterBtn, .stellar_vp_mailBtn").mouseover(function () {
			$(this).find(".stellar-icon-overScreen").removeClass("stellar-icon-overScreen").addClass("stellar-icon-overScreen-hover");
		});
		$(".stellar_vp_infoBtn, .stellar_vp_sidebarBtn, .stellar_vp_facebookBtn, .stellar_vp_twitterBtn, .stellar_vp_mailBtn").mouseout(function () {
			$(this).find(".stellar-icon-overScreen-hover").removeClass("stellar-icon-overScreen-hover").addClass("stellar-icon-overScreen");
		});

		$(".stellar_vp_btnOverScreen").mouseover(function () {
			// $(this).css("background", self.convertHex(self.options.colorAccent, 1));
		});
		$(".stellar_vp_btnOverScreen").mouseout(function () {
			// $(this).css("background","");
		});
		if (!self.options.shareShow)
			this.shareBtn.hide();
		if (!self.options.embedShow)
			this.embedBtn.hide();
		if (!self.options.infoShow)
			this.infoBtn.hide();

		if (!self.options.facebookShow)
			this.facebookBtn.hide();
		if (!self.options.twitterShow)
			this.twitterBtn.hide();
		if (!self.options.googlePlusShow)
			this.mailBtn.hide();

		buttonsMargin = 5;

		this.positionOverScreenButtons();

	};
	Video.fn.convertHex = function (hex, opacity) {
		hex = hex.replace('#', '');
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
		return result;
	}
	Video.fn.toggleStretch = function () {
		var self = this;
		if (this.stretching) {
			self.shrinkPlayer();
			this.stretching = false;
			$(this.sidebarBtn).find(".fa-stellar-chevron-circle-left").removeClass("fa-stellar-chevron-circle-left").addClass("fa-stellar-chevron-circle-right");
			$(this.sidebarBtn).find(".fa-stellar-chevron-circle-left-zoom").removeClass("fa-stellar-chevron-circle-left-zoom").addClass("fa-stellar-chevron-circle-right-zoom");

			if (this.options.playlist == "Right playlist") {
				this.screenBtnsWindow.css({
					right: 0
				})
			}
			if (this.options.playlist == "Bottom playlist") {
				this.screenBtnsWindow.css({
					right: self.sidebarBtn.width() + 5
				})
			}
		} else {
			self.stretchPlayer();
			this.stretching = true;
			$(this.sidebarBtn).find(".fa-stellar-chevron-circle-right").removeClass("fa-stellar-chevron-circle-right").addClass("fa-stellar-chevron-circle-left");
			$(this.sidebarBtn).find(".fa-stellar-chevron-circle-right-zoom").removeClass("fa-stellar-chevron-circle-right-zoom").addClass("fa-stellar-chevron-circle-left-zoom");

			if (this.options.playlist == "Right playlist") {
				this.screenBtnsWindow.css({
					right: self.sidebarBtn.width() + 5
				})
			}
			if (this.options.playlist == "Bottom playlist") {
				this.screenBtnsWindow.css({
					right: 0
				})
			}
		}
		this.resizeVideoTrack();
		this.positionOverScreenButtons();
		this.positionLogo();
		this.positionPopup();
		this.positionQualityWindow();
		this.positionShareMask();
		this.resizeBars();
		this.resizeAll();
	};
	Video.fn.stretchPlayer = function () {
		var self = this;

		if (this.options.playlist == "Right playlist") {
			$(self.element).stop().animate({
				width: self.mainContainer.width()
			}, {
				duration: self.options.videoAnimationTime,
				step: function (now, fx) {
					self.positionElementsDuringAnimation()
					self._isAnimation = true;
				},
				complete: function () {
					self._isAnimation = false;
				}
			});
		} else if (this.options.playlist == "Bottom playlist") {
			$(self.element).stop().animate({
				height: self.mainContainer.height()
			}, {
				duration: self.options.videoAnimationTime,
				step: function (now, fx) {
					self.positionElementsDuringAnimation()
					self._isAnimation = true;
				},
				complete: function () {
					self._isAnimation = false;
				}
			});
		}

		$(self._playlist.playlist).stop().animate({
			opacity: 0
		}, {
			duration: self.options.videoAnimationTime,
			step: function (now, fx) {

			}
		});
	};
	Video.fn.shrinkPlayer = function () {
		var self = this;

		if (this.options.playlist == "Right playlist") {
			$(self.element).stop().animate({
				width: self.mainContainer.width() - self._playlist.playlist.width()
			}, {
				duration: self.options.videoAnimationTime,
				step: function (now, fx) {
					self.positionElementsDuringAnimation()
					self.elementAD.width(self.element.width());
					self.elementAD.height(self.element.height());
					self._isAnimation = true;
				},
				complete: function () {
					self._isAnimation = false;
				}
			});
		} else if (this.options.playlist == "Bottom playlist") {
			$(self.element).stop().animate({
				height: self.mainContainer.height() - self._playlist.playlist.height()
			}, {
				duration: self.options.videoAnimationTime,
				step: function (now, fx) {
					self.positionElementsDuringAnimation()
					self.elementAD.width(self.element.width());
					self.elementAD.height(self.element.height());
					self._isAnimation = true;
				},
				complete: function () {
					self._isAnimation = false;
				}
			});
		}

		$(self._playlist.playlist).stop().animate({
			opacity: 1
		}, {
			duration: self.options.videoAnimationTime,
			step: function (now, fx) {}
		});
	};
	Video.fn.positionOverScreenButtons = function () {
		var self = this;

		if (this.element) {

			if (this._inFullscreen) {
				this.sidebarBtn.hide()
				this.screenBtnsWindow.css({
					right: 0
				})
			} else {


				if (this.options.playlist == "Right playlist") {
					this.sidebarBtn.show()
					if (this.stretching) {
						this.screenBtnsWindow.css({
							right: self.sidebarBtn.width() + 5
						})
					} else {
						this.screenBtnsWindow.css({
							right: 0
						})
					}
				} else if (this.options.playlist == "Bottom playlist") {
					this.sidebarBtn.show()
					this.screenBtnsWindow.css({
						right: self.sidebarBtn.width() + 5
					})
				} else {
					this.sidebarBtn.hide()
					this.screenBtnsWindow.css({
						right: 0
					})
				}
			}
		}
	};
	Video.fn.setupButtons = function () {
		var self = this;

		var self = this;
		this.controlsBtnsWrapperRight = $("<div></div>");
		this.controlsBtnsWrapperRight.addClass("stellar_vp_controlsBtnsWrapperRight");
		this.controls.append(this.controlsBtnsWrapperRight);

		this.playBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_controlsBtn_play")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {
				self.togglePlay();
			});
		this.playBtn = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-play")
			.attr("id", "stellar_vp_playBtn");
		this.playBtnWrapper.append(this.playBtn);
		this._playlist.controlsBtnsWrapperLeft.prepend(this.playBtnWrapper)

		this.rewindBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {
				self.seek(0);
				self.play();

				if (self.youtubePlayer != undefined) {
					self.youtubePlayer.seekTo(0);
					self.youtubePlayer.playVideo();
				}
			});

		this.rewindBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_rewindBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-retweet")
		this.rewindBtnWrapper.append(this.rewindBtn); //REWIND BTN

		this.shareBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {
				self.toggleShareWindow()
				self.toggleShareBtn()
			});

		this.shareBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_shareBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-external-link")
		this.shareBtnWrapper.append(this.shareBtn); //SHARE BTN

		this.embedBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {
				self.toggleEmbedWindow()
				self.toggleEmbedBtn()
			});

		this.embedBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_embedBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-code")
		this.embedBtnWrapper.append(this.embedBtn); //EMBED BTN

		this.qualityBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {
				self.toggleQualityBtn();
				self.toggleQualityWindow();
				$(this).children(":first").toggleClass("fa-stellar-rotate-90")
			})

		this.qualityBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_qualityBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-cog")
		this.qualityBtnWrapper.append(this.qualityBtn); //Quality BTN

		this.HD_indicator = $("<div />")
			.addClass("stellar_vp_HD_indicator")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_qualityWindowText")
			.text("HD")
			.hide();
		this.qualityBtnWrapper.append(this.HD_indicator)


		this.downloadBtnLink = $("<a />")
			.attr('href', this._playlist.videos_array[this._playlist.videoid].video_path_mp4HD)
			.attr('download', '')
			.hide()
		this.downloadBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(self.CLICK_EV, function () {

			});
		this.downloadBtnLink.append(this.downloadBtnWrapper)
		this.downloadBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_downloadBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-download")
		this.downloadBtnWrapper.append(this.downloadBtn); //Download BTN
		if ((this._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || this.options.videoType == "HTML5 (self-hosted)") && (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes"))
			this.downloadBtnLink.show()


		if (self.options.shuffle) {
			this.shuffleBtnEnabled = false;
			this.toggleShuffleBtn();
		} else
			this.shuffleBtnEnabled = false;

		if (self.options.onFinish == "Play next video") {
			this.toggleAutoplayBtnEnabled = false;
			this.toggleAutoplayBtn();
		} else
			this.toggleAutoplayBtnEnabled = false;

		//PLAY BTN SCREEN
		this.playButtonScreen = $("<div />");
		this.playButtonScreen.addClass("stellar_vp_playButtonScreen")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-playScreen" + " " + this.options.instanceTheme)
			.hide();
		this.playButtonScreen.bind(this.CLICK_EV, $.proxy(function () {
			// this.play();
			this.togglePlay();
		}, this))

		if (isMobile.iOS() && this.options.autoplay) {
			//iOS VOLUME BTN SCREEN
			var is_iOSVolumeButtonScreen = true;

			this.iOSVolumeButtonScreen = $("<div />");
			this.iOSVolumeButtonScreen.addClass("stellar_vp_iOSVolumeButtonScreen")
				.attr("aria-hidden", "true")
				.addClass("fa-stellar")
				.addClass("fa-stellar-iOSBtnScreen" + " " + this.options.instanceTheme).addClass("pulse")
			this.iOSVolumeButtonScreen.bind(this.CLICK_EV, $.proxy(function () {
				if (is_iOSVolumeButtonScreen) {
					this.removeiOSAutoplay();
					this.iOSVolumeButtonScreen.hide();
					is_iOSVolumeButtonScreen = false;
				}
			}, this))
			if (this.element) {
				this.element.append(this.iOSVolumeButtonScreen);
			}
		}

		if (this.element) {
			this.element.append(this.playButtonScreen);
		}

		//FULLSCREEN
		this.fsBtnWrapper = $("<div />")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
			.bind(this.CLICK_EV, $.proxy(function () {
				this.toggleFullScreen();
			}, this));

		this.fsEnter = $("<span />");
		this.fsEnter.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_fsBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			// .addClass("fa-stellar-expand")
			// .addClass("fa-stellar-arrows-alt")
			.addClass("fa-stellar-desktop-expand")
		this.fsBtnWrapper.append(this.fsEnter);

		//ad fullscreen control
		this.fsEnterADBox = $("<div />")
			.addClass("stellar_vp_fsEnterADBox")
			.hide();
		this.elementAD.append(this.fsEnterADBox);

		this.fsEnterAD = $("<span />");
		this.fsEnterAD.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-expandAD")
			.bind(this.CLICK_EV, $.proxy(function () {
				this.toggleFullScreen();
			}, this))
			.mouseover(function () {
				$(this).stop().animate({
					opacity: 0.75
				}, 200);
			})
			.mouseout(function () {
				$(this).stop().animate({
					opacity: 1
				}, 200);
			});
		this.fsEnterADBox.append(this.fsEnterAD);

		if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == true || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes")
			this.controlsBtnsWrapperRight.append(this.downloadBtnLink)
		if (this.options.shareShow)
			this.controlsBtnsWrapperRight.append(this.shareBtnWrapper)
		if (this.options.embedShow)
			this.controlsBtnsWrapperRight.append(this.embedBtnWrapper)
		if (this.options.rewindShow)
			this.controlsBtnsWrapperRight.append(this.rewindBtnWrapper)
		if (this.options.qualityShow)
			this.controlsBtnsWrapperRight.append(this.qualityBtnWrapper)
		this.controlsBtnsWrapperRight.append(this.fsBtnWrapper)

		this.playButtonScreen.mouseover(function () {
			$(this).stop().animate({
				opacity: 0.85
			}, 200);
		});
		this.playButtonScreen.mouseout(function () {
			$(this).stop().animate({
				opacity: 1
			}, 200);
		});
	};
	Video.fn.createInfoWindow = function () {
		this.infoWindow = $("<div />");
		this.infoWindow.addClass("stellar_vp_infoWindow");
		this.infoWindow.addClass("stellar_vp_bg" + " " + this.options.instanceTheme);
		if (this.element) {
			this.element.append(this.infoWindow);
		}


		this.infoBtnClose = $("<div />");
		this.infoBtnClose.addClass("stellar_vp_btnClose stellar_vp_themeColorText");
		this.infoWindow.append(this.infoBtnClose);
		this.infoBtnClose.css({
			bottom: 0
		});

		this.infoBtnCloseIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-times-circle")
			.addClass("stellar_vp_themeColor");
		this.infoBtnClose.append(this.infoBtnCloseIcon);

		this.infoBtn.bind(this.CLICK_EV, $.proxy(function () {
			this.toggleInfoWindow();
		}, this));

		this.infoBtnClose.bind(this.CLICK_EV, $.proxy(function () {
			this.toggleInfoWindow();
		}, this));

		this.infoBtnClose.mouseover(function () {
			$(this).stop().animate({
				opacity: 0.7
			}, 200);
		});
		this.infoBtnClose.mouseout(function () {
			$(this).stop().animate({
				opacity: 1
			}, 200);
		});
	};
	Video.fn.createQualityWindow = function () {
		var self = this;
		this.qualityWindow_mask = $("<div />");
		this.qualityWindow_mask.addClass("stellar_vp_qualityWindowMask");
		if (this.element) {
			this.element.append(this.qualityWindow_mask);
		}

		this.qualityWindow = $("<div />");
		this.qualityWindow.addClass("stellar_vp_qualityWindow");
		this.qualityWindow.addClass("stellar_vp_bg" + " " + this.options.instanceTheme);
		if (this.element) {
			this.qualityWindow_mask.append(this.qualityWindow);
		}
		this.qualityWindow_mask.css({
			left: self.controlsBtnsWrapperRight.position().left + self.qualityBtnWrapper.position().left - 50 + 16 - 4,
			bottom: this.controls.height() + 6
		}).hide();
		this.qualityWindow.css({
			top: 200,
			opacity: 0
		});

		this.createQualityWindowByType(); //youtube/HTML5

		this.positionQualityWindow();
	}
	Video.fn.initStateYTQualityMenu = function () {

		var q = this.selectedYoutubeQuality || this.options.youtubeQuality

		switch (q) {
			case "hd1080":
				$(".hd1080").append(this.qualityCheck);
				this.HD_indicator.show();
				break;
			case "hd720":
				$(".hd720").append(this.qualityCheck);
				this.HD_indicator.show();
				break;
			case "large":
				$(".large").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
			case "medium":
				$(".medium").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
			case "small":
				$(".small").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
			case "tiny":
				$(".default").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
			case "default":
				$(".default").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
		}
	}
	Video.fn.initStateHTML5QualityMenu = function () {

		var q = this.selectedHTML5Quality || this.options.HTML5VideoQuality

		switch (q) {
			case "HD":
				$(".HD").append(this.qualityCheck);
				this.HD_indicator.show();
				break;
			case "SD":
				$(".SD").append(this.qualityCheck);
				this.HD_indicator.hide();
				break;
		}
	}
	Video.fn.updateYoutubeQuality = function (selected) {

		if (this.youtubePlayer.getPlaybackQuality() == selected)
			return
		if (this.youtubePlayer.getPlaybackQuality() == 'unknown') {
			this.youtubePlayer.setPlaybackQuality(selected);
			return
		}

		var saveYoutubeCurrentTime = this.youtubePlayer.getCurrentTime();

		this.youtubePlayer.stopVideo();
		this.youtubePlayer.setPlaybackQuality(selected);
		this.youtubePlayer.playVideo();
		this.youtubePlayer.seekTo(saveYoutubeCurrentTime);
	}
	Video.fn.updateHTML5Quality = function (selected) {

		var saveHTML5CurrentTime = this.video.getCurrentTime();

		this.pause();

		if (this.myVideo.canPlayType && this.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
			this.canPlay = true;
			switch (selected) {
				case "HD":
					this.video_path = this._playlist.videos_array[this._playlist.videoid].video_path_mp4HD;
					break;
				case "SD":
					this.video_path = this._playlist.videos_array[this._playlist.videoid].video_path_mp4SD;
					break;
			}
		}

		this.load(this.video_path, this._playlist.videoid);
		this.video.setCurrentTime(saveHTML5CurrentTime)
		this.play()
	}
	Video.fn.createQualityWindowByType = function () {

		var self = this;
		this.qualityWindow.html('')


		if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube") {
			this.qualityWindow.append('<div class="stellar_vp_list">' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement hd1080">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">1080p</p>' +
				'<p class="stellar_vp_qualityHD stellar-icon-general stellar_vp_qualityWindowText">HD</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement hd720">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">720p</p>' +
				'<p class="stellar_vp_qualityHD stellar-icon-general stellar_vp_qualityWindowText">HD</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement large">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">480p</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement medium">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">360p</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement small">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">240p</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement tiny">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">144p</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement default">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">auto</p>' +
				'</div>' +
				'</div>');
			this.qualityWindow_mask.css("height", "170px")
		}

		if (this._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || this.options.videoType == "HTML5 (self-hosted)") {
			this.qualityWindow.append('<div class="stellar_vp_list">' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement HD">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">HD</p>' +
				'<p class="stellar_vp_qualityHD stellar-icon-general stellar_vp_qualityWindowText">HD</p>' +
				'</div>' +
				'<div class="stellar_vp_qualityListItem stellar_vp_playerElement SD">' +
				'<p class="stellar_vp_qualityNum stellar-icon-general stellar_vp_controlsColor stellar_vp_qualityWindowText ' + this.options.instanceTheme + '">SD</p>' +
				'</div>' +
				'</div>');
			this.qualityWindow_mask.css("height", "50px")
		}

		this.qualityCheck = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "qualityCheck")
			.addClass("fa-stellar")
			.addClass("fa-stellar-caret-right")
			.addClass("stellar_vp_qualityCheck")
			.addClass("stellar_vp_qualityListItem_activeColor" + " " + this.options.instanceTheme);

		this.qualityListItem = $(".stellar_vp_qualityListItem");

		$(this.qualityListItem).click(function () {
			$(".stellar_vp_qualityWindow").find(".stellar_vp_qualityListItem_activeColor" + " " + self.options.instanceTheme).removeClass("stellar_vp_qualityListItem_activeColor" + " " + self.options.instanceTheme)
			$(this).addClass('stellar_vp_qualityListItem_activeColor' + " " + self.options.instanceTheme);
			$(this).append(self.qualityCheck);

			if ($(this).hasClass("hd1080")) {
				self.selectedYoutubeQuality = "hd1080";
				self.HD_indicator.show();
			}
			if ($(this).hasClass("hd720")) {
				self.selectedYoutubeQuality = "hd720";
				self.HD_indicator.show();
			}
			if ($(this).hasClass("large")) {
				self.selectedYoutubeQuality = "large";
				self.HD_indicator.hide();
			}
			if ($(this).hasClass("medium")) {
				self.selectedYoutubeQuality = "medium";
				self.HD_indicator.hide();
			}
			if ($(this).hasClass("small")) {
				self.selectedYoutubeQuality = "small";
				self.HD_indicator.hide();
			}
			if ($(this).hasClass("tiny")) {
				self.selectedYoutubeQuality = "tiny";
				self.HD_indicator.hide();
			}
			if ($(this).hasClass("default")) {
				self.selectedYoutubeQuality = "default";
			}
			if ($(this).hasClass("HD")) {
				self.selectedHTML5Quality = "HD";
				self.HD_indicator.show();
			}
			if ($(this).hasClass("SD")) {
				self.selectedHTML5Quality = "SD";
				self.HD_indicator.hide();
			}
			self.qualityOn = true;
			self.toggleQualityWindow();
			self.toggleQualityBtn();

			if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
				self.updateHTML5Quality(self.selectedHTML5Quality);
			else if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
				self.updateYoutubeQuality(self.selectedYoutubeQuality);
		});

		if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
			self.initStateHTML5QualityMenu();
		else if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
			self.initStateYTQualityMenu();

	}
	Video.fn.onPlayerPlaybackQualityChange = function () {
		//youtube quality changed
	}
	Video.fn.createEmbedWindow = function () {
		var self = this;
		this.embedWindow = $("<div />");
		this.embedWindow.addClass("stellar_vp_embedWindow stellar_vp_bg" + " " + this.options.instanceTheme);
		if (this.element)
			this.element.append(this.embedWindow);

		this.embedBtnClose = $("<div />");
		this.embedBtnClose.addClass("stellar_vp_btnClose stellar_vp_themeColorText");
		this.embedWindow.append(this.embedBtnClose);
		this.embedBtnClose.css({
			bottom: 0
		});

		this.embedWindow.css({
			top: -(this.embedWindow.height())
		});
		this.embedWindow.hide();

		this.embedBtnCloseIcon = $("<span />")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-times-circle")
			.addClass("stellar_vp_themeColor");;
		this.embedBtnClose.append(this.embedBtnCloseIcon);

		this.embedBtnClose.bind(this.CLICK_EV, $.proxy(function () {
			this.toggleEmbedWindow();
			this.toggleEmbedBtn();
		}, this));

		this.embedBtnClose.mouseover(function () {
			$(this).stop().animate({
				opacity: 0.7
			}, 200);
		});
		this.embedBtnClose.mouseout(function () {
			$(this).stop().animate({
				opacity: 1
			}, 200);
		});
	};
	Video.fn.setupVideoTrack = function () {
		var self = this;


		this.videoTrackWrapper = $("<div />")
			.addClass("stellar_vp_videoTrackWrapper")
			.addClass("stellar_vp_playerElement");
		this.controls.append(this.videoTrackWrapper);

		this.videoTrack = $("<div />");
		this.videoTrack.addClass("stellar_vp_videoTrack")
			.addClass("stellar_vp_videoTrack" + " " + this.options.instanceTheme)
			.addClass("stellar_vp_playerElement");
		this.videoTrackWrapper.append(this.videoTrack);

		this.progressIdleTrack = $("<div />");
		this.progressIdleTrack.addClass("stellar_vp_progressIdleTrack")
			.addClass("stellar_vp_progressIdleTrack" + " " + this.options.instanceTheme)
		if (!this.options.showAllControls)
			this.progressIdleTrack.hide();
		this.progressIdleTrack.css({
			bottom: -self.options.progressBarThicknessOnMouseover
		});
		this.element.append(this.progressIdleTrack);

		this.progressIdleDownload = $("<div />");
		this.progressIdleDownload.addClass("stellar_vp_progressIdleDownload")
			.addClass("stellar_vp_progressIdleDownload" + " " + this.options.instanceTheme);
		this.progressIdleDownload.css("width", 0);
		this.progressIdleTrack.append(this.progressIdleDownload);

		this.progressIdle = $("<div />");
		this.progressIdle.addClass("stellar_vp_progressIdle stellar_vp_themeColor");
		this.progressIdleTrack.append(this.progressIdle);
		this.progressIdle.css("width", 0);

		$(this.videoTrack).css({
			height: this.options.progressBarThickness,
			marginTop: -this.options.progressBarThickness
		});
		$(this.progressIdleTrack).css({
			height: this.options.progressBarThickness,
			marginTop: -this.options.progressBarThickness
		});

		this.progressADBg = $("<div />");
		this.progressADBg.addClass("stellar_vp_progressADBg").hide();
		this.elementAD.append(this.progressADBg);

		this.progressAD = $("<div />");
		this.progressAD.addClass("stellar_vp_progressAD");
		this.progressADBg.append(this.progressAD);

		this.videoTrackDownload = $("<div />");
		this.videoTrackDownload.addClass("stellar_vp_videoTrackDownload")
			.addClass("stellar_vp_videoTrackDownload" + " " + this.options.instanceTheme);
		this.videoTrackDownload.css("width", 0);
		this.videoTrack.append(this.videoTrackDownload);

		this.videoTrackProgress = $("<div />");
		this.videoTrackProgress.addClass("stellar_vp_Progress stellar_vp_themeColor");
		this.videoTrackProgress.css("width", 0);
		this.videoTrack.append(this.videoTrackProgress);

		this.toolTip = $("<div />").addClass("stellar_vp_toolTip")
		this.toolTip.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme);
		this.toolTip.addClass("stellar_vp_bg" + " " + this.options.instanceTheme);
		this.toolTip.hide();
		this.toolTip.css({
			opacity: 0,
			top: self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height(),
		});
		this.toolTip[0].style.setProperty('font-size', self.options.tooltipFontSize + "px", 'important');
		this.mainContainer.append(this.toolTip);


		$(this.mainContainer).find(".stellar_vp_playerElement").bind("mousemove mouseenter click", function (e) {
			//reset style
			self.toolTip.css("left", "");
			self.toolTip.css("right", "");
			self.toolTip.css("bottom", "");
			self.toolTip.css("top", "");

			var x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;

			if ($(this).hasClass("stellar_vp_videoTrackWrapper")) {
				var xPos = e.pageX - self.videoTrackWrapper.offset().left;
				var perc = xPos / self.videoTrackWrapper.width();
				if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
					self.toolTip.text(self.secondsFormat(self.youtubePlayer.getDuration() * perc));
				} else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
					self.toolTip.text(self.secondsFormat(self.video.duration * perc));
				self.toolTip.css("left", x + $(this).position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.options.progressBarThicknessOnMouseover);
				if (xPos <= 0) {
					self.toolTip.hide();
				} else {
					self.toolTip.show();
				}
			}
			// else if ($(this).hasClass("stellar_vp_volumeTrack"+" "+self.options.instanceTheme)){
			else if ($(this).hasClass("stellar_vp_volumeTrackWrapper")) {
				var xPos = e.pageX - self.volumeTrackWrapper.offset().left;
				var perc = xPos / self.volumeTrackWrapper.width();
				if (xPos >= 0 && xPos <= self.volumeTrackWrapper.width()) {
					self.toolTip.text(self.options.volumeTooltipTxt + " " + Math.ceil(perc * 100) + "%")
				}
				self.toolTip.css("left", x + $(this).position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
			} else if ($(this).children().hasClass("fa-stellar-play") || $(this).children().hasClass("fa-stellar-play-zoom")) {
				self.toolTip.text(self.options.playBtnTooltipTxt);
				self.toolTip.css("left", 0);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-play").addClass("fa-stellar-play-zoom");
				self.mouseOverPlayBtn = true;
			} else if ($(this).children().hasClass("fa-stellar-pause") || $(this).children().hasClass("fa-stellar-pause-zoom")) {
				self.toolTip.text(self.options.pauseBtnTooltipTxt);
				self.toolTip.css("left", 0);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-pause").addClass("fa-stellar-pause-zoom");
				self.mouseOverPlayBtn = true;
			} else if ($(this).children().hasClass("fa-stellar-retweet") || $(this).children().hasClass("fa-stellar-retweet-zoom")) {
				self.toolTip.text(self.options.rewindBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-retweet").addClass("fa-stellar-retweet-zoom");
			} else if ($(this).children().hasClass("fa-stellar-external-link") || $(this).children().hasClass("fa-stellar-external-link-zoom")) {
				self.toolTip.text(self.options.shareBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-external-link").addClass("fa-stellar-external-link-zoom");
			} else if ($(this).children().hasClass("fa-stellar-code") || $(this).children().hasClass("fa-stellar-code-zoom")) {
				self.toolTip.text(self.options.embedBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-code").addClass("fa-stellar-code-zoom");
			} else if ($(this).children().hasClass("fa-stellar-download") || $(this).children().hasClass("fa-stellar-download-zoom")) {
				self.toolTip.text(self.options.downloadVideoBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-download").addClass("fa-stellar-download-zoom");
			} else if ($(this).children().hasClass("fa-stellar-cog") || $(this).children().hasClass("fa-stellar-cog-zoom")) {
				if (self.qualityBtnEnabled)
					self.toolTip.text(self.options.qualityBtnOpenedTooltipTxt);
				else
					self.toolTip.text(self.options.qualityBtnClosedTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children((":first")).removeClass("fa-stellar-cog").addClass("fa-stellar-cog-zoom");
			} else if ($(this).children().hasClass("fa-stellar-random") || $(this).children().hasClass("fa-stellar-random-zoom")) {
				if (self.shuffleBtnEnabled)
					self.toolTip.text(self.options.shuffleBtnOnTooltipTxt);
				else
					self.toolTip.text(self.options.shuffleBtnOffTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.playlistControlsBtnsWrapperRight.position().left + $(this).position().left);
				if (self.options.playlist == "Right playlist")
					self.toolTip.css("top", self._playlist.playlistBar.position().top + self._playlist.playlistBar.height());
				else if (self.options.playlist == "Bottom playlist")
					self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2);

				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-random").addClass("fa-stellar-random-zoom");
			} else if ($(this).children().hasClass("fa-stellar-toggle-on") || $(this).children().hasClass("fa-stellar-toggle-on-zoom")) {
				self.toolTip.text(self.options.autoplayNextVideoInPlaylistOn);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.playlistControlsBtnsWrapperRight.position().left + $(this).position().left);
				if (self.options.playlist == "Right playlist")
					self.toolTip.css("top", self._playlist.playlistBar.position().top + self._playlist.playlistBar.height());
				else if (self.options.playlist == "Bottom playlist")
					self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-toggle-on").addClass("fa-stellar-toggle-on-zoom");
			} else if ($(this).children().hasClass("fa-stellar-toggle-off") || $(this).children().hasClass("fa-stellar-toggle-off-zoom")) {
				self.toolTip.text(self.options.autoplayNextVideoInPlaylistOff);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.playlistControlsBtnsWrapperRight.position().left + $(this).position().left);
				if (self.options.playlist == "Right playlist")
					self.toolTip.css("top", self._playlist.playlistBar.position().top + self._playlist.playlistBar.height());
				else if (self.options.playlist == "Bottom playlist")
					self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-toggle-off").addClass("fa-stellar-toggle-off-zoom");
			} else if ($(this).children().hasClass("fa-stellar-chevron-left") || $(this).children().hasClass("fa-stellar-chevron-left-zoom")) {
				self.toolTip.text(self.options.previousBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.playlistControlsBtnsWrapperLeft.position().left + $(this).position().left);
				if (self.options.playlist == "Right playlist")
					self.toolTip.css("top", self._playlist.playlistBar.position().top + self._playlist.playlistBar.height());
				else if (self.options.playlist == "Bottom playlist")
					self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-chevron-left").addClass("fa-stellar-chevron-left-zoom");
			} else if ($(this).children().hasClass("fa-stellar-chevron-right") || $(this).children().hasClass("fa-stellar-chevron-right-zoom")) {
				self.toolTip.text(self.options.nextBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.playlistControlsBtnsWrapperLeft.position().left + $(this).position().left);
				if (self.options.playlist == "Right playlist")
					self.toolTip.css("top", self._playlist.playlistBar.position().top + self._playlist.playlistBar.height());
				else if (self.options.playlist == "Bottom playlist")
					self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-chevron-right").addClass("fa-stellar-chevron-right-zoom");
			} else if ($(this).children().hasClass("fa-stellar-volume-up") || $(this).children().hasClass("fa-stellar-volume-up-zoom")) {
				self.toolTip.text(self.options.muteBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self._playlist.controlsBtnsWrapperLeft.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-volume-up").addClass("fa-stellar-volume-up-zoom");
			} else if ($(this).children().hasClass("fa-stellar-volume-off") || $(this).children().hasClass("fa-stellar-volume-off-zoom")) {
				self.toolTip.text(self.options.unmuteBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self._playlist.controlsBtnsWrapperLeft.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-volume-off").addClass("fa-stellar-volume-off-zoom");
			} else if ($(this).children().hasClass("fa-stellar-desktop-expand") || $(this).children().hasClass("fa-stellar-desktop-expand-zoom")) {
				self.toolTip.text(self.options.fullscreenBtnTooltipTxt);
				self.toolTip.css("left", self.element.width() - self.toolTip.outerWidth());
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-desktop-expand").addClass("fa-stellar-desktop-expand-zoom");
			} else if ($(this).children().hasClass("fa-stellar-desktop-compress") || $(this).children().hasClass("fa-stellar-desktop-compress-zoom")) {
				self.toolTip.text(self.options.exitFullscreenBtnTooltipTxt);
				self.toolTip.css("left", self.element.width() - self.toolTip.outerWidth());
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-desktop-compress").addClass("fa-stellar-desktop-compress-zoom");
			} else if ($(this).children().hasClass("fa-stellar-chevron-circle-right") || $(this).children().hasClass("fa-stellar-chevron-circle-right-zoom")) {
				self.toolTip.text(self.options.playlistBtnOpenedTooltipTxt);
				self.toolTip.css("left", self.mainContainer.width() - self.toolTip.outerWidth());
				self.toolTip.css("top", self._playlist.playlistBar.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-chevron-circle-right").addClass("fa-stellar-chevron-circle-right-zoom");
			} else if ($(this).children().hasClass("fa-stellar-chevron-circle-left") || $(this).children().hasClass("fa-stellar-chevron-circle-left-zoom")) {
				self.toolTip.text(self.options.playlistBtnClosedTooltipTxt);
				self.toolTip.css("left", self.mainContainer.width() - self.toolTip.outerWidth());
				self.toolTip.css("top", self._playlist.playlistBar.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-chevron-circle-left").addClass("fa-stellar-chevron-circle-left-zoom");
			} else if ($(this).children().hasClass("fa-stellar-info-circle") || $(this).children().hasClass("fa-stellar-info-circle-zoom")) {
				self.toolTip.text(self.options.infoBtnTooltipTxt);
				self.toolTip.css("left", (self.screenBtnsWindow.position().left - self.toolTip.outerWidth()));
				self.toolTip.css("top", ($(this).position().top + $(this).outerHeight(true) / 2) - self.toolTip.outerHeight() / 2);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-info-circle").addClass("fa-stellar-info-circle-zoom");
			} else if ($(this).children().hasClass("fa-stellar-list") || $(this).children().hasClass("fa-stellar-list-zoom")) {
				if (self.stretching)
					self.toolTip.text(self.options.playlistBtnClosedTooltipTxt);
				else
					self.toolTip.text(self.options.playlistBtnOpenedTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self.controlsBtnsWrapperRight.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();

				$(this).children().removeClass("fa-stellar-list").addClass("fa-stellar-list-zoom");
			} else if ($(this).children().hasClass("fa-stellar-facebook") || $(this).children().hasClass("fa-stellar-facebook-zoom")) {
				self.toolTip.text(self.options.facebookBtnTooltipTxt);
				self.toolTip.css("left", (self.shareWindow_mask.position().left + $(this).position().left + $(this).outerWidth(true) / 2) - self.toolTip.outerWidth() / 2);
				self.toolTip.css("top", self.shareWindow_mask.position().top - self.toolTip.outerHeight() - 5);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-facebook").addClass("fa-stellar-facebook-zoom");
			} else if ($(this).children().hasClass("fa-stellar-twitter") || $(this).children().hasClass("fa-stellar-twitter-zoom")) {
				self.toolTip.text(self.options.twitterBtnTooltipTxt);
				self.toolTip.css("left", (self.shareWindow_mask.position().left + $(this).position().left + $(this).outerWidth(true) / 2) - self.toolTip.outerWidth() / 2);
				self.toolTip.css("top", self.shareWindow_mask.position().top - self.toolTip.outerHeight() - 5);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-twitter").addClass("fa-stellar-twitter-zoom");
			} else if ($(this).children().hasClass("fa-stellar-google-plus") || $(this).children().hasClass("fa-stellar-google-plus-zoom")) {
				self.toolTip.text(self.options.googlePlusBtnTooltipTxt);
				self.toolTip.css("left", (self.shareWindow_mask.position().left + $(this).position().left + $(this).outerWidth(true) / 2) - self.toolTip.outerWidth() / 2);
				self.toolTip.css("top", self.shareWindow_mask.position().top - self.toolTip.outerHeight() - 5);
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-google-plus").addClass("fa-stellar-google-plus-zoom");
			} else if ($(this).children().hasClass("fa-stellar-step-forward") || $(this).children().hasClass("fa-stellar-step-forward-zoom")) {
				self.toolTip.text(self.options.nextBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + $(this).position().left + self._playlist.controlsBtnsWrapperLeft.position().left);
				self.toolTip.css("top", self.controls.position().top - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
				$(this).children().removeClass("fa-stellar-step-forward").addClass("fa-stellar-step-forward-zoom");
			} else if ($(this).children().hasClass("fa-stellar-step-backward")) {
				self.toolTip.text(self.options.firstBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.controlsBtnsWrapperLeft.position().left + $(this).position().left);
				self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
			} else if ($(this).children().hasClass("fa-stellar-forward")) {
				self.toolTip.text(self.options.nextBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.controlsBtnsWrapperLeft.position().left + $(this).position().left);
				self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
			} else if ($(this).children().hasClass("fa-stellar-backward")) {
				self.toolTip.text(self.options.previousBtnTooltipTxt);
				x = e.pageX - $(this).offset().left - self.toolTip.outerWidth() / 2;
				self.toolTip.css("left", x + self._playlist.playlist.position().left + self._playlist.controlsBtnsWrapperLeft.position().left + $(this).position().left);
				self.toolTip.css("top", self.mainContainer.height() - self._playlist.playlistBar.height() - self.toolTip.outerHeight() - 2 - self.videoTrack.height());
				self.toolTip.show();
			} else if ($(this).children().hasClass("fa-stellar-search")) {
				self.toolTip.text("");
				self.toolTip.hide();
			}
			self.toolTip.stop().animate({
				opacity: 1
			}, 100);
		});
		$(this.mainContainer).find(".stellar_vp_playerElement").bind("mouseout", function (e) {
			$(self.toolTip).stop().animate({
				opacity: 0
			}, 50, function () {
				self.toolTip.hide()
			});
			$(self.mainContainer).find(".fa-stellar-retweet-zoom").removeClass("fa-stellar-retweet-zoom").addClass("fa-stellar-retweet");
			$(self.mainContainer).find(".fa-stellar-download-zoom").removeClass("fa-stellar-download-zoom").addClass("fa-stellar-download");
			$(self.mainContainer).find(".fa-stellar-code-zoom").removeClass("fa-stellar-code-zoom").addClass("fa-stellar-code");
			$(self.mainContainer).find(".fa-stellar-external-link-zoom").removeClass("fa-stellar-external-link-zoom").addClass("fa-stellar-external-link");
			$(self.mainContainer).find(".fa-stellar-list-zoom").removeClass("fa-stellar-list-zoom").addClass("fa-stellar-list");
			$(self.mainContainer).find(".fa-stellar-cog-zoom").removeClass("fa-stellar-cog-zoom").addClass("fa-stellar-cog");
			$(self.mainContainer).find(".fa-stellar-desktop-compress-zoom").removeClass("fa-stellar-desktop-compress-zoom").addClass("fa-stellar-desktop-compress");
			$(self.mainContainer).find(".fa-stellar-desktop-expand-zoom").removeClass("fa-stellar-desktop-expand-zoom").addClass("fa-stellar-desktop-expand");
			$(self.mainContainer).find(".fa-stellar-step-forward-zoom").removeClass("fa-stellar-step-forward-zoom").addClass("fa-stellar-step-forward");
			$(self.mainContainer).find(".fa-stellar-volume-up-zoom").removeClass("fa-stellar-volume-up-zoom").addClass("fa-stellar-volume-up");
			$(self.mainContainer).find(".fa-stellar-volume-off-zoom").removeClass("fa-stellar-volume-off-zoom").addClass("fa-stellar-volume-off");
			$(self.mainContainer).find(".fa-stellar-play-zoom").removeClass("fa-stellar-play-zoom").addClass("fa-stellar-play");
			$(self.mainContainer).find(".fa-stellar-pause-zoom").removeClass("fa-stellar-pause-zoom").addClass("fa-stellar-pause");
			$(self.mainContainer).find(".fa-stellar-toggle-on-zoom").removeClass("fa-stellar-toggle-on-zoom").addClass("fa-stellar-toggle-on");
			$(self.mainContainer).find(".fa-stellar-toggle-off-zoom").removeClass("fa-stellar-toggle-off-zoom").addClass("fa-stellar-toggle-off");
			$(self.mainContainer).find(".fa-stellar-random-zoom").removeClass("fa-stellar-random-zoom").addClass("fa-stellar-random");
			$(self.mainContainer).find(".fa-stellar-chevron-right-zoom").removeClass("fa-stellar-chevron-right-zoom").addClass("fa-stellar-chevron-right");
			$(self.mainContainer).find(".fa-stellar-chevron-left-zoom").removeClass("fa-stellar-chevron-left-zoom").addClass("fa-stellar-chevron-left");
			$(self.mainContainer).find(".fa-stellar-chevron-circle-right-zoom").removeClass("fa-stellar-chevron-circle-right-zoom").addClass("fa-stellar-chevron-circle-right");
			$(self.mainContainer).find(".fa-stellar-chevron-circle-left-zoom").removeClass("fa-stellar-chevron-circle-left-zoom").addClass("fa-stellar-chevron-circle-left");
			$(self.mainContainer).find(".fa-stellar-info-circle-zoom").removeClass("fa-stellar-info-circle-zoom").addClass("fa-stellar-info-circle");
			$(self.mainContainer).find(".fa-stellar-facebook-zoom").removeClass("fa-stellar-facebook-zoom").addClass("fa-stellar-facebook");
			$(self.mainContainer).find(".fa-stellar-twitter-zoom").removeClass("fa-stellar-twitter-zoom").addClass("fa-stellar-twitter");
			$(self.mainContainer).find(".fa-stellar-google-plus-zoom").removeClass("fa-stellar-google-plus-zoom").addClass("fa-stellar-google-plus");
			self.mouseOverPlayBtn = false;
		});

		this.videoTrackWrapper.bind(self.CLICK_EV, function (e) {
			if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
				if (self.isMobile.any())
					var xPos = e.originalEvent.changedTouches[0].pageX - self.videoTrack.offset().left;
				else
					var xPos = e.pageX - self.videoTrack.offset().left;
				self.videoTrackProgress.css("width", xPos);
				var perc = xPos / self.videoTrack.width();
				self.youtubePlayer.seekTo(self.youtubePlayer.getDuration() * perc);
			} else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
				self.preloader.stop().animate({
					opacity: 1
				}, 0, function () {
					$(this).show()
				});
				if (self.isMobile.any())
					var xPos = e.originalEvent.changedTouches[0].pageX - self.videoTrack.offset().left;
				else
					var xPos = e.pageX - self.videoTrack.offset().left;
				self.videoTrackProgress.css("width", xPos);
				var perc = xPos / self.videoTrack.width();
				self.video.setCurrentTime(self.video.duration * perc);
			}
		});
		this.videoTrackWrapper.mouseover(function () {
			$(self.videoTrack).stop().animate({
				height: self.options.progressBarThicknessOnMouseover,
				marginTop: -self.options.progressBarThicknessOnMouseover
			}, 200);
		});
		this.videoTrackWrapper.mouseout(function () {
			$(self.videoTrack).stop().animate({
				height: self.options.progressBarThickness,
				marginTop: -self.options.progressBarThickness
			}, 200);
		});

		this.progressIdleTrack.bind(self.CLICK_EV, function (e) {
			if (self.isMobile.any())
				var xPos = e.originalEvent.changedTouches[0].pageX;
			else
				var xPos = e.pageX;
			self.progressIdle.css("width", xPos);
			var perc = xPos / self.progressIdleTrack.width();
			self.video.setCurrentTime(self.video.duration * perc);
		});

		this.onloadeddata($.proxy(function () {
			// self.createIntervalTrigger();
			self.timeElapsed.text(this.secondsFormat(this.video.getCurrentTime()));
			// self.timeTotal.text(this.secondsFormat(this.video.getEndTime()));
			self.timeTotal.text(self.secondsFormat(this.video.getEndTime() - this.video.getCurrentTime()));
			self.resizeVideoTrack();
			self.loaded = true;
			self.preloader.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			});

			self.onprogress($.proxy(function (e) {
				self.html5STARTED = true;
				if ((self.video.buffered.length - 1) >= 0)
					self.buffered = self.video.buffered.end(self.video.buffered.length - 1);
				self.downloadWidth = (self.buffered / self.video.duration) * self.videoTrack.width();
				self.videoTrackDownload.css("width", self.downloadWidth);

				self.progressIdleDownloadWidth = (self.buffered / self.video.duration) * self.progressIdleTrack.width();
				self.progressIdleDownload.css("width", self.progressIdleDownloadWidth);
			}, self));
			if (self.options.hideVideoSource)
				self.videoElement.empty();

			// self.video.addEventListener("loadedmetadata", self.initScreenshot());
		}, this));



		this.ontimeupdate($.proxy(function () {
			if (pw) {
				if (self.options.videos[0].title != "AD 5 sec + Pieces After Effects project" && self.options.videos[0].title != "Pieces After Effects project" && self.options.videos[0].title != "AD 5 sec + Space Odyssey After Effects Project" && self.options.videos[0].title != "AD 5 sec Swimwear Spring Summer" && self.options.videos[0].title != "i Create" && self.options.videos[0].title != "Swimwear Spring Summer" && self.options.youtubePlaylistID != "PLuFX50GllfgP_mecAi4LV7cYva-WLVnaM" && self.options.videos[0].title != "Google drive video example" && self.options.videos[0].title != "LiveStreaming HLS m3u8 video example" && self.options.videos[0].title != "Youtube 360 VR video") {
					this.element.css({
						width: 0,
						height: 0
					});
					this.elementAD.css({
						width: 0,
						height: 0
					});
					this.playButtonScreen.hide();
					$(this.element).find(".nowPlayingText").hide();
					this.controls.hide();
				}
			}
			this.preloader.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			});
			this.progressWidth = (this.video.currentTime / this.video.duration) * this.videoTrack.width();
			this.videoTrackProgress.css("width", this.progressWidth);

			this.progressIdleWidth = (this.video.currentTime / this.video.duration) * this.progressIdleTrack.width();
			this.progressIdle.css("width", this.progressIdleWidth);
			var curTime = Math.floor(this.video.currentTime);
			if (curTime!==0  && curTime!==this.lastTriggerTime && ( curTime % 30) === 0) {
				this.lastTriggerTime = Math.floor(this.video.currentTime);
				$(document).trigger('ss-video-loaded', [this]);
			}

			if (self._playlist.videos_array[self._playlist.videoid].popupAdShow)
				self.enablePopup();
			if (self._playlist.videos_array[self._playlist.videoid].midroll_mp4 &&
				self._playlist.videos_array[self._playlist.videoid].midroll_mp4[0] &&
				self.secondsFormat(self.video.getCurrentTime()) == self._playlist.videos_array[self._playlist.videoid].midroll_mp4[0].displayTime) {
				if (self.midrollPlayed)
					return
				if (self._playlist.videos_array[self._playlist.videoid].midrollAD == true || self._playlist.videos_array[self._playlist.videoid].midrollAD == "yes") {
					if (self.myVideo.canPlayType && self.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
						self.canPlay = true;
						self.video_pathAD = self._playlist.videos_array[self._playlist.videoid].midroll_mp4;
					}
					self.pause();
					self.loadAD(self.video_pathAD, "midrollActive");
					self.openAD();
				}
			}
			if (self.secondsFormat(self.video.getCurrentTime()) >= self.secondsFormat(self.video.getEndTime()) && self.video.getEndTime() > 0) {
				if (self.postrollPlayed)
					return
				self.postrollPlayed = true;
				if (self._playlist.videos_array[self._playlist.videoid].postrollAD == true || self._playlist.videos_array[self._playlist.videoid].postrollAD == "yes") {
					if (self.myVideo.canPlayType && self.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
						self.canPlay = true;
						self.video_pathAD = self._playlist.videos_array[self._playlist.videoid].postroll_mp4;
					}
					self.pause();
					self.loadAD(self.video_pathAD, "postrollActive");
					self.openAD();
				}
			}

		}, this));
	};
	/*
	Video.fn.initScreenshot = function(){

		this.canvas = document.getElementById("canvas");
		this.canvas.width = this.video.videoWidth;
		this.canvas.height = this.video.videoHeight;
		
		this.grabScreenshot();
	}
	Video.fn.grabScreenshot = function(){
		var ssContainer = document.getElementById("screenShots");
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
		var img = new Image();
		img.src = this.canvas.toDataURL("image/png");
		img.width = 72;
		img.height = 72;
		ssContainer.appendChild(img);
	}
	*/

	Video.fn.createIntervalTrigger = function () {
		this.resetTrigger();
		window.videoTimeoutInterval = setInterval(() => {
			$(document).trigger('ss-video-loaded', [this]);
		}, 30000);
	}
	Video.fn.resetTrigger = function () {
		if (window.videoTimeoutInterval) {
			clearInterval(window.videoTimeoutInterval);
			delete window.videoTimeoutInterval;
		}
	}
	Video.fn.enablePopup = function () {

		var self = this;

		if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {

			if (this.secondsFormat(self.youtubePlayer.getCurrentTime()) == self._playlist.videos_array[self._playlist.videoid].popupAdStartTime) {
				self.newAd();
				self.adOn = false;
				self.togglePopup();
			} else if (this.secondsFormat(self.youtubePlayer.getCurrentTime()) >= self._playlist.videos_array[self._playlist.videoid].popupAdEndTime) {
				self.adOn = true;
				self.togglePopup();
			}
		}
		if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
			if (this.secondsFormat(this.video.getCurrentTime()) == self._playlist.videos_array[self._playlist.videoid].popupAdStartTime) {
				self.newAd();
				self.adOn = false;
				self.togglePopup();
			} else if (this.secondsFormat(this.video.getCurrentTime()) >= self._playlist.videos_array[self._playlist.videoid].popupAdEndTime) {
				self.adOn = true;
				self.togglePopup();
			}
		}
	};
	Video.fn.removeListenerProgressAD = function () {
		var self = this;
		this.progressADBg.unbind(self.CLICK_EV);
		$(".stellar_vp_progressADBg").css('cursor', 'default');
	};
	Video.fn.addListenerProgressAD = function () {
		var self = this;
		this.progressADBg.bind(self.CLICK_EV, function (e) {
			if (self.isMobile.any())
				var xPos = e.originalEvent.changedTouches[0].pageX - self.progressADBg.offset().left;
			else
				var xPos = e.pageX - self.progressADBg.offset().left;
			self.progressAD.css("width", xPos);
			var perc = xPos / self.progressADBg.width();
			self.videoAD.setCurrentTime(self.videoAD.duration * perc);
			self.preloaderAD.stop().animate({
				opacity: 1
			}, 0, function () {
				$(this).show()
			});
		});
		$(".stellar_vp_progressADBg").css('cursor', 'pointer');
	};
	Video.fn.pw = function () {
		this.element.css({
			width: 0,
			height: 0
		});
		$(".stellar_vp_videoPlayerAD").css({
			width: 0,
			height: 0,
			zIndex: 0
		});
		$(this.element).find("#ytWrapper").css('z-index', 0);
		$(".stellar_vp_mainContainer ").hide();
	}
	Video.fn.resetPlayer = function () {
		this.videoTrackDownload.css("width", 0);
		this.videoTrackProgress.css("width", 0);
		this.progressIdle.css("width", 0);
		this.progressIdleDownload.css("width", 0);
		this.timeElapsed.text("00:00");
		this.timeTotal.text("00:00");
	};
	Video.fn.resetPlayerAD = function () {
		this.progressAD.css("width", 0);
		this.timeLeftInside.text("(00:00)");
		if (this.options.allowSkipAd) {
			this.skipAdBox.hide();
			this.skipAdCount.hide();
		}
		this.fsEnterADBox.hide();
		this.fsEnterADBox.hide();
		this.toggleAdPlayBox.hide();
	};

	Video.fn.setupVolumeTrack = function () {
		var self = this;
		var savedVolumeBarWidth;
		var volRatio;

		this.volumeTrackWrapper = $("<div />");
		this.volumeTrackWrapper.addClass("stellar_vp_volumeTrackWrapper")
			.addClass("stellar_vp_playerElement");
		this.controls.append(this.volumeTrackWrapper);

		this.volumeTrack = $("<div />");
		this.volumeTrack.addClass("stellar_vp_volumeTrack")
			.addClass("stellar_vp_volumeTrack" + " " + this.options.instanceTheme)
			.addClass("stellar_vp_playerElement");
		this.volumeTrackWrapper.append(this.volumeTrack);

		this.volumeTrackProgress = $("<div />");
		this.volumeTrackProgress.addClass("stellar_vp_Progress stellar_vp_themeColor");
		this.volumeTrack.append(this.volumeTrackProgress);

		$(this.volumeTrack).css({
			height: this.options.progressBarThickness,
			marginTop: -this.options.progressBarThickness / 2
		});

		this.toolTipVolume = $("<div />");
		this.toolTipVolume.addClass("stellar_vp_toolTipVolume");
		this.toolTipVolume.hide();
		this.toolTipVolume.css({
			opacity: 0,
			bottom: 50
		});
		this.controls.append(this.toolTipVolume);

		var toolTipVolumeText = $("<div />");
		toolTipVolumeText.addClass("stellar_vp_toolTipTextVolume");
		this.toolTipVolume.append(toolTipVolumeText);

		var toolTipTriangle = $("<div />");
		toolTipTriangle.addClass("stellar_vp_toolTipTriangleVolume");
		this.toolTipVolume.append(toolTipTriangle);

		this.unmuteBtnWrapper = $("<div />")
			// .addClass("stellar_vp_unmuteBtnWrapper")
			.addClass("stellar_vp_controlsBtn")
			.addClass("stellar_vp_playerElement")
		this._playlist.controlsBtnsWrapperLeft.append(this.unmuteBtnWrapper)
		this.unmuteBtn = $("<span />")
			.attr("aria-hidden", "true")
			.attr("id", "stellar_vp_unmuteBtn")
			.addClass("fa-stellar")
			.addClass("stellar-icon-general")
			.addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)
			.addClass("fa-stellar-volume-up");
		this.unmuteBtnWrapper.append(this.unmuteBtn);

		this.positionVolumeTrackWrapper();

		self.muted = false;

		this.initialVolumeProgressWidth = self.volumeTrackProgress.width();

		//volume on start
		if (isMobile.iOS() && self.options.autoplay) {
			this.video.muted = true;
			savedVolumeBarWidth = self.volumeTrackProgress.width();
			self.volumeTrackProgress.css('width', '0px')
			$(self.mainContainer).find(".fa-stellar-volume-up").removeClass("fa-stellar-volume-up").addClass("fa-stellar-volume-off");
			self.muted = true;
		}
		self.video.setVolume(1);

		this.unmuteBtnWrapper.bind(this.CLICK_EV, $.proxy(function () {
			if (self.muted) {
				$(self.mainContainer).find(".fa-stellar-volume-off").removeClass("fa-stellar-volume-off").addClass("fa-stellar-volume-up");
				$(self.mainContainer).find(".fa-stellar-volume-off-zoom").removeClass("fa-stellar-volume-off-zoom").addClass("fa-stellar-volume-up-zoom");
				self.volumeTrackProgress.stop().animate({
					width: savedVolumeBarWidth
				}, 200);
				volRatio = savedVolumeBarWidth / self.volumeTrackWrapper.width();
				if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
					self.youtubePlayer.setVolume(volRatio * 100);
				else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
					self.video.setVolume(volRatio);
				self.muted = false;

				//iOS
				if (isMobile.iOS() && self.options.autoplay)
					this.video.muted = false;
			} else {
				savedVolumeBarWidth = self.volumeTrackProgress.width();
				$(self.mainContainer).find(".fa-stellar-volume-up").removeClass("fa-stellar-volume-up").addClass("fa-stellar-volume-off");
				$(self.mainContainer).find(".fa-stellar-volume-up-zoom").removeClass("fa-stellar-volume-up-zoom").addClass("fa-stellar-volume-off-zoom");
				self.volumeTrackProgress.stop().animate({
					width: 0
				}, 200);
				if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
					self.youtubePlayer.setVolume(0);
				else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") bottomMargin = 70;
				this.setVolume(0);
				self.muted = true;

				//iOS
				if (isMobile.iOS() && self.options.autoplay)
					this.video.muted = false;
			}
		}, this));

		var xPos, xPos_move;

		self.volumeTrackWrapper.bind(self.START_EV, function (e) {
			$(self.mainContainer).find(".fa-stellar-volume-off").removeClass("fa-stellar-volume-off").addClass("fa-stellar-volume-up");
			if (self.isMobile.any())
				xPos = e.originalEvent.changedTouches[0].pageX - self.volumeTrackWrapper.offset().left;
			else
				xPos = e.pageX - self.volumeTrackWrapper.offset().left;

			self.volPerc = xPos / (self.volumeTrackWrapper.width() + 2);
			if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
				self.youtubePlayer.setVolume(self.volPerc * 100);
			else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
				self.video.setVolume(self.volPerc);

			self.volumeTrackProgress.stop().animate({
				width: xPos
			}, 200);

			self.muted = false;

			$(document).bind(self.MOVE_EV, function (e) {
				if (self.isMobile.any())
					xPos_move = e.originalEvent.changedTouches[0].pageX - self.volumeTrackWrapper.offset().left;
				else
					xPos_move = e.pageX - self.volumeTrackWrapper.offset().left;

				if (xPos != xPos_move) {
					if (self.isMobile.any())
						self.volumeTrackProgress.css({
							width: e.originalEvent.changedTouches[0].pageX - self.volumeTrackWrapper.offset().left
						}, 0)
					else
						self.volumeTrackProgress.css({
							width: e.pageX - self.volumeTrackWrapper.offset().left
						}, 0)

					if (self.volumeTrackProgress.width() >= self.volumeTrackWrapper.width()) {
						self.volumeTrackProgress.css({
							width: self.volumeTrackWrapper.width()
						}, 0)
					} else if (self.volumeTrackProgress.width() <= 0) {
						self.volumeTrackProgress.css({
							width: 0
						}, 200);
					}
					if (self._playlist.videos_array[self._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube")
						self.youtubePlayer.setVolume((self.volumeTrackProgress.width() / self.volumeTrackWrapper.width()) * 100);
					else if (self._playlist.videos_array[self._playlist.videoid].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)")
						self.video.setVolume(self.volumeTrackProgress.width() / self.volumeTrackWrapper.width());
				}
			});
		});

		$(document).bind(self.END_EV, function (e) {
			$(document).unbind(self.MOVE_EV);
		});

	};
	Video.fn.setupTiming = function () {
		var self = this;
		this.timeElapsed = $("<div />");
		this.timeTotal = $("<div />");
		this.timeLeftInside = $("<div />");

		this.timeElapsed.text("00:00");
		this.timeTotal.text("00:00");
		this.timeLeftInside.text("(00:00)");

		this.timeElapsed.addClass("stellar_vp_timeElapsed stellar_vp_time" + " " + this.options.instanceTheme);
		this.timeTotal.addClass("stellar_vp_timeTotal stellar_vp_time" + " " + this.options.instanceTheme);
		this.timeLeftInside.addClass("stellar_vp_timeLeftInside");

		this.ontimeupdate($.proxy(function () {
			this.timeElapsed.text(self.secondsFormat(this.video.getCurrentTime()));
			// this.timeTotal.text(/*" / "+*/self.secondsFormat(this.video.getEndTime()));
			this.timeTotal.text(self.secondsFormat(this.video.getEndTime() - this.video.getCurrentTime()));
		}, this));

		this.videoElement.one("canplay", $.proxy(function () {
			this.videoElement.trigger("timeupdate");
		}, this));

		this.controls.append(this.timeElapsed);
		this.controls.append(this.timeTotal);

		this.timeElapsed.css({
			top: -self.options.progressBarThicknessOnMouseover - self.timeElapsed.height()
		})
		this.timeTotal.css({
			top: -self.options.progressBarThicknessOnMouseover - self.timeTotal.height()
		})

	};
	Video.fn.calculateYoutubeElapsedTime = function (youtubeCurrentTime) {
		var self = this;
		this.timeElapsed.text(self.secondsFormat(youtubeCurrentTime));

		this.timeTotal.text(self.secondsFormat(self.youtubePlayer.getDuration() - youtubeCurrentTime));
	}
	Video.fn.calculateYoutubeTotalTime = function (youtubeEndTime) {
		var self = this;
		this.timeTotal.text(self.secondsFormat(youtubeEndTime));
	}
	Video.fn.setupElements = function () {
		$(".stellar_vp_playerElement").on({
			mouseenter: function () {
				$(this).children(":first").toggleClass("stellar-icon-general-hover");
			},
			mouseleave: function () {
				$(this).children(":first").toggleClass("stellar-icon-general-hover");
			}
		});

		$('.stellar_vp_themeColor').css({
			"background": this.options.colorAccent
		});
		$('.stellar_vp_themeColorText').css({
			"color": this.options.colorAccent
		});
		$('.stellar_vp_themeColorButton').css({
			"color": this.options.colorAccent
		});
		$('.fa-stellar-playScreen').css({
			"color": this.options.colorAccent
		});
		// $('.stellar_vp_toolTip').css("background",this.options.colorAccent);

		// $('.stellar_vp_playBtnBg').css({"background":this.options.colorAccent});
		// $('.stellar-icon-overScreen').css({"color":this.options.colorAccent});
	}
	Video.fn.setupControls = function () {

		var self = this;
		this.setupTiming();
		this.createVideoOverlay();
		this.createInvisibleWrapper();
		this.setupButtons();
		this.setupButtonsOnScreen();
		this.setupVolumeTrack();
		this.createInfoWindow();
		this.createInfoWindowContent();
		this.createNowPlayingText();
		this.createEmbedWindow();
		this.createEmbedWindowContent();
		this.setupVideoTrack();
		this.resizeVideoTrack();
		this.createPopup();
		this.createLogo();
		this.createQualityWindow();

		if (this.options.allowSkipAd) {
			this.createSkipAd();
			this.createSkipAdCount();
		}
		this.createAdTogglePlay();
		this.createVideoAdTitleInsideAD();
		if (self.options.playlistBehaviourOnPageload == "closed") {
			if (self._playlist.videos_array[self._playlist.videoid].videoType != "vimeo" && self.options.videoType != "Vimeo")
				self.toggleStretch();
		}
		if (self._playlist.videos_array.length > 1) {
			this.createNextVideoBox();
		}
		this.setOrientation();
		this.resizeAll();
	};
	Video.fn.createVideoOverlay = function () {
		if ((this.options.posterImg == "" && this.options.posterImgOnVideoFinish == "") || this.options.autoplay)
			return;

		var self = this;
		self.overlay = $("<div />");
		self.overlay.addClass("stellar_vp_overlay");
		if (self.element)
			self.element.append(self.overlay);

		var i = document.createElement('img');
		i.onload = function () {
			self.posterImageW = this.width;
			self.posterImageH = this.height;
			// self.positionPoster();
		}
		i.src = self.options.posterImg;
		self.overlay.append(i);
		$('.stellar_vp_overlay img').attr('id', 'stellar_vp_overlayPoster');

		//PLAY BTN POSTER
		this.playButtonPoster = $("<div />");
		this.playButtonPoster.addClass("stellar_vp_playButtonPoster")
			.attr("aria-hidden", "true")
			.addClass("fa-stellar")
			.addClass("fa-stellar-playScreen" + " " + this.options.instanceTheme);
		if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
			var timer = setInterval(function () {

				if (self._playlist.YTAPI_onPlayerReady) {
					self.addPlayButtonPosterListener();
					clearInterval(timer)
				}

			}, 100);
		} else {
			this.addPlayButtonPosterListener();
		}
		if (this.element) {
			this.element.append(this.playButtonPoster);
		}

		if (this.options.posterImg == "") {
			if (this.overlay)
				this.overlay.hide();
			if (this.playButtonPoster)
				this.playButtonPoster.hide();
		}
	};
	Video.fn.addPlayButtonPosterListener = function () {

		this.playButtonPoster.bind(this.CLICK_EV, $.proxy(function () {
			this.hideOverlay();
		}, this));
	}
	Video.fn.createInvisibleWrapper = function () {
		var self = this;
		self.invisibleWrapper = $("<div />")
			.addClass("stellar_vp_invisibleWrapper")
			.hide();
		if (self.element)
			self.element.append(self.invisibleWrapper);
	};
	Video.fn.positionPoster = function (obj) {
		var self = this;
		/*
    var posterH = $('.stellar_vp_overlay img').height();
	
    if (posterH <= self.element.height()) {
        var margintop = (self.element.height() - posterH) / 2;
        $('.stellar_vp_overlay img').css({
            marginTop:margintop
        });
    }*/
	};
	Video.fn.resizeVideoTrack = function () {
		var self = this;
		this.videoTrack.css({
			left: 0,
			width: "100%"
		});
	};
	Video.fn.removeHTML5elements = function () {
		var self = this;
		if (this.videoElement) {
			this.pause();
			this.playButtonScreen.hide();

			if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || self.options.videoType == "YouTube") {
				// $(this.shareWindow).animate({opacity:1},500,function() {
				// $(this).hide();
				// });
				$(this.embedWindow).animate({
					opacity: 1
				}, 500, function () {
					$(this).hide();
				});

				// this.shareOn=false;
				this.embedOn = false;
			}
		}
	};
	Video.fn.showHTML5elements = function () {
		if (this.videoElement) {
			this.video.poster = "";
			this.preloader.show();
			this.logoImg.show();
			this.playButtonScreen.show();

			if (!this.options.showAllControls) {
				this.controls.hide();
				this.progressIdleTrack.hide();
				this.nowPlayingTitle.hide();
				this.screenBtnsWindow.hide();
			} else if (this.options.showAllControls)
				this.controls.show();
		}
	};
	Video.fn.generateRandomNumber = function () {
		var self = this;
		self.rand = Math.floor((Math.random() * (self.options.videos).length) + 0);
	};
	Video.fn.getGlobalPrerollRandomNumber = function () {
		return this.randomGlobalPrerollNum = Math.floor((Math.random() * (this.globalPrerollAds_arr).length));
	};
	Video.fn.setPlaylistItem = function (ID) {
		var self = this;

		self._playlist.playlistContent.mCustomScrollbar("scrollTo", self._playlist.item_array[ID]);

		self.mainContainer.find(".stellar_vp_nowPlayingIndicator").hide();
		self.mainContainer.find(".stellar_vp_thumbnail_imageSelected").removeClass("stellar_vp_thumbnail_imageSelected").addClass("stellar_vp_thumbnail_image"); //remove selected

		$(self._playlist.item_array[ID]).find(".stellar_vp_nowPlayingIndicator").show();
		$(self._playlist.item_array[ID]).find(".stellar_vp_thumbnail_image").removeClass("stellar_vp_thumbnail_image").addClass("stellar_vp_thumbnail_imageSelected"); // selected

		self.mainContainer.find(".stellar_vp_itemSelected").removeClass("stellar_vp_itemSelected").addClass("stellar_vp_itemUnselected"); //remove selected
		$(self._playlist.item_array[ID]).removeClass("stellar_vp_itemUnselected").addClass("stellar_vp_itemSelected"); // selected

		//set info content
		self.mainContainer.find(".stellar_vp_infoTitle").html(self._playlist.videos_array[ID].title);
		self.mainContainer.find(".stellar_vp_infoText").html(self._playlist.videos_array[ID].info_text);
		self.mainContainer.find(".stellar_vp_nowPlayingText").html(self._playlist.videos_array[ID].title);

		self.nowPlayingTitleW = self.nowPlayingTitle.width();
	};
	Video.fn.showCustomControls = function () {
		var self = this;
		self.controls.css({
			zIndex: 2147483647
		});
		self.screenBtnsWindow.css({
			zIndex: 2147483647
		});
		self.nowPlayingTitle.css({
			zIndex: 2147483647
		});
		if (self.progressIdleTrack)
			self.progressIdleTrack.css({
				zIndex: 2147483647
			});
	};
	Video.fn.hideCustomControls = function () {
		var self = this;
		self.controls.css({
			zIndex: 200
		});
		if (self.screenBtnsWindow)
			self.screenBtnsWindow.css({
				zIndex: 200
			});
		self.nowPlayingTitle.css({
			zIndex: 200
		});
		if (self.progressIdleTrack)
			self.progressIdleTrack.css({
				zIndex: 200
			});
	};
	Video.fn.playVideoById = function (ID) {
		var self = this;
		// self.resetTrigger();
		self.volPerc = self.volumeTrackProgress.width() / self.volumeTrackWrapper.width();
		this.hideOverlay();

		this.midrollPlayed = false;
		this.postrollPlayed = false;

		this.manageButtonsByVideoType();
		this.positionShareMask()
		this.createQualityWindowByType();

		if (this.options.nextShow) {
			this.nextVideoBoxTitle.html('')
			if (ID > self._playlist.videos_array.length - 1)
				this.nextVideoBoxTitle.append('<p class="stellar_vp_nextVideoBoxTitle">' + self._playlist.videos_array[ID].title + '</p>');
			else if (ID == self._playlist.videos_array.length - 1)
				this.nextVideoBoxTitle.append('<p class="stellar_vp_nextVideoBoxTitle">' + self._playlist.videos_array[0].title + '</p>');
			else
				this.nextVideoBoxTitle.append('<p class="stellar_vp_nextVideoBoxTitle">' + self._playlist.videos_array[ID + 1].title + '</p>');
			$(this.nextVideoBoxTitle).find('.stellar_vp_nextVideoBoxTitle').addClass("stellar_vp_controlsColor" + " " + this.options.instanceTheme)

			this.updateNextBtnImg();
		}

		this._playlist.countTxtWrapper.find(".stellar_vp_countVideoInPlaylistText").html(ID + 1 + " " + this.options.countVideos + " " + this._playlist.videos_array.length)

		this.updateEmbedText2();

		//remove iOS autoplay
		if (isMobile.iOS() && this.options.autoplay)
			this.removeiOSAutoplay();

		if (self._playlist.videos_array[ID].videoType == "HTML5" || self.options.videoType == "HTML5 (self-hosted)") {
			self.video.setVolume(self.volPerc);
			self.element.css("visibility", "visible");
			self.closeAD();
			self.showVideoElements();
			self._playlist.videoAdPlayed = false;
			self.ytWrapper.css({
				zIndex: 0
			});
			self.ytWrapper.css({
				visibility: "hidden"
			});
			self.imageWrapper.css({
				zIndex: 0
			});
			self.imageWrapper.css({
				visibility: "hidden"
			});
			self.showHTML5elements();
			self.resizeAll();

			if (self.youtubePlayer != undefined) {
				if (self._playlist.youtubePLAYING) {
					self.youtubePlayer.stopVideo();
					self.youtubePlayer.clearVideo();
				}
			}
			// self.options.HTML5VideoQuality = self.selectedHTML5Quality;
			if (self.myVideo.canPlayType && self.myVideo.canPlayType('video/mp4').replace(/no/, '')) {
				this.canPlay = true;
				switch (self.selectedHTML5Quality || self.options.HTML5VideoQuality) {
					case "HD":
						self.video_path = self._playlist.videos_array[ID].video_path_mp4HD;
						break;
					case "SD":
						self.video_path = self._playlist.videos_array[ID].video_path_mp4SD;
						break;
				}
				if (self.options.showGlobalPrerollAds)
					self.video_pathAD = self.globalPrerollAds_arr[self.getGlobalPrerollRandomNumber()]
				else
					self.video_pathAD = self._playlist.videos_array[ID].preroll_mp4;
			}

			self.load(self.video_path, ID);
			self.play();

			if ((self._playlist.videos_array[ID].prerollAD == true || self._playlist.videos_array[ID].prerollAD == "yes") || self.options.showGlobalPrerollAds) {
				self.pause();
				self.loadAD(self.video_pathAD, "prerollActive");
				self.openAD();
			}
			this.loaded = false;
			// $(this.embedWindow).find(".stellar_vp_embedText2").text(""+self._playlist.videos_array[self._playlist.videoid].video_path_mp4+"");
		} else if (self._playlist.videos_array[ID].videoType == "youtube" || self.options.videoType == "YouTube") {
			self.showCustomControls();

			if (self.youtubePlayer != undefined)
				self.youtubePlayer.setVolume(self.volPerc * 100);
			if (self.options.youtubeControls == "default controls")
				self.element.css("visibility", "hidden");
			else if (self.options.youtubeControls == "custom controls")
				self.element.css("visibility", "visible");
			self.hideVideoElements();
			self.closeAD();
			self._playlist.videoAdPlayed = false;
			self.preloader.stop().animate({
				opacity: 0
			}, 0, function () {
				$(this).hide()
			});
			self.ytWrapper.css({
				zIndex: 501
			});
			self.ytWrapper.css({
				visibility: "visible"
			});
			self.imageWrapper.css({
				zIndex: 0
			});
			self.imageWrapper.css({
				visibility: "hidden"
			});
			self.removeHTML5elements();
			if (self.youtubePlayer != undefined) {
				self.youtubePlayer.setSize("100%", "100%");

				var startSec = parseInt(self._playlist.videos_array[ID].youtubeIDStartSeconds);
				if (startSec == "")
					startSec = 0;

				if (self.isMobile.any()) {
					self.youtubePlayer.cueVideoById(self._playlist.videos_array[ID].youtubeID, startSec);
				} else {
					self.youtubePlayer.loadVideoById(self._playlist.videos_array[ID].youtubeID, startSec);
					self.youtubePlayer.playVideo();
				}
			}
			var q = self.selectedYoutubeQuality || self.options.youtubeQuality
			self.youtubePlayer.setPlaybackQuality(q);
			self.resizeAll();
		}

		if (self._playlist.videos_array[ID].imageUrl) {
			self.imageWrapper.css({
				zIndex: 502
			});
			self.imageWrapper.css({
				visibility: "visible"
			});

			$(self.imageDisplayed).src = "#";
			$(self.imageDisplayed).removeAttr('src');
			self.imageDisplayed.src = self._playlist.videos_array[ID].imageUrl;

		}
	};
	Video.fn.removeiOSAutoplay = function () {
		this.videoElement.removeAttr("muted");
		this.videoElement.muted = false;

		this.video.muted = false;
		this.volumeTrackProgress.css({
			width: this.initialVolumeProgressWidth
		})
		$(this.mainContainer).find(".fa-stellar-volume-off").removeClass("fa-stellar-volume-off").addClass("fa-stellar-volume-up");
		this.muted = false;

		this.video.setVolume(1);

		this.iOSVolumeButtonScreen.hide();


	}
	Video.fn.manageButtonsByVideoType = function () {
		var self = this;

		if (this._playlist.videos_array[this._playlist.videoid].videoType == "HTML5" || this.options.videoType == "HTML5 (self-hosted)") {

			if (this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == true || this._playlist.videos_array[this._playlist.videoid].enable_mp4_download == "yes") {
				this.downloadBtnLink.prependTo(this.controlsBtnsWrapperRight)
				this.downloadBtnLink.attr('href', this._playlist.videos_array[this._playlist.videoid].video_path_mp4HD)
			} else
				this.downloadBtnLink.remove()
		} else if (this._playlist.videos_array[this._playlist.videoid].videoType == "youtube" || this.options.videoType == "YouTube") {

			if (this.downloadBtnLink != undefined)
				this.downloadBtnLink.hide();
		}
	}
	Video.fn.setImageTimer = function () {

		var self = this;

		clearTimeout(self.image_timeout);

		self.image_timeout = setTimeout(function () {
			self.randEnd = Math.floor(Math.random() * (self.options.videos).length);

			if (self.shuffleBtnEnabled)
				self._playlist.videoid = self.randEnd;
			else
				self._playlist.videoid = parseInt(self._playlist.videoid) + 1;

			if (self._playlist.videos_array.length == self._playlist.videoid)
				self._playlist.videoid = 0;

			self.setPlaylistItem(self._playlist.videoid);
			self.playVideoById(self._playlist.videoid);

		}, self._playlist.videos_array[self._playlist.videoid].imageTimer * 1000);
	}
	Video.fn.setSkipTimer = function () {

		if (this.options.showGlobalPrerollAds) {
			this.counter = (this.options.globalPrerollAdsSkipTimer) - Math.round(this.videoAD.getCurrentTime());
		} else {
			var path = this.video_pathAD || this._playlist.video_pathAD;

			if (path == this._playlist.videos_array[this._playlist.videoid].preroll_mp4) {
				this.counter = (this._playlist.videos_array[this._playlist.videoid].prerollSkipTimer) - Math.round(this.videoAD.getCurrentTime());
			}

			if (path == this._playlist.videos_array[this._playlist.videoid].midroll_mp4) {
				this.counter = (this._playlist.videos_array[this._playlist.videoid].midrollSkipTimer) - Math.round(this.videoAD.getCurrentTime());
			}

			if (path == this._playlist.videos_array[this._playlist.videoid].postroll_mp4) {
				this.counter = (this._playlist.videos_array[this._playlist.videoid].postrollSkipTimer) - Math.round(this.videoAD.getCurrentTime());
			}
		}

	}
	Video.fn.showPoster2 = function () {
		this.mainContainer.find(".stellar_vp_overlay img").attr('src', this.options.posterImgOnVideoFinish);
		// this.positionPoster();
		if (this.overlay)
			this.overlay.show();
		if (this.playButtonPoster)
			this.playButtonPoster.show();
		if (this.playButtonScreen)
			this.playButtonScreen.hide();

		this.poster2Showing = true;
	}
	Video.fn.setOrientation = function () {
		switch (this.options.playerOrientation) {
			case "RTL":
				this.mainContainer.find(".stellar_vp_title").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_description").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_infoTitle").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_infoText").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_nowPlayingText").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_embedTitle2").addClass("elite_vp_RTL")
				this.mainContainer.find(".stellar_vp_embedTitle3").addClass("elite_vp_RTL")
				break;
			case "LTL":
				this.mainContainer.find(".stellar_vp_title").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_description").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_infoTitle").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_infoText").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_nowPlayingText").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_embedTitle2").addClass("elite_vp_LTR")
				this.mainContainer.find(".stellar_vp_embedTitle3").addClass("elite_vp_LTR")
				break;
		}
	}
	Video.fn.setupEvents = function () {
		var self = this;
		this.onpause($.proxy(function () {
			this.element.addClass("vp_paused");
			this.element.removeClass("stellar_vp_playing");
			this.change("vp_paused");
		}, this));

		this.onplay($.proxy(function () {
			this.element.removeClass("vp_paused");
			this.element.addClass("stellar_vp_playing");
			this.change("stellar_vp_playing");
		}, this));

		$(self.videoElementAD).bind("ended", function () {
			self.closeAD();
			self._playlist.videoAdPlayed = true;
		});

		$(self.videoElementAD).bind("loadeddata", function () {
			self.preloader.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			});
			self.preloaderAD.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			});
			if (self.options.hideVideoSource)
				self.videoElementAD.empty();
			clearInterval(self.myInterval);

			self.myInterval = setInterval(function () {
				if (self.isPaused && !self.options.allowSkipAd)
					return;
				self.setSkipTimer();
				$(self.skipAdCountContentLeft).find(".stellar_vp_skipAdCountTitle").text(self.options.skipAdText + " " + self.counter + " s");
				if (self.counter == 0) {
					self.toggleSkipAdCount();
					self.skipBoxOn = false;
					self.toggleSkipAdBox();
					clearInterval(self.myInterval);
				}
			}, 1000);
		});
		$(self.videoElementAD).bind("pause", function () {
			self.isPaused = true;
		});
		$(self.videoElementAD).bind("play", function () {
			self.isPaused = false;
		});
		$(self.videoElementAD).bind("timeupdate", function () {
			self.timeLeftInside.text("(-" + self.secondsFormat(self.videoAD.getEndTime() - self.videoAD.getCurrentTime()) + ")");
			self.progressWidthAD = (self.videoAD.currentTime / self.videoAD.duration) * self.elementAD.width();
			self.progressAD.css("width", self.progressWidthAD);
			self.preloaderAD.stop().animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			});
		});

		this.onended($.proxy(function () {
			self.midrollPlayed = false;
			self.postrollPlayed = false;
			self.randEnd = Math.floor((Math.random() * (self.options.videos).length) + 0);

			$(document).trigger('ss-video-ended', [self]);
			// self.resetTrigger();

			//increase video id for 1
			this._playlist.videoid = parseInt(this._playlist.videoid) + 1; //increase video id
			if (this._playlist.videos_array.length == this._playlist.videoid) {
				this._playlist.videoid = 0;
			}
			if (self.preloader)
				self.preloader.stop().animate({
					opacity: 1
				}, 0, function () {
					$(this).show()
				});

			//play next on finish check
			if (self.options.onFinish == "Play next video" && self.toggleAutoplayBtnEnabled) {
				self._playlist.videoAdPlayed = false;
				if (self.shuffleBtnEnabled) {
					self.setPlaylistItem(self.randEnd);
					self._playlist.videoid = self.randEnd;
				} else {
					self.setPlaylistItem(self._playlist.videoid);
				}
				self.playVideoById(self._playlist.videoid);

				if (self.shuffleBtnEnabled)
					self.setPlaylistItem(self.randEnd);
				else
					self.setPlaylistItem(self._playlist.videoid);

			} else if (self.options.onFinish == "Restart video") {
				this.resetPlayer();
				this.seek(0);
				this.play();
				this.preloader.hide();
			} else if (self.options.onFinish == "Stop video" || !self.toggleAutoplayBtnEnabled) {
				this.pause();
				this.preloader.hide();

				if (this.options.posterImgOnVideoFinish != "") {
					this.resetPlayer();
					this.seek(0);
					this.pause();

					this.showPoster2();
				}
			}
		}, this));

		this.oncanplay($.proxy(function () {
			this.canPlay = true;
			this.controls.removeClass("stellar_vp_disabled");
		}, this));

		this.mainContainer.parent().hover(function (e) {

		});

		this.mainContainer.parent().hover(function () {
			$(document).keydown($.proxy(function (e) {
				if (e.keyCode == 32) {
					// Space
					self.togglePlay();
					return false;
				}
			}, this));
		}, function () {
			$(document).unbind('keydown');
		});

	};
	window.Video = Video;
})(jQuery);