import * as firebase from 'firebase'

import { Link, Redirect } from 'react-router-dom'
import React, { Component } from 'react'

class CommentPage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      status: "waiting",
      id: props.match.params.id,
      type: props.match.params.type,
      comment: "",
      hashtags: []
    }
    this.commentChange = this.commentChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSkip = this.handleSkip.bind(this)
  }

  commentChange(e) {
    var comment = e.target.value
    var hashtags = comment.match(/#\w+/g)
    if (hashtags === null) {
      hashtags = []
    }
    this.setState({
      comment: comment,
      hashtags: hashtags
    })
  }

  handleSubmit() {
    var thisObj = this
    thisObj.setState({status: "uploading"})
    if (thisObj.state.comment !== "" && thisObj.state.comment.length > 15) {
      var comment = {
        comment: thisObj.state.comment
      }
      var ref = firebase.database().ref("memes/" + thisObj.state.id + "/" + thisObj.state.type + "comment").push()
      ref.set(comment)
      .then(function () {
        var memeRef = firebase.database().ref("memes/" + thisObj.state.id)
        memeRef.once("value")
        .then(function (snapshot) {
          var val = snapshot.val()
          var hashtags = val.hashtags
          if (hashtags === undefined || hashtags === null) {
            hashtags = {}
          }
          var newhashtags = thisObj.state.hashtags
          for (var i = 0; i < newhashtags.length; i++) {
            var tag = newhashtags[i].replace("#", "")
            if (tag in hashtags) {
              hashtags[tag] = hashtags[tag] + 1
            } else {
              hashtags[tag] = 1
            }
          }
          var update = {}
          update[thisObj.state.type] = val[thisObj.state.type] + 1
          update["hashtags"] = hashtags
          memeRef.update(update)
          .then(function () {
            thisObj.setState({status: "done"})
          })
          .catch(function (e) {
            thisObj.setState({status: "error"})
          })
        })
      })
      .catch(function (e) {
        thisObj.setState({status: "error"})
      })
    } else {
      thisObj.setState({status: "error"})
    }
  }

  handleSkip() {
    var thisObj = this
    thisObj.setState({status: "uploading"})
    var memeRef = firebase.database().ref("memes/" + thisObj.state.id)
    memeRef.once("value")
    .then(function (snapshot) {
      var val = snapshot.val()
      var update = {}
      update[thisObj.state.type] = val[thisObj.state.type] + 1
      memeRef.update(update)
      .then(function () {
        thisObj.setState({status: "done"})
      })
      .catch(function (e) {
        thisObj.setState({status: "error"})
      })
    })
  }

  render(){
    if (this.state.status === "uploading") {
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

    if (this.state.status === "done") {
      var desturl = "/statistics/" + this.state.type + "/" + this.state.id
      return(
        <Redirect to={desturl} />
      )
    }

    return(
      <div className="container comment-page">
        <div className="comment-page-secondary-container">
          <h1 className="comment-title">Share your ideas, and hashtag topics</h1>
          <div>
            {this.state.hashtags.map((tag, idx) => (
              <span key={idx} className="badge badge-pill badge-success comment-hashtag">{tag}</span>
            ))}
          </div>
          <div>
            <textarea className="comment-textarea" rows="5" type="text" onChange={this.commentChange} placeholder="Your awesome ideas ..." />
          </div>
          {this.state.status === "error" ? (
            <div>
              <p className="comment-error">Your comment should be more than 15 characters long</p>
            </div>
          ) : (null)}
          <div>
            <button type="button" className="btn btn-success comment-btn" onClick={this.handleSubmit}>
              <i className="fa fa-paper-plane-o" aria-hidden="true"></i> Submit
            </button>
          </div>
          <div>
            <button type="button" className="btn btn-warning comment-btn" onClick={this.handleSkip}>
              <i className="fa fa-play" aria-hidden="true"></i> Skip
            </button>
          </div>
          <div className="comment-back-container">
            <button type="button" className="btn btn-danger comment-btn">
              <Link className="comment-back" to="/meme">
                <i className="fa fa-reply" aria-hidden="true"></i> Go back to memes
              </Link>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentPage;
