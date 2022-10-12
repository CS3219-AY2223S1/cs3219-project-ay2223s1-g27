import React, { useState } from "react";
import QuestionSelector from "./QuestionSelector"; 
import { Button, Box, Chip } from '@mui/material';

const ChatBody = ({ chatSocket, username, room_id }) => {
  const [isInterviewer, setIsInterviewer] = useState();
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const interviewerSwitchRequestEvent = 'request interviewer switch';
  const interviewerSwitchEvent = 'interviewer switch event';

  chatSocket.on(interviewerSwitchEvent, (data) => {
    const interviewer = data.interviewer;
    console.log(data)
    if (interviewer === username) {
        setIsInterviewer(true);
    } else {
        setIsInterviewer(false);
    }
    setWelcomeMessage(false)
  })

  chatSocket.on('message response', (data) => {
    console.log(data)
    setMessages([...messages, data])
  });

  const handleSwitchRole = () => {
    if (!isInterviewer) {
      chatSocket.emit(interviewerSwitchRequestEvent, {
        room_id: room_id,
        username: username,
      })
    }
  };

  return (
    <> 
      <header className="chat_mainHeader"> 
          <Chip label={isInterviewer ? 'Interviewer' : 'Interviewee' } sx={{backgroundColor: '#a2acbd', color: '#fff'}}/>   
          {isInterviewer ?  
            <QuestionSelector chatSocket={chatSocket} username={username} room_id={room_id}/> 
          : 
            <Box> 
              <Button 
                onClick={handleSwitchRole} 
                variant='outlined'
                sx={{ backgroundColor: '#0f172a', 
                  color: '#fff', 
                  borderRadius: '7px', 
                  textTransform: 'none', 
                  fontWeight: 'bold', 
                  '&:hover': {
                    backgroundColor: '#1e293b'
                  }}}          
                >
                Become the Interviewer
              </Button>
            </Box>
          }
      </header>

      {/*This shows messages sent from you*/}
      <div className="message_container">
        {messages.map((message) => 
          message.username === username ?
          (<div className="message_chats">
          <p className="sender_name">You</p>
          <div className="sender_message">
            <p>{message.text}</p>
          </div>
        </div>)
        :
        /*This shows messages received by you, maybe we should store both involved usernames in socket*/
        <div className="message_chats">
          <p>{message.username}</p>
          <div className="recipient_message">
            <p>{message.text}</p>
          </div>
        </div>
        )}        

        {/* This is triggered when a user is typing
        <div className="message_status">
          <p>Someone is typing...</p>
        </div> */}
      </div>
    </>
  );
};

export default ChatBody;