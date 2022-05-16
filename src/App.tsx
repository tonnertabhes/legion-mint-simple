import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetaMask } from "./helpers/connectors";
import { CONTRACTADDRESS } from "./constants/address";
import { CONTRACT_ABI } from "./constants/contractABI";
import "./App.css";

declare const window: any;

function App() {
  const { activate, chainId, account, library } = useWeb3React();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.ethereum) {
      window.alert("Please Install MetaMask to Mint");
      window.location.href = "https://metamask.io/";
    }
    if (!account) {
      try {
        activate(MetaMask);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (chainId !== 80001 && chainId !== undefined) {
      window.alert("Please connect to Mumbai");
    }
  }, [account, chainId]);

  const mint = async () => {
    const provider = await library;
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACTADDRESS, CONTRACT_ABI, signer);
    const metadata = ethers.utils.formatBytes32String("");

    try {
      await contract.mint(11, 1, [metadata], [metadata], metadata);
      setTimeout(() => {
        var text =
          "Queen who sees the battlefield entire, who whispers in each general's ear, I call to you.  Queen @JennieTheDivine, Bringer of Bliss, hear my prayers.  Have mercy on me in your wisdom and righteousness.%0a%0aI am Legion in @TheForeverWar%0a%0a%20%23annihilation";
        var url = "https://twitter.com/intent/tweet?&text=" + text;
        window.location.href = url;
      }, 2000);
    } catch (err: any) {
      if (err.code === -32603) {
        setError("ERROR: 1 NFT Per Wallet");
        return;
      }
      if (err.code === 4001) {
        setError("ERROR: User denied transaction");
        return;
      }
      if (err.error.code === -32603) {
        setError(`ERROR: 1 NFT Per Wallet`);
      }
      console.log(err);
    }
  };

  const connectAndMint = async () => {
    if (account) {
      try {
        mint();
      } catch (err) {
        console.log(err);
      }
      return;
    }
    window.alert("Connect with MetaMask!");
    await activate(MetaMask);
  };

  return (
    <div className="App">
      {account === undefined ? (
        <h3 className="text">Connecting with MetaMask...</h3>
      ) : (
        <h3 className="text">Connected!</h3>
      )}
      {chainId !== 80001 ? (
        <h3 className="text">Switch to MATIC MUMBAI Network</h3>
      ) : (
        ""
      )}
      {error === undefined ? "" : <h3 className="text">{error}</h3>}
      <button onClick={() => connectAndMint()}>Mint</button>
    </div>
  );
}

export default App;
