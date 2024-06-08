import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { randomUserQuery, calculateDebt } from "../models/queries.js";

const __dirname = path.resolve();

const home = (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
};

const randomUser = async (req, res) => {
  try {
    const user = await randomUserQuery();
    const usersData = await fs.promises.readFile(
      __dirname + "/assets/users.json",
      "utf8"
    );
    const users = JSON.parse(usersData);
    users.roommates.push(user);

    await fs.promises.writeFile(
      __dirname + "/assets/users.json",
      JSON.stringify(users)
    );

    console.log("User added");
    res.json(users);
  } catch (error) {
    console.error("Error adding user:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error adding user");
    }
  }
};

const getRoommates = async (req, res) => {
  try {
    const roommatesData = await fs.promises.readFile(
      __dirname + "/assets/users.json",
      "utf8"
    );
    const roommates = JSON.parse(roommatesData);
    calculateDebt();
    res.json(roommates);
  } catch (error) {
    console.error("Error retrieving roommates data:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error retrieving roommates data");
    }
  }
};

const getGastos = async (req, res) => {
  try {
    const gastosData = await fs.promises.readFile(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    calculateDebt();
    res.json(gastos);
  } catch (error) {
    console.log("Error retrieving gastos data:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error retrieving roommates data");
    }
  }
};

const addGasto = async (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body;
    const newGasto = {
      roommate,
      descripcion,
      monto,
      id: uuidv4(),
    };
    const gastosData = await fs.promises.readFile(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    gastos.gastos.push(newGasto);
    fs.writeFileSync(__dirname + "/assets/gastos.json", JSON.stringify(gastos));
    console.log("Gasto added");
    res.redirect("/");
  } catch (error) {
    console.log("Error adding gasto:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error retrieving roommates data");
    }
  }
};

const editGasto = async (req, res) => {
  try {
    const id = req.query.id;
    const { roommate, descripcion, monto } = req.body;
    const gastosData = await fs.promises.readFile(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    const gastoIndex = gastos.gastos.findIndex((gasto) => gasto.id === id);
    gastos.gastos[gastoIndex] = {
      roommate,
      descripcion,
      monto,
      id: id,
    };
    await fs.promises.writeFile(
      __dirname + "/assets/gastos.json",
      JSON.stringify(gastos)
    );
    console.log("Gasto edited");
    res.redirect("/");
  } catch (error) {
    console.log("Error editing gasto:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error retrieving roommates data");
    }
  }
};

const deleteGasto = async (req, res) => {
  try {
    const id = req.query.id;
    const gastosData = await fs.promises.readFile(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    const gastoIndex = gastos.gastos.findIndex((gasto) => gasto.id === id);
    gastos.gastos.splice(gastoIndex, 1);
    await fs.promises.writeFile(
      __dirname + "/assets/gastos.json",
      JSON.stringify(gastos)
    );
    console.log("Gasto deleted");
    res.redirect("/");
  } catch (error) {
    console.log("Error deleting gasto:", error.message);

    if (error.code === "ENOENT") {
      res.status(404).send("Roommates data file not found");
    } else if (error.code === "EISDIR") {
      res.status(400).send("Invalid roommates data format (expected file)");
    } else if (error.name === "SyntaxError") {
      res.status(400).send("Invalid JSON format in roommates data");
    } else {
      res.status(500).send("Internal server error retrieving roommates data");
    }
  }
};

export {
  home,
  randomUser,
  getRoommates,
  getGastos,
  addGasto,
  editGasto,
  deleteGasto,
};
