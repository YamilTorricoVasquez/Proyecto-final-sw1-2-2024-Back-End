import 'dotenv/config'
import express from 'express'

import userRouter from './routes/user.route.js'
import publicRouter from './routes/public.route.js'
import bebeRouter from './routes/bebe.route.js'
import medicamentoRouter from './routes/medicamento.route.js'
import recomendacionRouter from './routes/recomendacion.route.js'
import datoRouter from './routes/dato.route.js'
import chatRouter from './routes/chat.route.js'


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', publicRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/bebe', bebeRouter)
app.use('/api/v1/medicamento', medicamentoRouter)
app.use('/api/v1/recomendacion', recomendacionRouter)
app.use('/api/v1/dato', datoRouter)
app.use('/api/v1/chat', chatRouter)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log('Servidor andando' + PORT))