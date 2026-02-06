import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, List, Button, Divider, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { en, fa } from '../../utils/translations';
import { toPersianNumbers, formatCurrency, formatDate, formatDistance } from '../../utils/formatters';

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';
  
  const services = useStore((state) => state.services);
  const removeService = useStore((state) => state.removeService);
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <View style={styles.center}>
        <Text>{t.error}</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(t.delete, t.delete_warn, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => {
        removeService(service.id);
        router.back();
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 50 + insets.bottom }]}>
      <Card style={styles.card}>
        <Card.Title 
            title={service.title} 
            subtitle={formatDate(service.date, language)} 
            titleStyle={{ textAlign: isRTL ? 'right' : 'left' }}
            subtitleStyle={{ textAlign: isRTL ? 'right' : 'left' }}
            left={(props) => !isRTL && <List.Icon {...props} icon="wrench" />} 
            right={(props) => (
              <View style={{flexDirection: isRTL ? 'row-reverse' : 'row'}}>
                   {isRTL && <List.Icon {...props} icon="wrench" />}
                   <IconButton {...props} icon="pencil" onPress={() => router.push(`/service/edit/${service.id}`)} />
              </View>
            )}
        />
        <Card.Content>
          <Text variant="displaySmall" style={{marginBottom: 20, textAlign: isRTL ? 'right' : 'left'}}>{formatCurrency(service.cost, language)}</Text>
          
          <Divider style={{marginBottom: 10}}/>
          
          <DetailRow label={t.mileage_at_service} value={formatDistance(service.mileageAtService, language)} isRTL={isRTL} />
          <DetailRow label={t.service_center} value={service.serviceCenter || (isRTL ? '-' : 'N/A')} isRTL={isRTL} />
          <DetailRow label={t.product_brand} value={service.productBrand || (isRTL ? '-' : 'N/A')} isRTL={isRTL} />
          
          {service.nextServiceMileage && (
            <DetailRow label={t.reminder_set_at} value={formatDistance(service.nextServiceMileage, language)} isRTL={isRTL} />
          )}

          <Divider style={{marginVertical: 10}}/>
          <Text variant="titleSmall" style={{marginTop:10, textAlign: isRTL ? 'right' : 'left'}}>{t.notes}</Text>
          <Text variant="bodyMedium" style={{marginTop:5, textAlign: isRTL ? 'right' : 'left'}}>{service.notes || '-'}</Text>

        </Card.Content>
      </Card>

      <Button mode="outlined" textColor="red" onPress={handleDelete} style={{marginTop: 20}}>
        {t.delete}
      </Button>
    </ScrollView>
  );
}

function DetailRow({ label, value, isRTL }: { label: string, value: string, isRTL: boolean }) {
  return (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Text variant="bodyMedium" style={{color:'#666'}}>{label}</Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  }
});
