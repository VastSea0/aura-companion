// firebaseService.js
const API_URL = 'http://192.168.1.161:3000'; // Backend'in IP ve port numarasını güncelleyin

// Kullanıcıya özel veri ekleme

/*
export const addUserData = async (collectionName, userId, newUserData) => {
    try {
        const response = await fetch(`${API_URL}/api/collection/${collectionName}/user/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Hata:", error);
    }
};

// Kullanıcıya özel veri güncelleme
export const updateUserData = async (collectionName, userId, documentId, updatedUserData) => {
    try {
        const response = await fetch(`${API_URL}/api/collection/${collectionName}/user/${userId}/${documentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Hata:", error);
    }
};

// Kullanıcıya özel veri silme
export const deleteUserData = async (collectionName, userId, documentId) => {
    try {
        const response = await fetch(`${API_URL}/api/collection/${collectionName}/user/${userId}/${documentId}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Hata:", error);
    }
};

// Kullanıcıya ait tüm dökümanları getirme
export const getUserDataUserDatas = async (collectionName, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/collection/${collectionName}/user/${userId}`);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error("Hata:", error);
    }
};
*/

const registerUser = async () => {
    try {
      const response = await fetch('http://192.168.1.161:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        setUser(data); // Kullanıcıyı state'e ekle
        alert('Başarı', 'Kayıt başarılı!');
      } else {
        alert('Hata', data.error);
      }
    } catch (error) {
      alert('Hata', 'Kayıt sırasında bir hata oluştu.');
    }
};

const loginUser = async () => {
    try {
      const response = await fetch('http://192.168.1.161:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        setUser(data); // Kullanıcıyı state'e ekle
        alert('Başarı', 'Giriş başarılı!');
      } else {
        alert('Hata', data.error);
      }
    } catch (error) {
      alert('Hata', 'Giriş sırasında bir hata oluştu.');
    }
};


const logoutUser = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    alert('Çıkış Yapıldı', 'Oturum kapatıldı.');
};