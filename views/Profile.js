import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {View, StyleSheet, Alert , Text} from 'react-native';
import {Button, ListItem} from 'react-native-elements';
import {Colors} from '../components/Colors';
import MainScreen from '../layout/MainScreen';
import {widthToDp, heightToDp} from '../utils/Responsive';

let profileData = [];
export default function Profile({navigation}) {
	
	const [address , setaddress] = useState() ;
	const [contact_no , setcontact_no] = useState() ;
	const [dob , setdob] = useState() ;
	const [doj , setdoj] = useState() ;
	const [email , setemail] = useState() ;
	const [id , setid] = useState() ;
	const [licenseno , setlicenseno] = useState() ;
	const [name , setname] = useState() ;
	const [username , setusername] = useState() ;

	useEffect(() => {
		let isMounted = true;
		AsyncStorage.getItem('user_address').then((res) => {
			setaddress(res);
		})
		AsyncStorage.getItem('user_contact_no').then((res) => {
			setcontact_no(res);
		})
		AsyncStorage.getItem('user_dob').then((res) => {
			setdob(res);
		})
		AsyncStorage.getItem('user_doj').then((res) => {
			setdoj(res);
		})
		AsyncStorage.getItem('user_email').then((res) => {
			setemail(res);
		})
		AsyncStorage.getItem('user_id').then((res) => {
			setid(res);
		})
		AsyncStorage.getItem('user_licenseno').then((res) => {
			setlicenseno(res);
		})
		AsyncStorage.getItem('user_name').then((res) => {
			setname(res);
		})
		AsyncStorage.getItem('user_username').then((res) => {
			setusername(res);
		})

	} , [])
  return (
    <MainScreen>
      <View style={styles.container}>
        <View>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
						Name
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
							{name}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
							Email
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{email}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
							Contact Number
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{contact_no}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
							License Number
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{licenseno}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
						Address
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{address}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
						Joining Date
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{doj}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem bottomDivider>
				<ListItem.Content style={styles.list}>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.titleKey}>
						Date of Birth
					</ListItem.Title>
					<ListItem.Title
						allowFontScaling={false}
						style={styles.listValues}>
						{dob}
					</ListItem.Title>
				</ListItem.Content>
			</ListItem>
        </View>
        <View>
			<Button
				title="logout"
				titleProps={{allowFontScaling: false}}
				buttonStyle={styles.logoutButton}
				onPress={() => {
				Alert.alert(
					'Are you sure want to logout ?',
					'',
					[
					{
						text: 'Cancel',
						onPress: () => {},
						style: 'cancel',
					},
					{text: 'OK', onPress: () => navigation.push('Login')},
					],
					{cancelable: false},
				);
				}}
			/>
        </View>
      </View>
    </MainScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: '20%',
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listValues: {
    color: Colors.dark,
    fontSize: heightToDp('2.5%'),
    fontWeight: '800',
  },
  titleKey: {
    color: Colors.primary,
    fontSize: heightToDp('2.5%'),
    fontWeight: '900',
  },
  logoutButton: {
    position: 'relative',
    backgroundColor: Colors.redMaroon,
    paddingHorizontal: '10%',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
