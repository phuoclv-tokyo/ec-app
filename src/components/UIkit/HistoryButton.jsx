import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/Styles';

const useStyles = makeStyles((theme) => ({
    "button": {
        backgroundColor: "#4dd0e1",
        color: "#000",
        fontSize: 16,
        height: 48,
        width: 256,
        marginBottom: 16,
        [theme.breakpoints.down('sm')]: {
            width: '70px',
            height: '26px',
            fontSize: 7,
            marginBottom: 0,
            padding: 0,
        },
        [theme.breakpoints.up('sm')]: {
            // width: '100%'
        }
    }
}));

const HistoryButton = (props) => {
    const classes = useStyles();
    return (
        <Button className={classes.button} variant="contained" onClick={() => props.onClick()} >
            {props.label}
        </Button>
    )
}

export default HistoryButton
