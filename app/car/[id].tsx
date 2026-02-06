import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, List, Divider, ProgressBar, FAB, TextInput, IconButton, Portal, Dialog } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useStore } from '../../store/useStore';
import { ServiceRecord } from '../../types';
import { en, fa } from '../../utils/translations';
import { toPersianNumbers, formatCurrency, formatDate, formatDistance, formatNumber, toEnglishDigits } from '../../utils/formatters';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';
  
  const car = useStore((state) => state.cars.find((c) => c.id === id));
  const services = useStore((state) => state.services.filter((s) => s.carId === id));
  const updateMileage = useStore((state) => state.updateCarMileage);
  const removeCar = useStore((state) => state.removeCar);
  const dismissReminder = useStore((state) => state.dismissReminder);

  const [mileageInput, setMileageInput] = useState('');
  const [showUpdateMileage, setShowUpdateMileage] = useState(false);

  const carServices = useStore((state) => state.services.filter(s => s.carId === id));
  const carExpenses = useStore((state) => state.expenses.filter(e => e.carId === id));

  const handleExportCar = async () => {
      const data = {
          version: 1,
          date: new Date().toISOString(),
          cars: [car],
          services: carServices,
          expenses: carExpenses
      };
      
      const fileName = car ? `history_${car.make}_${car.model}.json`.replace(/\s+/g, '_') : 'history_unknown_car.json';
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2), { encoding: 'utf8' });
      
      if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
      } else {
          Alert.alert(t.error, 'Sharing is not available');
      }
  };

  if (!car) {
    return (
      <View style={styles.center}>
        <Text>Car not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  // Reminders logic
  const reminders = services
    .filter(s => !s.isReminderDismissed && s.nextServiceMileage && s.nextServiceMileage > car.currentMileage)
    .map(s => {
      const remaining = (s.nextServiceMileage || 0) - car.currentMileage;
      return { ...s, remaining };
    })
    .sort((a, b) => a.remaining - b.remaining);

  // Overdue
  const overdue = services
    .filter(s => !s.isReminderDismissed && s.nextServiceMileage && s.nextServiceMileage <= car.currentMileage)
    .map(s => ({ ...s, overdueBy: car.currentMileage - (s.nextServiceMileage || 0) }));

  const handleUpdateMileage = () => {
    const cleanMileage = toEnglishDigits(mileageInput);
    const newMileage = parseInt(cleanMileage, 10);
    if (!isNaN(newMileage)) {
      if (newMileage < car.currentMileage) {
        Alert.alert(t.error, t.mileage_error);
        return;
      }
      updateMileage(car.id, newMileage);
      // Check for dues
      const dueServices = services.filter(s => s.nextServiceMileage && s.nextServiceMileage <= newMileage && s.nextServiceMileage > car.currentMileage);
      if (dueServices.length > 0) {
        Alert.alert(t.maintenance_reminder, `${dueServices.length} ${t.service_due}`);
      }
      setShowUpdateMileage(false);
      setMileageInput('');
    }
  };

  const handleDelete = () => {
    Alert.alert(t.delete_car, t.delete_warn, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => {
        removeCar(car.id);
        router.back();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <Card style={styles.card}>
          <Card.Title 
            title={car.name} 
            subtitle={`${car.make} ${car.model} (${toPersianNumbers(car.year, language)})`} 
            titleStyle={{ textAlign: isRTL ? 'right' : 'left' }}
            subtitleStyle={{ textAlign: isRTL ? 'right' : 'left' }}
          />
          <Card.Content>
            <View style={[styles.mileageRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View>
                <Text variant="labelMedium" style={{textAlign: isRTL ? 'right' : 'left'}}>{t.current_mileage}</Text>
                <Text variant="displaySmall" style={{textAlign: isRTL ? 'right' : 'left'}}>{formatDistance(car.currentMileage, language)}</Text>
              </View>
              <Button mode="outlined" onPress={() => {
                setMileageInput(formatNumber(car.currentMileage, language));
                setShowUpdateMileage(true);
              }}>{t.update}</Button>
            </View>
            
            <Button icon="export" onPress={handleExportCar} style={{marginTop: 10}}>{t.export_car}</Button>
          </Card.Content>
        </Card>

        {/* Reminders Section */}
        {(reminders.length > 0 || overdue.length > 0) && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 16 : 0 }]}>{t.reminders}</Text>
            
            {overdue.map(item => (
              <Card key={item.id} style={[styles.card, styles.overdueCard]}>
                <Card.Content>
                  <Text style={{color:'white', fontWeight:'bold', textAlign: isRTL ? 'right': 'left'}}>{t.overdue}: {item.title}</Text>
                  <Text style={{color:'white', textAlign: isRTL ? 'right': 'left'}}>
                    {t.due_at}: {formatDistance(item.nextServiceMileage || 0, language)} ({t.overdue} {formatDistance(item.overdueBy, language)})
                  </Text>
                </Card.Content>
                <Card.Actions style={{justifyContent: isRTL ? 'flex-start' : 'flex-end'}}>
                  <Button textColor="white" onPress={() => router.push({ pathname: '/service/add', params: { carId: car.id } })}>{t.log_service}</Button>
                  <Button textColor="white" onPress={() => dismissReminder(item.id)}>Dismiss</Button>
                </Card.Actions>
              </Card>
            ))}

            {reminders.map(item => (
              <Card key={item.id} style={styles.reminderCard}>
                <Card.Content>
                  <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                     <Text variant="titleSmall">{item.title}</Text>
                     <Text variant="bodySmall">{formatDistance(item.remaining, language)} {t.left}</Text>
                  </View>
                  <ProgressBar progress={Math.max(0, 1 - (item.remaining / 5000))} color={item.remaining < 1000 ? 'red' : 'blue'} style={{marginVertical: 5}}/>
                  <Text variant="bodySmall" style={{textAlign: isRTL ? 'right' : 'left'}}>{t.due_at}: {formatDistance(item.nextServiceMileage || 0, language)}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 16 : 0 }]}>{t.recent_services}</Text>
          {services.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((service) => (
             <List.Item
              key={service.id}
              title={service.title}
              description={`${formatDate(service.date, language)}  •  ${service.cost > 0 ? formatCurrency(service.cost, language) : (isRTL ? 'بدون هزینه' : 'No cost')}  • @${formatDistance(service.mileageAtService, language)}`}
              left={props => <List.Icon {...props} icon="wrench" />}
            />
          ))}
          {services.length === 0 && <Text style={{marginHorizontal:16, fontStyle:'italic', textAlign: isRTL ? 'right' : 'left'}}>{t.no_services}</Text>}
          
          <Button 
            mode="contained-tonal" 
            icon="history" 
            onPress={() => router.push(`/history/${car.id}`)}
            style={{margin: 16}}
          >
            {t.view_history}
          </Button>
        </View>

        <Button mode="text" textColor="red" onPress={handleDelete} style={{marginTop: 20}}>
            {t.delete_car}
        </Button>
      </ScrollView>

      <FAB
        icon="plus"
        label={t.log_service}
        style={[styles.fab, { bottom: 16 + insets.bottom, left: isRTL ? 16 : undefined, right: isRTL ? undefined : 16 }]}
        onPress={() => router.push({ pathname: '/service/add', params: { carId: car.id } })}
      />

      {/* Update Mileage Dialog */}
      <Portal>
        <Dialog visible={showUpdateMileage} onDismiss={() => setShowUpdateMileage(false)}>
          <Dialog.Title style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.update} {t.current_mileage}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: 5, color: '#666' }}>{t.next_mileage}</Text>
            <TextInput
              value={mileageInput}
              onChangeText={(text) => setMileageInput(formatNumber(text, language))}
              keyboardType="numeric"
              autoFocus
              mode="outlined"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
              outlineStyle={{ borderRadius: 12 }}
            />
          </Dialog.Content>
          <Dialog.Actions style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <Button onPress={() => setShowUpdateMileage(false)}>{t.cancel}</Button>
            <Button onPress={handleUpdateMileage}>{t.save_record}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    margin: 16,
    backgroundColor: 'white',
  },
  mileageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    color: '#666',
  },
  reminderCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#e3f2fd',
  },
  overdueCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#d32f2f',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
