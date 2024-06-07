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
    let users = [];
    const usersData = fs.readFileSync(__dirname + "/assets/users.json", "utf8");
    users = JSON.parse(usersData);
    users.roommates.push(user);
    fs.writeFileSync(__dirname + "/assets/users.json", JSON.stringify(users));
    console.log("User added");
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const getRoommates = (req, res) => {
  try {
    const roommatesData = fs.readFileSync(
      __dirname + "/assets/users.json",
      "utf8"
    );
    const roommates = JSON.parse(roommatesData);
    calculateDebt();
    res.json(roommates);
  } catch (error) {
    console.log(error.message);
  }
};

const getGastos = (req, res) => {
  try {
    const gastosData = fs.readFileSync(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    calculateDebt();
    res.json(gastos);
  } catch (error) {
    console.log(error.message);
  }
};

const addGasto = (req, res) => {
  try {
    const { roommate, descripcion, monto } = req.body;
    const newGasto = {
      roommate,
      descripcion,
      monto,
      id: uuidv4(),
    };
    const gastosData = fs.readFileSync(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    gastos.gastos.push(newGasto);
    fs.writeFileSync(__dirname + "/assets/gastos.json", JSON.stringify(gastos));
    console.log("Gasto added");
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const editGasto = (req, res) => {
  try {
    const id = req.query.id;
    const { roommate, descripcion, monto } = req.body;
    const gastosData = fs.readFileSync(
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
    fs.writeFileSync(__dirname + "/assets/gastos.json", JSON.stringify(gastos));
    console.log("Gasto edited");
    res.redirect("/");
  } catch (error) {
    console.log("error log", error.message);
  }
};

const deleteGasto = (req, res) => {
  try {
    const id = req.query.id;
    const gastosData = fs.readFileSync(
      __dirname + "/assets/gastos.json",
      "utf8"
    );
    const gastos = JSON.parse(gastosData);
    const gastoIndex = gastos.gastos.findIndex((gasto) => gasto.id === id);
    gastos.gastos.splice(gastoIndex, 1);
    fs.writeFileSync(__dirname + "/assets/gastos.json", JSON.stringify(gastos));
    console.log("Gasto deleted");
    res.redirect("/");
  } catch (error) {
    console.log("error log", error.message);
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
