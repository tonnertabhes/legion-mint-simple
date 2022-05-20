import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  MetaMask,
  WalletConnect,
  resetWalletConnectConnector,
} from "./helpers/connectors";
import { CONTRACTADDRESS } from "./constants/address";
import { CONTRACT_ABI } from "./constants/contractABI";
import "./App.css";

declare const window: any;

function App() {
  const { activate, chainId, account, library } = useWeb3React();
  const [mobile, setMobile] = useState(true);

  const handleResize = () => {
    if (window.innerWidth < 1000) {
      setMobile(true);
      return;
    }
    setMobile(false);
  };

  window.addEventListener("resize", handleResize);

  useEffect(() => {
    if (window.innerWidth > 1000) {
      setMobile(false);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum && mobile === false) {
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
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACTADDRESS, CONTRACT_ABI, signer);
    const metadata = ethers.utils.formatBytes32String("");

    try {
      if (chainId !== 1) {
        window.alert("Switch to Ethereum Mainnet");
        return;
      }
      await contract.mint(1, 1, [metadata], [metadata], metadata);
      setTimeout(() => {
        var text =
          "Queen who sees the battlefield entire, who whispers in each general's ear, I call to you.  Queen @JennieTheDivine, Bringer of Bliss, hear my prayers.  Have mercy on me in your wisdom and righteousness.%0a%0aI am Legion in @TheForeverWar";
        var url = "https://twitter.com/intent/tweet?&text=" + text;
        window.location.href = url;
      }, 2000);
    } catch (err: any) {
      if (err.error.code === -32603) {
        window.alert("Max NFT Allowance: 1");
        return;
      }
      console.log(err);
    }
  };

  const click = async () => {
    if (mobile === true) {
      resetWalletConnectConnector();
      await activate(WalletConnect);
      return;
    }
    await connect();
    try {
      await mint();
    } catch (err: any) {
      if (
        err ===
        "TypeError: Cannot read properties of undefined (reading 'getSigner')"
      )
        return;
    }
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
