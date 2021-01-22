import React, { Component, useState } from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
}));


const RegisterRecruiter = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [contactNum, setContactNum] = useState('')
    const [bio, setBio] = useState('')
    const [errors, setErrors] = useState({})
    const [isError, setIsError] = useState(false)

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

    const onChangeContactNum = (event) => {
        setContactNum(event.target.value);
    }
    const onChangeBio = (event) => {
        setBio(event.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const newRecruiter = {
            name: name,
            email: email,
            password: password,
            contactNum: contactNum,
            bio: bio
        }
        console.log("inside onSubmit, register recruiter- newRecruiter", newRecruiter)
        axios({
            method: "POST",
            url: "/auth/register/recruiter",
            data: newRecruiter,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log("after submit", response.data)
            alert(`Hello ${response.data.recruiter.name}! You are registered.
                    Redirect to Login ->`);
            window.location.replace("http://localhost:3000/login");
        }).catch(error => {
            if (error) {
                console.log("hi", error.response);
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
                    Sign up - Recruiter
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
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="contactNum"
                                label="Contact Number"
                                type="contactNum"
                                id="contactNum"
                                autoComplete="contactNum"
                                onChange={onChangeContactNum}
                                placeholder="+91XXXXXXXXXX"
                                error={errors.contactNum}
                                helperText={errors.contactNum}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="bio"
                                label="Bio"
                                placeholder="Please tell us something about you."
                                multiline
                                variant="outlined"
                                required
                                fullWidth
                                name="bio"
                                type="bio"
                                onChange={onChangeBio}
                                autoComplete="bio"
                                error={errors.bio}
                                helperText={errors.bio}
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

export default RegisterRecruiter;