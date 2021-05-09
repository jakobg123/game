export const BOARD_ROWS = 8;
export const BOARD_COLUMNS = 8;
    
let BOARD_GRID = [];
for(let row = 0; row < BOARD_ROWS; row++){
    for(let col = 0; col < BOARD_COLUMNS; col++){
        BOARD_GRID.push({row, col})
    }
}
export {BOARD_GRID};

export const getWhiteCellColor = (row, index) => {
    if(row % 2 === 0 && index % 2 === 0){
        return " Board__GridCell--White";
    } 
    if (row % 2 === 1 && index % 2 === 1){
        return " Board__GridCell--White";
    }
    return "";
}

