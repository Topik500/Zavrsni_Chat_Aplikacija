import React, { Component } from "react";
import "./App.css";
import Messages from "./components/Messages";
import Input from "./components/Input";

function randomName() {
  const noun = Math.floor(Math.random() * 100);
  return "Korisnik #" + noun;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    },
  };

  constructor() {
    super();
    this.drone = new window.Scaledrone("ys6PduIGwd7XnNMG", {
      data: this.state.member,
    });
    this.drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({
        member,
        text: data,
        time: Date.now(),
      });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>CHAT APLIKACIJA</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />

        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

export default App;
