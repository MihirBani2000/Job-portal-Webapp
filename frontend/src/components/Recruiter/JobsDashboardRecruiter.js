import React, { useState, useEffect } from 'react';
import Validator from 'validator';
import _ from 'lodash';
import axios from 'axios';
import FuzzySearch from "fuzzy-search";
import { createMuiTheme, withStyles, ThemeProvider, lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import EditIcon from '@material-ui/icons/Edit';
import TableRow from '@material-ui/core/TableRow';
import Slider from '@material-ui/core/Slider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import Divider from '@material-ui/core/Divider';
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";


const iterateOver = (array) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'DOP', numeric: false, disablePadding: false, label: 'Date Of Posting' },
    { id: 'numApp', numeric: true, disablePadding: false, label: 'Num of Applicants' },
    { id: 'numRemPos', numeric: true, disablePadding: false, label: 'Num of Vacancy' },
    { id: 'DOApp', numeric: false, disablePadding: false, label: 'Deadline' },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
];

const TableTitles = () => {
    return (
        <TableHead>
            <TableRow>
                {
                    headCells.map((header) => (
                        <TableCell
                            key={header.id}
                            align='center'
                            padding='default'
                        >
                            <Typography variant='h6' component='h6'>
                                {header.label}
                            </Typography>
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    textField: {
        marginLeft: 20,
        marginTop: 10,
        width: '90%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    highlight:
    {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.light,
    },
    title: {
        flex: '1 1 100%',
    },
}));

const JobsDashboardRecruiter = () => {
    const classes = useStyles();
    const userType = localStorage.getItem("Type");
    if (userType !== 'recruiter') {
        alert(`Forbidden.`);
        window.location.replace("http://localhost:3000/")
    }

    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [savedFilteredJobs, setSavedFilteredJobs] = useState([])

    const [searchVal, setSearchVal] = useState("")

    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({});

    const onChangeSearchVal = (e) => {
        setSearchVal(e.target.value)
    };
    const clearSearchTitle = () => {
        console.log("clicked clicked", savedFilteredJobs)
        setSearchVal("")
        setFilteredJobs(_.cloneDeep(jobs))
    };
    const onSearchTitle = () => {
        console.log("searchVal", searchVal)
        setSavedFilteredJobs(_.cloneDeep(filteredJobs))

        if (searchVal && !Validator.isEmpty(searchVal)) {
            const searcher = new FuzzySearch(jobs, ['title'], {
                caseSensitive: false,
                sort: true
            });
            let searchedJobs = searcher.search(searchVal)
            setFilteredJobs(_.cloneDeep(searchedJobs))
        }
    }

    const handleDelete = (e) => {
        let jobId = 0
        console.log("e", e.target, e.target.parentNode)
        if (e.target.id) {
            jobId = e.target.id
        } else if (e.target.parentNode.id) {
            jobId = e.target.parentNode.id
        }
        console.log('to delete', jobId)

        axios({
            method: "delete",
            url: `/recruiter/jobs/${jobId}/delete`,
            headers: {
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("deleted", response.data)
            window.location.reload()
        }).catch(error => {
            if (error) {
                console.log("hi delete error", error.response);
                setIsError(true);
                setErrors(error.response);
                alert(error.response)
            }
        });
    }

    const getData = () => {
        // console.log("i")
        axios({
            method: "GET",
            url: '/recruiter/jobs/',
            headers: {
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("inside getData", response.data)
            setFilteredJobs([...response.data]);
            setJobs([...response.data]);
        }).catch(error => {
            if (error) {
                console.log("hi newjob error", error.response);
                setIsError(true);
                setErrors(error.response);
            }
        });
    }
    console.log("jobs", jobs)
    console.log("FilteredJobs", filteredJobs)

    useEffect(getData, [])

    return (
        <div className={classes.root}>

            <Paper className={classes.paper}>
                <Toolbar className={classes.highlight}>
                    <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
                        My Jobs
                    </Typography>
                </Toolbar>
                <Grid item xs={12} >
                    <TextField
                        className={classes.textField}
                        id="search"
                        autoComplete='search'
                        label="Search by Title"
                        fullWidth={false}
                        value={searchVal}
                        onChange={onChangeSearchVal}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton onClick={clearSearchTitle}>
                                        <ClearIcon />
                                    </IconButton>
                                    <IconButton onClick={onSearchTitle}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <TableTitles
                            classes={classes}
                        />
                        <TableBody>
                            {
                                iterateOver(filteredJobs)
                                    .map((row, index) => {
                                        const labelId = `jobLabel${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                role="radio"
                                                tabIndex={-1}
                                                key={row._id}
                                            >
                                                <TableCell component="th" id={labelId} scope="row" >
                                                    {row.title}
                                                </TableCell>
                                                <TableCell align="center">{row.DOPost.substring(0, 10)}</TableCell>
                                                <TableCell align="center">{row.numApp}</TableCell>
                                                <TableCell align="center">{row.numRemPos}</TableCell>
                                                <TableCell align="center">{row.DOApp.substring(0, 10)}</TableCell>
                                                <TableCell align="center">

                                                </TableCell>

                                                <Button
                                                    id={row._id}
                                                    style={{ marginTop: 10, color: 'purple' }}
                                                    variant='contained' size='small'
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    id={row._id}
                                                    style={{ marginTop: 10, marginLeft: 10, color: 'red' }}
                                                    variant='contained' size='small'
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </Button>

                                            </TableRow>
                                        );
                                    })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div >
    );
}

export default JobsDashboardRecruiter;