import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'

import * as firebase from 'firebase'

import { Link, Redirect } from 'react-router-dom'
import React, { Component } from 'react'

import DropzoneComponent from 'react-dropzone-component'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

class ContributePage extends Component {
  constructor(props){
  	super(props)
  	this.state = {
      file: null,
      status: "waiting"
    }
    this.dropzone = null
    this.initCallback = this.initCallback.bind(this)
    this.addFile = this.addFile.bind(this)
    this.fileExceed = this.fileExceed.bind(this)
    this.upload = this.upload.bind(this)
    this.config = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: 'no-url'
    }
    this.handlers = {
      init: this.initCallback,
      addedfile: this.addFile,
      maxfilesexceeded: this.fileExceed
    }
    this.djsConfig = {
      addRemoveLinks: false,
      autoProcessQueue: false,
      maxFiles: 1
    }
  }

  initCallback(dropzone) {
    this.dropzone = dropzone
  }

  fileExceed(file) {
    console.log("file exceeded");
    this.dropzone.removeFile(file)
  }

  addFile(file) {
    this.setState({file: file})
  }

  upload() {
    var thisObj = this
    thisObj.setState({status: "uploading"})
    var ref = firebase.database().ref("memes")
    var key = ref.push().key
    var storageRef = firebase.storage().ref().child(key + ".jpg")
    storageRef.put(this.state.file)
    .then(function (snapshot) {
      var url = snapshot.downloadURL
      var meme = {
        url: url,
        id: key,
        like: 0,
        dislike: 0,
        funny: 0
      }
      var id = {
        id: key
      }
      var pushRef = firebase.database().ref("memes/" + key)
      pushRef.set(meme)
      .then(function () {
        var idRef = firebase.database().ref("id").push()
        idRef.set(id)
        .then(function () {
          thisObj.setState({status: "done"})
        })
        .catch(function (e) {
          thisObj.setState({status: "error"})
        })
      })
      .catch(function (e) {
        thisObj.setState({status: "error"})
      })
    })
    .catch(function (e) {
      thisObj.setState({status: "error"})
    })
  }

  render(){
    if (this.state.status === "done") {
      return(
        <Redirect to="/meme" />
      )
    }
    return(
      <div className="container contribute-page">
        <h1 className="contribute-title">We need you! Contribute some memes!</h1>
        <div className="contribute-dropbox">
          <DropzoneComponent
            config={this.config}
            eventHandlers={this.handlers}
            djsConfig={this.djsConfig} />
        </div>
        {this.state.status === "error" ? "error" : null}
        {this.state.status === "uploading" ? (
          <div>
            Uploading
          </div>
        ) : (
          <div>
            <button type="button" className="btn btn-light contribute-btn" onClick={this.upload}> Upload </button>
          </div>
        )}
        <div className="contribute-cancel-link-container">
          <Link className="contribute-cancel-link" to="/meme">
            Cancel and go back to memes
          </Link>
        </div>
      </div>
    )
  }
}

export default ContributePage;
