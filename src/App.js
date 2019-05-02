import React from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  state = {
    messages: [],
    loading: true
  };

  async componentDidMount() {
    // loading messages from api
    const response = await axios.get("http://localhost:3001/get-messages");
    this.setState({
      messages: response.data
    });
  }

  render() {
    const { messages } = this.state;
    return (
      <div className="container">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <div>{message.message}</div>
              <div>{message.public ? <p>Public</p> : <p>Privé</p>}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
