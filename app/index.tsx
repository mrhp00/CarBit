import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, BackHandler, Share, TouchableOpacity, Image } from 'react-native';
import { Card, Text, FAB, Button, IconButton, Menu, Appbar, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useStore } from '../store/useStore';
import { en, fa } from '../utils/translations';
import { toPersianNumbers, formatDistance } from '../utils/formatters';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const cars = useStore((state) => state.cars);
  const services = useStore((state) => state.services);
  const expenses = useStore((state) => state.expenses);
  const importData = useStore((state) => state.importData);
  
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const appIcon = require('./assets/app-icon.png');

  useEffect(() => {
    const backAction = () => {
      // If we are on home screen (index), ask to backup
      // Check if we can detect if we are focused... simpler: this component unmounts if pushed? No, Stack keeps it.
      // But BackHandler in React Native usually handles hardware back.
      // Expo Router handles navigation. We only want to intercept if router.canGoBack() is false?
      // Actually standard Android behavior is to exit.
      
      if (router.canGoBack()) {
          return false; // Let default behavior happen
      }

      Alert.alert(t.exit_backup_title, t.exit_backup_msg, [
        {
          text: t.no_exit,
          onPress: () => BackHandler.exitApp(),
          style: 'cancel',
        },
        {
          text: t.yes_backup,
          onPress: () => {
             handleExportAll().then(() => {
                 BackHandler.exitApp();
             });
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [language]);

  const handleExportAll = async () => {
      const data = {
          version: 1,
          date: new Date().toISOString(),
          cars,
          services,
          expenses
      };
      
      const fileUri = FileSystem.documentDirectory + 'car_history_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
      } else {
          Alert.alert(t.error, 'Sharing is not available on this device');
      }
  };

  const handleImport = async () => {
      try {
          const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
          if (result.canceled) return;
          
          const file = result.assets[0];
          const content = await FileSystem.readAsStringAsync(file.uri);
          const data = JSON.parse(content);
          
          if (data.cars && data.services) {
              importData(data);
              Alert.alert(t.success, t.import_success);
          } else {
              Alert.alert(t.error, 'Invalid file format');
          }
      } catch (e) {
          Alert.alert(t.error, 'Failed to import data');
      }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card 
      style={styles.card} 
      onPress={() => router.push(`/car/${item.id}`)}
      mode="elevated" 
      elevation={2}
    >
      <Card.Content>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 8 }}>
            <IconButton icon="car" size={24} iconColor="#1565C0" style={{ margin: 0, [isRTL ? 'marginLeft' : 'marginRight']: 8 }} />
            <Text variant="titleLarge" style={{textAlign: isRTL ? 'right' : 'left', flex: 1, fontWeight:'bold'}}>{item.name}</Text>
        </View>
        <Divider style={{ marginBottom: 8 }} />
        <Text variant="bodyMedium" style={{textAlign: isRTL ? 'right' : 'left', color: '#555'}}>
            {item.make} {item.model} ({toPersianNumbers(item.year, language)})
        </Text>
        <Text variant="bodySmall" style={{textAlign: isRTL ? 'right' : 'left', color: '#777', marginTop: 4}}>
            {t.current_mileage}: {formatDistance(item.currentMileage, language)}
        </Text>
      </Card.Content>
      <Card.Actions style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: isRTL ? 'flex-start' : 'flex-end', paddingTop: 0 }}>
        <Button mode="text" textColor="#1565C0" onPress={() => router.push(`/car/${item.id}`)}>{t.car_details}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fff'}} elevated>
         {isRTL ? (
             <>
                <TouchableOpacity onPress={() => router.push('/about')} style={{ marginLeft: 16 }}>
                    <Image source={appIcon} style={{ width: 32, height: 32, borderRadius: 8 }} />
                </TouchableOpacity>
                <Appbar.Content title={t.app_name} titleStyle={{ textAlign: 'left', fontFamily: 'System' }} style={{ alignItems: 'flex-start' }} />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
                >
                    <Menu.Item onPress={() => { setLanguage('en'); closeMenu(); }} title="English" leadingIcon="translate" />
                    <Menu.Item onPress={() => { handleImport(); closeMenu(); }} title={t.import_data} leadingIcon="download" />
                    <Menu.Item onPress={() => { handleExportAll(); closeMenu(); }} title={t.export_all} leadingIcon="export" />
                    <Divider />
                    <Menu.Item onPress={() => { router.push('/about'); closeMenu(); }} title={t.about} leadingIcon="information" />
                </Menu>
             </>
         ) : (
             <>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
                >
                    <Menu.Item onPress={() => { setLanguage('fa'); closeMenu(); }} title="فارسی" leadingIcon="translate" />
                    <Menu.Item onPress={() => { handleImport(); closeMenu(); }} title={t.import_data} leadingIcon="download" />
                    <Menu.Item onPress={() => { handleExportAll(); closeMenu(); }} title={t.export_all} leadingIcon="export" />
                    <Divider />
                    <Menu.Item onPress={() => { router.push('/about'); closeMenu(); }} title={t.about} leadingIcon="information" />
                </Menu>
                <Appbar.Content title={t.app_name} />
                <TouchableOpacity onPress={() => router.push('/about')} style={{ marginRight: 16 }}>
                    <Image source={appIcon} style={{ width: 32, height: 32, borderRadius: 8 }} />
                </TouchableOpacity>
             </>
         )}
      </Appbar.Header>

      {cars.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall">{t.no_cars}</Text>
          <Text variant="bodyMedium">{t.add_car_hint}</Text>
        </View>
      ) : (
        <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: 16 + insets.bottom, left: isRTL ? 16 : undefined, right: isRTL ? undefined : 16 }]}
        onPress={() => router.push('/add-car')}
        label={t.add_new_car}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      backgroundColor: '#fff',
      elevation: 2
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
