import React from 'react';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
// var Infinite = require('react-infinite');
import _ from 'lodash';
import FeedItem from './FeedItem'

class Feed extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      feedItems:[]
    };
  }
  componentDidMount() {
    this.setState({
      feedItems: this.props.feedItems
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      feedItems: nextProps.feedItems
    })
  }
  render() {
    const displayFeedItems = _.map(this.state.feedItems,(status, i) => {
        return (<FeedItem key={i} {...status}/>);
    });
    
    return (
      <div className="container">
        <Infinite containerHeight={500} elementHeight={100}>
            {displayFeedItems}
        </Infinite>


      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feedItems: state.feed.feedItems
  };
};

export default connect(mapStateToProps)(Feed);
