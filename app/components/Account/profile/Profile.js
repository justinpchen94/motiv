import React from 'react';
import { connect } from 'react-redux'
import { updateProfile, changePassword, deleteAccount } from '../../../actions/auth';
import { link, unlink } from '../../../actions/oauth';
import Messages from '../../Messages';
import Bio from './Bio';
import Tab from './Tab';
import Stat from './Stat';
import Milestone from './Milestone';
import Goal from './Goal';
import _ from 'lodash';
import UploadButton from '../../UploadButton';
import Diet from '../../Regime/Diet/Diet';
import Supplements from '../../Supplement/SupplementView';
import Exercise from '../../Regime/Exercise/Exercise';
import RegimeDiet from '../../Regime/Diet/RegimeDiet';
import Timeline from '../../Timeline/Main';
import AddFriendButton from '../../AddFriendButton';

class ReadOnlyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user || {},
      goals: this.props.goals || [],
      stats: this.props.stats || [],
      milestones: this.props.milestones || [],
      contents: this.props.contents || [],
      diets: this.props.diets || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      goals: nextProps.goals,
      stats: nextProps.stats,
      milestones: nextProps.milestones,
      contents: nextProps.contents,
      diets: nextProps.diets
    });
  }



  render() {
    const foodDOM = _.map(this.state.diets, (food,index) => {
      return (<RegimeDiet key={index} {...food}/>);
    });

    const statList = _.map(this.state.stats, (stat, index) => {
      return (<Stat key={index} {...stat} />);
    });

    const goalList = _.map(this.state.goals, (goal, index) => {
      return (<Goal key={index} {...goal} />);
    });

    const milestoneList = _.map(this.state.milestones, (milestone, index) => {
      return (<Milestone key={index} {...milestone} />);
    });

    const followerButton = (this.state.user.id === this.props.loggedInUser.id) ? '' : (<AddFriendButton {...this.state} />) 

    return (
    <div>
      <ul className="nav nav-tabs">
        <li className="active"><a href="#profile" data-toggle="tab">Profile</a></li>
        <li><a href="#diet" data-toggle="tab">Diet</a></li>
        <li><a href="#supplement" data-toggle="tab">Supplement</a></li>
        <li><a href="#exercise" data-toggle="tab">Exercise</a></li>
        <li><a href="#timeline" data-toggle="tab">Timeline</a></li>
      </ul>
      <div id="myTabContent" className="tab-content">
        <div className="tab-pane fade active in" id="profile">
          <Messages messages={this.props.messages}/>
            {followerButton}
            <h4>Profile Information</h4>
              <Bio {...this.state.user} />
                <div>
                  <h4>Stat</h4>
                    {statList}
                </div>
                <div>
                  <h4>Goals</h4>
                    {goalList}
                </div>
                <div>
                <h4>Milestone</h4>
                  {milestoneList}
                </div>
            </div>
      <div className="tab-pane fade" id="diet">
        <Diet />
        {foodDOM}
      </div>
      <div className="tab-pane fade" id="supplement">
        <Supplements />
      </div>
      <div className="tab-pane fade" id="exercise">
        <Exercise />
      </div>
      <div className="tab-pane fade" id="timeline">
        <Timeline />
      </div>

      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.profile.user,
    goals: state.profile.goals,
    stats: state.profile.stats,
    milestones: state.profile.milestones,
    messages: state.messages,
    diets:state.regime.diet,
    loggedInUser: state.auth.user
  };
};

export default connect(mapStateToProps)(ReadOnlyProfile);