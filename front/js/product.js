//Affichage du canapé correspondant à l'ID présent dans l'url

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
let id = params.id;

fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => {
    return response.json();
  })
  .then((res) => {
    return pageProduit(res);
  });

function pageProduit(product) {

  const itemImg = document.querySelector(".item__img");
  const img = document.createElement("img");
  itemImg.appendChild(img);
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  const nameProduit = document.querySelector("#title");
  nameProduit.textContent = product.name;

  let prixKanap = product.price;

  const prix = document.querySelector("#price");
  prix.textContent = prixKanap;

  let description = product.description;

  const paraDescription = document.querySelector("#description");
  paraDescription.textContent = description;

  let couleur = product.colors;

  const choixCouleur = document.querySelector("#colors");
  if (choixCouleur != null) {
    couleur.forEach((couleur) => {
      const option = document.createElement("option");
      option.value = couleur;
      option.textContent = couleur;
      choixCouleur.appendChild(option);
    });
  }
}

// Rattacher le bouton "ajouter au panier" au Local Storage

const btn = document.querySelector ('#addToCart')
  if (btn != null){
    btn.addEventListener("click", () => {
      const color = document.querySelector('#colors').value;
      const quantity = document.querySelector('#quantity').value;
      if (color === "" && (quantity == null || quantity == 0)) {
        alert("Vous devez d'abord choisir la couleur et le nombre d'articles.");
        return
      } else if (color === "") {
        alert("Vous devez d'abord choisir la couleur.");
        return
      } else if (quantity == null || quantity == 0 || quantity > 100) {
        alert("Vous devez d'abord choisir le nombre d'articles (entre 1 et 100).");
        return
      }
      var cart = localStorage.getItem("cart")
      var template = {id: id, color: color, quantity: quantity}
      if (cart == null) {
        cart = [template]
      } else {
        cart = JSON.parse(cart)
        var found = false
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id == id && cart[i].color == color) {
            cart[i].quantity = parseInt(cart[i].quantity) + parseInt(quantity)
            found = true
            break
          }
        }
        if (!found) {
          cart.push(template)
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart))
   })
}
console.log(localStorage.getItem("cart"))