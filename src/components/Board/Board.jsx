import {useState, useEffect} from 'react';
import "./Board.scss";

const Board = () => {
    const [snake, setSnake] = useState([]);
    console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 6 ~ Board ~ snake", snake)
    const [obstacles, setObstacles] = useState([]);
    console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 8 ~ Board ~ obstacles", obstacles)
    const [validMoves, setValidMoves] = useState([]);

    const [allMoves, setAllMoves] = useState(0);
    const [allObstacles, setAllObstacles] = useState(0);

    const [restartGame, setRestartGame] = useState(false)
    
    // const [boardDimension, setBoardDimension] = useState(
    //     {
    //         // rows: 2,
    //         // cols: 2,
    //         rows: 8,
    //         cols: 8,
    //         grid: [],
    //     }
    // )

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
        setAllMoves(0);
        setRestartGame(!restartGame);
    }

    // useEffect(() => {
    //     if(!validMoves.length && !!obstacles.length){
    //         alert("Game over");
    //     }
    // }, [validMoves])

    useEffect(() => {
            const snakeHead = getRandomPosition();
            setSnake([...snake, snakeHead]);
    }, [restartGame])

    // useEffect(() => {
    //     // if(!boardDimension.grid.length){

    //         const snakeHead = getRandomPosition();
    //         setSnake([...snake, snakeHead]);
    //         // setBoardDimension({...boardDimension, grid: gridData});
    //     // }
    // }, [restartGame])

    useEffect(() => {
        if(snake.length === 1){
            getValidMoves();
        }

        // if(!!obstacles.length){
            // let prevObstacles = [...obstacles];
            // console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 62 ~ useEffect ~ prevObstacles", prevObstacles)

            // const updatedObstacles = updateObstacleCounterAndRemoveIfZero(prevObstacles)
            // console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 64 ~ useEffect ~ updatedObstacles", updatedObstacles)

            // setObstacles(updatedObstacles);
        // }

        if(snake.length > 1){
            getRandomObstacle();
        }

        // getValidMoves();
    }, [snake])

    useEffect(() => {
        getValidMoves();
    }, [obstacles])

    // useEffect(() => {

    //     if(!!obstacles.length){
    //         let prevObstacles = [...obstacles];

    //         const updatedObstacles = updateObstacleCounterAndRemoveIfZero(prevObstacles)
    //         console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 64 ~ useEffect ~ updatedObstacles", updatedObstacles)

    //         setObstacles(updatedObstacles);
    //     }
        
    // }, [allMoves])

    const updateObstacleCounterAndRemoveIfZero = (prevObstacles) => {
        console.log("uppdateringscountern körs");
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
                console.log("höger");
                moves = [...moves, {row: snake[0].row, col: snake[0].col + 1}]
            }
            if(checkMove("down")){
                console.log("neråt");
                moves = [...moves, {row: snake[0].row + 1, col: snake[0].col}]
            }
            if(checkMove("left")){
                console.log("vänster");
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
        //TODO: den här logiken är inte toppen, man vill inte att den ska falla utanför banan, så ta hänsyn till både row och column, just nu bara row
        // if(move < 0 || move > boardDimension.row || snake.some((snakePart) => checkIfPartIsOnCell(snakePart, move)) || obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, move))){
        //     return false;
        // }
        
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
        // let randomObstacle = {};
        let randomObstacle = getRandomPosition();
        console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 154 ~ getRandomObstacle ~ randomObstacle", randomObstacle)
        console.log("OUTPUT ÄR ~ file: Board.jsx ~ line 153 ~ getRandomObstacle ~ snake", snake)

        if(snake.some((snakePart) => checkIfPartIsOnCell(snakePart, randomObstacle))){
            console.log("FEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLL: ", randomObstacle);
            return getRandomObstacle();
        }
        
        if(obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, randomObstacle))){
            console.log("161 FEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLL: ", randomObstacle);
            return getRandomObstacle();
        }

        randomObstacle.counter = 20;
        let updatedObstacles = updateObstacleCounterAndRemoveIfZero([...obstacles]);
        console.log("NU SÄTTS EN OBSTACLE");
        return setObstacles([...updatedObstacles, randomObstacle]);
        // return setObstacles([...obstacles, randomObstacle]);
    }

    const getRandomPosition = () => {
        console.log("den slumpar fram ett nytt tal");
        return (
            {
                row: Math.floor(Math.random() * BOARD_ROWS),
                col: Math.floor(Math.random() * BOARD_COLUMNS),
            }

        )
    }

    // const getRandomPosition = () => (
    //     {
    //         row: Math.floor(Math.random() * boardDimension.rows),
    //         col: Math.floor(Math.random() * boardDimension.cols),
    //     }
    // )

    const handleClick = (direction) => {
        let newDirection = {row: snake[0].row - direction.row, col: snake[0].col - direction.col};
        let change = "";
        
        switch(JSON.stringify(newDirection)){
            case JSON.stringify({ row: 1, col: 0 }):
                console.log("up");
                change = "up";
                break;
            case JSON.stringify({ row: -1, col: 0 }):
                console.log("down");
                change = "down";
                break;
            case JSON.stringify({ row: 0, col: 1 }):
                console.log("left");
                change = "left";
                break;
            case JSON.stringify({ row: 0, col: -1 }):
                console.log("right");
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
        // getRandomObstacle();
        setAllMoves(allMoves + 1);
        // setAllObstacles(allObstacles + 1);
    }

    // const handleKeyUp = (e) => {
    //     console.log(e.key);
    //     console.log(e.keyCode);
    //     let newDirection = {};

    //     switch (e.keyCode) {
    //         case 37:
    //             // console.log("left");
    //             newDirection = {row: snake[0].row, col: snake[0].col - 1};
    //             break;
    //         case 38:
    //             // console.log("up");
    //             newDirection = {row: snake[0].row - 1, col: snake[0].col};
    //             break;
    //         case 39:
    //             // console.log("right");
    //             newDirection = {row: snake[0].row, col: snake[0].col + 1};
    //             break;
    //         case 40:
    //             // console.log("down");
    //             newDirection = {row: snake[0].row + 1, col: snake[0].col};
    //         break;
    //     }

    //     let updatedSnake = [...snake];
    //     updatedSnake.unshift(newDirection);
    //     if(updatedSnake.length > 7){
    //         updatedSnake.pop();
    //     }
    //     getRandomObstacle();
    //     setSnake(updatedSnake);
    //     setAllMoves(allMoves + 1);
    //     setAllObstacles(allObstacles + 1);
    // }

    const checkIfPartIsOnCell = (part, cell) => part.row === cell.row && part.col === cell.col;

    const getSnakeStyle = (index) => {
        const scaleValue = 1 - (index/7);
        // const scaleValue = 1 - (index/snake.length);
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
            {/* {cell.row + "/" + cell.col} */}

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
            <h1>Moves: {allMoves}</h1>
            <h1>Obstacles: {allObstacles}</h1>
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
        destroyClass = " Board__Destroy--Three";
    }
    if(counter === 2){
        destroyClass = " Board__Destroy--Two";
    }
    if(counter === 1){
        destroyClass = " Board__Destroy--One";
    }

    return (
        <div 
        className={`Board__Obstacle${!!destroyClass ? destroyClass : ""}`} 
        >{counter}</div>
    )
};

export default Board
