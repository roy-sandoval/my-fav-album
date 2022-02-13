import React, {useEffect, useRef, useState} from "react";
import {gsap} from 'gsap'
import "./styles.css"

export default function Hero(props){

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

  useEffect(() => {
    tl.current = gsap.timeline()
      .from(selector(".hero-heading"), {y: "100%", duration: 1, ease: "power3.out", stagger: 0.3})
      .from(selector("#hero-form"), {opacity: 0, duration: 1}, ">-0.4")
      .from(selector(".hero-description"), {opacity: 0, duration: 1}, ">-0.4")
  }, [])

  return(
    <section className="hero" ref={sectionEl}>
      <div className="container">
        <div className="hero-content-wrapper">
          <p className="hero-description">This is just a fun project I made while learning Solidity on buildspace✌️</p>
          <div className="spacer-1em"> </div>
          <div className="div-hide">
            <h1 className="hero-heading">Hi what’s your</h1>
          </div>
          <div className="div-hide">
            <h1 className="hero-heading">favorite album?</h1>
          </div>          
        </div>
        <form id="hero-form">
          <div className="form-field-wrapper">
            <label className={ props.isActive } htmlFor="link-input">
              Spotify Album Link </label>
              <input
                type="text" 
                className="form-input"
                id="link-input"
                name="url"
                onChange={props.handleChange}
                value={props.url}
              />
          </div>
          <div className="btn-wrapper">
            {!props.connected ? 
              <div className="button" onClick={props.connectWallet} onMouseEnter={buttonHoverIn} onMouseLeave={buttonHoverOut}>
                <div className="button-bg"> </div> 
                <span>Connect Wallet</span>
              </div> 
              : 
              <div className="button" onClick={props.handleSubmit} onMouseEnter={buttonHoverIn} onMouseLeave={buttonHoverOut}>
                <div className="button-bg"></div>
                <span id="submit-btn-text">Submit my favorite album</span>
              </div>
            }
          </div>
        </form>
      </div>
    </section>
  )
}