import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {Colors} from './../components/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem, Avatar, Header} from 'react-native-elements';
import MainScreen from '../layout/MainScreen';
import { useState ,useEffect } from 'react';
import { getVehicle} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const win = Dimensions.get('window');

export default function VehicleSelectScreen({navigation}) {
	const [data , setData] = useState();
	
	useEffect( () => {
		getVehicle().then( (res) => {
			setData(res);
		} , (err) => {
		});	
	}, [])

  	return (
		<MainScreen>
			<ScrollView>
				<View>
					{ ( data != undefined ) ?
						data.map((l, i) => (
							<TouchableHighlight key={i} onPress={() => {
									AsyncStorage.setItem('vehicle_no' , l.vehicle_no) ;
									navigation.push('Route' ,{'vehicleNo' : l.id} )
								}
							}>
								<ListItem key={i} bottomDivider>
									<Image source={require('../assets/images/truck.png')} style={styles.vehicleImage} />
									<ListItem.Content>
										<ListItem.Title allowFontScaling={false}>
											{l.vehicle_no}
										</ListItem.Title>
									{/* <ListItem.Subtitle allowFontScaling={false}>
										{l.comments}
									</ListItem.Subtitle> */}
									</ListItem.Content>
									<ListItem.Chevron />
								</ListItem>
							</TouchableHighlight>
						))
					: 
						<View>
							
						</View>
					}
					
				</View>
			</ScrollView>
		</MainScreen>
  	);
}

const styles = StyleSheet.create({
  vehicleImage: {width: 50, height: 50, resizeMode: 'contain'},
});
