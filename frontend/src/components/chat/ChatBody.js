import React from "react";
import QuestionSelector from "./QuestionSelector";
import { Button, Box, Chip, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { INTERVIEWER_SWITCH_REQUEST_EVENT } from "../../constants";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

const ChatBody = ({ chatSocket, username, room_id, isInterviewer, messages }) => { 
  const [open, setOpen] = useState(false);

  const handleSwitchRole = () => { 
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
      <header className="chat_mainHeader" style={{ backgroundColor: '#EAEEFF' }}>
        <Chip label={isInterviewer ? 'Interviewer' : 'Interviewee'} sx={{ backgroundColor: 'primary.main', color: '#fff' }} />
        {isInterviewer ?
          <QuestionSelector chatSocket={chatSocket} username={username} room_id={room_id} />
          :
          <><Box>
            <Button
              onClick={() => setOpen(true)}
              variant='outlined'
              sx={{
                backgroundColor: 'primary.main',
                color: '#fff',
                borderRadius: '7px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              Become the Interviewer
            </Button>
          </Box>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
          >
              <Box sx={modalStyle}>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Become the Interviewer
                  </Typography>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Upon clicking 'Confirm', you will swap roles with the Interviewer. 
                    As the Interviewer, you will be able to ask interview questions and select a coding question for your Interviewee.  
                  </Typography>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"flexStart"} style={{ paddingTop: "5%" }}>
                  <Button variant={"contained"} 
                  onClick={() => {
                    handleSwitchRole()
                    setOpen(false)
                  }}>Confirm</Button>
                </Box>
              </Box>
            </Modal></>
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
