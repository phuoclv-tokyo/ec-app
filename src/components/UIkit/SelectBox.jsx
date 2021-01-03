import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/Styles';

const useStyles = makeStyles({
    "formControl": {
        marginBottom: 16,
        minWidth: 128,
        width: "100%"
    }
})

const SelectBox = (props) => {
    const classes = useStyles();
    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                required={props.required} value={props.value}
                onChange={(event) => props.select(event.target.value)}
            >
                {props.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectBox