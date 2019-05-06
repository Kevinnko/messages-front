import React from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  state = {
    messages: [],
    message: "",
    status: "true"
  };

  async componentDidMount() {
    // loading messages from api
    const response = await axios.get("http://localhost:3001/get-messages");
    this.setState({
      messages: response.data
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.state;
    // There is a new message in the state, scroll to bottom of list
    if (messages.length > prevState.messages.length) {
      const objDiv = document.getElementById("scrollable-div");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const response = await axios.post("http://localhost:3001/post-message", {
      message: this.state.message,
      public: this.state.status
    });

    this.setState({
      messages: response.data,
      message: ""
    });
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="container">
        {/* S'il y a des messages, on les affiche, sinon on affiche "pas de message" */}
        {messages.length === 0 ? (
          <div style={{ padding: 10 }}>
            Pas de messages : lancer le serveur.
          </div>
        ) : (
          <MessagesList messages={messages} />
        )}
        <form
          className="form"
          style={{ display: "flex" }}
          onSubmit={this.handleSubmit}
        >
          <textarea
            className="message-input"
            placeholder="Ecrivez votre message..."
            name="message"
            cols="30"
            rows="1"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <select
            className="select"
            value={this.state.status}
            name="status"
            onChange={this.handleChange}
          >
            <option value="true">Public</option>
            <option value="false">Privé</option>
          </select>
          <input
            disabled={this.state.message === "" ? true : false}
            className="button"
            type="submit"
            value="Envoyer"
          />
        </form>
      </div>
    );
  }
}

export const MessagesList = props => {
  return (
    <div id="scrollable-div">
      {props.messages.map((message, index) => {
        return (
          <div key={index} className="message">
            <div className="msg-text">{message.message}</div>
            {message.public === "true" ? (
              <div className="msg-status">Public</div>
            ) : (
              <div className="msg-status">Privé</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default App;
