import { conectionOpened, connect, join, onMessageGame, parseStringToJson, playRound } from '@utils/game-websocket';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useCookieValue } from './custom-hooks';

const WebSocketContext = createContext()

export const useWebSocketContext = () => {
    return useContext(WebSocketContext)
}

export const WebSocketProvider = ({ children }) => {
    console.log('render webSocketContext')
    const [webSocket, setWebSocket] = useState(null)
    const [playerColor, setPlayerColor] = useState('blue')

    const matrixW = 6
    const matrixH = 7

    const [currentMatrix, setCurrentMatrix] = useState(
        new Array(matrixH).fill(null)
            .map(() => new Array(matrixW).fill({ball: ''}))
    )

    const clientID = useCookieValue('clientID')
    const gameID = useCookieValue('gameID')

    useEffect(() => {
        const newSocket = new WebSocket(`ws://localhost:6969`)
        newSocket.addEventListener('open', () => {
            conectionOpened(newSocket, clientID)
        })

        newSocket.onmessage = (msg) => {
            Object.keys(onMessageGame).map(onServerMessageCallback => {
                const serverResponse = parseStringToJson(msg.data)

                if(serverResponse.method === onServerMessageCallback) {
                    onMessageGame[onServerMessageCallback](serverResponse)
                }

                if(serverResponse.method === 'connect') {
                    const serverPayload = connect(serverResponse)
                    console.log(serverPayload)
                }

                if(serverResponse.method === 'join') {
                    const serverPayload = join(serverResponse)
                    console.log(serverPayload)
                    const { color } = serverPayload.game.clients.find(c => c.clientID === clientID)
                    setPlayerColor(color)
                }

                // needed to customize a lil' bit
                if (serverResponse.method === 'playRound') {
                    const serverPayload = playRound(serverResponse, setCurrentMatrix)
                    console.log('the load', serverPayload)
                }
            })
        }

        newSocket.addEventListener('close', () => {

        })

        setWebSocket(newSocket)
        return () => {
            newSocket.close()
        }

    }, [])

    const contextValues = {
        webSocket,
        clientID,
        gameID,
        matrixH,
        matrixW,
        currentMatrix,
        setCurrentMatrix,
        playerColor,
    }

    return (
        <WebSocketContext.Provider value={contextValues}>{children}</WebSocketContext.Provider>
    )
}

