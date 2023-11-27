// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./WunderTokenV1.sol";

contract WunderTokenV2 is WunderTokenV1 {
  uint256 private value;

  // Emitted when the stored value changes
  event ValueChanged(uint256 newValue);

  // Increments the stored value by 1
  function increment() public {
    value = value + 1;
    emit ValueChanged(value);
  }
}
