import React, {useState, useEffect, useRef} from "react";
import "./styles.css";
import SpotifyWebApi from "spotify-web-api-js";
import {gsap} from "gsap";


export default function Submission(props){
  let sectionEl = useRef()
  let selector = gsap.utils.selector(sectionEl)
  let tl = useRef(null)

  const buttonHoverIn = ({}) => {
    gsap.to(selector(".button-bg"), {width: "120%", duration: 0.6, ease: "power3.out"})
    gsap.to(selector(".button"), {color: "#100F14", duration: 0.6, ease: "power3.out"})
  }

  const buttonHoverOut = ({}) => {
    gsap.to(selector(".button-bg"), {width: "0%", duration: 0.6, ease: "power3.out"})
    gsap.to(selector(".button"), {color: "#f1f1f1", duration: 0.6, ease: "power3.out"})
  }

  //Get album ID from Spotify link
  let albumId = props.url.substring(props.url.indexOf("/", 29))
  albumId = albumId.substring(1, albumId.indexOf("?"))

  let [albumData, setAlbumData] = useState({});

  var spotifyApi = new SpotifyWebApi();
  
  spotifyApi.setAccessToken(props.token.access_token);


  useEffect( () => {
    async function getSpotifyData(){
      let spotifyData = await spotifyApi.getAlbum(albumId)
      setAlbumData ({artist: spotifyData.artists[0].name, album: spotifyData.name, image: spotifyData.images[0].url})
    }

    getSpotifyData();

  }, [])

  return(
            <div className="submission" ref={sectionEl}>
              <div className="submission-info">
                  <div className="submission-title">Submitted by</div>
                  <div className="submission-address">{props.address}</div>
              </div>
              <div className="submission-info">
                <div className="submission-title">Album</div>
                <div>{albumData.album}</div>
              </div>
              <div className="submission-info">
                <div className="submission-title">Artist</div>
                <div>{albumData.artist}</div>
              </div>
              <div className="album-art">
                  <img src={albumData.image}/>
              </div>
              <div className="album-link">
                <a className="button" href={props.url} target="_blank" rel="noopener noreferrer" onMouseEnter={buttonHoverIn} onMouseLeave={buttonHoverOut}>
                  <div className="button-bg"></div>
                  <span>Listen on Spotify</span>
                </a>
              </div>

              <div className="submission-time">
                {props.timestamp}
              </div>
            </div>
  )
}