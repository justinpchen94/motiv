import React from 'react';
import moment from 'moment';

const FeedItem = (props) => {
  return (
      <div>        
        <h3> {props.name} </h3>
        <h4> {moment().format()}</h4>
        <p> {props.content}</p>
      </div>
  )
}

export default FeedItem;