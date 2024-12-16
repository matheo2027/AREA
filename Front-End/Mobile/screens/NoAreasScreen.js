import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const NoAreasScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>No Areas yet...</Text>
      <Text style={styles.link}>How does it work?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  link: { color: '#007BFF', marginTop: 10 },
});

export default NoAreasScreen;
