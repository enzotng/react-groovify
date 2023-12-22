import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Variable pour stocker l'access token
let storedAccessToken = null;

app.use(cors());
app.use(bodyParser.json());

// Route pour stocker l'access token
app.post('/storeToken', (req, res) => {
  const { accessToken } = req.body;
  storedAccessToken = accessToken; // Stockage de l'access token
  console.log("Access Token reçu et stocké:", accessToken);
  res.status(200).send('Token stored successfully');
});

// Route pour récupérer l'access token stocké
app.get('/getToken', (req, res) => {
  console.log('Demande reçue pour obtenir l\'access token');
  if (storedAccessToken) {
    res.status(200).json({ accessToken: storedAccessToken });
  } else {
    res.status(404).send('Access token not found');
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});