const sequelize = require('./connection');
const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./routers/userRouter');
const chatRoute = require('./routers/chatRouter');
const messageRoute = require('./routers/messageRouter');
const { connection } = require('./connection');

app.use(express.json())
app.use(cors());

// call routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});