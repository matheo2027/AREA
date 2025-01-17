import React from 'react';
import { View, StyleSheet, FlatList, Text, Image, Switch } from 'react-native';
import Header from '../components/Header';

const services = [
  {
    id: '1',
    name: 'Monitoring Repositories',
    reviews: 584,
    time: '1 min',
    authRequired: true,
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    id: '2',
    name: 'Repository Insights',
    reviews: 340,
    time: '2 min',
    authRequired: false,
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    id: '3',
    name: 'Pull Request Tracking',
    reviews: 200,
    time: '3 min',
    authRequired: true,
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
];

const ServicesScreen = () => {
  const handleToggle = (id, isEnabled) => {
    console.log(`Service ID: ${id}, Enabled: ${isEnabled}`);
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>All Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} onToggle={handleToggle} />}
      />
    </View>
  );
};

const ServiceCard = ({ service, onToggle }) => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle(service.id, newValue);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: service.logo }} style={styles.logo} />
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name}>{service.name}</Text>
          <View style={styles.rating}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.reviewCount}>({service.reviews} reviews)</Text>
          </View>
        </View>
        <View style={styles.metadata}>
          <Text style={styles.metaItem}>{service.time}</Text>
          <Text style={styles.metaItem}>
            {service.authRequired ? 'Auth required' : 'No auth'}
          </Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#ccc', true: '#007BFF' }}
        thumbColor={isEnabled ? '#fff' : '#fff'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', margin: 15 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: { width: 40, height: 40, marginRight: 15 },
  info: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', flexShrink: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
  star: { fontSize: 16, color: 'gold', marginRight: 5 },
  reviewCount: { fontSize: 12, color: '#666' },
  metadata: { flexDirection: 'row', marginTop: 8 },
  metaItem: { fontSize: 12, color: '#666', marginRight: 15 },
});

export default ServicesScreen;
