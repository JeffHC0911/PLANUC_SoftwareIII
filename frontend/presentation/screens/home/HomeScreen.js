import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedules Calendar</Text>
      <Calendar
        markedDates={{
          '2024-11-16': { marked: true, dotColor: 'blue' },
          '2024-11-17': { marked: true, dotColor: 'red' },
        }}
        onDayPress={(day) => {
          console.log('Selected day', day);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
