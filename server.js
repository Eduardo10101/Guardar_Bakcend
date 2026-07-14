require('dotenv').config();
const lugaresRoutes = require('./routes/lugares');
const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios');
const convitesRoutes = require('./routes/convites');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/lugares', lugaresRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/convites', convitesRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});