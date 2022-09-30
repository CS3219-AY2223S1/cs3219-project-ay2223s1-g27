import { Box } from "@mui/system";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosApiInstance from "../../axiosApiInstance"
import { URL_QUESTION_SVC_QUESTIONS, URL_QUESTION_SVC_QUESTION } from "../../configs";
import QuestionDropdown from "./QuestionDropdown";
import QuestionDisplay from "./QuestionDisplay";

export default function QuestionWindow() {
    const location = useLocation();
    let [questions, setQuestions] = useState([]);
    let [titleSlug, setTitleSlug] = useState("");
    let [content, setContent] = useState("");

    useEffect(() => {
        axiosApiInstance.get(`${URL_QUESTION_SVC_QUESTIONS}?difficulty=${location.state.difficultyLevel.toUpperCase()}&page=1`)
            .then(res => {
                console.log(res.data.problemsetQuestionList.questions)
                setQuestions(res.data.problemsetQuestionList.questions)
            })

    }, [])

    useEffect(() => {
        if (titleSlug) {
            axiosApiInstance.get(`${URL_QUESTION_SVC_QUESTION}?titleSlug=${titleSlug}`).then(x => {
                setContent(x.data.content)
                console.log(x)
            })
        }
    }, [titleSlug])

    const handleQuestionChange = (q) => {
        setTitleSlug(q.value);
    }

    return <div style={{
        height:"85vh",
        width:"100%"
    }}>
        <Box>
            <QuestionDropdown
                handleQuestionChange={handleQuestionChange}
                questions={questions.map((q) => ({
                    label: q.title,
                    value: q.titleSlug,
                    key: q.titleSlug
                }))}
            />
            <QuestionDisplay
                content={content}
            />
        </Box>

    </div>
}
