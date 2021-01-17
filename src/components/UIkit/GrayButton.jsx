import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    "button": {
        backgroundColor: theme.palette.grey[300],
        fontSize: 16,
        height: 48,
        width: 256,
        // borderRadius: "4px",
        marginBottom: 16
    }
}));

const GrayButton = (props) => {
    const classes = useStyles();
    return (
        <Button className={classes.button} variant="contained" onClick={() => props.onClick()} >
            {props.label}
        </Button>
    )
}

export default GrayButton
