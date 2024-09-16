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
npx hardhat run scripts/1.deploy-wunderTokenV1.ts --network <network>
```

You can verify the contract by running:

```bash
npx hardhat verify --network <network> <contract-address>
```

Verify the network you've deployed to supports verification by running:

```bash
npx hardhat verify --list-networks
```

### Wunderpar ⛳️

| Environment |  Chain  | App       |  Token  |                                          WUNDER Proxy                                           |                                        V1 Implementation                                        |                                        V2 Implementation                                        |                                          DEFAULT_ADMIN                                          |                                                                                          MINTER_ROLE                                                                                           |                                          GOVERN_ROLE                                          |
| :---------: | :-----: | --------- | :-----: | :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: |
|   Testnet   |  Amoy   | Wunderpar | WUNDER  | [0xA201..9EB6](https://amoy.polygonscan.com/address/0xA201D1aB2264c19893Ebe489280c1456a8B29EB6) | [0x8A03..7b68](https://amoy.polygonscan.com/address/0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68) | [0x1176..b991](https://amoy.polygonscan.com/address/0x1176121630EcFCeaAEA1494246ed28824720b991) | [0xA047..54C4](https://amoy.polygonscan.com/address/0xA04703511790408902F71Bb2230c23591c4c54C4) | [0x7D78..Ee9B](https://amoy.polygonscan.com/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0x87B..f86](https://amoy.polygonscan.com/address/0x87B731d193Ae13999279d722565e3E2d719a5f86) | [0x61c..b4e](https://amoy.polygonscan.com/address/0x61c671fACDDcB8C5262371A9e7d37153Ab057b4e) |
|   Staging   | Polygon | Wunderpar | CHUNDER |   [0x5245..87cf](https://polygonscan.com/address/0x5245303456acf9fCAfBd98Ff19BCA421580087cf)    |   [0xb7e5..b0E8](https://polygonscan.com/address/0xb7e5F5716c3563a1c410Aa8244A3C63924f1b0E8)    |                                                                                                 |   [0xA047..54C4](https://polygonscan.com/address/0xA04703511790408902F71Bb2230c23591c4c54C4)    |      [0x7D78..Ee9B](https://polygonscan.com/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0x87B..f86](https://polygonscan.com/address/0x87B731d193Ae13999279d722565e3E2d719a5f86)      |   [0x61c..b4e](https://polygonscan.com/address/0x61c671fACDDcB8C5262371A9e7d37153Ab057b4e)    |
|    Prod     | Polygon | Wunderpar | WUNDER  |   [0x28eB..32aa](https://polygonscan.com/address/0x28eBFAF629A858D83550B4B8292C7995aF2E32aa)    |   [0xc8Ba..7A8E](https://polygonscan.com/address/0xc8Ba1B2270017f73e9e9Dc2A50779591D4177A8E)    |   [0x7068...9c2e](https://polygonscan.com/address/0x70682785eb141BE4bee9A89eaf0Ec53Da1a79c2e)   |   [0x5f73..d081](https://polygonscan.com/address/0x5f73be3809D89e13257877Aa8c47157c3765d081)    |      [0x7D78..Ee9B](https://polygonscan.com/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0x6a5..4a6](https://polygonscan.com/address/0x6a56C11372FC4b9D498AA0D75d4401F22eB414a6)      |   [0xeFF..325](https://polygonscan.com/address/0xeFFF3299f6327c148Ed98AAf9c0D0B2FADcAf325)    |

### Wunderfan 🏈

| Environment |  Chain   | App       |   Token   |                                          WUNDER Proxy                                          |                                       V1 Implementation                                        |                                      V2 Implementation                                       |                                         DEFAULT_ADMIN                                          |                                                                                         MINTER_ROLE                                                                                          |                                         GOVERN_ROLE                                          |
| :---------: | :------: | --------- | :-------: | :--------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
|   Testnet   | Arbitrum | Wunderfan |  WUNDER   | [0xA201..9EB6](https://sepolia.arbiscan.io/address/0xA201D1aB2264c19893Ebe489280c1456a8B29EB6) | [0x8A03..7b68](https://sepolia.arbiscan.io/address/0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68) | [0xcb6..Ff5](https://sepolia.arbiscan.io/address/0xcb6516Cd4c95D862d2cEA0CDC2ae4Dbfc81EDFf5) | [0xA047..54C4](https://sepolia.arbiscan.io/address/0xA04703511790408902F71Bb2230c23591c4c54C4) | [0x7D78..Ee9B](https://sepolia.arbiscan.io/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0xbed..bB9](https://sepolia.arbiscan.io/address/0xbedF14cd95FC5f251B017Bf87E0879e71e1C7bB9) | [0x0e2..3c7](https://sepolia.arbiscan.io/address/0x0e2eB8c11312d6774252CA143F20D057b1ad43c7) |
|   Staging   | Arbitrum | Wunderfan |  CHUNDER  |     [0xA201..9EB6](https://arbiscan.io/address/0xA201D1aB2264c19893Ebe489280c1456a8B29EB6)     |     [0x8A03..7b68](https://arbiscan.io/address/0x8A03A5ff393DD6Bf38839ED5547D0D692D6f7b68)     |     [0x893..307](https://arbiscan.io/address/0x8939748876cDd2F9B577b07D5c89a836FEBc7307)     |     [0xA047..54C4](https://arbiscan.io/address/0xA04703511790408902F71Bb2230c23591c4c54C4)     |         [0x7D78..Ee9B](https://arbiscan.io/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0xbed..bB9](https://arbiscan.io/address/0xbedF14cd95FC5f251B017Bf87E0879e71e1C7bB9)         |     [0x0e2..3c7](https://arbiscan.io/address/0x0e2eB8c11312d6774252CA143F20D057b1ad43c7)     |
|    Prod     | Arbitrum | Wunderfan | WUNDERFAN |     [0x58be..6774](https://arbiscan.io/address/0x58be876955484309706dFd5Fbccdf6D470666774)     |     [0x6A00..9316](https://arbiscan.io/address/0x6A0033a18aA3369e44696CF022d3575a50Ed9316)     |     [0x7C4..460](https://arbiscan.io/address/0x7C4179Cf6f91c351Cf7C9122B1f28cC30191D460)     |     [0xB5a8..06b8](https://arbiscan.io/address/0xB5a8A434912Ac6ff9Fa1b3C99fDC8Af5789b06b8)     |        [0x7D78..Ee9B](https://arbiscan.io/address/0x7D78710570D65b17D860Dd6AC51ECa426cc8Ee9B), [0x6a5...4a6](https://arbiscan.io/address/0x6a56C11372FC4b9D498AA0D75d4401F22eB414a6)         |    [0xeFFF...325](https://arbiscan.io/address/0xeFFF3299f6327c148Ed98AAf9c0D0B2FADcAf325)    |

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
npx hardhat run scripts/2.upgrade-wunderTokenV2.ts --network <network>
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
