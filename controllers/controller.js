import path from "path";

const __dirname = path.resolve();

const home = (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
};

export { home };
