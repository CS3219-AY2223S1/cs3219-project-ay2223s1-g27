import React, { useState } from "react";
import { interviewQuestions } from "./InterviewQns";

const ChatBody = ({ chatSocket, username, room_id }) => {
  const [isInterviewer, setIsInterviewer] = useState();
  const [showQuestions, setShowQuestions] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const interviewer_switch_request_event = 'request interviewer switch';
  const interviewer_switch_event = 'interviewer switch event';

  console.log(isInterviewer);
  console.log(username);

  chatSocket.on(interviewer_switch_event, (data) => {
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
      chatSocket.emit(interviewer_switch_request_event, {
        room_id: room_id,
        username: username,
      })
    }
  };

  const sendQuestion = (e, question) => {
    e.preventDefault();
    if (question.trim()) {
      console.log(question)
      chatSocket.emit('message', {
          text: question,
          username: username,
          id: `${chatSocket.id}${Math.random()}`,
          socketID: chatSocket.id,
          room_id: room_id,
      })
    }
  }

  const toggleShowQuestions = () => {
    setShowQuestions(!showQuestions);
  }

  return (
    <>
      <header className="chat_mainHeader">
        {welcomeMessage ? <p>Welcome to PeerPrep!</p> :
        isInterviewer ? <p>You are the Interviewer!</p> : <p>You are the Interviewee!</p>}
        {isInterviewer ?
        <div class="dropdown">
          <button className="interviewerQuestion_btn" onClick={toggleShowQuestions}>
            Question List
          </button>
            {showQuestions ? 
            <div id="myDropdown" class="dropdown-content">
              {interviewQuestions.map((question) =>
              <div><button className="interviewerQuestion" onClick={e => sendQuestion(e, question)}>{question}</button></div>)}
            </div> 
            : null
            }
        </div>
        : 
        <button className="switchRole_btn" onClick={handleSwitchRole}>
          Become the Interviewer
        </button>}
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