import React, { Component } from 'react';

import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
import CategoryCard from './CategoryCard';
import { getQuestions, searchQuestions, deleteQuestion } from '../api/questions';
import { getCategoryQuestions, getCategories } from '../api/categories';

class QuestionView extends Component {
  constructor(){
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: [],
      category: null
    }
  }

  componentDidMount() {
    this.handleGetQuestions();
    this.handleGetCategories();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.category !== this.state.category){
      this.setState({page: 1});
      this.handleGetQuestions();
    } 
  }

  handleGetCategories = async () => {
    const result = await getCategories();
    this.setState({ categories: result.categories })
  }

  handleGetQuestions = async () => {
    let result;
    if (this.state.category) result = await getCategoryQuestions(this.state.category, this.state.page);
    else result = await getQuestions(this.state.page);
    this.setState({ questions: result.questions, totalQuestions: result.total })
  }

  selectPage(num) {
    this.setState({page: num}, () => this.handleGetQuestions());
  }

  createPagination(){
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10)
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={() => {this.selectPage(i)}}>{i}
        </span>)
    }
    return pageNumbers;
  }

  handleCategoryChange(category_id){
    this.setState({category: category_id});
  }

  submitSearch = async (searchTerm) => {
    const result = await searchQuestions(searchTerm);
    this.setState({ questions: result.questions, totalQuestions: result.total });
  }

  questionAction = (id) => async (action) => {
    if(action === 'DELETE') {
      if(window.confirm('are you sure you want to delete the question?')) {
        const result = await deleteQuestion(id);
        this.setState({ questions: result.questions, totalQuestions: result.total })
      }
    }
  }

  render() {
    return (
      <div className="question-view">
        <div className="categories-list">
          <h2 onClick={() => {this.handleGetQuestions()}}>Categories</h2>
          <ul>
            {this.state.categories.map(cat => <CategoryCard active={cat.id === this.state.category} id={cat.id} type={cat.type} handleChange={(id) => this.handleCategoryChange(id)} />)}
          </ul>
          <Search submitSearch={this.submitSearch}/>
        </div>
        <div className="questions-list">
          <h2>Questions</h2>
          {this.state.questions.map((q) => (
            <Question
              key={q.id}
              question={q.question}
              category={q.category}
              answer={q.answer}
              difficulty={q.difficulty}
              questionAction={this.questionAction(q.id)}
            />
          ))}
          <div className="pagination-menu">
            {this.createPagination()}
          </div>
        </div>

      </div>
    );
  }
}

export default QuestionView;
