import React, {useEffect , useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable , TextInput } from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../components/Colors';
import {widthToDp, heightToDp} from '../utils/Responsive';

let selectedLoadArray = {};
export default DashboardCard = ({ backgroundColor, cardName, imageUrl, onPress, styleData, qty, cardId ,loadName }) => {
	const [ UpdateQtyofItem , setUpdateQtyofItem] = useState({});
	const [ UpdateQtyofItems , setUpdateQtyofItems] = useState(0);
	function getinputValue(loadName , cardId , value){
		selectedLoadArray[loadName+'__'+cardId] = {'value' : value ,'cardId' : cardId}; 
	}
	function addQtyItem(loadName , cardId){
		let loadedName = loadName+'__'+cardId;

		if( selectedLoadArray[loadedName] != undefined ){
			selectedLoadArray[loadedName].value = (selectedLoadArray[loadedName].value+1);
		}else{
			selectedLoadArray[loadName+'__'+cardId] = {'value' : 1 ,'cardId' : cardId};
		}
		setUpdateQtyofItem(selectedLoadArray)
		// console.log('====================================');
		let value = (UpdateQtyofItem[loadName+'__'+cardId] != undefined) ? (UpdateQtyofItem[loadName+'__'+cardId].value).toString() : '0'
		// console.log(UpdateQtyofItem);
		// console.log('====================================');

	
		console.log('====================================');
		console.log(value);
		console.log('====================================');
	}

	return (
		(qty == false) ?			
			<Pressable
				onPress={onPress}
				style={[styles.cardBackground, {backgroundColor: backgroundColor} , styleData]}>
				<View style={styles.itemImageContainer}>
					<Image source={{uri:imageUrl}} style={styles.itemImage} />
				</View>

				<View style={styles.cardFooterBackground}>
					<Text style={styles.cardName} allowFontScaling={false}>
					{cardName}
					</Text>
				</View>
			</Pressable>
		: 
		<Pressable onPress={onPress} style={[styles.cardBackground, {backgroundColor: backgroundColor,height: 225} , styleData]}>
				<Text>{(UpdateQtyofItem[loadName+'__'+cardId] != undefined) ? (UpdateQtyofItem[loadName+'__'+cardId].value).toString() : '0' }</Text>
				<View style={styles.itemImageContainer}>
					<Image source={{uri:imageUrl}} style={styles.itemImage} />
					<Text style={styles.cardName ,{height: 'auto',fontSize: 14,marginTop: 6,marginBottom: 6}} allowFontScaling={false}>
						{ ((cardName).length > 20) ? 
							(((cardName).substring(0,20-3)) + '...') : 
							cardName }
					</Text>
				</View>
				<View style={{flex:1 ,flexDirection: 'row', backgroundColor: '#ebedf087',width: '100%' }} >
					<View >
						<Pressable onPress={ () => { addQtyItem( loadName , cardId ) } } style={{backgroundColor: Colors.primary,padding: 8}}>
							<Icon name='plus' type='font-awesome' style={{fontSize: 25,color: 'white', textAlign: 'center'}} />
						</Pressable>
					</View>
					<View style={{width: 87}}>
						<TextInput value={ (UpdateQtyofItem[loadName+'__'+cardId] != undefined) ? (UpdateQtyofItem[loadName+'__'+cardId].value).toString() : '0' } key={cardId} onChangeText={(value) => { getinputValue( loadName , cardId , value ) }} placeholder="Qty" style={{textAlign: 'center'}} />
					</View>
					<View style={{backgroundColor: 'red',padding: 8}}>
						<Icon name='minus' type='font-awesome' style={{fontSize: 25,color: 'white', textAlign: 'center'}} />
					</View>
				</View>
			</Pressable>
	);
};

const styles = StyleSheet.create({
	cardName: {
		color: Colors.dark,
		fontWeight: 'bold',
		fontSize: heightToDp('1.7%'),		
	},
	cardFooterBackground: {
		backgroundColor: '#ebedf087',
		height: 40,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10,
		flexDirection: 'row',
		padding: 8,
	},
	iconBackground: {
		alignItems: 'center',
		backgroundColor: Colors.secondry,
		height: 60,
		width: 60,
		resizeMode: 'stretch',
		position: 'absolute',
		top: 15,
		justifyContent: 'center',
		borderRadius: 100,
	},
	cardBackground: {
		width: widthToDp('40%'),
		height: heightToDp('25%'),
		borderRadius: 8,
		marginTop: 15,
		marginHorizontal: 5,
		alignItems: 'center',
		elevation: 10,
		overflow: 'hidden',
	},
	itemImage: {
		// flex: 1,
		height: heightToDp('19.7%'),
		width: widthToDp('40%'),
		// resizeMode: 'contain',
	},
	itemImageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	
});