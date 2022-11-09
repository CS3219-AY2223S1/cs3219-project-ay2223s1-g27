import * as React from 'react';
import {
  Button,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import { interviewQuestions } from './InterviewQns';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const QuestionSelector = ({ chatSocket, username, room_id }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendQuestion = (e, question) => {
    e.preventDefault();
    if (question.trim()) {
      chatSocket?.emit('message', {
        text: question,
        username: username,
        id: `${chatSocket?.id}${Math.random()}`,
        socketID: chatSocket?.id,
        room_id: room_id,
      })
    }
  }

  return (
    <div>
      <Box>
        <Button
          variant='contained'
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
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
          Interview Questions
        </Button>
      </Box>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {interviewQuestions.map((question) => {
          return (
            <Tooltip title="Click to send!">
              <MenuItem onClick={e => {
                sendQuestion(e, question);
                handleClose();
              }}>
                {/* <ListItemIcon>
                      <SendIcon fontSize="small" />
                  </ListItemIcon> */}
                <Typography variant="inherit" style={{ display: "inline-block", whiteSpace: "pre-line" }}>
                  {question}
                </Typography>
              </MenuItem>
            </Tooltip>

          )
        })}
      </Menu>
    </div>
  );
}

export default QuestionSelector;
