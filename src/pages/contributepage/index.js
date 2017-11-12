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
      iconFiletypes: ['.jpg', '.png'],
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
    if (thisObj.state.file === null || thisObj.state.file === undefined) {
      thisObj.setState({status: "error"})
      return
    }
    if (thisObj.state.file.height < 300) {
      thisObj.setState({status: "error"})
      return
    }
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
        <h1 className="contribute-title">We need you!</h1>
        <h4 className="contribute-subtitle">Contribute some memes and get your ideas across!</h4>
        <div className="contribute-dropbox">
          <DropzoneComponent
            config={this.config}
            eventHandlers={this.handlers}
            djsConfig={this.djsConfig} />
        </div>
        {this.state.status === "error" ? (
          <div>
            <p className="contribute-msg">
              File cannot be empty or less than 300 x 300
            </p>
          </div>
        ) : null}
        {this.state.status === "uploading" ? (
          <div>
            <p className="contribute-msg">
              Uploading ...
            </p>
          </div>
        ) : (
          <div>
            <button type="button" className="btn btn-success contribute-btn" onClick={this.upload}>
              <i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload
            </button>
          </div>
        )}
        <div className="contribute-meme-generator-link-container">
          <button type="button" className="btn btn-light contribute-btn">
            <a href="https://imgflip.com/memegenerator" target="_blank" className="contribute-meme-generator-link">
              <i className="fa fa-external-link" aria-hidden="true"></i> Have a great idea? Go to meme generator
            </a>
          </button>
        </div>
        <div className="contribute-cancel-link-container">
          <button type="button" className="btn btn-danger contribute-btn">
            <Link className="contribute-cancel-link" to="/meme">
              <i className="fa fa-trash-o" aria-hidden="true"></i> Cancel and go back to memes
            </Link>
          </button>
        </div>
      </div>
    )
  }
}

export default ContributePage;
