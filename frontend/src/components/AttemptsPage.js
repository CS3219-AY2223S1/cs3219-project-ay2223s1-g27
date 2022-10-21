import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { Box, Pagination, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Table, Typography } from "@mui/material";
import axiosApiInstance from "../axiosApiInstance";
import { URL_USER_SVC_QUESTIONHISTORY } from "../configs";
import { jwtDecode } from "../util/auth";
import { useCookies } from "react-cookie";

function AttemptsPage() {
    const [cookies] = useCookies();
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1);

    const handlePagination = (_, value) => {
        setPage(value);
    }

    useEffect(() => {
        axiosApiInstance.get(URL_USER_SVC_QUESTIONHISTORY, { params: { 
            uid: jwtDecode(cookies["refresh_token"]).id,
            limit: 10,
            offset: (page - 1) * 10,
            pageSize: 10,
         } }).then(
            res => {
                setRows(res.data.rows)
                setCount(Math.ceil(res.data.totalCount / 10))
            }
        );
    }, [page]);

    return (
        <div>
            <NavigationBar isAuthenticated={true} /> 
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} style={{marginTop: "3%"}}>
                <Typography variant="h4">
                    Past Attempts
                </Typography>
                <Box>
                    <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Room ID</TableCell>
                            <TableCell align="right">Partner</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow
                            key={idx}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.room_id}
                            </TableCell>
                            <TableCell align="right">{row._id}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Box>
                <Pagination count={count} onChange={handlePagination} />
            </Box>
        </div>
    )
}

export default AttemptsPage;
