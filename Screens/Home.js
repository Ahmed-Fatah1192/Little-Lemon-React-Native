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
    // In screens/Home.js - Update the loadData function in useEffect
const loadData = async () => {
  try {
    // Skip the database initialization for now to simplify debugging
    console.log('Fetching menu items directly from API');
    const menuData = await fetchMenuItems();
    
    if (!menuData || menuData.length === 0) {
      console.error('No menu data received from API');
      return;
    }
    
    console.log(`Received ${menuData.length} menu items`);
    
    // Process the data to ensure each item has all required properties
    const processedData = menuData.map(item => {
      // Log each item to help with debugging
      console.log(`Processing item: ${item.name}, price: ${item.price}, image: ${item.image}`);
      
      return {
        ...item,
        // Ensure all required properties exist
        name: item.name || 'Unknown Item',
        price: item.price || 0,
        description: item.description || 'No description available',
        image: item.image || null,
        category: item.category || 'mains'
      };
    });
    
    setMenuItems(processedData);
    setFilteredItems(processedData);
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
    if (!item) return null;
    
    // Check if necessary properties exist
    const name = item.name || 'Unknown Item';
    const description = item.description || 'No description available';
    const price = typeof item.price === 'number' ? item.price : 0;
    
    // Log item details for debugging
    console.log(`Rendering ${name}, price: ${price}, image: ${item.image}`);
    
    // Get image URL
    const imageUrl = item.image 
      ? getImageUrl(item.image) 
      : 'https://via.placeholder.com/100?text=No+Image';
    
    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {description}
          </Text>
          <Text style={styles.menuItemPrice}>${parseFloat(price).toFixed(2)}</Text>
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.menuItemImage} 
          onError={(e) => {
            console.log(`Image error for ${name}:`, e.nativeEvent.error);
          }}
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
            // Add these props to suppress the warning
            iconProps={{ keyboardShouldPersistTaps: "always" }}
            showLoading={false}
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