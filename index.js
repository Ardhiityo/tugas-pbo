const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Data = require('./model/data');
const Login = require('./model/user');
const Admin = require('./model/admin');

app.use(express.urlencoded({
    extended: true //untuk mengirim data tipe urlencoded
}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Login User
app.get('/login/user', (req, res) => {
    res.render('login/index');
});

app.post('/login/user', async (req, res) => {
    const {
        nim
    } = req.body;

    const login = await Data.findOne({
        nim
    });

    const user = new Login(req.body);
    user.save();

    if (login) {
        const user = await Login.findOne({
            nim
        });
        if (req.body.password === user.password) {
            res.redirect(`/user/detail/${nim}`);
            const {
                password,
                nama
            } = req.body;
            await Login.findOneAndDelete({
                password,
                nama
            }, {
                new: true
            });
        } else {
            const {
                password,
                nama
            } = req.body;
            await Login.findOneAndDelete({
                password,
                nama
            }, {
                new: true
            });
            res.send('Error! Password');
        }
    } else {
        res.redirect(`/user/dashboard/${nim}`);
    }
});
// Login User end

// User
app.get('/user/dashboard/:nim', async (req, res) => {
    const {
        nim
    } = req.params;
    res.render('user/add', {
        nim
    });
})

app.post('/user/add', (req, res) => {
    const user = {
        nama: req.body.nama,
        nim: req.body.nim,
        keluhan: req.body.keluhan,
        waktu: {
            tgl: new Date().getDate(),
            bulan: new Date().getMonth(),
            tahun: new Date().getFullYear(),
            jam: new Date().getHours(),
            menit: new Date().getMinutes(),
        }
    }
    const data = new Data(user);
    data.save();
    res.redirect(`/user/detail/${req.body.nim}`);
})

app.get('/user/add/:nim', async (req, res) => {
    const {
        nim
    } = req.params;
    res.render('user/adds', {
        nim
    });
})

app.post('/user/add/:nim', async (req, res) => {
    const {
        nim
    } = req.params;
    const user = await Data.findOne({
        nim
    });
    const userAdd = {
        nama: user.nama,
        nim: user.nim,
        keluhan: req.body.keluhan,
        waktu: {
            tgl: new Date().getDate(),
            bulan: new Date().getMonth(),
            tahun: new Date().getFullYear(),
            jam: new Date().getHours(),
            menit: new Date().getMinutes(),
        }
    }
    const data = new Data(userAdd);
    data.save();
    res.redirect(`/user/detail/${nim}`);
})

app.get('/user/detail/:nim', async (req, res) => {
    const {
        nim
    } = req.params;
    const datas = await Data.find({
        nim
    });
    const user = await Data.findOne({
        nim
    });
    res.render('user/detail', {
        datas,
        user
    });
})
// User end


// Login Admin
app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/login/admin', async (req, res) => {
    const {
        nidn,
        password
    } = req.body;
    const dataAdmin = await Admin.findOne({
        nidn
    });
    while (nidn != dataAdmin.nidn || password != dataAdmin.password) {
        res.send('Password Salah');
    }
    res.redirect('/admin/dashboard');
})
// Login Admin end

// Admin
app.get('/admin/dashboard', async (req, res) => {
    const users = await Data.find({});
    res.render('admin/dashboard', {
        users
    })
})
// Admin end

app.listen(8080, () => {
    console.log('App listening on http://localhost:8080');
});


mongoose.connect('mongodb://127.0.0.1:27017/pbo')
    .then(() => console.log('Connected!'))
    .catch((err) => err);