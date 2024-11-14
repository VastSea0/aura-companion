// UserScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { addUserData, updateUserData, deleteUserData, getUsersData } from '@/services/firebaseservice';

const UserScreen = () => {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);

    const collectionName = 'users';

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const fetchedUsers = await getUsersData(collectionName);
        setUsers(fetchedUsers);
    };

    const handleAddUser = async () => {
        if (userName.trim() && userEmail.trim()) {
            const newUser = { name: userName, email: userEmail };
            const addedUser = await addUserData(collectionName, newUser);
            if (addedUser) {
                setUsers([...users, addedUser]);
                setUserName('');
                setUserEmail('');
            } else {
                Alert.alert("Hata", "Kullanıcı eklenirken bir hata oluştu.");
            }
        }
    };

    const handleUpdateUser = async () => {
        const updatedUser = { name: userName, email: userEmail };
        const result = await updateUserData(collectionName, editingUserId, updatedUser);
        if (result) {
            setUsers(users.map(user => user.id === editingUserId ? result : user));
            setEditingUserId(null);
            setUserName('');
            setUserEmail('');
        } else {
            Alert.alert("Hata", "Kullanıcı güncellenirken bir hata oluştu.");
        }
    };

    const handleDeleteUser = async (userId) => {
        const success = await deleteUserData(collectionName, userId);
        if (success) {
            setUsers(users.filter(user => user.id !== userId));
        } else {
            Alert.alert("Hata", "Kullanıcı silinirken bir hata oluştu.");
        }
    };

    const handleEditUser = (user) => {
        setEditingUserId(user.id);
        setUserName(user.name);
        setUserEmail(user.email);
    };

    return (
        <View style={{
            flex: 1,
            padding: 20,
            justifyContent: 'center',
             

        }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Kullanıcı Listesi</Text>
            
            <TextInput
                placeholder="Kullanıcı adı"
                value={userName}
                onChangeText={setUserName}
                style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 8,
                    marginVertical: 10,
                    borderRadius: 5
                }}
            />
            <TextInput
                placeholder="Kullanıcı email"
                value={userEmail}
                onChangeText={setUserEmail}
                style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 8,
                    marginVertical: 10,
                    borderRadius: 5
                }}
            />
            
            <Button
                title={editingUserId ? "Kullanıcıyı Güncelle" : "Kullanıcı Ekle"}
                onPress={editingUserId ? handleUpdateUser : handleAddUser}
            />

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            borderBottomColor: '#ddd',
                            borderBottomWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text>{item.name} ({item.email})</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Button title="Düzenle" onPress={() => handleEditUser(item)} />
                            <Button title="Sil" onPress={() => handleDeleteUser(item.id)} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default UserScreen;
