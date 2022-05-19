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
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      window.alert("Please Install MetaMask to Mint");
      window.location.href = "https://metamask.io/";
    }
  }, []);

  useEffect(() => {
    if (account === undefined) return;
    mint();
  }, [library]);

  const connect = async () => {
    await activate(MetaMask);
  };

  const mint = async () => {
    const provider = await library;
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACTADDRESS, CONTRACT_ABI, signer);
    const metadata = ethers.utils.formatBytes32String("");

    try {
      if (chainId !== 80001) {
        window.alert("Switch to Mumbai Testnet");
        return;
      }
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

  const click = async () => {
    connect();
  };

  return (
    <div className="App">
      <button className="btn" onClick={() => click()}>
        <span>MINT</span>
      </button>
    </div>
  );
}

export default App;
