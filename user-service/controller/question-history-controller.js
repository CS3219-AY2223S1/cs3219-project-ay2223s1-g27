import { getMatchHistory, createMatchHistory, updateMatchHistory, getQuestionHistory, createQuestionHistory, updateQuestionHistory, getRoomsFromUserID } from "../model/repository.js";

export async function questionHistory(req, res) {
    try {
        const { uid, limit, offset } = req.query;
        const rooms = await getRoomsFromUserID(uid, limit, offset);
        let data = [];
        for (let room of rooms) {
            let questionHistory = await getQuestionHistory(room.room_id);
            if (!questionHistory) continue;
            data.push(questionHistory);
        }
        const allRooms = await getRoomsFromUserID(uid, 0, 0);
        let cnt = 0;
        for (let room of allRooms) {
            let questionHistory = await getQuestionHistory(room.room_id);
            if (!questionHistory) continue;
            cnt++;
        }
        return res.status(200).json({
            rows: data,
            totalCount: cnt
        });
    } catch (err) {
        console.log(`questionHistory error, err=${err}`);
        res.status(500).json({ success: false });
    }
}

export async function saveSession(req, res) {
    try {
        const { room_id, user_id } = req.body;
        let session = await getMatchHistory(room_id);
        if (!session) {
            let newSession = await createMatchHistory(room_id, user_id);
            return res.status(201).json(newSession);
        }
        let sessionUsers = session.users;
        if (!sessionUsers.includes(user_id)) sessionUsers.push(user_id);
        let updatedSession = await updateMatchHistory(room_id,  session.users);
        return res.status(201).json(updatedSession);
    } catch (err) {
        console.log(`saveSession error, err=${err}`);
        res.status(500).json({ success: false });
    }
}

export async function saveQuestion(req, res) {
    try {
        const { room_id, titleSlug, codeSegment, language } = req.body;
        let session = await getQuestionHistory(room_id);
        if (!session) {
            let newSession = await createQuestionHistory(room_id, titleSlug, codeSegment, language);
            return res.status(201).json(newSession);
        }
        let sessionQuestions = session.questions;
        let found = false;
        for (let sessionQuestion of sessionQuestions) {
            if (sessionQuestion.titleSlug === titleSlug) {
                found = true;
                sessionQuestion.codeSegment = codeSegment;
                sessionQuestion.language = language;
            }
        }
        if (!found) {
            sessionQuestions.push({
                titleSlug: titleSlug,
                codeSegment: codeSegment,
                language: language
            })
        }
        let updatedSession = await updateQuestionHistory(room_id, sessionQuestions);
        return res.status(201).json(updatedSession);
    } catch (err) {
        console.log(`saveQuestion error, err=${err}`);
        res.status(500).json({ success: false });
    }
}
