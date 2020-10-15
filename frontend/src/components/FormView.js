import React, { Component } from 'react';
import { getCategories } from '../api/categories';
import { addQuestion } from '../api/questions';

import '../stylesheets/FormView.css';

const defaultState = {
  question: "",
  answer: "",
  difficulty: 1,
  category: 1,
  categories: []
};

class FormView extends Component {
  constructor(props){
    super();
    this.state = { ...defaultState };
  }
  
  componentDidMount(){
    this.handleGetCategories();
  }

  handleGetCategories = async () => {
    const result = await getCategories();
    this.setState({ categories: result.categories });
  }

  submitQuestion = async (event) => {
    event.preventDefault();
    const {categories, ...data} = this.state;
    await addQuestion(data);
    this.setState({ ...defaultState, categories: this.state.categories });
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <div id="add-form">
        <h2>Add a New Trivia Question</h2>
        <form className="form-view" id="add-question-form" onSubmit={this.submitQuestion}>
          <label>
            Question
            <input type="text" name="question" onChange={this.handleChange} value={this.state.question} />
          </label>
          <label>
            Answer
            <input type="text" name="answer" onChange={this.handleChange} value={this.state.answer} />
          </label>
          <label>
            Difficulty
            <select name="difficulty" onChange={this.handleChange} value={this.state.difficulty} >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>
            Category
            <select name="category" onChange={this.handleChange} value={this.state.category} >
              {this.state.categories.map(cat => {
                  return (
                    <option key={cat.id} value={cat.id}>{cat.type}</option>
                  )
                })}
            </select>
          </label>
          <input type="submit" className="button" value="Submit" />
        </form>
      </div>
    );
  }
}

export default FormView;
