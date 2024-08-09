## Description
This example demonstrates the basic workflow for a dynamic creative in the LDSK player.
The example is a simple creative that displays a single video after evaluating attributes on the inventory context provided by the player.

## Events: PLAY_CONFIGURATION and PLAY

The LDSK player communicates with your HTML5 creative through two important events:

### 1. PLAY_CONFIGURATION Event

* **When:** Sent **5 seconds before** your creative starts playing.
* **Why:** Gives you a heads-up so you can prepare your creative for a smooth start.
* **What it contains:**
    * Inventory data (screen info, location, etc.) to help you make your creative dynamic by using data.

**Example PLAY_CONFIGURATION Event:**

JavaScript

```json
{
  "type": "PLAYER_CONFIGURATION",
  "eventType": "PLAYER_CONFIGURATION",
  "inventory": {
    "name": "Store 123",
    "attributes": {
      "location": "City Center",
      "screenId": "45678",
      "...": "... other attributes"
    }
  }
}
```

### 2. PLAY Event

* **When:** Sent at the **exact moment** your creative should start playing.
* **Why:** Tells your creative to "go live" and start displaying content.

**Example PLAY Event:**

JavaScript

```json
{
  "type": "PLAY",
  "eventType": "PLAY"
}
```

### How to Use These Events in Your Creative

Use JavaScript's window.addEventListener('message', ...) to listen for and handle these events:

JavaScript
```javascript
window.addEventListener('message', function(event) {
  if (event.data.eventType === 'PLAYER_CONFIGURATION') {
    // Prepare your creative based on inventory data (e.g., set variables)
  } else if (event.data.eventType === 'PLAY') {
    // Start your creative (e.g., play a video, begin an animation)
  }
});

```
See [main.js](./main.js) for a complete example of how to handle these events.

**Important Note:** Your creative should be fully loaded and ready to display before the PLAY event arrives. This ensures a smooth, uninterrupted playback experience for the viewer.

### How to Run the Example

1. run `npm install` to install the dependencies.
2. run `npm start` to start the server.  This will load player-simulator.html in your browser which loads index.html in an iframe.
3. Open the browser console to see the events being sent to the creative.
4. The creative will choose a video after evaluating the inventory context.
5. The creative will start playing the video after 5 seconds.

## Important Considerations
* **Video element tags**: If targeting your creative to a network with LDSK player that is using Samsung Tizen screens,
  do not to add a `<video>` element tag in your creative's HTML markup, instead add it programmatically with Javascript. This is because
  the Samsung Tizen screens struggle when more than one `<video>` element tag present, given that the creative is preloading
  behind the scenes, it is very possible that another `<video>` element tag is presently playing. This will cause the screen
  to blank into a black frame and the creative will not play.
