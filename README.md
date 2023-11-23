# Wunder Token

## Description
Wunder Token is an ERC20 coin which draws a lot of inspiration from the USDP project. It is an upgradable EIP-20 compatible contract with two additional features:

+ The ability to `freeze-and-seize` funds from a user's account through a wallet with the `GOVERN_ROLE`.
+ The ability for an authorized wallet to do a batchMint.


## Roles
+ `MINTER_ROLE`: A wallet that has this role can 
    + call the mint method
+ `BURNER_ROLE`: A wallet that has this role can 
    + call the burn method
+ `GOVERN_ROLE`: A wallet that has this role can
    + call the freeze method
    + call the unfreeze method
    + call the seize method
    + call the withdraw method
+ `PAUSER_ROLE`: A wallet that has this role can
    + call the pause method
    + call the unpause method