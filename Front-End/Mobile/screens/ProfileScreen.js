import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
        } else {
          setMessage('Failed to fetch profile data.');
        }
      } catch (error) {
        setMessage('Error fetching profile data.');
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (isLoading) return;
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://10.0.2.2:8080/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        navigation.goBack();
      } else {
        setMessage(data.message || 'Error updating profile.');
      }
    } catch (error) {
      setMessage('Error during profile update. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <CustomButton title="Save Changes" onPress={handleSaveProfile} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  message: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default ProfileScreen;
