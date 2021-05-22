import React , { useEffect , useState} from 'react';
import { ActivityIndicator } from 'react-native';
import {View, Text, StyleSheet ,TextInput } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { getItemsByVehicleAndLoads, imagePrefix } from '../api/apiService';
import {Colors} from '../components/Colors';
import ItemCard from '../components/ItemCard';
import MainScreen from '../layout/MainScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

let itemList = [
	
];
export default function ItemsScreenWithQty({navigation}) {
	const [activeIndicatorLoader , setActiveIndicatorLoader] = useState(true);
	const [ListItems , setListItems] = useState();
	const [requestSent , setRequestSent] = useState(false);

	useEffect(() => {
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


	return (
		<MainScreen>
			<ScrollView vertical="true" >
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
						console.log( JSON.parse(value) );
					}) 
					navigation.navigate('AddQuantity');
				}}
				style={{bottom : 10, position: 'absolute',justifyContent : 'center',padding:10 ,height: 70, width: 70,backgroundColor: Colors.primary,borderRadius: 100, right : 10}}
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
});
