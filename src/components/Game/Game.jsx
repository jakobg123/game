import {useState, useEffect} from 'react';
import "./Game.scss";

const Game = () => {
    const [snake, setSnake] = useState([]);
    const [obstacles, setObstacles] = useState([]);
    const [validMoves, setValidMoves] = useState([]);

    const [score, setScore] = useState(0);
    const [startGame, setStartGame] = useState(false)
    
    const BOARD_ROWS = 8;
    const BOARD_COLUMNS = 8;
    
    let gridData = [];
    for(let row = 0; row < BOARD_ROWS; row++){
        for(let col = 0; col < BOARD_COLUMNS; col++){
            gridData.push({row, col})
        }
    }

    const restart = () => {
        setValidMoves([]);
        setSnake([]);
        setObstacles([]);
        setScore(0);
        setStartGame(!startGame);
    }

    useEffect(() => {
            const snakeHead = getRandomPosition();
            setSnake([...snake, snakeHead]);
    }, [startGame])

    useEffect(() => {
        if(snake.length === 1){
            getValidMoves();
        }

        if(snake.length > 1){
            getRandomObstacle();
        }
    }, [snake])

    useEffect(() => {
        getValidMoves();
    }, [obstacles])

    const updateObstacleCounterAndRemoveIfZero = (prevObstacles) => {
        return prevObstacles.reduce((filtered, obstacle) => {
            const updatedCounter = obstacle.counter - 1;

            if(updatedCounter > 0){
                const updatedObstacle = {...obstacle, counter: updatedCounter};
                filtered.push(updatedObstacle);
            }
            return filtered;
        }, []);
    };

    const getValidMoves = () => {
        let moves = [];

        if(!!snake.length){

            if(checkMove("up")){
                moves = [{row: snake[0].row - 1, col: snake[0].col}]
            }
            if(checkMove("right")){
                moves = [...moves, {row: snake[0].row, col: snake[0].col + 1}]
            }
            if(checkMove("down")){
                moves = [...moves, {row: snake[0].row + 1, col: snake[0].col}]
            }
            if(checkMove("left")){
                moves = [...moves, {row: snake[0].row, col: snake[0].col - 1}]
            }
        }
        setValidMoves(moves);
    }

    const checkMove = (direction) => {
        let move = {};

        switch(direction){
            case "up":
                move = {row: snake[0].row - 1, col: snake[0].col};
                break;
            case "right":
                move = {row: snake[0].row, col: snake[0].col + 1};
                break;
            case "down":
                move = {row: snake[0].row + 1, col: snake[0].col};
                break;
            case "left":
                move = {row: snake[0].row, col: snake[0].col - 1};
                break;
            }
        
        if(move.row < 0 || move.row >= BOARD_ROWS || move.col < 0 || move.col >= BOARD_COLUMNS){
            return false;
        }

        if(snake.some((snakePart) => checkIfPartIsOnCell(snakePart, move))){
            return false;
        }

        if(!!obstacles.length && obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, move))){
            return false;
        }
        return true;
    }
    
    const getWhiteCellColor = (row, index) => {
        if(row % 2 === 0 && index % 2 === 0){
            return " Board__GridCell--White";
        } 
        if (row % 2 === 1 && index % 2 === 1){
            return " Board__GridCell--White";
        }
        return "";
    }

    const getRandomObstacle = () => {
        let randomObstacle = getRandomPosition();
        
        if(snake.some((snakePart) => checkIfPartIsOnCell(snakePart, randomObstacle))){
            return getRandomObstacle();
        }
        
        if(obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, randomObstacle))){
            return getRandomObstacle();
        }

        randomObstacle.counter = 20;
        let updatedObstacles = updateObstacleCounterAndRemoveIfZero([...obstacles]);
        return setObstacles([...updatedObstacles, randomObstacle]);
    }

    const getRandomPosition = () => (
        {
            row: Math.floor(Math.random() * BOARD_ROWS),
            col: Math.floor(Math.random() * BOARD_COLUMNS),
        }
    )

    const handleClick = (direction) => {
        let newDirection = {row: snake[0].row - direction.row, col: snake[0].col - direction.col};
        let change = "";
        
        switch(JSON.stringify(newDirection)){
            case JSON.stringify({ row: 1, col: 0 }):
                change = "up";
                break;
            case JSON.stringify({ row: -1, col: 0 }):
                change = "down";
                break;
            case JSON.stringify({ row: 0, col: 1 }):
                change = "left";
                break;
            case JSON.stringify({ row: 0, col: -1 }):
                change = "right";
                break;
        }
    
        moveSnake(change);
    }

    const moveSnake = (direction) =>{
        let newDirection = {};
        switch (direction) {
            case "left":
                newDirection = {row: snake[0].row, col: snake[0].col - 1};
                break;
            case "up":
                newDirection = {row: snake[0].row - 1, col: snake[0].col};
                break;
            case "right":
                newDirection = {row: snake[0].row, col: snake[0].col + 1};
                break;
            case "down":
                newDirection = {row: snake[0].row + 1, col: snake[0].col};
            break;
        }

        let updatedSnake = [...snake];
        updatedSnake.unshift(newDirection);

        if(updatedSnake.length > 7){
            updatedSnake.pop();
        }

        updateGame(updatedSnake);
    }

    const updateGame = (updatedSnake) => {
        setSnake(updatedSnake);
        setScore(score + 1);
    }

    const checkIfPartIsOnCell = (part, cell) => part.row === cell.row && part.col === cell.col;

    const getSnakeStyle = (index) => {
        const scaleValue = 1 - (index/7);
        return {transform: `scale(${scaleValue.toString()})`};
    }

    const getObstacleCounter = (cell) => {
        if(!cell){
            return;
        }
        const [{counter}] = obstacles.filter(obstacle => obstacle.row === cell.row && obstacle.col === cell.col);
        return counter;
    }
    
    const gridJsx = gridData.map((cell, index) => (
        <div className={`Board__GridCell${getWhiteCellColor(cell.row, index)}`} key={cell.row.toString()+ cell.col.toString()}>

                {snake.some((snakePart) => checkIfPartIsOnCell(snakePart, cell)) && (
                    <div 
                    className={`Board__Snake`} 
                    style={getSnakeStyle(snake.findIndex(snakePart => checkIfPartIsOnCell(snakePart, cell)))}
                    ></div>
                )}

                {validMoves.some((validCell) => checkIfPartIsOnCell(validCell, cell)) && (
                    <div 
                    className={`Board__ValidMove`}
                    onClick={() => handleClick(cell)}
                    ></div>
                )}

                {(!!obstacles.length && obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, cell))) && (     
                    <Obstacle counter={getObstacleCounter(cell)}/>
                )}

                
        </div>
    ))

    return (
        <>
            <h1>Score: {score}</h1>
            <div className="Board" tabIndex="0">            
                {gridJsx}
                {(!validMoves.length && !!obstacles.length) && (
                    <div 
                    className={`Board__GameOver`}
                    >   <h1>GAME OVER</h1>
                        <button onClick={restart}>Restart</button>
                    </div>
                )
                }
            </div>
        </>
    )
}

const Obstacle = ({counter}) => {
    let destroyClass = "";

    if(counter === 3){
        destroyClass = " Board__Destroy Board__Destroy--Three";
    }
    if(counter === 2){
        destroyClass = " Board__Destroy Board__Destroy--Two";
    }
    if(counter === 1){
        destroyClass = " Board__Destroy Board__Destroy--One";
    }

    return (
        <div 
        className={`Board__Obstacle${!!destroyClass ? destroyClass : ""}`} 
        ></div>
    )
};

export default Game
