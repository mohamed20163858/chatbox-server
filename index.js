import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import express from "express";
import { config } from "dotenv";

const app = express();

config();
const port = process.env.PORT || 8000;
app.use("/auth/*", ExpressAuth({ providers: [Google] }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
