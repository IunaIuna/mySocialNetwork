//create method: make a copy of avxios
import axios from "axios";

var axiosCopy = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token"
});

export default axiosCopy;
