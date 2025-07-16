from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
import datetime
from climbpre import getdata
from sqlalchemy import text, func

app = Flask(__name__)
CORS(app)
HOSTNAME = "127.0.0.1"
PORT = 3306
USERNAME = "root"
PASSWORD = "123456"
DATABASE = "display"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4"
)
db = SQLAlchemy(app)
app.secret_key = "6ragonPa5ace1n"


class weather(db.Model):
    __tablename__ = "weather"
    date = db.Column(db.Date, primary_key=True)
    temp = db.Column(db.Numeric(10, 2))
    wet = db.Column(db.Numeric(10, 2))
    sun = db.Column(db.Numeric(10, 2))
    tsoil1 = db.Column(db.Numeric(10, 2))
    tsoil2 = db.Column(db.Numeric(10, 2))
    tsoil3 = db.Column(db.Numeric(10, 2))


class crop(db.Model):
    __tablename__ = "crop"
    type = db.Column(db.String(20), primary_key=True)
    day = db.Column(db.Integer)
    output = db.Column(db.Numeric(10, 2))
    price = db.Column(db.Numeric(10, 2))
    buy = db.Column(db.Integer)
    grown = db.Column(db.Integer)


class area(db.Model):
    __tablename__ = "area"
    prov = db.Column(db.String(20), primary_key=True)
    type = db.Column(db.String(20))
    output = db.Column(db.Numeric(10, 2))


class user(db.Model):
    __tablename__ = "user"
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    anth = db.Column(db.Integer, nullable=False)


# history table
class ChatHistory(db.Model):
    __tablename__ = "chat_history"
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(64), nullable=False, index=True)
    uid = db.Column(db.Integer, db.ForeignKey("user.uid"), nullable=False)
    # message 字段现在存储结构化的 JSON 字符串
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "uid": self.uid,
            "message": self.message,  # message 是 JSON 字符串
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


@app.route("/")
def index():  # put application's code here
    if session.get("logged_in"):
        return redirect(url_for("home"))
    return render_template("login.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("error-404.html"), 404


@app.route("/login", methods=["GET", "POST"])
def login():
    res = request.get_json()
    username = res.get("username")
    password = res.get("password")
    print(username, password)
    with app.app_context():
        with db.engine.connect() as conn:
            user_info = (
                db.session.query(user)
                .filter(user.username == username, user.password == password)
                .first()
            )
            db.session.close()
        if user_info:
            session["logged_in"] = True
            session["username"] = username
            session["uid"] = user_info.uid
            session["role"] = user_info.anth
            return jsonify(
                {
                    "status": "success",
                    "message": "登录成功!",
                    "uid": user_info.uid,
                    "utype": user_info.anth,
                    "username": user_info.username,
                }
            )
        return jsonify({"status": "error", "message": "用户名或密码错误"})


# check single all history
@app.route("/users/<int:uid>/history", methods=["GET"])
def get_user_history(uid):
    user = user.query.get_or_404(uid)
    histories = (
        ChatHistory.query.filter_by(uid=uid)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )
    return jsonify([h.to_dict() for h in histories])


# add session
@app.route("/users/<int:uid>/history", methods=["POST"])
def add_user_history(uid):
    user = user.query.get_or_404(uid)
    data = request.get_json()
    if not data or "message" not in data or "session_id" not in data:
        return jsonify({"error": "缺少 message 或 session_id"}), 400

    new_history = ChatHistory(
        uid=user.uid,
        message=data["message"],  # 前端会传来 JSON 字符串
        session_id=data["session_id"],
    )
    db.session.add(new_history)
    db.session.commit()
    return jsonify(new_history.to_dict()), 201


# delete session
@app.route("/users/<int:uid>/sessions/<string:session_id>", methods=["DELETE"])
def delete_session(uid, session_id):
    # 确保用户存在
    user.query.get_or_404(uid)
    # 删除属于该用户和该会话的所有记录
    ChatHistory.query.filter_by(uid=uid, session_id=session_id).delete()
    db.session.commit()
    return jsonify(
        {"message": f"Session {session_id} deleted successfully for user {uid}"}
    )


#  delete all history
@app.route("/users/<int:uid>/history", methods=["DELETE"])
def clear_all_user_history(uid):
    user = user.query.get_or_404(uid)
    ChatHistory.query.filter_by(uid=user.uid).delete()
    db.session.commit()
    return jsonify({"message": f"All history for user {user.username} cleared"})


@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    session.pop("username", None)
    session.pop("uid", None)
    session.pop("role", None)
    return redirect(url_for("index"))


@app.route("/home", methods=["GET"])
def home():
    return render_template("front.html")


@app.route("/admin", methods=["GET"])
def admin():
    if not session.get("logged_in"):
        return redirect(url_for("index"))
    if session.get("role") != 1:
        return redirect(url_for("home"))
    return render_template("admin.html")


@app.route("/create", methods=["GET", "POST"])
def create():
    if request.method == "GET":
        return render_template("register.html")
    else:
        res = request.form
        username = res.get("username")
        password = res.get("password")
        print(username, password)
        if db.session.query(user).filter(user.username == username).first():
            return jsonify({"status": "error", "message": "用户名已存在"})
        else:
            new_user = user(username=username, password=password, anth=0)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"status": "success", "message": "注册成功"})


@app.route("/get_weather", methods=["GET", "POST"])
def get_weather():
    if request.method == "GET":
        now = datetime.date.today()
        today = datetime.date(2014, now.month, now.day)
        week_ago = today - datetime.timedelta(days=7)
        with app.app_context():
            with db.engine.connect() as conn:
                r = (
                    db.session.query(weather)
                    .filter(weather.date >= week_ago, weather.date <= today)
                    .order_by(weather.date)
                    .all()
                )
                db.session.close()
        return jsonify(
            {
                "date": [i.date.strftime("%m-%d") for i in r],
                "temp": [i.temp for i in r],
                "wet": [i.wet for i in r],
                "sun": [i.sun for i in r],
                "tsoil1": [i.tsoil1 for i in r],
                "tsoil2": [i.tsoil2 for i in r],
                "tsoil3": [i.tsoil3 for i in r],
            }
        )
    else:
        res = request.get_json()
        date = res.get("date")
        temp = res.get("temp")
        wet = res.get("wet")
        sun = res.get("sun")
        tsoil1 = res.get("tsoil1")
        tsoil2 = res.get("tsoil2")
        tsoil3 = res.get("tsoil3")
        try:
            date_obj = datetime.datetime.strptime(date, "%Y-%m-%d").date()
            r = db.session.query(weather).filter(weather.date == date_obj).first()
            if r is not None:
                r.date = date_obj
                r.temp = temp
                r.wet = wet
                r.sun = sun
                r.tsoil1 = tsoil1
                r.tsoil2 = tsoil2
                r.tsoil3 = tsoil3
                db.session.commit()
                db.session.close()
            else:
                weather_record = weather(
                    date=date_obj,
                    temp=temp,
                    wet=wet,
                    sun=sun,
                    tsoil1=tsoil1,
                    tsoil2=tsoil2,
                    tsoil3=tsoil3,
                )
                with app.app_context():
                    with db.engine.connect() as conn:
                        db.session.merge(weather_record)
                        db.session.commit()
                        db.session.close()
                return jsonify({"status": "success", "message": "数据已保存"})
        except Exception as e:
            return jsonify({"status": "error", "message": f"数据保存失败: {str(e)}"})


@app.route("/get_crop", methods=["GET", "POST"])
def get_crop():
    if request.method == "GET":
        with app.app_context():
            with db.engine.connect() as conn:
                r = db.session.query(crop).all()
                db.session.close()
        return jsonify(
            {
                "type": [i.type for i in r],
                "day": [i.day for i in r],
                "output": [i.output for i in r],
                "price": [i.price for i in r],
                "xiaoliang": [i.buy for i in r],
                "grown": [i.grown for i in r],
            }
        )
    else:
        res = request.get_json()
        type = res.get("type")
        day = res.get("day")
        output = res.get("output")
        price = res.get("price")
        buy = res.get("buy", 0)
        grown = res.get("grown", 0)
        try:
            r = db.session.query(crop).filter(crop.type == type).first()
            if r is not None:
                r.type = type
                r.day = day
                r.output = output
                r.price = price
                r.buy = buy
                r.grown = grown
                db.session.commit()
                db.session.close()
            else:
                crop_record = crop(
                    type=type, day=day, output=output, price=price, buy=buy, grown=grown
                )
                with app.app_context():
                    with db.engine.connect() as conn:
                        db.session.merge(crop_record)
                        db.session.commit()
                        db.session.close()
            return jsonify({"status": "success", "message": "数据已保存"})
        except Exception as e:
            return jsonify({"status": "error", "message": f"数据保存失败: {str(e)}"})


@app.route("/get_temp", methods=["GET", "POST"])
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
                    "type": "p0007004",
                }
            ],
            "jieQi": "",
            "lastUpdate": "2025/07/14 21:40",
            "location": {"id": "54662", "name": "大连", "path": "中国, 辽宁, 大连"},
            "now": {
                "feelst": 28.6,
                "humidity": 52,
                "precipitation": 0,
                "pressure": 989,
                "temperature": 27.4,
                "windDirection": "西北风",
                "windDirectionDegree": 352,
                "windScale": "微风",
                "windSpeed": 2.8,
            },
        },
        "msg": "success",
    }
    return jsonify(data)


@app.route("/get_price", methods=["GET"])
def get_price():
    res = getdata()
    # 将价格字符串转为小数
    res = [float(r) for r in res]
    with app.app_context():
        with db.engine.connect() as conn:
            r = db.session.query(crop).all()
            for item, pr in zip(r, res):
                item.price = pr
            db.session.commit()
            db.session.close()
    return jsonify(res)


@app.route("/get_area", methods=["GET", "POST"])
def get_area():
    if request.method == "GET":
        with app.app_context():
            with db.engine.connect() as conn:
                r = db.session.query(area).all()
                db.session.close()
                data = [
                    {"name": i.prov, "type": i.type, "output": float(i.output)}
                    for i in r
                ]
        return jsonify(data)
    else:
        res = request.get_json()
        prov = res.get("name")
        type = res.get("type")
        output = res.get("output")
        try:
            r = (
                db.session.query(area)
                .filter(area.prov == prov, area.type == type)
                .first()
            )
            if r is not None:
                r.prov = prov
                r.type = type
                r.output = output
                db.session.commit()
                db.session.close()
            else:
                area_record = area(prov=prov, type=type, output=output)
                with app.app_context():
                    with db.engine.connect() as conn:
                        db.session.merge(area_record)
                        db.session.commit()
                        db.session.close()
            return jsonify({"status": "success", "message": "数据已保存"})
        except Exception as e:
            return jsonify({"status": "error", "message": f"数据保存失败: {str(e)}"})


@app.route("/get_users", methods=["GET", "POST"])
def get_users():
    if not session.get("logged_in"):
        return jsonify({"status": "error", "message": "请先登录"})
    if session.get("role") != 1:
        return jsonify({"status": "error", "message": "权限不足"})

    if request.method == "GET":
        with app.app_context():
            with db.engine.connect() as conn:
                r = db.session.query(user).all()
                db.session.close()
                data = [
                    {
                        "uid": i.uid,
                        "username": i.username,
                        "password": i.password,
                        "anth": i.anth,
                    }
                    for i in r
                ]
                return jsonify(data)
    else:
        res = request.get_json()
        username = res.get("username")
        password = res.get("password")
        anth = res.get("anth", 0)
        try:
            r = db.session.query(user).filter(user.username == username).first()
            if r is not None:
                r.username = username
                r.password = password
                r.anth = anth
                db.session.commit()
                db.session.close()
            else:
                user_record = user(username=username, password=password, anth=anth)
                with app.app_context():
                    with db.engine.connect() as conn:
                        db.session.merge(user_record)
                        db.session.commit()
                        db.session.close()
            return jsonify({"status": "success", "message": "数据已保存"})
        except Exception as e:
            return jsonify({"status": "error", "message": f"数据保存失败: {str(e)}"})


@app.route("/delete_weather", methods=["POST"])
def delete_weather():
    if not session.get("logged_in"):
        return jsonify({"status": "error", "message": "请先登录"})
    if session.get("role") != 1:
        return jsonify({"status": "error", "message": "权限不足"})

    res = request.get_json()
    date = res.get("date")
    print(date)
    try:
        full_date = f"2014-{date}"
        date_obj = datetime.datetime.strptime(full_date, "%Y-%m-%d").date()
        print(date_obj)
        r = db.session.query(weather).filter(weather.date == date_obj).first()
        if r is not None:
            db.session.delete(r)
            db.session.commit()
            db.session.close()
            print("删除成功")
            return jsonify({"status": "success", "message": "数据已删除"})
        else:
            print("<UNK>")
            return jsonify({"status": "error", "message": "未找到该日期的数据"})
    except Exception as e:
        return jsonify({"status": "error", "message": f"数据删除失败: {str(e)}"})


@app.route("/delete_user", methods=["POST"])
def delete_user():
    if not session.get("logged_in"):
        return jsonify({"status": "error", "message": "请先登录"})
    if session.get("role") != 1:
        return jsonify({"status": "error", "message": "权限不足"})

    res = request.get_json()
    username = res.get("username")
    try:
        r = db.session.query(user).filter(user.username == username).first()
        if r is not None:
            db.session.delete(r)
            db.session.commit()
            db.session.close()
            print("删除成功")
            return jsonify({"status": "success", "message": "用户已删除"})
        else:
            print("未找到该用户")
            return jsonify({"status": "error", "message": "未找到该用户"})
    except Exception as e:
        print("wer")
        return jsonify({"status": "error", "message": f"用户删除失败: {str(e)}"})


@app.route("/delete_crop", methods=["POST"])
def delete_crop():
    if not session.get("logged_in"):
        return jsonify({"status": "error", "message": "请先登录"})
    if session.get("role") != 1:
        return jsonify({"status": "error", "message": "权限不足"})

    res = request.get_json()
    type = res.get("type")
    try:
        r = db.session.query(crop).filter(crop.type == type).first()
        if r is not None:
            db.session.delete(r)
            db.session.commit()
            db.session.close()
            return jsonify({"status": "success", "message": "作物数据已删除"})
        else:
            return jsonify({"status": "error", "message": "未找到该作物数据"})
    except Exception as e:
        return jsonify({"status": "error", "message": f"作物数据删除失败: {str(e)}"})


@app.route("/delete_area", methods=["POST"])
def delete_area():
    if not session.get("logged_in"):
        return jsonify({"status": "error", "message": "请先登录"})
    if session.get("role") != 1:
        return jsonify({"status": "error", "message": "权限不足"})

    res = request.get_json()
    prov = res.get("prov")
    type = res.get("type")
    try:
        r = db.session.query(area).filter(area.prov == prov, area.type == type).first()
        if r is not None:
            db.session.delete(r)
            db.session.commit()
            db.session.close()
            return jsonify({"status": "success", "message": "区域数据已删除"})
        else:
            return jsonify({"status": "error", "message": "未找到该区域数据"})
    except Exception as e:
        return jsonify({"status": "error", "message": f"区域数据删除失败: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)
