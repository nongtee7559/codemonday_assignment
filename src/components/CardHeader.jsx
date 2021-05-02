import { Grid, Paper, Typography } from '@material-ui/core';
import React from 'react'

function getNumber(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                : Math.abs(Number(labelValue));
}

export default function CardHeader(props) {
    const { classes, label, value } = props;
    return (
        <Grid item xs={12} sm={4}>
            <Paper className={classes.paper} display="flex">
                <Grid container>
                    <Grid item md={4} xs={12} className={classes.alignSelfCenter}>
                        {props.children}
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Typography variant="h3">
                            {getNumber(value).toString()}
                        </Typography>
                        <Typography variant="h5" className={classes.ligthGray}>
                            {label}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}
