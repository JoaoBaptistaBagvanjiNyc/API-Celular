const express = require('express');
const app = express();

app.use(express.json());

// ======================================================
// ETAPA 1: Tratar e Validar Celular
// ======================================================
app.post('/tratar-telefone', (req, res) => {
  const { telefone } = req.body;

  if (!telefone) {
    return res.status(400).json({ valido: false, erro: 'Informe o número de telefone.' });
  }

  // Remove caracteres não numéricos
  let numeroLimpo = telefone.toString().replace(/\D/g, '');

  // Remove o DDI 55 do início se existir
  if (numeroLimpo.startsWith('55')) {
    numeroLimpo = numeroLimpo.substring(2);
  }

  // Valida se ficou com 10 ou 11 dígitos (DDD + número)
  if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
    return res.status(400).json({
      valido: false,
      erro: 'Número inválido. Envie o telefone com DDD (ex: 11999998888).'
    });
  }

  return res.json({
    valido: true,
    telefoneTratado: numeroLimpo
  });
});

// ======================================================
// ETAPA 2: Validar Nome
// ======================================================
app.post('/validar-nome', (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ valido: false, erro: 'Informe o nome.' });
  }

  // Divide por espaços
  const palavras = nome.toString().trim().split(/\s+/);

  // Valida se tem pelo menos 2 palavras com no mínimo 3 letras cada
  if (palavras.length < 2 || palavras[0].length < 3 || palavras[1].length < 3) {
    return res.status(400).json({
      valido: false,
      erro: 'Por favor, digite seu nome e sobrenome (mínimo de 3 letras em cada).'
    });
  }

  return res.json({
    valido: true,
    nomeTratado: nome.trim()
  });
});

// ======================================================
// ETAPA 3: Validar CPF
// ======================================================
app.post('/validar-cpf', (req, res) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({ valido: false, erro: 'Informe o CPF.' });
  }

  // Remove pontos e traços
  const cpfLimpo = cpf.toString().replace(/\D/g, '');

  if (cpfLimpo.length !== 11) {
    return res.status(400).json({
      valido: false,
      erro: 'CPF inválido. O CPF precisa ter exatamente 11 dígitos.'
    });
  }

  return res.json({
    valido: true,
    cpfTratado: cpfLimpo
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor do Bot rodando na porta ${PORT}`);
});