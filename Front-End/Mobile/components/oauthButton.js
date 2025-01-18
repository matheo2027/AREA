import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OAuthButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0054AD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default OAuthButton;
