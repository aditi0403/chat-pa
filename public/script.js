

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const prompt = document.getElementById('userInput');
  const send = document.getElementById('sendButton');
  
  //Auto-resize the textarea
  prompt.addEventListener('input', () => {
    prompt.style.height = 'auto';
    prompt.style.height = prompt.scrollHeight + 'px';
  });
  


  form.addEventListener('submit', async (e) => {
    //prevent the browser default
    e.preventDefault();

    const promptMessage = prompt.value.trim();
    if (!promptMessage) return;

    //Todo: add user message to chat
    addMessage(promptMessage, true);

    //clear the input
    prompt.value = '';
    prompt.style.height = 'auto';
    send.disabled = true;

    //Todo:Show Typing
    const typingIndicator = showTyping();
    
    try {
      //Todo:Generate response-Function
      const res = await generateResponse(promptMessage);
      typingIndicator.remove();
      //Ad AI response
      addMessage(res, false)
    } catch (error) {
      typingIndicator.remove()
      addErrorMessage(error.message)
    } finally {
      send.disabled = false;
    }
      

  })
      

  //Generate response
  async function generateResponse(prompt) {
  const res = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error("Failed to fetch from server");

  const data = await res.json();
  return data.reply;
}


  //Add user message to chat
  function addMessage(text, isUser) {
    const message = document.createElement('div')
    message.className = `message ${isUser? "user-message" : "" }`;
    message.innerHTML = `
      <div class='avatar ${isUser ? "user-avatar" : ""}'>
        ${isUser? "U" : "AI"}
      </div>
      <div class='message-content'>${text}</div>
    `;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }
  
  //show indicator
  function showTyping() {
    const indicator = document.createElement('div');
    indicator.className = 'message';
    indicator.innerHTML = `
      <div class='avatar'>AI</div>
      <div class='typing-indicator'>
        <div class='dot'></div>
        <div class='dot'></div>
        <div class='dot'></div>
      </div>
    `;
    messages.appendChild(indicator);
    messages.scrollTop = messages.scrollHeight;
    return indicator;
  }
  
  //Error message function
 function addErrorMessage(text) {
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `
        <div class="avatar">AI</div>
    <div class="message-content" style="color:red">
      Error: ${text}
    </div>
      `;
  }
});
