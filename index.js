import express from "express";
import bodyParser from "body-parser";

import ParkingComplex from "./ParkingComplex.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get("/hello", (req, res) => {
  res.send(`Hello ${new Date(Date.now())}`);
});

const entryPoints = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];

const parkingSlots = [
  { id: 1, entranceDistance: [1, 3, 5], type: "SP", vehicleId: null },
  { id: 2, entranceDistance: [4, 2, 5], type: "MP", vehicleId: null },
  { id: 3, entranceDistance: [3, 1, 3], type: "LP", vehicleId: null },
];

const myParkingComplex = new ParkingComplex(entryPoints, parkingSlots);

// const vehicle1 = {
//   id: 1,
//   size: "S",
//   entryPoint: 1,
//   entryTime: new Date("2024-02-25T12:30:00"),
// };

// const vehicle2 = {
//   id: 2,
//   size: "S",
//   entryPoint: 1,
//   entryTime: new Date("2024-02-25T12:30:00"),
// };

// const vehicle3 = {
//   id: 3,
//   size: "S",
//   entryPoint: 1,
//   entryTime: new Date("2024-02-25T12:30:00"),
// };

// myParkingComplex.parkVehicle(vehicle1);
// myParkingComplex.parkVehicle(vehicle2);
// myParkingComplex.parkVehicle(vehicle3);
// myParkingComplex.unparkVehicle(1);
// console.log(parkingSlots);
// console.log(myParkingComplex.parkedVehicles);

app.get("/parkingSlots", (req, res) => {
  res.json({ data: parkingSlots });
});

app.get("/parkedVehicles", (req, res) => {
  res.json({ data: myParkingComplex.parkedVehicles });
});

app.post("/park", (req, res) => {
  myParkingComplex.parkVehicle(req.body);
  console.log(parkingSlots);
  console.log(myParkingComplex.parkedVehicles);
  res.send("Vehicle Parked");
});

app.put("/unpark", (req, res) => {
  const { id, exitTime } = req.body;
  myParkingComplex.unparkVehicle(id, exitTime);
  console.log(parkingSlots);
  console.log(myParkingComplex.parkedVehicles);
  res.send("Vehicle Unparked");
});

// myParkingComplex.unparkVehicle(1, new Date("2024-02-25T14:30:00"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
