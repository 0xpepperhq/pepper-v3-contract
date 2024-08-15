import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimePepperV3Pool } from '../../typechain/MockTimePepperV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { PepperV3Factory } from '../../typechain/PepperV3Factory'
import { TestPepperV3Callee } from '../../typechain/TestPepperV3Callee'
import { TestPepperV3Router } from '../../typechain/TestPepperV3Router'
import { MockTimePepperV3PoolDeployer } from '../../typechain/MockTimePepperV3PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: PepperV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('PepperV3Factory')
  const factory = (await factoryFactory.deploy()) as PepperV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestPepperV3Callee
  swapTargetRouter: TestPepperV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimePepperV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimePepperV3PoolDeployerFactory = await ethers.getContractFactory('MockTimePepperV3PoolDeployer')
  const MockTimePepperV3PoolFactory = await ethers.getContractFactory('MockTimePepperV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestPepperV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestPepperV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestPepperV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestPepperV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimePepperV3PoolDeployerFactory.deploy()) as MockTimePepperV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimePepperV3PoolFactory.attach(poolAddress) as MockTimePepperV3Pool
    },
  }
}
