// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Contract allows to create cell and withdraw cell content by signature
 *

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

    constructor() {}

    // _______________ External functions _______________

    function createCellERC20(IERC20 _token, uint256 _amount) external {
        _token.transferFrom(msg.sender, address(this), _amount);
        cellId.increment();

        cellOwner[cellId.current()] = msg.sender;
        cellAmount[cellId.current()] = _amount; // ERC-20 token amount
        cellContract[cellId.current()] = address(_token);
        cellType[cellId.current()] = 1;
    }

    function createCellERC721(IERC721 _token, uint256 _erc721Id) external {
        _token.transferFrom(msg.sender, address(this), _erc721Id);
        cellId.increment();

        cellOwner[cellId.current()] = msg.sender;
        cellAmount[cellId.current()] = _erc721Id; // ERC-721  - tokenID
        cellContract[cellId.current()] = address(_token);
        cellType[cellId.current()] = 2;
    }

    function createCellEther() external payable {
        cellId.increment();

        cellOwner[cellId.current()] = msg.sender;
        cellAmount[cellId.current()] = msg.value; // Ether Amount
        // cellContract[cellId.current()] = address(_token);
        cellType[cellId.current()] = 3;
    }

    function deleteCell(uint256 _cellId) internal {
        delete cellAmount[_cellId];
        delete cellOwner[_cellId];
        delete cellContract[_cellId];
        delete cellType[_cellId];
    }

    function takeCellContentBySignature(
        uint256 _cellId,
        uint256 _deadline,
        bytes memory _signature
    ) external {
        require(block.timestamp <= _deadline, "ExpiredSignature");
        require(verify(cellOwner[_cellId], _cellId, _deadline, _signature) == true, "Invalid signature");
        if (cellType[_cellId] == 1) {
            IERC20(cellContract[_cellId]).transfer(msg.sender, cellAmount[_cellId]);
        }
        if (cellType[_cellId] == 2) {
            IERC721(cellContract[_cellId]).transferFrom(address(this), msg.sender, cellAmount[_cellId]);
        }
        if (cellType[_cellId] == 3) {
            (bool sent, bytes memory data) = msg.sender.call{value: cellAmount[_cellId]}("");
            require(sent, "Failed to send Ether");
        }
        deleteCell(_cellId);
    }

    // __________________ Signatures ____________________
    function getMessageHash(uint256 _cellId, uint256 _deadline) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_cellId, _deadline));
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
        uint256 _cellId,
        uint256 _deadline,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_cellId, _deadline);
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
