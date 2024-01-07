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
    
    if (!event.target.closest('.popup-recipe') && document.getElementById('popup-recipe').style.display === 'none') {
      hidePopup();
    }
  });
});

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

window.addEventListener('scroll', function () {
  var dishes = document.querySelectorAll('.dish');
  dishes.forEach(dish => {
    if (isInViewport(dish)) {
      dish.classList.add('fadeIn');
    }
  });
});


let buttons = document.querySelectorAll('.btn-recipe');
buttons.forEach(button => {
  button.addEventListener('click', function () {
    let recipe = this.parentElement.querySelector('.recipe');
    recipe.style.display = 'block';
  });
});
function isInViewport(element) {
  // Lógic kiểm tra xem phần tử đã xuất hiện trong viewport hay chưa
  return true / false;
}

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

function setDish(dish) {
  document.getElementById("mon_an").value = dish['name'];
  validateAndSendTelegram();
}
function validateAndAddToCart() {
  var nameInput = document.getElementById("name").value;
  var phoneInput = document.getElementById("phone").value;
  var addressInput = document.getElementById("address").value;
  var mon_anI = document.getElementById("mon_an").value;

  // Gửi yêu cầu kiểm tra đến server
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/send-telegram", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        alert("Đặt hàng thành công");
      } else {
        alert("Có lỗi kết nối đến server.");
      }
    }
  };

  var data = {
    name: nameInput,
    phone: phoneInput,
    address: addressInput,
    mon_an: mon_anI
  };

  xhr.send(JSON.stringify(data));
}

function handleValidationResponse(response) {
  var messageBox = document.getElementById("message-box");
  if (response.error) {
    // Tùy chỉnh thông báo lỗi

    alert("Lỗi: " + response.error);
  } else {
 

    alert(response.successMessage);
  }
  messageBox.style.display = "block";
}