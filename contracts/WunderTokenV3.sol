// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {WunderTokenV2} from "./WunderTokenV2.sol";

/// @title WunderTokenV3
/// @notice WunderTokenV3 is just an example of a contract that can be upgraded adding a simple VIP role and a reward
contract WunderTokenV3 is WunderTokenV2 {
  /** ========================= State variables ======================== */
  bytes32 public constant VIP_ROLE = keccak256("VIP_ROLE");
  mapping(address => bool) internal _vip;
  mapping(address => bool) internal _rewardClaimed;
  uint256 public constant REWARD_AMOUNT = 1000 * 10 ** 18;

  /** =========================== Events ================================ */
  event VIPSet(address account);
  event VIPUnset(address account);

  /** =========================== Modifiers ============================= */
  modifier onlyVIP() {
    if (!_vip[msg.sender]) revert NotVIP();
    _;
  }

  /** ============================= Errors ============================== */
  error VIPAlreadySet(address account);
  error VIPAlreadyUnset(address account);
  error NotVIP();
  error RewardAlreadyClaimed();

  /** =========================== Functions ============================= */
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function setVIP(address account) external onlyRole(VIP_ROLE) {
    if (_vip[account]) revert VIPAlreadySet(account);
    _vip[account] = true;
    emit VIPSet(account);
  }

  function unsetVIP(address account) external onlyRole(VIP_ROLE) {
    if (!_vip[account]) revert VIPAlreadyUnset(account);
    _vip[account] = false;
    emit VIPUnset(account);
  }

  function isVIP(address account) external view returns (bool) {
    return _vip[account];
  }

  function claimReward() external onlyVIP {
    if (_rewardClaimed[msg.sender]) revert RewardAlreadyClaimed();
    _rewardClaimed[msg.sender] = true;
    _mint(msg.sender, REWARD_AMOUNT);
  }
}
