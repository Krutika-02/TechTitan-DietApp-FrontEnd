document.addEventListener('DOMContentLoaded', function () {
    // Load the chatbot dynamically
    fetch('chatbot.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('chatbot-container').innerHTML = data;

            // Attach event listeners after the chatbot content is loaded
            const chatIcon = document.getElementById('chat-icon');
            const chatbotPopup = document.getElementById('chatbot-popup');
            const closeChat = document.getElementById('close-chat');

            chatIcon.addEventListener('click', () => {
                chatbotPopup.style.display = 'flex';
            });

            closeChat.addEventListener('click', () => {
                chatbotPopup.style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error loading chatbot:', error);
        });
});
