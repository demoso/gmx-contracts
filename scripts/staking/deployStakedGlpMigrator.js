const { getFrameSigner, deployContract, contractAt, sendTxn, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');

async function getArbValues() {
  const klp = {address: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258"}
  const stakedKlpTracker = await contractAt("RewardTracker", "0x1aDDD80E6039594eE970E5872D247bf0414C8903")
  const feeGlpTracker = await contractAt("RewardTracker", "0x4e971a87900b931fF39d1Aad67697F49835400b6")

  return {klp, stakedKlpTracker, feeGlpTracker}
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }
}

async function main() {
  const {klp, stakedKlpTracker, feeGlpTracker} = await getValues()
  const sender = {address: "0xA7Ce4434A29549864a46fcE8662fD671c06BA49a"}

  await deployContract("StakedKlpMigrator", [
    sender.address,
    klp.address,
    stakedKlpTracker.address,
    feeGlpTracker.address
  ])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
