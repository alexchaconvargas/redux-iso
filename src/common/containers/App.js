import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as UserActions from '../actions/user';

class App extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount() {
    this.props.getUser('abcde12345');
  }

  render() {

    return (
	    <div>
        <ol>
          <li><Link to="/random/5" activeClassName="active">Random</Link></li>
          <li><Link to="/counter/10" activeClassName="active">Counter</Link></li>
        </ol>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  	user : state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);