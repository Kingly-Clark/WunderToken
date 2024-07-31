// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {WunderTokenV1} from "./WunderTokenV1.sol";

contract WunderTokenV2 is WunderTokenV1 {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Emitted when `amount` tokens are minted to `recipient` using the transferWithId function.
  /// @param from The address that sent the tokens.
  /// @param to The address that received the tokens.
  /// @param value The amount that was sent.
  /// @param id The id that was sent.
  event TransferWithId(
    address indexed from,
    address indexed to,
    uint256 value,
    bytes16 id
  );

  /// @notice Emitted when `amounts` tokens are minted to multiple `recipients`.
  /// @param minter The address that minted the tokens.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were minted.
  /// @param ids id guids to join up transaction on a backend. This can be any unique identifier, but we suspect a lower case guid.
  event BatchMintWithId(
    address indexed minter,
    address[] recipients,
    uint256[] amounts,
    bytes16[] ids
  );

  /// @notice Adds the onlyRole(MINTER_ROLE) modifier to the batchMint function.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients`, `amounts` and `ids` arrays have different lengths.
  /// @dev Throws `WunderTokenArrayLengthExceeded` if the `recipients`,`amounts` and `ids` arrays have a length greater than 256.
  /// @dev Throws `WunderTokenArrayEmpty` if the `recipients`, `amounts` and `ids` arrays are empty.
  /// @dev Emits BatchMint event.
  /// @param recipients Array of recipient addresses.
  /// @param amounts Array of amounts that were minted.
  /// @param ids id guids to join up transaction on a backend. This can be any unique identifier, but we suspect a lower case guid.
  function batchMintWithId(
    address[] memory recipients,
    uint256[] memory amounts,
    bytes16[] memory ids
  ) external onlyRole(MINTER_ROLE) {
    if (ids.length != recipients.length || ids.length != amounts.length) {
      revert WunderTokenArrayLengthMismatch();
    }

    if (ids.length > 256) {
      revert WunderTokenArrayLengthExceeded();
    }

    if (ids.length == 0) {
      revert WunderTokenArrayEmpty();
    }

    for (uint256 i = 0; i < ids.length; i++) {
      _mint(recipients[i], amounts[i]);
    }
    emit BatchMintWithId(_msgSender(), recipients, amounts, ids);
  }

  /// @notice A transfer event that emits the TransferWithId event when the transferWithId function is called.
  /// @param to The address that received the tokens.
  /// @param value The amount that was sent.
  /// @param id The id that was sent.
  function transferWithId(
    address to,
    uint256 value,
    bytes16 id
  ) external returns (bool) {
    address owner = _msgSender();
    _transfer(owner, to, value);
    emit TransferWithId(_msgSender(), to, value, id);
    return true;
  }
}
