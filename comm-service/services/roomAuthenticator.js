import { getMatch } from "./redis.js";

async function userBelongsInRoom(username, room_id) {
    const room_details = await getMatch(room_id);
    console.log("Room ID:", room_id)
    const room_details_json = JSON.parse(room_details)
    console.log("Room JSON:", room_details_json)
    if (room_details) {
        if (room_details_json.username1 === username || room_details_json.username2 === username) {
            return true;
        }
    }
    return false;
}

export {
    userBelongsInRoom
}