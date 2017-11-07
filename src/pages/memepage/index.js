import * as firebase from 'firebase'

import { Link, Redirect } from 'react-router-dom'
import React, { Component } from 'react'

import _ from 'lodash'
import floating from 'floating.js'

class MemePage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      status: "loading",
      url: null,
      id: null,
      type: null,
      shoutout: "",
      hashtags: []
    }
    this.inputRef = null
    this.shoutoutRef = null
    this.randomnize = this.randomnize.bind(this)
    this.like = this.like.bind(this)
    this.dislike = this.dislike.bind(this)
    this.funny = this.funny.bind(this)
    this.handleShoutout = this.handleShoutout.bind(this)
    this.handleShoutoutSend = this.handleShoutoutSend.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
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
          var hashtags = []
          if (meme.hashtags !== undefined && meme.hashtags !== null) {
            for (var key in meme.hashtags) {
              hashtags.push("#" + key)
            }
          }
          thisObj.setState({
            url: meme.url,
            id: id,
            status: "done",
            hashtags: hashtags
          })
          thisObj.shoutoutRef = firebase.database().ref("shoutout/" + id)
          thisObj.shoutoutRef.on("child_added", function (shoutoutSnap) {
            var shoutout = shoutoutSnap.val()
            if (shoutout !== null) {
              floating({
                content: shoutout.content,
                number: 1,
                repeat: 1,
                duration: 15
              })
            }
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
          var hashtags = []
          if (meme.hashtags !== undefined && meme.hashtags !== null) {
            for (var key in meme.hashtags) {
              hashtags.push("#" + key)
            }
          }
          thisObj.setState({
            url: meme.url,
            id: id,
            hashtags: hashtags,
            status: "done"
          })
        })
        thisObj.shoutoutRef.off()
        thisObj.shoutoutRef = firebase.database().ref("shoutout/" + id)
        thisObj.shoutoutRef.on("child_added", function (shoutoutSnap) {
          var shoutout = shoutoutSnap.val()
          if (shoutout !== null) {
            floating({
              content: shoutout.content,
              number: 1,
              repeat: 1,
              duration: 15
            })
          }
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

  handleShoutout(e) {
    this.setState({shoutout: e.target.value})
  }

  handleShoutoutSend() {
    var thisObj = this
    var htmlMsg = "<p style=\"color:white\">" + thisObj.state.shoutout + "</p>"
    var update = {content: htmlMsg}
    var shoutoutRef = firebase.database().ref("shoutout/" + thisObj.state.id).push()
    var key = shoutoutRef.key
    thisObj.inputRef.value = ""
    thisObj.setState({shoutout: ""})
    shoutoutRef.set(update)
    .then(function () {
      var rmRef = firebase.database().ref("shoutout/" + thisObj.state.id + "/" + key)
      setTimeout(function () {
        rmRef.remove()
        .then(function () {
          console.log("shout out removed");
        })
        .catch(function (e) {
          console.log(e);
        })
      }, 5000);
    })
    .catch(function (e) {
      console.log(e)
    })
  }

  handleEnter(e) {
    if(e.key === 'Enter') {
        this.handleShoutoutSend()
    }
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
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
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
            <div>
              {this.state.hashtags.map((tag, idx) => (
                <span key={idx} className="badge badge-pill badge-success meme-page-hashtag">{tag}</span>
              ))}
            </div>
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
            <div className="input-group meme-input">
              <input type="text" className="form-control" placeholder="Shout out your idea" aria-label="Shout out your idea" onChange={this.handleShoutout} ref={(ref) => {this.inputRef = ref}} onKeyDown={this.handleEnter}/>
              <span className="input-group-btn">
                <button className="btn btn-success" type="button" onClick={this.handleShoutoutSend}>Go!</button>
              </span>
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
