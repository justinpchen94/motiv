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
      feedItems:[],
      isInfiniteLoading: false
    };
    this.handleInfiniteLoad.bind(this);
  }

  componentDidMount() {

    this.setState({
      feedItems: this.props.feedItems
    });
    console.log("state after componentdidmount", this.state)
  }

  componentWillReceiveProps(nextProps) {


    this.setState({
      feedItems: nextProps.feedItems
    })
  }

  handleInfiniteLoad() {

    var that = this;

    var resObj = [
      {
        name: 'Justin',
        time: new Date(),
        content: 'more stuff'
      },
      {
        name: 'Jason',
        time: new Date(),
        content: 'jahardar'
      },
      {
        name: 'Denny',
        time: new Date(),
        content: 'pogo stick'
      }

    ];

    this.setState({
      isInfiniteLoading: false,
      feedItems: that.state.feedItems.concat(resObj)
    })
  }

  elementInfiniteLoad() {
    return (<div>
            Loading...
        </div>);
  }


  render() {
    let displayFeedItems = _.map(this.state.feedItems,(status, i) => {
        return (<FeedItem key={i} {...status}/>);
    });

    return (
      <div className="container">
        <Infinite 
          containerHeight={500} 
          elementHeight={99.53}
          infiniteLoadBeginEdgeOffset={400}
          onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          isInfiniteLoading={this.state.isInfiniteLoading}

          >
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
