// "use strict";
module.exports = {
  get: () => {
    return Promise.resolve({
      data: [
        {
          message: "Salut, comment ça va ?",
          public: "false"
        },
        {
          message: "Très bien merci, et toi ?",
          public: "false"
        }
      ]
    });
  },
  post: (url, data) => {
    return Promise.resolve({
      data: {
        message: data.message,
        public: data.public
      }
    });
  }
};
