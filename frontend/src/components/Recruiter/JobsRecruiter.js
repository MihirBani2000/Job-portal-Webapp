import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';


const JobsRecruiter = (props) => {
    const userType = localStorage.getItem("Type");

    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    useEffect(() => {
        // Anything in here is fired on component mount.
        console.log("inside useeffect, jobs recruiter", localStorage.getItem("Token"));
        axios({
            method: "GET",
            url: `/recruiter/jobs`,
            headers: {
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("jobs recuiter", response.data)
            setJobs(response.data)
        }).catch(error => {
            if (error) {
                console.log("recruiter jobs error", error.response);
                // setIsError(true);
                // setErrors(error.response.data);
            }
        });
        // axios.get('http://localhost:4000/recruiter/jobs')
        //     .then(response => {
        //         setJobs(response.data)
        //         // this.setState({ users: response.data, sortedUsers: response.data });
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
    }, [])

    // const sortChange = () => {
    //     /**
    //      *      Note that this is sorting only at front-end.
    //      */
    //     var array = this.state.users;
    //     var flag = this.state.sortName;
    //     array.sort(function (a, b) {
    //         if (a.date != undefined && b.date != undefined) {
    //             return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
    //         }
    //         else {
    //             return 1;
    //         }
    //     });
    //     this.setState({
    //         users: array,
    //         sortName: !this.state.sortName,
    //     })
    // }

    // const renderIcon = () => {
    //     if (this.state.sortName) {
    //         return (
    //             <ArrowDownwardIcon />
    //         )
    //     }
    //     else {
    //         return (
    //             <ArrowUpwardIcon />
    //         )
    //     }
    // }
    if (userType !== 'recruiter') {
        alert(`Forbidden.`);
        window.location.replace("http://localhost:3000/")
    }
    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>Filters</h3>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={9} lg={9}>
                    <List component="nav" aria-label="mailbox folders">
                        <TextField
                            id="standard-basic"
                            label="Search"
                            fullWidth={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </List>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">

                        <ListItem button>
                            <form noValidate autoComplete="off">
                                <label>Salary</label>
                                <TextField id="standard-basic" label="Enter Min" fullWidth={true} />
                                <TextField id="standard-basic" label="Enter Max" fullWidth={true} />
                            </form>
                        </ListItem>
                        <Divider />
                        <ListItem button divider>
                            <Autocomplete
                                id="combo-box-demo"
                                options={jobs}
                                getOptionLabel={(option) => option.name}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Select Names" variant="outlined" />}
                            />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={9} lg={9}>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {/* <Button
                                        onClick={this.sortChange}
                                        >
                                            {this.renderIcon()}
                                        </Button> */}
                                        Title
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobs.map((job, ind) => (
                                    <TableRow key={ind}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.DOApp}</TableCell>
                                        <TableCell>{job.maxApplicants}</TableCell>
                                        <TableCell>{job.maxPositions}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default JobsRecruiter;