import React, { Component, useState } from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Rating from '@material-ui/lab/Rating';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(8)
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    add: {
        margin: theme.spacing(0, 3, 0),
    },
    chip: {
        margin: theme.spacing(0.5),
        color: 'primary'
    },
}));

const RegisterApplicant = () => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skill, setSkill] = useState('');
    const [skillsList, setSkillsList] = useState([
        // 'Angular', 'JS', 'C'
    ]);
    // const [rating, setRating] = useState(0);
    const [education, setEducation] = useState({
        instituteName: '',
        startYear: '',
        endYear: ''
    });
    const [educationList, setEducationList] = useState([]);

    const [educationError, setEducationError] = useState("")
    const [startYearError, setStartYearError] = useState("")
    const [endYearError, setEndYearError] = useState("")
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(false);

    const onChangeName = (event) => {
        setName(event.target.value);
    }
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    // skills related
    const onChangeSkill = (event) => {
        setSkill(event.target.value);
    }
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

    // education related
    const onChangeInstitute = (event) => {
        let newEducation = Object.assign({}, education);
        newEducation.instituteName = event.target.value
        setEducation(newEducation);
    }
    const onChangeStartYear = (event) => {
        let newEducation = Object.assign({}, education);
        newEducation.startYear = event.target.value
        setEducation(newEducation);
    }
    const onChangeEndYear = (event) => {
        let newEducation = Object.assign({}, education);
        newEducation.endYear = event.target.value
        setEducation(newEducation);
    }
    const handleEducationDelete = (chipToDelete) => () => {
        setEducationList((chips) => chips.filter((chip) => chip !== chipToDelete));
    };
    const handleEducationClick = (clickedChip) => () => {
        console.log("clicked", clickedChip)
        let newEducation = Object.assign({}, clickedChip);
        setEducation(newEducation)
        setEducationList((chips) => chips.filter((chip) => chip !== clickedChip));
    };
    const checkStartYear = () => {
        const isnum = val => /^\d+$/.test(val);
        if (!isnum(education.startYear))
            return true
        else if (education.startYear.length !== 4)
            return true
        return false
    }
    const checkEndYear = () => {
        const isnum = val => /^\d+$/.test(val);
        if (education.endYear !== '') {
            if (!isnum(education.endYear))
                return true
            else if (education.endYear.length !== 4)
                return true
            else if (education.endYear < education.startYear)
                return true
        }
        return false
    }
    const handleAddEducation = () => {
        if (education.instituteName === '' || education.startYear === '') {
            setEducationError("Please enter the Institute Name, Start Year both")
            setTimeout(() => { setEducationError('') }, 2500)
            // alert("Please enter the Institute Name, Start Year both")
            return
        }
        if (checkStartYear()) {
            setStartYearError("Please enter valid year.")
            setTimeout(() => { setStartYearError('') }, 2500)
            return
        }
        if (checkEndYear()) {
            setEndYearError("Please enter valid year.")
            setTimeout(() => { setEndYearError('') }, 2500)
            return
        }
        console.log(education)
        let newEducation = Object.assign({}, education);
        setEducationList(educationList.concat(newEducation));
        setEducation({
            instituteName: '',
            startYear: '',
            endYear: ''
        });
    };
    // console.log("education", education)

    const onSubmit = (e) => {
        e.preventDefault();
        const newApplicant = {
            name: name,
            email: email,
            password: password,
            education: educationList,
            skills: skillsList,
        };

        console.log("inside onSubmit, register applicant - newApplicant", newApplicant)
        axios({
            method: "POST",
            url: "/auth/register/applicant",
            data: newApplicant,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log("after submit", response.data)
            alert(`Hello ${response.data.applicant.name}! You are registered.
                    Redirect to Login ->`);
            window.location.replace("http://localhost:3000/login");
        }).catch(error => {
            if (error) {
                console.log("hi error", error.response);
                setIsError(true);
                setErrors(error.response.data);
            }
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up - Applicant
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                onChange={onChangeName}
                                error={errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={onChangeEmail}
                                error={errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={onChangePassword}
                                placeholder="Min 6 characters long"
                                error={errors.password}
                                helperText={errors.password}
                            />
                        </Grid>

                        {/* <Grid item xs={12} sm={3}>
                            <Typography component="h6" variant="h6">
                                Rating:
                            </Typography>
                        </Grid> */}
                        {/* <Grid item xs={12} sm={6}>
                            <Rating
                                name="rating"
                                size='large'
                                value={rating}
                                onChange={onChangeRating}
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <Divider component="hr" />
                            <Typography component="h6" variant="h6" >
                                Skills*:
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
                            <Divider component="hr" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography component="h6" variant="h6" >
                                Education*:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography align='right' >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size='small'
                                    className={classes.add}
                                    startIcon={<AddIcon />}
                                    onClick={handleAddEducation}
                                >
                                    Add
                                </Button>
                            </Typography>
                        </Grid>
                        {/* </Grid> */}

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="instituteName"
                                placeholder='IIITH'
                                label="Institute Name"
                                id="instituteName"
                                autoComplete="instituteName"
                                value={education.instituteName}
                                onChange={onChangeInstitute}
                                error={errors.education || educationError}
                                helperText={errors.education}
                                helperText={educationError ? educationError : errors.education}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                placeholder='2000'
                                value={education.startYear}
                                name="startYear"
                                label="Start Year"
                                id="startYear"
                                onChange={onChangeStartYear}
                                error={errors.education || educationError || startYearError}
                                helperText={startYearError ? startYearError : errors.education}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="endYear"
                                label="End Year"
                                value={education.endYear}
                                id="endYear"
                                onChange={onChangeEndYear}
                                error={endYearError}
                                helperText={endYearError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper component="ul" className={classes.root}>
                                {educationList.map((education) => {
                                    return (
                                        <li key={education.instituteName}>
                                            <Chip
                                                label={`${education.instituteName}, ${education.startYear}, ${education.endYear} `}
                                                onDelete={handleEducationDelete(education)}
                                                onClick={handleEducationClick(education)}
                                                className={classes.chip}
                                                color='secondary'
                                            />
                                        </li>
                                    );
                                })}
                            </Paper>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Paper component="ul" className={classes.root}>
                                {educationList.map((education) => {
                                    return (
                                        <li key={education.instituteName}>
                                            <Card className={classes.root}>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="h6">
                                                        {education.instituteName}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" component="p">
                                                        Start : {education.startYear} <br />
                                                        {education.endYear ? `End : ${education.endYear}` : ''}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={handleEducationClick}>
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<ClearIcon />}
                                                        onClick={handleEducationDelete}>
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </li>
                                    );
                                })}
                            </Paper>
                        </Grid> */}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
              </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container >
    );
}

export default RegisterApplicant;
