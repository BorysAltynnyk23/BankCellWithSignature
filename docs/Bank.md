# Solidity API

## Bank

_This contract includes the following functionality:
 - Setting of the positive even number by the owner.
 - Getting of a value of the set number._

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

_Initializes the contract setting the deployer as the initial owner and the variable `positiveEven` with 2._

### createCellERC20

```solidity
function createCellERC20(contract IERC20 _token, uint256 _amount) external
```

### createCellERC721

```solidity
function createCellERC721(contract IERC721 _token, uint256 _erc721Id) external
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

