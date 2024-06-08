import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

export const randomUserQuery = async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api");
    if (!response.ok) {
      throw new Error(`Error fetching data ${response.status}`);
    }
    const data = await response.json();
    const user = {
      nombre: data.results[0].name.first + " " + data.results[0].name.last,
      debe: 0,
      recibe: 0,
      id: uuidv4(),
    };
    return user;
  } catch (error) {
    console.log("Error fetching data", error.code, "\n", error.message);
  }
};

export const calculateDebt = async () => {
  const gastosData = await fs.promises.readFile(
    __dirname + "/assets/gastos.json",
    "utf8"
  );
  const gastos = JSON.parse(gastosData);

  const usersData = await fs.promises.readFile(
    __dirname + "/assets/users.json",
    "utf8"
  );
  const users = JSON.parse(usersData);
  const usersLength = users.roommates.length;

  //reset debt
  users.roommates.forEach((user) => {
    user.debe = 0;
    user.recibe = 0;
  });

  gastos.gastos.forEach((gasto) => {
    const montoADividir = gasto.monto / usersLength;
    users.roommates.forEach((user) => {
      if (user.nombre === gasto.roommate) {
        user.recibe += Math.round(montoADividir * (usersLength - 1));
      } else {
        user.debe -= Math.round(montoADividir);
      }
    });
  });

  await fs.promises.writeFile(
    __dirname + "/assets/users.json",
    JSON.stringify(users)
  );
};
