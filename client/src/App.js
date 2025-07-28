import { Fragment } from "react/jsx-runtime";
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Switch,
} from "react-router-dom";
import "./App.css";

const App = () => (
    <Router>
        <Fragment>
            {/* <h1>App</h1> */}
            <Navbar />
            <Routes>
                <Route path="/" component={Landing} />
            </Routes>
        </Fragment>
    </Router>
);

export default App;
