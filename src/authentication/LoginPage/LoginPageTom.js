import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles, styled } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
// Img SVG
import { LoginImage } from "./LoginImage";
import TomLogo from "@Icons/TomLogo";
import { useState } from "react";
import { Alert } from "@material-ui/lab";
import { emailRegex } from "../ValidationRegex";
import { checkLogin } from "../../services/loginService";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  copyright: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

function Copyright() {
  const styleClass = useStyles();
  return (
    <Typography className={styleClass.copyright} variant="body2" color="textSecondary" align="center">
      <TomLogo />
      {"   Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Tom
      </Link>
      {"  "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StyledAlert = styled(Alert)({
  margin: "10px 0"
});

export default function LoginPageTom() {
  const classes = useStyles();
  const [error, setError] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const user = {
      email: form.get("email"),
      password: form.get("password")
    };

    // console.log(data);

    if (validateValues(user)) {
      try {
        const res = await checkLogin(user);
        console.log(res);
        // TODO:adialon check for more errors if you have
        // and naviagte to the main page after authentication
      } catch (err) {
        throwError(err);
      }
    }
  };

  const validateValues = data => {
    setError(false);

    if (!data["email"].match(emailRegex)) {
      setError("Invalid email address!");
      return false;
    }

    if (!data["password"].length) {
      setError("Missing password!");
      return false;
    }

    if (data["password"].length < 6) {
      setError("Weak password! Password should be at least 6 characters");
      return false;
    }

    return true;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h2">
          Tom
        </Typography>
        <LoginImage />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {error && <StyledAlert severity="error">{error} </StyledAlert>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright className={classes.copyright} />
      </Box>
    </Container>
  );
}
