const {Engine, Render, Runner, World, Bodies, MouseConstraint,Mouse,Body, Events} = Matter;
const width = window.innerWidth;
const height = window.innerHeight-5;
const columns= 10;
const rows = 10;
const widthLenght = width/rows;
const heightLenght = height/columns;


const engine = Engine.create();
engine.world.gravity.y= 0;
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
const room = [
    Bodies.rectangle(width/2,0,width,20,{isStatic: true}),
    Bodies.rectangle(width/2,height,width,20,{isStatic: true}),
    Bodies.rectangle(0,height/2,20,height,{isStatic: true}),
    Bodies.rectangle(width,height/2,20,height,{isStatic: true}),
];

World.add(world,room)
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

        mazeCreation(nextRow,nextColumn)


    }
    
}
mazeCreation(startRow,startColumn)

horizontals.forEach((row,rowIndex)=> {
    row.forEach((open,columIndex)=> {
        if(open){
            return
        }
        // drowing walls in our maze
        const walls = Bodies.rectangle(
            widthLenght * (columIndex + 0.5),
            heightLenght * (rowIndex + 1),
            widthLenght,
            4,
            {
                label : "wall",
                isStatic:true,
                render : {
                    fillStyle : "#2a9d8f"
                }
            }
        );
        World.add(world,walls)
    });
});

verticals.forEach((row,rowIndex)=> {
    row.forEach((open,columIndex)=> {
        if(open){
            return
        }
        const walls = Bodies.rectangle(
            widthLenght* (columIndex +1),
            heightLenght *(rowIndex +0.5),
            4,
            heightLenght,
            {
                label : "wall",
                isStatic: true,
                render : {
                    fillStyle : "#e9c46a"
                }
            }
        );
        World.add(world,walls)

    });
});
const win = Bodies.rectangle(
    widthLenght * ((columns-1)+0.5),
    heightLenght * ((rows-1)+0.5),
    widthLenght * 0.6,
    heightLenght * 0.6,
    {
        label : "win",
        render:{
            fillStyle : "red"
        },
        isStatic:true
    }
)
World.add(world,win)

const ball = Bodies.polygon(
    heightLenght*0.5,
    heightLenght*0.5,
    heightLenght*0.26,
    heightLenght*0.26,
    {
        label: 'ball',
        render: { fillStyle:"" }
    }
)
World.add(world,ball)
document.addEventListener('keydown',event =>{
    const {x, y}= ball.velocity;
    if(event.keyCode === 87){
        Body.setVelocity(ball,{x, y: y-4});
    }
    if(event.keyCode === 83){
        Body.setVelocity(ball,{x, y: y+4});
    }
    if(event.keyCode === 65){
        Body.setVelocity(ball,{x:x-4, y});
    }
    if(event.keyCode === 68){
        Body.setVelocity(ball,{x:x+4, y});
        
    }
})
//winning detection
Events.on(engine, 'collisionStart',event =>{
    event.pairs.forEach(collision => {
        const labels = ['win', 'ball']
        if(labels.includes(collision.bodyA.label)  && labels.includes(collision.bodyB.label )){
            engine.world.gravity.y= 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall' || body.label === 'win'){
                    Body.setStatic(body,false);
                    document.querySelector(".winner").classList.remove("hidden");
                    
                }
            });
        }
    });
});
