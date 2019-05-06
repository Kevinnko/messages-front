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
    var element = document.getElementsByClassName("scrollable-div")[0];
    console.log("in componentDidMount", element);

    // loading messages from api
    const response = await axios.get("http://localhost:3001/get-messages");
    this.setState({
      messages: response.data
    });
  }
  componentDidUpdate() {
    var element = document.getElementsByClassName("scrollable-div")[0];
    console.log("in componentDidUpdate", element);
    element.scrollIntoView(false);
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
          <div>Pas de messages</div>
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
// created stateless component
export const MessagesList = props => {
  return (
    <div className="scrollable-div">
      {props.messages.map((message, index) => {
        return (
          <>
            <div key={index} className="message">
              <div className="msg-text">{message.message}</div>
              {message.public === "true" ? (
                <div className="msg-status">Public</div>
              ) : (
                <div className="msg-status">Privé</div>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default App;
