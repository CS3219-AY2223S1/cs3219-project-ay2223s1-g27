import {
    Box,
    Button
} from "@mui/material";
import { useState } from "react";
import GroupIcon from '@mui/icons-material/Group'; 
import NavigationBar from "./NavigationBar";  
import { useNavigate } from "react-router-dom";
import HistoryIcon from '@mui/icons-material/History';
import { Typography, Container, Grid } from '@mui/material';
import DifficultyCard from "./landingPage/DifficultyCard";

function LandingPage() {   
    const [difficultyLevel, setDifficultyLevel] = useState(""); 
    const [selectBeginner, setSelectBeginner] = useState(false);
    const [selectIntermediate, setSelectIntermediate] = useState(false);
    const [selectExpert, setSelectExpert] = useState(false);  

    const handleDifficultyLevel = (event) => {  
        console.log(event.target.value);
        var levelSelected = event.target.value;
        setDifficultyLevel(levelSelected);
        if (levelSelected === "beginner") {
            setSelectBeginner(true);
            setSelectIntermediate(false);
            setSelectExpert(false);
        } else if (levelSelected === "intermediate") {
            setSelectBeginner(false);
            setSelectIntermediate(true);
            setSelectExpert(false);
        } else if (levelSelected === "expert") {
            setSelectBeginner(false);
            setSelectIntermediate(false);
            setSelectExpert(true);
        }
    }  

    const isDifficultySelected = () => {
        if(difficultyLevel !== "") {
            return true;
        } else {
            return false;
        }
    }

    const navigate = useNavigate();
    const handleFindMatch = (event) => {
        // Navigates to MatchingPage
        navigate("/matching", {state: { difficultyLevel: difficultyLevel }}); 
    }

    const handlePastAttempts = () => { 
        // Navigates to AttemptsPage
        navigate("/attempts"); 
    }
    return (
        <>
        <NavigationBar isAuthenticated={true} />
        <Box display={"flex"} justifyContent={"center"}> 
            <Box display={"flex"} flexDirection={"column"} width={"50%"}>
                {/* <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>  */}
                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Choose Your Difficulty Level
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary" component="p">
                        You will be matched with a random user who desires the same difficulty level!
                    </Typography>
                    {/* <h1 style={{fontSize:'50px', marginBottom: "3%"}}>Choose Your Difficulty Level</h1> */}
                </Container>
                <Container maxWidth="md" component="main">
                    <Grid container spacing={5} alignItems="flex-end">
                        {console.log(selectBeginner)}
                        <DifficultyCard difficulty="Beginner" selected={selectBeginner} handleDifficultyLevel={e => handleDifficultyLevel(e)}/>
                        <DifficultyCard difficulty="Intermediate" selected={selectIntermediate} handleDifficultyLevel={e => handleDifficultyLevel(e)}/>
                        <DifficultyCard difficulty="Expert" selected={selectExpert} handleDifficultyLevel={e => handleDifficultyLevel(e)}/>
                    </Grid>
                </Container>
                {/* </Box> */}
                {/* Old set of btns */}
                {/* <div style={{marginTop:'10px', marginBottom: '10px'}}>
                <Box display={"flex"} flexDirection={"column"} justifyContent={"space-evenly"} alignItems={"center"}> 
                    <Button 
                        variant={selectBeginner ? "contained" : "outlined"} 
                        onClick={handleDifficultyLevel} 
                        style={{borderRadius: "8px", marginBottom:'1%', maxWidth: '50%', minWidth: '50%', minHeight: '5%', maxHeight: '5%'}} 
                        value="beginner"
                    >
                        Beginner
                    </Button>
                    <Button 
                        variant={selectIntermediate ? "contained" : "outlined"} 
                        onClick={handleDifficultyLevel} 
                        style={{borderRadius: "8px", marginBottom:'1%', maxWidth: '50%', minWidth: '50%', minHeight: '5%', maxHeight: '5%'}} 
                        value="intermediate"
                    >
                        Intermediate
                    </Button>
                    <Button 
                        variant={selectExpert ? "contained" : "outlined"} 
                        onClick={handleDifficultyLevel} 
                        style={{borderRadius: "8px", maxWidth: '50%', minWidth: '50%', minHeight: '5%', maxHeight: '5%'}} 
                        value="expert"
                    >
                        Expert
                    </Button>
                </Box>
                </div> */}
                {/* Old set of btns */}
                <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} style={{ paddingTop: "5%"}}>
                    <Button 
                        disabled={!isDifficultySelected()} 
                        variant={"contained"} 
                        color="primary" 
                        endIcon={<GroupIcon/>} 
                        style={{fontSize: '14px'}} 
                        onClick={handleFindMatch}
                    >
                        Find Match
                    </Button>
                </Box>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} style={{ paddingTop: "2%"}}>
                    <Button  
                        variant={"outlined"} 
                        color="primary" 
                        endIcon={<HistoryIcon/>} 
                        style={{fontSize: '14px'}} 
                        onClick={handlePastAttempts}
                    >
                        View Past Attempts
                    </Button>
                </Box>
            </Box>
        </Box> 
        </> 
    )
}

export default LandingPage;