import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./abi/abi.json";
import vrf_abi from "./abi/vrf_abi.json";

const App = () => {
  // Hooks - state variables and function to set them
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMessage] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  // Lottery Contract address and ABI - previously it was Waving Contract
  const contractAddress = "0xa2E3162f83Ce5063B84e50EA2Bb8D5BaD2f4eff2";
  const contractABI = abi.abi;

  // Chainlink VRF Contract
  const vrfAddress = "0xBE94f3c73A663b2adA6Cb6be978fdF15Ce06712E";
  const vrfABI = vrf_abi.abi;
  
  
  const checkIfWalletIsConnected = async () => {
    /**
    This function checks if wallet is connected.
    */
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // Check if Metmask wallet is connected
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        // Saving in React State
        setCurrentAccount(account);
        localStorage.setItem('CurrentUser', JSON.stringify(account));
        console.log(localStorage.getItem('CurrentUser'));
        // Get all waves
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    /**
    This function connects wallet.
    */
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // Connecting Metamask wallet to the page with method eth_requestAccounts 
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    /**
    This function let you submit somthing to the page.
    */
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress, contractABI, signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        // Execute wave from smart contract
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exists!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    /**
    This function returns all submited values.
    */
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress, contractABI, signer
        );
        let waves = await wavePortalContract.getAllWaves();
        console.log(waves);

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
        console.log(allWaves);
        
        // Section below updates state of allWaves when NewWave event is emmited
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);
          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const payRandomUser = async () => {
    /**
    This function let owner pay random user some ETH.
    */
    try {
      if (ethereum) {
        // Wave Contract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress, contractABI, signer
        );
        // VRF
        const vrfContract = new ethers.Contract(
          vrfAddress, vrfABI, signer
        );

        let count = await wavePortalContract.getTotalWaves();
        
        let waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        
        // Create new random values
        await (await vrfContract.requestRandomWords({gasLimit: 100000})).wait();
        
        let randomWord = Number(await vrfContract.s_randomWords(0));
        let chosenAccountNumber = randomWord % count;
        let chosenAccount = wavesCleaned[chosenAccountNumber].address;
        await (await wavePortalContract.payRandomAddress(
          chosenAccount, {gasLimit: 100000}
        )).wait();
        console.log("Random word(0):", randomWord);
        console.log("Chosen Account Number:", chosenAccountNumber);
        console.log("Chosen Account: ", chosenAccount);
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        💸 LOTTERY 💸
        </div>

        <div className="bio">
          Hi! In this lottery you can win some ETH for being nice. Connect your Ethereum wallet and write something!
        </div>

          <input onChange={event => setMessage(event.target.value)} />
        
        <button className="waveButton" onClick={wave}>
          Send
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <button className="waveButton" onClick={payRandomUser}>
          Pay Random User
        </button>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
          
      </div>
    </div>
  );
}

export default App