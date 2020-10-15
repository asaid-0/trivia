import axios from 'axios';

export const getCategories = () => axios.get(`/categories`)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));

export const getCategoryQuestions = (category, page) => axios.get(`/categories/${category}/questions?page=${page}`)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));