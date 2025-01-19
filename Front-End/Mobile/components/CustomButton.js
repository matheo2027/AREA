import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, isOutline = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isOutline && styles.outlineButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isOutline && styles.outlineButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  outlineButton: { backgroundColor: 'transparent', borderColor: '#007BFF', borderWidth: 1 },
  outlineButtonText: { color: '#007BFF' },
});

export default CustomButton;
