# Wunderpar

## Intention

`<a href="https://wunderpar.com/">`Wunderpar `</a>` is an innovative golf app that combines the power of blockchain technology with the passion of golfers worldwide. The app can be downloaded for free on the App Store and Google Play. To view read our slightly off-Whitepaper, please visit `<a href="https://wunderpar.com/graypaper">`wunderpar.com/graypaper `</a>`.

Our mission is to enhance the golf experience for players of all skill levels and ages by offering a unique rewards system, comprehensive golf tools, and access to an exclusive marketplace, incentivizing them to play even more rounds, and earn while doing so.

## Getting Started

To get started, clone the repository and install the dependencies:

```bash
yarn
```

Compile the contracts by running:

```bash
npx hardhat compile
```

Run the test suite by running:

```bash
npx hardhat test
```

## Deployments

The token can be deployed by running:

```bash
npx hardhat run scripts/1.deploy-wunderTokenV1.ts --network <<network>>
```

You can verify the contract by running:

```bash
npx hardhat verify --network <<network>> <<contract-address>>
```

Verify the network you've deployed to supports verification by running:

```bash
npx hardhat verify --list-networks
```

| Environment | Chain    | App       | WUNDER Proxy                                 | V1 Implementation                            | V2 Implementation                            | DEFAULT_ADMIN                                | MINTER_ROLE                                  |
| ----------- | -------- | --------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| Testnet     | Mumbai   | Wunderpar | `0x46160352FE480E8E26b0e10FAaefDDF757Ba6Ec4` | `0x099E7B298851F9F2a468385DB6A2E3e90c73e035` |                                              | `0xA04703511790408902F71Bb2230c23591c4c54C4` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Testnet     | Amoy     | Wunderpar | `0xA201D1aB2264c19893Ebe489280c1456a8B29EB6` | `0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68` | `0x1176121630EcFCeaAEA1494246ed28824720b991` | `0xA04703511790408902F71Bb2230c23591c4c54C4` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Testnet     | Arbitrum | Wunderfan | `0xA201D1aB2264c19893Ebe489280c1456a8B29EB6` | `0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68` |                                              | `0xA04703511790408902F71Bb2230c23591c4c54C4` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Staging     | Polygon  | Wunderpar | `0x5245303456acf9fCAfBd98Ff19BCA421580087cf` | `0xb7e5F5716c3563a1c410Aa8244A3C63924f1b0E8` |                                              | `0xA04703511790408902F71Bb2230c23591c4c54C4` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Staging     | Arbitrum | Wunderfan | `0xA201D1aB2264c19893Ebe489280c1456a8B29EB6` | `0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68` |                                              | `0xA04703511790408902F71Bb2230c23591c4c54C4` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Prod        | Polygon  | Wunderpar | `0x28eBFAF629A858D83550B4B8292C7995aF2E32aa` | `0xc8Ba1B2270017f73e9e9Dc2A50779591D4177A8E` |                                              | `0x5f73be3809D89e13257877Aa8c47157c3765d081` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |
| Prod        | Arbitrum | Wunderfan | `0x58be876955484309706dFd5Fbccdf6D470666774` | `0x6A0033a18aA3369e44696CF022d3575a50Ed9316` |                                              | `0xB5a8A434912Ac6ff9Fa1b3C99fDC8Af5789b06b8` | `0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B` |

## Codebase

Wunderpar is an ERC20 coin which draws a lot of inspiration from the `<a href="https://paxos.com/usdp/">`USDP `</a>` project. It is an upgradable EIP-20 compatible contract with a few additional features:

- The ability for an authorized wallet to `freeze-and-seize` funds from a user's account.
- The ability for an authorized wallet to do a batchMint.
- The ability for to do a batchTransfer.

Documentation for each of the methods in the contract can be found `<a href='./docs/index.md'>`here `</a>`.

### Upgradability

Uses the `<a href='https://docs.openzeppelin.com/upgrades-plugins/1.x/' >`OpenZeppelin Upgrades Plugins `</a>` to deploy the contract. The contract is deployed using the `deployProxy` method. This method deploys a proxy contract which points to the implementation contract. The implementation contract is the `WunderToken` contract. To upgrade the contract, a new implementation contract is deployed and the proxy contract is updated to point to the new implementation contract using the `upgradeProxy` method.

A sample upgrade script can be found `<a href='./scripts/2.upgrade-wunderTokenV2.ts'>`here `</a>`. Update the proxy address and run using the following command:

```bash
npx hardhat run scripts/2.upgrade-wunderTokenV2.ts --network <<network>>
```

### Roles

- `MINTER_ROLE`: A wallet that has this role can
  - call the mint method
- `BURNER_ROLE`: A wallet that has this role can
  - call the burn method
- `GOVERN_ROLE`: A wallet that has this role can
  - call the freeze method
  - call the unfreeze method
  - call the seize method
  - call the withdraw method
- `PAUSER_ROLE`: A wallet that has this role can
  - call the pause method
  - call the unpause method

## Glosary

- `Seized`: When a wallet is frozen, the funds are not lost. They are just not accessible by the user. The funds can be seized by the `GOVERN_ROLE` wallet which will transfer the the funds to the WunderToken contract. The funds can then be withdrawn by the `GOVERN_ROLE` wallet using the `withdraw` function.

## Deployment With Ledger

- Setup Ledger with seedphrase
- Install Ledger Live
- Install Ethereum App on Ledger
- Add Account
  - `44'/60'/0'/0/0` should be `0x5f73be3809D89e13257877Aa8c47157c3765d081`
- Enable Blind Signatures in Ethereum App
- `npx hardhat run scripts/1.deploy-wunderTokenV1.ts  --network polygon`
- `npx hardhat verify --network polygon 0xf387300F3e2BEf4cC676D3bCD8bb59265e130e53`
