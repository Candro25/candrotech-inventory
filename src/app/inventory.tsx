import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ScrollView, StyleSheet, View, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '../constants/theme';

type Producto = {
  id: string;
  categoria: string;
  nombre: string;
  modelo: string;
  precio: number;
  stock: number;
  codBarras: string;
};

export default function InventoryScreen() {
  const isDark = useColorScheme() === 'dark';
  const [productos, setProductos] = useState<Producto[]>([]);

  const cargarProductos = async () => {
    try {
      const datos = await AsyncStorage.getItem('STORAGE_KEY');
      if (datos !== null) {
        const parseados = JSON.parse(datos);
        
        if (Array.isArray(parseados)) {
          const productosValidos = parseados.filter((p) => p && p.id);
          setProductos(productosValidos);
        } else {
          setProductos([]);
        }
      }
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      setProductos([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [])
  );

  const eliminarProducto = (id: string, nombre: string) => {
    Alert.alert(
      "Eliminar Producto",
      `¿Estás seguro de que deseas eliminar ${nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              const nuevaLista = productos.filter((producto) => producto.id !== id);
              setProductos(nuevaLista);
              await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify(nuevaLista));
            } catch (error) {
              console.error('Error al eliminar el producto:', error);
            }
          }
        }
      ]
    );
  };

  const cardThemeStyle = {
    backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
    borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
    borderWidth: 1,
  };

  const textColorStyle = {
    color: isDark ? '#FFFFFF' : '#000000'
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Inventario
        </ThemedText>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {(!productos || productos.length === 0) ? (
            <ThemedText style={styles.emptyText}>
              No hay productos registrados aún.
            </ThemedText>
          ) : (
            productos.map((producto) => (
              <ThemedView key={producto.id} style={[styles.productCard, cardThemeStyle]}>
                <View style={styles.cardInfo}>
                  <ThemedText type="smallBold" style={[styles.cardCategory, textColorStyle]}>
                    {producto.categoria || 'Sin categoría'}: {producto.nombre || 'Sin nombre'} - {producto.modelo || 'Sin modelo'}
                  </ThemedText>
                  <ThemedText style={textColorStyle}>
                    {producto.codBarras || 'Sin código'} - (${producto.precio || 0})
                  </ThemedText>
                  <ThemedText style={{ color: producto.stock > 5 ? '#34C759' : '#FF3B30', fontWeight: 'bold' }}>
                    {producto.stock || 0} unidades disponibles
                  </ThemedText>
                </View>
                
                <View style={styles.deleteButtonContainer}>
                  <Button 
                    title="Borrar" 
                    color="#FF3B30" 
                    onPress={() => eliminarProducto(producto.id, producto.nombre || 'este producto')} 
                  />
                </View>
              </ThemedView>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    width: '100%',
  },
  cardInfo: {
    flex: 1,
    gap: Spacing.one,
    paddingRight: Spacing.three,
  },
  cardCategory: {
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
  },
});