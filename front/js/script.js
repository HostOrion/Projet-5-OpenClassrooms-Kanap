// Récupération des données de l'API pour les afficher dans la page d'accueil

fetch("http://localhost:3000/api/products/")
  .then((response) => {
    return response.json();
  })
  .then((kanap) => {
    return produits(kanap);
  });

function produits(data) {
  data.forEach((Kanap) => {
    const id = Kanap._id;
    const lien = document.createElement("a");
    lien.href = "./product.html?id=" + id;

    const article = document.createElement("article");

    const image = document.createElement("img");
    image.src = Kanap.imageUrl;
    image.alt = Kanap.altTxt + " , " + Kanap.name;

    const h3 = document.createElement("h3");
    h3.classList.add("productName");
    h3.textContent = Kanap.name;

    const p = document.createElement("p");
    p.classList.add("productDescription");
    p.textContent = Kanap.description;

    const items = document.querySelector("#items");

    items.appendChild(lien);
    lien.appendChild(article);
    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);
  });
}