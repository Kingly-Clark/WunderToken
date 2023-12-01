# Solidity API

## WunderTokenV1

An ERC20 token with pausable and upgradable features which includes the ability to freeze and seize funds in accounts.
+ The contract uses `AccessControlUpgradeable` and is  initialized with the `DEFAULT_ADMIN_ROLE` granted to the address provided to the `initialize` function.
+ The contract extends the `ERC20Upgradeable` contract and implements the `ERC20BurnableUpgradeable` and `ERC20PausableUpgradeable` contracts.
+ The contract implements the `UUPSUpgradeable` contract.
+ The contract implements the `freeze`, `unfreeze`, `seize` and `withdraw` functions which are only callable by the `GOVERN_ROLE`.
+ The contract implements the `batchMint` function which allows the `MINTER_ROLE` to mint tokens to multiple recipients.
+ The contract implements the `batchTransfer` function which allows any address to transfer tokens to multiple recipients.
+ The contract overrides the `_update` function from the `ERC20Upgradeable` contract to include the `whenNotFrozen` modifier on the `from` address, i.e. a frozen account cannot send tokens
+ The contract overrides the `mint` function from the `ERC20Upgradeable` contract to include the `onlyRole(MINTER_ROLE)` modifier.
+ The contract overrides the `burn` and `burnFrom` functions from the `ERC20BurnableUpgradeable` contract to include the `onlyRole(BURNER_ROLE)` modifier.
+ The contract overrides the `pause` and `unpause` functions from the `ERC20PausableUpgradeable` contract to include the `onlyRole(PAUSER_ROLE)` modifier.
+ The contract overrides the `_authorizeUpgrade` function from the `UUPSUpgradeable` contract to include the `onlyRole(UPGRADER_ROLE)` modifier.

### _frozen

```solidity
mapping(address => bool) _frozen
```

Internal state for when an account is frozen. A frozen account can receive (transfer/mint) tokens but cannot send (transfer/burn) tokens.

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

MINTER_ROLE allows calling `mint` and `batchMint` functions.

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

PAUSER_ROLE allows calling `pause` and `unpause` functions.

### BURNER_ROLE

```solidity
bytes32 BURNER_ROLE
```

BURNER_ROLE allows calling `burn` and `burnFrom` functions.

### GOVERN_ROLE

```solidity
bytes32 GOVERN_ROLE
```

GOVERN_ROLE allows calling `freeze`, `unfreeze`, `seize` and `withdraw` functions.

### UPGRADER_ROLE

```solidity
bytes32 UPGRADER_ROLE
```

UPGRADER_ROLE allows calling `_authorizeUpgrade` function.

### AddressFrozen

```solidity
event AddressFrozen(address account)
```

Emitted when `account` is frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was frozen. |

### AddressUnfrozen

```solidity
event AddressUnfrozen(address account)
```

Emitted when `account` is unfrozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was unfrozen. |

### AddressSeized

```solidity
event AddressSeized(address account)
```

Emitted when `account` is seized.

_account needs to be frozen before it can be seized._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was seized. |

### FundsWithdrawn

```solidity
event FundsWithdrawn(address account, uint256 amount)
```

Emitted when `account` withdraws `amount` of funds that have been seized.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that withdrew the funds. |
| amount | uint256 | The amount of funds that were withdrawn. |

### BatchMint

```solidity
event BatchMint(address minter, address[] recipients, uint256[] amounts)
```

Emitted when `amounts` tokens are minted to multiple `recipients`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | The address that minted the tokens. |
| recipients | address[] | Array of recipient addresses. |
| amounts | uint256[] | Array of amounts that were minted. |

### BatchTransfer

```solidity
event BatchTransfer(address sender, address[] recipients, uint256[] amounts)
```

Emitted when `amounts` tokens are moved from one account (`sender`) to multiple `recipients`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that sent the tokens. |
| recipients | address[] | Array of recipient addresses. |
| amounts | uint256[] | Array of amounts that were transferred. |

### whenNotFrozen

```solidity
modifier whenNotFrozen(address account)
```

Throws `WunderTokenAccountFrozen` if the `account` is frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to check. |

### whenFrozen

```solidity
modifier whenFrozen(address account)
```

Throws `WunderTokenAccountNotFrozen` if the `account` is not frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to check. |

### WunderTokenAccountFrozen

```solidity
error WunderTokenAccountFrozen(address account)
```

Error message emitted when the `account` is frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was frozen. |

### WunderTokenAccountNotFrozen

```solidity
error WunderTokenAccountNotFrozen(address account)
```

Error message emitted when the `account` is not frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was not frozen. |

### WunderTokenAccountNotAllowed

```solidity
error WunderTokenAccountNotAllowed(address account)
```

Error message emitted when the `account` is not allowed.

_Used to indicate that this contract's address cannot be frozen._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that was not allowed. |

### WunderTokenAccountZeroBalance

```solidity
error WunderTokenAccountZeroBalance(address account)
```

Error message emitted when the `account` has zero balance.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that has zero balance. |

### WunderTokenArrayLengthMismatch

```solidity
error WunderTokenArrayLengthMismatch()
```

Error message emitted when the `recipients` and `amounts` arrays have different lengths.

### WunderTokenArrayLengthExceeded

```solidity
error WunderTokenArrayLengthExceeded()
```

Error message emitted when the `recipients` and `amounts` arrays have a length greater than 256.

### WunderTokenInsufficientBalance

```solidity
error WunderTokenInsufficientBalance(address account, uint256 amount)
```

Error message emitted when the `account` has insufficient balance.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address that has insufficient balance. |
| amount | uint256 | The amount that was requested. |

### WunderTokenArrayEmpty

```solidity
error WunderTokenArrayEmpty()
```

Error message emitted when the `recipients` and `amounts` arrays are empty.

### constructor

```solidity
constructor() public
```

As this is an upgradeable contract, the constructor is not used and the `initialize` function is used instead.

### initialize

```solidity
function initialize(address defaultAdmin) public
```

Initializes the contract with the `DEFAULT_ADMIN_ROLE` granted to the `defaultAdmin` address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultAdmin | address | The address that will be granted the `DEFAULT_ADMIN_ROLE`. |

### _update

```solidity
function _update(address from, address to, uint256 value) internal virtual
```

Adds the whenNotFrozen to the sender address

_Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
(or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
this function.

Emits a {Transfer} event._

### burn

```solidity
function burn(uint256 value) public virtual
```

Only allows the `BURNE_ROLE` to burn tokens.

_Destroys a `value` amount of tokens from the caller.

See {ERC20-_burn}._

### burnFrom

```solidity
function burnFrom(address account, uint256 value) public virtual
```

Only allows the `BURNE_ROLE` to burn tokens from the `account`.

_Destroys a `value` amount of tokens from `account`, deducting from
the caller's allowance.

See {ERC20-_burn} and {ERC20-allowance}.

Requirements:

- the caller must have allowance for ``accounts``'s tokens of at least
`value`._

### isFrozen

```solidity
function isFrozen(address account) public view returns (bool frozen)
```

Returns true if the `account` is frozen.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| frozen | bool | True if the `account` is frozen. |

### freeze

```solidity
function freeze(address account) public returns (bool frozen)
```

Freezes the `account`.

_Requirements:
The contract must not be paused.
The caller must have the `GOVERN_ROLE`.
The account must not already be frozen.
The account cannot be the contract address.
Emits AddressFrozen event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to be frozen. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| frozen | bool | True if the `account` is frozen. |

### unfreeze

```solidity
function unfreeze(address account) public returns (bool frozen)
```

Unfreezes the `account`.

_Requirements:
The contract must not be paused.
The caller must have the `GOVERN_ROLE`.
The account must be frozen.
Emits AddressUnfrozen event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to be unfrozen. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| frozen | bool | True if the `account` is unfrozen. |

### seize

```solidity
function seize(address account) public returns (bool seized)
```

Seizes the `account` which transfers all funds owned by the `account` to this contract.

_Requirements:
The contract must not be paused.
The caller must have the `GOVERN_ROLE`.
The account must already be frozen.
The account cannot be the contract address.
The account must have a balance greater than zero.
Emits AddressSeized event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to be seized. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| seized | bool | True if the `account` is seized. @dev |

### withdraw

```solidity
function withdraw(uint256 amount) public returns (bool withdrawn)
```

Withdraws a specific amount from this contract.

_Requirements:
The contract must not be paused.
The contract must have enough funds to withdraw.
The caller must have the `GOVERN_ROLE`.
Emits FundsWithdrawn event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The amount to withdraw. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| withdrawn | bool | True if the `amount` is withdrawn. |

### mint

```solidity
function mint(address account, uint256 amount) public
```

Adds the onlyRole(MINTER_ROLE) modifier to the mint function.

### batchMint

```solidity
function batchMint(address[] recipients, uint256[] amounts) external
```

Adds the onlyRole(MINTER_ROLE) modifier to the batchMint function.

_Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have different lengths.
Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have a length greater than 256.
Throws `WunderTokenArrayEmpty` if the `recipients` and `amounts` arrays are empty.
Emits BatchMint event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | Array of recipient addresses. |
| amounts | uint256[] | Array of amounts that were minted. |

### batchTransfer

```solidity
function batchTransfer(address[] recipients, uint256[] amounts) external
```

Allows any address to transfer tokens to multiple recipients.

_Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have different lengths.
Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have a length greater than 256.
Throws `WunderTokenArrayEmpty` if the `recipients` and `amounts` arrays are empty.
Emits BatchTransfer event._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | Array of recipient addresses. |
| amounts | uint256[] | Array of amounts that were transferred. |

### pause

```solidity
function pause() public
```

Triggers stopped state

### unpause

```solidity
function unpause() public
```

Returns to normal state

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

_Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
{upgradeToAndCall}.

Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.

```solidity
function _authorizeUpgrade(address) internal onlyOwner {}
```_

## WunderTokenV2

### constructor

```solidity
constructor() public
```

### _update

```solidity
function _update(address from, address to, uint256 value) internal virtual
```

Adds the whenNotFrozen to the sender address

_Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
(or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
this function.

Emits a {Transfer} event._

## WunderTokenV3

### VIP_ROLE

```solidity
bytes32 VIP_ROLE
```

==================================================================

### _vip

```solidity
mapping(address => bool) _vip
```

### _rewardClaimed

```solidity
mapping(address => bool) _rewardClaimed
```

### REWARD_AMOUNT

```solidity
uint256 REWARD_AMOUNT
```

### VIPSet

```solidity
event VIPSet(address account)
```

===================================================================

### VIPUnset

```solidity
event VIPUnset(address account)
```

### onlyVIP

```solidity
modifier onlyVIP()
```

===================================================================

### VIPAlreadySet

```solidity
error VIPAlreadySet(address account)
```

===================================================================

### VIPAlreadyUnset

```solidity
error VIPAlreadyUnset(address account)
```

### NotVIP

```solidity
error NotVIP()
```

### RewardAlreadyClaimed

```solidity
error RewardAlreadyClaimed()
```

### constructor

```solidity
constructor() public
```

### setVIP

```solidity
function setVIP(address account) external
```

### unsetVIP

```solidity
function unsetVIP(address account) external
```

### isVIP

```solidity
function isVIP(address account) external view returns (bool)
```

### claimReward

```solidity
function claimReward() external
```

