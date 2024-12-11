import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Areas yet...</Text>
      <Text style={styles.link}>How does it work?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  link: { color: '#007BFF', textDecorationLine: 'underline', marginTop: 10 },
});

export default DashboardScreen;
