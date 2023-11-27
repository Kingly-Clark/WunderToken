# Wunder Token

<a href="https://wunderpar.com/">Wunderpar</a> is an innovative golf app that combines the power of blockchain technology with the passion of golfers worldwide.

Our mission is to enhance the golf experience for players of all skill levels and ages by offering a unique rewards system, comprehensive golf tools, and access to an exclusive marketplace, incentivizing them to play even more rounds, and earn while doing so.

Trezor Suite settings --> Device and change the "Safety Check" option to prompt, you'll be able to send the transactions.

## Deployments:

| Environment | Chain   | ERC20 WUNDR Token | DEFAULT_ADMIN |
| ----------- | ------- | ----------------- | ------------- |
| Testnet     | Mumbai  |                   |               |
| Staging     | Polygon |                   |               |
| Prod        | Polygon |                   |               |

## Description

Wunder Token is an ERC20 coin which draws a lot of inspiration from the USDP project. It is an upgradable EIP-20 compatible contract with two additional features:

- The ability to `freeze-and-seize` funds from a user's account through a wallet with the `GOVERN_ROLE`.
- The ability for an authorized wallet to do a batchMint.

## Roles

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

## Upgradability

https://dev.to/yakult/tutorial-write-upgradeable-smart-contract-proxy-contract-with-openzeppelin-1916
