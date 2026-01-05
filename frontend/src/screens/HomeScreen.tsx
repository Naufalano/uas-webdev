import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  ActivityIndicator, Dimensions, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProducts } from '../services/api';
import { Product } from '../types';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 320;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image 
          source={{ uri: item.gambar_url }} 
          style={styles.cardImage} 
          resizeMode="cover" 
        />
        <View style={styles.textOverlay}>
          <Text style={styles.productTitle}>{item.nama}</Text>
          <Text style={styles.productDesc} numberOfLines={2}>
            {item.deskripsi}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
            onLongPress={() => {
                navigation.navigate('AdminLogin'); 
            }}
            delayLongPress={2000}
        >
            <Text style={styles.headerTitle}>Surya Prima Jaya</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Variasi Kayu Berkualitas</Text>
          <Text style={styles.heroSubtitle}>
            Dengan kayu pilihan terbaik, anda tidak perlu khawatir kayu pesanan anda dimakan usia.
          </Text>
        </View>

        <View>
          {loading ? (
             <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 50 }} />
          ) : products.length === 0 ? (
             <Text style={{ textAlign: 'center', margin: 20 }}>Tidak ada produk.</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProductItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        
        <View style={styles.featuresContainer}>
          <FeatureItem icon="🌳" title="Bahan Baku Berkelanjutan" desc="Hutan yang dikelola" />
          <FeatureItem icon="✨" title="Penanganan Andal" desc="Profesionalitas terjamin" />
          <FeatureItem icon="♾️" title="Tahan Lama" desc="Anti termakan usia" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, title, desc }: any) => (
  <View style={styles.featureRow}>
    <View style={styles.iconCircle}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
    <View style={{ marginLeft: 15, flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, alignItems: 'center', backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
  heroSection: { padding: 24, alignItems: 'center' },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 10 },
  heroSubtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center' },
  
  listContent: { paddingVertical: 10 },
  cardContainer: { width: width, alignItems: 'center', paddingHorizontal: 20 },
  card: { 
    width: '100%', height: CARD_HEIGHT, borderRadius: 16, overflow: 'hidden', 
    backgroundColor: Colors.white, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 
  },
  cardImage: { width: '100%', height: '100%' },
  textOverlay: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 20, backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  productTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  productDesc: { color: '#ddd', fontSize: 14, marginTop: 4 },

  featuresContainer: { padding: 20, backgroundColor: Colors.card, marginTop: 20, marginHorizontal: 20, borderRadius: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#efebe9', alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  featureDesc: { fontSize: 14, color: Colors.muted },
});