document.addEventListener("DOMContentLoaded", () => {

let unknownQuestions = [];
let chatbotData = [];

/* LOAD DATA */

fetch("/get-data")
.then(response => response.json())
.then(data => {
    chatbotData = data.responses;
});

/* ELEMENTS */

const chatbotWrapper = document.getElementById("chatbot-wrapper");
const chatbotContainer = document.getElementById("chatbot-container");
const closeChat = document.getElementById("close-chat");

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chatbot-messages");

const simiAgent = document.getElementById("simi-agent");

/* INITIAL STATE */

chatbotContainer.style.display = "none";

/* OPEN CHAT (ICON + LABEL CLICK) */

chatbotWrapper.addEventListener("click", function () {
    chatbotContainer.style.display = "block";
    simiAgent.style.display = "none";
});

/* OPEN CHAT (AGENT CLICK) */

simiAgent.addEventListener("click", function () {
    chatbotContainer.style.display = "block";
    simiAgent.style.display = "none";

    setTimeout(() => {
        let welcome = document.createElement("div");
        welcome.classList.add("bot-message");
        welcome.innerHTML = "<b>Simi:</b> 👋 Welcome to SkillGlider! How can I assist you today?";

        chatMessages.appendChild(welcome);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
});

/* AUTO HIDE AGENT */

setTimeout(() => {
    if (chatbotContainer.style.display === "none") {
        simiAgent.style.display = "none";
    }
}, 10000);

/* AUTO HIDE LABEL */

setTimeout(() => {
    document.getElementById("chatbot-label").style.display = "none";
}, 8000);

/* CLOSE CHAT */

closeChat.addEventListener("click", function () {
    chatbotContainer.style.display = "none";
});

/* SEND MESSAGE */

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        sendMessage();
    }
});

function sendMessage(){

let message = userInput.value.trim();
if(message === "") return;

let userMessage = document.createElement("div");
userMessage.classList.add("user-message");
userMessage.textContent = message;

chatMessages.appendChild(userMessage);
userInput.value = "";

chatMessages.scrollTop = chatMessages.scrollHeight;

/* TYPING */

let typingMessage = document.createElement("div");
typingMessage.classList.add("bot-message");
typingMessage.textContent = "Simi is typing...";

chatMessages.appendChild(typingMessage);

/* RESPONSE */

setTimeout(function(){

let botReply = getBotResponse(message);

chatMessages.removeChild(typingMessage);

let botMessage = document.createElement("div");
botMessage.classList.add("bot-message");
botMessage.innerHTML = "<b>Simi:</b> " + botReply;

chatMessages.appendChild(botMessage);

chatMessages.scrollTop = chatMessages.scrollHeight;

},1000);
}

/* BOT LOGIC */

function getBotResponse(input){

input = input.toLowerCase().trim();

let bestMatch = null;
let bestScore = 0;

for(let item of chatbotData){

let score = 0;

for(let keyword of item.keywords){

if(input === keyword || input.includes(keyword)){
score++;
}
}

if(score > bestScore){
bestScore = score;
bestMatch = item.reply;
}
}

if(bestScore > 0){
return bestMatch;
}

unknownQuestions.push(input);

return "I'm sorry, I don't currently have information about that.<br><br>👉 <a href='https://www.skillglider.in/problem.html' target='_blank'>Contact Support</a>";
}

/* QUICK BUTTONS */

const quickButtons = document.querySelectorAll(".quick-btn");

quickButtons.forEach(button => {
    button.addEventListener("click", function(){
        userInput.value = button.textContent;
        sendMessage();
    });
});

});