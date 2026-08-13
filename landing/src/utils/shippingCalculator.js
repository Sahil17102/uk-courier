function toPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function isValidRouteCode(value) {
  return /^[A-Z0-9][A-Z0-9 -]{1,11}$/i.test(String(value).trim());
}

function resolveZone(originCode, destinationCode) {
  const pickup = String(originCode);
  const delivery = String(destinationCode);

  if (pickup.slice(0, 3) === delivery.slice(0, 3)) {
    return { label: "Regional", surcharge: 18, eta: "1-2 days" };
  }

  if (pickup.slice(0, 1) === delivery.slice(0, 1)) {
    return { label: "Continental", surcharge: 34, eta: "2-4 days" };
  }

  return { label: "International", surcharge: 56, eta: "4-6 days" };
}

export function calculateBillableWeight({ packageWeight, weightInGrams, length, width, height, divisor = 5000 }) {
  const explicitWeightKg = toPositiveNumber(packageWeight);
  const actualWeightKg = explicitWeightKg || toPositiveNumber(weightInGrams) / 1000;
  const lengthCm = toPositiveNumber(length);
  const widthCm = toPositiveNumber(width);
  const heightCm = toPositiveNumber(height);
  const divisorValue = toPositiveNumber(divisor) || 5000;
  const volumetricWeightKg =
    lengthCm && widthCm && heightCm ? (lengthCm * widthCm * heightCm) / divisorValue : 0;
  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);

  return {
    actualWeightKg: Number(actualWeightKg.toFixed(2)),
    volumetricWeightKg: Number(volumetricWeightKg.toFixed(2)),
    chargeableWeightKg: Number(chargeableWeightKg.toFixed(2)),
  };
}

export function calculateShippingEstimate({
  packageWeight,
  weightInGrams,
  length,
  width,
  height,
  pickupPincode,
  deliveryPincode,
  originCode = pickupPincode,
  destinationCode = deliveryPincode,
  paymentType = "Prepaid",
  shipmentValue,
}) {
  const { actualWeightKg, volumetricWeightKg, chargeableWeightKg } = calculateBillableWeight({
    packageWeight,
    weightInGrams,
    length,
    width,
    height,
  });

  if (chargeableWeightKg <= 0 || !isValidRouteCode(originCode) || !isValidRouteCode(destinationCode)) {
    return {
      estimatedCost: 0,
      zoneLabel: "--",
      eta: "--",
      actualWeightKg: 0,
      volumetricWeightKg: 0,
      chargeableWeightKg: 0,
    };
  }

  const zone = resolveZone(originCode, destinationCode);
  const baseCharge = 42;
  const weightCharge = chargeableWeightKg <= 0.5 ? 0 : Math.ceil((chargeableWeightKg - 0.5) / 0.5) * 12;
  const codSurcharge = paymentType === "COD" ? Math.max(18, toPositiveNumber(shipmentValue) * 0.015) : 0;

  return {
    estimatedCost: Number((baseCharge + zone.surcharge + weightCharge + codSurcharge).toFixed(2)),
    zoneLabel: zone.label,
    eta: zone.eta,
    actualWeightKg,
    volumetricWeightKg,
    chargeableWeightKg,
  };
}
