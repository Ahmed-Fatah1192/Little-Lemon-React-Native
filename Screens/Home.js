// screens/Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { initDatabase, saveMenuItems, getMenuItems } from '../utils/database';
import { fetchMenuItems, getImageUrl } from '../utils/api';

export default function HomeScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize database
        await initDatabase();
        
        // Try to load menu items from database first
        const storedItems = await getMenuItems();
        
        if (storedItems.length > 0) {
          // Use stored items if available
          setMenuItems(storedItems);
        } else {
          // Fetch from API if no stored items
          const menuData = await fetchMenuItems();
          await saveMenuItems(menuData);
          setMenuItems(menuData);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const renderMenuItem = ({ item }) => {
    const imageUrl = getImageUrl(item.image);
    
    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.menuItemImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={require('../assets/profile.png')} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroSubtitle}>Chicago</Text>
        <View style={styles.heroContent}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroDescription}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image 
            source={require('../assets/hero-image.png')} 
            style={styles.heroImage} 
          />
        </View>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Enter search phrase"
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            round
            lightTheme
          />
        </View>
      </View>

      {/* Order For Delivery Section */}
      <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
      
      {/* Categories */}
      <View style={styles.categories}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Starters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Mains</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Desserts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Drinks</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#495E57" style={styles.loader} />
      ) : (
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.name}
          style={styles.menuList}
          contentContainerStyle={styles.menuListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  logo: {
    height: 40,
    width: 150,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroSection: {
    backgroundColor: '#495E57',
    padding: 20,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 32,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 10,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  heroDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  searchContainer: {
    marginTop: 15,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
  },
  searchBarInputContainer: {
    backgroundColor: '#E4E4E4',
    height: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#EDEFEE',
    padding: 10,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuItemContent: {
    flex: 1,
    marginRight: 10,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuItemDescription: {
    color: '#495E57',
    fontSize: 14,
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEFEE',
  },
});