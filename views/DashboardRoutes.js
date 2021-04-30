import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Colors} from '../components/Colors';
import MainScreen from '../layout/MainScreen';
import {heightToDp} from '../utils/Responsive';
import MapView, { Marker } from 'react-native-maps';

const list = [
    {
        id: 1,
        name: 'Saturday',
    },
    {
        id: 2,
        name: 'Saturday',
    },
];

export default function DashboardRoutes({navigation}) {
    const [coordinates] = useState([
		{
			latitude: 48.8587741,
			longitude: 2.2069771,
			latitudeDelta: 1,
			longitudeDelta: 1,
		},
		{
			latitude: 48.8323785,
			longitude: 2.3361663,
			latitudeDelta: 1,
			longitudeDelta: 1,
		}
	]);
    const [active, setActive] = new useState();
    const listClicked = (listId) => {
        setActive(listId);
    };
    return (
        <MainScreen>
            <View style={styles.container}>
                
                <View style={styles.map} >
                    <MapView style={styles.maps} initialRegion={{ latitude: coordinates[0].latitude, longitude: coordinates[0].longitude, latitudeDelta: 0.0622, longitudeDelta: 0.0121 }}>
                        <Marker coordinate={coordinates[0]} >
                            <Image source={ require('../images/MY19_M1CA46_SI_SR_9147_DS.png')} />
                        </Marker>
                        <Marker coordinate={coordinates[1]} ></Marker>
                    </MapView>
                </View>


                <View style={styles.nextButton}>
                    <Pressable>
                        <Icon name="chevron-right" type='font-awesome' color="white"/>
                    </Pressable>
                </View>
                <View style={{padding: 0 , margin: 0}}>
                    <ScrollView >
                        { list.map((l, i) => (
                            <TouchableHighlight key={i} onPress={(event) => listClicked(l.id)} >
                                {/* <ListItem containerStyle={(active == l.id) ? styles.active : styles.unactive} key={i} bottomDivider> */}
                                <ListItem key={i} bottomDivider  >
                                    <Image source={require('../assets/images/map.png')} style={styles.Avatar} />
                                    <ListItem.Content>
                                        <ListItem.Title>{l.name}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron/>
                                </ListItem>
                            </TouchableHighlight>
                        )) }
                    </ScrollView>
                </View>
            </View>
        </MainScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'space-between',
        paddingBottom: '20%',
    },
    nextButton: {
    	alignSelf: 'flex-end',
    	alignItems: 'center',
		justifyContent:'center',
        position: 'absolute',
        width: 70,
		height: 70,
        zIndex: 9999,
        top: heightToDp('33.6%'),
        padding: 18,
        backgroundColor: Colors.primary,
        borderRadius: 100,
        margin: 10,
    },
    list: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    Avatar: {width: 50, height: 50, resizeMode: 'contain'},
  
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
    active: {
        backgroundColor: 'pink',
        color: 'white',
    },
    unactive: {
        backgroundColor: 'white',
        color: 'white',
    },
	maps: {
		width: '100%',
		height: 310
	}
});
