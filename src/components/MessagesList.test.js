import React from "react";
import { shallow } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-enzyme";
import MessagesList from "./MessagesList";
configure({ adapter: new Adapter() });

describe("MessageList component", () => {
  describe("when provided with an empty array of messages", () => {
    it("contains an empty div", () => {
      const messagesList = shallow(<MessagesList messages={[]} />);
      expect(messagesList).toContainReact(<div id="scrollable-div" />);
      //   expect(messagesList.contains(<div id="scrollable-div" />)).toEqual(true);
    });
    it("does not contain other elements", () => {
      const messagesList = shallow(<MessagesList messages={[]} />);
      expect(messagesList.contains(<div className="message" />)).toEqual(false);
    });
  });
  describe("when provided with an array of messages", () => {
    it('contains a matching number of <div className="message"> elements', () => {
      const messages = [
        { message: "Salut, comment ça va ?", public: "false" },
        { message: "Très bien merci, et toi ?", public: "false" }
      ];
      const messagesList = shallow(<MessagesList messages={messages} />);
      expect(messagesList.find(".message").length).toEqual(messages.length);
    });
  });
});
