import React, { Component } from 'react'

import { Link } from 'react-router-dom'

class Homepage extends Component {
  constructor(props){
  	super(props)
  	this.state = {}
  }

  render(){
    return(
      <div className="container home-page">
        <Link className="home-link" to="/meme" >
          Welcome! Click me to get started!
        </Link>
      </div>
    )
  }
}

export default Homepage;
