import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category



class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""
    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgresql://postgres@{}/{}".format('localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()
    
    def test_get_questions(self):
        res = self.client().get('/questions')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['questions'])
        self.assertTrue(data['total'])
    
    def test_get_categories(self):
        res = self.client().get('/categories')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['categories'])

    def test_get_questions_by_category(self):
        res = self.client().get('/categories/1/questions')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(data['questions']))
        self.assertEqual(data['questions'][0]['category']['id'], 1)
    
    def test_search_questions(self):
        res = self.client().post('/questions/search', json={'keyword': 'egypt'})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(data['questions']))
        self.assertIn('egypt', data['questions'][0]['question'].lower())

    def test_create_question(self):
        res = self.client().get('/questions')
        data = json.loads(res.data)
        count_before = data['total']

        q = {'question': 'question123456', 'answer': 'answer1', 'category': 1, 'difficulty': 1}
        res = self.client().post('/questions', json=q)
        self.assertEqual(res.status_code, 201)
        question = json.loads(res.data)['question']
        self.assertEqual(question['question'], q['question'])
        self.assertEqual(question['answer'], q['answer'])
        self.assertEqual(question['category']['id'], q['category'])
        self.assertEqual(question['difficulty'], q['difficulty'])
        TriviaTestCase.created_question_id = question['id']
        res = self.client().get('/questions')
        data = json.loads(res.data)
        self.assertEqual(data['total'], count_before+1)

    def test_delete_question(self):
        res = self.client().get('/questions')
        data = json.loads(res.data)
        count_before = data['total']
        res = self.client().delete(f'/questions/{TriviaTestCase.created_question_id}')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['total'], count_before-1)

    def test_play_quiz(self):
        res = self.client().post('/quizzes', json={'quizCategory': 1, 'previousQuestions': []})
        self.assertEqual(res.status_code, 200)
        question = json.loads(res.data)
        self.assertEqual(question['category']['id'], 1)

if __name__ == "__main__":
    unittest.main()