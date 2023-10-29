import { useEffect, useRef } from "react"
import './game-styles.css'
import { emitCreateGame, emitJoin, emitPlayRound} from "@utils/game-websocket"
import ButtonJsx from "./button"
import { WebSocketProvider, useWebSocketContext } from "@utils/hooks/websocket-context"

const Game = function() {
    console.log('rendered')

    const {
        matrixW,
        matrixH,
        currentMatrix,
        setCurrentMatrix,
        webSocket,
        clientID,
        gameID
    } = useWebSocketContext()

    const animationStyle = {
        transition: 'top 2s ease-in-out',
        animation: 'ball-animation 4s ease-in-out'
    }

    const inputJoinGameRef = useRef('')
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
    }, [])

    useEffect(() => {
        setCurrentMatrix(Array(matrixH).fill(null)
            .map(() => new Array(matrixW).fill({ball: ''})))
    }, [gameID])

    const onNewGameClick = () => {
        emitCreateGame(webSocket, clientID)
    }

    const onJoinGameClick = () => {
        emitJoin(webSocket, clientID, inputJoinGameRef.current)
    }

    const onPlayRound = (col, playerColor) => {
        const newMatrix = [...currentMatrix]

        for(let h = matrixH - 1; h >= 0; h--) {
            if(newMatrix[h][col].ball == '') {
                newMatrix[h][col] = {ball: playerColor}
                setCurrentMatrix(newMatrix)
                emitPlayRound(webSocket, gameID, clientID, newMatrix)
                return
            }
        }
    }

    return (
        <main className="mt-16">
            <div>
                <h1 id="clientId">ClientID: {clientID}</h1>

                {!gameID?
                    <h1 id="gameId">
                        GameID: "New Game" to get a GameID or "Join" someone else's game
                    </h1>
                    : <h1 id="gameId">
                        GameID: {gameID}
                    </h1>
                }
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Your game ID"
                        id="inputGameId"
                        className="rounded-md pl-2"
                        onChange={(ev) => inputJoinGameRef.current = ev.target.value}
                        ref={inputJoinGameRef}
                    />
                    <ButtonJsx id="joinGameBtn" text="Join Game" onClick={onJoinGameClick}>Join Game</ButtonJsx>
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
                                    onClick={() => onPlayRound(i, 'red')}
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

export default () => {
    return (
        <WebSocketProvider>
            <Game />
        </WebSocketProvider>
    )
}

