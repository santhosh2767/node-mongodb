const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const {userRoutes,likeRoutes,postRoutes,commentRoutes} = require("./routes/indexRoutes")

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
