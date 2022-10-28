import React from "react";
import QuestionSelector from "./QuestionSelector"; 
import { Button, Box, Chip } from '@mui/material';
import { INTERVIEWER_SWITCH_REQUEST_EVENT } from "../../constants";

const ChatBody = ({ chatSocket, username, room_id, isInterviewer, messages }) => {

  const handleSwitchRole = () => {
    console.log("Hellosssssssssss")
    console.log(isInterviewer)

    if (!isInterviewer) {
      chatSocket?.emit(INTERVIEWER_SWITCH_REQUEST_EVENT, {
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
        {console.log(messages)}
        {messages.map((message, idx) => 
          message.username === username ?
          (<div className="message_chats" key={idx}>
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
      </div>
    </>
  );
};

export default ChatBody;