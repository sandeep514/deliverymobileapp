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
	import { ActivityIndicator ,Modal} from 'react-native';
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
	let valuetem = '';

	let updatedValue= '';
	let initalPaymentStatus = 'cash';
	export default function AddQuantity({navigation}) {
		const [data, setData] = useState();
		// const [totalAmount, setTotalAmount] = useState();
		const [loadedData , setLoadedData] = useState();
		const [updatedData , setUpdatedData] = useState();
		const [loadedActivityIndicator , setLoadedActivityIndicator] = useState(false);
		const [ActInd , setActInd] = useState(false);
		const [creaditStatus , setCreditStatus] = useState(initalPaymentStatus);
		const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
		const [vatStatu , setVATstatus] = useState(false);
		const [ hasNonVatProducts ,setHasNonVatProducts ] = useState(false);
		const [ hasVatProducts ,setHasVatProducts ] = useState(false);
		const ref_input2 = useRef();

		useEffect(() => {
			selectedLoadedItemsByQty();
			
		} , [])
		
		function selectedLoadedItemsByQty() {
			setLoadedActivityIndicator(true)
			
			AsyncStorage.getItem('VATStatus').then((data) => {
				console.log(typeof data);
				if( data == 'true' ){
					AsyncStorage.setItem('currentVATstatus' , '1');
				}else{
					AsyncStorage.setItem('currentVATstatus' , '0');
				}

				setVATstatus(data);
			});

			AsyncStorage.getItem('selectedLoadedItemsByQty').then((data) => {
				setLoadedData(JSON.parse(data));
				getCartItemDetails(data).then((res) => {
					let productData = res.data.data;
					console.log( Object.values(productData).length );

					for(let i = 0; i < productData.length ; i++){
						let myData = Object.values(productData)[i]; 

						if( Object.values(myData)[0]['itemcategory'] == 'EGGS' || Object.values(myData)[0]['itemcategory'] == 'eggs' ){
							setHasNonVatProducts(true);
						}else{
							setHasVatProducts(true);
						}
					}

					setData(productData);
					setLoadedActivityIndicator(false)
				});
			});
			
			AsyncStorage.getItem('selectedVehicleNo').then((vehNo) => {
				selectedVehicle = vehNo;
				AsyncStorage.getItem('user_id').then((driverId) => {
					selectedDriver = driverId;
					AsyncStorage.getItem('selectedRoute').then((route) => {
						selectedRoute = route;
						AsyncStorage.getItem('selectedBuyerRouteId').then((buyerid) => {
							selectedBuyerId = buyerid;
						});
					});
				});
			});
		}

		function generateRandString(){
			return (Math.random() * (9999 - 1) + 1).toFixed(0);
		}

		function updateRecords(data){
			return new Promise( (resolve , reject) => {
				let processedData = {};

				for(let i = 0 ; i < data.length ; i++ ){
					if( processedData[data[i].dnum+'__'+data[i].sitem] != undefined){	
						if( data[i].qty > 0 ){
							processedData[ data[i].dnum+'__'+data[i].sitem ] = data[i];
						}else{
							delete processedData[ data[i].dnum+'__'+data[i].sitem ];
						}
					}else{
						if( data[i].qty > 0 ){
							processedData[ data[i].dnum+'__'+data[i].sitem ] = data[i];
						}else{
							delete processedData[ data[i].dnum+'__'+data[i].sitem ];
						}
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
				AsyncStorage.getItem('currentVATstatus').then((VATstatus) => {
					data.push({'has_vat' : parseInt(VATstatus)});
					
					SaveOrder(JSON.stringify(data)).then((res) => {
						setSaveOrderActivIndictor(false)
						AsyncStorage.setItem('orderSaveReponce', JSON.stringify(res.data.data));
						
						AsyncStorage.setItem('orderSaveBuyer', JSON.stringify(res.data.buyer));
						navigation.navigate('PDFmanager');
					})
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
			});
			if( qty != '' ){
				newQty = qty
			}
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum].id == itemId){
					myData[i][dnum].order_qty = newQty;
					
					setData(myData)
				}
			}
		}

		function updatePrice(dnum , itemId , value ){
			let myData = Object.values(data);
			let newQty = 0;
			
			AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
				let objectData = JSON.parse(res);
				if( dnum+'__'+itemId in objectData){
					objectData[dnum+'__'+itemId]['price'] = value;
					AsyncStorage.setItem('selectedLoadedItemsByQty' ,JSON.stringify(objectData));
				}
			});
			if( value != '' ){
				newQty = value
			}
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum].id == itemId){
					myData[i][dnum].sale_price = newQty;
					
					setData(myData)
				}
			}
			
		}

		function changeCreditStatus(status) {
			setCreditStatus(status)
		}

		function updateVATstatus( status ) {
			AsyncStorage.setItem('currentVATstatus' , status);
			if( status == '1' ){
				setVATstatus('true');
			}else{
				setVATstatus('false');
			}
		}

		return (
			<MainScreen>
				<View style={{flex:1}}>
					{( vatStatu != 'true'  && hasVatProducts) ?
						<View style={{ justifyContent: 'center' }} >
							<Modal
								animationType="slide"
								transparent={true}
								visible={true}
								onRequestClose={(  ) => {
									Alert.alert("Modal has been closed.");
								}} >

								<View style={styles.centeredView}>
									<View style={styles.modalView}>
										<Text style={ styles.modalText }>Some of the selected items are VAT related, would you like to show VAT in invoice?</Text>
										<View style={{ flexDirection: 'row', marginTop: 20 }}>

											<Pressable style={{ backgroundColor: 'red',color: 'white',paddingHorizontal: 30,paddingVertical: 15 }} onPress={() => {updateVATstatus("0")}} >
												<Text style={{color: 'white'}}>No</Text>
											</Pressable>

											<Pressable style={{ backgroundColor: Colors.primary,color: 'white',paddingHorizontal: 30,paddingVertical: 15,marginLeft: 40}} onPress={() => updateVATstatus("1") } >
												<Text style={{color: 'white'}}>Yes</Text>
											</Pressable>

										</View>
									</View>
								</View>

							</Modal>
						</View>
					:
						<View></View>
					}

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
								(data != undefined)?
								Object.values(data).map((value , key) => {
									{currentSelectedLoadName = Object.keys(value)[0]}
									return (
										<View key={key}>
											{Object.values(value).map((val , k) => {

												{currentSelectedId = val.id}
												{valuetem = (val.order_qty).toString()}

												{(selectedBuyerId != '') ? setUpdatedDataArray.push({"dnum":currentSelectedLoadName,"route":selectedRoute,"vehicle":selectedVehicle,"driver":selectedDriver,"buyer":selectedBuyerId,"sitem":currentSelectedId,"qty":val.order_qty,"credit":"NO","sale_price":val.sale_price}) : ''}
												return(
													<View style={styles.mainBox} key={key}>
														<View style={styles.itemBox} key={key}>
															<Image source={{uri:imagePrefix+''+val.img}} style={{width: 50, height: 55, marginRight: 8}} />
															<View key={key}>
																<Text key={key} style={{ fontSize: 15, fontWeight: 'bold', }} allowFontScaling={false}>
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
					
														<View key={key} style={styles.inputBox}>
															<TextInput keyboardType="numeric" placeholder="Qty" value={valuetem} ref={(value) => {}} style={styles.textInput} onChange={(value) => { updateQty(currentSelectedLoadName ,val.id , value.nativeEvent.text) } }/>

															<TextInput keyboardType="numeric" placeholder="Price" value={val.sale_price} style={styles.textInput} onChange={(value) => { updatePrice(currentSelectedLoadName ,val.id , value.nativeEvent.text) } } />
															<Text style={{ paddingHorizontal: 10,paddingVertical: 16,backgroundColor: '#ededed',borderWidth: 1 , borderColor: Colors.primary }}>{ (valuetem * val.sale_price).toFixed(2) }</Text>
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
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	 modalView: {
			margin: 20,
			backgroundColor: "white",
			borderRadius: 20,
			height: 130,
			width: "67%",
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
			justifyContent: 'center'
		},
	});