import * as firebase from 'firebase'

import { Link, Redirect } from 'react-router-dom'
import React, { Component } from 'react'

import _ from 'lodash'

class MemePage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      status: "loading",
      url: null,
      id: null,
      type: null
    }
    this.randomnize = this.randomnize.bind(this)
    this.like = this.like.bind(this)
    this.dislike = this.dislike.bind(this)
    this.funny = this.funny.bind(this)
  }

  componentDidMount() {
    var thisObj = this
    var idRef = firebase.database().ref("id")
    idRef.once("value")
    .then(function (snapshot) {
      var val = snapshot.val()
      if (val !== null) {
        var arr = _.toArray(val)
        var idx = Math.floor(Math.random() * arr.length)
        var id = arr[idx].id
        var memeRef = firebase.database().ref("memes/" + id)
        memeRef.once("value")
        .then(function (memesnapshot) {
          var meme = memesnapshot.val()
          thisObj.setState({
            url: meme.url,
            id: id,
            status: "done"
          })
        })
      } else {
        thisObj.setState({status: "empty"})
      }
    })
  }

  randomnize() {
    var thisObj = this
    thisObj.setState({status: "loading"})
    var idRef = firebase.database().ref("id")
    idRef.once("value")
    .then(function (snapshot) {
      var val = snapshot.val()
      if (val !== null) {
        var arr = _.toArray(val)
        var idx = Math.floor(Math.random() * arr.length)
        var id = arr[idx].id
        var memeRef = firebase.database().ref("memes/" + id)
        memeRef.once("value")
        .then(function (memesnapshot) {
          var meme = memesnapshot.val()
          thisObj.setState({
            url: meme.url,
            id: id,
            status: "done"
          })
        })
      } else {
        thisObj.setState({status: "empty"})
      }
    })
  }

  like() {
    this.setState({status: "like"})
  }

  dislike() {
    this.setState({status: "dislike"})
  }

  funny() {
    this.setState({status: "funny"})
  }

  render(){
    if (this.state.status === "empty") {
      return(
        <div>
          <div>
            Empty
          </div>
          <div>
            <Link to="/contribute"> Contribute! </Link>
          </div>
        </div>
      )
    }
    if (this.state.status === "loading") {
      return(
        <div>
          <div class="progress">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{width: "100%"}}
              >
            </div>
          </div>
        </div>
      )
    }
    var dest = "unknown"
    if (this.state.status === "like") {
      dest = "/comment/like/" + this.state.id;
      return(
        <Redirect to={dest} />
      )
    }
    if (this.state.status === "dislike") {
      dest = "/comment/dislike/" + this.state.id;
      return(
        <Redirect to={dest} />
      )
    }
    if (this.state.status === "funny") {
      dest = "/comment/funny/" + this.state.id;
      return(
        <Redirect to={dest} />
      )
    }
    return(
      <div className="container meme-page">
        <div className="row">
          <div className="col meme-img-col">
            <img className="meme-img" alt="meme" src={this.state.url} />
          </div>
          <div className="col meme-btn-group">
            <div>
              <button type="button" className="btn btn-light meme-btn" onClick={this.like}> I like it! </button>
            </div>
            <div>
              <button type="button" className="btn btn-light meme-btn" onClick={this.funny}> It's funny! </button>
            </div>
            <div>
              <button type="button" className="btn btn-light meme-btn" onClick={this.dislike}> I don't like it! </button>
            </div>
            <div>
              <button type="button" className="btn btn-light meme-btn" onClick={this.randomnize}> Another one </button>
            </div>
            <div>
              <Link className="meme-contribute-link" to="/contribute" > Contribute! </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MemePage;
