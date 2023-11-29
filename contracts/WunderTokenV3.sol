// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {WunderTokenV2} from "./WunderTokenV2.sol";

contract WunderTokenV3 is WunderTokenV2 {
  function _update(
    address from,
    address to,
    uint256 value
  )
    internal
    virtual
    override(WunderTokenV2)
    whenNotPaused
    whenNotFrozen(from)
    whenNotFrozen(to)
  {
    super._update(from, to, value);
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }
}
