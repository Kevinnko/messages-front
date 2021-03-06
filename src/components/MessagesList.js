import React from "react";

const MessagesList = React.forwardRef((props, ref) => {
  // console.log(props);
  return (
    <div id="scrollable-div">
      {props.messages.map((message, index) => {
        return (
          <div key={index} className="message" ref={ref}>
            <div className="msg-text">{message.message}</div>
            {message.public === "true" ? (
              <div className="msg-status">Public</div>
            ) : (
              <div className="msg-status">Privé</div>
            )}
          </div>
        );
      })}
    </div>
  );
});
export default MessagesList;
