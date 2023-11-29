function getContractFunctions() {
  const artifact = require("../artifacts/contracts/WunderTokenV1.sol/WunderTokenV1.json")

  const abi = artifact.abi
  // console.log(`ABI: ${JSON.stringify(abi, null, 2)}`)

  console.log("============================================")
  console.log("Writeable Public and External Functions:")
  console.log("============================================")
  abi.forEach((element) => {
    // console.log(`Element: ${JSON.stringify(element, null, 2)}`)
    if (
      element.type === "function" &&
      element.stateMutability !== "view" &&
      element.stateMutability !== "pure"
    ) {
      // create a string that looks like a function definition for a markdown table
      let prettyFunction = `${element.name}(${element.inputs
        .map((input) => `${input.type} ${input.name}`)
        .join(", ")})`
      prettyFunction +=
        element.outputs.length > 0
          ? ` returns (${element.outputs
              .map((output) => `${output.type} ${output.name}`)
              .join(", ")})`
          : ""
      console.log(prettyFunction)
    }
  })

  console.log("\n\n============================================")
  console.log("Readable Public and External Functions:")
  console.log("============================================")
  abi.forEach((element) => {
    // console.log(`Element: ${JSON.stringify(element, null, 2)}`)
    if (
      element.type === "function" &&
      (element.stateMutability === "view" || element.stateMutability === "pure")
    ) {
      // create a string that looks like a function definition for a markdown table
      let prettyFunction = `${element.name}(${element.inputs
        .map((input) => `${input.type} ${input.name}`)
        .join(", ")})`
      prettyFunction +=
        element.outputs.length > 0
          ? ` returns (${element.outputs
              .map((output) => `${output.type} ${output.name}`)
              .join(", ")})`
          : ""
      console.log(prettyFunction)
    }
  })
}

getContractFunctions()
