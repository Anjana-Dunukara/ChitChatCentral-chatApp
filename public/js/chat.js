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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild;

  //Height of the new message
  const newMessagStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessagStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = $messages.offsetHeight;

  //Height of message container
  const containerHeight = $messages.scrollHeight;

  //How far have i scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

//Welcome message Rendering to the page
socket.on("welcomemessage", (welcome) => {
  console.log(welcome);
  const html = Mustache.render(messageTemplate, {
    name: welcome.name,
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
    name: message.name,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
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
    name: location.name,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

//sending user name and room information to the server
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

//Listning to users in the joining and leaving
socket.on("roomdata", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});
