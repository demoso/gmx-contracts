const { deployContract, contractAt , sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const {
    nativeToken
  } = tokens

  const vault = await contractAt("Vault", "0xDE3590067c811b6F023b557ed45E4f1067859663")
  const usdg = await contractAt("USDG", "0x45096e7aA921f27590f8F19e457794EB09678141")
  const klp = await contractAt("KLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")

  const klpManager = await deployContract("KlpManager", [vault.address, usdg.address, klp.address, 15 * 60])

  await sendTxn(klpManager.setInPrivateMode(true), "klpManager.setInPrivateMode")

  await sendTxn(klp.setMinter(klpManager.address, true), "klp.setMinter")
  await sendTxn(usdg.addVault(klpManager.address), "usdg.addVault")
  await sendTxn(vault.setManager(klpManager.address, true), "vault.setManager")

  writeTmpAddresses({
    klpManager: klpManager.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
