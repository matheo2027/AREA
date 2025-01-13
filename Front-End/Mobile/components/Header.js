import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.link}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Services')}>
          <Text style={styles.link}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AREditor')}>
          <Text style={styles.link}>AR Editor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.link}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: { width: 30, height: 30 },
  link: { fontSize: 16, color: '#0054AD', fontWeight: 'bold' },
});

export default Header;
