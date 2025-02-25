const mongoose = require('mongoose');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SALT_ROUNDS = 8; // 12'den 8'e düşürdük
const BATCH_SIZE = 100;
const PARALLEL_HASHING = 10; // Aynı anda 10 şifre hashle

const hashPasswords = async (users) => {
    const results = [];
    for (let i = 0; i < users.length; i += PARALLEL_HASHING) {
        const batch = users.slice(i, i + PARALLEL_HASHING);
        const hashedBatch = await Promise.all(
            batch.map(user => bcryptjs.hash(user.password, SALT_ROUNDS))
        );
        results.push(...hashedBatch);
    }
    return results;
};

const importUsers = async () => {
    try {
        const usersFile = path.join(__dirname, '..', 'users.json');
        const usersData = fs.readFileSync(usersFile, 'utf8');
        const users = JSON.parse(usersData);
        console.log(`Toplam ${users.length} kullanıcı okundu`);

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Mevcut kullanıcıları al (hepsi lowercase)
        const existingUsers = await User.find({}, 'email');
        const existingEmails = new Set(existingUsers.map(user => user.email.toLowerCase()));
        console.log(`Mevcut ${existingEmails.size} kullanıcı bulundu`);

        // JSON'daki kullanıcıları kontrol et
        const missingUsers = users.filter(user => !existingEmails.has(user.email.toLowerCase()));
        console.log(`Eksik ${missingUsers.length} kullanıcı var`);
        
        if (missingUsers.length > 0) {
            console.log('\nİlk 5 eksik kullanıcı:');
            missingUsers.slice(0, 5).forEach(user => {
                console.log(`- ${user.email} (${user.password})`);
            });

            // Yeni kullanıcıları ekle
            let addedCount = 0;

            // Batch işleme
            for (let i = 0; i < missingUsers.length; i += BATCH_SIZE) {
                const batch = missingUsers.slice(i, i + BATCH_SIZE);
                console.log(`\nBatch ${Math.floor(i/BATCH_SIZE) + 1} işleniyor...`);

                // Paralel şifreleme
                const hashedPasswords = await hashPasswords(batch);

                const batchUsers = batch.map((user, index) => ({
                    email: user.email.toLowerCase(),
                    password: hashedPasswords[index],
                    isAdmin: false,
                    tokenVersion: 0
                }));

                try {
                    const result = await User.insertMany(batchUsers, { ordered: false });
                    addedCount += result.length;
                    console.log(`${addedCount}/${missingUsers.length} kullanıcı eklendi`);
                } catch (insertError) {
                    console.error('Batch ekleme hatası:', insertError.message);
                }
            }
        }

        const finalCount = await User.countDocuments();
        console.log(`\nVeritabanında toplam ${finalCount} kullanıcı var`);

        process.exit(0);
    } catch (error) {
        console.error('Import hatası:', error);
        process.exit(1);
    }
};

importUsers(); 