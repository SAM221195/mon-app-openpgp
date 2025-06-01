import express from 'express';
import * as openpgp from 'openpgp';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/encrypt', async (req, res) => {
  const { message, publicKeyArmored } = req.body;

  if (!message || !publicKeyArmored) {
    return res.status(400).json({ error: 'message et publicKeyArmored sont requis' });
  }

  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: publicKey,
    });

    res.json({ encrypted });
  } catch (err) {
    console.error('Erreur chiffrement:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

