const express=require('express');
const {serverConfig}=require('./config');
const http=require('http');
const { Server } = require('socket.io');
const app=express();
const server=http.createServer(app);
const io=new Server(server);
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//console.log(io);

 app.get('/chat/:roomid/:user', (req, res) => {
    res.render('index',{ 
        roomid: req.params.roomid,
        user:req.params.user
         });
 });

io.on('connection', (socket) => {
    console.log('a user connected userid='+ socket.id);
     socket.on('join_room',(data)=>{
         socket.join(data.roomid);
         console.log(data.roomid);
       //console.log(data.user);
      // console.log(io.sockets.adapter);
       const soketInroom = io.sockets.adapter.rooms.get(data.roomid);
       console.log(soketInroom);
     });

    //socket.join('chatRoom');
    

     socket.on('client-message',(data)=>{
       //  console.log(msg);
       //  socket.broadcast.emit('chat_message',msg);
       io.to(data.roomid).emit('chat_message',data);
     })
    
    

    socket.on('disconnect', () => {
        console.log('user disconnected id=' + socket.id);

      });  
});



server.listen(serverConfig.PORT,async()=>{
    console.log(`server is up at port number ${serverConfig.PORT}`)
})