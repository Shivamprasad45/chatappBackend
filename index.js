const express= require('express')
const http =  require("http")

const  {Server} = require('socket.io')
const  cors= require('cors')

const app = express();

app.use(cors());
const PORT = process.env.PORT || 5000;
const server= http.createServer(app);

const io= new Server(server ,{
cors:{
    origin:"*"
}

})


app.use("/",(req,res)=>{
res.send("Hello world")

})
const users = {};
io.on("connection",(socket)=>{
    console.log("User connected" , socket.id)
//Messages 
socket.on("send_message",(data)=>{
   
    io.emit("receive_message", data)
})

//show online users 
socket.on('register_user',(username)=>{
users[socket.id] = username
io.emit("online_users", Object.values(users));
})
// On client reaction
socket.on("react_to_message", ({ messageId, emoji, reactor }) => {
  // Broadcast reaction to all users
  io.emit("message_reaction", { messageId, emoji, reactor });
});

socket.on('disconnect' ,()=>{
    delete users[socket.id];

    io.emit('online_users', Object.values(users))
})

// typing show 
socket.on('typing',(user)=>{
    socket.broadcast.emit("typing", user) //broad cast to other
})
socket.on("stop_typing", (username) => {
  socket.broadcast.emit("user_stopped_typing", username);
});

}
)
server.listen(PORT, ()=>console.log("Server started on http://localhost:5000"))