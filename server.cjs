const express=require("express"),fs=require("fs"),cors=require("cors"),path=require("path");
const app=express(),PORT=process.env.PORT||5000; app.use(cors());app.use(express.json());
app.get("/burgers",(req,res)=>{fs.readFile(path.join(__dirname,"app.json"),"utf8",(e,d)=>{if(e)return res.status(500).send("Error");res.json(JSON.parse(d));});});
app.get("/cart",(req,res)=>{fs.readFile(path.join(__dirname,"cart.json"),"utf8",(e,d)=>res.json(e?[]:JSON.parse(d||"[]")));});
app.post("/cart",(req,res)=>{fs.readFile(path.join(__dirname,"cart.json"),"utf8",(e,d)=>{let c=e?[]:JSON.parse(d||"[]");c.push(req.body);fs.writeFile(path.join(__dirname,"cart.json"),JSON.stringify(c,null,2),()=>res.json({message:"added",cart:c}));});});
app.delete("/cart/:index",(req,res)=>{fs.readFile(path.join(__dirname,"cart.json"),"utf8",(e,d)=>{let c=e?[]:JSON.parse(d||"[]");c.splice(+req.params.index,1);fs.writeFile(path.join(__dirname,"cart.json"),JSON.stringify(c,null,2),()=>res.json({cart:c}));});});
app.use(express.static(path.join(__dirname,"dist")));app.use(express.static(path.join(__dirname,"public")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"dist","index.html")));
app.listen(PORT,()=>console.log(`Burger Shop server: http://localhost:${PORT}`));