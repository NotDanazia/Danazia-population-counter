const userId = new URLSearchParams(window.location.search).get('userId');

async function fetchContacts() {
    const response = await fetch('/api/getContacts?userId=' + userId);
    const result = await response.json();
    if (result.success) {
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        result.contacts.forEach(contact => {
            const li = document.createElement('li');
            li.innerText = contact.nom;
            li.addEventListener('click', () => {
                document.getElementById('contactNom').innerText = contact.nom;
                fetchMessages(contact._id);
            });
            contactsList.appendChild(li);
        });
    }
}

async function addContact() {
    const contactNom = document.getElementById('newContact').value;
    const response = await fetch('/api/addContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, contactNom })
    });
    const result = await response.json();
    if (result.success) {
        fetchContacts();
    } else {
        document.getElementById('erreurContact').innerText = result.message;
    }
}

async function fetchMessages(contactId) {
    const response = await fetch('/api/getMessages?userId=' + userId + '&contactId=' + contactId);
    const result = await response.json();
    if (result.success) {
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';
        result.messages.forEach(message => {
            const div = document.createElement('div');
            div.innerText = (message.from === userId ? 'Vous: ' : '') + message.content;
            messagesList.appendChild(div);
        });
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value;
    const contactNom = document.getElementById('contactNom').innerText;
    const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fromUserId: userId, toUserId: contactNom, content })
    });
    const result = await response.json();
    if (result.success) {
        messageInput.value = '';
        fetchMessages(contactNom);
    }
}

document.getElementById('addContactButton').addEventListener('click', addContact);
document.getElementById('sendMessageButton').addEventListener('click', sendMessage);

fetchContacts();
