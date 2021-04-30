import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
import {StyleSheet,Image,View,Dimensions,ScrollView,TouchableHighlight,} from 'react-native';
import {ListItem} from 'react-native-elements';
import MainScreen from '../layout/MainScreen';

const win = Dimensions.get('window');
const list = [
	{
		id : 1,
		name: 'Tuesday',
	},
	{
		id : 2,
		name: 'WednessDay',
	},
	{
		id : 3,
		name: 'Thursday',
	},
	{
		id : 4,
		name: 'Friday',
	},
	{
		id : 5,
		name: 'Saturday',
	},
];

export default function RouteScreen({navigation , route}) {
	const [ selectedVehicleNumber , setSelectedVehicleNumber ] = useState();

	useEffect(() => {
		let isMounted = true;
		let selectedVehicleNo = route.params.vehicleNo;
		AsyncStorage.setItem('selectedVehicleNo' , selectedVehicleNo.toString());
		AsyncStorage.setItem('refreshLoad' , 'Dashboard');
		setSelectedVehicleNumber(selectedVehicleNo);
	} , [])

	function redirectRoute(selectedRouteId){
		AsyncStorage.setItem('selectedRoute' , selectedRouteId.toString());
		navigation.push('loads' , { 'selectedVehicle' : selectedVehicleNumber , 'selectedRoute' : selectedRouteId });
	}

	return (
		<MainScreen style={styles.container}>
			<ScrollView>
				<View>
					{list.map((l, i) => (
						<TouchableHighlight key={i} onPress={() => redirectRoute(l.id) }>
							<ListItem key={i} bottomDivider>
								<Image source={require('../assets/images/map.png')} style={styles.Avatar} />
								<ListItem.Content>
									<ListItem.Title allowFontScaling={false}>
										{l.name}
									</ListItem.Title>
								</ListItem.Content>
								<ListItem.Chevron />
							</ListItem>
						</TouchableHighlight>
					))}
				</View>
			</ScrollView>
		</MainScreen>
	);
}

const styles = StyleSheet.create({
  	Avatar: {width: 50, height: 50, resizeMode: 'contain'}
});