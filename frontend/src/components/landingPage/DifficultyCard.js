import {
  Typography, Grid, Card, CardHeader, CardContent, CardActions, Box, Button
} from '@mui/material';
import { beginnerQuestions, intermediateQuestions, expertQuestions } from './CommonQuestions';


const DifficultyCard = ({ difficulty, selected, handleDifficultyLevel }) => {

  var bgColor = '#D1EAFF'
  if (difficulty === "Beginner") {
    bgColor = '#EAEEFF'
  } else if (difficulty === "Intermediate") {
    bgColor = '#EAEEFF'
  } else {
    bgColor = '#EAEEFF'
  }

  return (
    // Enterprise card is full width at sm breakpoint
    <Grid
      item
      key={difficulty}
      xs={12}
      sm={6}
      md={4}
    >
      <Card sx={{
        borderRadius: 3,
      }}>
        <CardHeader
          title={difficulty}
          titleTypographyProps={{ align: 'center', variant: 'h6' }}
          subheaderTypographyProps={{
            align: 'center',
          }}
          sx={{
            backgroundColor: bgColor,
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              mb: 2,
            }}
          >
            {/* <Typography component="h2" variant="h6" color="text.primary">
                Questions Like...
                </Typography> */}
            <Typography variant="subtitle1">
              Questions Like...
            </Typography>
          </Box>
          <ul>
            {difficulty === "Beginner" ?
              beginnerQuestions.map((qnsTitle) => {
                return (
                  <Typography
                    component="li"
                    variant="subtitle2"
                    color="text.secondary"
                    align="center"
                    key={qnsTitle}
                    sx={{
                      my: 1,
                    }}
                  >
                    {qnsTitle}
                  </Typography>
                )
              })
              :
              difficulty === "Intermediate" ?
                intermediateQuestions.map((qnsTitle) => {
                  return (
                    <Typography
                      component="li"
                      variant="subtitle2"
                      color="text.secondary"
                      align="center"
                      key={qnsTitle}
                      sx={{
                        my: 1,
                      }}
                    >
                      {qnsTitle}
                    </Typography>
                  )
                })
                :
                expertQuestions.map((qnsTitle) => {
                  return (
                    <Typography
                      component="li"
                      variant="subtitle2"
                      color="text.secondary"
                      align="center"
                      key={qnsTitle}
                      sx={{
                        my: 1,
                      }}
                    >
                      {qnsTitle}
                    </Typography>
                  )
                })
            }
          </ul>
        </CardContent>
        <CardActions>
          {/* <Button fullWidth variant={tier.buttonVariant}>
                {tier.buttonText}
            </Button> */}
          <Button
            fullWidth
            variant={selected ? "contained" : "outlined"}
            onClick={e => handleDifficultyLevel(e)}
            value={difficulty.toLowerCase()}
          >
            Select
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default DifficultyCard;
