import React, {useRef, useEffect} from "react"
import {gsap} from 'gsap'
import "./styles.css"

export default function Header(props){
  return(
    <section className="header">
      <div className="container">
        <div className="flex-split">
          <span className="header-text">My favorite album is...</span>
          <span className="header-text">{props.totalAlbums} submissions</span>
        </div>
      </div>
    </section>
  )
}