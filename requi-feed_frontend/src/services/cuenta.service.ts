import { BACKEND_URL } from '@/constant';
import axios from 'axios';


const BASEURL = `${BACKEND_URL}/cuenta`;

export const getCuentaById = async (id:string) => {
    const url = `${BASEURL}/${id}`;
    const {data} = await axios.get(url);
    return data;
}