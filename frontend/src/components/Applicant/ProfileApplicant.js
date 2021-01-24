import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImg from "../../assets/images/profileImg.png"
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
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
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
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
        margin: theme.spacing(0, 0, 0),
    },
    heading: {
        textAlign: "center",
        fontSize: 45,
    },
    profile_img: {
        width: "225px",
        height: "200px",
        // marginLeft: "120px",
        // marginTop: "30px"
    },
    textField: {
        marginTop: 40,
        marginBottom: 15,
        // marginLeft: 20,
        width: "100%"
    },
    textField2: {
        marginTop: 20,
        // marginLeft: 20,
        width: "100%"
    },
    chip: {
        margin: theme.spacing(0.5),
        color: 'primary',
    },
}));

const RegisterApplicant = () => {
    const classes = useStyles();
    const userType = localStorage.getItem("Type");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skill, setSkill] = useState('');
    const [skillsList, setSkillsList] = useState([]);
    const [rating, setRating] = useState('');
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
    const [edit, setEdit] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const setFormData = (data) => {
        setName(data.name);
        setEmail(data.email);
        setRating(data.rating);
        setSkillsList(data.skills);
        let tempEducationList = new Array();
        data.education.forEach((item, id) => {
            tempEducationList[id] = Object.assign({}, item)
        })
        setEducationList(tempEducationList);
    }

    useEffect(() => {
        axios({
            method: "GET",
            url: `/applicant/profile`,
            headers: {
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("DATA", response.data);
            console.log("DATA skills", response.data.skills);
            console.log("DATA education", response.data.education);
            setFormData(response.data);
        }).catch(error => {
            if (error) {
                console.log(error.response.data);
                setIsError(true);
                setErrors(error.response.data);
            }
        });
    }, [edit])

    const handleEdit = () => {
        const tempEdit = !edit;
        setEdit(tempEdit);
    }

    const onChangeName = (event) => {
        setName(event.target.value);
    }
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    // skills related
    const onChangeSkill = (event) => {
        setSkill(event.target.value);
    }
    const handleSkillDelete = (chipToDelete) => () => {
        if (!edit) return

        setSkillsList((chips) => chips.filter((chip) => chip !== chipToDelete));
    };
    const handleSkillClick = (clickedChip) => () => {
        if (!edit) return

        setSkill(clickedChip)
        setSkillsList((chips) => chips.filter((chip) => chip !== clickedChip));
    };
    const handleAddSkill = () => {
        if (!edit) return

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
        if (!edit) return

        setEducationList((chips) => chips.filter((chip) => chip !== chipToDelete));
    };
    const handleEducationClick = (clickedChip) => () => {
        if (!edit) return
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

    const handleSave = (e) => {
        e.preventDefault();
        const profile = {
            name: name,
            email: email,
            education: educationList,
            skills: skillsList,
        };
        // profile.education= educationList,

        console.log("after save, applicant profile - ", profile)
        axios({
            method: "PUT",
            url: "/applicant/profile/edit",
            data: JSON.stringify(profile),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${localStorage.getItem("Token")}`
            }
        }).then((response) => {
            console.log("after success submit", response.data)
            setFormData(response.data);
            setIsError(false);
            setErrors({});
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }).catch(error => {
            if (error) {
                console.log("hi error", error.response);
                setIsError(true);
                setErrors(error.response.data);
            }
        });
    }

    if (userType !== 'applicant') {
        alert(`Forbidden.`);
        window.location.replace("http://localhost:3000/")
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <div className={classes.paper}>
                {
                    isSuccess &&
                    <Alert severity="success" style={{ textAlign: "center", fontSize: "20px" }}>
                        Successfully Updated
                    </Alert>
                }
                <Typography component="h1" variant="h3">
                    Profile
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography align='center'>
                                <img src={profileImg} alt="Profile Picture" className={classes.profile_img} />
                                <br />
                                <Rating
                                    name="rating"
                                    size='large'
                                    value={3}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                disabled={!edit}
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={onChangeName}
                                error={errors.name}
                                className={classes.textField}
                                helperText={errors.name}
                            />
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                disabled={!edit}
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className={classes.textField2}
                                onChange={onChangeEmail}
                                error={errors.email}
                                helperText={errors.email}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider component="hr" />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Typography component="h5" variant="h5" align='right'>
                                Education
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography align='center' >
                                <Button
                                    variant="contained"
                                    disabled={!edit}
                                    color="secondary"
                                    className={classes.add}
                                    startIcon={<AddIcon />}
                                    onClick={handleAddEducation}
                                >
                                    Add
                                </Button>
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="instituteName"
                                placeholder='IIITH'
                                disabled={!edit}
                                label="Institute Name"
                                id="instituteName"
                                autoComplete="instituteName"
                                className={classes.textField2}
                                value={education.instituteName}
                                onChange={onChangeInstitute}
                                error={errors.education || educationError}
                                helperText={errors.education}
                                helperText={educationError ? educationError : errors.education}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} >
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                placeholder='2000'
                                value={education.startYear}
                                name="startYear"
                                className={classes.textField2}
                                label="Start Year"
                                disabled={!edit}
                                id="startYear"
                                onChange={onChangeStartYear}
                                error={errors.education || educationError || startYearError}
                                helperText={startYearError ? startYearError : errors.education}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} >
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="endYear"
                                label="End Year"
                                className={classes.textField2}
                                value={education.endYear}
                                disabled={!edit}
                                id="endYear"
                                onChange={onChangeEndYear}
                                error={endYearError}
                                helperText={endYearError}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider component="hr" />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography component="h5"
                                variant="h5" align='center' >
                                Skills
                                </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="skill"
                                label="Add a skill one be one, press +"
                                placeholder="Python, C, ..."
                                disabled={!edit}
                                name="skill"
                                className={classes.textField2}
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
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs>

                            <Typography align="right">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    style={{
                                        marginTop: "25px",
                                        // marginBottom: "20px",
                                        marginLeft: "20px"
                                    }}
                                    startIcon={!edit ? <EditIcon /> : <ClearIcon />}
                                    onClick={handleEdit}
                                >
                                    {!edit ? "Edit" : "Reset"}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={!edit}
                                    color="primary"
                                    size="large"
                                    style={{
                                        marginTop: "25px",
                                        // marginBottom: "20px",
                                        marginLeft: "20px"
                                    }}
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                >
                                    Save
                        </Button>
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* </Grid> */}
                </form>
            </div>
        </Container >


    )
}

export default RegisterApplicant;
