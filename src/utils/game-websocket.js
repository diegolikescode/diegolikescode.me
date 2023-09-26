// import {Server} from 'ws'

/**
 * @param {string} host
 * @param {string} port
 * @returns {WebSocket}
*/
export const newWebSocketConn = (host, port) => new WebSocket(`${host}:${port}`)

/**
 * @description event emited only by the frontend, it signals the backend that there is a new game
 * @param {WebSocket} ws
 * @param {string} clientID
 */
export const createGame = (ws, clientID) => {
    const payload = {
        method: 'create',
        clientID
    }

    sendJsonAsString(ws, payload)
}


/**
 * @description event emited only by the frontend, it signals the backend that the player (clientID) is
 * joining a game already created
 */
const join = (ws, clientID, gameID) => {
    if(gameID === null) {
        return
    }

    const payload = {
        method: 'join',
        gameID,
        clientID
    }

    sendJsonAsString(ws, payload)
}

// on these messages from the server-side WebSocket
const connect = (serverPayload) => {
    console.log('connected in the client-side', serverPayload)
}

const create = (serverPayload) => {
    console.log(serverPayload)
}

export const onMessageGame = {
    connect,
    join,
    create,
}

/**
 * @param {WebSocket} ws
 * @param {string} json
 */
const sendJsonAsString = (ws, json) => ws.send(JSON.stringify(json))

/**
 * @param {string} websocketResponse
 */
export const parseStringToJson = (websocketResponse) => JSON.parse(websocketResponse)

