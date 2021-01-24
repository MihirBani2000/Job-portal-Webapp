import React, { useState } from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    formControl: {
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


const AddJob = () => {
    const classes = useStyles();

    const [title, setTitle] = useState('')
    const [maxApplicants, setMaxApplicants] = useState(null)
    const [maxPositions, setMaxPositions] = useState(null)
    const [duration, setDuration] = useState('')
    const [salary, setSalary] = useState('')
    const [DOApp, setDOApp] = useState(null)
    const [typeOfJob, setTypeOfJob] = useState('')
    const [skill, setSkill] = useState('');
    const [skillsList, setSkillsList] = useState([]);
    const [errors, setErrors] = useState({})
    const [isError, setIsError] = useState(false)

    // getting stored data from localstorage
    const name = localStorage.getItem("Name");
    const id = localStorage.getItem("Id");
    const userType = localStorage.getItem("Type");
    const email = localStorage.getItem("Email");


    const onChangeTitle = (event) => {
        setTitle(event.target.value);
    }
    const onChangeDuration = (event) => {
        setDuration(event.target.value);
    }
    const onChangeMaxApplicants = (event) => {
        setMaxApplicants(event.target.value);
    }
    const onChangeMaxPositions = (event) => {
        setMaxPositions(event.target.value);
    }
    const onChangeSkill = (event) => {
        setSkill(event.target.value);
    };
    const onChangeSalary = (event) => {
        setSalary(event.target.value);
    };
    const onChangeTypeOfJob = (event) => {
        setTypeOfJob(event.target.value);
    };
    const onChangeDOApp = (event) => {
        setDOApp(event.target.value);
    };
    const handleSkillDelete = (chipToDelete) => () => {
        setSkillsList((chips) => chips.filter((chip) => chip !== chipToDelete));
    };
    const handleSkillClick = (clickedChip) => () => {
        setSkill(clickedChip)
        setSkillsList((chips) => chips.filter((chip) => chip !== clickedChip));
    };
    const handleAddSkill = () => {
        if (skill === '') {
            return
        }
        console.log(skill)
        setSkillsList(skillsList.concat(skill));
        setSkill('');
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const newJob = {
            title: title,
            recruiter: {
                id: id,
                name: name,
                email: email
            },
            maxApplicants: maxApplicants,
            maxPositions: maxPositions,
            DOApp: DOApp,
            skills: skillsList,
            typeOfJob: typeOfJob,
            duration: duration,
            salary: salary,
        };

        console.log("inside onSubmit add new job, newJob", newJob, localStorage.getItem("Token"))
        axios({
            method: "POST",
            url: `/recruiter/jobs/addnew`,
            data: newJob,
            headers: {
                'Content-Type': 'application/json',
                // 'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("after submit", response.data)
            alert(`Successfully added job titled - ${response.data.title}.`);
            window.location.replace("http://localhost:3000/recruiter/dashboard");
        }).catch(error => {
            if (error) {
                console.log("hi newjob error", error.response);
                setIsError(true);
                setErrors(error.response.data);
            }
        });
    }

    if (userType !== 'recruiter') {
        alert(`Forbidden.`);
        window.location.replace("http://localhost:3000/")
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Add a Job
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="title"
                                name="title"
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                autoFocus
                                onChange={onChangeTitle}
                                error={errors.title}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="maxApplicants"
                                label="Max no of Applicants"
                                name="maxApplicants"
                                type="Number"
                                autoComplete="maxApplicants"
                                placeholder="from 0 to ..."
                                onChange={onChangeMaxApplicants}
                                error={errors.maxApplicants}
                                helperText={errors.maxApplicants}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="maxPositions"
                                label="Max no of Positions"
                                type="Number"
                                id="maxPositions"
                                autoComplete="maxPositions"
                                onChange={onChangeMaxPositions}
                                placeholder="from 0 to ..."
                                error={errors.maxPositions}
                                helperText={errors.maxPositions}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                required
                                variant="outlined"
                                id="typeOfJob"
                                label="Job Type"
                                className={classes.formControl}
                                value={typeOfJob}
                                onChange={onChangeTypeOfJob}
                                error={errors.typeOfJob}
                                helperText={errors.typeOfJob}
                            >
                                <MenuItem value="" disabled><em>Choose a type</em></MenuItem>
                                <MenuItem value={"part-time"}>Part Time</MenuItem>
                                <MenuItem value={"full-time"}>Full Time</MenuItem>
                                <MenuItem value={"work from home"}>Work from Home</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component="h6" variant="h6">
                                Required Skills:
                                </Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                // required
                                fullWidth
                                id="skill"
                                label="Add a skill one be one, press +"
                                placeholder="Python, C, ..."
                                name="skill"
                                onChange={onChangeSkill}
                                value={skill}
                                error={errors.skills}
                                helperText={errors.skills}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="add"
                                                onClick={handleAddSkill}
                                                onMouseDown={e => e.preventDefault()}
                                                edge="end"
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper component="ul" className={classes.root}>
                                {skillsList.map((skill) => {
                                    return (
                                        <li key={skill}>
                                            <Chip
                                                label={skill}
                                                onDelete={handleSkillDelete(skill)}
                                                onClick={handleSkillClick(skill)}
                                                className={classes.chip}
                                                color='primary'
                                            />
                                        </li>
                                    );
                                })}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="DOApp"
                                label="Last date of Application"
                                id="DOApp"
                                type="datetime-local"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={onChangeDOApp}
                                placeholder="date"
                                error={errors.DOApp}
                                helperText={errors.DOApp}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                variant="outlined"
                                id="duration"
                                label="Job Duration"
                                className={classes.formControl}
                                value={duration}
                                onChange={onChangeDuration}
                                error={errors.duration}
                                helperText={errors.duration}
                                autoComplete="duration"

                            >
                                {/* <MenuItem value="" disabled><em>In months</em></MenuItem> */}
                                <MenuItem value={0}>0 (Undefined)</MenuItem>
                                <MenuItem value={1}>1 month</MenuItem>
                                <MenuItem value={2}>2 months</MenuItem>
                                <MenuItem value={3}>3 months</MenuItem>
                                <MenuItem value={4}>4 months</MenuItem>
                                <MenuItem value={5}>5 months</MenuItem>
                                <MenuItem value={6}>6 months</MenuItem>
                                <MenuItem value={7}>7 months</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="salary"
                                label="Salary of job"
                                placeholder="0 to ... (numeric)"
                                variant="outlined"
                                required
                                fullWidth
                                name="salary"
                                type="Number"
                                onChange={onChangeSalary}
                                autoComplete="salary"
                                error={errors.salary}
                                helperText={errors.salary}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Add
                    </Button>

                </form>
            </div>
        </Container>
    );
}

export default AddJob;