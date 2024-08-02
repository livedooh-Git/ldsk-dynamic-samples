const programmaticEvent = {
    PLAY: 'PLAY',
    PLAYER_CONFIGURATION: 'PLAYER_CONFIGURATION',
    PLAYING: 'PLAYING',
    MEDIA_REQUEST: 'MEDIA_REQUEST',
    MEDIA_REQUEST_EXCEPTION: 'MEDIA_REQUEST_EXCEPTION',
    MEDIA_RESPONSE: 'MEDIA_RESPONSE'
};

let videoElement = null;

// Create a method to post a message to the parent window
function postMessageToParent(type, data) {
    const messageToParent = {
        type: type,
        eventType: type,
        payload: data
    };

    // Post the message to the parent window
    window.parent.postMessage(messageToParent, '*');
}

// Handle the PLAYER_CONFIGURATION event and request caching the video media
function handlePlayerConfiguration(data) {
    // Add your code here to handle the PLAYER_CONFIGURATION event
    // The information contained in the data object can be used to determine the media to be cached
    // or any other dynamic creative logic
    console.log('Received PLAYER_CONFIGURATION event:', data);

    // Request caching the vide media immediately after the player configuration
    // use the mediaType to specify the type of media to be cached, possible values are 'video', 'image'
    // the requestId helps identify the cached media when the player responds, it comes useful when caching multiple files
    // this uuid is the id given to the iframe by the player, it needs to be part of the request
    let mediaRequest = {
        mediaType: 'video',
        mediaUrl: 'https://lvdstorageapp.blob.core.windows.net/media-container/cdn/uploads/65cb4fbac105afd3fbebae9a.mp4',
        requestId: '65cb4fbac105afd3fbebae9a'
    };

    console.log('Requesting media:', mediaRequest);
    postMessageToParent(programmaticEvent.MEDIA_REQUEST, mediaRequest);
}

// Handle the PLAY event and play the video
function handlePlay() {
    console.log('Received PLAY event');
    videoElement.play();
}

// In case an error occurs while requesting the media, the player will send a MEDIA_REQUEST_EXCEPTION event
function handleMediaRequestException() {
    console.log('Received MEDIA_REQUEST_EXCEPTION event');
}

function handleOtherEvents(message) {
    // Add your code here to handle other events
    console.log('Received message:', message);
}

// handle the MEDIA_RESPONSE event and load your media elements with the local url
function handleMediaResponse(data) {
    console.log('Received MEDIA_RESPONSE event:', data);
    // Check if the response is for the media request we made
    if (data.requestId === '65cb4fbac105afd3fbebae9a') {
        // Set the source of the video
        videoElement.src = data.localUrl;
        videoElement.load();
        // It's important to just load here, not to play, because the video will be played programmatically with the PLAY event
    }
}

function handlePostMessage(event) {
    const message = event.data;
    console.log('Received message:', message);

    switch (message.type) {
        case programmaticEvent.PLAYER_CONFIGURATION:
            handlePlayerConfiguration(message);
            break;
        case programmaticEvent.PLAY:
            handlePlay();
            break;
        case programmaticEvent.MEDIA_RESPONSE:
            handleMediaResponse(message);
            break;
        case programmaticEvent.MEDIA_REQUEST_EXCEPTION:
            handleMediaRequestException();
            break;
        default:
            handleOtherEvents(message);
            break;
    }
}

// Set the source of the video
window.addEventListener('load', () => {
    const videoContainer = document.getElementById('video-container');
    videoElement = document.createElement('video');
    videoElement.className = 'fullscreen';
    videoElement.id = 'video_placeholder';
    videoElement.muted = true; // Important: Mute the video so that it be played programmatically
    videoElement.src = '';

    videoContainer.appendChild(videoElement);

    // Add message event handler
    window.addEventListener('message', handlePostMessage);
});


