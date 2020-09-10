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

// 3x3 maze generation  
// map creat new  so arrey dont effect each other
const grid = Array(rows).fill(null).map(( )=> Array(columns).fill(false));
const verticals = Array(rows).fill(null).map(( )=> Array(columns-1).fill(false));
const horizontals   = Array(rows -1 ).fill(null).map(( )=> Array(columns).fill(false));
console.log(verticals)