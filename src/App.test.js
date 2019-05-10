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
  // it("should call an API", async () => {
  //   const response = {
  //     data: [
  //       { message: "Coucou", status: "true" },
  //       { message: "Coucou", status: "false" }
  //     ]
  //   };
  //   expect(Array.isArray(response.data)).toEqual(true);
  //   axios.get.mockResolvedValue(response);
  //   const component = create(<App />);
  //   const instance = component.getInstance();
  //   await instance.componentDidMount();
  //   // await instance.componentDidUpdate();
  // });
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

// // le composant MessageList doit contenir une liste de messages
// describe("MessageList", () => {
//   it("should contain divs", () => {
//     const messages = [
//       { message: "Coucou", status: "true" },
//       { message: "Coucou", status: "false" }
//     ];

//     const component = mount(<MessagesList messages={messages} />);
//     const value = component.find("div.message");
//   });
// });
