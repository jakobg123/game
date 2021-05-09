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
    
    const [boardDimension, setBoardDimension] = useState(
        {
            rows: 8,
            cols: 8,
            grid: [],
        }
    )
    
    let gridData = [];
    for(let row = 0; row < boardDimension.rows; row++){
        for(let col = 0; col < boardDimension.cols; col++){
            gridData.push({row, col})
        }
    }

    // useEffect(() => {
    //     if(!validMoves.length && !!obstacles.length){
    //         alert("Game over");
    //     }
    // }, [validMoves])

    useEffect(() => {
        if(!boardDimension.grid.length){
            const snakeHead = getRandomPosition();
            setSnake([...snake, snakeHead]);
            setBoardDimension({...boardDimension, grid: gridData});
        }
    }, [])

    useEffect(() => {
        getValidMoves();

        if(!!obstacles.length){
            let prevObstacles = [...obstacles];

            const updatedObstacles = updateObstacleCounterAndRemoveIfZero(prevObstacles)

            setObstacles(updatedObstacles);
        }
    }, [snake])

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
        
        if(move.row < 0 || move.row >= boardDimension.rows || move.col < 0 || move.col >= boardDimension.cols){
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
            return "Board__GridCell--White";
        } 
        if (row % 2 === 1 && index % 2 === 1){
            return "Board__GridCell--White";
        }
    }

    const getRandomObstacle = () => {
        const randomObstacle = getRandomPosition();

        if(snake.some((snakePart) => checkIfPartIsOnCell(snakePart, randomObstacle))){
            console.log("FEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLL: ", randomObstacle);
            return getRandomObstacle();
        }
        
        if(!!obstacles.length && obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, randomObstacle))){
            return getRandomObstacle();
        }

        randomObstacle.counter = 21;
        setObstacles([...obstacles, randomObstacle]);
    }

    const getRandomPosition = () => (
        {
            row: Math.floor(Math.random() * boardDimension.rows),
            col: Math.floor(Math.random() * boardDimension.cols),
        }
    )

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
        
        getRandomObstacle();
        setSnake(updatedSnake);
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
        const scaleValue = 1 - (index/snake.length);
        return {transform: `scale(${scaleValue.toString()})`};
    }

    const getObstacleCounter = (cell) => {
        if(!cell){
            return;
        }
        const [{counter}] = obstacles.filter(obstacle => obstacle.row === cell.row && obstacle.col === cell.col);
        return counter;
    }
    

    const gridJsx = boardDimension.grid.map((cell, index) => (
        <div className={`Board__GridCell ${getWhiteCellColor(cell.row, index)}`} key={cell.row.toString()+ cell.col.toString()}>
            {/* {cell.row + "/" + cell.col} */}

                {snake.some((snakePart) => checkIfPartIsOnCell(snakePart, cell)) && (
                    <div 
                    className={`Board__Snake`} 
                    style={getSnakeStyle(snake.findIndex(snakePart => checkIfPartIsOnCell(snakePart, cell)))}
                    ></div>
                )}

                {(!!obstacles.length && obstacles.some((obstacle) => checkIfPartIsOnCell(obstacle, cell))) && (     
                    
                    // let stuff = obstacles.filter(obstacle => obstacle.row === cell.row && obstacle.col === cell.col);
                    // return(
                        <Obstacle counter={getObstacleCounter(cell)}/>
                    // )
                )
                
                // obstacles.filter(x => x.row === cell.row && x.col === cell.col)(
                        
                //         <Obstacle />
                //     // <div 
                //     // className={`Board__Obstacle`} 
                //     // >{cell.row}/{cell.col}</div>
                // )
                }

                {validMoves.some((validCell) => checkIfPartIsOnCell(validCell, cell)) && (
                    <div 
                    className={`Board__ValidMove`}
                    onClick={() => handleClick(cell)}
                    ></div>
                )}

                {(!validMoves.length) && (
                // {(!validMoves.length && !!obstacles.length) && (
                    <div 
                    className={`Board__GameOver`}
                    >   <h1>GAME OVER</h1>
                        <button onClick={() => console.log("hej")}>Restart</button>
                    </div>
                )
                }

        </div>
    ))

    return (
        <>
            <h1>Moves: {allMoves}</h1>
            <h1>Obstacles: {allObstacles}</h1>
            <div className="Board" tabIndex="0">            
                {gridJsx}
            </div>
        </>
    )
}

const Obstacle = ({counter}) => {
    let destroyClass = "";

    if(counter === 3){
        destroyClass = "Board__Destroy--Three";
    }
    if(counter === 2){
        destroyClass = "Board__Destroy--Two";
    }
    if(counter === 1){
        destroyClass = "Board__Destroy--One";
    }

    return (
        <div 
        className={`Board__Obstacle ${!!destroyClass && destroyClass}`} 
        >{counter}</div>
    )
};

export default Board
