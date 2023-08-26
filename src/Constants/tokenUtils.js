import { generateToken } from "./links";
import { authInstance } from "./axios";

const tokenUtils = () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('Token');

    if (!token) {
      authInstance.post(generateToken, {
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log(response.data)
        const accessToken = response.data.response.access_token;
        localStorage.setItem('Token', accessToken);
        resolve(accessToken);
      }).catch((error) => {
        reject(error);
      });
    } else {
      resolve(token);
    }
  });
};

export default tokenUtils;
