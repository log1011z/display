from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text,func

app = Flask(__name__)
CORS(app)
HOSTNAME = '127.0.0.1'
PORT = 3306
USERNAME = 'root'
PASSWORD = '110110'
DATABASE = 'display'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4'
db= SQLAlchemy(app)




class weather(db.Model):
    __tablename__ = 'weather'
    date = db.Column(db.Date, primary_key=True)
    temp = db.Column(db.Numeric(10, 2))
    wet = db.Column(db.Numeric(10, 2))
    sun = db.Column(db.Numeric(10, 2))
    tsoil1 = db.Column(db.Numeric(10, 2))
    tsoil2 = db.Column(db.Numeric(10, 2))
    tsoil3 = db.Column(db.Numeric(10, 2))
    tsoil4 = db.Column(db.Numeric(10, 2))
    tsoil5 = db.Column(db.Numeric(10, 2))
    tsoil6 = db.Column(db.Numeric(10, 2))

class crop(db.Model):
    __tablename__ = 'crop'
    type = db.Column(db.String(20), primary_key=True)
    day = db.Column(db.Integer)
    output = db.Column(db.Numeric(10, 2))
    price = db.Column(db.Numeric(10, 2))

class user(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key=True)
    uname = db.Column(db.String(20), nullable=False)
    upwd = db.Column(db.String(20), nullable=False)
    utype = db.Column(db.String(10), nullable=False)
@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/login', methods=['POST'])
def login():


@app.route('/get_weather', methods=['GET'])
def get_weather():
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(weather).all()
            db.session.close()
    return jsonify({
            'date': [i.date.strftime('%Y-%m-%d') for i in r],
            'temp': [i.temp for i in r],
            'wet': [i.wet for i in r],
            'sun': [i.sun for i in r],
            'tsoil1': [i.tsoil1 for i in r],
            'tsoil2': [i.tsoil2 for i in r],
            'tsoil3': [i.tsoil3 for i in r],
            'tsoil4': [i.tsoil4 for i in r],
            'tsoil5': [i.tsoil5 for i in r],
            'tsoil6': [i.tsoil6 for i in r],
    })
@app.route('/get_crop', methods=[ 'GET'])
def get_crop():
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(crop).all()
            db.session.close()
    return jsonify({
            'type': [i.type for i in r],
            'day': [i.day for i in r],
            'output': [i.output for i in r],
            'price': [i.price for i in r],
    })
if __name__ == '__main__':
    app.run()
