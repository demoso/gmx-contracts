const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  await deployContract("MintableBaseToken", ["VestingOption", "ARB:GMX", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "ARB:KLP", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "AVAX:GMX", 0])
  await deployContract("MintableBaseToken", ["VestingOption", "AVAX:KLP", 0])
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
