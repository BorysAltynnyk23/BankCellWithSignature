// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Mock is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private nftId;

    constructor() ERC721("ERC721Mocl", "DAIM") {}

    function mint(address _to) external {
        nftId.increment();
        _mint(_to, nftId.current());
    }
}
