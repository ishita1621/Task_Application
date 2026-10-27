import axios from "axios"


const BASE_URL = "https://jsonplaceholder.typicode.com/todos"

const getAllTasks = async () => {
    const res = await axios.get(`${BASE_URL}?_limit=20`);
    return res.data;
}

export default getAllTasks;
