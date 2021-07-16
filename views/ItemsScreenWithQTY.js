import React , { useEffect , useState} from 'react';
import { ActivityIndicator } from 'react-native';
import {View, Text, StyleSheet ,TextInput } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { getItemsByVehicleAndLoads, imagePrefix, checkIfBuyerHasVAT } from '../api/apiService';
import {Colors} from '../components/Colors';
import ItemCard from '../components/ItemCard';
import MainScreen from '../layout/MainScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
let itemList = [
	
];
export default function ItemsScreenWithQty({navigation}) {
	const [activeIndicatorLoader , setActiveIndicatorLoader] = useState(true);
	const [ListItems , setListItems] = useState();
	const [requestSent , setRequestSent] = useState(false);
	const [hasUndeliveredItems , setHasUndeliveredItems] = useState(false);
	// const [listUndelivered , setListUndelivered] = useState();

	
	useEffect(() => {
		AsyncStorage.getItem('cartItems').then((data) => {
		// 	let myRecords = {};
		// 	let myRecordsFinal = {};
		// 	let relData = JSON.parse(data);
		// 	if( data != undefined ){
		// 		for(let i = 0 ; i < relData.length; i++){

		// 			let dnum = relData[i].dnum;
		// 			let sitem = relData[i].sitem;
		// 			let qty = relData[i].qty;

		// 			myRecords[relData[i].dnum+'_'+relData[i].sitem] = qty;
		// 			myRecordsFinal[relData[i].dnum+'__'+relData[i].sitem] = {'value' : JSON.parse(qty) , 'cardId' :relData[i].sitem,'VATstatus': false };
		// 			AsyncStorage.setItem('selectedLoadedItemsByQty' , JSON.stringify(myRecordsFinal))
		// 			AsyncStorage.setItem('itemsAddedInCart' , JSON.stringify(myRecords))
		// 		}
		// 	}
		})
		AsyncStorage.getItem('user_id').then((userId) => {
			if( userId != 13 && userId != '13'){
				// setHasUndeliveredItems(true);
				// let undeliveredItems = {"LOAD-20-03-2021-246__134":{"value":5,"cardId":134,"VATstatus":false},"LOAD-20-03-2021-246__311":{"value":6,"cardId":311,"VATstatus":false}};
				// AsyncStorage.setItem('undeliveredItems' , JSON.stringify(undeliveredItems));
			}
		});
		
		// setListUndelivered(undeliveredItems)
		
		AsyncStorage.setItem('selectedLoadedItemsByQty',JSON.stringify({}));

		AsyncStorage.getItem('selectedBuyerRouteId').then((buyerId) => {
			checkIfBuyerHasVAT(buyerId).then((res) => {

				// AsyncStorage.setItem('currentVATstatus' , status);
				AsyncStorage.setItem('VATStatus' , (res.data.message).toString());
			});
		})
		getItems();
	} , []);
	
	function getItems () {
		AsyncStorage.getItem('selectedVehicleNo').then((value) => { 
			let vehicheId = value;
			AsyncStorage.getItem('selectedLoadsNumbers').then((value) => { 
				let load_numbers = value;
				getItemsByVehicleAndLoads( vehicheId , load_numbers).then((res) => {
					setListItems(res.data.data);
					setActiveIndicatorLoader(false);
				} ,(err) => {
					setActiveIndicatorLoader(false);
				});
			});
		});
	}
	const updateCart= (status) =>{
		setHasUndeliveredItems(false);
		AsyncStorage.setItem('UndeliveredItemsInCart' , status );
	}

	return (
		<MainScreen>
			<ScrollView vertical="true" >
				{/* <Modal
						animationType="slide"
						transparent={true}
						visible={hasUndeliveredItems}
						onRequestClose={() => {
							setModalVisible(!hasUndeliveredItems);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={{fontSize: 17,paddingHorizontal: 10}}>You have some undeliverd items , would you like to add them in cart.?</Text>
								<View style={{flexDirection: 'row',width : '90%',marginTop: 10 ,justifyContent: 'space-between'}}>
									<Pressable
										style={[styles.button, styles.buttonClose]}
										onPress={() =>  updateCart('no')}
									>
										<Text style={{backgroundColor: 'red' , borderRadius: 2,color: 'white',paddingVertical: 10 ,paddingHorizontal: 13,elevation: 5}}>No</Text>
									</Pressable>
									<Pressable
										style={[styles.button, styles.buttonClose]}
										onPress={() => updateCart('yes') }
									>
										<Text style={{backgroundColor:Colors.primary , borderRadius: 2,color: 'white',paddingVertical: 10 ,paddingHorizontal: 13,elevation: 5}}>Yes</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Modal> */}
				{(activeIndicatorLoader == true) ? 
					<ActivityIndicator size="large" color="#6c33a1" />
				:
					<Text></Text>
				}
				{(ListItems != undefined) ?
					Object.keys(ListItems).map((key , value) => {
						return (
							<View key={key} style={{marginBottom: 85}}>
								<Text style={{fontSize: 18,paddingLeft: 30, backgroundColor: Colors.primary,color: 'white',textAlign: 'center',paddingVertical: 5,marginLeft: 10}}>{key}</Text>
								{Object.keys(ListItems[key]).map(( k , v) => {
									return (
										<View key={k}>
											<Text key={k} style={{paddingHorizontal: 13,paddingVertical: 10,backgroundColor: '#ededed' ,fontSize: 18,marginTop: 15}}>{k}</Text>
											<View key={v} style={{flex: 1, flexDirection: 'row',flexWrap: 'wrap',justifyContent : 'space-evenly'}}>
												{Object.keys(ListItems[key][k]).map((ke ,val) => {
													return(
														<ItemCard  key={ke} qty="true" backgroundColor="#fff" loadName={key} cardId={ListItems[key][k][ke].id} cardName={ListItems[key][k][ke].name} imageUrl={imagePrefix+''+ListItems[key][k][ke].img} />
													)
												})}
											</View>
										</View>
									)
								})}
							</View>
						)
					})
				:
					<Text></Text>
				}
			</ScrollView>
			<Pressable 	
				onPress={() => { 
					AsyncStorage.getItem('selectedLoadedItemsByQty').then( (value) => {
						if( Object.keys(JSON.parse(value)).length > 0 ){
							// AsyncStorage.getItem('UndeliveredItemsInCart').then((res) => {
							// 	if( res =='yes' ){
							// 		AsyncStorage.getItem('undeliveredItems').then((undeliveredItems) => {
							// 		})
							// 	}
							// })
							navigation.navigate('AddQuantity');
						}else{
							alert("No item selected.");
						}

					}) 
				}} style={{bottom : 10, position: 'absolute',justifyContent : 'center',padding:10 ,height: 70, width: 70,backgroundColor: Colors.primary,borderRadius: 100, right : 10}}
			>
				<Icon name='arrow-right' type='font-awesome' style={{fontSize: 25,color: 'white', textAlign: 'center'}} />
			</Pressable>
		</MainScreen>
	);
}

const styles = StyleSheet.create({
	itemsContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		backgroundColor: Colors.white,
		padding: 8,
	},
  	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// marginTop: 22
	},
	 modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		height: 130,
		width: "90%",
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
