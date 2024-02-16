// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title WunderTokenV1
/// @author Louwrens J Labuschagne
/// @notice An ERC20 token with pausable and upgradable features which includes the ability to freeze and seize funds in accounts.
/// @notice + The contract uses `AccessControlUpgradeable` and is  initialized with the `DEFAULT_ADMIN_ROLE` granted to the address provided to the `initialize` function.
/// @notice + The contract extends the `ERC20Upgradeable` contract and implements the `ERC20BurnableUpgradeable` and `ERC20PausableUpgradeable` contracts.
/// @notice + The contract implements the `UUPSUpgradeable` contract.
/// @notice + The contract implements the `freeze`, `unfreeze`, `seize` and `withdraw` functions which are only callable by the `GOVERN_ROLE`.
/// @notice + The contract implements the `batchMint` function which allows the `MINTER_ROLE` to mint tokens to multiple recipients.
/// @notice + The contract implements the `batchTransfer` function which allows any address to transfer tokens to multiple recipients.
/// @notice + The contract overrides the `_update` function from the `ERC20Upgradeable` contract to include the `whenNotFrozen` modifier on the `from` address, i.e. a frozen account cannot send tokens
/// @notice + The contract overrides the `mint` function from the `ERC20Upgradeable` contract to include the `onlyRole(MINTER_ROLE)` modifier.
/// @notice + The contract overrides the `burn` and `burnFrom` functions from the `ERC20BurnableUpgradeable` contract to include the `onlyRole(BURNER_ROLE)` modifier.
/// @notice + The contract overrides the `pause` and `unpause` functions from the `ERC20PausableUpgradeable` contract to include the `onlyRole(PAUSER_ROLE)` modifier.
/// @notice + The contract overrides the `_authorizeUpgrade` function from the `UUPSUpgradeable` contract to include the `onlyRole(UPGRADER_ROLE)` modifier.
contract WunderTokenV1 is
  Initializable,
  ERC20Upgradeable,
  ERC20BurnableUpgradeable,
  ERC20PausableUpgradeable,
  AccessControlUpgradeable,
  UUPSUpgradeable
{
  /** ========================= State variables ======================== */

  /// @notice Internal state for when an account is frozen. A frozen account can receive (transfer/mint) tokens but cannot send (transfer/burn) tokens.
  mapping(address => bool) internal _frozen;

  /** ============================ Constants =========================== */

  /// @notice MINTER_ROLE allows calling `mint` and `batchMint` functions.
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  /// @notice PAUSER_ROLE allows calling `pause` and `unpause` functions.
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  /// @notice BURNER_ROLE allows calling `burn` and `burnFrom` functions.
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  /// @notice GOVERN_ROLE allows calling `freeze`, `unfreeze`, `seize` and `withdraw` functions.
  bytes32 public constant GOVERN_ROLE = keccak256("GOVERN_ROLE");
  /// @notice UPGRADER_ROLE allows calling `_authorizeUpgrade` function.
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  /** =========================== Events ================================ */

  /// @notice Emitted when `account` is frozen.
  /// @param account The address that was frozen.
  event AddressFrozen(address indexed account);

  /// @notice Emitted when `account` is unfrozen.
  /// @param account The address that was unfrozen.
  event AddressUnfrozen(address indexed account);

  /// @notice Emitted when `account` is seized.
  /// @dev account needs to be frozen before it can be seized.
  /// @param account The address that was seized.
  event AddressSeized(address indexed account);

  /// @notice Emitted when `account` withdraws `amount` of funds that have been seized.
  /// @param account The address that withdrew the funds.
  /// @param amount The amount of funds that were withdrawn.
  event FundsWithdrawn(address indexed account, uint256 amount);

  /// @notice Emitted when `amounts` tokens are minted to multiple `recipients`.
  /// @param minter The address that minted the tokens.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were minted.
  event BatchMint(
    address indexed minter,
    address[] recipients,
    uint256[] amounts
  );

  /// @notice Emitted when `amounts` tokens are moved from one account (`sender`) to multiple `recipients`.
  /// @param sender The address that sent the tokens.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were transferred.
  event BatchTransfer(
    address indexed sender,
    address[] recipients,
    uint256[] amounts
  );

  /** =========================== Modifiers ============================= */

  /// @notice Throws `WunderTokenAccountFrozen` if the `account` is frozen.
  /// @param account The address to check.
  modifier whenNotFrozen(address account) {
    if (_frozen[account]) {
      revert WunderTokenAccountFrozen(account);
    }
    _;
  }

  /// @notice Throws `WunderTokenAccountNotFrozen` if the `account` is not frozen.
  /// @param account The address to check.
  modifier whenFrozen(address account) {
    if (!_frozen[account]) {
      revert WunderTokenAccountNotFrozen(account);
    }
    _;
  }

  /** ============================= Errors ============================== */
  /// @notice Error message emitted when the `account` is frozen.
  /// @param account The address that was frozen.
  error WunderTokenAccountFrozen(address account);

  /// @notice Error message emitted when the `account` is not frozen.
  /// @param account The address that was not frozen.
  error WunderTokenAccountNotFrozen(address account);

  /// @notice Error message emitted when the `account` is not allowed.
  /// @dev Used to indicate that this contract's address cannot be frozen.
  /// @param account The address that was not allowed.
  error WunderTokenAccountNotAllowed(address account);

  /// @notice Error message emitted when the `account` has zero balance.
  /// @param account The address that has zero balance.
  error WunderTokenAccountZeroBalance(address account);

  /// @notice Error message emitted when the `recipients` and `amounts` arrays have different lengths.
  error WunderTokenArrayLengthMismatch();

  /// @notice Error message emitted when the `recipients` and `amounts` arrays have a length greater than 256.
  error WunderTokenArrayLengthExceeded();

  /// @notice Error message emitted when the `account` has insufficient balance.
  /// @param account The address that has insufficient balance.
  /// @param amount The amount that was requested.
  error WunderTokenInsufficientBalance(address account, uint256 amount);

  /// @notice Error message emitted when the `recipients` and `amounts` arrays are empty.
  error WunderTokenArrayEmpty();

  /** =========================== Functions ============================= */

  /// @notice As this is an upgradeable contract, the constructor is not used and the `initialize` function is used instead.
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initializes the contract with the `DEFAULT_ADMIN_ROLE` granted to the `defaultAdmin` address.
  /// @param defaultAdmin The address that will be granted the `DEFAULT_ADMIN_ROLE`.
  function initialize(address defaultAdmin) public initializer {
    __ERC20_init("Wunderpar", "WUNDER");
    __ERC20Burnable_init();
    __ERC20Pausable_init();
    __AccessControl_init();
    __UUPSUpgradeable_init();

    assert(_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin));
  }

  /// @notice Adds the whenNotFrozen to the sender address
  /// @inheritdoc ERC20Upgradeable
  function _update(
    address from,
    address to,
    uint256 value
  )
    internal
    virtual
    override(ERC20PausableUpgradeable, ERC20Upgradeable)
    whenNotFrozen(from)
  {
    super._update(from, to, value);
  }

  /// @notice Only allows the `BURNE_ROLE` to burn tokens.
  /// @inheritdoc ERC20BurnableUpgradeable
  function burn(uint256 value) public virtual override onlyRole(BURNER_ROLE) {
    _burn(_msgSender(), value);
  }

  /// @notice Only allows the `BURNE_ROLE` to burn tokens from the `account`.
  /// @inheritdoc ERC20BurnableUpgradeable
  function burnFrom(
    address account,
    uint256 value
  ) public virtual override onlyRole(BURNER_ROLE) {
    _spendAllowance(account, _msgSender(), value);
    _burn(account, value);
  }

  /// @notice Returns true if the `account` is frozen.
  /// @param account The address to check.
  /// @return frozen True if the `account` is frozen.
  function isFrozen(address account) public view returns (bool frozen) {
    return _frozen[account];
  }

  /// @notice Freezes the `account`.
  /// @param account The address to be frozen.
  /// @return frozen True if the `account` is frozen.
  /// @dev Requirements:
  /// @dev The contract must not be paused.
  /// @dev The caller must have the `GOVERN_ROLE`.
  /// @dev The account must not already be frozen.
  /// @dev The account cannot be the contract address.
  /// @dev Emits AddressFrozen event.
  function freeze(
    address account
  ) public onlyRole(GOVERN_ROLE) whenNotFrozen(account) returns (bool frozen) {
    if (account == address(this)) {
      revert WunderTokenAccountNotAllowed(account);
    }
    _frozen[account] = true;
    emit AddressFrozen(account);
    return true;
  }

  /// @notice Unfreezes the `account`.
  /// @param account The address to be unfrozen.
  /// @return frozen True if the `account` is unfrozen.
  /// @dev Requirements:
  /// @dev The contract must not be paused.
  /// @dev The caller must have the `GOVERN_ROLE`.
  /// @dev The account must be frozen.
  /// @dev Emits AddressUnfrozen event.
  function unfreeze(
    address account
  ) public onlyRole(GOVERN_ROLE) whenFrozen(account) returns (bool frozen) {
    _frozen[account] = false;
    emit AddressUnfrozen(account);
    return true;
  }

  /// @notice Seizes the `account` which transfers all funds owned by the `account` to this contract.
  /// @param account The address to be seized.
  /// @return seized True if the `account` is seized.
  /// @dev
  /// @dev Requirements:
  /// @dev The contract must not be paused.
  /// @dev The caller must have the `GOVERN_ROLE`.
  /// @dev The account must already be frozen.
  /// @dev The account cannot be the contract address.
  /// @dev The account must have a balance greater than zero.
  /// @dev Emits AddressSeized event.
  function seize(
    address account
  ) public onlyRole(GOVERN_ROLE) whenFrozen(account) returns (bool seized) {
    // No need to check that account != address(this) since address(this) can't be frozen.
    if (balanceOf(account) <= 0) {
      revert WunderTokenAccountZeroBalance(account);
    }
    uint256 balance = balanceOf(account);
    _frozen[account] = false;
    _transfer(account, address(this), balance);
    _frozen[account] = true;
    emit AddressSeized(account);
    return true;
  }

  /// @notice Withdraws a specific amount from this contract.
  /// @param amount The amount to withdraw.
  /// @return withdrawn True if the `amount` is withdrawn.
  /// @dev Requirements:
  /// @dev The contract must not be paused.
  /// @dev The contract must have enough funds to withdraw.
  /// @dev The caller must have the `GOVERN_ROLE`.
  /// @dev Emits FundsWithdrawn event.
  function withdraw(
    uint256 amount
  ) public onlyRole(GOVERN_ROLE) returns (bool withdrawn) {
    if (amount > balanceOf(address(this))) {
      revert WunderTokenInsufficientBalance(_msgSender(), amount);
    }
    _transfer(address(this), _msgSender(), amount);
    emit FundsWithdrawn(_msgSender(), amount);
    return true;
  }

  /// @notice Adds the onlyRole(MINTER_ROLE) modifier to the mint function.
  function mint(address account, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(account, amount);
  }

  /// @notice Adds the onlyRole(MINTER_ROLE) modifier to the batchMint function.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have different lengths.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have a length greater than 256.
  /// @dev Throws `WunderTokenArrayEmpty` if the `recipients` and `amounts` arrays are empty.
  /// @dev Emits BatchMint event.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were minted.
  function batchMint(
    address[] memory recipients,
    uint256[] memory amounts
  ) external onlyRole(MINTER_ROLE) {
    if (recipients.length != amounts.length) {
      revert WunderTokenArrayLengthMismatch();
    }

    if (recipients.length > 256) {
      revert WunderTokenArrayLengthExceeded();
    }

    if (recipients.length == 0) {
      revert WunderTokenArrayEmpty();
    }

    for (uint256 i = 0; i < recipients.length; i++) {
      _mint(recipients[i], amounts[i]);
    }

    emit BatchMint(_msgSender(), recipients, amounts);
  }

  /// @notice Allows any address to transfer tokens to multiple recipients.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have different lengths.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients` and `amounts` arrays have a length greater than 256.
  /// @dev Throws `WunderTokenArrayEmpty` if the `recipients` and `amounts` arrays are empty.
  /// @dev Emits BatchTransfer event.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were transferred.
  function batchTransfer(
    address[] memory recipients,
    uint256[] memory amounts
  ) external {
    if (recipients.length != amounts.length) {
      revert WunderTokenArrayLengthMismatch();
    }

    if (recipients.length > 256) {
      revert WunderTokenArrayLengthExceeded();
    }

    if (recipients.length == 0) {
      revert WunderTokenArrayEmpty();
    }

    for (uint256 i = 0; i < recipients.length; i++) {
      address to = recipients[i];
      _transfer(_msgSender(), to, amounts[i]);
    }

    emit BatchTransfer(_msgSender(), recipients, amounts);
  }

  /// @notice Triggers stopped state
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /// @notice Returns to normal state
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  /// @inheritdoc UUPSUpgradeable
  function _authorizeUpgrade(
    address newImplementation
  )
    internal
    override
    onlyRole(UPGRADER_ROLE)
  // solhint-disable-next-line no-empty-blocks
  {

  }
}
