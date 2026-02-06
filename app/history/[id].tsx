import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, I18nManager } from 'react-native';
import { TextInput, Card, Text, Divider, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { ServiceRecord } from '../../types';
import { en, fa } from '../../utils/translations';
import { toPersianNumbers, formatCurrency, formatDate, formatDistance } from '../../utils/formatters';

export default function HistoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';
  
  const services = useStore((state) => state.services.filter((s) => s.carId === id));
  
  const filteredServices = useMemo(() => {
    if (!searchQuery) return services.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const query = searchQuery.toLowerCase();
    return services.filter(s => 
      s.title.toLowerCase().includes(query) || 
      (s.notes && s.notes.toLowerCase().includes(query)) ||
      (s.serviceCenter && s.serviceCenter.toLowerCase().includes(query)) ||
      (s.productBrand && s.productBrand.toLowerCase().includes(query))
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [services, searchQuery]);

  // Calculate Totals based on filtered results
  const totalCost = useMemo(() => {
    return filteredServices.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [filteredServices]);

  const renderItem = ({ item }: { item: ServiceRecord }) => {
    const description = (
      <View style={{marginTop: 4}}>
         <Text variant="bodySmall" style={{color:'#666', textAlign: isRTL ? 'right' : 'left'}}>
            {formatDate(item.date, language)} • {formatDistance(item.mileageAtService, language)}
         </Text>
         {item.serviceCenter ? <Text variant="bodySmall" style={{color:'#666', textAlign: isRTL ? 'right' : 'left'}}>{t.service_center}: {item.serviceCenter}</Text> : null}
         {item.productBrand ? <Text variant="bodySmall" style={{color:'#666', textAlign: isRTL ? 'right' : 'left'}}>{t.product_brand}: {item.productBrand}</Text> : null}
         {item.notes ? <Text variant="bodySmall" style={{color:'#666', fontStyle:'italic', textAlign: isRTL ? 'right' : 'left'}}>{t.notes}: {item.notes}</Text> : null}
      </View>
    );

    const CostComponent = (props: any) => <Text variant="titleMedium" style={{alignSelf:'center', marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0}}>{formatCurrency(item.cost, language)}</Text>;
    const IconComponent = (props: any) => <List.Icon {...props} icon="wrench" />;

    return (
      <List.Item
        title={item.title}
        titleStyle={{ textAlign: isRTL ? 'right' : 'left' }}
        onPress={() => router.push(`/service/${item.id}`)}
        description={() => description}
        left={isRTL ? CostComponent : IconComponent}
        right={isRTL ? IconComponent : CostComponent}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{color:'white', textAlign: isRTL ? 'right' : 'left'}}>{t.total_maintenance_cost}</Text>
            <Text variant="displayMedium" style={{color:'white', fontWeight:'bold', textAlign: isRTL ? 'right' : 'left'}}>{formatCurrency(totalCost, language)}</Text>
            <Text variant="bodySmall" style={{color:'rgba(255,255,255,0.8)', textAlign: isRTL ? 'right' : 'left'}}>
                {toPersianNumbers(services.length, language)} {t.services_recorded}
            </Text>
          </Card.Content>
        </Card>

        <TextInput
          placeholder={t.search_history}
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          left={isRTL ? null : <TextInput.Icon icon="magnify" />}
          right={isRTL ? <TextInput.Icon icon="magnify" /> : null}
          style={[styles.searchBar, { textAlign: isRTL ? 'right' : 'left' }]}
          contentStyle={{ textAlign: isRTL ? 'right' : 'left' }}
        />
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20}}>{t.no_services}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  totalCard: {
    backgroundColor: '#6200ee',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: 'white',
  },
  list: {
    paddingBottom: 20
  }
});
