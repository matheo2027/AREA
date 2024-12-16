import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const ServiceCard = ({ service }) => {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.details}>
          {service.rating} ⭐ - {service.reviews} reviews
        </Text>
      </View>
      <Switch value={enabled} onValueChange={setEnabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 12, color: '#666' },
});

export default ServiceCard;
