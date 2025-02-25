const fs = require('fs');
const path = require('path');

const updatePasswords = () => {
    try {
        // JSON dosyasını oku
        const usersFile = path.join(__dirname, '..', 'users.json');
        const usersData = fs.readFileSync(usersFile, 'utf8');
        let users = JSON.parse(usersData);

        // Her kullanıcının şifresini güncelle
        users = users.map(user => {
            // Şifrenin sonuna 1-9 arası random bir rakam ekle
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            return {
                ...user,
                password: user.password + randomNumber
            };
        });

        // Güncellenmiş JSON'ı kaydet
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 4));
        console.log('Şifreler başarıyla güncellendi');

    } catch (error) {
        console.error('Şifre güncelleme hatası:', error);
    }
};

updatePasswords(); 