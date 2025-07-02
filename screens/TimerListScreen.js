// screens/TimerListScreen.js
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function TimerListScreen({ navigation }) {
  const [timers, setTimers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadTimers = async () => {
        try {
          const stored = await AsyncStorage.getItem('timers');
          if (stored) {
            setTimers(JSON.parse(stored));
          }
        } catch (error) {
          console.error('Failed to load timers:', error);
        }
      };
      loadTimers();
    }, [])
  );

  const saveTimers = async (newTimers) => {
    setTimers(newTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
  };

  const addQuickTimer = () => {
    const updatedTimers = [
      ...timers,
      {
        id: Date.now().toString(),
        name: `Timer ${timers.length + 1}`,
        duration: 60,
        time: 0,
        running: false,
        intervalId: null,
        category: 'Quick',
      },
    ];
    saveTimers(updatedTimers);
  };

  const startTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && !timer.running) {
          const intervalId = setInterval(() => {
            setTimers((timersNow) => {
              const updated = timersNow.map((t) => {
                if (t.id === id) {
                  const nextTime = t.time + 1;
                  if (nextTime >= t.duration) {
                    clearInterval(t.intervalId);
                    setModalVisible(true);
                    setCompletedTimerName(t.name);
                    return { ...t, time: t.duration, running: false };
                  }
                  return { ...t, time: nextTime };
                }
                return t;
              });
              AsyncStorage.setItem('timers', JSON.stringify(updated));
              return updated;
            });
          }, 1000);
          return { ...timer, running: true, intervalId };
        }
        return timer;
      })
    );
  };

  const stopTimer = (id) => {
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id && timer.running) {
        clearInterval(timer.intervalId);
        return { ...timer, running: false, intervalId: null };
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const resetTimer = (id) => {
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id) {
        clearInterval(timer.intervalId);
        return { ...timer, time: 0, running: false, intervalId: null };
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const removeTimer = (id) => {
    const toRemove = timers.find((t) => t.id === id);
    if (toRemove?.intervalId) clearInterval(toRemove.intervalId);
    const updatedTimers = timers.filter((t) => t.id !== id);
    saveTimers(updatedTimers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Multi-Timer App</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTimer')}
      >
        <Text style={styles.addButtonText}>+ Add Timer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#bbb' }]}
        onPress={addQuickTimer}
      >
        <Text style={styles.addButtonText}>+ Quick Timer</Text>
      </TouchableOpacity>

      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timerContainer}>
            <Text style={styles.timerName}>{item.name || 'Unnamed Timer'}</Text>
            <Text style={styles.category}>{item.category || 'No Category'}</Text>
            <Text style={styles.time}>{formatTime(item.time)}</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(
                      (item.time / (item.duration || 60)) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.buttonRow}>
              {item.running ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => stopTimer(item.id)}
                >
                  <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => startTimer(item.id)}
                >
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => resetTimer(item.id)}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => removeTimer(item.id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 {completedTimerName} completed!</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    color: '#7e437f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#996196',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  timerName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 4,
  },
  time: {
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#7e437f',
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#7e437f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#996196',
    padding: 10,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
