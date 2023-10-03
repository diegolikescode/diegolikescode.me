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
export const emitJoin = (ws, clientID, gameID) => {
    if (gameID === null) {
        return
    }

    const payload = {
        method: 'join',
        clientID,
        gameID,
    }

    sendJsonAsString(ws, payload)
}

export const emitPlayRound = (ws, gameID, fullMatrix) => {
    if(gameID === null) {
        return
    }

    const payload = {
        method: 'playRound',
        gameID,
        fullMatrix,
    }

    sendJsonAsString(ws, payload)
}

// client-side response for these messages emited by the server-side WebSocket

const connect = (serverPayload) => {
    console.log('connected in the client-side', serverPayload)
    setCookie('clientID', serverPayload.clientID, 5)
}

const create = (serverPayload) => {
    console.log('game created', serverPayload)
    setCookie('gameID', serverPayload.game.id, 5)
}

const join = (serverPayload) => {
    console.log('event return from join game', serverPayload)
    setCookie('gameID', serverPayload.game.id, 5)
}

const playRound = (serverPayload) => {
    console.log(serverPayload)
}

export const onMessageGame = {
    connect,
    create,
    join,
    playRound,
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
