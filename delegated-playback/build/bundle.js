// Plain Video Delegate Template - Original Code
// This is the unminified version of the Svelte App.svelte component

(function() {
  let rootElement, videoElement, duration, playlistCreativeId;
  let shouldRenderVideo = false; // Resolves preloading issues found on Tizen
  
  // Initialize the app when DOM is ready
  function init() {
    rootElement = document.getElementById('root');
    
    // Attach message listener
    if (window.addEventListener) {
      window.addEventListener("message", receiveMessage);
    } else {
      window.attachEvent("onmessage", receiveMessage);
    }
  }

  // PAGE LOAD
  window.addEventListener("load", function () {
    init();
  });

  // HANDLE INCOMING MESSAGES
  function receiveMessage(event) {
    // Handle DELEGATE_PLAY_RESPONSE event
    if (event.data.eventType === "DELEGATE_PLAY_RESPONSE") {
      console.log('Received DELEGATE_PLAY_RESPONSE:', event.data);
      
      // Handle different response statuses
      switch(event.data.status) {
        case 'AdResponse':
        case 'Replacement':
        case 'Fallback':
          console.log('Player is using cached media and will playing:', event.data.mediaUrl);
          break;

          default:
          console.error('Player could not handle DELEGATE_PLAY request');
      }
      
      return;
    }

    if (event.data.type === "SET_DESIGN") {
      rootElement.style.opacity = 1;
      // sets all variables and properties for creative editor
      document.querySelectorAll(".text-element").forEach((element) => {
        element.contentEditable = "true";
        textEdit = true;
      });
      // Gets JSON data
      fetch("./placeholders.json")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          let data = placeholders;
          setData(data);
        });
    }

    function setData(data) {
      // Setting default placeholder values
      createVideoElement();
      videoElement.src = data.videoSrc;
      videoElement.currentTime = 5; // Skips 5 seconds to show paused video while editing
      let placeholdersLoaded = {
        type: "PLACEHOLDERS_LOADED",
        properties: {
          videoSrc: videoElement.getAttribute("src"),
          duration: duration,
        },
      };
      window.top.postMessage(placeholdersLoaded, "*");
      return data;
    }

    if (event.data.type === "SET_VIDEO") {
      createVideoElement();
      videoElement.src = event.data.videoSrc;
      playVideo();
    }

    // Calling retrieve data from preview and editor
    if (event.data.type === "RETRIEVE_STATE") {
      let state = {
        type: "TEMPLATE_STATE",
        properties: {
          videoSrc: videoElement.getAttribute("src"),
          duration: duration,
        },
      };
      window.top.postMessage(state, "*");
    }

    if (event.data.type === "PREVIEW_CONFIGURATION") {
      // videosSrc is a direct link to the uploaded video
      createVideoElement();
      videoElement.src = event.data.properties.videoSrc;
    }

    if (
      event.data.type === "RUN_PREVIEW" ||
      event.data.type === "SET_LIVE" ||
      event.data.type === "PLAYER_CONFIGURATION"
    ) {
      // Gets JSON data
      fetch("./placeholders.json")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (event.data.type === "PLAYER_CONFIGURATION") {
          
            /*
              Determine media URL based on player capabilities:
              - Tizen players (v19.6.3+): require mediaFileId prefix with local file path
              - BrightSign & other players: use local file path directly
              - Fallback: use remote videoSrc if local file not available
            */
            let mediaUrl;
            const playerVersion = event.data.playerVersion || '';
            const isTizen = playerVersion.toLowerCase().includes('tizen');
            
            if (data.videoLocalSrc) {
              // Local file available
              mediaUrl = isTizen 
                ? `${event.data.mediaFileId}/${data.videoLocalSrc}`
                : data.videoLocalSrc;
            } else {
              // Fallback to remote source
              mediaUrl = data.videoSrc;
            }

            playlistCreativeId = event.data.playlistCreativeId ? event.data.playlistCreativeId : "";

            var payload = {
                mediaType: "VIDEO",
                mediaUrl: mediaUrl,
                playlistCreativeId: playlistCreativeId,
                replacementMediaType: event.data.replacementMediaType,
                replacementMediaUrl: event.data.replacementMediaUrl,
                uuid: event.data.uuid
            };
            shouldRenderVideo = false;
            postMessageToParent("DELEGATE_PLAY", payload);
          } else {
            shouldRenderVideo = true;
          }
          setLiveData(data);
          if (event.data.type === 'RUN_PREVIEW') {
            playVideo();
          }
        })
        .catch((err) => {
          let data = placeholders;
          setLiveData(data);
        });
    }

    if (event.data.type === "PLAY") {
      if (playlistCreativeId === null || playlistCreativeId === undefined){
        rootElement.style.opacity = 1;
        duration = videoElement.duration;
        videoElement.play();
      }
    }

    function setLiveData(data) {
      // Removed videos/ since the live placeholders.json come with videoSrc as a direct link to the video
      if (playlistCreativeId !== null && playlistCreativeId !== undefined){
          rootElement.style.opacity = 0;
      }
      createVideoElement();
      videoElement.src = data.videoSrc;
      return data;
    }

    function postMessageToParent(type, data) {
      const messageToParent = {
        type: type,
        eventType: type,
        payload: data,
      };
      // Post the message to the parent window
      window.top.postMessage(messageToParent, "*");
    }

    function playVideo() {
      if (!videoElement) {
        console.warn("Video element not found.");
        return;
      }

      videoElement.load();
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.play().catch(error => {
        console.warn("Autoplay failed:", error);
      });
    }
  }

  // Helper function to create video element if it should be rendered
  function createVideoElement() {
    if (!videoElement && shouldRenderVideo) {
      const container = document.getElementById('video-container');
      videoElement = document.createElement('video');
      videoElement.id = 'video';
      videoElement.type = 'video/mp4';
      videoElement.muted = true;
      container.appendChild(videoElement);
    } else if (!videoElement) {
      // Create video element even if not rendering (for editor/preview)
      const container = document.getElementById('video-container');
      videoElement = document.createElement('video');
      videoElement.id = 'video';
      videoElement.type = 'video/mp4';
      videoElement.muted = true;
      container.appendChild(videoElement);
    }
  }
})();
