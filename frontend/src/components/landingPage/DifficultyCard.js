import { Typography, Grid, Card, CardHeader, CardContent, CardActions } from '@mui/material';

const DifficultyCard = ({ difficulty }) => {

    return (
        // Enterprise card is full width at sm breakpoint
        <Grid
        item
        key={difficulty}
        xs={12}
        sm={6}
        md={4}
        >
        <Card>
            <CardHeader
            title={difficulty}
            titleTypographyProps={{ align: 'center' }}
            subheaderTypographyProps={{
                align: 'center',
            }}
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
            }}
            />
            <CardContent>
            {/* <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'baseline',
                mb: 2,
                }}
            >
                <Typography component="h2" variant="h3" color="text.primary">
                {difficulty}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                /mo
                </Typography>
            </Box> */}
            <ul>
                
                <Typography
                    component="li"
                    variant="subtitle1"
                    align="center"
                    key="TwoSum"
                >
                    TwoSum
                </Typography>
            </ul>
            </CardContent>
            <CardActions>
            {/* <Button fullWidth variant={tier.buttonVariant}>
                {tier.buttonText}
            </Button> */}
            </CardActions>
        </Card>
        </Grid>
    );
}

export default DifficultyCard;