import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';

const triggers = [
  {
    id: '1',
    name: 'A new commit is added',
    description: 'Triggered when a new commit is pushed to a repository.',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    id: '2',
    name: 'A new issue is opened',
    description: 'Triggered when a new issue is created in a repository.',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
];

const actions = [
  {
    id: '1',
    name: 'Push the new change',
    description: 'Automatically pushes the new change to the branch.',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    id: '2',
    name: 'Send notifications on app',
    description: 'Notifies all users about the event on the app.',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
];

const AREditorScreen = () => {
  const [state, setState] = useState(1); // 1: Initial, 2: Trigger/Actions, 3: Editing
  const [trigger, setTrigger] = useState(null); // Selected trigger
  const [actionsList, setActionsList] = useState([]); // List of selected actions
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState(''); // 'trigger' or 'action'

  const handleSelectTrigger = (selectedTrigger) => {
    setTrigger(selectedTrigger);
    setModalVisible(false);
    setState(2);
  };

  const handleSelectAction = (selectedAction) => {
    if (!actionsList.find((action) => action.id === selectedAction.id)) {
      setActionsList([...actionsList, selectedAction]);
    }
    setModalVisible(false);
  };

  const openSelectionModal = (type) => {
    setSelectionType(type);
    setModalVisible(true);
  };

  const handleSave = () => {
    console.log('AREA Saved:', {
      trigger: trigger?.name,
      actions: actionsList.map((a) => a.name),
    });

    // Reset to initial state
    setTrigger(null);
    setActionsList([]);
    setState(1);
    alert('AREA Saved! Returning to initial state.');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>AREA Editor</Text>

        {state === 1 && (
          <View>
            <TouchableOpacity
              style={styles.triggerCard}
              onPress={() => openSelectionModal('trigger')}
            >
              <Text style={styles.cardTitle}>Trigger</Text>
              <Text style={styles.cardDescription}>
                Thing that starts automation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => openSelectionModal('action')}
            >
              <Text style={styles.cardTitle}>Action</Text>
              <Text style={styles.cardDescription}>
                Thing that happens when trigger is true
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {state === 2 && trigger && (
          <View>
            {/* Trigger Display */}
            <View style={styles.selectedCard}>
              <Image source={{ uri: trigger.logo }} style={styles.cardLogo} />
              <Text style={styles.selectedText}>{trigger.name}</Text>
            </View>

            {/* Actions List */}
            {actionsList.map((action, index) => (
              <View key={index} style={styles.selectedCard}>
                <Image source={{ uri: action.logo }} style={styles.cardLogo} />
                <Text style={styles.selectedText}>{action.name}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openSelectionModal('action')}
            >
              <Text style={styles.addButtonText}>Add Action</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Select {selectionType === 'trigger' ? 'Trigger' : 'Action'}
          </Text>
          <FlatList
            data={selectionType === 'trigger' ? triggers : actions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  selectionType === 'trigger'
                    ? handleSelectTrigger(item)
                    : handleSelectAction(item)
                }
              >
                <Image source={{ uri: item.logo }} style={styles.modalLogo} />
                <View>
                  <Text style={styles.modalName}>{item.name}</Text>
                  <Text style={styles.modalDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  triggerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardDescription: { fontSize: 14, color: '#666' },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLogo: { width: 40, height: 40, marginRight: 10 },
  selectedText: { fontSize: 16, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#0054AD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#0054AD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalLogo: { width: 40, height: 40, marginRight: 10 },
  modalName: { fontSize: 16, fontWeight: 'bold' },
  modalDescription: { fontSize: 14, color: '#666' },
});

export default AREditorScreen;
