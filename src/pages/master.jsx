import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'


const Master = React.createClass({
  render: function() {
    const year = new Date().getFullYear();

    return (<div>
      <header>
        <h1><Link to="/">Mastermind</Link></h1>
        <div>
          <Link to="/rules">Game Rules</Link>
        </div>
      </header>

      <div id="mainContent">
        {this.props.children}
      </div>

      <footer>
        <span><strong>&copy;</strong> { year }, Tamas Szabo</span>
        <a href="https://github.com/sztamas/mastermind" target="blank">
          <img src='img/Octocat.jpg'></img>
          Source Code
        </a>
      </footer>
    </div>)
  }
})

export default Master
