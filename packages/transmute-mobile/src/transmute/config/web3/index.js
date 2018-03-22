const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const transmuteConfig = require('../transmute.json');
const providerUrl = transmuteConfig.dev.web3.providerUrl;

export const getWeb3 = async () => {
  let web3js;
  return new Promise(async (resolve, reject) => {
    const engine = new ProviderEngine();

    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: providerUrl
      })
    );

    engine.start();

    web3js = new Web3(engine);

    try {
      await web3js.eth.getAccounts();
      resolve(web3js);
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getWeb3
};
