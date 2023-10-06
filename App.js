import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Define un arreglo con todas las comidas
  const comidas = [
    '- Café\n- Sandwich mixto', '- Puchero', '- Cereales', '- Ensalada de la casa', 
    '- Café\n- Sandwich mixto', '- Fajitas', '- Cereales','- Ensalada césar', 
    '- Café\n- Sandwich mixto', '- Ensalada de pasta', '- Cereales', '- Macedonia', 
    '- Café\n- Sandwich mixto', '- Wrap texas','- Cereales', '- 2 paletas de verdura asada\n- 2 filetes magro adobado', 
    '- Café\n- Sandwich mixto', '- Arroz 3 delicias', '- Cereales', '- Macedonia', 
    '- Café\n- Sandwich mixto','- Salteado de pollo frango con verduras', '- Cereales', '- LIBRE', 
    '- Café\n- Sandwich mixto', '- Patata asada rellena', '- Cereales', '- Macedonia',
  ];

  // Define un arreglo con todas las alternativas
  const alternativas = [
    '- Café\n- 2 Tostadas con aceite', '- Lentejas', '- Pipas', '- Pizza vegetal', 
    '- Café\n- 2 Tostadas con aceite', '- Quesadillas de pollo y verdura', '- Pipas','', 
    '- Café\n- 2 Tostadas con aceite', '- Pasta boloñesa', '- Pipas', '- Calamares a la plancha', 
    '- Café\n- 2 Tostadas con aceite', '- Ensalada mixta','- Pipas', '- Pollo con calabacín', 
    '- Café\n- 2 Tostadas con aceite', '- Arroz a la cubana', '- Pipas', '- Calamares a la plancha', 
    '- Café\n- 2 Tostadas con aceite', '- 12 Alitas de pollo\n- 2 paletas de verdura asada', '- Pipas', '', 
    '- Café\n- 2 Tostadas con aceite', '- Ensalada de patatas cocidas', '- Pipas', '- Calamares a la plancha',
  ];

  // Inicializa el estado de selección con un arreglo de falsos para cada caja
  const initialState = Array(28).fill(false);
  const [seleccionadas, setSeleccionadas] = useState(initialState);

  // Inicializa el estado de modo con "comida" para cada caja
  const initialModo = Array(28).fill("comida");
  const [modos, setModos] = useState(initialModo);

  // Cargar el estado guardado al inicio de la aplicación
  useEffect(() => {
    cargarEstado().then((estadoGuardado) => {
      if (estadoGuardado) {
        setSeleccionadas(estadoGuardado.seleccionadas || initialState);
        setModos(estadoGuardado.modos || initialModo);
      }
    });
  }, []);

  // Función para manejar la selección de cajas y cambiar el color
  const handleToggleSeleccion = (index) => {
    const nuevaSeleccion = [...seleccionadas];
    nuevaSeleccion[index] = !nuevaSeleccion[index];
    setSeleccionadas(nuevaSeleccion);
    guardarEstado({ seleccionadas: nuevaSeleccion, modos });
  };

  // Función para manejar la pulsación larga y cambiar el modo (comida/alternativa)
  const handleToggleModo = (index) => {
    const nuevosModos = [...modos];
    nuevosModos[index] = modos[index] === "comida" ? "alternativa" : "comida";
    setModos(nuevosModos);
    guardarEstado({ seleccionadas, modos: nuevosModos });
  };

  // Guardar el estado en AsyncStorage
  const guardarEstado = async (estado) => {
    try {
      await AsyncStorage.setItem('estadoComidas', JSON.stringify(estado));
    } catch (error) {
      console.error('Error al guardar el estado: ', error);
    }
  };

  // Cargar el estado desde AsyncStorage
  const cargarEstado = async () => {
    try {
      const estadoGuardado = await AsyncStorage.getItem('estadoComidas');
      return estadoGuardado ? JSON.parse(estadoGuardado) : null;
    } catch (error) {
      console.error('Error al cargar el estado: ', error);
      return null;
    }
  };

  // Genera las cajas con sus comidas y alternativas
  const renderCajas = () => {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    return (
      <ScrollView horizontal>
        <View style={styles.container}>
          {dias.map((dia, diaIndex) => (
            <View key={diaIndex}>
              <Text style={styles.diaText}>{dia}</Text>
              {comidas.slice(diaIndex * 4, diaIndex * 4 + 4).map((comida, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.comidaContainer, seleccionadas[diaIndex * 4 + index] ? styles.verde : null]}
                  onPress={() => {
                    handleToggleSeleccion(diaIndex * 4 + index);
                  }}
                  onLongPress={() => {
                    handleToggleModo(diaIndex * 4 + index);
                  }}
                >
                  <Text style={styles.comidaText}>
                    {modos[diaIndex * 4 + index] === "comida" ? comida : alternativas[diaIndex * 4 + index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView>
      {renderCajas()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  diaText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  comidaContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: 140,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  verde: {
    backgroundColor: 'lightgreen',
  },
  comidaText: {
    textAlign: 'center',
  },
});
