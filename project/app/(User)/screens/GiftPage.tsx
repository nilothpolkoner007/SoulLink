import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageSquare, Gift, Trophy, Clock, ShoppingBag } from 'lucide-react-native';

const virtualGifts = [
  { emoji: '🌹', label: 'Rose', points: 10 },
  { emoji: '💌', label: 'Love Letter', points: 15 },
  { emoji: '💍', label: 'Ring', points: 50 },
  { emoji: '🤗', label: 'Hug', points: 5 },
  { emoji: '😘', label: 'Kiss', points: 5 },
  { emoji: '🎁', label: 'Gift Box', points: 20 },
];

const realGifts = [
  { icon: ShoppingBag, label: 'Amazon', color: '#FF9900' },
  { icon: ShoppingBag, label: 'Flipkart', color: '#F0B400' },
  { icon: ShoppingBag, label: 'Swiggy', color: '#FC8019' },
];

const challenges = [
  {
    title: 'Compliment Challenge',
    description: 'Send 3 sweet compliments today',
    reward: '+30 points',
    icon: MessageSquare,
  },
  {
    title: 'Memory Quiz',
    description: 'Who said "I love you" first?',
    reward: '+50 points',
    icon: Trophy,
  },
];

export default function GiftPage() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#FF6B9D', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Gifts & Love</Text>
      </LinearGradient>

      <View style={styles.pointsCard}>
        <Heart size={32} color='#FF6B9D' fill='#FF6B9D' />
        <Text style={styles.pointsLabel}>Love Points</Text>
        <Text style={styles.pointsValue}>1,240</Text>
        <Text style={styles.pointsSubtext}>Keep loving to earn more</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Virtual Gifts</Text>
        <View style={[styles.grid, isLarge && styles.gridLarge]}>
          {virtualGifts.map((gift) => (
            <TouchableOpacity key={gift.label} style={styles.giftItem} activeOpacity={0.8}>
              <Text style={styles.giftEmoji}>{gift.emoji}</Text>
              <Text style={styles.giftLabel}>{gift.label}</Text>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsBadgeText}>{gift.points} pts</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Real Gifts</Text>
        <View style={styles.realGiftsContainer}>
          {realGifts.map((gift) => (
            <TouchableOpacity key={gift.label} style={styles.realGiftCard} activeOpacity={0.9}>
              <LinearGradient
                colors={[gift.color, gift.color + 'CC']}
                style={styles.realGiftGradient}
              >
                <gift.icon size={32} color='#fff' />
                <Text style={styles.realGiftLabel}>{gift.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Love Challenges</Text>
        {challenges.map((challenge) => (
          <TouchableOpacity key={challenge.title} style={styles.challengeCard} activeOpacity={0.9}>
            <View style={styles.challengeIcon}>
              <challenge.icon size={24} color='#FF6B9D' />
            </View>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDesc}>{challenge.description}</Text>
            </View>
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>{challenge.reward}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Future Message</Text>
        <TouchableOpacity style={styles.futureBtn} activeOpacity={0.9}>
          <LinearGradient
            colors={['#FF6B9D', '#FF8FB3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.futureBtnGradient}
          >
            <Clock size={24} color='#fff' />
            <Text style={styles.futureBtnText}>Schedule a Surprise Message</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  pointsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF6B9D',
    marginTop: 4,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1F2937',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridLarge: {
    justifyContent: 'flex-start',
  },
  giftItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  giftEmoji: {
    fontSize: 36,
  },
  giftLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  pointsBadge: {
    marginTop: 6,
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  realGiftsContainer: {
    gap: 12,
  },
  realGiftCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  realGiftGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  realGiftLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeContent: {
    flex: 1,
    marginLeft: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  rewardBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  futureBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  futureBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  futureBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
