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

    this.setState({ messages: response.data });
  };

  render() {
    const { messages } = this.state;
    return (
      <div className="container">
        {messages.map((message, index) => {
          return (
            <div key={index} className="message">
              <div>{message.message}</div>
              {message.public === "true" ? <div>Public</div> : <div>Privé</div>}
            </div>
          );
        })}
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="message" onChange={this.handleChange} />
          <select
            value={this.state.status}
            name="status"
            onChange={this.handleChange}
          >
            <option value="true">Public</option>
            <option value="false">Privé</option>
          </select>
          <input type="submit" value="Envoyer" />
        </form>
      </div>
    );
  }
}

export default App;
