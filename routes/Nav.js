import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
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

const Stack = createStackNavigator();

export default function Nav({navigation}) {
	return (
		<NavigationContainer>

			<Stack.Navigator initialRouteName="Login" allowFontScaling={false}
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
					initialParams={{'vehicleId':'value'}}
				/>
				
				<Stack.Screen
					name="loads"
					component={LoadsScreen}
					options={{title: 'Select Loads'}}
					initialParams={{'vehicleId':'value'}}
					
				/>
				
				<Stack.Screen
					name="Dashboard"
					component={Dashboard}
					options={{title: 'Dashboard'}}
				/>
				
				<Stack.Screen
					name="Profile"
					component={Profile} // options={{headerShown: false}}
				/>

				<Stack.Screen
					title="Loaded Items"
					name="Items"
					component={ItemsScreen}
					options={
						{headerShown: false}
					}
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
					component={ItemsScreenWithQty} // options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
	}
