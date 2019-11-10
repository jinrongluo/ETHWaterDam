pragma solidity ^0.4.22;
import "./provableAPI.sol";

contract ReadingCollector is usingProvable {

   string[] public readings;
   event LogConstructorInitiated(string nextStep);
   event LogPriceUpdated(string price);
   event LogNewProvableQuery(string description);

   constructor() public payable {
       emit LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Provable Query.");
   }

   function __callback(bytes32 myid, string result) public {
       if (msg.sender != provable_cbAddress()) revert();
       readings.push(result);
       emit LogPriceUpdated(result);
       
       updatePrice();
   }
   
   function updatePrice() public payable {
       if (provable_getPrice("URL") > this.balance) {
           emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
       } else {
           emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
           provable_query(10, "URL", "https://t22ujsj755.execute-api.us-east-1.amazonaws.com/default/smartmeter");
       }
  
   }
}