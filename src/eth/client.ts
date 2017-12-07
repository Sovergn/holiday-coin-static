
import config from "../config";

const Web3 = require("web3");

const PROD = process.env.NODE_ENV === "production";

export default function get () {
  if (config.get("web3:url")) {
    return new Web3(new Web3.providers.HttpProvider(config.get("web3:url")));
  } else {
    if (PROD) {
      return new Web3();
    } else {
      return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  }
};
