import * as firebase from 'firebase'

import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import _ from 'lodash'

function randomnize(arr, n) {
  if (n >= arr.length) {
    return arr
  } else {
    var randarr = _.shuffle(arr)
    var res = []
    for (var i = 0; i < n; i++) {
      res.push(randarr[i])
    }
    return res
  }
}

class StatisticPage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      status: "waiting",
      id: props.match.params.id,
      type: props.match.params.type,
      like: 0,
      dislike: 0,
      funny: 0,
      comments: [],
      show: []
    }
    this.handleRandomize = this.handleRandomize.bind(this)
    this.handleSwitchLike = this.handleSwitchLike.bind(this)
    this.handleSwitchDislike = this.handleSwitchDislike.bind(this)
    this.handleSwitchFunny = this.handleSwitchFunny.bind(this)
  }

  componentDidMount() {
    var thisObj = this
    thisObj.setState({status: "loading"})
    var ref = firebase.database().ref("memes/" + thisObj.state.id)
    ref.once("value")
    .then(function (snapshot) {
      var val = snapshot.val()
      if (val === null) {
        thisObj.setState({status: "error"})
      } else {
        var commentname = thisObj.state.type + "comment"
        var comments = _.toArray(val[commentname])
        var randcomments = randomnize(comments, 5)
        thisObj.setState({
          like: Number(val.like),
          dislike: Number(val.dislike),
          funny: Number(val.funny),
          likecomments: _.toArray(val.likecomment),
          dislikecomments: _.toArray(val.dislikecomment),
          funnycomments: _.toArray(val.funnycomment),
          comments: comments,
          show: randcomments,
          status: "ready"
        })
      }
    })
  }

  handleRandomize() {
    var comments = this.state.comments
    var newrand = randomnize(comments, 5)
    this.setState({show: newrand})
  }

  handleSwitchLike() {
    var comments = this.state.likecomments
    var newrand = randomnize(comments, 5)
    this.setState({
      comments: comments,
      show: newrand
    })
  }

  handleSwitchDislike() {
    var comments = this.state.dislikecomments
    var newrand = randomnize(comments, 5)
    this.setState({
      comments: comments,
      show: newrand
    })
  }

  handleSwitchFunny() {
    var comments = this.state.funnycomments
    var newrand = randomnize(comments, 5)
    this.setState({
      comments: comments,
      show: newrand
    })
  }

  render(){
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

    if (this.state.status === "error") {
      return(
        <div>
          Something is wrong
        </div>
      )
    }

    var total = this.state.like + this.state.dislike + this.state.funny
    var likeRatio = Math.round(this.state.like / total * 100)
    var dislikeRatio = Math.round(this.state.dislike / total * 100)
    var funnyRatio = Math.round(this.state.funny / total * 100)

    return(
      <div className="container statistics-page">
        <h1 className="statistics-title">What do other people think?</h1>
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-light statistics-btn" onClick={this.handleSwitchLike}>
              Like: {likeRatio.toString()}% (click to see their comments)
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-light statistics-btn" onClick={this.handleSwitchDislike}>
              Dislike: {dislikeRatio.toString()}% (click to see their comments)
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-light statistics-btn" onClick={this.handleSwitchFunny}>
              Funny: {funnyRatio.toString()}% (click to see their comments)
            </button>
          </div>
        </div>
        <div className="list-group statistics-comment-group">
          {this.state.show.length === 0 ? (
            <div className="list-group-item">
              Sorry no comments now
            </div>
          ) : (null)}
          {this.state.show.map((item, index) => (
            <div className="list-group-item" key={index}>
              {item.comment}
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-light statistics-btn-nav" onClick={this.handleRandomize}> Some other opinions </button>
        <button type="button" className="btn btn-light statistics-btn-nav">
          <Link to="/meme">
            More memes
          </Link>
        </button>
      </div>
    );
  }
}

export default StatisticPage;
