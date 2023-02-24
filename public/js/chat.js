const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationSendButton = document.querySelector("#send-location");

socket.on("welcomemessage", (welcome) => {
  console.log(welcome);
});

//const text = document.querySelector("input");

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //disable
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = event.target.elements.message.value;

  socket.emit("messageSend", message, (error) => {
    //enable
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message Deliverd!");
  });
});

socket.on("message", (message) => {
  console.log(`Bot: ${message}`);
});

$locationSendButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser..");
  }

  //Disable
  $locationSendButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("sendLocation", location, () => {
      //enable
      $locationSendButton.removeAttribute("disabled");
      console.log("location shared!");
    });
  });
});
