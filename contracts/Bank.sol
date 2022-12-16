// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Contract allows to create cell and withdraw cell content by signature
 *

 */
contract Bank {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    Counters.Counter private cellId;

    // _______________ Storage _______________
    enum CellKind {
        ERC20,
        ERC721,
        Ether
    }

    struct Cell {
        address owner;
        uint256 amount;
        address contractAddress;
        CellKind kind;
    }

    mapping(uint256 => Cell) public cells;

    // _______________ Errors _______________

    // _______________ Events _______________
    event CellCreated(uint256 _cellId);
    event CellDeleted(uint256 _cellId);

    // _______________ Constructor ______________

    constructor() {}

    // _______________ External functions _______________

    function createCellERC20(IERC20 _token, uint256 _amount) external {
        _token.safeTransferFrom(msg.sender, address(this), _amount);
        cellId.increment();

        cells[cellId.current()] = Cell(msg.sender, _amount, address(_token), CellKind.ERC20);

        emit CellCreated(cellId.current());
    }

    function createCellERC721(IERC721 _token, uint256 _erc721Id) external {
        _token.transferFrom(msg.sender, address(this), _erc721Id);
        cellId.increment();

        cells[cellId.current()] = Cell(msg.sender, _erc721Id, address(_token), CellKind.ERC721);

        emit CellCreated(cellId.current());
    }

    function createCellEther() external payable {
        cellId.increment();

        cells[cellId.current()] = Cell(msg.sender, msg.value, address(0), CellKind.Ether);

        emit CellCreated(cellId.current());
    }

    function takeCellContentBySignature(
        uint256 _cellId,
        uint256 _deadline,
        bytes memory _signature
    ) external {
        Cell memory cell = cells[_cellId];
        require(block.timestamp <= _deadline, "ExpiredSignature");
        require(verify(cell.owner, _cellId, _deadline, _signature) == true, "Invalid signature");

        delete cells[_cellId];

        if (cell.kind == CellKind.ERC20) {
            IERC20(cell.contractAddress).safeTransfer(msg.sender, cell.amount);
        }
        if (cell.kind == CellKind.ERC721) {
            IERC721(cell.contractAddress).transferFrom(address(this), msg.sender, cell.amount);
        }
        if (cell.kind == CellKind.Ether) {
            (bool sent, bytes memory data) = msg.sender.call{value: cell.amount}("");
            require(sent, "Failed to send Ether");
        }

        emit CellDeleted(_cellId);
    }

    // __________________ Signatures ____________________
    function getMessageHash(
        uint256 _cellId,
        address _confidant,
        uint256 _deadline
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_cellId, _confidant, _deadline));
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
    ) public returns (bool) {
        bytes32 messageHash = getMessageHash(_cellId, msg.sender, _deadline);
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
