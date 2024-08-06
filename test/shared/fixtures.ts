import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimePepperV1Pool } from '../../typechain/MockTimePepperV1Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { PepperV1Factory } from '../../typechain/PepperV1Factory'
import { TestPepperV1Callee } from '../../typechain/TestPepperV1Callee'
import { TestPepperV1Router } from '../../typechain/TestPepperV1Router'
import { MockTimePepperV1PoolDeployer } from '../../typechain/MockTimePepperV1PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: PepperV1Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('PepperV1Factory')
  const factory = (await factoryFactory.deploy()) as PepperV1Factory
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
  swapTargetCallee: TestPepperV1Callee
  swapTargetRouter: TestPepperV1Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimePepperV1Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimePepperV1PoolDeployerFactory = await ethers.getContractFactory('MockTimePepperV1PoolDeployer')
  const MockTimePepperV1PoolFactory = await ethers.getContractFactory('MockTimePepperV1Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestPepperV1Callee')
  const routerContractFactory = await ethers.getContractFactory('TestPepperV1Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestPepperV1Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestPepperV1Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimePepperV1PoolDeployerFactory.deploy()) as MockTimePepperV1PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimePepperV1PoolFactory.attach(poolAddress) as MockTimePepperV1Pool
    },
  }
}
