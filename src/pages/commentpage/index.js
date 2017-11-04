import * as firebase from 'firebase'

import React, { Component } from 'react'

import { Redirect } from 'react-router-dom'

class CommentPage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      status: "waiting",
      id: props.match.params.id,
      type: props.match.params.type,
      comment: ""
    }
    this.commentChange = this.commentChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSkip = this.handleSkip.bind(this)
  }

  commentChange(e) {
    this.setState({comment: e.target.value})
  }

  handleSubmit() {
    var thisObj = this
    thisObj.setState({status: "uploading"})
    if (thisObj.state.comment !== "") {
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
        <div> Uploading </div>
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
          Comment Page
          <div>
            <textarea className="comment-textarea" rows="5" type="text" onChange={this.commentChange} />
          </div>
          {this.state.status === "error" ? (
            <div>
              Something went wrong
            </div>
          ) : (null)}
          <div>
            <button type="button" className="btn btn-light comment-btn" onClick={this.handleSubmit}> Submit </button>
          </div>
          <div>
            <button type="button" className="btn btn-light comment-btn" onClick={this.handleSkip}> Skip </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentPage;
