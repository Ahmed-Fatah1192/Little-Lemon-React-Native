// screens/Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { initDatabase, saveMenuItems, getMenuItems } from '../utils/database';
import { fetchMenuItems, getImageUrl } from '../utils/api';

export default function HomeScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize database
        const dbInitialized = await initDatabase();
        
        if (dbInitialized) {
          // Try to load menu items from database first
          const storedItems = await getMenuItems();
          
          if (storedItems && storedItems.length > 0) {
            console.log('Using stored items from database');
            setMenuItems(storedItems);
            setFilteredItems(storedItems);
          } else {
            console.log('Fetching from API');
            // Fetch from API if no stored items
            const menuData = await fetchMenuItems();
            
            // Process the data to ensure each item has a category
            const processedData = menuData.map(item => ({
              ...item,
              category: item.category || 'mains' // Default category
            }));
            
            // Save to database
            await saveMenuItems(processedData);
            
            setMenuItems(processedData);
            setFilteredItems(processedData);
          }
        } else {
          // If database fails, just fetch from API
          console.log('Database initialization failed, using API only');
          const menuData = await fetchMenuItems();
          
          // Process the data to ensure each item has a category
          const processedData = menuData.map(item => ({
            ...item,
            category: item.category || 'mains' // Default category
          }));
          
          setMenuItems(processedData);
          setFilteredItems(processedData);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
        Alert.alert(
          'Data Loading Error',
          'Could not load menu items. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply search and category filters
  useEffect(() => {
    if (menuItems.length === 0) return;
    
    let results = [...menuItems];
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(item => 
        item.category && item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredItems(results);
  }, [searchQuery, selectedCategory, menuItems]);

  const handleCategoryPress = (category) => {
    // If the same category is selected, clear the filter
    if (category.toLowerCase() === selectedCategory.toLowerCase()) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const renderMenuItem = ({ item }) => {
    if (!item) return null; // Skip rendering if item is null
    
    const imageUrl = getImageUrl(item.image);
    
    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          <Text style={styles.menuItemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.menuItemImage} 
          // Fallback for image loading errors
          onError={(e) => console.log('Image loading error', e.nativeEvent.error)}
        />
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
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
          accessible={true}
          accessibilityLabel="Profile"
          accessibilityHint="Navigate to your profile page">
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
        <TouchableOpacity 
          style={[
            styles.categoryButton,
            selectedCategory === 'starters' && styles.selectedCategoryButton
          ]}
          onPress={() => handleCategoryPress('starters')}>
          <Text style={[
            styles.categoryText,
            selectedCategory === 'starters' && styles.selectedCategoryText
          ]}>Starters</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.categoryButton,
            selectedCategory === 'mains' && styles.selectedCategoryButton
          ]}
          onPress={() => handleCategoryPress('mains')}>
          <Text style={[
            styles.categoryText,
            selectedCategory === 'mains' && styles.selectedCategoryText
          ]}>Mains</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.categoryButton,
            selectedCategory === 'desserts' && styles.selectedCategoryButton
          ]}
          onPress={() => handleCategoryPress('desserts')}>
          <Text style={[
            styles.categoryText,
            selectedCategory === 'desserts' && styles.selectedCategoryText
          ]}>Desserts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.categoryButton,
            selectedCategory === 'drinks' && styles.selectedCategoryButton
          ]}
          onPress={() => handleCategoryPress('drinks')}>
          <Text style={[
            styles.categoryText,
            selectedCategory === 'drinks' && styles.selectedCategoryText
          ]}>Drinks</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#495E57" style={styles.loader} />
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => item ? `${item.name}-${index}` : `item-${index}`}
          style={styles.menuList}
          contentContainerStyle={styles.menuListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No menu items found</Text>
        </View>
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
  selectedCategoryButton: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
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