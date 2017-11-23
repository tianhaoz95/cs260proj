import * as firebase from 'firebase'

import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import _ from 'lodash'
import Chart from 'chart.js'

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

const backgroundColors = {
  "dislike": "#dc3545",
  "like": "#28a745",
  "funny": "#ffc107"
}

const textColors = {
  "dislike": "white",
  "like": "white",
  "funny": "black"
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
      show: [],
      showtype: props.match.params.type,
      url: ""
    }
    this.chartRef = null
    this.chartRendered = false
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
          status: "ready",
          url: val.url
        })
      }
    })
  }

  componentDidUpdate() {
    if (this.chartRef !== null && this.chartRendered === false) {
      var thisObj = this
      var myDoughnutChart = new Chart(this.chartRef, {
        type: 'doughnut',
        data: {
          datasets: [{
            data:[thisObj.state.like, thisObj.state.funny, thisObj.state.dislike],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"]
          }],
          labels: ["People like it", "People think it's funny", "People dislike it"]
        },
        options: {
          legend: {
            display: false
          }
        }
      })
      thisObj.chartRendered = true
    }
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
      show: newrand,
      showtype: "like"
    })
  }

  handleSwitchDislike() {
    var comments = this.state.dislikecomments
    var newrand = randomnize(comments, 5)
    this.setState({
      comments: comments,
      show: newrand,
      showtype: "dislike"
    })
  }

  handleSwitchFunny() {
    var comments = this.state.funnycomments
    var newrand = randomnize(comments, 5)
    this.setState({
      comments: comments,
      show: newrand,
      showtype: "funny"
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
    var commentstyle = {
      backgroundColor: backgroundColors[this.state.showtype], 
      color: textColors[this.state.showtype]
    }

    return(
      <div className="container statistics-page">
        <h1 className="statistics-title">What do other people think? Click to see their comments</h1>
        <div className="row statistics-viz-group">
          <div className="col-4">
            <img className="statistics-img" alt="meme" src={this.state.url} />
          </div>
          <div className="col-4">
            <div className="statistics-chart-container">
              <canvas ref={(ref) => this.chartRef = ref} className="statistics-chart"></canvas>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <button type="button" className="btn btn-success statistics-btn" onClick={this.handleSwitchLike}>
                <i className="fa fa-thumbs-o-up" aria-hidden="true"></i> Like: {likeRatio.toString()}%
              </button>
            </div>
            <div className="row">
              <button type="button" className="btn btn-warning statistics-btn" onClick={this.handleSwitchFunny}>
                <i className="fa fa-hand-spock-o" aria-hidden="true"></i> Funny: {funnyRatio.toString()}%
              </button>
            </div>
            <div className="row">
              <button type="button" className="btn btn-danger statistics-btn" onClick={this.handleSwitchDislike}>
                <i className="fa fa-thumbs-o-down" aria-hidden="true"></i> Dislike: {dislikeRatio.toString()}%
              </button>
            </div>
          </div>
        </div>
        <div className="list-group statistics-comment-group">
          {this.state.show.length === 0 ? (
            <div className="list-group-item">
              Sorry no comments now
            </div>
          ) : (null)}
          {this.state.show.map((item, index) => (
            <div className="list-group-item" style={commentstyle} key={index}>
              {item.comment}
            </div>
          ))}
        </div>
        {this.state.show.length === 5 ? (
          <button type="button" className="btn btn-light statistics-btn-nav" onClick={this.handleRandomize}>
            <i className="fa fa-random" aria-hidden="true"></i> Some other opinions
          </button>
        ) : (null)}
        <button type="button" className="btn btn-light statistics-btn-nav">
          <Link to="/meme" className="statistics-link">
            Go back for more memes
          </Link>
        </button>
      </div>
    );
  }
}

export default StatisticPage;
