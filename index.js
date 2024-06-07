import express from "express";
import router from "./routes/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
