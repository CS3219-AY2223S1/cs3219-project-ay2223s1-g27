import React, { useState } from 'react';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatFooter = ({ chatSocket, username, room_id }) => {
  const [message, setMessage] = useState('');

  console.log(chatSocket)

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      chatSocket?.emit('message', {
        text: message,
        username: username,
        id: `${chatSocket?.id}${Math.random()}`,
        socketID: chatSocket?.id,
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
          placeholder="Type your message here..."
          className="message"
          value={message}
          disabled={!chatSocket}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage}
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            borderRadius: '7px',
            textTransform: 'none',
            paddingLeft: '15px',
            paddingRight: '15px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          endIcon={<SendIcon />}
        >SEND</Button>
      </form>
    </div>
  );
};

export default ChatFooter;
