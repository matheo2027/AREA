import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Configure your Automation Space</Text>
      <Text style={styles.subtitle}>
        Explore all the existing services roles based on your interest.
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton title="Login" onPress={() => navigation.navigate('Login')} />
        <CustomButton
          title="Register"
          onPress={() => navigation.navigate('Register')}
          isOutline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 250 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 10 },
});

export default WelcomeScreen;
