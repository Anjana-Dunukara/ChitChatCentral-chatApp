const socket = io();

socket.on("welcomemessage", (welcome) => {
  console.log(welcome);
});

const messageForm = document.querySelector("form");
//const text = document.querySelector("input");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = event.target.elements.message.value;
  socket.emit("messageSend", message);
});

socket.on("message", (message) => {
  console.log(`Bot: ${message}`);
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser..");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
  });
});
