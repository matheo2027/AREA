import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';

const areas = [
  { id: '1', action: 'Send Email', reaction: 'Save Email to Database', status: 'Not Started' },
  { id: '2', action: 'Push Notification', reaction: 'Track User Engagement', status: 'Ongoing' },
  { id: '3', action: 'Schedule Task', reaction: 'Send Reminder Email', status: 'Completed' },
];

const DashboardScreen = () => {
  const [areaList, setAreaList] = useState([]);

  useEffect(() => {
    // Simulate fetching areas from an API
    setTimeout(() => {
      setAreaList(areas);
    }, 1000);
  }, []);


  const totalAreas = areaList.length;
  const notStarted = areaList.filter((area) => area.status === 'Not Started').length;
  const ongoing = areaList.filter((area) => area.status === 'Ongoing').length;
  const completed = areaList.filter((area) => area.status === 'Completed').length;

  return (
    <View style={styles.container}>
      <Header />
      {totalAreas === 0 ? (
        <View style={styles.noAreasContainer}>
          <Text style={styles.noAreasTitle}>No Areas yet...</Text>
          <Text style={styles.noAreasLink}>How does it work?</Text>
        </View>
      ) : (
        <>
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total Areas: {totalAreas}</Text>
            <Text style={styles.statusText}>Not Started: {notStarted}</Text>
            <Text style={styles.statusText}>Ongoing: {ongoing}</Text>
            <Text style={styles.statusText}>Completed: {completed}</Text>
          </View>

          {/* List of Areas */}
          <FlatList
            data={areaList}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.areaContainer}>
                <View style={styles.statusBar(item.status)} />
                <View style={styles.areaContent}>
                  <Text style={styles.areaText}>
                    {item.action} ➡️ {item.reaction}
                  </Text>
                  <Text style={styles.areaStatus}>{item.status}</Text>
                  {index === areaList.length - 1}
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  noAreasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAreasTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  noAreasLink: { color: '#0054AD', textDecorationLine: 'underline' },
  summaryContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryText: { fontSize: 16, fontWeight: 'bold' },
  statusText: { fontSize: 16, color: '#555' },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 1,
  },
  statusBar: (status) => ({
    width: 5,
    height: '100%',
    backgroundColor: status === 'Completed' ? 'green' : status === 'Ongoing' ? 'orange' : 'red',
    borderRadius: 2,
    marginRight: 10,
  }),
  areaContent: { flex: 1 },
  areaText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  areaStatus: { fontSize: 14, color: '#777' },
  areaLink: {
    marginTop: 5,
    fontSize: 14,
    color: '#0054AD',
    textDecorationLine: 'underline',
  },
});

export default DashboardScreen;
