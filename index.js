const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const port = process.env.PORT||4000;

app.use(express.json());



mongoose.connect(process.env.MONGO_URI )
.then(() => {
    console.log('connected to MongoDB database');
})
.catch((err) => {
    console.log(err);
});


app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static( 'uploads'));



app.get('/', (req, res) => {
    console.log('home page');
    res.send('<h1>hello world</h1>');
});



app.listen(port, () => {
    console.log(`server started  and running at  port ${port}`);
});