import { ThemeProvider } from "@mui/material/styles";
// import Theme from "./components/Theme";
import UseCustomTheme from "./components/UseCustomTheme";
import MainRoutes from "./routes/MainRoutes";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import {CssBaseline} from "@mui/material";
function App() {
  const theme = UseCustomTheme();
  return (
    <div className="h-screen flex flex-col">
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <MainRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
