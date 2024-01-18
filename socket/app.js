//imports socket.io Server class containing many methods, objects, etc
const { Server } = require("socket.io");

//creates a new server using the server class
const io = new Server({
//cors - connects backend with frontend, as a middleware
  cors: "http://localhost:3000",
});
//creates onlineUsers Array
let onlineUsers = [];

//connection of socket.io
io.on("connection", (socket) => {
  console.log("New Connection", socket.id);

  //passes socket.id to new users
  // socket.on("addNewUser", (userId) => {
  //   //research .some later
  //   // will assign socketID to userId
  //   !onlineUsers.some((user) => user.userId === userId) &&
  //     onlineUsers.push({
  //       userId,
  //       socketId: socket.id,
  //            });
  //            //will update  who is online or offline in the backend and frontend.
  //       io.emit("getOnlineUsers", onlineUsers);
  // });
//listens for new notification
  // socket.on("sendMessage", (message)=>{
  //   const user=onlineUsers.find(user=>user.userId===message.recipientId)
  //   if(user){
  //       io.to(user.socketId).emit("getMessage", message)
  //       io.to(user.socketId).emit("getNotification", {
  //           senderId:message.senderId, 
  //           isRead: false,
  //           date: new Date()
  //       })
  //   }
  // })

  //Disconnects
  socket.on("disconnect", ()=>{
    onlineUsers=onlineUsers?.filter(user=>user.socketId!==socket.id)
    io.emit("onlineUsers", onlineUsers)
  })

});
io.listen(3005);
