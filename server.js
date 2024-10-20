{
  "name": "chat-app",
  "version": "1.0.0",
  "description": "Une application de chat en ligne",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.11.15",
    "body-parser": "^1.19.0"
  }
}
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const UserSchema = new mongoose.Schema({
  nom: { type: String, unique: true },
  motDePasse: String
});

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/inscription', async (req, res) => {
  const { nom, motDePasse } = req.body;
  try {
    const user = new User({ nom, motDePasse });
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: 'Nom d\'utilisateur déjà pris.' });
  }
});

app.post('/api/connexion', async (req, res) => {
  const { nom, motDePasse } = req.body;
  const user = await User.findOne({ nom, motDePasse });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const UserSchema = new mongoose.Schema({
  nom: { type: String, unique: true },
  motDePasse: String,
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

app.post('/api/addContact', async (req, res) => {
  const { userId, contactNom } = req.body;
  const user = await User.findById(userId);
  const contact = await User.findOne({ nom: contactNom });

  if (contact) {
    user.contacts.push(contact._id);
    await user.save();
    contact.contacts.push(user._id);
    await contact.save();
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "L'utilisateur n'existe pas." });
  }
});
app.post('/api/sendMessage', async (req, res) => {
  const { fromUserId, toUserId, content } = req.body;
  const message = new Message({ from: fromUserId, to: toUserId, content });
  await message.save();
  res.json({ success: true });
});

app.get('/api/getMessages', async (req, res) => {
  const { userId, contactId } = req.query;
  const messages = await Message.find({
    $or: [
      { from: userId, to: contactId },
      { from: contactId, to: userId }
    ]
  }).sort({ timestamp: 1 });
  res.json({ success: true, messages });
});
document.getElementById('connexion').addEventListener('click', () => {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('formulaireConnexion').style.display = 'block';
});

document.getElementById('inscription').addEventListener('click', () => {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('formulaireInscription').style.display = 'block';
});

document.getElementById('boutonConnexion').addEventListener('click', async () => {
    const nom = document.getElementById('connexionNom').value;
    const motDePasse = document.getElementById('connexionMotDePasse').value;

    const response = await fetch('/api/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom, motDePasse })
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = '/chat.html?userId=' + result.userId;
    } else {
        document.getElementById('erreurConnexion').innerText = result.message;
    }
});

document.getElementById('boutonInscription').addEventListener('click', async () => {
    const nom = document.getElementById('inscriptionNom').value;
    const motDePasse = document.getElementById('inscriptionMotDePasse').value;

    if (motDePasse.length < 8 || motDePasse.length > 20) {
        document.getElementById('erreurInscription').innerText = 'Le mot de passe doit comporter entre 8 et 20 caractères.';
        return;
    }

    const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom, motDePasse })
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = '/chat.html?userId=' + result.userId;
    } else {
        document.getElementById('erreurInscription').innerText = result.message;
    }
});
