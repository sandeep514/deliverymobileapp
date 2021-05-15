import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  Text,
  TextInput,
  Pressable
} from 'react-native';
import {Colors} from './../components/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem, Avatar, Header, Button, Input} from 'react-native-elements';
import MainScreen from '../layout/MainScreen';
import {useState, useEffect} from 'react';
import {getCartItemDetails, getVehicle, imagePrefix} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SaveOrder} from '../api/apiService';

const win = Dimensions.get('window');

let setTotalAmount = 0;
											let setUpdatedDataArray = [];
let currentSelectedId = '';
let currentSelectedLoadName = '';
let selectedVehicle = '';
let selectedRoute = '';
let selectedDriver = '';
let selectedBuyerId = '';
export default function AddQuantity({navigation}) {
  	const [data, setData] = useState();
  	// const [totalAmount, setTotalAmount] = useState();
	const [updatedData , setUpdatedData] = useState();

	useEffect(() => {
		
		selectedLoadedItemsByQty();
	} , [])
	function selectedLoadedItemsByQty() {
		AsyncStorage.getItem('selectedLoadedItemsByQty').then((data) => {
			getCartItemDetails(data).then((res) => {
				setData(res.data.data);
			});
		})
		AsyncStorage.getItem('selectedVehicleNo').then((vehNo) => {
			selectedVehicle = vehNo;
			AsyncStorage.getItem('user_id').then((driverId) => {
				selectedDriver = driverId;
				AsyncStorage.getItem('selectedRoute').then((route) => {
					selectedRoute = route;
					AsyncStorage.getItem('selectedBuyerRouteId').then((buyerid) => {
						selectedBuyerId = buyerid;
					})
				})
			})
		})
	}

	function generateRandString(){
	    return (Math.random() * (9999 - 1) + 1).toFixed(0);
	}
	
	function SaveOrders(){
		console.log(setUpdatedDataArray);
		SaveOrder(JSON.stringify(setUpdatedDataArray)).then((res) => {
			AsyncStorage.setItem('orderSaveReponce', JSON.stringify(res.data.data));
		})
	}

	return (
		<MainScreen>
			<View style={{flex:1}}>
				<View style={{flex: 1}}>
					<ScrollView>
						{(data != undefined)?
							Object.values(data).map((value , key) => {
								{currentSelectedLoadName = Object.keys(value)[0]}
								return (
									<View key={generateRandString()}>
										{Object.values(value).map((val , k) => {
											{currentSelectedId = val.id}
											{setUpdatedDataArray.push({"dnum":currentSelectedLoadName,"route":selectedRoute,"vehicle":selectedVehicle,"driver":selectedDriver,"buyer":selectedBuyerId,"sitem":currentSelectedId,"qty":val.order_qty,"credit":"NO","sale_price":val.sale_price})}
											return(
												<View style={styles.mainBox} key={generateRandString()}>
													<View style={styles.itemBox} key={generateRandString()}>
														<Image source={{uri:imagePrefix+''+val.img}} style={{width: 50, height: 55, marginRight: 8}} />
														<View key={generateRandString()}>
															<Text key={generateRandString()} style={{ fontSize: 15, fontWeight: 'bold', }} allowFontScaling={false}>
																{((val.name).substring(0 , 10))}..
															</Text>
				
															<Text style={{fontSize: 10}} allowFontScaling={false}> Available Stock </Text>
														</View>
													</View>
				
													<View key={generateRandString()} style={{flex: 0.8,justifyContent: 'space-around',flexDirection: 'row',alignItems: 'center',borderColor: 'black',height: 90 }}>
														<View key={generateRandString()} style={styles.buttonBox}>
															<Button icon={<Icon name="plus" size={20} color="white" />} buttonStyle={styles.plusButton} />
															<Button icon={<Icon name="minus" size={20} color="white" />} buttonStyle={styles.minisButton} />
														</View>
													</View>
				
													<View key={generateRandString()} style={styles.inputBox}>
														<TextInput placeholder="Qty" value={(val.order_qty).toString()} style={styles.textInput} placeholder="QTY" />
														<TextInput placeholder="Price" value={val.sale_price} style={styles.textInput} placeholder="PRICE" />
														<Text style={{display: 'none'}}>{setTotalAmount = (setTotalAmount + (val.order_qty * val.sale_price) )}</Text>
													</View>
												</View>
											)
										})}
									</View>
								)
							})
						:
							<View></View>
						}
					</ScrollView>
				</View>
				<View style={{borderTopColor: 'lightgrey' , borderTopWidth: 1}}>
					<Pressable style={{padding: 16,backgroundColor:Colors.primary}}><Text style={{textAlign: 'center',color: 'white',fontSize: 20}} onPress={() => { SaveOrders() }}>Save Order {setTotalAmount}</Text></Pressable>
				</View>
			</View>
		</MainScreen>
	);
}

const styles = StyleSheet.create({
  vehicleImage: {width: 50, height: 50, resizeMode: 'contain'},
  plusButton: {
    position: 'relative',
    backgroundColor: Colors.parrotGreen,
    alignSelf: 'center',
  },
  minisButton: {
    position: 'relative',
    backgroundColor: Colors.redMaroon,
    alignSelf: 'center',
  },
  mainBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: 'red',
    height: 90,
    paddingHorizontal: 5,
  },
  itemBox: {
    flex: 1.3,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignItems: 'center',
    borderColor: 'blue',
    height: 90,
  },
  buttonBox: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'dodgerblue',
    height: 90,
  },
  textInput: {
    borderColor: Colors.purple,
    borderWidth: 1,
    width: 50,
  },
});
