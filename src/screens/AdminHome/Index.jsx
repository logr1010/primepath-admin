import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
// import { useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../assets/logo.png';
import logoDark from '../../assets/logo.png';
import { adminAuthState } from "../../services/RecoilService";
import { useRecoilState } from "recoil";
import { get } from "../../services/api-services";
import useMediaQuery from '@mui/material/useMediaQuery';
import Confirmlogout from "../../dialogs/Confirmlogout";

const drawerWidth = 240;

const _options = [
    { title: 'Users', route: '/users' },
    { title: 'Pickup Agents', route: '/pickup-agents' },
    { title: 'Pickup Orders', route: '/pickups' },
    { title: 'Payout Requests', route: '/payout-requests' },
    { title: 'Settings', route: '/settings' }
]

function Index(props) {
    const { windowLayout } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [authState, setAuthState] = useRecoilState(adminAuthState);
    const [admin, setAdmin] = useState([]);
    const location = useLocation();
    const path = location.pathname.split("/");
    const appbar = React.useRef(null);
    const [appbarHeight, setAppbarHeight] = useState(0);
    const [value, setValue] = useState(0);
    const [openConfimation, setOpenConfimation] = useState(false)
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');

    useEffect(() => {
        getAdmin()
        setAppbarHeight(appbar.current.clientHeight)
    }, [appbar])

    useEffect(() => {
        if (!authState.id) {
            navigate("/");
        }
    }, [authState])

    useEffect(() => {
        const index = _options.findIndex((item) => item.route === `/${path[2]}`)
        console.log(index, path[2])
        if (index > -1)
            setValue(index)
    }, [location.pathname])

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    const navigate = useNavigate();
    function handleNavigate(text) {
        // const navText = text.toLowerCase().replace(/\s+/g, "");
        const navText = text.route;
        navigate(`/admin${navText}`);
        if (navText === "/users") setValue(0);
        else if (navText === "/pickup-agents") setValue(1)
        else if (navText === "/pickups") setValue(2)
        else if (navText === "/payout-requests") setValue(3)
        else if (navText === "/settings") setValue(4)
    }

    const getAdmin = async () => {
        const res = await get(`users/${authState?.userId}`)
        if (res?.statusCode === 200) {
            setAdmin(res?.data)
        }
    }
    const logoutAdmin = async () => {
        setOpenConfimation(true)
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }
    const drawer = (
        <div className=" h-screen w-[240px]  flex flex-col  overflow-y-auto justify-between">
            <div>
                <div className=" flex flex-col items-center">
                    <img src={prefersDarkMode ? logoDark : logo} alt="logo" className="w-[240px]" />
                </div>
                <div className="mt-6">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        // onChange={handleChange}
                        aria-label="Vertical tabs example"
                    // style={{ borderRight: 1, borderColor: 'divider', }}
                    >
                        {_options.map((text, index) => (
                            <Tab
                                className="flex !flex-row !justify-start !items-center"
                                key={text.title}
                                label={text.title}
                                {...a11yProps(index)}
                                sx={{
                                    fontSize: 18,
                                    textTransform: 'none',
                                    // marginRight: { xs: "none", sm: "60px" },

                                }}
                                onClick={() => handleNavigate(text)}
                            />
                        ))}
                    </Tabs>
                </div>
            </div>
            <Box className="items-center p-5 justify-between" sx={{ display: { xs: "none", sm: "flex" } }}>
                <Typography>{admin?.name}</Typography>
                <Typography
                    noWrap
                    component="div"
                    className="text-[#B2B2B2] items-center  flex gap-2   cursor-pointer  rounded-md border-2 border-[#B2B2B2]"
                    onClick={logoutAdmin}
                >
                    <LogoutIcon sx={{ ":hover": { color: '#747474' } }} />
                </Typography>
            </Box>
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = windowLayout !== undefined ? () => window().document.body : undefined;
    return (
        <Box className="flex flex-1 overflow-hidden">
            <CssBaseline />
            <AppBar
                // elevation={0}

                ref={appbar}
                color="secondary"
                sx={{
                    display: { xs: "block", sm: "none" }
                }}

            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon sx={{ color: '#3366FF33' }} />
                    </IconButton>
                    <Typography
                        noWrap
                        component="div"
                        className="items-center fixed right-5 flex gap-2   cursor-pointer  rounded-md border-2 border-[#B2B2B2] md:p-1"
                        onClick={logoutAdmin}
                    >
                        <LogoutIcon sx={{ color: '#B2B2B2', ":hover": { color: '#747474' } }} />
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    color="secondary"
                    PaperProps={{ elevation: 10 }}
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{ display: { xs: "block", sm: "none" }, width: drawerWidth }}>
                    {drawer}
                </Drawer>
                <Drawer
                    color="secondary"
                    PaperProps={{ elevation: 5 }}
                    variant="permanent"

                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            // marginTop: `${appbarHeight}px`,
                            border: 'none',

                        },
                        overflow: "auto",
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                className="flex flex-1 flex-col overflow-hidden"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar
                    sx={{
                        display: { xs: "block", sm: "none" }
                    }}
                />
                <Outlet />
            </Box>
            <Confirmlogout openConfimation={openConfimation} setOpenConfimation={setOpenConfimation} />
        </Box>

    );

}
Index.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    windowLayout: PropTypes.func,

};

export default Index;
