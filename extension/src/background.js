chrome.runtime.onInstalled.addListener(() => {
    console.log('ChatGPT extension installed!');
  });
  
  // Listen for messages from popup or content script
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "fetchChatGPTResponse") {
      const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key
      const apiUrl = "https://api.openai.com/v1/chat/completions";
  
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
  
      const data = {
        model: "gpt-3.5-turbo",  // You can use a different model if needed
        messages: [
          { role: "user", content: request.userInput }
        ]
      };
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        });
        const result = await response.json();
        sendResponse({ success: true, message: result.choices[0].message.content });
      } catch (error) {
        console.error('Error:', error);
        sendResponse({ success: false, message: "Failed to get response from API" });
      }
    }
  
    // Keep the message channel open until the response is sent
    return true;
  });
  