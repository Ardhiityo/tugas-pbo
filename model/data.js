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
    waktu: {
        tgl: {
            type: String,
            required: true
        },
        bulan: {
            type: String,
            required: true
        },
        tahun: {
            type: String,
            required: true
        },
        jam: {
            type: String,
            required: true
        },
        menit: {
            type: String,
            required: true
        }
    }
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;