import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
import {StyleSheet,Image,View,Dimensions,ScrollView,TouchableHighlight, ActivityIndicator,} from 'react-native';
import {ListItem} from 'react-native-elements';

import { getRoutes } from '../api/apiService';
import { Colors } from '../components/Colors';
import MainScreen from '../layout/MainScreen';

const win = Dimensions.get('window');

export default function RouteScreen({navigation , route}) {
	const [list ,setList] = useState();
	const [loader ,setLoader] = useState(false);
	const [ selectedVehicleNumber , setSelectedVehicleNumber ] = useState();

	useEffect(() => {
		let isMounted = true;
		let selectedVehicleNo = route.params.vehicleNo;
		AsyncStorage.setItem('selectedVehicleNo' , selectedVehicleNo.toString());
		AsyncStorage.setItem('refreshLoad' , 'Dashboard');
		setSelectedVehicleNumber(selectedVehicleNo);

		getListRoutes();
	} , [])
	
	function getListRoutes ()  {
		setLoader(true)
		getRoutes().then((res) => {
			setList(res)
			setLoader(false)
		});
	}

	function redirectRoute(selectedRouteId){
		AsyncStorage.setItem('selectedRoute' , selectedRouteId.toString());
		navigation.push('loads' , { 'selectedVehicle' : selectedVehicleNumber , 'selectedRoute' : selectedRouteId });
	}

	return (
		<MainScreen style={styles.container}>
			<ScrollView>
				<View>
					{( loader == true )?
						<View>
							<ActivityIndicator color={Colors.primary} size="large" />
							</View>
					:
						<View></View>
					}

					{ (list != undefined)?

						list.map((l, i) => (
							<TouchableHighlight key={i} onPress={() => redirectRoute(l.id) }>
								<ListItem key={i} bottomDivider>
									<Image source={require('../assets/images/map.png')} style={styles.Avatar} />
									<ListItem.Content>
										<ListItem.Title allowFontScaling={false}>
											{l.routno}
										</ListItem.Title>
									</ListItem.Content>
									<ListItem.Chevron />
								</ListItem>
							</TouchableHighlight>
						))
						:
						<View></View>
					}
				</View>
			</ScrollView>
		</MainScreen>
	);
}

const styles = StyleSheet.create({
  	Avatar: {width: 50, height: 50, resizeMode: 'contain'}
});