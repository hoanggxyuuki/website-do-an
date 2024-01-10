from flask import Flask, render_template, request, jsonify
import re
import requests
import json
dishes=requests.get("http://localhost:3000/doan").json()
#khởi tạo Flask và trỏ đến trang chủ website
app = Flask(__name__)
@app.route("/")
def home():
    return render_template("home.html", dishes=dishes)
#Token và id của bot telegram
TELEGRAM_BOT_TOKEN = '6532818104:AAFkAxwTMthHrKHfjksCaGnKBSDuNIIexLs'  
TELEGRAM_CHAT_ID = '6296558403'  
@app.route('/send-telegram', methods=['POST'])
#lấy thông tin khách hàng nhập vào
def send_telegram_route():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    mon_an=data.get('mon_an')
    so_luong=data.get('so_luong')
    #kiểm tra thông tin khách hàng nhập vào
    if not validate_name(name):
        return jsonify({'error': 'Vui lòng nhập họ tên có dấu và không có số.'})
    if not validate_phone_number(phone):
        return jsonify({'error': 'Vui lòng nhập số điện thoại hợp lệ.'})
    if not validate_address(address):
        return jsonify({'error': 'Vui lòng nhập địa chỉ không để trống.'})
    else:
        
        response = send_telegram_message(name, phone, address,mon_an,so_luong)
#kiểm tra kết quả
        if response.get('ok'):
            return jsonify({'success': True})
        else:
            return jsonify({'error': False})
#kiểm tra kí tự người dùng nhập vào có đúng yêu cầu không
def validate_name(name):
    return bool(re.match(r'^[a-zA-Z\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵĐđ]+$', name))
#kiểm tra xem số điện thoại người dùng nhập vào có đúng 10 số hay không(hàm bool chuyển đổi re.match thành boolean)
def validate_phone_number(phone):
    return bool(re.match(r'^\d{10}$', phone))
#kiểm tra địa chỉ nhập vào , strip() dùng để loại bỏ đầu và cuối xem chuỗi kết quả bị rỗng hay không
def validate_address(address):
    return bool(address.strip())    
#gửi thông tin khách hàng
def send_telegram_message(name, phone, address, mon_an,so_luong):
    if not name or not phone or not address:
        return {'error': 'Vui lòng điền đầy đủ thông tin.'}
    else:
        url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
        params = {'chat_id': TELEGRAM_CHAT_ID, 'text': f'Đơn đặt hàng mới:{mon_an}\nSố lượng: {so_luong}\nHọ tên: {name}\nSĐT: {phone}\nĐịa chỉ: {address}'}
        response = requests.post(url, params = params)
        return response.json()

if __name__ == "__main__":
   app.run(debug=True)
