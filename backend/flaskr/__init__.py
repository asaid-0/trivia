import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import sys, traceback

from models import setup_db, Question, Category

ITEMS_PER_PAGE = 10

def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__)
  setup_db(app)
  CORS(app)

  @app.after_request
  def after_request(response):
    if request.method == 'OPTIONS':
      response.headers.add('Access-Control-Allow-Origin', '*')
      response.headers.add('Access-Control-Allow-Headers', '*')
      response.headers.add('Access-Control-Allow-Methods', '*')
    return response

  @app.route('/categories')
  def get_categories():
    categories = Category.query.all()
    if not categories:
      abort(404)
    return jsonify({ 'categories': [cat.format() for cat in categories ] })

  @app.route('/questions')
  def get_questions():
    page = request.args.get('page', 1, type=int)
    start = ITEMS_PER_PAGE * (page - 1)
    questions = Question.query.order_by(Question.id.desc()).limit(ITEMS_PER_PAGE).offset(start).all()
    if not questions:
      abort(404)
    return jsonify({ 'questions': [question.format() for question in questions ], 'total': Question.query.count() })


  '''
    This method for pagination showed in course lectures actually 
    is not recommended as it has an impact on performance since we 
    are getting all results from database then slice the array so 
    it's better to use limit, offset on database as implemented
  '''
  # def pagination(request, results):
  #   page = request.args.get('page', 1, type=int)

  #   start =  ITEMS_PER_PAGE * (page - 1)
  #   end = ITEMS_PER_PAGE + start

  #   serialized = [res.format() for res in results]
  #   paginated = serialized[start:end]

  #   return paginated

  @app.route('/questions/<int:question_id>', methods=['DELETE'])
  def delete_question(question_id):
    question = Question.query.filter(Question.id == question_id).one_or_none()
    if not question:
      abort(404)
    question.delete()
    current_questions = Question.query.order_by(Question.id.desc()).all()
    return jsonify({
        'questions': [q.format() for q in current_questions],
        'total': len(current_questions)
    })


  @app.route('/questions', methods=['POST'])
  def create_question():
    data = request.get_json()

    question = data.get('question', None)
    answer = data.get('answer', None)
    category = data.get('category', 1)
    difficulty = data.get('difficulty', 1)

    if not question or not answer:
      abort(422)

    categoryCheck = Category.query.filter(Category.id == int(category)).one_or_none()
    if not categoryCheck or not answer or not question:
      abort(422)
    question = Question(question=question, answer=answer, category=category, difficulty=difficulty)
    question.insert()
    return jsonify({
      'question': question.format()
    }), 201

  @app.route('/questions/search', methods=['POST'])
  def search_question():
    data = request.get_json()
    keyword = data.get('keyword', None)
    if not keyword:
      abort(422)
    filtered_questions = Question.query.filter(Question.question.ilike(f'%{keyword}%')).order_by(Question.id.desc())
    if not filtered_questions.count():
      return jsonify({ 'questions': [], 'total': 0 })
    paginated_questions = filtered_questions.all()
    return jsonify({ 'questions': [question.format() for question in paginated_questions ], 'total': filtered_questions.count() })

  @app.route('/categories/<int:category_id>/questions')
  def get_questions_by_category(category_id):
    page = request.args.get('page', 1, type=int)
    start = ITEMS_PER_PAGE * (page - 1)
    filtered_questions = Question.query.filter(Question.category == category_id).order_by(Question.id.desc())
    if not filtered_questions.count():
      abort(404)
    paginated_questions = filtered_questions.limit(ITEMS_PER_PAGE).offset(start).all()
    return jsonify({ 'questions': [question.format() for question in paginated_questions ], 'total': filtered_questions.count() })

  @app.route('/quizzes', methods=['POST'])
  def play_quiz():
    data = request.get_json()

    quizCategory = data.get('quizCategory', None)
    previousQuestions = data.get('previousQuestions', [])
    if quizCategory == None:
      abort(422)
    if not quizCategory:
      question = Question.query.filter(~Question.id.in_(previousQuestions)).limit(1).one_or_none()
    else:
      question = Question.query.filter((Question.category == quizCategory) & (~Question.id.in_(previousQuestions))).limit(1).one_or_none()
    if not question:
      return '', 204
    return jsonify(question.format())
  
  @app.errorhandler(404)
  def not_found(error):
    return jsonify({
      "success": False, 
      "message": "resource not found",
      "error": str(error),
      "code": 404
      }), 404

  @app.errorhandler(422)
  def unprocessable_entity(error):
    return jsonify({
      "success": False, 
      "message": "Unprocessable Entity",
      "error": str(error),
      "code": 422
      }), 422

  @app.errorhandler(400)
  def bad_request(error):
    return jsonify({
      "success": False, 
      "message": "Bad Request",
      "error": str(error),
      "code": 400
      }), 400

  @app.errorhandler(405)
  def not_allowed(error):
    return jsonify({
      "success": False, 
      "message": "Method Not Allowed",
      "error": str(error),
      "code": 405
      }), 405
  
  @app.errorhandler(500)
  def internal_server_error(error):
    return jsonify({
      "success": False, 
      "message": "Internal Server Error",
      "error": str(error),
      "code": 500
      }), 500


  return app

    