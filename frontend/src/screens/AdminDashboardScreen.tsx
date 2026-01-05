import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, 
  Image, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { Colors } from '../constants/Colors';
import { Product } from '../types';

export default function AdminDashboardScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const res = await api.get('/api/products');
        setProducts(res.data);
    } catch (e) {
        console.log(e);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !image) {
        Alert.alert('Error', 'Name and Image are required');
        return;
    }

    setLoading(true);
    try {
        const token = await AsyncStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('nama', name);
        formData.append('deskripsi', desc);
        
        // Native Image Upload Format
        const fileName = image.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('gambar', {
            uri: image.uri,
            name: fileName,
            type: type,
        } as any);

        await api.post('/api/admin/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        Alert.alert('Success', 'Product Added');
        setName('');
        setDesc('');
        setImage(null);
        fetchProducts();
    } catch (error) {
        Alert.alert('Error', 'Failed to upload product');
        console.log(error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
        const token = await AsyncStorage.getItem('token');
        await api.delete(`/api/admin/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
    } catch (error) {
        Alert.alert('Error', 'Failed to delete');
    }
  };

  const handleLogout = async () => {
      await AsyncStorage.removeItem('token');
      navigation.replace('Tabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={desc} onChangeText={setDesc} />
        
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={{color: Colors.primary}}>{image ? 'Image Selected' : 'Pick Image'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Add Product</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Existing Products</Text>

      <FlatList 
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.item}>
                <Image source={{ uri: item.gambar_url }} style={styles.thumb} />
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.itemTitle}>{item.nama}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  form: { backgroundColor: Colors.card, padding: 15, borderRadius: 10, marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  imageBtn: { padding: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: Colors.primary, borderRadius: 5 },
  addBtn: { backgroundColor: Colors.primary, padding: 12, alignItems: 'center', borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  thumb: { width: 50, height: 50, borderRadius: 5 },
  itemTitle: { fontWeight: 'bold' },
});