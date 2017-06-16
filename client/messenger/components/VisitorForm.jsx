import React, { PropTypes } from 'react';


const validateEmail = (mail) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

  return regex.test(mail);
};

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      showEmailInput: false,
      email: '',
      error: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onSubmit() {
    const { sendVisitorFirstMessage } = this.props;
    const { content } = this.state;

    // first ask for content then show email input
    if (!this.state.showEmailInput && content) {
      return this.setState({ showEmailInput: true, content });
    }

    const email = this.state.email;

    if (!validateEmail(email)) {
      return this.setState({ error: 'Invalid email address.' });
    }

    if (email && content) {
      // save email for later use
      sendVisitorFirstMessage(email, content);
    }

    return null;
  }

  handleMessageChange(e) {
    this.setState({ content: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const { content } = this.state;
      if (e.shiftKey && !this.state.showEmailInput) {
        this.setState({ content: `${content}\n` });
      } else {
        this.onSubmit();
      }
    }
  }
  renderWelcomeMessage() {
    const messengerData = this.props.data.messengerData;
    const isOnline = messengerData && messengerData.isOnline;
    if (messengerData && isOnline && messengerData.welcomeMessage) {
      return (
        <span>
          {messengerData.welcomeMessage}
        </span>
      );
    } else if (messengerData && !isOnline && messengerData.awayMessage) {
      return (
        <span>
          {messengerData.awayMessage}
        </span>
      );
    }
    return (
      <span>
        Hello! We’d love to help you out!
        Leave us a message and we’ll get back to you as soon as possible
      </span>
    );
  }

  renderContent() {
    const sendButton = (
      <button type="button" onClick={this.onSubmit} />
    );

    if (this.state.showEmailInput) {
      return (
        <div className="erxes-form-wrapper">
          <div className="erxes-information">
            <span>
              How can we reach you? Please type your email.
            </span>
            <div className="erxes-error">{this.state.error}</div>
          </div>
          <input
            placeholder="email@domain.com"
            type="email"
            onKeyDown={this.handleKeyPress}
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          {sendButton}
        </div>
      );
    }

    return (
      <div className="erxes-form-wrapper">
        <div className="erxes-information">
          {this.renderWelcomeMessage()}
        </div>
        <textarea
          placeholder="Send a message"
          onKeyDown={this.handleKeyPress}
          value={this.state.content}
          onChange={this.handleMessageChange}
        />
        {sendButton}
      </div>
    );
  }

  render() {
    const { color } = this.props;

    const title = (
      <div className="erxes-topbar-title">
        <div>Conversation</div>
        <span>with Support staffs</span>
      </div>
    );

    const topBar = (
      <div className="erxes-topbar" style={{ backgroundColor: color }}>
        <div className="erxes-middle">
          {title}
        </div>
      </div>
    );

    return (
      <div className="erxes-form">
        {topBar}

        {this.renderContent()}
      </div>
    );
  }
}

Form.propTypes = {
  sendVisitorFirstMessage: PropTypes.func.isRequired,
  color: PropTypes.string,
  data: PropTypes.object,
};
