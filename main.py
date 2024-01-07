from flask import Flask, render_template, request, jsonify
import smtplib
import re
import requests
import json

app = Flask(__name__)
TELEGRAM_BOT_TOKEN = '6532818104:AAFkAxwTMthHrKHfjksCaGnKBSDuNIIexLs'  
TELEGRAM_CHAT_ID = '6296558403'  

def send_telegram_message(name, phone, address, mon_an):
    if not name or not phone or not address:
        return {'error': 'Vui lòng điền đầy đủ thông tin.'}
    else:
        url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
        params = {'chat_id': TELEGRAM_CHAT_ID, 'text': f'Đơn đặt hàng mới:{mon_an}\nHọ tên: {name}\nSĐT: {phone}\nĐịa chỉ: {address}'}
        response = requests.post(url, params = params)
        return response.json()
@app.route('/send-telegram', methods=['POST'])
def send_telegram_route():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    mon_an=data.get('mon_an')
    response = send_telegram_message(name, phone, address,mon_an)

    if response.get('ok'):
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Hãy điền đầy đủ thông tin.'})

with open('doan.json','r', encoding='utf-8') as file:
    data = json.load(file)
    dishes=data.get('doan',[])

@app.route("/")
def home():
    return render_template("home.html", dishes=dishes)


@app.route('/validate', methods=['POST'])    
def validate():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    if not validate_name(name):
        return jsonify({'error': 'Vui lòng nhập họ tên có dấu và không có số.'})
    if not validate_phone_number(phone):
        return jsonify({'error': 'Vui lòng nhập số điện thoại hợp lệ.'})
    if not validate_address(address):
        return jsonify({'error': 'Vui lòng nhập địa chỉ không để trống.'})

    return jsonify({'successMessage': 'Thông tin đã được xác nhận thành công!'})

def validate_name(name):
    return bool(re.match(r'^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵĐđ]+$', name))
def validate_phone_number(phone):
    return bool(re.match(r'^\d{10}$', phone))
def validate_address(address):
    return bool(address.strip())    


if __name__ == "__main__":
   app.run(debug=True)
