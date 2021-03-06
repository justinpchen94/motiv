import React from 'react';
import { connect } from 'react-redux'
import { forgotPassword } from '../../actions/auth';
import Messages from '../Messages';

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleForgot(event) {
    event.preventDefault();
    this.props.dispatch(forgotPassword(this.state.email));
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <Messages messages={this.props.messages}/>
          </div>
        </div>
        <div className="row login-row">
          <div className="col-md-4 col-md-offset-4">
            <div className="card">
              <form onSubmit={this.handleForgot.bind(this)}>
                <div className="card-content">
                  <h1>Forgot Password</h1>
                  <br />
                  <hr />

                  <p>Enter your email address below and we'll send you password reset instructions.</p>

                  <br />
                  <div className="input-group login-input-group">
                    <input id="email"
                           type="email"
                           name="email"
                           title="Email"
                           placeholder="Email"
                           className="form-control"
                           onChange={this.handleChange.bind(this)}
                           value={this.state.email} 
                           required
                           autoFocus />
                  </div>
                  <br />
                  <hr /> 
                </div>         
                <div>
                  <button className="btn btn-primary" type="submit">Reset Password</button>
                </div>
              </form>
              <br /> <br />
            </div>
          </div>
        </div>
        <div data-align="center">
          <video autoPlay loop id="video-background" muted>
            <source src="../../assets/stretching.mp4" type="video/mp4"/>
          </video>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Forgot);
