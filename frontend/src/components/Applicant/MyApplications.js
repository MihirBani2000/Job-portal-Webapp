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
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Slider from '@material-ui/core/Slider';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";


const iterateOver = (array) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'recruiter', numeric: false, disablePadding: false, label: 'Recruiter' },
    { id: 'salary', numeric: true, disablePadding: false, label: 'Salary' },
    { id: 'duration', numeric: true, disablePadding: false, label: 'Duration' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date of Join' },
    { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'rating', numeric: true, disablePadding: false, label: 'Rating' },
];

const TableTitles = (props) => {
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

const ApplicationsList = () => {
    const classes = useStyles();
    const userType = localStorage.getItem("Type");
    const applicantId = localStorage.getItem("Id");
    // console.log("applicantId", applicantId)

    // console.log("token", localStorage.getItem("Token"))
    if (userType !== 'applicant') {
        alert(`Forbidden.`);
        window.location.replace("http://localhost:3000/")
    }

    // const [sop, setSop] = useState("");
    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [savedFilteredJobs, setSavedFilteredJobs] = useState([])

    const [searchVal, setSearchVal] = useState("")
    const [isApplyFilter, setIsApplyFilter] = useState(false)
    const [jobTypeFilter, setJobTypeFilter] = useState("")
    const [durationFilter, setDurationFilter] = useState("")
    const [salaryFilter, setSalaryFilter] = useState([0, 0])

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({});

    const salaryMarks = [
        { value: 0, label: '0 K' },
        { value: 100, label: '100 K' },
        { value: 200, label: '200 K' },
        { value: 300, label: '300 K' },
    ]

    const onChangeSalaryFilter = (event, newValue) => {
        setSalaryFilter(newValue)
    }
    const onChangeJobTypeFilter = (event) => {
        setJobTypeFilter(event.target.value)
    }
    const onChangeDurationFilter = (event) => {
        setDurationFilter(event.target.value)
    }
    const onRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filter
    const applyFilter = (tempJobs) => {
        let newJobs = [];
        let sFmin = salaryFilter[0]
        let sFmax = salaryFilter[1]
        tempJobs.forEach((job, id) => {
            let toPush = true;
            if (parseInt(job.jobId.salary) < (sFmin * 1000))
                toPush = false;
            else if (!(sFmax === 0) && parseInt(job.jobId.salary) > (sFmax * 1000))
                toPush = false;
            else if (!Validator.isEmpty(jobTypeFilter) && job.jobId.typeOfJob !== jobTypeFilter)
                toPush = false;
            else if (!Validator.isEmpty(durationFilter.toString()) && parseInt(job.jobId.duration) >= parseInt(durationFilter))
                toPush = false;

            if (toPush) {
                let toCopyJob = _.cloneDeep(job)
                newJobs.push(toCopyJob);
            }
        })
        console.log("newJobs filtered", newJobs)
        setFilteredJobs(_.cloneDeep(newJobs));
        setIsError(false);
        setErrors({});
    }

    const onClearFilter = () => {
        console.log("clear filter clicked");
        setDurationFilter("")
        setJobTypeFilter("")
        setSearchVal("")
        setSalaryFilter([0, 0])
        setIsApplyFilter(false)
        setFilteredJobs(_.cloneDeep(jobs))
    }

    const onClickFilter = () => {
        console.log("clicked filter")
        setIsApplyFilter(true)
        applyFilter(jobs)
    };
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

    const getData = () => {
        axios({
            method: "GET",
            url: '/applicant/jobs/applied',
            headers: {
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("inside getData", response.data)
            if (isApplyFilter)
                applyFilter([...response.data]);
            else {
                setFilteredJobs([...response.data]);
                setJobs([...response.data]);
            }
        }).catch(error => {
            if (error) {
                console.log("hi newjob error", error.response);
                setIsError(true);
                setErrors(error.response.data);
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
                        My Applications
            </Typography>
                    <Tooltip title="Clear filter">
                        <IconButton aria-label="clear filter" onClick={onClearFilter}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Apply filter">
                        <IconButton aria-label="apply filter" onClick={onClickFilter}>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                        <Typography
                            align='center'
                            id="salary-slider"
                            variant='h6'
                            className={classes.textField}
                            gutterBottom
                        >
                            Salary Range
                            <Typography
                                align='center'
                            // gutterBottom
                            >(Monthly, in thousands)</Typography>
                            <Slider
                                min={0}
                                max={300}
                                step={5}
                                style={{ width: "80%" }}
                                value={salaryFilter}
                                onChange={onChangeSalaryFilter}
                                valueLabelDisplay="on"
                                aria-labelledby="range-slider"
                                marks={salaryMarks}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            id="typeOfJob"
                            className={classes.textField}
                            label="Job Type"
                            value={jobTypeFilter}
                            onChange={onChangeJobTypeFilter}
                        >
                            <MenuItem value={"part-time"}>Part Time</MenuItem>
                            <MenuItem value={"full-time"}>Full Time</MenuItem>
                            <MenuItem value={"work from home"}>Work from Home</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            id="durationFilter"
                            className={classes.textField}
                            label="Duration"
                            value={durationFilter}
                            onChange={onChangeDurationFilter}
                        >
                            <MenuItem value="" disabled><em>Months</em></MenuItem>
                            <MenuItem value={1}>Till 1</MenuItem>
                            <MenuItem value={2}>Till 2</MenuItem>
                            <MenuItem value={3}>Till 3</MenuItem>
                            <MenuItem value={4}>Till 4</MenuItem>
                            <MenuItem value={5}>Till 5</MenuItem>
                            <MenuItem value={6}>Till 6</MenuItem>
                            <MenuItem value={7}>Till 7</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>


                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <TableTitles
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={onRequestSort}
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
                                                    {row.jobId.title}
                                                </TableCell>
                                                <TableCell align="center">{row.jobId.recruiter.name}</TableCell>
                                                <TableCell align="center">{row.jobId.salary}</TableCell>
                                                <TableCell align="center">{row.jobId.duration}</TableCell>
                                                <TableCell align="center">{row.DOJ ? row.DOJ.substring(0, 10) : 'NA'}</TableCell>
                                                <TableCell align="left">{row.jobId.typeOfJob}</TableCell>
                                                {
                                                    row.status === 'accepted' &&
                                                    <TableCell align="left" style={{ color: 'green' }}>{row.status.toUpperCase()}</TableCell>
                                                }
                                                {
                                                    row.status === 'shortlisted' &&
                                                    <TableCell align="left" style={{ color: 'blue' }}>{row.status.toUpperCase()}</TableCell>
                                                }
                                                {
                                                    row.status === 'applied' &&
                                                    <TableCell align="left" >{row.status.toUpperCase()}</TableCell>
                                                }
                                                {
                                                    row.status === 'rejected' &&
                                                    <TableCell align="left" style={{ color: 'red' }}>{row.status.toUpperCase()}</TableCell>
                                                }
                                                <TableCell align="center">{row.jobId.rating}</TableCell>

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

export default ApplicationsList;