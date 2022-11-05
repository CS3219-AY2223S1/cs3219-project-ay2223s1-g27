import { CountdownCircleTimer } from "react-countdown-circle-timer";
import NavigationBar from "./NavigationBar";
import { io } from "socket.io-client";
import { isUnauthorizedError } from "@thream/socketio-jwt/build/UnauthorizedError.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  URL_MATCHING_SVC,
  PREFIX_MATCHING_SVC,
} from "../configs";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { refreshAccessToken } from "../axiosApiInstance";
import { delay } from "./Timer";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  textTransform: "none",
  fontSize: "15px",
  width: "100%",
};

function MatchingPage() {
  const location = useLocation(); // Location contains username and selected difficulty level
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies();
  const socket = io(URL_MATCHING_SVC, {
    transports: ["websocket"],
    path: PREFIX_MATCHING_SVC,
    auth: {
      token: `Bearer ${cookies["access_token"]}`,
    },
  });

  socket.on("connect_error", (error) => {
    if (isUnauthorizedError(error)) {
      refreshAccessToken(setCookies);
      console.log("Unauthorised error");
    }
  });

  // Emit matching event here
  socket.emit("match", { difficulty: location.state.difficultyLevel });

  // Listen to matchSuccess event
  socket.once("matchSuccess", (data) => {
    console.log("matchSuccess");
    console.log(data.message);
    console.log(data.room_id);
    socket.removeAllListeners();
    handleMatchFound(data.room_id);
  });

  // Listen to matchFail event
  socket.once("matchFail", (data) => {
    console.log("matchFail");
    console.log(data.message);
    socket.removeAllListeners();
    handleNoMatchFound();
  });

  const [key, setKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderTime = ({ remainingTime }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#64748B" }}> Remaining </div>
        <div style={{ fontSize: "60px", fontWeight: "bold", color: "#5465FF" }}>
          {" "}
          {remainingTime}{" "}
        </div>
        <div style={{ color: "#64748B" }}> seconds </div>
      </div>
    );
  };

  const handleMatchFound = async (room_id) => {
    await delay(1500)
    navigate("/room", {
      state: {
        user: location.state.user,
        room_id: room_id,
        difficultyLevel: location.state.difficultyLevel,
        matched: true,
        is_live: true,
      },
    });
  };

  const handleNoMatchFound = () => {
    // Disconnect all listeners
    socket.disconnect();
    setIsModalOpen(true);
  };

  const handleWaitForMatch = () => {
    socket.disconnect();
    setIsModalOpen(false);
    setKey((previousKey) => previousKey + 1);
    window.location.reload(false);
  };

  const handleChangeLevel = () => {
    setIsModalOpen(false);
    navigate("/landing", { state: { user: location.state.user } });

    // Disconnect all listeners
    socket.disconnect();
  };

  const handleLeaveQueue = () => {
    setIsModalOpen(false);
    navigate("/landing", { state: { user: location.state.user } });
    // Disconnect all listeners
    socket.disconnect();
  };

  return (
    <div>
      <NavigationBar isAuthenticated={true} user={location.state.user} />
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{ marginTop: "8%" }}
      >
        <CountdownCircleTimer
          key={key}
          isPlaying
          duration={30}
          colors={["#5465FF", "#E2FDFF"]}
          colorsTime={[30, 0]}
          size={300}
          strokeWidth={10}
          onComplete={handleNoMatchFound}
        >
          {renderTime}
        </CountdownCircleTimer>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{ marginTop: "2%" }}
      >
        <h2 className="text-xl font-normal leading-normal mt-0 mb-2 text-slate-500">Matching you with another student...</h2>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{ marginTop: "1%" }}
      >
        <Button variant="outlined" onClick={handleLeaveQueue}>
          Cancel
        </Button>
      </Box>

      {/* Match Failure */}
      <Modal open={isModalOpen} aria-labelledby="modal-modal-title">
        <Box sx={modalStyle}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Typography id="modal-modal-title" variant="h5" component="h2">
              No match found!
            </Typography>
          </Box>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Unfortunately, we could not find you a match.
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"column"}
            style={{ paddingTop: "5%" }}
          >
            <div style={{ marginBottom: "2%" }}>
              <Button
                style={buttonStyle}
                variant={"outlined"}
                onClick={handleWaitForMatch}
              >
                Wait for another 30 seconds
              </Button>
            </div>
            <div style={{ marginBottom: "2%" }}>
              <Button
                style={buttonStyle}
                variant={"outlined"}
                onClick={handleChangeLevel}
              >
                Select another difficulty level
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default MatchingPage;
