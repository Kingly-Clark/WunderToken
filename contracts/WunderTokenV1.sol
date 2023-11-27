// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract WunderTokenV1 is
  Initializable,
  ERC20Upgradeable,
  ERC20BurnableUpgradeable,
  ERC20PausableUpgradeable,
  AccessControlUpgradeable,
  UUPSUpgradeable
{
  /** ================================================================== */
  /** ========================= State variables ======================== */
  /** ================================================================== */
  mapping(address => bool) private _frozen;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  bytes32 public constant GOVERN_ROLE = keccak256("GOVERN_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  /** =================================================================== */
  /** =========================== Events ================================ */
  /** =================================================================== */
  /**
   * @dev Emitted when `account` is frozen.
   */
  event AddressFrozen(address indexed account);

  /**
   * @dev Emitted when `account` is unfrozen.
   */
  event AddressUnfrozen(address indexed account);

  /**
   * @dev Emitted when `account` is seized.
   *
   * note account needs to be frozen before it can be seized.
   */
  event AddressSeized(address indexed account);

  /**
   * @dev Emitted when `account` withdraws `amount` of funds that have been seized.
   */
  event FundsWithdrew(address indexed account, uint256 amount);

  /**
   * @dev Emitted when `amounts` tokens are minted to multiple `recipients`.
   */
  event BatchMint(
    address indexed minter,
    address[] recipients,
    uint256[] amounts
  );

  /** =================================================================== */
  /** =========================== Modifiers ============================= */
  /** =================================================================== */
  modifier whenNotFrozen(address account) {
    require(!_frozen[account], "Wunder: Account is frozen");
    _;
  }

  modifier whenFrozen(address account) {
    require(_frozen[account], "Wunder: Account is not frozen");
    _;
  }

  function isFrozen(address account) public view returns (bool) {
    return _frozen[account];
  }

  /** =================================================================== */
  /** =========================== Functions ============================= */
  /** =================================================================== */

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address defaultAdmin) public initializer {
    __ERC20_init("Wunder Token", "WUNDER");
    __ERC20Burnable_init();
    __ERC20Pausable_init();
    __AccessControl_init();
    __UUPSUpgradeable_init();

    assert(_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin));
  }

  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(UPGRADER_ROLE) {}

  // The following functions are overrides required by Solidity.

  function _update(
    address from,
    address to,
    uint256 value
  )
    internal
    override(ERC20Upgradeable, ERC20PausableUpgradeable)
    whenNotPaused
    whenNotFrozen(from)
    whenNotFrozen(to)
  {
    super._update(from, to, value);
  }

  /**
   * @dev Destroys a `value` amount of tokens from the caller.
   *
   * See {ERC20-_burn}.
   */
  function burn(uint256 value) public virtual override onlyRole(BURNER_ROLE) {
    _burn(_msgSender(), value);
  }

  /**
   * @dev Destroys a `value` amount of tokens from `account`, deducting from
   * the caller's allowance.
   *
   * See {ERC20-_burn} and {ERC20-allowance}.
   *
   * Requirements:
   *
   * - the caller must have allowance for ``accounts``'s tokens of at least
   * `value`.
   */
  function burnFrom(
    address account,
    uint256 value
  ) public virtual override onlyRole(BURNER_ROLE) {
    _spendAllowance(account, _msgSender(), value);
    _burn(account, value);
  }

  /**
   * @dev Freezes a specific account.
   *
   * @param account The address to be frozen.
   *
   * Requirements:
   * - the contract must not be paused.
   * - the caller must have the `GOVERN_ROLE`.
   * - the account must not be frozen.
   *
   * Emits AddressFrozen event.
   */
  function freeze(
    address account
  )
    public
    whenNotPaused
    onlyRole(GOVERN_ROLE)
    whenNotFrozen(account)
    returns (bool)
  {
    _frozen[account] = true;
    emit AddressFrozen(account);
    return true;
  }

  /**
   * @dev Unfreezes a specific account.
   *
   * @param account The address to be unfrozen.
   *
   * Requirements:
   * - the contract must not be paused.
   * - the caller must have the `GOVERN_ROLE`.
   * - the account must be frozen.
   *
   *
   * Emits AddressUnfrozen event.
   */
  function unfreeze(
    address account
  )
    public
    whenNotPaused
    onlyRole(GOVERN_ROLE)
    whenFrozen(account)
    returns (bool)
  {
    _frozen[account] = false;
    emit AddressUnfrozen(account);
    return true;
  }

  /**
   * @dev Seizes a specific account which entails transffering
   * all the funds to this contract which can later be pulled
   * and/or burned using the withdraw function.
   *
   * @param account The address to be seized.
   *
   * Requirements:
   * - contract must not be paused.
   * - caller must have the GOVERN_ROLE.
   * - account must not be frozen.
   * - account cannot be the contract address.
   * - account must have a balance greater than zero.
   *
   * Emits AddressSeized event.
   */
  function seize(
    address account
  )
    public
    whenNotPaused
    onlyRole(GOVERN_ROLE)
    whenFrozen(account)
    returns (bool)
  {
    require(account != address(this), "Wunder: cannot clean to self");
    require(balanceOf(account) > 0, "Wunder: cannot clean empty account");
    uint256 balance = balanceOf(account);
    _transfer(account, address(this), balance);
    emit AddressSeized(account);
    return true;
  }

  /**
   * @dev Withdraws a specific amount of ZARS from this contract.
   *
   * @param amount The amount of ZARS to withdraw to the sender.
   *
   * Requirements:
   *
   * - contract must not be paused.
   * - contract must have enough ZARS to withdraw.
   * - caller must have the `GOVERN_ROLE`.
   *
   * Emits FundsWithdrew event.
   */
  function withdraw(
    uint256 amount
  ) public onlyRole(GOVERN_ROLE) returns (bool) {
    require(amount <= balanceOf(address(this)), "Wunder: not enough funds");
    _transfer(address(this), _msgSender(), amount);
    emit FundsWithdrew(_msgSender(), amount);
    return true;
  }

  /**
   * @dev See {ERC20-_mint}.
   *
   * Requirements:
   * - contract must not be paused.
   * - caller must have the `MINTER_ROLE`.
   * - account must not be frozen.
   */
  function mint(address account, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(account, amount);
  }

  /**
   * @dev Mints a specific amount of tokens to the recipients.
   * Requirements:
   * - contract must not be paused.
   * - caller must have the `MINTER_ROLE`.
   * - throws if recipients and amounts length mismatch.
   * - throws if recipients and amounts length is greater than 256.
   * @param recipients Array of recipient addresses.
   * @param amounts Array of amounts to be minted.
   */
  function batchMint(
    address[] memory recipients,
    uint256[] memory amounts
  ) external whenNotPaused onlyRole(MINTER_ROLE) {
    require(
      recipients.length == amounts.length,
      "Wunder: batchMint length mismatch"
    );

    require(
      recipients.length <= 256,
      "Wunder: recipients and amounts length must be less than 256"
    );

    for (uint256 i = 0; i < recipients.length; i++) {
      _mint(recipients[i], amounts[i]);
    }

    emit BatchMint(_msgSender(), recipients, amounts);
  }

  /**
   * @dev See {Pausable-_pause}.
   *
   * Requirements:
   * - caller must have the `PAUSER_ROLE`.
   */
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev See {Pausable-_unpause}.
   *
   * Requirements:
   * - caller must have the `PAUSER_ROLE`.
   */
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
