import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {Card, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Colors} from '../components/Colors';
import {widthToDp, heightToDp} from '../utils/Responsive';
import MainScreen from '../layout/MainScreen';
import DashboardCard from '../components/DashboardCard';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodaySale, getVehicleLoadCount } from '../api/apiService';
import { ActivityIndicator } from 'react-native';

export default function Dashboard({navigation , route}) {
	const [ userName ,setuserName ] = useState();
	const [ selectedVehicle ,setselectedVehicle ] = useState();
	const [ selectedVehicleCount ,setSelectedLoadCount ] = useState();
	const [ SalesOfDay ,setSalesOfDay ] = useState();
	const [ TotalAmount ,setTotalAmount ] = useState();

	useEffect(() => {
		AsyncStorage.getItem('selectedVehicleNo').then((value) => {
			let vehicheId = value;
			AsyncStorage.getItem('selectedLoadsNumbers').then((value) => {
				let load_numbers = value;
				if( selectedVehicleCount == undefined ){
					getVehicleLoadCount(vehicheId , load_numbers).then((data) => {
						setSelectedLoadCount(data.data.data)
					});
				}
			});
		});

		AsyncStorage.getItem('user_name').then((value) => {
			setuserName(value);
		})
		AsyncStorage.getItem('vehicle_no').then((value) => {
			setselectedVehicle(value);
		})

		AsyncStorage.getItem('selectedVehicleNo').then((value) => {
			let selectedVehNo  = value;
			AsyncStorage.getItem('user_id').then((value) => {
				let driverId =  value;
				getTodaySale(driverId,selectedVehNo).then((res) => {
					setSalesOfDay(res.data.data);
					setTotalAmount(res.data.amount);
				});
			})
		})
	} , [])


	return (
		<MainScreen>
			<View style={styles.cardSection}>
				<DashboardCard
					backgroundColor={Colors.primary}
					cardName={userName}
					icon="user"
					onPress={() => {
						navigation.navigate('Profile');
					}}
				/>
				<DashboardCard
					backgroundColor={Colors.skyBlue}
					cardName={selectedVehicle}
					icon="truck"
					onPress={() => {
						navigation.navigate('VehicleScreen');
					}}
				/>
				<DashboardCard
					backgroundColor={Colors.parrotGreen}
					cardName="ITEMS"
					icon="shopping-cart"
					displayBadge={true}
					badgeValue={(selectedVehicleCount) ? selectedVehicleCount: <ActivityIndicator size="small" color="white"></ActivityIndicator> }
					onPress={() => {
						navigation.navigate('Items');
					}}
				/>
				<DashboardCard
					backgroundColor={Colors.yellow}
					cardName="ROUTES"
					icon="map"
					onPress={() => {
						navigation.navigate('DashboardRoutes');
					}}
				/>
			</View>

			<View style={styles.barSection}>
				<Text style={styles.detailBar} allowFontScaling={false}>
					Sales for Today
				</Text>
				<Text style={styles.barText} allowFontScaling={false}>
					{(TotalAmount != undefined) ? 'Total: £'+TotalAmount : <Text></Text> }
				</Text>
			</View>

			<View style={styles.itemListSection}>
				<ScrollView vertical='true'>
					{(SalesOfDay != undefined) ?
						SalesOfDay.map((l, i) => (
							<TouchableHighlight key={l.id}>
								<ListItem bottomDivider key={l.id}>
									<ListItem.Content>
										<ListItem.Title style={{fontSize: 14}} allowFontScaling={false}>
											{l.buyer}
										</ListItem.Title>
										<ListItem.Subtitle allowFontScaling={false} >
											<Text style={{fontSize: 10}}>{l.sitem}</Text>
										</ListItem.Subtitle>
										<ListItem.Subtitle allowFontScaling={false} >
											<Text style={{fontSize: 11}}>{l.sale_price} x {l.qty}</Text>	
										</ListItem.Subtitle>
									</ListItem.Content>
									<View>
										<Text >£ {(l.sale_price * l.qty).toFixed(2)}</Text>
									</View>
								</ListItem>
							</TouchableHighlight>
						))
					: 
						<View>
							<ActivityIndicator sizw="large" color={Colors.primary} />
						</View>
					}
				</ScrollView>
			</View>
		</MainScreen>
  	);
}

const styles = StyleSheet.create({
  cardSection: {
    height: heightToDp('20%'),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5%',
  },
  barSection: {
    height: heightToDp('4%'),
    backgroundColor: Colors.darkPurple,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  itemListSection: {
    flex: 1,
    // borderColor: Colors.redMaroon,
    // borderWidth: 4,
  },
  detailBar: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: heightToDp(2),
  },
  barText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: heightToDp(2),
  },
});
