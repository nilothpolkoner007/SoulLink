import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

// -------------------- EMOTION CONSTANTS --------------------
const EMOTIONS = {
  love: { color: '#FF5C8D', emoji: '😍' },
  happy: { color: '#FFD93D', emoji: '😊' },
  neutral: { color: '#BDBDBD', emoji: '😐' },
  sad: { color: '#5DA9E9', emoji: '😢' },
  stress: { color: '#FF4C4C', emoji: '😡' },
};

type EmotionType = keyof typeof EMOTIONS;

// -------------------- MOCK DATA --------------------
const generateMockMonth = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    dominantEmotion: Object.keys(EMOTIONS)[i % 5] as EmotionType,
    intensity: Math.random() * 0.5 + 0.5,
  }));
};

const generateMockDay = (date: string) => ({
  date,
  hourly: [
    { time: '09:00', emotion: 'happy' as EmotionType, duration: 60 },
    { time: '12:00', emotion: 'love' as EmotionType, duration: 120 },
    { time: '18:00', emotion: 'stress' as EmotionType, duration: 30 },
  ],
  aiSummary:
    'Today showed strong emotional bonding with short stress moments. Overall balance is healthy.',
  note: 'Felt close after our evening call ❤️',
});

// -------------------- RESPONSIVENESS --------------------
const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// -------------------- MAIN COMPONENT --------------------
export default function RelationshipCalendarScreen() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {!selectedDay ? (
        <MonthView onSelectDay={setSelectedDay} />
      ) : (
        <DayAnalyticsView date={selectedDay} onBack={() => setSelectedDay(null)} />
      )}
    </View>
  );
}

// -------------------- MONTH VIEW --------------------
function MonthView({ onSelectDay }: { onSelectDay: (d: string) => void }) {
  const days = generateMockMonth();

  return (
    <View>
      <Text style={styles.title}>Relationship Calendar</Text>

      <FlatList
        data={days}
        numColumns={7}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => {
          const emotion = EMOTIONS[item.dominantEmotion];
          return (
            <TouchableOpacity
              style={[
                styles.dayCell,
                {
                  backgroundColor: emotion.color,
                  opacity: item.intensity,
                },
              ]}
              onPress={() => onSelectDay(item.date)}
            >
              <Text style={styles.dayText}>{item.date.split('-')[2]}</Text>
              <Text>{emotion.emoji}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// -------------------- DAY ANALYTICS VIEW --------------------
function DayAnalyticsView({ date, onBack }: { date: string; onBack: () => void }) {
  const data = generateMockDay(date);

  return (
    <ScrollView style={styles.dayContainer}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>← Back to Month</Text>
      </TouchableOpacity>

      <Text style={styles.dayTitle}>Emotions on {date}</Text>

      {/* Hourly Timeline */}
      <Text style={styles.section}>Hourly Emotion Timeline</Text>
      {data.hourly.map((h, i) => (
        <View key={i} style={styles.timelineRow}>
          <Text>{h.time}</Text>
          <Text>{EMOTIONS[h.emotion].emoji}</Text>
          <Text>{h.duration} min</Text>
        </View>
      ))}

      {/* Emotional Timer */}
      <Text style={styles.section}>Emotional Timer</Text>
      {Object.keys(EMOTIONS).map((e) => (
        <Text key={e}>
          {EMOTIONS[e as EmotionType].emoji} {e.toUpperCase()}
        </Text>
      ))}

      {/* Love vs Stress */}
      <Text style={styles.section}>Love vs Stress</Text>
      <View style={styles.meter}>
        <View style={[styles.loveBar, { flex: 7 }]} />
        <View style={[styles.stressBar, { flex: 3 }]} />
      </View>

      {/* AI Summary */}
      <Text style={styles.section}>AI Insight</Text>
      <Text style={styles.aiText}>{data.aiSummary}</Text>

      {/* Daily Note */}
      <Text style={styles.section}>Daily Note</Text>
      <Text style={styles.note}>{data.note || 'No note added.'}</Text>
    </ScrollView>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 32 : 16,
    backgroundColor: '#FFF5F8',
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  dayCell: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    height: isTablet ? 80 : 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontWeight: '600',
    color: '#fff',
  },
  dayContainer: {
    padding: 16,
  },
  back: {
    color: '#FF5C8D',
    marginBottom: 12,
    fontSize: 16,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  meter: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  loveBar: {
    backgroundColor: '#FF5C8D',
  },
  stressBar: {
    backgroundColor: '#FF4C4C',
  },
  aiText: {
    fontStyle: 'italic',
    marginTop: 6,
  },
  note: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
});
