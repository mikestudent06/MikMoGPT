import botImage from './assets/bot.svg'
import userImage from './assets/user.svg'

// ...

const bot = botImage;
const user = userImage;

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

function chatStripe(isAi, value, uniqueId) {
    const messageText = isAi ? "Typing..." : value;
    return `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img src=${isAi ? bot : user} alt="${isAi ? 'bot' : 'user'}" />
                </div>
                <div class="message" id=${uniqueId}>${messageText}</div>
            </div>
        </div>
    `;
}

let loadInterval;

function loader(element) {
    element.textContent = "";

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator:
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++;
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}


const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    // console.log(data.get("prompt"));

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    // console.log(uniqueId);
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)
    // console.log(messageDiv);

    if (messageDiv) {
        // messageDiv.innerHTML = "...";
        setTimeout(() => {
            loader(messageDiv)       
        },0);
     
        //Now we fetch the data from the server which is gonna be the bot's response:
        const response = await fetch(/*'http://localhost:5000'*/'https://mik-mo-gpt-52j3-qxgeacgrx-mikestudent06.vercel.app/' , {
             method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
         })

        clearInterval(loadInterval)
        messageDiv.innerHTML = " ";

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
            console.log("DAta",parsedData);
            typeText(messageDiv, parsedData);
        } else {
            const err = await response.text();

            messageDiv.innerHTML = "Something went wrong";
            alert(err);
        }
    }
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})