import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";
import renderer, { create } from "react-test-renderer";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

jest.mock("axios");

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("<App /> not connected to server", () => {
  it("matches the snapshot", () => {
    const tree = renderer.create(<App />).toJSON();
    console.log("tree", tree);
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
});

describe("<App /> connected to server", () => {
  describe("when rendered", () => {
    it("should fetch a list of messages", async () => {
      const getSpy = jest.spyOn(axios, "get");
      const messagesListInstance = create(<App />);
      expect(getSpy).toBeCalled();
      const instance = messagesListInstance.getInstance();
      await instance.componentDidMount();
      // console.log("instance ", instance.state.messages);
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
      // console.log("appInstance.state() ==> ", appInstance.state());
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

      // const button = appInstance.find(".button");
      // expect(button.length).toEqual(1);
      // button.simulate("submit");
      // --> Cette simulation ne semble pas déclencher la fonction (idem avec `click`)

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
        const currentState = appInstance.state();
        console.log("postResponse ", postResponse.data);
        console.log("------------------");
        console.log("currentState: ", currentState);
        expect(currentState.messages.includes(postResponse.data)).toBe(true);
      });
    });
  });
});

// describe("<App />", () => {
//   it("should contain an array of objects with specific keys", async () => {
//     const response = {
//       data: [
//         { message: "Coucou", status: "true" },
//         { message: "Coucou", status: "false" }
//       ]
//     };
//     expect(Array.isArray(response.data)).toEqual(true);
//     axios.get.mockResolvedValue(response);
//     const component = create(<App />);
//     const instance = component.getInstance();
//     await instance.componentDidMount();

//     instance.state.messages.forEach(obj => {
//       expect(typeof obj).toEqual("object");

//       // chaque objet du tableau de messages doit contenir les clés 'message' et 'status
//       expect(Object.keys(obj).sort()).toEqual(["message", "status"]);

//       // Valider le type des valeurs de chaque clé
//       expect(typeof obj.message).toEqual("string");
//       expect(typeof obj.status).toEqual("string");
//     });
//   });

//   // tester le conditional public / privé
//   // tester le onSubmit
// });
