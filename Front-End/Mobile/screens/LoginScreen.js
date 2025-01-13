import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back! You've been missed!</Text>
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
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>
      <CustomButton title="Sign in" onPress={() => navigation.navigate('Dashboard')} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 20 },
  linkText: { color: '#0054AD', textAlign: 'center', marginTop: 10 },
});

export default LoginScreen;
