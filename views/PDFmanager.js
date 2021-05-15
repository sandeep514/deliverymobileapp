import React, {useState} from 'react';
import {Image,ImageBackground,StyleSheet,Text,View,ToastAndroid,Keyboard,Pressable,ActivityIndicator} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


var paired = [];
let totalAmount = 0;

export default function PDFmanager({navigation}) {
	const [ isLoaderActive ,setIsLoaderActive ] = useState(false);
	const [ isBluetoothEnabled ,setisBluetoothEnabled ] = useState(false);
	const [ device ,setDevice ] = useState();
	const [ savedOrderResonce ,setSavedOrderResponce ] = useState();


    useEffect(() => {
        AsyncStorage.getItem('orderSaveReponce').then((result) => {
            setSavedOrderResponce(JSON.parse(result));
            for(let i = 0 ; i < JSON.parse(result).length ; i++){
                let amount = ((JSON.parse(result)[i]['sale_price'] * JSON.parse(result)[i]['qty']).toFixed(2)).toString();
                totalAmount = (parseFloat(totalAmount)+parseFloat(amount));
            }
        })
        BluetoothManager.isBluetoothEnabled().then( (enabled) => {
            BluetoothManager.enableBluetooth().then( (r) => {
                setisBluetoothEnabled(true)
                if (r && r.length > 0) {
                    for (var i = 0; i < r.length; i++) {

                        if(JSON.parse(r[i]).name == "BlueTooth Printer"){
                            try {
                                paired.push(JSON.parse(r[i]).name);
                                setDevice(JSON.parse(r[i]).address)
                            } catch (e) {
                                alert(e);
                            }
                        }
                    }
                }
                // var jsonPairedData = JSON.stringify(paired);
                // console.log(jsonPairedData);
                // console.log('Success Find' + paired[0].address);
                
                
                // console.log('---------------');
                // console.log(paired[0].address);
                // console.log('---------------');                
                
                // setDevice(paired[0].address)
                // BluetoothManager.connect(paired[0].address).then(
                //     printDesign(),
                //     (err) => {
                //         alert(err);
                //     },
                //     (e) => {
                //         alert(e);
                //     },
                // );
            },
            (err) => {
                alert(err);
            },
            );
        },
        (err) => {
            alert(err);
        },
        );

    }, []);
	const showToast = (message) => {
		ToastAndroid.showWithGravityAndOffset(message,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,20);
	};
    printDesign = async () => {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
        );
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText('welcome\n\r', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
        });
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText('Print Recipt\n\r', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1,
        });
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT,
        );
        // await BluetoothEscposPrinter.printText('Price：30\n\r', {});
        await BluetoothEscposPrinter.printText(
            'INVOICE: '+savedOrderResonce[0]['invoice'],
            {},
        );
        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
    let columnWidths = [12, 4, 8, 8];
    await BluetoothEscposPrinter.printColumn(
        columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Item', 'qty', 'Price', 'Amount'],
        {},
    );
    for(let i = 0 ; i < savedOrderResonce.length ; i++){
        let sitem = savedOrderResonce[i]['sitem'];
        let salePrice = savedOrderResonce[i]['sale_price'];
        let qty = savedOrderResonce[i]['qty'];
        let amount = ((savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']).toFixed(2)).toString();

        totalAmount = (parseFloat(totalAmount)+parseFloat(amount));

        await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [sitem, qty, salePrice, amount],
          {},
        );
        await BluetoothEscposPrinter.printText('\n\r', {});
    }

    // await BluetoothEscposPrinter.printText(
    //     '--------------------------------\n\r',
    //     {},
    // );

    await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['', '', 'Total: ',(totalAmount).toFixed(2)],
          {},
        );
    await BluetoothEscposPrinter.printText('\n\r', {});
  };

    printReceipt = () => {
        BluetoothManager.connect(device).then( (res) => {
            console.log(res);
            printDesign()
        },(e) => {
            console.log(e);
        });
    };

	
	return (
        <View style={styles.bodyContainer}>
            <View style={{ flex: 0.35 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Invoice
                </Text>
                <Text style={{ fontSize: 30,textAlign: 'center'}}>Welcome</Text>
                <Text style={{ fontSize: 15,textAlign: 'center'}}>INVOICE: {(savedOrderResonce != undefined)? savedOrderResonce[0]['invoice'] : ''}</Text>
                <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20,borderBottomColor:'black',borderTopColor:'transparent',borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1 }}>
                    <Text style={{fontWeight: 'bold',width: 100}}>Item</Text>
                    <Text style={{fontWeight: 'bold'}}>Qty</Text>
                    <Text style={{fontWeight: 'bold'}}>Price</Text>
                    <Text style={{fontWeight: 'bold'}}>Amount</Text>
                </View>
                <View style={{marginTop: 10}}>
                </View>
                    {(savedOrderResonce != undefined) ?
                        savedOrderResonce.map((value , key) => {
                            console.log(value)
                            return (
                                <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                    <Text style={{ width: 90}}>{value['sitem']}</Text>
                                    <Text style={{ }}>{value['qty']}</Text>
                                    <Text style={{ }}>{value['sale_price']}</Text>
                                    <Text style={{ }}>{((value['sale_price'] * value['qty']).toFixed(2)).toString()}</Text>
                                </View>
                            )
                        })
                    : 
                        <View></View>
                    }
                <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20}}>
                    <Text style={{fontWeight: 'bold',width: 100}}></Text>
                    <Text style={{fontWeight: 'bold'}}></Text>
                    <Text style={{fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{fontWeight: 'bold'}}>{(totalAmount).toFixed(2)}</Text>
                </View>
            </View>

            <View style={{ flex: 0.3 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Signature
                </Text>
            </View>

            <View  style={{ flex: 0.3 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Remarks
                </Text>
            </View>
            <View  style={{ flex: 0.05 ,width: '100%' }}>
                <Button title="print  test  Receipt" onPress={() => { printReceipt() }} />
            </View>
        </View>
	);
}
const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
    }
});