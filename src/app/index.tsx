import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ScrollView, StyleSheet, TextInput, Modal, View, Alert, useColorScheme } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  // Estado para manejar los permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();

  const isDark = useColorScheme() === 'dark';

  // Estado para almacenar los productos y camara
  const [escaneando, setEscaneando] = useState(false);
  const [nuevoCodBarras, setnuevoCodBarras] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');

  // Función al detectar el código de barras
  const manejarLecturaCodigo = ({data}: {data: string}) => {
    setnuevoCodBarras(data); // Guardar el código de barras escaneado en el estado
    setEscaneando(false); // Cierra la cámara después de escanear
  };

  const abrirScanner = async () => {
    if (!permission?.granted) { // Si no se han concedido los permisos de la cámara, solicitar permisos
      const respuesta = await requestPermission(); // Solicitar permisos de la cámara
        if(!respuesta.granted) return; // Si se conceden los permisos, continuar con la apertura del escáner
    }
    setEscaneando(true); // Abrir la cámara para escanear el código de barras
  };

  // Función para agregar un nuevo producto
  const agregarProducto = async () => {
    // Validar que los campos no estén vacíos
    if (nuevaCategoria.trim() === '' || nuevoNombre.trim() === '' || nuevoModelo.trim() === '' || nuevoPrecio.trim() === '' || nuevoStock.trim() === '') {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      // Cargar productos actuales para no sobreescribir el inventario
      const datos = await AsyncStorage.getItem('STORAGE_KEY');
      const productosActuales = datos !== null ? JSON.parse(datos) : [];

      // crear un nuevo producto con los datos ingresados
      const productoCreado = {
        id: Date.now().toString(), // Generamos ID con fecha para evitar duplicados al borrar
        categoria: nuevaCategoria,
        codBarras: nuevoCodBarras || `1234567890123${productosActuales.length + 1}`, // Generar un código de barras único si no se proporciona uno
        nombre: nuevoNombre,
        modelo: nuevoModelo,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock),
      };

      // Agregar el nuevo producto al estado de productos guardados
      const nuevaLista = [...productosActuales, productoCreado];
      await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify(nuevaLista));

      Alert.alert('Éxito', 'Producto agregado al inventario.');

      // Limpiar formulario
      setNuevaCategoria('');
      setNuevoNombre('');
      setNuevoModelo('');
      setNuevoPrecio('');
      setNuevoStock('');
      setnuevoCodBarras('');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  // Estilos condicionales para Inputs dependientes del tema
  const inputThemeStyle = {
    backgroundColor: isDark ? '#1C1C1E' : '#f9f9f9',
    color: isDark ? '#FFFFFF' : '#010101',
    borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
    borderWidth: 1,
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title" style={styles.title}>
            CandroTech
          </ThemedText>

          <ThemedText type="title" style={styles.title}>
            Registrar Producto
          </ThemedText>
          <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          >
          <ThemedView style={styles.formContainer}>
              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Categoría"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevaCategoria}
                onChangeText={setNuevaCategoria}
              />
              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Nombre"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
              />
              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Modelo"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevoModelo}
                onChangeText={setNuevoModelo}
              />
              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Precio"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevoPrecio}
                onChangeText={setNuevoPrecio}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Stock"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevoStock}
                onChangeText={setNuevoStock}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, inputThemeStyle]}
                placeholder="Código de Barras"
                placeholderTextColor={isDark ? '#8E8E93' : '#C7C7CC'}
                value={nuevoCodBarras}
                onChangeText={setnuevoCodBarras}
              />
              <Button title="Agregar Producto" onPress={agregarProducto} />
              <View style={{ marginTop: 10 }}>
                <Button title="Escanear Código de Barras" onPress={abrirScanner} />
              </View>

                <Modal visible={escaneando} animationType="slide">
                  <View style={{flex: 1}}>
                    <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    onBarcodeScanned={manejarLecturaCodigo}
                    barcodeScannerSettings={{
                      barcodeTypes: ['ean13', 'ean8', 'code128', 'qr'],
                    }}
                    />
                    <View style={styles.closeScannerContainer}>
                      <Button title="Cerrar Escáner" onPress={() => setEscaneando(false)} />
                    </View>
                  </View>
                </Modal>
                
        </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContent: {
    gap: Spacing.four,
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: Spacing.four,
  },
  formContainer: {
    gap: Spacing.two,
    alignSelf: 'stretch',
    marginBottom: Spacing.three,
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    fontSize: 16,
  },
  closeScannerContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  }
});