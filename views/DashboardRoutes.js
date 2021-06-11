import React, {useState,useEffect} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Colors} from '../components/Colors';
import MainScreen from '../layout/MainScreen';
import {heightToDp} from '../utils/Responsive';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPriorityDrivers } from '../api/apiService';

const list = [
        {
            id: 1,
            name: 'Route One',
        },
        {
            id: 2,
            name: 'Route Two',
        },
    ];

    export default function DashboardRoutes({navigation}) {
        const [coord , setCoord] = useState({
            latitude: 31.6206,
            longitude: 74.8801,
            latitudeDelta: 1,
            longitudeDelta: 1,
        })
        const [listRoutes , setListRoutes] = useState();
        const [hasRoutes , setHasRoutes] = useState(false);
        useEffect(() => {
            AsyncStorage.setItem('selectedLoadedItemsByQty',JSON.stringify({}));
            getRoutes()
            AsyncStorage.getItem('location').then( (data) => {
                let currentLoc = JSON.parse(data)
                setCoord({  latitude: currentLoc.latitude,
                            longitude: currentLoc.longitude,
                            latitudeDelta: 1,
                            longitudeDelta: 1
                        })
            })
        } , [])

        function getRoutes(){
            AsyncStorage.getItem('selectedRoute').then((routeId) => {
                AsyncStorage.getItem('user_id').then((driverid) => {
                    getPriorityDrivers(driverid , 4).then((res) => {
                        setHasRoutes(true)
                        setListRoutes(res.data.data);
                    } , (err) =>{
                        console.log(err)
                    })
                }) 
            })
            
        }
        
        const [coordinates ,setcoordinates] = useState([
            {
                
            },
            {
                latitude: 31.6206,
                longitude: 74.8801,
                latitudeDelta: 1,
                longitudeDelta: 1,
            }
        ]);
        const [active, setActive] = new useState();
        const listClicked = (listData) => {
            setActive(listData.id);
            AsyncStorage.setItem( 'selectedBuyerRouteId', (listData.id).toString());
            setcoordinates([{} ,{    latitude: parseFloat(listData.latitude),
                                    longitude: parseFloat(listData.longitude),
                                    latitudeDelta: 1,
                                    longitudeDelta: 1
                                }])
        };

        return (
            <MainScreen>
                <View style={styles.container}>
                    
                    <View style={styles.map} >
                        <MapView style={styles.maps} initialRegion={{ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0.0622, longitudeDelta: 0.0121 }}>
                            <Marker coordinate={coord} >
                                <Image source={ require('../images/MY19_M1CA46_SI_SR_9147_DS.png')} />
                            </Marker>
                            <Marker coordinate={coordinates[1]} ></Marker>
                        </MapView>
                    </View>


                    {/* <View style={styles.refreshBottom}>
                        <Pressable onPress={() => { getLocation() }}>
                            <Icon name="refresh" type='font-awesome' color={Colors.primary}/>
                        </Pressable>
                    </View> */}
                    <View style={styles.nextButton}>
                        <Pressable onPress={ () => {  navigation.navigate('ItemsScreenWithQty') }}>
                            <Icon name="chevron-right" type='font-awesome' color="white"/>
                        </Pressable>
                    </View>
                    <View style={{padding: 0 , margin: 0}}>
                        <ScrollView >

                            { (hasRoutes != false && listRoutes != undefined) ?
                                listRoutes.map((l, i) => (
                                    <TouchableHighlight key={i} onPress={(event) => listClicked(l)} >
                                        <ListItem containerStyle={(active == l.id) ? styles.active : styles.unactive} key={i} bottomDivider>
                                        {/* <ListItem key={i} bottomDivider  > */}
                                            <Image source={require('../assets/images/map.png')} style={styles.Avatar} />
                                            <ListItem.Content>
                                                <ListItem.Title>{l.name}</ListItem.Title>
                                                <ListItem.Title style={{color: 'grey',fontSize: 12}}>{l.address}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Chevron/>
                                        </ListItem>
                                    </TouchableHighlight>
                                )) 
                            :
                                <View>
                                    <ActivityIndicator color={Colors.primary} size="large"></ActivityIndicator>
                                </View>
                            }
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
        refreshBottom: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent:'center',
            position: 'absolute',
            width: 70,
            height: 70,
            zIndex: 9999,
            top: 1,
            padding: 18,
            backgroundColor: 'lightgrey',
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
