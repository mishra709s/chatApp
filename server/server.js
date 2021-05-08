const io = require("socket.io")(5000);
// const cors = require("cors");
// const proxyUrl = "https://safe-cove-98698.herokuapp.com/";
// const origin = "http://localhost:3000/";
// const corsOptions = {
//   origin: proxyUrl + origin,
//   optionsSuccessStatus: 200,
// };

// io.use(cors(corsOptions));

// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: "http://localhost:3000/",
//     methods: ["GET", "POST"],
//   },
// });

// httpServer.listen(5000);

io.on("connection", (socket) => {
  // When we are connecting, we need to pass the id of the user
  // As we have static id's, socket id creates a new id, everytime we connect, so when we refresh our page we get a new socket id

  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    // Here we need to change the recipients
    // When ME sends a message to YOU, the recipient is YOU, but on YOU end its vice versa
    recipients.forEach((recipient) => {
      // Its removing the recipient from the current list of recipients
      const newRecipients = recipients.filter((r) => r !== recipient);

      // Now take our new recipients and push in the id (the sender's id)
      newRecipients.push(id);

      // So we are adding the sender to the list of recipients and removing the person receiving the message, that way when they get this, it will have the proper list of recipients for them
      // Now we are going to send a message to a particular room
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
