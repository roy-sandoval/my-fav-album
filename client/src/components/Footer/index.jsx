import React from "react"
import "./styles.css"

export default function Header(props){
  return(
    <section className="footer">
      <div className="container">
        <div className="flex-split">
          <span className="footer-text">Made for fun by Roy Sandoval</span>
          <span className="footer-text">Built with Buildspace</span>
        </div>
      </div>
    </section>
  )
}