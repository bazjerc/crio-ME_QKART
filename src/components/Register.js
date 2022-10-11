import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const [valueUsername, setValueUsername] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [valueConfirmPassword, setValueConfirmPassword] = useState("");

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
      case "confirmPassword":
        setValueConfirmPassword(value);
        break;
      default:
        return;
    }
  }

  const registerHandler = () => {

    const inputData = {
      username: valueUsername,
      password: valuePassword,
      confirmPassword: valueConfirmPassword,
    }
  
    if (!validateInput(inputData)) return;

    const registerData = {
      username: inputData.username,
      password: inputData.password
    }
    
    register(registerData);
  }

  const register = async (formData) => {

    const reqOptions = {
      method: "post",
      url: `${config.endpoint}/auth/register`,
      data: formData
    }

    setIsLoading(true);

    try {
      await axios(reqOptions);
      enqueueSnackbar("Registered successfully", {variant: "success"});
      history.push("/login");

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

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
const validateInput = (data) => {
    const {username, password, confirmPassword} = data;

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
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", {variant: "warning"});
      return false;
    }

    return true;
  };

  const [isLoading, setIsLoading] = useState(false);
  const registerButton = <Button className="button" variant="contained" type="button" onClick={registerHandler}>Register Now</Button>;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={inputChangeHandler}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={inputChangeHandler}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={inputChangeHandler}
          />
          {isLoading ? progressIndicator : registerButton}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
