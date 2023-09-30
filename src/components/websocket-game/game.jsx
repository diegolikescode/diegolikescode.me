import { useEffect, useRef, useState } from "react"
import './game-styles.css'
import { newWebSocketConn, onMessageGame, parseStringToJson, emitCreateGame} from "@utils/game-websocket"
import ButtonJsx from "./button"
import { getCookie, setCookie } from "@utils/cookies"

/**
##### TODO ####

- when "new game" reset the matrix
    - if there is a game, delete in the server
    - if there is other player, he must be deleted with the game

- when "exit game" reset the matrix
    - if there is a game, delete in the server
    - if there is other player, he must be deleted with the game

- when "join game" gets the matrix as it is in the moment of the game

- make both players distinct by its colors

- validate when a player has won

- learn to keep state of client and game ID when refresh page (must be on some Cookie)
    - refresh no token e reseta o clientID pra n mudar nos próximos 5mins
 #############
 */


const Game = function (props) {
    console.log('rendered')
    console.log(props)

    let webSocket = {}

    const matrixW = 6
    const matrixH = 7
    const [currentMatrix, setCurrentMatrix] = useState(
        new Array(matrixH).fill(null)
            .map(() => new Array(matrixW).fill({ball: ''}))
    )
    const [clientID, setCliendID] = useState('')
    const [gameID, setGameID] = useState('')

    const animationStyle = {
        transition: 'top 2s ease-in-out',
        animation: 'ball-animation 4s ease-in-out'
    }

    const ballsTupleRef = useRef(new Array(matrixH).fill(null).map(() => new Array(matrixW).fill(null)))
    const ballsRef = useRef(new Array(matrixH).fill(null).map(() => new Array(matrixW).fill(null)))

    const setMatrixRef = (el, col, row, matrixRef) => {
        matrixRef.current[col][row] = el
    }

    useEffect(() => {
        ballsRef.current.map((row, rowIdx) => {
            row.map((ball, ballIdx) => {
                const tuplePos = ballsTupleRef.current[rowIdx][ballIdx].getBoundingClientRect().top
                ball?.style.setProperty('--final-pos', `${tuplePos + 8}px`)
            })
        })

        const cookieClientID = getCookie('clientID')
        if(!cookieClientID) {
            console.log('cookiezada',cookieClientID)
            const newClientID = generateUUID()
            // setCliendID(newClientID)
            setCookie(newClientID)
        }

        webSocket = newWebSocketConn('ws://localhost', '6969')

        webSocket.onmessage = (msg) => {
            Object.keys(onMessageGame).map(onServerMessageCallback => {
                const serverResponse = parseStringToJson(msg.data)

                if(serverResponse.method === onServerMessageCallback) {
                    onMessageGame[onServerMessageCallback](serverResponse)
                }
            })
        }
    }, [])

    const handlePlayerRound = (col, playerColor) => {
        const newMatrix = [...currentMatrix]

        for(let h = matrixH - 1; h >= 0; h--) {
            if(newMatrix[h][col].ball == '') {
                newMatrix[h][col] = {ball: playerColor}
                setCurrentMatrix(newMatrix)
                return
            }
        }
    }

    const onNewGameClick = () => {
        emitCreateGame(webSocket)
        console.log('emited')

    }

    return (
        <main className="mt-16">
            <div>
                <h1 id="clientId">ClientID: haha</h1>
                <h1 id="gameId">
                    press "new game" to get your game ID or Join someone else's game
                    with "Join Game"
                </h1>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Your game ID"
                        id="inputGameId"
                        className="rounded-md pl-2"
                    />
                    <ButtonJsx id="joinGameBtn" text="Join Game">Join Game</ButtonJsx>
                </div>
                <div className="flex gap-2 mt-2">
                    <ButtonJsx id="newGame" text="New Game" onClick={onNewGameClick}>New Game</ButtonJsx>
                    <ButtonJsx id="exitGame" text="Exit Game">Exit Game</ButtonJsx>
                </div>
            </div>
            <div id="game-container" className="flex flex-col justify-center items-center mt-4">
                <div className="flex flex-row justify-center items-center w-full between mb-1">
                    {
                        new Array(matrixW).fill(null).map((_, i) => (
                            <div key={i} className="w-16 h-16 flex items-center justify-center">
                                <button
                                    key={i}
                                    className="w-14 h-14 rounded-md bg-black text-white"
                                    onClick={() => handlePlayerRound(i, 'red')}
                                >
                                    ball!
                                </button>
                            </div>
                        ))
                    }
                </div>
                <div id="game-board">
                    {currentMatrix.map((row, idx) => (
                        <div key={idx} id={String(idx)} className="flex flex-row w-auto">
                            {row.map((_, idxTuple) => (

                                <div key={idxTuple} id={`tuple-${idx}-${idxTuple}`}
                                    className="flex justify-center items-center w-16 h-16 border-black border-2"
                                    ref={el => setMatrixRef(el, idx, idxTuple, ballsTupleRef)}>

                                    <div key={idxTuple} id={`ball-${idx}-${idxTuple}`}
                                        className={`w-12 h-12 bg-black rounded-full absolute ${currentMatrix[idx][idxTuple]['ball'] !== '' ? '' : 'hidden'}`}

                                        style={animationStyle}
                                        ref={el => setMatrixRef(el, idx, idxTuple, ballsRef)}></div>
                                </div>

                            ))
                            }
                        </div>
                        ))
                    }
                </div>
            </div>
        </main>
    )
}

export default Game

/*
<!--
let clientId = null
let gameId = null

const ws = new WebSocket('ws://localhost:6969')
document.getElementById('newGame')?.addEventListener('click', (_) => {
    const payload = {
        method: 'create',
        clientId,
    }

    ws.send(JSON.stringify(payload))
})

document.getElementById('joinGameBtn')?.addEventListener('click', (_) => {
    gameId = document.getElementById('inputGameId')?.value || ''
    if (gameId === null) {
        return
    }

    const payload = {
        method: 'join',
        gameId,
        clientId,
    }

    ws.send(JSON.stringify(payload))
})

ws.onmessage = (msg) => {
    const res = JSON.parse(msg.data)
    if (res.method === 'connect') {
        clientId = res.clientId
        const h1ClientId = document.getElementById('clientId')
        if (h1ClientId !== null) {
            const phraseClient =
                clientId !== null
                    ? `your client ID is: ${clientId}`
                    : 'press "new game" to get your client ID'
            h1ClientId.innerHTML = phraseClient
        }
    }

    if (res.method === 'create') {
        console.log(res)
        const h1GameId = document.getElementById('gameId')
        gameId = res.game.id
        if (h1GameId !== null) {
            const phraseGame =
                gameId !== null
                    ? `your game ID is: ${gameId}`
                    : 'press "new game" to get your game ID'
            h1GameId.innerHTML = phraseGame
            setCookie('gameId', gameId, 20)
        }
        fullMatrix = res.fullMatrix
    }

    if (res.method === 'join') {
        console.log(res)
        const h1GameId = document.getElementById('gameId')
        setCookie(res.game.id)
        if (h1GameId !== null) {
            const phraseGame =
                gameId !== null
                    ? `your game ID is: ${gameId}`
                    : 'press "new game" to get your game ID'
            h1GameId.innerHTML = phraseGame
        }
    }
}
-->
*/
