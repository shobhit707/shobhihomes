import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

export const fetchApi = async (url) => {
  const { data } = await axios.get((url), {
    headers: {
      'x-rapidapi-host': 'bayut.p.rapidapi.com',
      'x-rapidapi-key':'5232658699msh1d3fcf67f89a274p143025jsn7a4ed259bc0d' ,
    },
  });
    
  return data;
}