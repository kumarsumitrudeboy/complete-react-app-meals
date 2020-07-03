import { createAppContainer } from 'react-navigation';
import React from 'react';
import {Text} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryMealsScreen from '../screens/CategoryMealsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import Colors from '../constants/Colors';
import { Platform } from 'react-native';
import {CATEGORIES, MEALS} from '../data/dummy-data';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/HeaderButton';
import {Ionicons} from '@expo/vector-icons';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import FiltersScreen from '../screens/FiltersScreen';

const defaultNavigationOptions = (arg) =>  {
    return({
    headerBackTitleVisible: false,
    headerStyle: {
        backgroundColor:Platform.OS === 'android' ? arg : 'white'
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerTintColor:Platform.OS === 'android' ? 'white' : arg
})}

const MealsNavigator = createStackNavigator(
    {
        Categories: {
            screen: CategoriesScreen,
            navigationOptions: (navigationData) => {
                return {
                    headerTitle: 'Meal Categories',
                    headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}><Item title="Menu" iconName="ios-menu" onPress={() => {navigationData.navigation.toggleDrawer();}}></Item></HeaderButtons>
                };
            }
        },
        CategoryMeals: {
            screen: CategoryMealsScreen,
            navigationOptions: (navigationData) => {
                const catId = navigationData.navigation.getParam('categoryId');
                const selectedCategory = CATEGORIES.find(cat => cat.id === catId);
                return {
                    headerTitle: selectedCategory.title
                };
            }
        },
        MealDetail: {
            screen: MealDetailScreen,
            navigationOptions: (navigationData) => {
                const mealTitle = navigationData.navigation.getParam('mealTitle');
                const toggleFavorite = navigationData.navigation.getParam('toggleFav')
                const isFavorite = navigationData.navigation.getParam('isFav');
                return {
                    headerTitle: mealTitle,
                    headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}><Item title="Fav" iconName={isFavorite ? 'ios-star':'ios-star-outline'} onPress={toggleFavorite} /></HeaderButtons>
                };
            }
        }
    },
    {
        //initialRouteName: 'MealDetail',
        defaultNavigationOptions: defaultNavigationOptions(Colors.primaryColor)
    }
);

const FavNavigator = createStackNavigator({
    Favorites: {
        screen: FavoritesScreen,
        navigationOptions:(navigationData) => {
            const defaultStyle = defaultNavigationOptions(Colors.accentColor);
            return {
                ...defaultStyle,
                headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}><Item title="Menu" iconName="ios-menu" onPress={() => {navigationData.navigation.toggleDrawer();}}></Item></HeaderButtons>
            }
        }
},
    MealDetail: MealDetailScreen
},{
    defaultNavigationOptions: defaultNavigationOptions(Colors.accentColor)
});

const tabScreenConfig = {
    Meals: {
        screen: MealsNavigator, 
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />;
            },
            tabBarColor: Colors.primaryColor,
            tabBarLabel: <Text style={{fontFamily: 'open-sans-bold'}}>Meals</Text>
        }
    },
    Favorites: {
        screen: FavNavigator, 
        navigationOptions: {
            tabBarLabel: <Text style={{fontFamily: 'open-sans-bold'}}>Favorites</Text>,
            tabBarIcon: (tabInfo) => {
                return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />;
            },
            tabBarColor: Colors.accentColor
        }
    }
};

const MealsFavTabNavigator = Platform.OS === 'android' ? 
    createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: 'white',
        shifting: true,
        barStyle: {
            backgroundColor: Colors.primaryColor
        }
    }) 
    : 
    createBottomTabNavigator(
        tabScreenConfig, 
        {
            tabBarOptions: {
                labelStyle: {
                    fontFamily: 'open-sans-bold'
                },
                activeTintColor: 'white',
                activeBackgroundColor: Colors.primaryColor,
                inactiveBackgroundColor: 'white'
            }
        }
);

const FiltersNavigator = createStackNavigator({
    Filters: {
        screen: FiltersScreen,
        navigationOptions:(navigationData) => {
            const defaultStyle = defaultNavigationOptions(Colors.primaryColor);
            return {
                ...defaultStyle,
                headerTitle: 'Your Specific Foods',
                headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                                <Item 
                                    title="Menu" 
                                    iconName="ios-menu" 
                                    onPress={() => {navigationData.navigation.toggleDrawer();}}>
                                </Item>
                            </HeaderButtons>,
                headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                                <Item 
                                    title="Save" 
                                    iconName="ios-save" 
                                    onPress={navigationData.navigation.getParam('save')}>
                                </Item>
                            </HeaderButtons>
            }
        }
    }
},
{
    defaultNavigationOptions: defaultNavigationOptions(Colors.primary)
}
);

const MainNavigator = createDrawerNavigator({
    MealsFavs: {
        screen: MealsFavTabNavigator,
        navigationOptions: {
            drawerLabel: 'Meals'
        }
    },
    Filters: FiltersNavigator
},{
    contentOptions: {
        activeTintColor: Colors.accentColor
    }
});

export default createAppContainer(MainNavigator);