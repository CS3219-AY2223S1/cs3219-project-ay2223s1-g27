import { Box } from "@mui/material";

export default function QuestionDisplay({ content }) {
  return <Box sx={{ maxWidth: '45vw', minWidth: '45vw', p: 3 }}>
    <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
  </Box>
}
