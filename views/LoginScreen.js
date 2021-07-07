import React, {useState} from 'react';
import {Image,ImageBackground,StyleSheet,Text,View,ToastAndroid,Keyboard,Pressable,ActivityIndicator} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MainScreen from '../layout/MainScreen';
import {Colors} from './../components/Colors';
import {heightToDp, widthToDp} from '../utils/Responsive';
import {checkLogin} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function LoginScreen({navigation}) {
	const [ isLoaderActive ,setIsLoaderActive ] = useState(false);
	
	

	const formSubmitData = (data) => {
		if (data.username === '' || data.username === null) {
			showToast('Username Required !');
			return;
		}
		if (data.password === '' || data.password === null) {
			showToast('Password Required !');
			return;
		}
		setIsLoaderActive(true);
		checkLogin( data ).then((res) => {

			setIsLoaderActive(false);
			let response = res.data.data;

			AsyncStorage.setItem('user_address', response.address);
			AsyncStorage.setItem('user_contact_no', response.contact_no);
			AsyncStorage.setItem('user_dob', response.dob);
			AsyncStorage.setItem('user_doj', response.doj);
			AsyncStorage.setItem('user_email', response.email);
			AsyncStorage.setItem('user_id', JSON.stringify(response.id));
			AsyncStorage.setItem('user_licenseno', response.licenseno);
			AsyncStorage.setItem('user_name', response.name);
			AsyncStorage.setItem('user_username', response.username);
			AsyncStorage.setItem('printerName', response.printerName);
			
			navigation.navigate('Vehicle');			
		} , (err) => {
			setIsLoaderActive(false);
			showToast(err)
		});
	};
	const showToast = (message) => {
		ToastAndroid.showWithGravityAndOffset(message,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,20);
	};

	
	return (

		<Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>
			<MainScreen>
				<ImageBackground
					source={require('../assets/images/main_top_left.png')}
					style={styles.topImage}
					/>
				<Pressable onPress={Keyboard.dismiss}></Pressable>
				<View style={styles.innerContainer}>
					
					<View style={styles.containerElements}>
						<Text style={styles.loginHeading} allowFontScaling={false}>
							Login
						</Text>
						<KeyboardAwareScrollView>
							<Image source={require('../assets/images/login.png')} style={styles.logo} />
							<Formik
								initialValues={{username: 'vin', password: 'test'}}
								onSubmit={(values) => formSubmitData(values)}>
							{({handleChange, handleBlur, handleSubmit, values}) => (
								<View style={{width: '100%'}}>
									<View style={styles.inputContainer}>
										<Input
											placeholder="User Name"
											leftIcon={
										<Icon name="user" size={24} color={Colors.primary} />
										}
										allowFontScaling={false}
										onChangeText={handleChange('username')}
										// onBlur={handleBlur('username')}
										value={values.username}
										/>
										<Input
										placeholder="Password"
										leftIcon={
										<Icon name="lock" size={24} color={Colors.primary} />
										}
										secureTextEntry={true}
										allowFontScaling={false}
										onChangeText={handleChange('password')}
										// onBlur={handleBlur('password')}
										value={values.password}
										/>
									</View>
									{ ( isLoaderActive == false ) ?
										<View style={styles.buttonContainer}>
											<View>
												<Button
													title="LOGIN"
													buttonStyle={[
													styles.buttonStyle,
													{
														backgroundColor: Colors.primary,
													},
												]}
												titleStyle={{
													fontWeight: 'bold',
												}}
												allowFontScaling={false}
												onPress={handleSubmit}
												/>
											</View>
										</View>
									
									:
										<View  style={[styles.buttonStyle, {backgroundColor: Colors.primary,textAlign:'center' } ]}>
											<Text style={{ justifyContent: 'center' , textAlign: 'center',top: 10 }}><ActivityIndicator size="large" color="#fff" style={{ top: 40 }}/></Text>
										</View>
									}
								</View>
							)}
					</Formik>
					</KeyboardAwareScrollView>
				</View>
				</View>
				<View>
					<ImageBackground
						source={require('../assets/images/login_bottom_right.png')}
						style={styles.bottomImage}
						/>
				</View>
			</MainScreen>
		</Pressable>
	);
}
const styles = StyleSheet.create({
	innerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 99999,
	},
	containerElements: {
		// paddingVertical: 25,
		flex: 0.72,
		width: '85%',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	topImage: {
		position: 'absolute',
		height: heightToDp('23%'),
		width: widthToDp('38%'),
		resizeMode: 'stretch',
	},
	bottomImage: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		height: heightToDp('16%'),
		width: widthToDp('40%'),
		resizeMode: 'stretch',
	},
	logo: {
		height: heightToDp('26%'),
		width: widthToDp('80%'),
		// marginVertical: '15%',
	},
	buttonStyle: {
		width: widthToDp(85),
		// paddingVertical: 15,
		height: heightToDp(7),
		borderRadius: 100,
		marginVertical: heightToDp(1),
	},
	inputContainer: {
		width: '100%',
		marginVertical: heightToDp(6),
		maxWidth: '100%',
	},
	loginHeading: {
		color: Colors.primary,
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: heightToDp(5),
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: heightToDp(15),
	},
});