import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { en, fa } from '../utils/translations';

export default function AddCarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addCar = useStore((state) => state.addCar);
  
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';

  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSave = () => {
    if (!name || !make || !model || !year || !mileage) return;

    addCar({
      name,
      make,
      model,
      year: parseInt(year, 10),
      currentMileage: parseInt(mileage, 10),
    });

    router.back();
  };

  const hasErrors = () => {
    return !name || !make || !model || !year || !mileage;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 20 + insets.bottom }]}>
      <Card style={styles.card}>
        <Card.Title title={t.add_new_car} titleStyle={{ textAlign: isRTL ? 'right' : 'left' }} />
        <Card.Content>
            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.nickname}</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.make}</Text>
                <TextInput
                    value={make}
                    onChangeText={setMake}
                    mode="outlined"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.model}</Text>
                <TextInput
                    value={model}
                    onChangeText={setModel}
                    mode="outlined"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.year}</Text>
                <TextInput
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.current_mileage}</Text>
                <TextInput
                    value={mileage}
                    onChangeText={setMileage}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        onPress={handleSave} 
        style={styles.button}
        disabled={hasErrors()}
      >
        {t.save_car}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 12,
  },
  card: {
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: '#fff',
      elevation: 2,
  },
  button: {
    marginTop: 12,
  },
});
