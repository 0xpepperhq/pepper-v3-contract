import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PepperV3FactoryModule = buildModule("PepperV3FactoryModule", (m) => {
  const pepperV3Factory = m.contract("PepperV3Factory");

  return { pepperV3Factory };
});

export default PepperV3FactoryModule;
