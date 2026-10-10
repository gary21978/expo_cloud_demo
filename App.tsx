import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Booking, cancelBooking, changeNights, createBooking, HOTEL, totalPrice } from './src/booking';

type ActionProps = { label: string; id: string; onPress: () => void; disabled?: boolean; secondary?: boolean };
function Action({ label, id, onPress, disabled = false, secondary = false }: ActionProps) {
  return (
    <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary,
        disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}
export default function App() {
  const [page, setPage] = useState<'home' | 'details' | 'order'>('home');
  const [nights, setNights] = useState(1);
  const [booking, setBooking] = useState<Booking | null>(null);
  function reset() { setBooking(null); setNights(1); setPage('home'); }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>GO</Text>
            <Text style={styles.badge}>CLOUD DEMO</Text>
          </View>
          <Text style={styles.platform}>React Native / Expo · {Platform.OS.toUpperCase()}</Text>
          <Text style={styles.title}>Your next stay</Text>
          <Text style={styles.subtitle}>A small trip, from discovery to booking.</Text>
          <View style={styles.notice}>
            <Text style={styles.noticeText}>Demo only · No real payment or reservation</Text>
          </View>
          {page === 'home' && (
            <View style={styles.card}>
              <Text style={styles.eyebrow}>SHANGHAI · CITY ESCAPE</Text>
              <Text testID="hotel-name" style={styles.cardTitle}>{HOTEL.name}</Text>
              <Text style={styles.description}>A calm base for your next city break.</Text>
              <Text style={styles.price}>CNY {HOTEL.price} <Text style={styles.unit}>/ night</Text></Text>
              <Action id="view-hotel" label="View hotel" onPress={() => setPage('details')} />
            </View>
          )}
          {page === 'details' && (
            <View style={styles.card}>
              <Text style={styles.eyebrow}>ROOM DETAILS</Text>
              <Text style={styles.cardTitle}>{HOTEL.name}</Text>
              <Text style={styles.description}>Standard room · 1 guest · Free demo cancellation</Text>
              <View style={styles.nights}>
                <Text testID="night-count" style={styles.label}>Nights: {nights}</Text>
                <View style={styles.controls}>
                  <Action id="minus-night" label="Minus night" disabled={nights === 1}
                    secondary onPress={() => setNights((n) => changeNights(n, -1))} />
                  <Action id="plus-night" label="Plus night" disabled={nights === 7}
                    secondary onPress={() => setNights((n) => changeNights(n, 1))} />
                </View>
              </View>
              <Text testID="booking-total" style={styles.price}>Total: CNY {totalPrice(nights)}</Text>
              <Action id="book-stay" label="Book demo stay" onPress={() => {
                setBooking(createBooking(nights)); setPage('order');
              }} />
              <Action id="back-home" label="Back to hotels" secondary onPress={() => setPage('home')} />
            </View>
          )}
          {page === 'order' && booking && (
            <View style={styles.card}>
              <Text style={styles.eyebrow}>YOUR DEMO ORDER</Text>
              <Text testID="order-status" style={styles.cardTitle}>
                {booking.status === 'confirmed' ? 'Booking confirmed' : 'Booking cancelled'}
              </Text>
              <Text style={styles.description}>{HOTEL.name}</Text>
              <Text testID="order-id" style={styles.label}>Order: {booking.id}</Text>
              <Text testID="order-nights" style={styles.label}>Nights: {booking.nights}</Text>
              <Text testID="order-total" style={styles.price}>Total: CNY {booking.total}</Text>
              {booking.status === 'confirmed' ? (
                <Action id="cancel-booking" label="Cancel demo booking" secondary
                  onPress={() => setBooking((b) => b ? cancelBooking(b) : b)} />
              ) : <Text testID="refund-status" style={styles.refund}>Demo refund complete</Text>}
              <Action id="start-again" label="Start again" onPress={reset} />
            </View>
          )}
          <Text style={styles.footer}>Guest demo · Data resets when the app restarts.</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f6f4' },
  content: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 560, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  logo: { fontSize: 36, fontWeight: '900', color: '#153e35', letterSpacing: -2 },
  badge: { color: '#315e51', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  platform: { fontSize: 12, color: '#597067', marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '700', color: '#153e35' },
  subtitle: { fontSize: 15, lineHeight: 23, color: '#597067', marginTop: 8 },
  notice: { backgroundColor: '#e4eee8', borderRadius: 12, padding: 12, marginVertical: 20 },
  noticeText: { fontSize: 12, lineHeight: 18, color: '#315e51' },
  card: { borderRadius: 24, padding: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dce5df' },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#597067', marginBottom: 12 },
  cardTitle: { fontSize: 25, fontWeight: '700', color: '#153e35', marginBottom: 10 },
  description: { color: '#597067', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  price: { color: '#153e35', fontWeight: '700', fontSize: 25, marginVertical: 16 },
  unit: { fontSize: 14, fontWeight: '400', color: '#597067' },
  label: { fontSize: 16, color: '#153e35', marginVertical: 6 },
  nights: { borderTopWidth: 1, borderColor: '#e9eeeb', paddingTop: 12 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  button: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#153e35',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  secondary: { backgroundColor: '#edf3ef' },
  secondaryText: { color: '#153e35' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.75 },
  refund: { color: '#247252', fontSize: 15, marginVertical: 16, fontWeight: '600' },
  footer: { textAlign: 'center', color: '#597067', fontSize: 12, lineHeight: 18, marginTop: 24 },
});
