const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationSendButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

//Options
const { username, room } = Qs.parse(Location.search, {
  ignoreQueryPrefix: true,
});

//Welcome message Rendering to the page
socket.on("welcomemessage", (welcome) => {
  console.log(welcome);
  const html = Mustache.render(messageTemplate, {
    message: welcome.text,
    createdAt: moment(welcome.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforebegin", html);
});

//Sending message from the user to the server
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

//Reciving and rendering the message to the page
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//Sending location detail from the user to the server
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

//Receving location details and rendering it to the page
socket.on("locationdetails", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//sending user name and room information to the server
socket.emit("join", { username, room });
