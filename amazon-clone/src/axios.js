import axios from 'axios';

const instance= axios.create({
    baseURL: 'http://127.0.0.1:5001/challange-de07c/us-central1/api' //The API (CLOUD FUNCTION url)
})

export default instance;