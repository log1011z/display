from Demos.win32ts_logoff_disconnected import username
from flask import Flask, render_template, request, jsonify,session,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
import datetime
from climbpre import getdata
from scipy.spatial.distance import cityblock
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
app.secret_key = '6ragonPa5ace1n'



class weather(db.Model):
    __tablename__ = 'weather'
    date = db.Column(db.Date, primary_key=True)
    temp = db.Column(db.Numeric(10, 2))
    wet = db.Column(db.Numeric(10, 2))
    sun = db.Column(db.Numeric(10, 2))
    tsoil1 = db.Column(db.Numeric(10, 2))
    tsoil2 = db.Column(db.Numeric(10, 2))
    tsoil3 = db.Column(db.Numeric(10, 2))

class crop(db.Model):
    __tablename__ = 'crop'
    type = db.Column(db.String(20), primary_key=True)
    day = db.Column(db.Integer)
    output = db.Column(db.Numeric(10, 2))
    price = db.Column(db.Numeric(10, 2))
    buy = db.Column(db.Integer)
    grown = db.Column(db.Integer)

class area(db.Model):
    __tablename__ = 'area'
    prov = db.Column(db.String(20), primary_key=True)
    type = db.Column(db.String(20))
    output = db.Column(db.Numeric(10, 2))

class user(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    anth = db.Column(db.Integer, nullable=False)
@app.route('/')
def index():  # put application's code here
    if session.get('logged_in'):
        return redirect(url_for('home'))
    return render_template('login.html')
@app.errorhandler(404)
def page_not_found(error):
    return render_template('error-404.html'), 404
@app.route('/login', methods=['POST'])
def login():
    res = request.get_json()
    username = res.get('username')
    password = res.get('password')
    print(username, password)
    with app.app_context():
        with db.engine.connect() as conn:
            user_info = db.session.query(user).filter(user.username == username, user.password == password).first()
            db.session.close()
        if user_info:
            session['logged_in'] = True
            session['username'] = username
            session['uid'] = user_info.uid
            session['role'] = user_info.anth
            return jsonify({'status': 'success', 'message': '登录成功!',
                            'uid': user_info.uid, 'utype': user_info.anth})
        return jsonify({'status': 'error', 'message': '登录失败.'})
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    session.pop('uid', None)
    session.pop('role', None)
    return jsonify({'status': 'success', 'message': '登出成功.'})
@app.route('/home', methods=['GET'])
def home():
    return render_template("front.html")
@app.route('/admin', methods=['GET'])
def admin():
    return render_template("admin.html")
@app.route('/create',methods=['GET','POST'])
def create():
    if request.method == 'GET':
        return render_template("register.html")
    else :
        res = request.form
        username = res.get('username')
        password = res.get('password')
        print(username, password)
        if db.session.query(user).filter(user.username == username).first():
            return jsonify({'status': 'error', 'message': '用户名已存在'})
        else:
            new_user = user(username=username, password=password, anth=0)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'status': 'success', 'message': '注册成功'})
@app.route('/get_weather', methods=['GET'])
def get_weather():
    now = datetime.date.today()
    today = datetime.date(2014, now.month, now.day)
    week_ago = today - datetime.timedelta(days=7)
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(weather).filter(weather.date >= week_ago, weather.date <= today).order_by(weather.date).all()
            db.session.close()
    return jsonify({
            'date': [i.date.strftime('%m-%d') for i in r],
            'temp': [i.temp for i in r],
            'wet': [i.wet for i in r],
            'sun': [i.sun for i in r],
            'tsoil1': [i.tsoil1 for i in r],
            'tsoil2': [i.tsoil2 for i in r],
            'tsoil3': [i.tsoil3 for i in r],
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
            'xiaoliang' : [i.buy for i in r],
            'grown' : [i.grown  for i in r],
    })
@app.route('/get_temp', methods=['GET'])
def get_temp():
    # url = "https://weather.cma.cn/api/now/54662"
    # ua = {
    #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    #     'Referer': 'https://weather.cma.cn/',
    #     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    # }
    # response = requests.get(url=url, headers=ua)
    # response.encoding = 'utf-8'
    # data = response.json()
    data = {
            "code": 0,
            "data": {
                "alarm": [
                    {
                        "effective": "2025/07/14 15:32",
                        "eventType": "11B06",
                        "id": "21020041600000_20250714153200",
                        "severity": "BLUE",
                        "signallevel": "蓝色",
                        "signaltype": "大风",
                        "title": "大连市气象台发布大风蓝色预警[Ⅳ级/一般]",
                        "type": "p0007004"
                    }
                ],
                "jieQi": "",
                "lastUpdate": "2025/07/14 21:40",
                "location": {
                    "id": "54662",
                    "name": "大连",
                    "path": "中国, 辽宁, 大连"
                },
                "now": {
                    "feelst": 28.6,
                    "humidity": 52,
                    "precipitation": 0,
                    "pressure": 989,
                    "temperature": 27.4,
                    "windDirection": "西北风",
                    "windDirectionDegree": 352,
                    "windScale": "微风",
                    "windSpeed": 2.8
                }
            },
            "msg": "success"
        }
    return jsonify(data)
@app.route('/get_price', methods=['GET'])
def get_price():
    res = getdata()
    # 将价格字符串转为小数
    res = [float(r) for r in res]
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(crop).all()
            for item,pr in zip(r,res):
                item.price = pr
            db.session.commit()
            db.session.close()
    return jsonify(res)
@app.route('/get_area')
def get_area():
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(area).all()
            db.session.close()
            data = [
                {'name': i.prov, 'type': i.type, 'output': float(i.output)}
                for i in r
            ]
    return jsonify(data)
if __name__ == '__main__':
    app.run()
