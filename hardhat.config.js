require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: '.env.local' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // This is the network configuration for your chosen network (e.g., Polygon)
    deploy_network: {
      url: process.env.DEPLOY_NETWORK_URL || "",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    },
  },
};
