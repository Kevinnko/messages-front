import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";
import renderer, { create } from "react-test-renderer";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

jest.mock("axios");

describe("<App />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("matches the snapshot", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should contain a paragraph telling to launch server", () => {
    const wrapper = shallow(<App />);
    const text = wrapper.find("p").text();
    expect(text).toEqual("Pas de messages : lancer le serveur.");
  });

  it("should contain one textarea, one select and one input button", () => {
    const wrapper = shallow(<App />);
    const inputs = wrapper.find("input");
    const textareas = wrapper.find("textarea");
    const selects = wrapper.find("select");
    expect(inputs.length).toEqual(1);
    expect(textareas.length).toEqual(1);
    expect(selects.length).toEqual(1);
  });

  describe("when rendered", () => {
    it("should fetch a list of messages", async () => {
      const getSpy = jest.spyOn(axios, "get");
      const messagesListInstance = create(<App />);
      expect(getSpy).toBeCalled();
      const instance = messagesListInstance.getInstance();
      await instance.componentDidMount();
    });
  });

  describe("when the value of its input is changed", () => {
    it("its state should be changed", () => {
      const appInstance = shallow(<App />);
      const message = "bonjour";
      const taskInput = appInstance.find("textarea");
      taskInput.simulate("change", {
        target: { value: message, name: "message" }
      });
      expect(appInstance.state().message).toEqual(message);
    });
  });

  describe("when the button is clicked with the input filled out", () => {
    it("a post request should be made", () => {
      const appInstance = shallow(<App />);
      const postSpy = jest.spyOn(axios, "post");
      const message = "bonjour";
      const taskInput = appInstance.find("textarea");
      taskInput.simulate("change", {
        target: { value: message, name: "message" }
      });

      appInstance.find("form").simulate("submit", { preventDefault() {} });

      expect(postSpy).toBeCalled();
    });
  });

  describe("when the button is clicked with the input filled out", () => {
    it("the new message should be added to the state of messages", () => {
      const appInstance = shallow(<App />);
      const postSpy = jest.spyOn(axios, "post");
      const message = "bonjour";
      const taskInput = appInstance.find("textarea");
      taskInput.simulate("change", {
        target: { value: message, name: "message" }
      });

      appInstance.find("form").simulate("submit", { preventDefault() {} });

      const postPromise = postSpy.mock.results.pop().value;

      return postPromise.then(postResponse => {
        const newMessagesArray = [];
        newMessagesArray.push(postResponse.data);

        appInstance.setState({ messages: newMessagesArray }, () => {
          appInstance.update();
          expect(appInstance.state("messages")).toEqual(newMessagesArray);
          // console.log(appInstance.state());
          // console.log(" ======================== ");
          // console.log(appInstance.debug());
        });
      });
    });
  });
});

// TO DO : tester la condition 'public/privé'
