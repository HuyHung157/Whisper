import axios from 'axios';
import { apiUrl } from '../../constants/AppConst';

const jwtAxios = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// export const setAuthToken = (token) => {
//   if (token) {
//     jwtAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
//     localStorage.setItem('token', token);
//   } else {
//     delete jwtAxios.defaults.headers.common['Authorization'];
//     localStorage.removeItem('token');
//   }
// };

export default jwtAxios;
