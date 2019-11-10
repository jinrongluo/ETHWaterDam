var ReadingCollector = artifacts.require("./ReadingCollector.sol");

module.exports = function(deployer) {
  deployer.deploy(ReadingCollector);
};
