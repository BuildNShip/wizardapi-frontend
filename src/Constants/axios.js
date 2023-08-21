import axios from "axios";
import { authBaseUrl } from "./links";
import { wizardBackendbaseUrl } from "./links";


export const authInstance = axios.create({
    baseURL: authBaseUrl,
});

export const wizardBackendInstance = axios.create({
    baseURL: wizardBackendbaseUrl,
});


  
