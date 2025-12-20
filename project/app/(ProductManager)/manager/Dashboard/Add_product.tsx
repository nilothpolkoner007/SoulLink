import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const MAX_IMAGES = 4;

interface FormState {
  name: string;
  sku: string;
  price: string;
  category: string;
  stock: string;
  description: string;
}

interface ImageItem {
  uri: string;
  fileName?: string;
  type?: string;
}

const AddProduct: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    sku: '',
    price: '',
    category: '',
    stock: '',
    description: '',
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const onChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const err: Partial<FormState> = {};
    if (!form.name.trim()) err.name = 'Product name required';
    if (!form.price || Number(form.price) <= 0) err.price = 'Valid price required';
    if (!form.stock || Number(form.stock) < 0) err.stock = 'Stock must be 0 or more';
    return err;
  };

  const pickImages = () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      Alert.alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remaining,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Unknown error');
          return;
        }
        const selected: ImageItem[] =
          response.assets?.map((asset) => ({
            uri: asset.uri || '',
            fileName: asset.fileName,
            type: asset.type,
          })) || [];
        setImages((prev) => [...prev, ...selected]);
      },
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      // Upload images first
      const imageUrls: string[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append('file', {
          uri: img.uri,
          type: img.type,
          name: img.fileName,
        } as any);
        const uploadRes = await axios.post('http://192.168.31.91:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls.push(uploadRes.data.imageUrl);
      }

      // Create product
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: imageUrls,
      };
      await axios.post('http://192.168.31.91:5000/api/products', productData);

      Alert.alert('Success', 'Product added successfully');

      // reset
      setForm({ name: '', sku: '', price: '', category: '', stock: '', description: '' });
      setImages([]);
      setErrors({});
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <Text style={styles.subtitle}>
        Create new product — add images, price, stock, and description.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(val) => onChange('name', val)}
          placeholder='e.g. Organic Turmeric Powder'
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <Text style={styles.label}>SKU</Text>
        <TextInput
          style={styles.input}
          value={form.sku}
          onChangeText={(val) => onChange('sku', val)}
          placeholder='Optional SKU'
        />

        <Text style={styles.label}>Price (₹) *</Text>
        <TextInput
          style={styles.input}
          value={form.price}
          onChangeText={(val) => onChange('price', val)}
          placeholder='e.g. 249.00'
          keyboardType='numeric'
        />
        {errors.price && <Text style={styles.error}>{errors.price}</Text>}

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={form.category}
          onChangeText={(val) => onChange('category', val)}
          placeholder='e.g. Grocery'
        />

        <Text style={styles.label}>Stock Quantity *</Text>
        <TextInput
          style={styles.input}
          value={form.stock}
          onChangeText={(val) => onChange('stock', val)}
          placeholder='0'
          keyboardType='numeric'
        />
        {errors.stock && <Text style={styles.error}>{errors.stock}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={form.description}
          onChangeText={(val) => onChange('description', val)}
          placeholder='Short product description...'
          multiline
        />

        <Text style={styles.label}>Images (max {MAX_IMAGES})</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
          <Text style={{ fontSize: 24 }}>🖼️</Text>
          <Text style={styles.imagePickerText}>Tap to select images</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewContainer}
        >
          {images.map((img, idx) => (
            <View key={img.uri} style={styles.previewItem}>
              <Image source={{ uri: img.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(idx)}>
                <Text style={{ color: '#fff' }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelBtn]}
            onPress={() => {
              setForm({ name: '', sku: '', price: '', category: '', stock: '', description: '' });
              setImages([]);
              setErrors({});
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.submitBtn]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4, color: '#111827' },
  subtitle: { fontSize: 14, marginBottom: 16, color: '#6B7280' },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  error: { color: '#EF4444', marginBottom: 8, fontSize: 12 },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: 'center',
  },
  imagePickerText: { marginLeft: 8, fontSize: 14, color: '#6B7280' },
  previewContainer: { flexDirection: 'row', marginBottom: 12 },
  previewItem: { position: 'relative', marginRight: 8 },
  previewImage: { width: 80, height: 80, borderRadius: 6 },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center', marginHorizontal: 4 },
  cancelBtn: { backgroundColor: '#E5E7EB' },
  submitBtn: { backgroundColor: '#3B82F6' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
