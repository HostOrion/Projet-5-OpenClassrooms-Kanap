var orderId = document.getElementById("orderId");
var orderIdURL = new URL(window.location.href).searchParams.get("orderId");

orderId.innerHTML = orderIdURL;