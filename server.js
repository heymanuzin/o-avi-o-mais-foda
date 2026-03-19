import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado - Aeroporto DB!'))
  .catch(err => console.error('❌ Erro MongoDB:', err));

const passageiroSchema = new mongoose.Schema({
  nome: String,
  cpf: String,
  dataNascimento: String,
  estaNoEmbarque: Boolean
});

const PassageiroModel = mongoose.model('Passageiro', passageiroSchema);

app.get('/', (req, res) => res.send('Aeroporto API Online! /passageiros'));

app.get('/passageiros', async (req, res) => {
  const passageiros = await PassageiroModel.find();
  res.json(passageiros);
});

app.post('/passageiros', async (req, res) => {
  const novo = new PassageiroModel(req.body);
  await novo.save();
  res.json({message: 'Passageiro salvo!', data: novo});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🛫 Server rodando em http://localhost:${PORT}`));

