import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home.jsx";

axios.defaults.baseURL = "https://long-erin-calf-gear.cyclic.app";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Home />
	</React.StrictMode>
);
