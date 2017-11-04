import React, { Component } from 'react'
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom'

import CommentPage from './pages/commentpage'
import ContributePage from './pages/contributepage'
import Homepage from './pages/homepage'
import MemePage from './pages/memepage'
import StatisticsPage from './pages/statisticspage'

class Routers extends Component {
  render(){
    return(
      <Router>
        <div>
          <Route exact path="/" component={Homepage} />
          <Route path="/meme" component={MemePage} />
          <Route path="/contribute" component={ContributePage} />
          <Route path="/comment/:type/:id" component={CommentPage} />
          <Route path="/statistics/:type/:id" component={StatisticsPage} />
        </div>
      </Router>
    );
  }
}

export default Routers;
