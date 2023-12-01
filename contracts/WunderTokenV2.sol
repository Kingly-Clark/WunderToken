// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {WunderTokenV1} from "./WunderTokenV1.sol";

contract WunderTokenV2 is WunderTokenV1 {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Adds the whenNotFrozen to the sender and recipient address
  /// @inheritdoc WunderTokenV1
  function _update(
    address from,
    address to,
    uint256 value
  )
    internal
    virtual
    override(WunderTokenV1)
    whenNotPaused
    whenNotFrozen(from)
    whenNotFrozen(to)
  {
    super._update(from, to, value);
  }
}
