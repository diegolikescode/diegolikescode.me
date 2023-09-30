// import {Server} from 'ws'

import { setCookie } from './cookies'

/**
 * @param {string} host
 * @param {string} port
 * @returns {WebSocket}
 */
export const newWebSocketConn = (host, port) => new WebSocket(`${host}:${port}`)

/*
 * @param {WebSocket} ws
 * @param {strin} clientID
 */
export const conectionOpened = (ws, clientID) => {
    const payload = {
        method: 'open',
        clientID
    }

    sendJsonAsString(ws, payload)
}

/**
 * @description event emited only by the frontend, it signals the backend that there is a new game
 * @param {WebSocket} ws
 * @param {string} clientID
 */
export const emitCreateGame = (ws, clientID) => {
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
const emitJoin = (ws, clientID, gameID) => {
    if (gameID === null) {
        return
    }

    const payload = {
        method: 'join',
        gameID,
        clientID,
    }

    sendJsonAsString(ws, payload)
}

// client-side response for these messages emited by the server-side WebSocket
const connect = (serverPayload) => {
    console.log('connected in the client-side', serverPayload)
    setCookie('clientID', serverPayload.clientID, 5)
}

const create = (serverPayload) => {
    console.log(serverPayload)
    setCookie('gameID', serverPayload.game.id, 5)
}

export const onMessageGame = {
    connect,
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
export const parseStringToJson = (websocketResponse) =>
    JSON.parse(websocketResponse)
