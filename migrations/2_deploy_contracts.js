var ReadingCollector = artifacts.require("./ReadingCollector.sol");
var Integers = artifacts.require("./Integers.sol");

async function doDeploy(deployer, network) {
  await deployer.deploy(Integers);
  await deployer.link(Integers, ReadingCollector);
  await deployer.deploy(ReadingCollector);

}

module.exports = (deployer, network) => {
  deployer.then(async () => {
      await doDeploy(deployer, network);
  });
};
