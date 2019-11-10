pragma solidity ^0.4.22;
import "./provableAPI.sol";
import "./Integers.sol";

contract ReadingCollector is usingProvable {

   Reading[] public readings;
   
   uint public maxLevel;
   uint public minLevel;
   
   struct Reading {
       uint256 time;
       uint reading;
       bool normal;
   }
   
   event LogAbnormalReading(uint256 time, uint reading);
   event LogConstructorInitiated(string description);
   event LogReading(uint256 time, uint reading, bool normal);
   event LogNewProvableQuery(string description);
   
   constructor() public {
       maxLevel = 80;
       minLevel = 20;
       emit LogConstructorInitiated("Constructor was initiated. Water level max=80, min=20");
   }

   function __callback(bytes32 myid, string result) public {
       if (msg.sender != provable_cbAddress()) revert();
       uint256 time = now;
       uint reading = Integers.parseInt(result);
       bool normal = __checkReading(time, reading);
       readings.push(Reading(time, reading, normal));
       emit LogReading(time, reading, normal);
       startReading();
   }
   
   function startReading() public payable {
       if (provable_getPrice("URL") > this.balance) {
           emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
       } else {
           provable_query(10, "URL", "https://t22ujsj755.execute-api.us-east-1.amazonaws.com/default/smartmeter");
       }
   }
   
   function __checkReading(uint256 time, uint reading) private returns(bool) {
       if(reading > maxLevel || reading < minLevel) {
           emit LogAbnormalReading(time, reading);
           return false;
       }
       return true;
   }
}