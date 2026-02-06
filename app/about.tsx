import React from 'react';
import { View, ScrollView, StyleSheet, Image, Linking } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { en, fa } from '../utils/translations';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const language = useStore((state) => state.language);
  const t = language === 'fa' ? fa : en;
  const isRTL = language === 'fa';

  // Images
  const appLogo = require('./assets/app-logo.png');
  const companyLogo = require('./assets/company.jpg');

  return (
    <>
      <Stack.Screen options={{ title: t.about }} />
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 50 + insets.bottom }]}>
        
        <View style={styles.section}>
          <Image source={appLogo} style={styles.appLogo} resizeMode="contain" />
          <Text variant="headlineMedium" style={styles.appName}>{t.app_name}</Text>

        <Text variant="bodyMedium" style={styles.version}>{t.version} {Constants.expoConfig?.version || '1.0.0'}</Text>
      </View>

      <Divider style={styles.divider} />

      <Card style={styles.card}>
        <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t.developed_by}</Text>
            
            <View style={styles.companyContainer}>
                <Image source={companyLogo} style={styles.companyLogo} resizeMode="contain" />
                <Text variant="headlineSmall" style={{ marginTop: 10, color: '#6200ee' }}>{t.company_name}</Text>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text variant="bodyMedium" style={[styles.infoText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t.company_address}
                </Text>
                <Text 
                    variant="bodyMedium" 
                    style={[styles.infoText, { textAlign: isRTL ? 'right' : 'left', color: '#6200ee' }]}
                    onPress={() => Linking.openURL(`tel:${t.company_phone.replace(/[^0-9+]/g, '')}`)}
                >
                    {t.company_phone}
                </Text>
            </View>
        </Card.Content>
      </Card>

    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  appLogo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 20,
  },
  appName: {
    fontWeight: 'bold',
    color: '#333',
  },
  version: {
    color: '#666',
    marginTop: 5,
  },
  divider: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#666',
    fontWeight: 'bold',
  },
  companyContainer: {
    alignItems: 'center',
  },
  companyLogo: {
    width: 150,
    height: 80, // Adjust aspect ratio as needed
  },
  infoText: {
    marginBottom: 8,
    lineHeight: 22,
  }
});
