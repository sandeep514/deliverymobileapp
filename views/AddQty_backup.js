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
import { ActivityIndicator } from 'react-native';
import { useRef } from 'react';

const win = Dimensions.get('window');

let setTotalAmount = 0;
let setUpdatedDataArray = [];
let currentSelectedId = '';
let currentSelectedLoadName = '';
let selectedVehicle = '';
let selectedRoute = '';
let selectedDriver = '';
let selectedBuyerId = '';
let valuetem = {};

let updatedValue= '';
let initalPaymentStatus = 'cash';
let myNewDataFromApi = {};
export default function AddQty_backup({navigation}) {

  	const [data, setData] = useState();
  	// const [totalAmount, setTotalAmount] = useState();
	const [loadedData , setLoadedData] = useState();
	const [updatedData , setUpdatedData] = useState();
	const [loadedActivityIndicator , setLoadedActivityIndicator] = useState(false);
	const [ActInd , setActInd] = useState(false);
	const [creaditStatus , setCreditStatus] = useState(initalPaymentStatus);
	const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
	const [valueData , setValueData] = useState();
	const ref_input2 = useRef();

	useEffect(() => {
		selectedLoadedItemsByQty();
		return () => { setUpdatedDataArray = [] }
	} , [])

	function selectedLoadedItemsByQty() {
		setLoadedActivityIndicator(true)
		AsyncStorage.getItem('selectedLoadedItemsByQty').then((data) => {
			setLoadedData(JSON.parse(data));
			getCartItemDetails(data).then((res) => {
				setData(res.data.data);
				myNewDataFromApi = res.data.data;
				for(var i = 0 ; i < myNewDataFromApi.length ; i++){
					valuetem[ Object.keys(myNewDataFromApi[i])+'_'+Object.values(myNewDataFromApi[i])[0].id ] = Object.values(myNewDataFromApi[i])[0].order_qty;
					setValueData(valuetem);
				} 
				// setValueData(valuetem) 

				setLoadedActivityIndicator(false)
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

	function getUpdatedData(){
		AsyncStorage.getItem('selectedLoadedItemsByQty').then((data) => {
			getCartItemDetails(data).then((res) => {
				myNewDataFromApi = res.data.data;
			});
		})
	}

	function generateRandString(){
	    return (Math.random() * (9999 - 1) + 1).toFixed(0);
	}
	function updateRecords(data){
		return new Promise( (resolve , reject) => {
			let processedData = {};
			for(let i = 0 ; i < data.length ; i++ ){
				if( processedData[data[i].dnum+'__'+data[i].sitem] != undefined){
					processedData[ data[i].dnum+'__'+data[i].sitem ].qty = data[i].qty;
				}else{
					processedData[ data[i].dnum+'__'+data[i].sitem ] = data[i];
				}
			}
			resolve(Object.values(processedData))
		})
	}
	function SaveOrders(){
		setSaveOrderActivIndictor(true)
		AsyncStorage.setItem('finalItems' , JSON.stringify(setUpdatedDataArray));
		updateRecords(setUpdatedDataArray).then((res) => {
			let data = [];
	
			data.push(res)
			data.push({'type' : creaditStatus});
			SaveOrder(JSON.stringify(data)).then((res) => {
				setSaveOrderActivIndictor(false)
				AsyncStorage.setItem('orderSaveReponce', JSON.stringify(res.data.data));
				AsyncStorage.setItem('orderSaveBuyer', JSON.stringify(res.data.buyer));
				navigation.navigate('PDFmanager');
			})
		})

	}

	function updateWithNewQty(dnum , itemId , qty ){
		return new Promise((resolve , reject) => {
			AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
				let objectData = JSON.parse(res)

				for(let i = 0 ; i < Object.keys(objectData).length > 0 ;i++){
					let updatedId = dnum+'__'+itemId;
					objectData[updatedId].value = qty
				}
				AsyncStorage.setItem('selectedLoadedItemsByQty' , JSON.stringify(objectData))
				setActInd(true)

				resolve(true)
			});

		})
	}

	function updateQty(dnum , itemId , qty ){

		let myData = Object.values(data);
		let newQty = 0;
		
		AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
			let objectData = JSON.parse(res);
			if( dnum+'__'+itemId in objectData){
				objectData[dnum+'__'+itemId]['value'] = qty;
				AsyncStorage.setItem('selectedLoadedItemsByQty' ,JSON.stringify(objectData));
			}
			AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
			});
		});
		if( qty != '' ){
			newQty = qty
		}
		for( let i= 0 ; i < myData.length; i++ ){
			if( myData[i][dnum].id == itemId){
				myData[i][dnum].order_qty = newQty;
				getUpdatedData();
				// myNewDataFromApi = myData;
				// AsyncStorage.setItem('selectedLoadedItemsByQty' ,JSON.stringify(myData));
				// setData(myData)
			}
		}

		// ref_input2.current.focus()
		// AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
		// 	let objectData = JSON.parse(res);

		// 		if( dnum+'__'+itemId in objectData){

		// 			objectData[dnum+'__'+itemId]['value'] = qty;
		// 			// setData(data);
		// 			AsyncStorage.setItem('selectedLoadedItemsByQty' ,JSON.stringify(objectData));
		// 			AsyncStorage.getItem('selectedLoadedItemsByQty').then((data) => {
		// 				setLoadedData(JSON.parse(data));
		// 				getCartItemDetails(data).then((res) => {
		// 					setData(res.data.data);
		// 				});
		// 			})
		// 		}
		// })

		// for(let i = 0 ; i < data.length ; i++){
		// 	if( dnum in data[i]){
		// 		data[i][dnum]['order_qty'] = qty;
		// 		setData(data);
		// 	}
		// }
	}
	function changeCreditStatus(status) {
		setCreditStatus(status)
	}
	// function SaveOrders(){
    //     AsyncStorage.getItem('finalItems').then((res) => {
            
    //     })
        
	// }
	return (
		<MainScreen>
			<View style={{flex:1}}>
				{(ActInd == true) ?
					<View style={{ flex:1,position:'absolute',justifyContent:'center',height:'100%',width: '100%',backgroundColor: '#ededed',zIndex:9999,opacity: 0.5}} >
						<ActivityIndicator size="large" color={Colors.primary} />
					</View>
				:
					<View></View>
				}

				<View style={{flex: 0.06, justifyContent: 'center',flexDirection: 'row'}}>
					<View>
						<Pressable onPress={() => { setCreditStatus('cash') }} style={ (creaditStatus == 'cash') ? styles.activeStatus : styles.deActiveStatus }>
							<Text style={ (creaditStatus == 'cash') ? styles.activeStatusText : styles.deActiveStatusText }>
								CASH
							</Text>
						</Pressable>
					</View>
					<View>
						<Pressable onPress={() => { setCreditStatus('credit') }} style={ (creaditStatus == 'credit') ? styles.activeStatus : styles.deActiveStatus }>
							<Text style={ (creaditStatus == 'credit') ? styles.activeStatusText : styles.deActiveStatusText }>
								CREDIT
							</Text>
						</Pressable>
					</View>
					<View>
						<Pressable onPress={() => { setCreditStatus('bank') }} style={ (creaditStatus == 'bank') ? styles.activeStatus : styles.deActiveStatus }>
							<Text style={ (creaditStatus == 'bank') ? styles.activeStatusText : styles.deActiveStatusText }>
								BANK TRANSFER
							</Text>
						</Pressable>
					</View>
				</View>

				<View style={{flex: 1}}>
					<ScrollView>

						{( loadedActivityIndicator == true ) ? 
						<View>
							<ActivityIndicator color={Colors.primary} size="large" />
						</View>
							
						:
							(myNewDataFromApi != undefined)?
							Object.values(myNewDataFromApi).map((value , key) => {
								{currentSelectedLoadName = Object.keys(value)[0]}
								return (
									<View key={generateRandString()}>
										{Object.values(value).map((val , k) => {

											{currentSelectedId = val.id}

											{(selectedBuyerId != '') ? setUpdatedDataArray.push({"dnum":currentSelectedLoadName,"route":selectedRoute,"vehicle":selectedVehicle,"driver":selectedDriver,"buyer":selectedBuyerId,"sitem":currentSelectedId,"qty":val.order_qty,"credit":"NO","sale_price":val.sale_price}) : ''}
											return(
												<View style={styles.mainBox} key={generateRandString()}>
													<View style={styles.itemBox} key={generateRandString()}>
														<Image source={{uri:imagePrefix+''+val.img}} style={{width: 50, height: 55, marginRight: 8}} />
														<View key={generateRandString()}>
															<Text key={generateRandString()} style={{ fontSize: 15, fontWeight: 'bold', }} allowFontScaling={false}>
																{((val.name.length > 20) ? (val.name).substring(0 , 20)+'..'  : val.name )}
															</Text>
				
															<Text style={{fontSize: 10}} allowFontScaling={false}> Available Stock </Text>
														</View>
													</View>
				
													{/* <View key={generateRandString()} style={{flex: 0.8,justifyContent: 'space-around',flexDirection: 'row',alignItems: 'center',borderColor: 'black',height: 90 }}>
														<View key={generateRandString()} style={styles.buttonBox}>
															<Button icon={<Icon name="plus" size={20} color="white" />} buttonStyle={styles.plusButton} />
															<Button icon={<Icon name="minus" size={20} color="white" />} buttonStyle={styles.minisButton} />
														</View>
													</View> */}
				
													<View key={generateRandString()} style={styles.inputBox}>
														<TextInput id="here" keyboardType="numeric" placeholder="Qty" value={valueData[currentSelectedLoadName+'_'+val.id]} style={styles.textInput} placeholder="QTY" onChange={(value) => {
															let myNewData = {};
															for(var i = 0 ; i < Object.keys(valueData).length;i++){
																if( Object.keys(valueData)[i] == currentSelectedLoadName+'_'+val.id ){
																	myNewData[currentSelectedLoadName+'_'+val.id ] = value.nativeEvent.text;
																}else{
																	myNewData[Object.keys(valueData)[i] ] = Object.values(valueData)[i];
																}
																setValueData(myNewData)
															}

														 } }/>

														<TextInput placeholder="Price" value={val.sale_price} style={styles.textInput} placeholder="PRICE" />
														{/* <Text style={{ paddingHorizontal: 10,paddingVertical: 16,backgroundColor: '#ededed',borderWidth: 1 , borderColor: Colors.primary }}>{ (valuetem * val.sale_price) }</Text> */}

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
					<Pressable style={{padding: 16,backgroundColor:Colors.primary,flexDirection: 'row',justifyContent: 'center'}}><Text style={{textAlign: 'center',color: 'white',fontSize: 20}} onPress={() => { SaveOrders() }}>Proceed to place order</Text>
					{(saveOrderActivIndictor == true) ?
						<Text ><ActivityIndicator size="small" color="white"></ActivityIndicator></Text>
					:
						<View></View>
					}
					</Pressable>
					{/* {setTotalAmount} */}
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
    flex: 1.9,
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
	color: '#000'
  },
	activeStatus: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 18,
		borderRadius: 15,
		paddingVertical: 10,
		borderColor: Colors.primary ,
		borderWidth: 2
	},
	deActiveStatus: {
		paddingHorizontal: 18,
		borderRadius: 15,
		paddingVertical: 10,
		marginHorizontal: 10 ,
		borderColor: Colors.primary ,
		borderWidth: 2
	},
	activeStatusText: {
		color: 'white'
	},
	deActiveStatusText: {
		color: Colors.primary
	},
});
