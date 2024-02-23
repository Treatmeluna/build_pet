from flask import Flask, request, render_template, jsonify, Response
import json, requests
from functools import wraps

app = Flask(__name__)
# utf-8 변환 // ascii 끄기.
# app.config['JSON_AS_ASCII']=False -> 잘 안됨ㅠㅠ

url = 'http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic'
params ={'serviceKey' : 'AcFTcc39b5obR0Q4JyRCK7LFsN2x7peNoAl0rt0OISBhx4teuvMmHc5NwivY7UIZJKyHcDfY6I5JzDYgxFEPag==', 'numOfRows' : '1000', 'pageNo' : '1', '_type' : 'json' }


# utf-8
def as_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        res = f(*args, **kwargs)
        res = json.dumps(res, ensure_ascii=False).encode('utf8')
        return Response(res, content_type='application/json; charset=utf-8')
    return decorated_function

@app.route('/')
@as_json
def hello():
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        return {'error': 'failed to fetch data'}

# @app.route('/hello')
# def hellohtml():
#     return render_template("hello.html")

# @app.route('/method', methods=['GET', 'POST'])
# def method():
#     if request.method =='GET':
#         return "GET 으로 전달"
#     else:
#         return "Post 로 전달"
    
if __name__=='__main__':
    app.run(debug=True)