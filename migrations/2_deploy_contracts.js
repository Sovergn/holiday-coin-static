var JesusCoin = artifacts.require("./JesusCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(JesusCoin);
};
