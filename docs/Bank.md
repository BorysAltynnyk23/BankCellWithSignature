# Solidity API

## Bank

### cellId

```solidity
struct Counters.Counter cellId
```

### cellAmount

```solidity
mapping(uint256 => uint256) cellAmount
```

### cellOwner

```solidity
mapping(uint256 => address) cellOwner
```

### cellContract

```solidity
mapping(uint256 => address) cellContract
```

### cellType

```solidity
mapping(uint256 => uint8) cellType
```

### constructor

```solidity
constructor() public
```

### createCellERC20

```solidity
function createCellERC20(contract IERC20 _token, uint256 _amount) external
```

### createCellERC721

```solidity
function createCellERC721(contract IERC721 _token, uint256 _erc721Id) external
```

### createCellEther

```solidity
function createCellEther() external payable
```

### deleteCell

```solidity
function deleteCell(uint256 _cellId) internal
```

### takeCellContentBySignature

```solidity
function takeCellContentBySignature(uint256 _cellId, uint256 _deadline, bytes _signature) external
```

### getMessageHash

```solidity
function getMessageHash(uint256 _cellId, uint256 _deadline) public pure returns (bytes32)
```

### getEthSignedMessageHash

```solidity
function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32)
```

### verify

```solidity
function verify(address _signer, uint256 _cellId, uint256 _deadline, bytes signature) public pure returns (bool)
```

### recoverSigner

```solidity
function recoverSigner(bytes32 _ethSignedMessageHash, bytes _signature) public pure returns (address)
```

### splitSignature

```solidity
function splitSignature(bytes sig) public pure returns (bytes32 r, bytes32 s, uint8 v)
```

