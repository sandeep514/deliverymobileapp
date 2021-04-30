import React, {useState, useEffect} from 'react';
import {create} from 'apisauce';

import {StyleSheet, Text, View} from 'react-native';
import MainScreen from '../layout/MainScreen';
import {heightToDp, widthToDp} from '../utils/Responsive';
import {Colors} from '../components/Colors';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { getSavedNotes, getVehicle ,SaveVehicleNotes } from '../api/apiService';
import {ListItem} from 'react-native-elements';
import { Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native';

let arrayComments = [];
const VehicleScreen = ({navigation}) => {
	const [loader  , setloader] = useState(false);
	const [comment  , setComment] = useState();
	const [comments  , setComments] = useState();
	const [newComment  , setNewComment] = useState();

	const initialState = {
	};
	useEffect(() => {
		let isMounted = true;
		if(comments == undefined){
			getSavedNote()
		}
	}, []);

	function getSavedNote() {
		getSavedNotes().then((res) => {
			setComments(res.data.data.comments);
			arrayComments = res.data.data.comments;
		} , (err) => {
			
		});
	}

	function postNewComment (value) {
		setNewComment(value);
	}
	
	function storeCommentInStorage() {
		setloader(true)
		
		let PreviousComment = comments;
		PreviousComment.push(newComment);
		let finalCommentPost = [newComment].concat(PreviousComment);
		if( finalCommentPost != '' && finalCommentPost != null && finalCommentPost != undefined){
			SaveVehicleNotes(finalCommentPost).then((res) => {
				setloader(false)
				getSavedNote()
				setComment();
			} , (err) => {
				setloader(false)
			});
		}
	}
	
	return (
		<MainScreen>
			<KeyboardAwareScrollView>
				<View style={styles.inputContainerBox}>

					<View style={styles.inputContainer}>
						<Input
							value={comment}
							onChangeText={(value) => {
								postNewComment(value);
							}} 
							placeholder="Write Comment" 
							leftIcon={ <Icon name="pencil-square-o" size={24} 
							color={Colors.primary} /> } 
							allowFontScaling={false} 
						/>
					</View>

					<View style={styles.buttonContainer}>
						<Pressable 	style={[
											styles.buttonStyle,
											{
												backgroundColor: Colors.primary,
											},
										]}
										onPress={() => {
											storeCommentInStorage();
										}}
									>
							<Text style={{color: 'white' , textAlign: 'center'}}>{ (loader == true) ? <ActivityIndicator color="white" size="small"></ActivityIndicator> : 'Add Note'}</Text>
						</Pressable>
					</View>
				</View>

				<View style={styles.barSection}>
					<Text style={styles.detailBar} allowFontScaling={false}>
						Notes
					</Text>
					{/* <Text style={styles.barText} allowFontScaling={false}>
						Total : 0$
					</Text> */}
				</View>

				<ScrollView vertical={true}>
					<View style={styles.listBox}>
						{( comments != undefined && comments != null ) ?				
							Object.values(comments).map((k ,v) => {
								return <Text key={v} style={{padding: 20,fontSize: 20,borderBottomColor: '#ededed', borderBottomWidth: 2}}>{k}</Text>
							}) 
						:
							<Text style={{textAlign: 'center'}}> <ActivityIndicator color={Colors.primary} size="large"></ActivityIndicator> </Text>
						}
					</View>
				</ScrollView>
			</KeyboardAwareScrollView>
		</MainScreen>
	);
};

const styles = StyleSheet.create({
  inputContainerBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: heightToDp(1),
  },
  inputContainer: {
    width: '90%',
    marginVertical: heightToDp(2),
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
  listBox: {
    flex: 3,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    maxHeight: heightToDp(15),
    marginHorizontal: widthToDp(2),
  },
  buttonStyle: {
    width: widthToDp(20),
    paddingVertical: 15,
    height: heightToDp(7),
    borderRadius: 10,
    marginVertical: heightToDp(1),
  },
});

export default VehicleScreen;
