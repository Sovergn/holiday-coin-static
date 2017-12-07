pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract JesusCoin is StandardToken {
  string public constant name = "Jesus Coin";
  string public constant symbol = "\u0391\u03A9";
  uint256 public constant decimals = 18;
  uint256 public totalSupply = 10**27;
}
