import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Image,
} from 'react-native';

// ✅ Timer type
type Timer = {
  id: number;
  name: string;
  time: number;
  duration: number;
  running: boolean;
  halfwayReached: boolean;
};

// ✅ Global intervals
const runningTimers: { [id: number]: ReturnType<typeof setInterval> } = {};

export default function MultiTimerScreen() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const [history, setHistory] = useState<
    { name: string; completedAt: string }[]
  >([]);

  // Add timer
  const addTimer = () => {
    const name = `Timer ${timers.length + 1}`;
    const duration = 10; // Change if you want longer timers
    setTimers([
      ...timers,
      {
        id: Date.now(),
        name,
        time: 0,
        duration,
        running: false,
        halfwayReached: false,
      },
    ]);
  };

  // Toggle start/pause
  const toggleTimer = (id: number) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === id) {
          if (timer.running) {
            if (runningTimers[id]) {
              clearInterval(runningTimers[id]);
              delete runningTimers[id];
            }
            return { ...timer, running: false };
          } else {
            const interval = setInterval(() => {
              setTimers((current) =>
                current.map((t) => {
                  if (t.id === id) {
                    const newTime = t.time + 1;

                    // Halfway alert
                    if (
                      !t.halfwayReached &&
                      newTime >= t.duration / 2
                    ) {
                      Alert.alert(
                        'Halfway!',
                        `${t.name} is halfway done.`
                      );
                      return { ...t, time: newTime, halfwayReached: true };
                    }

                    // Completion
                    if (newTime >= t.duration) {
                      clearInterval(interval);
                      setModalVisible(true);
                      setCompletedTimerName(t.name);
                      setHistory((h) => [
                        ...h,
                        {
                          name: t.name,
                          completedAt: new Date().toLocaleTimeString(),
                        },
                      ]);
                      return { ...t, time: t.duration, running: false };
                    }

                    return { ...t, time: newTime };
                  }
                  return t;
                })
              );
            }, 1000);
            runningTimers[id] = interval;
            return { ...timer, running: true };
          }
        }
        return timer;
      })
    );
  };

  // Reset timer
  const resetTimer = (id: number) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, time: 0, halfwayReached: false }
          : t
      )
    );
  };

  // Remove timer
  const removeTimer = (id: number) => {
    if (runningTimers[id]) {
      clearInterval(runningTimers[id]);
      delete runningTimers[id];
    }
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/clock.png')}
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Multi Timer App</Text>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={addTimer}>
        <Text style={styles.addButtonText}>+ Add Timer</Text>
      </TouchableOpacity>

      {/* Timer List */}
      <ScrollView>
        {timers.map((timer) => (
          <View key={timer.id} style={styles.timer}>
            <Text style={styles.time}>
              {timer.name}: {timer.time}s
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => toggleTimer(timer.id)}
            >
              <Text>{timer.running ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => resetTimer(timer.id)}
            >
              <Text>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => removeTimer(timer.id)}
            >
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
            <Text>{completedTimerName} completed.</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        {history.map((h, index) => (
          <View key={index} style={styles.historyItem}>
            <Text>{h.name}</Text>
            <Text>{h.completedAt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f1e8',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#996196',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  timer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  time: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    padding: 5,
    marginTop: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#996196',
    padding: 8,
    borderRadius: 5,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
});
