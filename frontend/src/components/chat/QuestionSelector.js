import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { interviewQuestions } from './InterviewQns';
import { Typography } from '@mui/material';

import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import SendIcon from '@mui/icons-material/Send';

const QuestionSelector = ({ chatSocket, username, room_id }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendQuestion = (e, question) => {
    e.preventDefault();
    if (question.trim()) {
      chatSocket.emit('message', {
          text: question,
          username: username,
          id: `${chatSocket.id}${Math.random()}`,
          socketID: chatSocket.id,
          room_id: room_id,
      })
    }
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ width: '50' }}
      >
        Question List
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        open={open}
        sx={{ width: '35%' }}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList>
            {interviewQuestions.map((question) => {
            return (
            <MenuItem onClick={e => {
                sendQuestion(e, question);
                handleClose();
            }}>
            <ListItemIcon>
                <SendIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" style={{ display: "inline-block", whiteSpace: "pre-line" }}>
                {question}
            </Typography>
            </MenuItem>
            )
            })}
        </MenuList>
      </Menu>
    </div>
  );
}

export default QuestionSelector;