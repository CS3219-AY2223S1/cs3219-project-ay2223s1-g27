import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Pagination,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Table,
  Typography,
} from "@mui/material";
import axiosApiInstance from "../axiosApiInstance";
import { URL_USER_SVC_QUESTIONHISTORY } from "../configs";
import { jwtDecode } from "../util/auth";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function AttemptsPage() {
  const [cookies] = useCookies();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  const handlePagination = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    axiosApiInstance
      .get(URL_USER_SVC_QUESTIONHISTORY, {
        params: {
          uid: jwtDecode(cookies["refresh_token"]).id,
          limit: 10,
          offset: (page - 1) * 10,
        },
      })
      .then((res) => {
        setRows(res.data.rows);
        setCount(Math.ceil(res.data.totalCount / 10));
      });
  }, [page, cookies]);

  const handleBackOnClick = () => {
    navigate("/landing"); 
  }

  return (
    <div>
      <NavigationBar isAuthenticated={true} />
      <Box display={"flex"}
        flexDirection={"row"}
        justifyContent={"flex-start"} 
        style={{ marginLeft:"2%", marginTop:"2%" }}>
        <Button  
          startIcon={<ArrowBackIosIcon/>} 
          onClick={handleBackOnClick}
        >
          Back
        </Button>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        style={{ marginTop: "3%" }}
      >
        <Typography variant="h4">
          <h1 style={{fontSize:'50px', marginBottom: "3%"}}> Past Attempts </h1>
        </Typography>
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Room ID</TableCell>
                  <TableCell align="right">Partner</TableCell>
                  <TableCell align="right">Created at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link
                        to="/room"
                        state={{
                          cache: row.question_history?.questions,
                          is_live: false,
                          difficultyLevel: row.difficulty_level,
                          room_id: row.room_id
                        }}
                      >
                        {row.room_id}
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      {
                        row.usernames[0] === jwtDecode(cookies["refresh_token"]).username 
                          ? row.usernames[1] 
                          : row.usernames[0]
                      }
                    </TableCell>
                    <TableCell align="right">{row.created_at.split('T')[0]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Pagination count={count} onChange={handlePagination} />
      </Box>
    </div>
  );
}

export default AttemptsPage;
