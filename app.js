const {Engine, Render, Runner, World, Bodies, MouseConstraint,Mouse} = Matter;
const width = 600;
const height = 600;
const columns= 3;
const rows = 3;

const engine = Engine.create();
const {world} =engine;
const render = Render.create({
    element:document.body,
    engine: engine,
    options:{
        wireframes:false,
        width:width,
        height:height,
    }
});
Render.run(render);
Runner.run(Runner.create(),engine);
World.add(world,MouseConstraint.create(engine,{
    mouse:Mouse.create(render.canvas)
}))



// walls
const walls = [
    Bodies.rectangle(width/2,0,width,40,{isStatic: true}),
    Bodies.rectangle(width/2,height,width,40,{isStatic: true}),
    Bodies.rectangle(0,height/2,40,height,{isStatic: true}),
    Bodies.rectangle(width,height/2,40,height,{isStatic: true}),
];

World.add(world,walls)
//shuffle

function shuffle(arr){
    let count = arr.length;
    while (count>0){
        const index =  Math.floor(Math.random()* count)
        count--;
        const temp = arr[count];
        arr[count] = arr[index];
        arr[index] = temp;
    }
    return arr;

}

// 3x3 maze generation  
// map creat new  so arrey dont effect each other
const grid = Array(rows).fill(null).map(( )=> Array(columns).fill(false));
const verticals = Array(rows).fill(null).map(( )=> Array(columns-1).fill(false));
const horizontals   = Array(rows -1 ).fill(null).map(( )=> Array(columns).fill(false));


//random start 
const startRow =Math.floor(Math.random() * rows);
const startColumn =Math.floor(Math.random() * columns);

function mazeCreation(row,column){
    
    if(grid[row][column]){
        return true;
    }
    //marking cell as visited
    grid[row][column] = true;
    // checking the neighbours
    const neighbors = shuffle([
        [row -1,column,'up'],
        [row +1,column,'down'],
        [row,column -1,'left'],
        [row,column +1,'right'],
    ]);
    //now we have to randomize the neigburs
    for(let neighbor of neighbors){ 
        const [nextRow, nextColumn,direction] = neighbor;

        if(nextRow <0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns){
            continue;
        }
        if(grid[nextRow][nextColumn]){
            continue;
        }
        // removing the walls 
        if(direction ==="left"){
            verticals[row][column-1] = true;

        }else if(direction === "right"){
            verticals[row][column] = true;
        }else if (direction==="up"){
            horizontals[row-1][column] = true;
        }else if (direction==="down"){
            horizontals[row][column] = true;
        }




    }
    
}
cellChecker(1,1)