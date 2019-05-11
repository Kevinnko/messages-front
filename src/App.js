import React from "react";
import axios from "axios";
import MessagesList from "./components/MessagesList";
import "./App.css";

class App extends React.Component {
  state = {
    messages: [],
    message: "",
    status: "true"
  };

  ref = React.createRef();

  async componentDidMount() {
    try {
      // loading messages from api
      const response = await axios.get("http://localhost:3001/get-messages");
      if (this.unmounted) return;

      this.setState({
        messages: response.data
      });
    } catch (error) {
      console.log("componentDidMount error : ", error);
    }
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.state;
    // S'il y a un nouveau message, scroller vers celui-ci
    if (messages.length > prevState.messages.length) {
      this.ref.current && this.ref.current.scrollIntoView();
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
    const { message, messages, status } = this.state;
    try {
      const response = await axios.post("http://localhost:3001/post-message", {
        message: message,
        public: status
      });

      const newMessagesArray = [...messages];
      newMessagesArray.push({ message: message, public: status });
      this.setState({
        messages: newMessagesArray,
        message: ""
      });
    } catch (error) {
      console.log("handleSubmit error : ", error);
      alert("Le serveur ne répond pas");
    }
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="container">
        {messages.length === 0 ? (
          <div style={{ padding: 10 }}>
            <p>Pas de messages : lancer le serveur.</p>
          </div>
        ) : (
          <MessagesList messages={messages} ref={this.ref} />
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

export default App;
