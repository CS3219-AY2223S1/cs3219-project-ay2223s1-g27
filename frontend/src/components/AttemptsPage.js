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
  Container,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.black,
      fontWeight: "bold"
    },
  }));

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
    <div style={{ height: "100%" }}>
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
        width={"100%"}
      >
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 1, pb: 1 }}>
            <Typography
                component="h1"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Past Attempts
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" component="p" sx={{ mb: 1 }}>
                View the history of your attempts here!
            </Typography>
        </Container>
        <Box>
          <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 3 }}>
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableHead sx={{fontWeight: 'bold'}}>
                <TableRow>
                  <StyledTableCell>Room ID</StyledTableCell>
                  <StyledTableCell align="right">Partner</StyledTableCell>
                  <StyledTableCell align="right">Created at</StyledTableCell>
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
