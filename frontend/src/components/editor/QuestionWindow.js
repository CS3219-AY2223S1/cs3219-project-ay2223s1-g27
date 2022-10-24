// import { Box } from "@mui/system";
import { Box, FormHelperText } from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosApiInstance from "../../axiosApiInstance"
import { URL_QUESTION_SVC_QUESTIONS, URL_QUESTION_SVC_QUESTION } from "../../configs";
import QuestionDropdown from "./QuestionDropdown";
import QuestionDisplay from "./QuestionDisplay";

export default function QuestionWindow({socket, isInterviewer, username, titleSlug, setTitleSlug, setCodeSnippets, updateCodeSnippet, is_live}) {
  const location = useLocation();
  let [questions, setQuestions] = useState([]);
  let [questionName, setQuestionName] = useState("-");
  let [content, setContent] = useState("");
  let renderAsInterviewer = isInterviewer | !is_live;

  useEffect(() => {
    axiosApiInstance.get(`${URL_QUESTION_SVC_QUESTIONS}?difficulty=${location.state.difficultyLevel.toUpperCase()}&page=1`)
      .then(res => {
        console.log(res.data.problemsetQuestionList.questions)
        setQuestions(res.data.problemsetQuestionList.questions)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (titleSlug) {
      axiosApiInstance.get(`${URL_QUESTION_SVC_QUESTION}?titleSlug=${titleSlug}`).then(x => {
        setContent(x.data.content)
        setCodeSnippets(x.data.codeSnippets)
        updateCodeSnippet(x.data.codeSnippets)
        console.log(x)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleSlug])

  const handleQuestionChange = (q) => {
    socket.emit('question event', { room_id: location.state.room_id, titleSlug: q.value, questionName: q.label });
    setQuestionName(q.label);
    setTitleSlug(q.value);
  }

  socket.on('receive question', (payload) => {
    console.log(`received question with titleSlug=${payload.titleSlug} and name=${payload.questionName}`)
    setTitleSlug(payload.titleSlug);
    setQuestionName(payload.questionName);
  })

  return (
    <Box
      display={"flex"} 
      flexDirection={"column"}
      sx={{marginRight:'5vh'}}
    >
      {renderAsInterviewer ? 
      <QuestionDropdown
      handleQuestionChange={handleQuestionChange}
      questions={questions.map((q) => ({
        label: q.title,
        value: q.titleSlug,
        key: q.titleSlug
      }))}
      questionName={questionName} />
      :     
      null
      }
      {!renderAsInterviewer ? <FormHelperText>Selected Question</FormHelperText> : null}
      <div style={{
        height: !renderAsInterviewer ? "101vh" : "95vh", 
        width: "100%",
        marginRight: "10px",
        borderWidth: '1px',
        overflow: 'auto',
        marginTop:  !renderAsInterviewer ? "1%" : "16px"
      }}> 
          <QuestionDisplay
            content={content} /> 
      </div>
    </Box>
  )
}
