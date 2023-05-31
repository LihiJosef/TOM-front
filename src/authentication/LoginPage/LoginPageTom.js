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
import { useAuth } from "../../context/authContext";

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
  },
  copyrightText: {
    marginLeft: 2
  }
}));

function Copyright() {
  const styleClass = useStyles();
  return (
    <Typography className={styleClass.copyright} variant="body2" color="textSecondary" align="center">
      <TomLogo />
      <Typography className={styleClass.copyrightText}>
        Copyright © TOM
        {"  "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Typography>
  );
}

const StyledAlert = styled(Alert)({
  margin: "10px 0"
});

export default function LoginPageTom() {
  const classes = useStyles();
  const [error, setError] = useState(false);
  const { login } = useAuth()

  const validateValues = data => {
    setError(false);

    if (!data["id"].length) {
      setError("Missing ID!");
      return false;
    }

    if (!data["password"].length) {
      setError("Missing password!");
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const user = {
      id: form.get("id"),
      password: form.get("password")
    };

    if (validateValues(user)) {
      try {
        login({userId: user.id, password: user.password}, setError)
      } catch (err) {
        console.log("err");
        setError("Invalid userId or password!");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h2">
          TOM
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
            id="id"
            label="ID"
            name="id"
            autoComplete="id"
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
