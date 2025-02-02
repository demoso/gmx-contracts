const { deployContract, contractAt, sendTxn, getFrameSigner } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('../core/tokens')[network];

const { AddressZero } = ethers.constants

async function getArbValues() {
  const {nativeToken} = tokens
  const klp = {address: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258"}
  const feeGlpTracker = {address: "0x4e971a87900b931fF39d1Aad67697F49835400b6"}
  const stakedKlpTracker = {address: "0x1aDDD80E6039594eE970E5872D247bf0414C8903"}
  const klpManager = {address: "0x3963FfC9dff443c2A94f21b129D429891E32ec18"}

  return {nativeToken, klp, feeGlpTracker, stakedKlpTracker, klpManager}
}

async function getAvaxValues() {
  const {nativeToken} = tokens
  const klp = {address: "0x01234181085565ed162a948b6a5e88758CD7c7b8"}
  const feeGlpTracker = {address: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F"}
  const stakedKlpTracker = {address: "0x9e295B5B976a184B14aD8cd72413aD846C299660"}
  const klpManager = {address: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4"}

  return {nativeToken, klp, feeGlpTracker, stakedKlpTracker, klpManager}
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }
}

async function main() {
  const {nativeToken, klp, feeGlpTracker, stakedKlpTracker, klpManager} = await getValues()

  const rewardRouter = await deployContract("RewardRouterV2", [])
  await sendTxn(rewardRouter.initialize(
    nativeToken.address, // _weth
    AddressZero, // _gmx
    AddressZero, // _esGmx
    AddressZero, // _bnGmx
    klp.address, // _klp
    AddressZero, // _stakedGmxTracker
    AddressZero, // _bonusGmxTracker
    AddressZero, // _feeGmxTracker
    feeGlpTracker.address, // _feeGlpTracker
    stakedKlpTracker.address, // _stakedKlpTracker
    klpManager.address, // _klpManager
    AddressZero, // _gmxVester
    AddressZero // klpVester
  ), "rewardRouter.initialize")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
