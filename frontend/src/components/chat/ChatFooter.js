import React, { useState } from 'react';

const ChatFooter = ({ chatSocket, username, room_id }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    // console.log({ userName: localStorage.getItem('userName'), message });
    if (message.trim()) {
        console.log(message)
        console.log(chatSocket)
        chatSocket.emit('message', {
            text: message,
            username: username,
            id: `${chatSocket.id}${Math.random()}`,
            socketID: chatSocket.id,
            room_id: room_id,
        })
    }
    setMessage('');
  };
  return (
    <div className="chat_footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message here"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;