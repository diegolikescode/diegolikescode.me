# WEBSOCKET MULTIPLAYER GAME

## RESPONSABILITIES OF THE CLIENT

- serve the game
- hold the conection that the server created for 5 minutes inside a Cookie

### EVENTS EMITED

there are 3 kinds of events: **open**, **close** and **message**. The open and closed is for the connection itself, while the message is the data exchanged between client and server-side of the application while the connection have been successfully opened and did not yet closed.
