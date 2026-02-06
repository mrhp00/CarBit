import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Chip, Text, Switch, Card } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../../store/useStore';
import { en, fa } from '../../../utils/translations';

export default function EditServiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';
  
  const services = useStore((state) => state.services);
  const updateService = useStore((state) => state.updateService);
  
  const service = services.find((s) => s.id === id);

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [center, setCenter] = useState('');
  const [brand, setBrand] = useState('');
  
  const [hasReminder, setHasReminder] = useState(false);
  const [nextMileage, setNextMileage] = useState('');

  const [date, setDate] = useState('');

  useEffect(() => {
    if (service) {
        setTitle(service.title);
        setCost(service.cost.toString());
        setMileage(service.mileageAtService.toString());
        setNotes(service.notes || '');
        setCenter(service.serviceCenter || '');
        setBrand(service.productBrand || '');
        setDate(service.date);
        
        if (service.nextServiceMileage) {
            setHasReminder(true);
            setNextMileage(service.nextServiceMileage.toString());
        }
    }
  }, [service]);

  // Common service types keys
  const commonTypes = ["oil_change", "tire_rotation", "brake_pads", "inspection", "battery"] as const;

  const handleSave = () => {
    if (!title || !cost || !mileage || !date) {
      Alert.alert(t.error, t.fill_required);
      return;
    }

    if (typeof id !== 'string') return;

    const costNum = parseFloat(cost);
    const mileageNum = parseInt(mileage, 10);
    const nextMileageNum = hasReminder && nextMileage ? parseInt(nextMileage, 10) : undefined;

    updateService(id, {
      title,
      cost: costNum,
      mileageAtService: mileageNum,
      date,
      notes,
      serviceCenter: center,
      productBrand: brand,
      nextServiceMileage: nextMileageNum
    });

    router.back();
  };

  const setNextInterval = (interval: number) => {
    const current = parseInt(mileage || '0', 10);
    setNextMileage((current + interval).toString());
  };

  if (!service) {
      return (
          <View style={styles.center}>
              <Text>{t.error}</Text>
          </View>
      )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 50 + insets.bottom }]}>
       <Text variant="titleMedium" style={{marginBottom: 10, textAlign: isRTL ? 'right' : 'left'}}>{t.service_details}</Text>
       
       <Card style={styles.card}>
        <Card.Content>
            <View style={[styles.chips, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {commonTypes.map(k => {
                    const label = t[k];
                    return (
                    <Chip 
                        key={k} 
                        selected={title === label} 
                        onPress={() => setTitle(label)}
                        style={styles.chip}
                        mode="outlined"
                    >
                        {label}
                    </Chip>
                    );
                })}
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.service_title}</Text>
                <TextInput 
                    value={title} 
                    onChangeText={setTitle} 
                    mode="outlined" 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{`${t.cost} (${isRTL ? 'تومان' : '$'})`}</Text>
                <TextInput 
                    value={cost} 
                    onChangeText={setCost} 
                    keyboardType="numeric" 
                    mode="outlined" 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.date}</Text>
                <TextInput 
                    value={date} 
                    onChangeText={setDate} 
                    mode="outlined" 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.mileage_at_service}</Text>
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

       <Text variant="titleMedium" style={{marginTop: 20, marginBottom: 10, textAlign: isRTL ? 'right' : 'left', fontWeight: 'bold', color: '#333'}}>{t.optional_info}</Text>
       
       <Card style={styles.card}>
        <Card.Content>
            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.service_center}</Text>
                <TextInput 
                    value={center} 
                    onChangeText={setCenter} 
                    mode="outlined" 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.product_brand}</Text>
                <TextInput 
                    value={brand} 
                    onChangeText={setBrand} 
                    mode="outlined" 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.notes}</Text>
                <TextInput 
                    value={notes} 
                    onChangeText={setNotes} 
                    mode="outlined" 
                    multiline 
                    numberOfLines={3} 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} 
                    outlineStyle={{ borderRadius: 12 }}
                />
            </View>
        </Card.Content>
       </Card>

       <Card style={[styles.card, { marginTop: 20 }]}>
        <Card.Content>
            <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text variant="bodyLarge" style={{ fontWeight:'600' }}>{t.set_reminder}</Text>
                <Switch value={hasReminder} onValueChange={setHasReminder} color="#1565C0" />
            </View>

            {hasReminder && (
                <View style={styles.reminderBox}>
                    <Text style={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'bold', marginBottom: 10 }}>{t.remind_me_at}</Text>
                    <View style={[styles.chips, { flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Chip onPress={() => setNextInterval(5000)} style={styles.chip} mode="outlined">+5000</Chip>
                    <Chip onPress={() => setNextInterval(10000)} style={styles.chip} mode="outlined">+10000</Chip>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.next_mileage}</Text>
                        <TextInput 
                            value={nextMileage} 
                            onChangeText={setNextMileage} 
                            keyboardType="numeric" 
                            mode="outlined" 
                            style={{ textAlign: isRTL ? 'right' : 'left', backgroundColor: 'transparent' }} 
                            outlineStyle={{ borderRadius: 12 }}
                        />
                    </View>
                </View>
            )}
        </Card.Content>
       </Card>
       <Button mode="contained" onPress={handleSave} style={styles.button}>{t.update_record}</Button>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  input: {
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 12,
  },
  card: {
      marginBottom: 10,
      borderRadius: 12,
      backgroundColor: '#fff',
      elevation: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  reminderBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  }
});
