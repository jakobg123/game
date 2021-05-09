import "./Obstacle.scss";

export const Obstacle = ({counter}) => {
    let destroyClass = "";

    if(counter === 3){
        destroyClass = " Obstacle__Destroy Obstacle__Destroy--Three";
    }
    if(counter === 2){
        destroyClass = " Obstacle__Destroy Obstacle__Destroy--Two";
    }
    if(counter === 1){
        destroyClass = " Obstacle__Destroy Obstacle__Destroy--One";
    }

    return (
        <div 
        className={`Obstacle${!!destroyClass ? destroyClass : ""}`} 
        ></div>
    )
};