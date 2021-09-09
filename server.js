const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app)


const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
});

app.use(cors());
app.use(express.static("public"))

const PORT = process.env.PORT || 4000;

// app.get("/",(req,res)=>{
//     res.send("running")
// })

app.get('/',(req,res)=>{
    res.sendFile(__dirname + 'public/index.html')
})


// io.on("connection",(socket)=>{
//     socket.emit("me",socket.id);
//     socket.on("calluser",({
//         userToCall,signalData, from, name
//     })=>{
//         io.to(userToCall).emit("callUser",{
//             signal:signalData,
//             from,
//             name,
//         });
//     });

//     socket.on("updateMyMedia",({type, currentMediaStatus })=>{
//         console.log("updateMyMedia");
//         socket.broadcast.emit("updateUserMedia",{type, currentMediaStatus})
//     });

//     socket.on("msgUser",({
//         name,to,msg,sender
//     })=>{
//         io.to(to).emit("msgRcv",{name, msg, sender});
//     });

//     socket.io("answerCall", (data)=>{
//         socket.broadcast.emit("updateUserMedia",{
//             type:data.type,
//             currentMediaStatus: data.myMediaStatus
//         });
//         io.to(data.to).emit("callAccepted",data);
//     });
//     socket.on("endCall",({id})=>{
//         io.to(id).emit("endCall");
//     });
// });
var clients =0
var roomno =1

users = [];
//Whenever someone connects this gets executed
io.on('connection', function(socket){
    clients++;
    socket.join("room-"+roomno);
    io.sockets.in("room-" + roomno).emit('broadcast',{ description: clients + ' clients connected! and roomno'+roomno });
    console.log('A user connected');
    // Send a message after a timeout of 4seconds
    // Send a message when
    // setTimeout(function(){
    // // Sending an object when emmiting an event
    // socket.emit('message', 'this is testing');
    // }, 4000);
    //Whenever someone disconnects this piece of code executed

    socket.on('setUsername', function(data){
        console.log(data);
        if(users.indexOf(data) > -1){
           socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
           users.push(data);
           socket.emit('userSet', {username: data});
        }
     });
     socket.on('msg', function(data){
        //Send message to everyone
        io.sockets.emit('newmsg', data);
     })


    socket.on('disconnect', function () {
        clients--;
        io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
     });
 });

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
