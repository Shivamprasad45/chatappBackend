const express= require('express')
const http =  require("http")

const  {Server} = require('socket.io')
const  cors= require('cors')

const app = express();

app.use(cors());

const server= http.createServer(app);

const io= new Server(server ,{
cors:{
    origin:"*"
}

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
server.listen(5000, ()=>console.log("Server started on http://localhost:5000"))