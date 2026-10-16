import { RouterProvider } from "react-router";
import { AppRouter } from "./Utils/Routing";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./theme";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={AppRouter} />
    </ThemeProvider>
  );
}

export default App;
