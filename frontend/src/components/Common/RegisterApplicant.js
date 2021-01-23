import React, { Component, useState } from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Rating from '@material-ui/lab/Rating';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AddIcon from '@material-ui/icons/Add';

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
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const RegisterApplicant = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skill, setSkill] = useState('');
    const [skillsList, setSkillsList] = useState([
        'Angular', 'JS', 'C'
    ]);
    const [rating, setRating] = useState(0);
    const [education, setEducation] = useState({
        instituteName: '',
        startYear: '',
        endYear: ''
    });
    // const [educationList, setEducationList] = useState([]);
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(false);

    const classes = useStyles();


    const onChangeName = (event) => {
        setName(event.target.value);
    }
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }
    const onChangeRating = (event) => {
        setRating(Number(event.target.value));
    }
    const onChangeSkill = (event) => {
        setSkill(event.target.value);
    }
    const onChangeInstitute = (event) => {
        let educationNew = { ...education, instituteName: event.target.value };
        setEducation(educationNew);
    }
    const onChangeStartYear = (event) => {
        let educationNew = { ...education, startYear: event.target.value };
        setEducation(educationNew);
    }
    const onChangeEndYear = (event) => {
        let educationNew = { ...education, endYear: event.target.value };
        setEducation(educationNew);
    }
    const handleSkillDelete = (chipToDelete) => () => {
        setSkillsList((chips) => chips.filter((chip) => chip !== chipToDelete));
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
        const newApplicant = {
            name: name,
            email: email,
            password: password,
            education: {
                instituteName: education.instituteName,
                startYear: education.startYear,
                endYear: education.endYear
            },
            // education: education,
            skills: skillsList,
            rating: rating
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

                        <Grid item xs={12} sm={3}>
                            <Typography component="h6" variant="h6">
                                Rating:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Rating
                                name="rating"
                                size='large'
                                value={rating}
                                onChange={onChangeRating}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h6" variant="h6">
                                Skills:
                                </Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                // required
                                fullWidth
                                id="skill"
                                label="Add a skill (like Python), press +"
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
                                    let icon;
                                    return (
                                        <li key={skill}>
                                            <Chip
                                                icon={icon}
                                                label={skill}
                                                onDelete={handleSkillDelete(skill)}
                                                className={classes.chip}
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
                                name="instituteName"
                                label="Education - Institute Name"
                                type="instituteName"
                                id="instituteName"
                                autoComplete="instituteName"
                                onChange={onChangeInstitute}
                            // error={errors.education.instituteName}
                            // helperText={errors.education.instituteName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="startYear"
                                label="Start Year"
                                type="startYear"
                                id="startYear"
                                onChange={onChangeStartYear}
                            // error={errors.education.startYear}
                            // helperText={errors.education.startYear}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="endYear"
                                label="End Year"
                                type="endYear"
                                id="endYear"
                                onChange={onChangeEndYear}
                            // error={errors.education.endYear}
                            // helperText={errors.education.endYear}
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
        </Container>
    );
}


export default RegisterApplicant;

// export default class RegisterApplicant extends Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             name: '',
//             email: '',
//             date: null
//         }

//         this.onChangeUsername = this.onChangeUsername.bind(this);
//         this.onChangeEmail = this.onChangeEmail.bind(this);
//         this.onSubmit = this.onSubmit.bind(this);
//     }

//     onChangeUsername(event) {
//         this.setState({ name: event.target.value });
//     }

//     onChangeEmail(event) {
//         this.setState({ email: event.target.value });
//     }

//     onSubmit(e) {
//         e.preventDefault();

//         const newUser = {
//             name: this.state.name,
//             email: this.state.email,
//             date: Date.now()
//         }
//         axios.post('http://localhost:4000/user/register', newUser)
//             .then(res => { alert("Created\t" + res.data.name); console.log(res.data) })
//             ;

//         this.setState({
//             name: '',
//             email: '',
//             date: null
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <form onSubmit={this.onSubmit}>
//                     <div className="form-group">
//                         <label>Username: </label>
//                         <input type="text"
//                             className="form-control"
//                             value={this.state.name}
//                             onChange={this.onChangeUsername}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Email: </label>
//                         <input type="text"
//                             className="form-control"
//                             value={this.state.email}
//                             onChange={this.onChangeEmail}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input type="submit" value="Register" className="btn btn-primary" />
//                     </div>
//                 </form>
//             </div>
//         )
//     }
// }