import React, { Component } from 'react';
import { getCategories } from '../api/categories';
import { playQuiz } from '../api/questions';

import '../stylesheets/QuizView.css';

const questionsPerPlay = 5; 

class QuizView extends Component {
  constructor(props){
    super();
    this.state = {
        quizCategory: null,
        previousQuestions: [], 
        showAnswer: false,
        categories: [],
        numCorrect: 0,
        currentQuestion: {},
        guess: '',
        forceEnd: false
    }
  }

  componentDidMount(){
    this.handleGetCategories();
  }

  handleGetCategories = async () => {
    const result = await getCategories();
    this.setState({ categories: result.categories });
  }

  selectCategory = ({type, id=0}) => {
    this.setState({quizCategory: {type, id}}, this.getNextQuestion)
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  getNextQuestion = async () => {
    const previousQuestions = [...this.state.previousQuestions]
    if(this.state.currentQuestion.id) { previousQuestions.push(this.state.currentQuestion.id) }
    const question = await playQuiz({
      previousQuestions: previousQuestions,
      quizCategory: this.state.quizCategory.id,
    });
    this.setState({
      showAnswer: false,
      currentQuestion: question,
      previousQuestions: previousQuestions,
      guess: '',
      forceEnd: question ? false : true
    });
  }

  submitGuess = (event) => {
    event.preventDefault();
    let evaluate =  this.evaluateAnswer()
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    })
  }

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [], 
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    })
  }

  renderPrePlay(){
      return (
          <div className="quiz-play-holder">
              <div className="choose-header">Choose Category</div>
              <div className="category-holder">
                  <div className="play-category" onClick={this.selectCategory}>ALL</div>
                  {this.state.categories.map(cat => {
                  return (
                    <div
                      key={cat.id}
                      value={cat.id}
                      className="play-category"
                      onClick={() => this.selectCategory({ type:cat.type, id: cat.id })}>
                      {cat.type}
                    </div>
                  )
                })}
              </div>
          </div>
      )
  }

  renderFinalScore(){
    return(
      <div className="quiz-play-holder">
        <div className="final-header"> Your Final Score is {this.state.numCorrect}</div>
        <div className="play-again button" onClick={this.restartGame}> Play Again? </div>
      </div>
    )
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
    const answerArray = this.state.currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.includes(formatGuess) || this.state.currentQuestion.answer.toLowerCase().trim(' ') === formatGuess;
  }

  renderCorrectAnswer(){
    let evaluate =  this.evaluateAnswer()
    return(
      <div className="quiz-play-holder">
        <div className="quiz-question">{this.state.currentQuestion.question}</div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>{evaluate ? "You were correct!" : "You were incorrect"}</div>
        <div className="quiz-answer">{this.state.currentQuestion.answer}</div>
        <div className="next-question button" onClick={this.getNextQuestion}> Next Question </div>
      </div>
    )
  }

  renderPlay(){
    return this.state.previousQuestions.length === questionsPerPlay || this.state.forceEnd
      ? this.renderFinalScore()
      : this.state.showAnswer 
        ? this.renderCorrectAnswer()
        : (
          <div className="quiz-play-holder">
            <div className="quiz-question">{this.state.currentQuestion.question}</div>
            <form onSubmit={this.submitGuess}>
              <input type="text" name="guess" onChange={this.handleChange}/>
              <input className="submit-guess button" type="submit" value="Submit Answer" />
            </form>
          </div>
        )
  }


  render() {
    return this.state.quizCategory
        ? this.renderPlay()
        : this.renderPrePlay()
  }
}

export default QuizView;
