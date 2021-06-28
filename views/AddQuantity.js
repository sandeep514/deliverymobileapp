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
	import {getCartItemDetails, getVehicle, imagePrefix, showToast} from '../api/apiService';
	import AsyncStorage from '@react-native-async-storage/async-storage';
	import {SaveOrder} from '../api/apiService';
	import { ActivityIndicator ,Modal,Keyboard} from 'react-native';
	import { useRef } from 'react';
	import { CheckBox } from 'react-native-elements'
	
	const win = Dimensions.get('window');

	let setTotalAmount = 0;
	let totalAmountVatWithout = 0;
	let totalAmountVat = 0;
	let setUpdatedDataArray = [];
	let currentSelectedId = '';
	let VATUpdatedStatus = [];
	let currentSelectedLoadName = '';
	let Vsta = '';
	let selectedVehicle = '';
	let selectedRoute = '';
	let selectedDriver = '';
	let selectedBuyerId = '';
	let valuetem = '';

	let updatedValue= '';
	let initalPaymentStatus = 'cash';
	export default function AddQuantity({navigation}) {
		const [data, setData] = useState({});
		// const [totalAmount, setTotalAmount] = useState(0);
		const [loadedData , setLoadedData] = useState();
		const [updatedData , setUpdatedData] = useState();
		const [creaditStatus , setCreditStatus] = useState(initalPaymentStatus);
		const [loadedActivityIndicator , setLoadedActivityIndicator] = useState(false);
		const [ActInd , setActInd] = useState(false);
		const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
		const [vatStatu , setVATstatus] = useState(false);
		const [ hasNonVatProducts ,setHasNonVatProducts ] = useState(false);
		const [ hasVatProducts ,setHasVatProducts ] = useState(false);
	  	const [toggleCheckBox, setToggleCheckBox] = useState(false)
	  	const [vatStatusForProducts, setVATstatusForProducts] = useState()
	  	const [IsKeyboardOpen, setIsKeyboardOpen] = useState(false)
	  	const [modalVisible, setModalVisible] = useState(false);
	  	const [MyTotalPrice, setMyTotalPrice] = useState(0);
		const [hasUndeliveredItems , setHasUndeliveredItems] = useState(true);

		let undeliveredItems = {"LOAD-20-03-2021-246__134":{"value":5,"cardId":134,"VATstatus":false},"LOAD-20-03-2021-246__311":{"value":6,"cardId":311,"VATstatus":false}};


		  const ref_input2 = useRef();


		useEffect(() => {
			totalAmountVatWithout = 0;
			totalAmountVat = 0;
			selectedLoadedItemsByQty();
			
			// return () => { 
				// 	// AsyncStorage.removeItem('finalItems');
				// 	setUpdatedDataArray = [];
				// 	// AsyncStorage.setItem('finalItems' , JSON.stringify({}))
				// }
				return () => {
					totalAmountVatWithout = 0;
					totalAmountVat = 0;
					setUpdatedDataArray = [];
			}
		} , [])
		
		function selectedLoadedItemsByQty() {
			AsyncStorage.setItem('undeliveredItems' , JSON.stringify(undeliveredItems));

			setLoadedActivityIndicator(true)
			
			AsyncStorage.getItem('VATStatus').then((data) => {
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
					
					for(let i = 0; i < productData.length ; i++){
						let myData = Object.values(productData)[i]; 

						if( Object.values(myData)[0]['itemcategory'] == 'EGGS' || Object.values(myData)[0]['itemcategory'] == 'eggs' ){
							setHasNonVatProducts(true);
						}else{
							setHasVatProducts(true);
						}
					}

					setData(productData);
					let price = 0;
					for(let i = 0; i < productData.length ; i++){
						let myData = Object.values(productData)[i];
						let myNewData = Object.values(myData)[0]
						if( myNewData['VATstatus'] == true ){
							price = price + ((myNewData['sale_price'] * myNewData['order_qty'])*1.20) ;
						}else{
							price = price + (myNewData['sale_price'] * myNewData['order_qty'])  ;
						}
					}
					setMyTotalPrice(price);
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

			// AsyncStorage.getItem('itemsForVAT').then((res) => {
			// 	let VATDataRecieved = JSON.parse(res);
			// 	setVATstatusForProducts( VATDataRecieved);
			// })
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

		function showConfirmationModel(){
			setModalVisible(true);
		}

		function SaveOrders(){	
			setModalVisible(!modalVisible)		
			if( IsKeyboardOpen){
				Keyboard.dismiss();
			}else{
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
							showToast('Order has been placed successfully')
							navigation.navigate('PDFmanager');
						})
					})
	
				})
			}

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

		function updateVATStatusOfProduct(dnum , itemId){
			totalAmountVatWithout = 0;
			totalAmountVat = 0;

			let myData = Object.values(data);		
			AsyncStorage.getItem('selectedLoadedItemsByQty').then((res) => {
				let objectData = JSON.parse(res);
				if( dnum+'__'+itemId in objectData){
					if(objectData[dnum+'__'+itemId]['VATstatus'] == false){
						objectData[dnum+'__'+itemId]['VATstatus'] = true;
					}else{
						objectData[dnum+'__'+itemId]['VATstatus'] = false;
					}

					if(VATUpdatedStatus.includes(dnum+'__'+itemId)){
						VATUpdatedStatus.pop(dnum+'__'+itemId);
					}else{
						VATUpdatedStatus.push(dnum+'__'+itemId);
					}

					AsyncStorage.setItem('selectedLoadedItemsByQty' ,JSON.stringify(objectData));
					AsyncStorage.setItem('itemsForVAT' , JSON.stringify(VATUpdatedStatus))
					setVATstatusForProducts( VATUpdatedStatus);
				}
			});
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum].id == itemId){
					if(myData[i][dnum].VATstatus == false){
						myData[i][dnum].VATstatus = true;
					}else{
						myData[i][dnum].VATstatus = false;
					}
					setData(myData);
				}
			}
			let price = 0;
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum]['VATstatus'] == true ){
					price = price + ((myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])*1.20) ;
				}else{
					price = price + (myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])  ;
				}
			}
			setMyTotalPrice(price);
		}

		function updateQty(dnum , itemId , qty ){
			console.log(dnum , itemId , qty);
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
			let price = 0;
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum]['VATstatus'] == true ){
					price = price + ((myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])*1.20) ;
				}else{
					price = price + (myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])  ;
				}
			}
			setMyTotalPrice(price);
			setIsKeyboardOpen(false)
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
			let price = 0;
			for( let i= 0 ; i < myData.length; i++ ){
				if( myData[i][dnum]['VATstatus'] == true ){
					price = price + ((myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])*1.20) ;
				}else{
					price = price + (myData[i][dnum]['sale_price'] * myData[i][dnum]['order_qty'])  ;
				}
			}
			setMyTotalPrice(price);
			setIsKeyboardOpen(false)
			
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
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={{fontSize: 17,paddingHorizontal: 10}}>You are about to place the order, you will not able to edit this order.</Text>
								<View style={{flexDirection: 'row',width : '90%',marginTop: 10 ,justifyContent: 'space-between'}}>
									<Pressable
										style={[styles.button, styles.buttonClose]}
										onPress={() => setModalVisible(!modalVisible)}
									>
										<Text style={{backgroundColor: 'red' , borderRadius: 2,color: 'white',paddingVertical: 10 ,paddingHorizontal: 13,elevation: 5}}>Cancel</Text>
									</Pressable>
									<Pressable
										style={[styles.button, styles.buttonClose]}
										onPress={() => SaveOrders() }
									>
										<Text style={{backgroundColor:Colors.primary , borderRadius: 2,color: 'white',paddingVertical: 10 ,paddingHorizontal: 13,elevation: 5}}>Continue</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Modal>


					{/* {( vatStatu != 'true'  && hasVatProducts) ?
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
					} */}

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
										<View key={generateRandString()}>
											{Object.values(value).map((val , k) => {
												{currentSelectedId = val.id}
												{valuetem = (val.order_qty).toString()}
												{setTotalAmount = (parseFloat(setTotalAmount) + parseFloat(valuetem * val.sale_price) )}
												
												{(selectedBuyerId != '') ? setUpdatedDataArray.push({'VATStatus' : val.VATstatus ,"dnum":currentSelectedLoadName,"route":selectedRoute,"vehicle":selectedVehicle,"driver":selectedDriver,"buyer":selectedBuyerId,"sitem":currentSelectedId,"qty":val.order_qty,"credit":"NO","sale_price":val.sale_price}) : ''}
												return(
													<View style={(win.width > 500) ? styles.mainBoxTab : styles.mainBox } key={generateRandString()}>
														<View style={styles.itemBox} key={generateRandString()}>
															{(val.itemcategory != "EGGS") ? 	
																<Pressable onPress={() => {  updateVATStatusOfProduct(currentSelectedLoadName ,val.id ) }}>
																	<CheckBox
																		checked={val.VATstatus}
																		onPress={() => {  updateVATStatusOfProduct(currentSelectedLoadName ,val.id ) }}
																	/>
																</Pressable>
															:
																<View style={{width: 60}} ></View>
															}
															<Image source={{uri:imagePrefix+''+val.img}} style={( win.width > 500 ) ? {width: 50, height: 55, marginRight: 8} : {width: 40, height: 45, marginRight: 8} } />
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

															<TextInput keyboardType="numeric" placeholder="Qty" defaultValue={valuetem} ref={(value) => {}} style={styles.textInput}
															onPressIn={() => { setIsKeyboardOpen(true) }}
															onEndEditing={(value) => { updateQty(currentSelectedLoadName ,val.id , value.nativeEvent.text) } }/>

															<TextInput keyboardType="numeric" placeholder="Price" defaultValue={val.sale_price} style={styles.textInput} 
															onPressIn={() => { setIsKeyboardOpen(true) }}
															onEndEditing={(value) => { updatePrice(currentSelectedLoadName ,val.id , value.nativeEvent.text) } } />

															<Text style={{ minWidth:70,paddingHorizontal: 10,paddingVertical: 15,backgroundColor: '#ededed',borderWidth: 1 , borderColor: Colors.primary }}>{ (valuetem * val.sale_price).toFixed(2) }</Text>

															<Text style={{ minWidth:40,paddingHorizontal: 10,paddingVertical: 15,backgroundColor: '#ededed',borderWidth: 1 , borderColor: Colors.primary }}>
																{( val.VATstatus == true )?
																	<View>
																		<Text>
																			{( ((valuetem * val.sale_price) *1.20) - (valuetem * val.sale_price) ).toFixed(2)}
																		</Text>
																	</View>
																:
																	<Text>0</Text>
																}
															</Text>
															<Text style={{ minWidth:40,paddingHorizontal: 10,paddingVertical: 15,backgroundColor: '#ededed',borderWidth: 1 , borderColor: Colors.primary }}>
																{( val.VATstatus == true )?
																	<View>
																		<Text>
																			{(  (((valuetem * val.sale_price) *1.20) - (valuetem * val.sale_price)) + (valuetem * val.sale_price) ).toFixed(2)}
																		</Text>
																	</View>
																:
																	<Text>{ (valuetem * val.sale_price).toFixed(2)}</Text>
																}
															</Text>

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
						
						{(saveOrderActivIndictor == true) ?
							<View style={{backgroundColor: Colors.primary,textAlign: 'center',width: '100%'}}>
								<Text style={{textAlign: 'center'}}><ActivityIndicator size="large" color="white"></ActivityIndicator></Text>
							</View>
						:
							<Pressable style={{padding: 16,backgroundColor:Colors.primary,flexDirection: 'row',justifyContent: 'center'}}><Text style={{textAlign: 'center',color: 'white',fontSize: 20}} onPress={() => { showConfirmationModel() }}> Place order and print invoice £{(parseFloat(MyTotalPrice) ).toFixed(2)} </Text>
							</Pressable>
						}
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
	mainBoxTab: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		borderColor: 'red',
		height: 90,
		paddingHorizontal: 5,
	},
	mainBox: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		borderColor: 'red',
		height: 130,
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
	 checkbox: {
		alignSelf: "center",
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
		height: 120,
		marginRight: 25
	},
	textInput: {
		borderColor: Colors.purple,
		borderWidth: 1,
		width: 60,
		color: '#000',
		textAlign: 'center'
	},
	textInputTab: {
		borderColor: Colors.purple,
		borderWidth: 1,
		width: 60,
		color: '#000',
		textAlign: 'center'
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