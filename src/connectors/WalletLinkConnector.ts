import Moralis from "moralis";
import WalletLink from "walletlink";
import Web3 from "web3";

// @ts-ignore
class WalletLinkConnector extends Moralis?.AbstractWeb3Connector {
  // A name for the connector to reference it easy later on
  type = "WalletLink";
  account: string | null = null;
  chainId: string | null = null;
  provider: unknown = null;
  walletLink = new WalletLink({
    appName: "Alps Finance",
    appLogoUrl:
      "https://raw.githubusercontent.com/AlpsFinance/alpsfinance-brand-resources/39f1ff831b116d5786faea843ae51fdab5914643/logo/Alps-Logo-Square-1.svg",
    darkMode: false,
  });

  /**
   * A function to connect to the provider
   * This function should return an EIP1193 provider (which is the case with most wallets)
   * It should also return the account and chainId, if possible
   */
  async activate() {
    try {
      await this.deactivate();
    } catch (error) {
      // Do nothing
    }

    const ethereum = this.walletLink.makeWeb3Provider(
      process.env.NODE_ENV === "development"
        ? "https://rpc-mumbai.matic.today"
        : "https://rpc.ftm.tools/",
      1
    );

    // Store the EIP-1193 provider, account and chainId
    await ethereum.enable();
    const web3 = new Web3(ethereum);
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
    this.chainId = process.env.NODE_ENV === "development" ? "0x13881" : "0xfa"; // Should be in hex format
    this.provider = ethereum;

    // Call the subscribeToEvents from AbstractWeb3Connector to handle events like accountsChange and chainChange
    // @ts-ignore
    this.subscribeToEvents(this.provider);

    // Return the provider, account and chainId
    return {
      provider: this.provider,
      chainId: this.chainId,
      account: this.account,
    };
  }

  // Cleanup any references to torus
  async deactivate() {
    // Call the unsubscribeToEvents from AbstractWeb3Connector to handle events like accountsChange and chainChange
    // @ts-ignore
    this.unsubscribeToEvents(this.provider);

    this.walletLink.disconnect();

    this.account = null;
    this.chainId = null;
    this.provider = null;
  }
}

export default WalletLinkConnector;
