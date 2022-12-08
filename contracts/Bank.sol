// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Positive Even Number Setter -- the contract which sets a value of the positive even number.
 *
 * @dev This contract includes the following functionality:
 *  - Setting of the positive even number by the owner.
 *  - Getting of a value of the set number.
 */
contract Bank {
    using Counters for Counters.Counter;
    Counters.Counter private cellId;

    // _______________ Storage _______________

    mapping(uint256 => uint256) public cellAmount;
    mapping(uint256 => address) public cellOwner;
    mapping(uint256 => address) public cellContract; // contract of cell content
    mapping(uint256 => uint8) public cellType; // 1 - ERC20, 2 - ERC721, 3 - Ether

    // _______________ Errors _______________

    // _______________ Events _______________

    // _______________ Constructor ______________

    /// @dev Initializes the contract setting the deployer as the initial owner and the variable `positiveEven` with 2.
    constructor() {}

    // _______________ External functions _______________

    function createCellERC20(IERC20 _token, uint256 _amount) external {
        _token.transferFrom(msg.sender, address(this), _amount);
        cellId.increment();

        cellOwner[cellId.current()] = msg.sender;
        cellAmount[cellId.current()] = _amount;
        cellContract[cellId.current()] = address(_token);
        cellType[cellId.current()] = 1;
    }

    function takeCellContentBySignature(uint256 _cellId, bytes memory _signature) external {
        require(
            verify(cellOwner[_cellId], msg.sender, cellAmount[_cellId], "message", 0, _signature) == true,
            "Invalis signature"
        );
        if (cellType[_cellId] == 1) {
            IERC20(cellContract[_cellId]).transfer(msg.sender, cellAmount[_cellId]);
        }
    }

    // __________________ Signatures ____________________
    function getMessageHash(
        address _to,
        uint256 _amount,
        string memory _message,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _amount, _message, _nonce));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function verify(
        address _signer,
        address _to,
        uint256 _amount,
        string memory _message,
        uint256 _nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_to, _amount, _message, _nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}
