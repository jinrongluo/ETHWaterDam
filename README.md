## Inspiration

I am always thinking how to marry blockchain with IOT.  Ethereum blockchain is a decentralized network, and IOT is also dealing with disparate devices interconnecting with each other. I can find something they both in common. From Smart Home automation to Smart City solutions, blockchain technologies can play a very important role.

There are three benefits Ethereum gives to us: security, autonomy and resilience.  This is exactly the challenges people are facing when working in IOT. Out of a few Ethereum + IOT use cases, I need to select the one which is representative and can be accomplished within this weekend in Hackathan. 

I chose water level alarm system because, this system is considered as a mission critical system. It is a safety system, and it's operation impact the citizens' livings. This is good candidate to apply Ethereum. With the water level min/max rules built-in to smart contract, and scheduling method constructed right within smart contract. This makes the system extremely hard to be compromised. So I decided to build this solution in Hackathon.


## What it does

1. Once deployed and activated (by calling "startReading()" method from DApp), the smart contract in Ethereum is periodically collecting the data from water level sensor deployed to various locations in the water dam infrastructure.

2. In this prototype, Smart contract leverages Provoable API to invoke Amazon-lamda function to collect the sensor data. The Lamda function will return random integers between 0 to 100, which represents the water level readings.

3. The water level min/max rule are built-in to smart contract. Once the contract is deployed the water max level and min level are defined in the contract's constructor. This rule can not be altered unless the smart contract is redeployed, which makes the whole system be trusted.

4. After water level reading data is collected, smart contract will compare this data against the min/max rule. If the data is out of range, the data is flagged as "Abnormal", and "LogAbnormalReading" event is fired.

5. ETHWaterDam DApp subscribes to "LogAbnormalReading" event. Once it received "LogAbnormalReading" event, an alert is display in the home page.

6. ETHWaterDam DApp also subscribes to "LogReading" event, so that the current and historical reading data can be display in the home page.

## How I built it

There are three parts of this ETHWaterDam system: Sensor, Smart Contract and DApp.

1. Sensor. I built Amazon Lamda function to represent the water level readings. This function will generate a random integer ranging from 0 to 100. This function can be invoked through URL (HTTP GET API).

2.  I used Remix as IDE to built smart contract. Smart contract stores the water level min/max rule and the water level readings. I studies ProvableAPI documentation and use "provable_query" to invoke Amazon Lamda function to collect the water level readings. ProvableAPI provide recursive invocation feature, so I can schedule the smart contract to periodically collect the reading data.

3. For DApp, I use Visual Studio Code as the IDE and use Truffle as the DApp framework. To improve the UX of the app, I use React-bootstrap library. This is to make the DApp responsive and appealing.


## Challenges I ran into

I am fairly new to Ethereum technologies, and I learned a few development tools which help me getting up to speed. The mentors and sponsors gave me a great help when I got stuck. Online resources are also very helpful as well.

One of the challenges is to come up with a sound Ethereum use case. Although there are quite a few Blockchain use case in IOT domain, it is not easy to drill down to one use case which is fun to work on and can be accomplished with a short period of time (36 hours hackathon). And more importantly, Ethereum should play a very critical role in this use case. I believe Water Dam infrastructure requires a security, reliable and trusted system, citizen's safety is the top 1 priority for the government. So I believe Ethereum blockchain for Water Dam water level alarm system is a good solution. 
 
Another challenge is to deploy the smart contract to TestNet. I only tried to deploy contracts to local network (Ganache) and haven't tried with TestNet before. I found this site very helpful (https://kauri.io/collection/5b8e401ee727370001c942e3). After following the tutorials I finally deployed the smart contract to Ropsten TestNet.


## Accomplishments that I'm proud of

ETHWaterDam project is the starting point of my journey for building Blockchain / IOT solutions. It is also the pathway to building a larger Smart City solutions. With few hours of sleep, I am glad that I can build this prototype within such a short time!


## What I learned

I learn how to connect Ethereum blockchain with the physical world via Provable API (Oracles). This open up a new opportunities to use Ethereum in many other use case, such as IOT (Smart City, and Smart home automation).

Physical world is able to communicate the Ethereum blockchain and vice versa. 


## What's next for ETHWaterDam

1. Store Reading data to IPFS. Store the reading data off chain can improve the performance.
2. Have another agent to trigger Meter reading automatically, so that the water level data can continuously flow to the Ethereum blockchain. 
3. Support multiple water level sensors, and provide an aggregated view of the water level of the water dam.