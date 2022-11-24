// Rendre les données du LocalStorage visibles dans la page panier
var cart = localStorage.getItem("cart", null)
if (cart == null){
  cart = []
} else {
  cart = JSON.parse(cart)
}

// Récupérer les données présentes dans l'API
var idInCart = []
for (var i = 0; i < cart.length; i++){
  if ( !idInCart.includes (cart[i].id)){
    idInCart.push (cart[i].id)
  }
}

var promises = []
for (var i = 0; i < idInCart.length; i++){
  var id = idInCart[i]
  promises.push ( fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => {
    return response.json();
  }))
}

Promise.all(promises)
.then (kanaps => {
  var totalPrice = 0
  var totalQuantity = 0
  for (var i = 0; i < cart.length; i++){
    
    const kanapInCart = kanaps.find(element => element._id === cart[i].id)
    totalPrice += parseInt(cart[i].quantity) * kanapInCart.price
    totalQuantity += parseInt(cart[i].quantity)
    afficherProduit(kanapInCart, cart[i])  
  }
  afficherTotal()
})

async function afficherTotal (){
  var tmpCart = localStorage.getItem("cart", null)
  if (tmpCart == null){
    tmpCart = []
  }else {
    tmpCart = JSON.parse(tmpCart)
  }
  var totalPrice = 0
  var totalQuantity = 0
  for (var i=0; i<tmpCart.length; i++){
    product = await fetch(`http://localhost:3000/api/products/${tmpCart[i].id}`)
    .then (response => {
      return response.json()
    });
    totalPrice += parseInt(product.price) * parseInt(tmpCart[i].quantity)
    totalQuantity += parseInt(tmpCart[i].quantity)
  }
  document.getElementById("totalPrice").innerHTML = totalPrice
  document.getElementById("totalQuantity").innerHTML = totalQuantity
}

// Afficher les données du LocalStorage et de l'APi dans la page panier avec la disposition de la page HTML

function afficherProduit(product, itemInCart){
        const article = document.createElement("article");
        article.classList.add("cart__item");
        article.dataset.id = itemInCart.id;
        article.dataset.color = itemInCart.color;
        document.getElementById("cart__items").appendChild(article);
        
        const divImg = document.createElement ("div")
        divImg.classList.add("cart__item__img");
        article.appendChild(divImg)

        const img = document.createElement("img");
        divImg.appendChild(img);
        img.src = product.imageUrl;
        img.alt = product.altTxt;
        
        const divContent = document.createElement ("div")
        divContent.classList.add("cart__item__content")
        article.appendChild(divContent)

        const divDescription = document.createElement ("div")
        divDescription.classList.add("cart__item__content__description")
        divContent.appendChild(divDescription)
        const name = document.createElement("h2");
        divDescription.appendChild(name);
        name.textContent = product.name;
        
        const color = document.createElement("p");
        color.textContent = itemInCart.color;
        divDescription.appendChild(color);
        
        const price = document.createElement("p");
        price.textContent = product.price + " €";
        divDescription.appendChild(price);
        
        const divSettings = document.createElement ("div")
        divSettings.classList.add("cart__item__content__settings")
        divContent.appendChild(divSettings)
        const divSettingQuantity = document.createElement ("div")
        divSettingQuantity.classList.add("cart__item__content__settings__quantity")
        divSettings.appendChild(divSettingQuantity)
        const quantity = document.createElement("p");
        quantity.textContent = "Qté : " + itemInCart.quantity;
        divSettingQuantity.appendChild(quantity);
        
        const inputQuantity = document.createElement("input");
        inputQuantity.type = "number";
        inputQuantity.classList.add("itemQuantity");
        inputQuantity.name = "itemQuantity";
        inputQuantity.min = "1";
        inputQuantity.max = "100";
        inputQuantity.value = itemInCart.quantity;
        inputQuantity.dataset.id= product._id
        inputQuantity.dataset.color= itemInCart.color
        divSettingQuantity.appendChild(inputQuantity);
        inputQuantity.addEventListener("change", function(event){
          var finalCart = JSON.parse(localStorage.getItem("cart"))
            for (var i=0; i<finalCart.length; i++){
              if (event.target.dataset.id == finalCart[i].id && event.target.dataset.color == finalCart[i].color){
                if (inputQuantity.value <= 0){
                  finalCart.splice(i, 1)
                  event.target.closest("article").remove()
                } else{
                  finalCart[i].quantity = inputQuantity.value;
                }
                localStorage.setItem("cart", JSON.stringify(finalCart));
                afficherTotal()
              }
            }
        })

        const divDelete = document.createElement("div");
        divDelete.classList.add("cart__item__content__settings__delete");
        divSettings.appendChild(divDelete);
        const productDelete = document.createElement("p");
        productDelete.classList.add("deleteItem");
        productDelete.textContent = "Supprimer";

        productDelete.dataset.id= product._id
        productDelete.dataset.color= itemInCart.color
        productDelete.addEventListener("click", function(event){
          var cart = JSON.parse(localStorage.getItem("cart"))
          for (var i=0; i<cart.length; i++){
            if (event.target.dataset.id == cart[i].id && event.target.dataset.color == cart[i].color){
              cart.splice(i, 1)
              localStorage.setItem("cart", JSON.stringify(cart))
              event.target.closest("article").remove()
              afficherTotal()
            }
          }
          
        })
        divDelete.appendChild(productDelete);
}

function submitForm(event){
  event.preventDefault();
  var validationForm = true
  if (document.getElementById("firstName").value.length < 3 || !document.getElementById("firstName").value.toLowerCase().match (/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
    document.getElementById("firstNameErrorMsg").innerText = "Veuillez entrer un prénom valide"
    validationForm = false
  } else {
    document.getElementById("firstNameErrorMsg").innerText = ""
  }

  if (document.getElementById("lastName").value.length < 3 || !document.getElementById("lastName").value.toLowerCase().match (/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
    document.getElementById("lastNameErrorMsg").innerText = "Veuillez entrer un nom valide"
    validationForm = false
  } else {
    document.getElementById("lastNameErrorMsg").innerText = ""
  }

  if (document.getElementById("address").value.length < 3){
    document.getElementById("addressErrorMsg").innerText = "Veuillez entrer une adresse valide"
    validationForm = false
  } else {
    document.getElementById("addressErrorMsg").innerText = ""
  }

  if (document.getElementById("city").value.length < 3  || !document.getElementById("city").value.toLowerCase().match (/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
    document.getElementById("cityErrorMsg").innerText = "Veuillez entrer une ville valide"
    validationForm = false
  } else {
    document.getElementById("cityErrorMsg").innerText = ""
  }

  if (!document.getElementById("email").value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
    document.getElementById("emailErrorMsg").innerText = "Veuillez entrer un email valide"
    validationForm = false
  } else {
    document.getElementById("emailErrorMsg").innerText = ""
  }  

  if (validationForm){
    var contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    }
    var products = []
    for (var i=0; i<cart.length; i++){
      products.push(cart[i].id)
    }
    var order = {
      contact,
      products
    }
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(response => {
      window.location.href = "confirmation.html?orderId=" + response.orderId
      window.localStorage.clear()
    })
  }
}