import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { Box, Pagination, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Table, Typography } from "@mui/material";

function createData(room_id, partner) {
    return { room_id, partner };
}

const rows = [
    createData('Frozen yoghurt', '123'),
    createData('Frozen yoghurt', '123'),
    createData('Frozen yoghurt', '123'),
];

  
function AttemptsPage() {
    const [page, setPage] = useState(1);

    const handlePagination = (_, value) => {
        setPage(value);
    }

    useEffect(() => {

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
                        {rows.map((row) => (
                            <TableRow
                            key={row.room_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.room_id}
                            </TableCell>
                            <TableCell align="right">{row.partner}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Box>
                <Pagination count={10} onChange={handlePagination} />
            </Box>
        </div>
    )
}

export default AttemptsPage;
