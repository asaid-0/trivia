# Full Stack Trivia API Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup
With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:
```bash
psql trivia < trivia.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `flaskr` directs flask to use the `flaskr` directory and the `__init__.py` file to find the application. 

## API ENDPOINTS
### Get all questions

#### Request

`GET /questions?page={page_number}`

    curl -i -H 'Accept: application/json' 'http://localhost:3000/questions?page=1'

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 749
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:11:43 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "questions": [
		{
		  "answer": "The Ancient Egyptians", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 1, 
		  "id": 38, 
		  "question": "Who invented the 365-days a year calendar ?"
		}, 
		{
		  "answer": "The Palace of Versailles", 
		  "category": {
			"id": 3, 
			"type": "Geography"
		  }, 
		  "difficulty": 3, 
		  "id": 14, 
		  "question": "In which royal palace would you find the Hall of Mirrors?"
		}, 
		{
		  "answer": "George Washington Carver", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 2, 
		  "id": 12, 
		  "question": "Who invented Peanut Butter?"
		}
	  ], 
	  "total": 3
	}

### Create new question

#### Request

`POST /questions`

    curl  -i -H 'Accept: application/json' \
		-H 'Content-Type: application/json;charset=utf-8' \
		-d '{"question":"Who invented the 365-days a year calendar ?","answer":"The Ancient Egyptians","difficulty":1,"category":"4"}' \
		 'http://localhost:3000/questions' 

### Response

	HTTP/1.1 201 CREATED
	X-Powered-By: Express
	content-type: application/json
	content-length: 229
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:17:59 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "question": {
		"answer": "The Ancient Egyptians", 
		"category": {
		  "id": 4, 
		  "type": "History"
		}, 
		"difficulty": 1, 
		"id": 42, 
		"question": "Who invented the 365-days a year calendar ?"
	  }
	}

### Delete a question

#### Request

`DELETE /questions/{question_id}`

    curl  -i -X DELETE -H 'Accept: application/json' \
		-H 'Content-Type: application/json;charset=utf-8' \
		 'http://localhost:3000/questions/14'

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 495
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:33:15 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "questions": [
		{
		  "answer": "The Ancient Egyptians", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 1, 
		  "id": 38, 
		  "question": "Who invented the 365-days a year calendar ?"
		}, 
		{
		  "answer": "George Washington Carver", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 2, 
		  "id": 12, 
		  "question": "Who invented Peanut Butter?"
		}
	  ], 
	  "total": 2
	}

### Search questions

#### Request

`POST /questions/search`

    curl  -i -H 'Accept: application/json' \
		-H 'Content-Type: application/json;charset=utf-8' \
		-d '{"keyword":"peANuT"}' \
		 'http://localhost:3000/questions/search' 

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 260
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:21:51 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "questions": [
		{
		  "answer": "George Washington Carver", 
		  "category": {
			"id": 4, 
			"type": "History"
		  },
		  "difficulty": 2,
		  "id": 12,
		  "question": "Who invented Peanut Butter?"
		}
	  ], 
	  "total": 1
	}

### Play a quiz

#### Request

`POST /quizzes`

    curl  -i -H 'Accept: application/json' \
		-H 'Content-Type: application/json;charset=utf-8' \
		-d '{"quizCategory":"4", "previousQuestions": [14, 5]}' \
		 'http://localhost:3000/quizzes' 

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 180
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:28:47 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "answer": "George Washington Carver", 
	  "category": {
		"id": 4, 
		"type": "History"
	  }, 
	  "difficulty": 2, 
	  "id": 12, 
	  "question": "Who invented Peanut Butter?"
	}

### Get all categories

#### Request

`GET /categories`

    curl -i -H 'Accept: application/json' 'http://localhost:3000/categories'

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 351
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:36:05 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "categories": [
		{
		  "id": 1, 
		  "type": "Science"
		}, 
		{
		  "id": 2, 
		  "type": "Art"
		}, 
		{
		  "id": 3, 
		  "type": "Geography"
		}, 
		{
		  "id": 4, 
		  "type": "History"
		}, 
		{
		  "id": 5, 
		  "type": "Entertainment"
		}, 
		{
		  "id": 6, 
		  "type": "Sports"
		}
	  ]
	}

### Get category questions

#### Request

`GET /categories/{category_id}/questions?page={page_number}`

    curl -i -H 'Accept: application/json' 'http://localhost:3000/categories/4/questions?page=1'

### Response

	HTTP/1.1 200 OK
	X-Powered-By: Express
	content-type: application/json
	content-length: 495
	access-control-allow-origin: *
	server: Werkzeug/0.15.4 Python/3.6.9
	date: Fri, 16 Oct 2020 05:38:26 GMT
	connection: keep-alive
	Vary: Accept-Encoding

	{
	  "questions": [
		{
		  "answer": "The Ancient Egyptians", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 1, 
		  "id": 38, 
		  "question": "Who invented the 365-days a year calendar ?"
		}, 
		{
		  "answer": "George Washington Carver", 
		  "category": {
			"id": 4, 
			"type": "History"
		  }, 
		  "difficulty": 2, 
		  "id": 12, 
		  "question": "Who invented Peanut Butter?"
		}
	  ], 
	  "total": 2
	}
## Testing
To run the tests, run
```
dropdb trivia_test
createdb trivia_test
psql trivia_test < trivia.psql
python test_flaskr.py
```