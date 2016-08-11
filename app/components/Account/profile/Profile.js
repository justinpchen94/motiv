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

class ReadOnlyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      goals: [],
      stats: [],
      milestones: [],
      contents: [],
      visible:<Supplements />

    };
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
      goals: this.props.goals,
      stats: this.props.stats,
      milestones: this.props.milestones,
      contents: this.props.contents,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      goals: nextProps.goals,
      stats: nextProps.stats,
      milestones: nextProps.milestones,
      contents: nextProps.contents
    });
  }



  render() {
    const tabList = (
      <div>
        <div>
          <Tab label="Activity" linkTo="/activity" />
        </div>
        <div>
          <Tab label="Progress" linkTo="/progress" />
        </div>
        <div>
          <Tab label="Routine" linkTo="/exercise" />
        </div>
        <div>
          <Tab label="Motivation" linkTo="/motivation" />
        </div>
        <div>
          <Tab label="Diet" linkTo="/diet" />
        </div>
      </div>
    );

    const statList = _.map(this.state.stats, (stat, index) => {
      return (<Stat key={index} {...stat} />);
    });

    const goalList = _.map(this.state.goals, (goal, index) => {
      return (<Goal key={index} {...goal} />);
    });

    const milestoneList = _.map(this.state.milestones, (milestone, index) => {
      return (<Milestone key={index} {...milestone} />);
    });

    return (
    <div>

      <div className="container">
        <Messages messages={this.props.messages}/>
        <h4>Profile Information</h4>
        <Bio {...this.state.user} />
        {tabList}
        {statList}
        {goalList}
        {milestoneList}
        {this.state.visible}
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
    messages: state.messages
  };
};

export default connect(mapStateToProps)(ReadOnlyProfile);
