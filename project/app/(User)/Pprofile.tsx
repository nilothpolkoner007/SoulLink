import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image as RNImage, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withRepeat, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as LocalAuthentication from 'expo-local-authentication';
import * as WebBrowser from 'expo-web-browser';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const easing = Easing.bezier(0.22, 0.9, 0.28, 1);

type Notification = { id: string; title: string; emoji: string; read: boolean };
type JournalEntry = { id: string; text: string; shared: boolean };

function HeartParticles() {
  const hearts = new Array(10).fill(0).map((_, i) => i);
  return (
    <View style={styles.particlesWrap} pointerEvents='none'>
      {hearts.map((i) => (
        <FloatingHeart key={i} delay={i * 400} />
      ))}
    </View>
  );
}

function FloatingHeart({ delay = 0 }: { delay?: number }) {
  const y = useSharedValue(0);
  const o = useSharedValue(0);
  useEffect(() => {
    setTimeout(() => {
      y.value = withRepeat(withTiming(-140, { duration: 6000, easing }), -1, false);
      o.value = withRepeat(withTiming(1, { duration: 1600, easing }), -1, true);
    }, delay);
  }, [delay, y, o]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: interpolate(o.value, [0, 1], [0.1, 0.6]),
  }));
  return (
    <Animated.View style={[styles.heartParticle, style]}>
      <ThemedText style={{ fontSize: 18 }}>💗</ThemedText>
    </Animated.View>
  );
}

export default function Profile() {
  const [bannerMode, setBannerMode] = useState<'photo' | 'quote'>('photo');
  const name = 'Ariana';
  const nickname = 'Angel';
  const birthday = '1999-08-14';
  const startDate = '2025-02-16';
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Your partner added a new memory.', emoji: '💕', read: false },
    { id: 'n2', title: 'Anniversary soon!', emoji: '🎉', read: false },
  ]);
  const [journalLocked, setJournalLocked] = useState(true);
  const [journal, setJournal] = useState<JournalEntry[]>([
    { id: 'j1', text: 'Tonight felt like a perfect song.', shared: false },
  ]);
  const counter = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 420, easing });
  }, [fadeIn]);

  useEffect(() => {
    counter.value = withRepeat(withTiming(1, { duration: 1200, easing }), -1, true);
  }, [counter]);

  const daysTogether = useMemo(() => {
    try {
      const s = new Date(startDate).getTime();
      const d = Math.floor((Date.now() - s) / (1000 * 60 * 60 * 24));
      return d > 0 ? d : 0;
    } catch {
      return 0;
    }
  }, [startDate]);

  const pageStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value, transform: [{ translateY: interpolate(fadeIn.value, [0, 1], [24, 0]) }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(counter.value, [0, 1], [1, 1.06]) }] }));

  const openSocial = async (type: 'instagram' | 'spotify' | 'x') => {
    if (type === 'instagram') await WebBrowser.openBrowserAsync('https://instagram.com/');
    if (type === 'spotify') await WebBrowser.openBrowserAsync('https://open.spotify.com/');
    if (type === 'x') await WebBrowser.openBrowserAsync('https://x.com/');
  };

  const unlockJournal = async () => {
    const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock Journal' });
    if (res.success) setJournalLocked(false);
  };

  const markRead = (id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <LinearGradient colors={["#ffd9e6", "#e0f0ff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <HeartParticles />

      <Animated.View style={[styles.banner, pageStyle]}>
        {bannerMode === 'photo' ? (
          <View style={styles.bannerPhotoWrap}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200' }} style={styles.bannerBg} blurRadius={12} />
            <RNImage source={{ uri: 'https://images.unsplash.com/photo-1520813792240-65ff522f3f60?w=600' }} style={styles.bannerCenter} />
          </View>
        ) : (
          <View style={styles.bannerQuoteWrap}>
            <ThemedText style={[styles.cursiveTitle, { fontFamily: Fonts.serif }]}>You are my forever.</ThemedText>
          </View>
        )}
        <TouchableOpacity style={styles.editBadge} onPress={() => setBannerMode(bannerMode === 'photo' ? 'quote' : 'photo')}>
          <ThemedText style={styles.editText}>Edit Banner</ThemedText>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.card, pageStyle]}>
        <View style={styles.rowBetween}>
          <View>
            <ThemedText style={[styles.cursiveTitle, { fontFamily: Fonts.serif }]}>{name}</ThemedText>
            <View style={styles.ribbon}><ThemedText style={styles.ribbonText}>{nickname}</ThemedText></View>
            <ThemedText style={styles.smallMuted}>Birthday {birthday}</ThemedText>
          </View>
          <View style={styles.birthdayWrap}>
            <TouchableOpacity style={styles.iconBtn}><ThemedText style={{ fontSize: 22 }}>🎂</ThemedText></TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.calendarCard}><ThemedText>Start {startDate}</ThemedText></View>
          <TouchableOpacity style={styles.timelineLink}><ThemedText style={styles.linkSmall}>Love Journey Timeline</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Animated.View style={[styles.counterBadge, pulseStyle]}>
            <ThemedText style={styles.counterText}>❤️ Together for {daysTogether} days</ThemedText>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, pageStyle]}>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={[styles.socialCard, styles.instagram]} onPress={() => openSocial('instagram')}>
            <ThemedText style={styles.socialText}>Instagram</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialCard, styles.spotify]} onPress={() => openSocial('spotify')}>
            <ThemedText style={styles.socialText}>Spotify</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialCard, styles.x]} onPress={() => openSocial('x')}>
            <ThemedText style={styles.socialText}>X</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, pageStyle]}>
        <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => markRead(item.id)} style={[styles.notifCard, item.read ? styles.notifRead : null]}>
              <ThemedText style={styles.notifEmoji}>{item.emoji}</ThemedText>
              <ThemedText style={styles.notifText}>{item.title}</ThemedText>
              {!item.read && <ThemedText style={styles.notifCheck}>✓</ThemedText>}
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      <Animated.View style={[styles.card, pageStyle]}>
        <View style={styles.rowBetween}>
          <ThemedText style={styles.sectionTitle}>Private Journal</ThemedText>
          {journalLocked ? (
            <TouchableOpacity onPress={unlockJournal} style={styles.lockBtn}><ThemedText style={styles.lockText}>🔐 Unlock</ThemedText></TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setJournalLocked(true)} style={styles.lockBtn}><ThemedText style={styles.lockText}>Lock</ThemedText></TouchableOpacity>
          )}
        </View>
        {journalLocked ? (
          <View style={styles.lockedArea}><ThemedText>Locked</ThemedText></View>
        ) : (
          <View>
            {journal.map((j) => (
              <View key={j.id} style={styles.journalItem}>
                <ThemedText style={styles.journalText}>{j.text}</ThemedText>
                <View style={styles.rowBetween}>
                  <TouchableOpacity onPress={() => setJournal((list) => list.map((e) => (e.id === j.id ? { ...e, shared: !e.shared } : e)))}>
                    <ThemedText style={styles.linkSmall}>{j.shared ? 'Shared 💞' : 'Share with Partner 💞'}</ThemedText>
                  </TouchableOpacity>
                  <View style={styles.rowCenter}>
                    {['❤️', '😭', '😳', '😡', '😘'].map((r) => (
                      <TouchableOpacity key={r} style={styles.reactBtn}><ThemedText>{r}</ThemedText></TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.rowCenter}>
              <TextInput placeholder='Write new entry…' style={styles.input} multiline />
              <TouchableOpacity style={styles.primary}><ThemedText style={styles.primaryText}>Add</ThemedText></TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  particlesWrap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  heartParticle: { position: 'absolute', left: Math.random() * 300 + 20, bottom: -20 },
  banner: { height: '35%', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', marginBottom: 16 },
  bannerPhotoWrap: { flex: 1 },
  bannerBg: { width: '100%', height: '100%' },
  bannerCenter: { width: 160, height: 160, borderRadius: 16, position: 'absolute', alignSelf: 'center', bottom: 18 },
  bannerQuoteWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  editBadge: { position: 'absolute', right: 16, bottom: 12, backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  editText: { color: '#11181C' },
  card: { marginHorizontal: 16, marginBottom: 14, padding: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.35)' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  cursiveTitle: { fontSize: 26 },
  ribbon: { alignSelf: 'flex-start', backgroundColor: '#ffb4d3', paddingHorizontal: 8, paddingVertical: 4, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 10, marginTop: 4 },
  ribbonText: { fontSize: 12, color: '#11181C' },
  smallMuted: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  birthdayWrap: { alignItems: 'center', justifyContent: 'center' },
  iconBtn: { backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 6 },
  calendarCard: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  timelineLink: { paddingHorizontal: 8, paddingVertical: 6 },
  linkSmall: { fontSize: 14, color: '#0a7ea4' },
  counterBadge: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 },
  counterText: { fontSize: 18 },
  socialCard: { flex: 1, marginHorizontal: 6, paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  socialText: { color: '#fff', fontSize: 16 },
  instagram: { backgroundColor: '#f58529' },
  spotify: { backgroundColor: '#1DB954' },
  x: { backgroundColor: '#14171A' },
  sectionTitle: { fontSize: 18, marginBottom: 8 },
  notifCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20, backgroundColor: '#fff' },
  notifText: { flex: 1, marginLeft: 10 },
  notifEmoji: { fontSize: 18 },
  notifCheck: { fontSize: 14, color: '#ff5fa7' },
  notifRead: { opacity: 0.5 },
  lockedArea: { paddingVertical: 20, alignItems: 'center' },
  journalItem: { backgroundColor: '#fffbea', borderRadius: 16, padding: 12, marginBottom: 10 },
  journalText: { fontSize: 16 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  reactBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  primary: { backgroundColor: '#0a7ea4', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  primaryText: { color: '#fff' },
});
