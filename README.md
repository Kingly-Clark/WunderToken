# Wunder Token

## Intention

<a href="https://wunderpar.com/">Wunderpar</a> is an innovative golf app that combines the power of blockchain technology with the passion of golfers worldwide. The app can be downloaded for free on the App Store and Google Play.

Our mission is to enhance the golf experience for players of all skill levels and ages by offering a unique rewards system, comprehensive golf tools, and access to an exclusive marketplace, incentivizing them to play even more rounds, and earn while doing so.

## Deployments

| Environment | Chain   | ERC20 WUNDR Token | DEFAULT_ADMIN |
| ----------- | ------- | ----------------- | ------------- |
| Testnet     | Mumbai  |                   |               |
| Staging     | Polygon |                   |               |
| Prod        | Polygon |                   |               |

## Codebase

Wunder Token is an ERC20 coin which draws a lot of inspiration from the USDP project. It is an upgradable EIP-20 compatible contract with two additional features:

- The ability to `freeze-and-seize` funds from a user's account through a wallet with the `GOVERN_ROLE`.
- The ability for an authorized wallet to do a batchMint.

Docs can be found <a href='./docs/index.md'>here</a>.

### Upgradability

https://dev.to/yakult/tutorial-write-upgradeable-smart-contract-proxy-contract-with-openzeppelin-1916

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
