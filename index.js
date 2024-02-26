import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

class ParkingComplex {
  constructor(entryPoints, parkingSlots) {
    this.entryPoints = entryPoints;
    this.parkingSlots = parkingSlots;
    this.parkedVehicles = [];
  }

  findClosestSlot(vehicle) {
    const filteredSlots = this.parkingSlots.filter((slot) => {
      // const isSizeMatch = slot.type[0] === vehicle.size;
      let isSizeMatch;
      if (slot.type === "SP") {
        isSizeMatch = ["SP"].includes(vehicle.size + "P");
      } else if (slot.type === "MP") {
        isSizeMatch = ["SP", "MP"].includes(vehicle.size + "P");
      } else if (slot.type === "LP") {
        isSizeMatch = ["SP", "MP", "LP"].includes(vehicle.size + "P");
      }
      // const isAvailable = slot.available === true;
      return isSizeMatch && !slot.vehicleId;
    });

    if (filteredSlots.length === 0) {
      console.log("No available parking slot found");
      return null;
    }

    return filteredSlots.reduce((minSlot, currentSlot) => {
      const minDistance = minSlot.entranceDistance[vehicle.entryPoint - 1];
      const currentDistance =
        currentSlot.entranceDistance[vehicle.entryPoint - 1];
      return currentDistance < minDistance ? currentSlot : minSlot;
    }, filteredSlots[0]);
  }

  parkVehicle(vehicle) {
    const closestSlot = this.findClosestSlot(vehicle);
    if (closestSlot) {
      // closestSlot.available = false;
      closestSlot.vehicleId = vehicle.id;
      this.parkedVehicles.push(vehicle);
      console.log(closestSlot, vehicle);
    }
  }

  unparkVehicle(vehicleId) {
    const slotIndex = this.parkedVehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );

    if (slotIndex !== -1) {
      const unparkedVehicle = this.parkedVehicles.splice(slotIndex, 1)[0];
      const slot = this.parkingSlots.find(
        (slot) => slot.vehicleId === vehicleId
      );
      if (slot) {
        slot.vehicleId = null;
      }
      console.log("Vehicle unparked:", unparkedVehicle);
    }
  }
}

const entryPoints = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];

const parkingSlots = [
  { id: 1, entranceDistance: [1, 3, 5], type: "SP", vehicleId: null },
  { id: 2, entranceDistance: [4, 2, 5], type: "SP", vehicleId: null },
  { id: 3, entranceDistance: [3, 1, 3], type: "LP", vehicleId: null },
];

const myParkingComplex = new ParkingComplex(entryPoints, parkingSlots);

const vehicle1 = {
  id: 1,
  size: "S",
  entryPoint: 1,
  entryTime: new Date("2024-02-25T12:30:00"),
};

const vehicle2 = {
  id: 2,
  size: "S",
  entryPoint: 1,
  entryTime: new Date("2024-02-25T12:30:00"),
};

const vehicle3 = {
  id: 3,
  size: "S",
  entryPoint: 1,
  entryTime: new Date("2024-02-25T12:30:00"),
};

myParkingComplex.parkVehicle(vehicle1);
myParkingComplex.parkVehicle(vehicle2);
myParkingComplex.parkVehicle(vehicle3);
myParkingComplex.unparkVehicle(1);
console.log(parkingSlots);
console.log(myParkingComplex.parkedVehicles);

// myParkingComplex.unparkVehicle(1, new Date("2024-02-25T14:30:00"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
