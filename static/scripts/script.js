/*Lấy dữ liệu từ api được build bằng json-server và lưu vào biến dish */
let dish = [];
document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/doan')
    .then(response => response.json())
    .then(data => {
      displayDishes(data);
    })
    .catch(error => {
      console.error('Error fetching dishes:', error);
    });
  document.addEventListener('click', function (event) {
    /* ẩn popup khi người dùng chưa thao tác click vào hình ảnh*/
    if (!event.target.closest('.popup-recipe') && document.getElementById('popup-recipe').style.display === 'none') {
      hidePopup();
    }
  });
});
/*Hiển thị tên món ăn và hình ảnh đi kèm , thêm điều kiện click vào hình ảnh sẽ hiển thị popup*/
function displayDishes(dishes) {
  const dishesContainer = document.getElementById('dishesContainer');

  dishes.forEach(dish => {
    const dishElement = document.createElement('div');
    dishElement.className = 'dish';
    dishElement.innerHTML = `
      <h2>${dish.name}</h2>
      <div class="thumb">
        <img src="${dish.img}" alt="Dish Image" onclick="showPopup(${dish})">
        </div>
    `;
    dishElement.addEventListener('click', function () {
      showPopup(dish);
    });
    dishesContainer.appendChild(dishElement);
  });
}
/*Hiển thị thông tin món ăn khi click vào popup*/
function showPopup(dish) {
  document.getElementById('ingredients').textContent = 'Nguyên liệu: ' + dish.ingredients;
  document.getElementById('instructions').textContent = 'Cách làm: ' + dish.instructions;
  document.getElementById('price').textContent = 'Giá:' + dish.price;
  document.getElementById('mon_an').value = dish.name;
  const popup = document.getElementById('popup-recipe');
  popup.style.display = 'flex';
}
function hidePopup() {
  const popup = document.getElementById('popup-recipe');
  popup.style.display = 'none';
}
function showDetails(event) {
  var details = event.target.parentNode.querySelector('.details');
  details.style.display = "block";
}
/*Lấy tất cả phần tử có tên 'dish' , lọc lại từ phần tử món ăn và thêm vào class fadeIn*/
window.addEventListener('scroll', function () {
  var dishes = document.querySelectorAll('.dish');
  dishes.forEach(dish => {
    
    dish.classList.add('fadeIn');
    
  });
});

/*Thêm mỗi sự kiện click cho từng hình ảnh*/
let images = document.querySelectorAll('.dish img');
let popup = document.querySelector('.popup-recipe');
images.forEach(img => {
  img.addEventListener('click', function (event) {
    event.stopPropagation(); 
    popup.style.display = 'flex';
  })
})
document.getElementById("name").addEventListener("click", function (event) {
  event.stopPropagation();
});
document.getElementById("phone").addEventListener("click", function (event) {
  event.stopPropagation();
});
document.getElementById("address").addEventListener("click", function (event) {
  event.stopPropagation();
});
document.getElementById("mon_an").addEventListener("click", function (event) {
  event.stopPropagation();
});
document.getElementById("quantity").addEventListener("click", function (event) {
  event.stopPropagation();
});

/*Lấy tên món ăn */
function setDish(dish) {
  document.getElementById("mon_an").value = dish['name'];
  validateAndSendTelegram();
}
/* Lấy thông tin khách hàng và hiển thị kết quả trả về*/
function validateAndAddToCart() {
  var nameInput = document.getElementById("name").value;
  var phoneInput = document.getElementById("phone").value;
  var addressInput = document.getElementById("address").value;
  var mon_anI = document.getElementById("mon_an").value;
  var so_luongI=document.getElementById("quantity").value;

  // Gửi yêu cầu kiểm tra đến server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/send-telegram", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            
            if (response.success) {
                alert("Đặt hàng thành công");
            } else if (response.error) {
                alert("Có lỗi: " + response.error);
            } else {
                alert("Gửi tin nhắn thất bại.");
            }
        } else {
            alert("Có lỗi kết nối đến server.");
        }
    }
};
        

  var data = {
    name: nameInput,
    phone: phoneInput,
    address: addressInput,
    mon_an: mon_anI,
    so_luong:so_luongI
  };
  
  xhr.send(JSON.stringify(data));
  
}

