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
} from 'react-native';
import {Colors} from './../components/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem, Avatar, Header, Button, Input} from 'react-native-elements';
import MainScreen from '../layout/MainScreen';
import {useState, useEffect} from 'react';
import {getVehicle} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const win = Dimensions.get('window');

export default function AddQuantity({navigation}) {
  const [data, setData] = useState();

  return (
    <MainScreen>
      <ScrollView>
        <View style={styles.mainBox}>
          <View style={styles.itemBox}>
            <Image
              source={require('../assets/images/item.png')}
              style={{width: 50, height: 55, marginRight: 8}}
            />
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
                allowFontScaling={false}>
                Item Name
              </Text>

              <Text
                style={{
                  fontSize: 10,
                }}
                allowFontScaling={false}>
                Available Stock
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 0.8,
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: 'black',
              height: 90,
            }}>
            <View style={styles.buttonBox}>
              <Button
                icon={<Icon name="plus" size={20} color="white" />}
                buttonStyle={styles.plusButton}
              />
              <Button
                icon={<Icon name="minus" size={20} color="white" />}
                buttonStyle={styles.minisButton}
              />
            </View>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Qty"
              style={styles.textInput}
              placeholder="QTY"
            />
            <TextInput
              placeholder="Price"
              style={styles.textInput}
              placeholder="PRICE"
            />
          </View>
        </View>
      </ScrollView>
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
    flex: 1.3,
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
  },
});
