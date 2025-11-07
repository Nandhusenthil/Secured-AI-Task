import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
