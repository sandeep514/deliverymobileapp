import React, {useEffect, useState} from 'react';
import {NavigationContainer , DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//Screens

import LoginScreen from '../views/LoginScreen';
import VehicleSelectScreen from '../views/VehicleSelectScreen';
import RouteScreen from '../views/RouteScreen';
import {Colors} from '../components/Colors';
import Dashboard from '../views/Dashboard';
import Profile from '../views/Profile';
import ItemsScreen from '../views/ItemsScreen';
import DashboardRoutes from '../views/DashboardRoutes';
import VehicleScreen from '../views/VehicleScreen';
import LoadsScreen from '../views/LoadsScreen';
import ItemsScreenWithQty from '../views/ItemsScreenWithQTY';
import AddQuantity from '../views/AddQuantity';
import PDFmanager from '../views/PDFmanager';
import AllInvoice from '../views/AllInvoice';
import Todayinvoices from '../views/Todayinvoices';

import { View, Text, Button, Image } from 'react-native';
import { Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Pressable } from 'react-native';

const Stack = createStackNavigator();

export default function Nav() {
	return (
		<NavigationContainer theme={DarkTheme}>
			<Stack.Navigator
				initialRouteName="Todayinvoices"
				allowFontScaling={false}
				screenOptions={{
				headerStyle: {
					backgroundColor: '#fff',
					elevation: 0,
				},
				headerTintColor: Colors.primary,
				headerTitleStyle: {
					fontWeight: 'bold',
					width: '80%',
					textAlign: 'center',
				},
			}}>
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{headerShown: false}}
				/>

				<Stack.Screen
					name="Vehicle"
					component={VehicleSelectScreen}
					options={{
						title: 'Select Vehicle',
					}}
				/>

				<Stack.Screen
					name="Route"
					component={RouteScreen}
					options={{title: 'Select Route'}}
					initialParams={{vehicleId: 'value'}}
				/>
				<Stack.Screen
					name="AllInvoice"
					component={AllInvoice}
					options={{title: 'List Invoices'}}
				/>
				<Stack.Screen
					name="Todayinvoices"
					component={Todayinvoices}
					options={{title: 'Today invoice'}}
				/>

				<Stack.Screen
					name="loads"
					component={LoadsScreen}
					options={{title: 'Select Loads'}}
					initialParams={{vehicleId: 'value'}}
				/>

				<Stack.Screen
					name="Dashboard"
					component={Dashboard}
					options={({navigation}) => ({title: 'Dashboard', 
						headerRight: () => (
							<View style={{flexDirection: 'row'}}>
								<Pressable style={{backgroundColor: 'lightgreen' , padding: 8,borderRadius: 5,marginVertical: 10,marginRight: 5}} onPress={() => {
									navigation.navigate('Todayinvoices')
								}}>
									<Text style={{color: '#000'}}>Today's</Text>
								</Pressable>
								<Pressable onPress={() => {
									navigation.navigate('AllInvoice');
								}} style={{backgroundColor: Colors.primary , padding: 8,borderRadius: 5,marginVertical: 10}} >
									<Text style={{color: 'white'}}>All Invoices</Text>
								</Pressable>
							</View>
						),
					})}
				/>

				<Stack.Screen
					name="Profile"
					component={Profile} // options={{headerShown: false}}
				/>

				<Stack.Screen
					title="Loaded Items"
					name="Items"
					component={ItemsScreen}
					options={{headerShown: false}}
				/>

				<Stack.Screen
					title="VehicleScreen"
					name="VehicleScreen"
					component={VehicleScreen} // options={{headerShown: false}}
				/>

				<Stack.Screen
					title="Available Routes"
					name="DashboardRoutes"
					component={DashboardRoutes} // options={{headerShown: false}}
				/>

				<Stack.Screen
					title="Items"
					name="ItemsScreenWithQty"
					component={ItemsScreenWithQty} 
					options={{title: 'Item Screen Qty'}}
				/>
				<Stack.Screen
					title="AddQuantity"
					name="AddQuantity"
					component={AddQuantity} 
					options={{title: 'Add Quantity'}}
				/>
				<Stack.Screen
					title="PDF manager"
					name="PDFmanager"
					component={PDFmanager}
					options={( {navigation} ) => ({
						headerShown: true , title : 'Invoice',
						headerLeft: () => (
							<Pressable onPress={() => { navigation.navigate('Dashboard')}}>
								<Icon name="home" color={Colors.primary} style={{marginLeft: 10,padding: 10}} />
							</Pressable>
						),
					})}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}