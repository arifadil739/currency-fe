import axios from "axios"

export const getCurrency = async ()=>{
    const response = await axios.get(`${process.env.BASE_URL}/currency/all`)
    return response.data.data;
}

export const getConvertedValue = async (from_curr: string, to_curr: string, amount: number | null)=>{
    const response = await axios.get(`${process.env.BASE_URL}/currency/convert?from_curr=${from_curr}&to_curr=${to_curr}&amount=${amount}`);
    return response.data;
}