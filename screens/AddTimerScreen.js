import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTimerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const saveTimer = async () => {
    if (!name || !duration || !category) {
      Alert.alert('All fields are required');
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      category,
      time: 0,
      running: false,
      halfwayReached: false,
    };

    try {
      const stored = await AsyncStorage.getItem('timers');
      const timers = stored ? JSON.parse(stored) : [];
      timers.push(newTimer);
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
      navigation.goBack(); // go back to TimerList
    } catch (error) {
      console.error('Failed to save timer', error);
      Alert.alert('Error saving timer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Timer</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Workout Timer"
      />

      <Text style={styles.label}>Duration (in seconds)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 60"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. Study, Workout"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveTimer}>
        <Text style={styles.saveButtonText}>Save Timer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f1e8' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7e437f',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: { fontWeight: 'bold', marginTop: 12, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#996196',
    padding: 14,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
