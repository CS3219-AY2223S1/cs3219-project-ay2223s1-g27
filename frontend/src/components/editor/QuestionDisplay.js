import { Box } from "@mui/material";

export default function QuestionDisplay({content}) {
    return <Box sx={{maxWidth:'45vw', minWidth:'45vw'}}> 
             <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
           </Box>
    // <div className="px-4 py-2">
    //     <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
    // </div>
}
