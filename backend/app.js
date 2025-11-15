const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./passport');

const alumnosRoutes = require('./routes/alumnos');
const materiasRoutes = require('./routes/materias');
const notasRoutes = require('./routes/notas');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/notas', notasRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
