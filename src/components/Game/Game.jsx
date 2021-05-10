import {useState, useEffect} from 'react';
import {BOARD_ROWS, BOARD_COLUMNS, BOARD_GRID, getWhiteCellColor} from "../../utils/board";
import {DIFFICULTY} from "../../utils/options";
import {Obstacle} from "../Obstacle/Obstacle.jsx";
import "./Game.scss";

const Game = () => {
    const [snake, setSnake] = useState([]);
    const [obstacles, setObstacles] = useState([]);
    const [validMoves, setValidMoves] = useState([]);
    const [score, setScore] = useState(0);
    const [startGame, setStartGame] = useState(false)
    const [difficultyLevel, setDifficultyLevel] = useState(DIFFICULTY.medium)


    useEffect(() => {
            const snakeHead = getRandomPosition();
            setSnake([...snake, snakeHead]);
    }, [startGame])

    useEffect(() => {
        if(snake.length === 1){
            setValidMoves(getValidMoves());
        }

        if(snake.length > 1){
            setObstacles(getRandomObstacle());
        }
    }, [snake])

    useEffect(() => {
        setValidMoves(getValidMoves());
    }, [obstacles])

    const getDirections = (snakeHead) => ( {
        up: {row: snakeHead.row - 1, col: snakeHead.col},
        right: {row: snakeHead.row, col: snakeHead.col + 1},
        down: {row: snakeHead.row + 1, col: snakeHead.col},
        left: {row: snakeHead.row, col: snakeHead.col - 1},
    });

    const getValidMoves = () => {
        let moves = [];
        if(!!snake.length){
            const snakeHead = snake[0];
            const directions = getDirections(snakeHead);

            if(checkMove(directions.up)){
                moves = [directions.up]
            }
            if(checkMove(directions.right)){
                moves = [...moves, directions.right]
            }
            if(checkMove(directions.down)){
                moves = [...moves, directions.down]
            }
            if(checkMove(directions.left)){
                moves = [...moves, directions.left]
            }
        }
        return moves;
    }

    const moveIsOutOfBounds = (move) => move.row < 0 || move.row >= BOARD_ROWS || move.col < 0 || move.col >= BOARD_COLUMNS;

    const cellIsOccupiedBy = (possibleOccupant, cell) => possibleOccupant.some((part) => checkIfPartIsOnCell(part, cell));

    const checkIfPartIsOnCell = (part, cell) => part.row === cell.row && part.col === cell.col;

    const checkMove = (move) => {

        if(moveIsOutOfBounds(move)){
            return false;
        }
        
        if(cellIsOccupiedBy(snake, move)){
            return false;
        }

        if(cellIsOccupiedBy(obstacles, move)){
            return false;
        }

        return true;
    }

    const getRandomObstacle = () => {
        let randomObstacle = getRandomPosition();

        if(cellIsOccupiedBy(snake, randomObstacle) || cellIsOccupiedBy(obstacles, randomObstacle)){
            return getRandomObstacle();
        }

        randomObstacle.counter = difficultyLevel.obstacleCounter;
        
        let updatedObstacles = updateObstacleCounterAndRemoveIfZero([...obstacles]);

        return [...updatedObstacles, randomObstacle];
    }

    const updateObstacleCounterAndRemoveIfZero = (obstaclesToBeUpdated) => {
        return obstaclesToBeUpdated.reduce((filtered, obstacle) => {
            const updatedCounter = obstacle.counter - 1;

            if(updatedCounter > 0){
                const updatedObstacle = {...obstacle, counter: updatedCounter};
                filtered.push(updatedObstacle);
            }
            return filtered;
        }, []);
    };

    const getRandomPosition = () => (
        {
            row: Math.floor(Math.random() * BOARD_ROWS),
            col: Math.floor(Math.random() * BOARD_COLUMNS),
        }
    )

    const handleClick = (cellToMoveTo) => {
        let newDirection = {row: snake[0].row - cellToMoveTo.row, col: snake[0].col - cellToMoveTo.col};
        let directionToMoveTo = "";
        
        switch(JSON.stringify(newDirection)){
            case JSON.stringify({ row: 1, col: 0 }):
                directionToMoveTo = "up";
                break;
            case JSON.stringify({ row: -1, col: 0 }):
                directionToMoveTo = "down";
                break;
            case JSON.stringify({ row: 0, col: 1 }):
                directionToMoveTo = "left";
                break;
            case JSON.stringify({ row: 0, col: -1 }):
                directionToMoveTo = "right";
                break;
        }
    
        moveSnake(getDirections(snake[0])[directionToMoveTo]);
    }

    const moveSnake = (direction) =>{
        let updatedSnake = [...snake];
        
        updatedSnake.unshift(direction);

        if(updatedSnake.length > difficultyLevel.snakeLength){
            updatedSnake.pop();
        }

        updateGame(updatedSnake);
    }

    const updateGame = (updatedSnake) => {
        setSnake(updatedSnake);
        setScore(score + 1);
    }

    const getSnakeStyle = (cell) => {
        const snakePartIndex = snake.findIndex(snakePart => checkIfPartIsOnCell(snakePart, cell));
        
        const scaleValue = 1 - (snakePartIndex/difficultyLevel.snakeLength);
        
        return {transform: `scale(${scaleValue.toString()})`};
    }

    const getObstacleCounter = (cell) => {
        if(!cell){
            return;
        }
        const [{counter}] = obstacles.filter(obstacle => obstacle.row === cell.row && obstacle.col === cell.col);
        return counter;
    }

    const setDifficulty = (event) => {
        setDifficultyLevel(DIFFICULTY[event.currentTarget.value])
    }

    const restart = () => {
        setValidMoves([]);
        setSnake([]);
        setObstacles([]);
        setScore(0);
        setStartGame(!startGame);
    }
    
    const boardJsx = BOARD_GRID.map((cell, index) => (
        <div className={`Board__GridCell${getWhiteCellColor(cell.row, index)}`} key={cell.row.toString()+ cell.col.toString()}>
                
                {cellIsOccupiedBy(snake, cell) && (
                    <div 
                    className={`Board__Snake`} 
                    style={getSnakeStyle(cell)}
                    ></div>
                )}
                
                {cellIsOccupiedBy(validMoves, cell) && (
                    <div 
                    className={`Board__ValidMove`}
                    onClick={() => handleClick(cell)}
                    ></div>
                )}
                
                {cellIsOccupiedBy(obstacles, cell) && (
                    <Obstacle counter={getObstacleCounter(cell)}/>
                )}
                
        </div>
    ))

    return (
        <div className="Game">  
            <header className="Game__Header">
                <h1>Score: {score}</h1>
                <form>
                    <label for="difficulty">Difficulty</label>
                    <select id="difficulty" name="difficulty" onChange={setDifficulty} disabled={snake.length > 1 ? true : false}>
                        <option value="easy">Easy</option>
                        <option selected="selected" value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="insane">Insane</option>
                    </select>
                </form>
            </header>
            <main className="Board">            
                {boardJsx}
                {(!validMoves.length && !!obstacles.length) && (
                    <div 
                    className={`Board__GameOver`}
                    >   <h1>GAME OVER</h1>
                        <button onClick={restart}>Restart</button>
                    </div>
                )
                }
            </main>
        </div>
    )
}

export default Game
