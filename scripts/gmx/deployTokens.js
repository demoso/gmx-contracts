const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  // await deployContract("EsGMX", [])
  // await deployContract("KLP", [])
  await deployContract("MintableBaseToken", ["esGMX IOU", "esGMX:IOU", 0])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
