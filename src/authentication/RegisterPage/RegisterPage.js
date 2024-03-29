import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { RegisterImage } from "./RegisterImage";
import { makeStyles, styled } from "@material-ui/core/styles";
import { getAllOrganizations } from "../../services/codesService";
import { createUser } from "../../services/registerService";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";
import {
  MenuItem,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  Button
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { mobilePhoneRegex, idRegex } from "../ValidationRegex";
import TomLogo from "@Icons/TomLogo";
import { useHistory } from "react-router-dom";
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
    marginTop: theme.spacing(3)
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

const StyledAlert = styled(Alert)({
  margin: "10px 0"
});

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

export default function RegisterPage() {
  const classes = useStyles();
  const { throwError } = useAsyncThrowError();
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState("");
  const history = useHistory();
  const { setToken } = useAuth();

  // load organizations
  useEffect(() => {
    (async () => {
      try {
        const { data: organizations } = await getAllOrganizations();
        setOrganization(organizations);
      } catch (err) {
        throwError(err);
      }
    })();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const user = {
      id: form.get("id"),
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      password: form.get("password"),
      phone: form.get("phone"),
      organization: form.get("organization"),
      password: form.get("password")
    };

    if (validateValues(user)) {
      try {
        const response = await createUser(user);
        await setToken(response.data.token);
      } catch (err) {
        throwError(err);
      }
    }
  };

  const validateValues = data => {
    setError(false);
    if (!data["firstName"].length || !data["lastName"].length) {
      setError("Missing name information!");
      return false;
    }

    if (!data["phone"].length) {
      setError("Missing phone number!");
      return false;
    }

    if (!data["phone"].match(mobilePhoneRegex)) {
      setError("Invalid phone number!");
      return false;
    }

    if (!data["organization"].length) {
      setError("Missing organization!");
      return false;
    }

    if (!data["id"].match(idRegex)) {
      setError("Invalid ID!");
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
          TOM
        </Typography>
        <RegisterImage />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                type="phone"
                id="phone"
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                variant="outlined"
                fullWidth
                id="organization"
                name="organization"
                label="Organization"
                defaultValue=""
              >
                <MenuItem value="" disabled>
                  <em>Please Select Organization</em>
                </MenuItem>
                {organization &&
                  organization.map(o => (
                    <MenuItem key={o?.id} value={o?.id}>
                      {o.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="id"
                label="ID"
                name="id"
                autoComplete="id"
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
              />
            </Grid>
          </Grid>
          {error && <StyledAlert severity="error">{error} </StyledAlert>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
