import axios from 'axios';

export const getQuestions = (page) => axios.get(`/questions?page=${page}`)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));

export const addQuestion = (data) => axios.post('/questions', data)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));

export const deleteQuestion = (id) => axios.delete(`/questions/${id}`)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));

export const searchQuestions = (keyword) => axios.post('/questions/search', { keyword })
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));

export const playQuiz = (data) => axios.post('/quizzes', data)
    .then(res => res.data)
    .catch(err => alert(JSON.stringify(err.response.data, undefined, 2)));