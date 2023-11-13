import { useEffect, useRef } from "react"
import './game-styles.css'
import { emitCreateGame, emitExitGame, emitJoin, emitPlayRound, emitWinner} from "@utils/game-websocket"
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
        gameID,
        playerColor,
        playerTurn,
        gameWinner,
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

    const onNewGameClick = () => {
        emitExitGame(webSocket, clientID)
        emitCreateGame(webSocket, clientID)
    }

    const onExitGameClick = () => {
        emitExitGame(webSocket, clientID)
    }

    const onJoinGameClick = () => {
        emitExitGame(webSocket, clientID)
        emitJoin(webSocket, clientID, inputJoinGameRef.current)
    }

    useEffect(() => {
        setCurrentMatrix(Array(matrixH).fill(null)
            .map(() => new Array(matrixW).fill({ball: ''})))
    }, [gameID])

    const checkGameWinner = () => {
        for (let i=0; i<currentMatrix.length; i++) {
            for (let j=0; j<currentMatrix[i].length; j++) {
                const pos = currentMatrix[i][j]
                if (pos.ball === '') continue
                console.log(currentMatrix[i][j], pos.ball)
                const ballColor = pos.ball

                if(currentMatrix[i][j+1] &&
                    currentMatrix[i][j+1].ball === ballColor &&
                    currentMatrix[i][j+2] &&
                    currentMatrix[i][j+2].ball === ballColor) {
                    console.log('HORIZONTAL WINNER')
                    emitWinner(webSocket, clientID, gameID, ballColor)
                }
                if (currentMatrix[i+1] &&
                    currentMatrix[i+1][j].ball === ballColor &&
                    currentMatrix[i+2] &&
                    currentMatrix[i+2][j].ball === ballColor
                ) {
                    console.log('VERTICAL WINNER')
                    emitWinner(webSocket, clientID, gameID, ballColor)
                }
                if (currentMatrix[i+1] && currentMatrix[i+1][j-1] &&
                    currentMatrix[i+1][j-1].ball === ballColor &&
                    currentMatrix[i+2] && currentMatrix[i+2][j-2] &&
                    currentMatrix[i+2][j-2].ball === ballColor
                ) {
                    console.log('BACK-DIAGONAL WINNER')
                    emitWinner(webSocket, clientID, gameID, ballColor)
                }
                if (currentMatrix[i+1] && currentMatrix[i+1][j+1] &&
                    currentMatrix[i+1][j+1].ball === ballColor &&
                    currentMatrix[i+2] && currentMatrix[i+2][j+2] &&
                    currentMatrix[i+2][j+2].ball === ballColor
                ) {
                    console.log('FRONT-DIAGONAL WINNER')
                    emitWinner(webSocket, clientID, gameID, ballColor)
                }
            }
        }
    }

    const onPlayRound = (col, playerColor) => {
        const newMatrix = [...currentMatrix]

        for(let h = matrixH - 1; h >= 0; h--) {
            if(newMatrix[h][col].ball == '') {
                newMatrix[h][col] = {ball: playerColor}
                setCurrentMatrix(newMatrix)
                emitPlayRound(webSocket, gameID || null, clientID, newMatrix)
                break
            }
        }
        checkGameWinner()
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
                    <ButtonJsx id="exitGame" text="Exit Game" onClick={onExitGameClick}>Exit Game</ButtonJsx>
                </div>
            </div>
            <div id="game-container" className="flex flex-col justify-center items-center mt-4">
                <h3 className={`font-bold text-lg`} >
                    Your balls are {' '}
                    <p className={`inline-block ${playerColor === 'blue' ? 'text-blue-500' : 'text-red-500'}`}>
                        {playerColor}
                    </p>
                </h3>
                <h3 className={`font-bold text-lg`} >
                    PLAYER TURN: {' '}
                    <p className={`inline-block ${playerTurn === 'blue' ? 'text-blue-500' : 'text-red-500'}`}>
                        {playerTurn}
                    </p>
                </h3>
                {gameWinner !== '??' ? (
                    <h3 className={`font-bold text-lg`} >
                        WINNER HAVE <p className={`inline-block ${gameWinner === 'blue' ? 'text-blue-500' : 'text-red-500'}`}>
                            {gameWinner.toUpperCase()}
                        </p> BALLS
                    </h3>
                ) : (
                        <h3 className={`font-bold text-lg`} >
                            THE GAME IS ON!
                        </h3>
                    )}
                <div className="flex flex-row justify-center items-center w-full between mb-1">
                    {
                        new Array(matrixW).fill(null).map((_, i) => (
                            <div key={i} className="w-16 h-16 flex items-center justify-center">
                                <button
                                    disabled={playerColor !== playerTurn && gameID}
                                    key={i}
                                    className="w-14 h-14 rounded-md bg-black text-white"
                                    onClick={() => {
                                        onPlayRound(i, playerColor)
                                    }}
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
                                        className={`w-12 h-12 ${currentMatrix[idx][idxTuple].ball === 'red' ? 'bg-red-500' : 'bg-blue-500'} rounded-full absolute ${currentMatrix[idx][idxTuple]['ball'] !== '' ? '' : 'hidden'}`}

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

