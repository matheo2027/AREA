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
  button: { backgroundColor: '#0054AD', padding: 15, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  outlineButton: { backgroundColor: 'transparent', borderColor: '#0054AD', borderWidth: 1 },
  outlineButtonText: { color: '#0054AD' },
});

export default CustomButton;
