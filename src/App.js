import './App.css';
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useState } from 'react';
import contractABI from "./contractABI.json"

const contractAddress = "0xAE1d14e3348438cD73d8FAD531a5AADb9177Cf0D";

function App() {
  const [nftCount,setNftCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async() => {
    const detectProvider = await detectEthereumProvider()
     if(detectProvider){
      const ethersProvider = new ethers.providers.Web3Provider(detectProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI,signer);
      const account = await ethersProvider.send("eth_requestAccounts", []);

      setProvider(ethersProvider);
      setSigner(signer);
      setContract(contract);
      setAccount(account);
     }
     else{
      console.error("Install Metamask")
     }
  };

  const handleChange = (event) => {
    setNftCount(event.target.value);
  }

  const mintNFT = async() => {
    if(contract){
      try{
        const tx = await contract.mint(nftCount,{
          value: ethers.utils.parseEther('0.001'),
          gasLimit: ethers.utils.hexlify(100000) 
        });
        await tx.wait();
        console.log("minting successful");
      } catch(error){
        console.error("Minting failed", error);
      }
    } else{
      console.error("contract is not initialized");
    }
  };

  const withdrawFunds = async() => {
    if(contract && signer){
      console.log(1);
      try{
        const tx = await contract.withdraw();
        tx.wait();
      } catch(error) {
        console.error("withdrawal failed", error);
      }
    } else {
      console.error("contract is not initialized");
    }
  };

  return (
    <div className="App">
      <h1 className='header'>NFT dapp</h1>
      <button onClick={connectWallet} className='wallet'>connect wallet</button>
      <div className='mint_section'>
        <input type="number" placeholder="enter no of NFT" onChange={handleChange} />
        <button onClick={mintNFT} className='mint'>mint</button>
      </div>
      <button onClick={withdrawFunds} className='withdraw'>withdraw</button>
    </div>
  );
}

export default App;
