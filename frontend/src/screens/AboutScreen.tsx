import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>CV Surya Prima Jaya</Text>
        
        <Text style={styles.paragraph}>
          Di Surya Prima Jaya, anda dapat memesan veneer kayu dengan kualitas terbaik. 
          Dengan variasi kayu lokal anda dapat memilih kayu yang sesuai untuk pemakaian anda.
        </Text>

        <Text style={styles.paragraph}>
          Tunggu apa lagi? Lihat katalog produk kami, pilih produk kami, kontak narahubung kami!
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alamat Kami</Text>
          <Text style={styles.cardText}>Kampung Babakan RT 03/04, Binong, Curug, Tangerang 15810</Text>
          <Text style={styles.cardText}>Dekat Masjid Al-Hidayah</Text>
        </View>

        <Text style={styles.contactInfo}>
          Untuk informasi lebih lanjut hubungi +62 896 5434 3198 (Yoga Wibowo)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
  paragraph: { fontSize: 16, color: Colors.text, lineHeight: 24, marginBottom: 16 },
  card: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 8,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  cardText: { fontSize: 16, color: Colors.text, marginBottom: 8 },
  contactInfo: { fontSize: 16, color: Colors.text, fontStyle: 'italic', marginTop: 10 },
});