export default class ParkingComplex {
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
    vehicle.entryTime = new Date(vehicle.entryTime);
    const closestSlot = this.findClosestSlot(vehicle);
    if (closestSlot) {
      // closestSlot.available = false;
      closestSlot.vehicleId = vehicle.id;
      this.parkedVehicles.push(vehicle);
      console.log(closestSlot, vehicle);
    }
  }

  calculateParkingFee(parkedHours, slotType) {
    const flatRate = 40;
    const exceedingHourlyRate = {
      SP: 20,
      MP: 60,
      LP: 100,
    };
    const wholeDayRate = 5000;

    let totalFee = 0;

    // Calculate fee for full 24-hour chunks
    const wholeDays = Math.floor(parkedHours / 24);
    if (wholeDays >= 1) {
      totalFee = wholeDays * wholeDayRate;
      parkedHours -= wholeDays * 24;
    }

    // Calculate flat rate for the first three hours
    if (parkedHours <= 3) {
      totalFee += flatRate;
    } else {
      totalFee += flatRate * 3; // Flat rate for the first three hours

      // Calculate fee for exceeding hours
      const remainingHours = Math.ceil(parkedHours - 3);
      const hourlyRate = exceedingHourlyRate[slotType];

      // Calculate fee for remaining hours
      const remainingHoursFee = Math.ceil((remainingHours % 24) * hourlyRate);
      totalFee += remainingHoursFee;
    }

    return totalFee;
  }

  unparkVehicle(vehicleId, exitTime) {
    const slotIndex = this.parkedVehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );

    if (slotIndex !== -1) {
      const unparkedVehicle = this.parkedVehicles.splice(slotIndex, 1)[0];
      unparkedVehicle.exitTime = new Date(exitTime);
      const slot = this.parkingSlots.find(
        (slot) => slot.vehicleId === vehicleId
      );

      if (slot) {
        const parkedHours = Math.ceil(
          (unparkedVehicle.exitTime - unparkedVehicle.entryTime) /
            (1000 * 60 * 60)
        ); // Convert milliseconds to hours

        const parkingFee = this.calculateParkingFee(parkedHours, slot.type);
        unparkedVehicle.parkingFee = parkingFee;
        console.log("Parking fee:", parkingFee, "pesos");

        slot.vehicleId = null;
      }

      console.log("Vehicle unparked:", unparkedVehicle);
    }
  }
}
