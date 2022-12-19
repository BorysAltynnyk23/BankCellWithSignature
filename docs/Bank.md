# Solidity API

## Bank

### cellId

```solidity
struct Counters.Counter cellId
```

### CellKind

```solidity
enum CellKind {
  ERC20,
  ERC721,
  Ether
}
```

### Cell

```solidity
struct Cell {
  address owner;
  uint256 amount;
  address contractAddress;
  enum Bank.CellKind kind;
}
```

### cells

```solidity
mapping(uint256 => struct Bank.Cell) cells
```

cell id to cell content

### CellCreated

```solidity
event CellCreated(uint256 _cellId)
```

### CellDeleted

```solidity
event CellDeleted(uint256 _cellId)
```

### constructor

```solidity
constructor() public
```

### createCellERC20

```solidity
function createCellERC20(contract IERC20 _token, uint256 _amount) external
```

Create cell with ERC20 token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IERC20 | Address of ERC20 token contract user want to deposit to the cell |
| _amount | uint256 | Amount of ERC20 token user want to deposit to the cell |

### createCellERC721

```solidity
function createCellERC721(contract IERC721 _token, uint256 _erc721Id) external
```

Create cell with ERC721 token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IERC721 | Address of ERC721 token contract user want to deposit to the cell |
| _erc721Id | uint256 | Id of ERC721 token user want to deposit to the cell |

### createCellEther

```solidity
function createCellEther() external payable
```

Create cell with Ethereum

_Ether should be sent with transaction_

### takeCellContentBySignature

```solidity
function takeCellContentBySignature(uint256 _cellId, uint256 _deadline, bytes _signature) external
```

Send cell content to caller by signature

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cellId | uint256 | Id of the cell |
| _deadline | uint256 | Deadline after wich signature is invalid |
| _signature | bytes | Signature to prove that caller are the one who is in signature |

### getMessageHash

```solidity
function getMessageHash(uint256 _cellId, address _confidant, uint256 _deadline) public pure returns (bytes32)
```

Create hash of the message

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cellId | uint256 | Id of the cell |
| _confidant | address | The user that will be allowed to collect cell content |
| _deadline | uint256 | The time after wich signature is not valid |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | Hashed message |

### getEthSignedMessageHash

```solidity
function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32)
```

Hash the messageHash in Ethereum format

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | Hashed message in Ethereum format |

### verify

```solidity
function verify(address _signer, uint256 _cellId, uint256 _deadline, bytes signature) public returns (bool)
```

Verify that message is signed by the signer

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | User that signed the message |
| _cellId | uint256 | Id of cell from the message |
| _deadline | uint256 | Signature deadline |
| signature | bytes |  |

### recoverSigner

```solidity
function recoverSigner(bytes32 _ethSignedMessageHash, bytes _signature) public pure returns (address)
```

### splitSignature

```solidity
function splitSignature(bytes sig) public pure returns (bytes32 r, bytes32 s, uint8 v)
```

