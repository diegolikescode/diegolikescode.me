import { conectionOpened, onMessageGame, parseStringToJson, playRound } from '@utils/game-websocket';
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
    const[webSocket, setWebSocket] = useState(null)

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

                // needed to customize a lil' bit
                if (serverResponse.method === "playRound") {
                    console.log("ohhh maaa god")
                    playRound(serverResponse, setCurrentMatrix)
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
        setCurrentMatrix
    }

    return (
        <WebSocketContext.Provider value={contextValues}>{children}</WebSocketContext.Provider>
    )
}

