import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appNameText}>SciHealth</Text>
          <Text style={styles.subtitle}>Your personal assistant for managing your medication schedule.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 250,
    height: 250,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    color: '#FF7551',
    fontWeight: 'bold',
  },
  appNameText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#196EB0',
  },
  subtitle: {
    fontSize: 18,
    color: "#196EB0",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: '#196EB0',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#196EB0',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#196EB0',
    textAlign: 'center',
  },
});
