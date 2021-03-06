const {Engine, Render, Runner, World, Bodies, MouseConstraint,Mouse} = Matter;

const engine = Engine.create();
const {world} =engine;
const render = Render.create({
    element:document.body,
    engine: engine,
    options:{
        wireframes:false,
        width:window.innerWidth-20,
        height:window.innerHeight-20,
    }
});
Render.run(render);
Runner.run(Runner.create(),engine);
//click and drag
World.add(world,MouseConstraint.create(engine,{
    mouse:Mouse.create(render.canvas)
}))



// walls
const walls = [
    Bodies.rectangle(window.innerWidth/2,0,window.innerWidth,50,{isStatic: true}),
    Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth*(-1),100,{isStatic: true}),
    Bodies.rectangle(0,window.innerHeight/2,50,window.innerHeight,{isStatic: true}),
    Bodies.rectangle(window.innerWidth,window.innerHeight/2,100,window.innerHeight,{isStatic: true}),
];

World.add(world,walls)
//random shapes
for(let i =0; i<100 ;i++){
    let moveWidth = Math.floor(Math.random()* window.innerWidth);
    let moveHight = Math.floor(Math.random()* window.innerHeight);
    if(Math.random() > 0.5){
        World.add(world,Bodies.rectangle(moveWidth,moveHight,50,50,{
            render:{
                fillStyle:""
            }
        }))
    }else{
        World.add(world,Bodies.polygon(moveWidth,moveHight,50,50,{
            render:{
                fillStyle:""
            }
        }))
    }
    
}
