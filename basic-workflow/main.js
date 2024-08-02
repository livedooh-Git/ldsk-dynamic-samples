const programmaticEvent = {
    PLAY: 'PLAY',
    PLAYER_CONFIGURATION: 'PLAYER_CONFIGURATION'
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

function handlePlayerConfiguration(data) {
    // Add your code here to handle the PLAYER_CONFIGURATION event
    console.log('Received PLAYER_CONFIGURATION event:', data);

    // Add your dynamic creative's logic here
    if (data.inventory.attributes.city === 'Barcelona') {
        // Add your logic here to set the source of the video
        videoElement.src = 'creatives/video1.mp4';
    }
    else {
        // Add your logic here to set the source of the video
        videoElement.src = 'creatives/video2.mp4';
    }
}

function handlePlay() {
    // Add your code here to handle the PLAY event
    console.log('Received PLAY event');
    videoElement.play();
}

function handleOtherEvents(message) {
    // Add your code here to handle other events
    console.log('Received message:', message);
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


