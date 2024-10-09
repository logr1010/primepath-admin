import React, { useEffect,useRef } from 'react';
import logo from '../assets/logo.png';
import logoDark from '../assets/logo.png';
import { TextField, IconButton, InputAdornment, Button} from "@mui/material";
import { emailRegex, passwordRegex } from '../regex/regex';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomSnackbar from '../modules/CustomSnackbar';
import {post } from '../services/api-services';
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { adminAuthState } from '../services/RecoilService';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function Login() {
    document.title="Login"
    const navigate = useNavigate();
    const [authState, setAuthState] = useRecoilState(adminAuthState);
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [snackbar, setSnackbar] = React.useState({
        openSnackbar: false,
        message: "",
        severity: "",
    });
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const textFieldRef=useRef()
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const submitLogin = async (e) => {
        setLoading(true)
        const res = await post(`Admins/login`, user);
        if (res?.statusCode === 200) {
            setAuthState(res?.data);
            await delay(200);
            setSnackbar({
                openSnackbar: true,
                message: "Admin logged in successfully",
                severity: "success",
            });
            navigate("/admin/users");
        }
        else if(res?.statusCode === 403){
            setSnackbar({
                openSnackbar: true,
                message: "Invalid email id or password",
                severity: "error",
            })
        }
        else {
            setSnackbar({
                openSnackbar: true,
                message: "Something went wrong",
                severity: "error",
            })
        }
        setLoading(false)
    };
    const delay = (delayInms) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
      };
    useEffect(() => {
        if (authState?.id) {
          navigate("/admin/users");
        }
        if(textFieldRef.current){textFieldRef.current.focus()}
      }, []);



    return (
        <div className='flex-1 flex flex-col justify-center items-center' color="secondary">
            <div className='flex flex-col p-4 items-center gap-10 sm:w-[400px]' color="secondary">
                <img className='h-[200px] shadow-md rounded-[16px]' src={prefersDarkMode ?logoDark:logo} alt="logo" />
                <div className='flex flex-col gap-4 w-full '>
                    <TextField
                        size="small"
                        fullWidth
                        required
                        id="outlined-basic"
                        label="Email id"
                        variant="outlined"
                        inputRef={textFieldRef}
                        value={user.email}
                        error={
                            user?.email?.length > 0 && !emailRegex?.test(user.email)
                        }
                        helperText={
                            user?.email?.length > 0 && !emailRegex?.test(user.email)
                                ? "enter valid email"
                                : ""
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") submitLogin(e);
                        }}
                        onChange={(e) =>
                            setUser((prevState) => ({
                                ...prevState,
                                email: e.target.value,
                            }))
                        }

                    />
                    <TextField
                        required
                        value={user.password}
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        // error={
                        //     user?.password?.length > 0 &&
                        //     !passwordRegex?.test(user.password)
                        // }
                        // helperText={
                        //     user?.password?.length > 0 &&
                        //         !passwordRegex?.test(user.password)
                        //         ? "enter valid password"
                        //         : ""
                        // }
                        InputProps={{
                            // <-- This is where the toggle button is added.

                            endAdornment: (
                                <InputAdornment position="end">
                                    {user.password ? (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? (
                                                <Visibility color="disabled" />
                                            ) : (
                                                <VisibilityOff color="disabled" />
                                            )}
                                        </IconButton>
                                    ) : (
                                        ""
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") submitLogin(e);
                        }}
                        onChange={(e) =>
                            setUser((prevState) => ({
                                ...prevState,
                                password: e.target.value,
                            }))
                        }

                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={submitLogin}
                        disabled={
                            user.email &&
                                !loading &&
                                user.password &&
                                // passwordRegex?.test(user.password) &&
                                emailRegex?.test(user.email)
                                ? false
                                : true
                        }
                    >
                        Log In
                    </Button>
                </div>
            </div>
            <CustomSnackbar
                openSnackbar={snackbar.openSnackbar}
                closeSnackbar={() =>
                    setSnackbar({
                        openSnackbar: false,
                        message: "",
                        severity: "",
                    })
                }
                severity={snackbar.severity}
                message={snackbar.message}
            />
        </div>
    )
}
