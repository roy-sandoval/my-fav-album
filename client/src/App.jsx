import React, {useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import Header from "./components/Header"
import Hero from "./components/Hero"
import Submission from "./components/Submission"
import Footer from "./components/Footer"
import './App.css';
import { getContractAddress } from "ethers/lib/utils";
import {abi} from "./utils/FavAlbum.json";
import { useModal } from 'react-hooks-use-modal';
import axios from 'axios'

export default function App() {

  const [token, setToken] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8000/").then( function(response) {
      setToken(response.data)
    })
  }, [])

  const [currentAccount, setCurrentAccount] = useState("")
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState("")
  const [formData, setFormData] = React.useState({
    url: "",
  })
  const [isActive, setIsActive] = useState(false);

  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: true,
  });

  function handleChange(event) {
    const {name, value} = event.target
    
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
    
    if (value !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }

  const contractAddress= "0x516C24693b51901Dae553Ac000A937D2b396AC0A"
  const contractABI = abi

  const checkIfWalletIsConnected = async () => {
    //First make sure we have access to window.ethereum
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("Make sure you have metamask!")
      }

      //Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({method: "eth_accounts"})

      if(accounts.length !== 0){
        const account = accounts[0];
        setCurrentAccount(account)
              getAllSubmissions();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Connect your wallet method
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if(!ethereum){
        alert("Get MetaMask!");
        return
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"})

      setCurrentAccount(accounts[0])
    } catch (error){
      console.log(error)
    }
  }

  //Get all submissions from contract
  const getAllSubmissions = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const favAlbumContract = new ethers.Contract(contractAddress, contractABI, signer);

        //Call the getAllSubmissions method from the smart contract
        const submissions = await favAlbumContract.getAllSubmissions();

        //Get only the items you need
        const submissionsCleaned = submissions.map(submission => {
          return {
            address: submission.user,
            timestamp: new Date(submission.timestamp * 1000),
            url: submission.url
          };
        });

        //Store our data in React State
        setAllSubmissions(submissionsCleaned);

      } else{
        console.log("Ethereum object doesn't exist!")
      }
    } catch(error){
      console.log(error)
    }
  }

  //Listen in for emitter events
  useEffect(() => {
    let favAlbumContract;

    const onNewSubmission = (from, timestamp, url) => {
      setAllSubmissions(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp*1000),
          url: url,
        },
      ]);
    };
  
    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      favAlbumContract = new ethers.Contract(contractAddress, contractABI, signer);
      favAlbumContract.on("NewSubmission", onNewSubmission);
    }

    return () => {
      if (favAlbumContract) {
        favAlbumContract.off("NewSubmission", onNewSubmission);
      }
    };

  }, []);

  //Submit an album
  const favAlbum = async (event) => {
    if(formData.url.includes("album")){
      event.preventDefault()
      
      try{
        const {ethereum} = window;

        if(ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner();
          const favAlbumContract = new ethers.Contract(contractAddress, contractABI, signer)

          let count = await favAlbumContract.getTotalSubmissions();
          setTotalSubmissions(count.toNumber())

          //Submit an album
          const albumTxn = await favAlbumContract.submitAlbum(formData.url, {gasLimit: 300000})
          setFormData("")
          document.getElementById("submit-btn-text").textContent = "Mining...";

          await albumTxn.wait();
          document.getElementById("submit-btn-text").textContent = "Done, thanks for sharing!";
          setTimeout(()=>{
            document.getElementById("submit-btn-text").textContent = "Submit my favorite album";
          }, 2000)

          count = await favAlbumContract.getTotalSubmissions()
          setTotalSubmissions(count.toNumber())

        } else {
          console.log("Ethereum object doesn't exist")
        }
      } catch (error){
        console.log(error)
      }
    } else {
      alert("Make sure you're submitting an album link from Spotify")
    }
  }

  const getSubmissions  = async () => {
    try{
      //Making sure we have access to ethereum
      const {ethereum} = window;
      if(ethereum){
        //We use this to talk to ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        //I'm not sure why we need this
        const signer = provider.getSigner()
        //Grab the contract
        const favAlbumContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await favAlbumContract.getTotalSubmissions()
        setTotalSubmissions(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error){
      console.log(error)
    }
  }

  //Run the function when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
    getSubmissions();
  },[totalSubmissions])


  return (
    <div className="mainContainer">
      <Header totalAlbums={totalSubmissions}/>
      <Hero connected={currentAccount} connectWallet={connectWallet} handleSubmit={favAlbum} handleChange={handleChange} album={formData.url} isActive={isActive ? "active" : ""}/>
      <Modal>
        <div className="modal">
          <h2>Thanks for sharing your favorite album!</h2>
          <p>Take a look around and see if you see an album that grabs your attention, give it a listen, try something new!</p>
          <div className="button white">
            <div className="button-bg"></div>
            <span>Take a look around</span>
          </div>
        </div>
      </Modal>
      <section className="submissions">
        <div className="container">
          <h2>Recent submissions</h2>
          {allSubmissions.map((submission, index) => {
            return(
              <Submission key={index} address={submission.address} album="album" artist="artist" timestamp={submission.timestamp.toString()} token={token} url={submission.url}/>
            )
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}
