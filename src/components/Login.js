import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */

  const [valueUsername, setValueUsername] = useState("");
  const [valuePassword, setValuePassword] = useState("");

  const inputChangeHandler = (e) => {
    const value = e.target.value;
    const inputName = e.target.name;
    switch (inputName) {
      case "username":
        setValueUsername(value);
        break;
      case "password":
        setValuePassword(value);
        break;
      default:
        return;
    }
  }

  const loginHandler = () => {

    const inputData = {
      username: valueUsername,
      password: valuePassword,
    }
  
    if (!validateInput(inputData)) return;
    
    login(inputData);
  }
  
  
  const login = async (formData) => {

    const reqOptions = {
      method: "post",
      url: `${config.endpoint}/auth/login`,
      data: formData
    }

    setIsLoading(true);

    try {
      const res = await axios(reqOptions);
      enqueueSnackbar("Logged in successfully", {variant: "success"});
      persistLogin(res.data.token, res.data.username, res.data.balance);
      history.push("/");

    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, {variant: "error"});
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"});
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    const {username, password} = data;

    if (!username) {
      enqueueSnackbar("Username is a required field", {variant: "warning"});
      return false;
    }
    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {variant: "warning"});
      return false;
    }
    if (!password) {enqueueSnackbar("Password is a required field", {variant: "warning"});
      return false;
    }
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {variant: "warning"});
      return false;
    }

    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };


  const [isLoading, setIsLoading] = useState(false);
  const loginButton = <Button className="button" variant="contained" type="button" onClick={loginHandler}>Login to Qkart</Button>;
  const progressIndicator = <CircularProgress color="success" style={{alignSelf: "center"}}/>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
        <TextField
            id="username"
            label="Username"
            variant="outlined"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={inputChangeHandler}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            placeholder="Enter Password"
            fullWidth
            onChange={inputChangeHandler}
          />
          {isLoading ? progressIndicator : loginButton}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link to="/register" className="link">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
