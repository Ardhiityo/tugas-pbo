const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({
    extended: true //untuk mengirim data tipe urlencoded
}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    nim: {
        type: Number,
        required: true
    },
    keluhan: {
        type: String,
        required: true
    },
    waktu : {
        type: String,
        required: true
    }
});

const Data = mongoose.model('Data', DataSchema);
mongoose.connect('mongodb://127.0.0.1:27017/pbo')
    .then(() => console.log('Connected!'))
    .catch((err) => err);
    
    
app.get('/user/add', async (req, res) => {
    res.render('add');
})

app.post('/user/add', (req, res) => {
    let user = {
        nama : req.body.nama,
        nim : req.body.nim,
        keluhan : req.body.keluhan,
        waktu : new Date()
    }
    const data = new Data(user);
    data.save();
    res.redirect(`/user/detail/${req.body.nim}`);
})

app.get('/user/add/:nim', async (req, res) => {
    const {nim} = req.params;
    res.render('adds', {nim});
})

app.post('/user/add/:nim', async (req, res) => {
    const {nim} = req.params;
    const user = await Data.findOne({nim});
    const userAdd = {
        nama : user.nama,
        nim : user.nim,
        keluhan : req.body.keluhan,
        waktu : new Date()
    }
    const data = new Data(userAdd);
    data.save();
    res.redirect(`/user/detail/${nim}`);
})

app.get('/user/detail/:nim', async (req, res) => {
    const {nim} = req.params;
    const datas = await Data.find({nim});
    res.render('detail', {
        datas, nim
    });
})

app.listen(8080, () => {
    console.log('App listening on http://localhost:8080');
})