import React, {useState} from 'react';
import {Image,ImageBackground,StyleSheet,Text,View,ToastAndroid,Keyboard,Pressable,ActivityIndicator} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import Signature from 'react-native-signature-canvas';
import SignatureScreen from 'react-native-signature-canvas';
import { useRef } from 'react';
import { SaveOrder } from '../api/apiService';
import {Colors} from './../components/Colors';

var paired = [];
let totalAmount = 0;
let setUpdatedDataArray = [];

export default function PDFmanager({navigation , text, onOK}) {
    const ref = useRef();

	const [ isLoaderActive ,setIsLoaderActive ] = useState(false);
	const [ isBluetoothEnabled ,setisBluetoothEnabled ] = useState(false);
	const [ device ,setDevice ] = useState();
	const [ savedOrderResonce ,setSavedOrderResponce ] = useState();
	const [ remarks ,setRemarks ] = useState('');
	const [ base64 ,setBase64 ] = useState('');
    const [creaditStatus , setCreditStatus] = useState('cash');
	const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);

	let setBase64Image = '';

    useEffect(() => {
        AsyncStorage.getItem('finalItems').then((result) => {
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
    
    const handleSignature2 = signature => {
        let baseImage = (signature).replace('data:image/png;base64,' , '');
        setBase64Image = baseImage;
        setBase64(baseImage)
    };
    const handleSignature = signature => {
        let baseImage = (signature).replace('data:image/png;base64,' , '');
        setBase64Image = baseImage;
        setBase64(baseImage)
        handleSignature2(signature)
    };

    const handleClear = () => {
        ref.current.clearSignature();
    }

    const handleConfirm = () => {
        ref.current.readSignature();
    }

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;


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
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            // await BluetoothEscposPrinter.printText('Price：30\n\r', {});
            await BluetoothEscposPrinter.printText(
                'INVOICE: '+savedOrderResonce[0]['invoice'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '\n\r',
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

            totalAmount = (parseFloat(totalAmount));

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

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );

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


        //images
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT,
        );
        await BluetoothEscposPrinter.printText('Signature: \n\r', {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1,
            });
        await BluetoothEscposPrinter.printPic(base64, {width: 100,left: 100,height: 50});


        await BluetoothEscposPrinter.printText('\n\r', {});
         await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT,
        );
        await BluetoothEscposPrinter.printText('Remarks: \n\r', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1,
        });
        await BluetoothEscposPrinter.printerAlign(
           BluetoothEscposPrinter.ALIGN.CENTER,
       );
        await BluetoothEscposPrinter.printText(remarks+'\n\r', {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 1,
                heigthtimes: 1,
                fonttype: 1,
            });

            
    };

    printReceipt = () => {
        BluetoothManager.connect(device).then( (res) => {
            SaveOrder().then((res) => {
                AsyncStorage.setItem('orderSaveReponce', JSON.stringify(res.data.data));
            })

            printDesign()
        },(e) => {
        });
    };
    function changeCreditStatus(status) {
		setCreditStatus(status)
		console.log(status)
	}
    function SaveOrders(){
        AsyncStorage.getItem('finalItems').then((res) => {
            let data = JSON.parse(res)
            data.push({'type' : creaditStatus});
            console.log(data)
        })
		// setSaveOrderActivIndictor(true)
        
		// SaveOrder().then((res) => {
        //     console.log(res);
        //     // printReceipt()
		// 	// setSaveOrderActivIndictor(false)
		// 	// AsyncStorage.setItem('orderSaveReponce', JSON.stringify(res.data.data));
		// })
	}

	
	return (
        <View style={styles.bodyContainer}>
            <View style={{flex: 0.06, justifyContent: 'center',flexDirection: 'row'}}>
                <View>
                    <Pressable onPress={() => { setCreditStatus('cash') }} style={ (creaditStatus == 'cash') ? styles.activeStatus : styles.deActiveStatus }>
                        <Text style={ (creaditStatus == 'cash') ? styles.activeStatusText : styles.deActiveStatusText }>
                            CASH
                        </Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={() => { setCreditStatus('credit') }} style={ (creaditStatus == 'credit') ? styles.activeStatus : styles.deActiveStatus }>
                        <Text style={ (creaditStatus == 'credit') ? styles.activeStatusText : styles.deActiveStatusText }>
                            CREDIT
                        </Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={() => { setCreditStatus('bank') }} style={ (creaditStatus == 'bank') ? styles.activeStatus : styles.deActiveStatus }>
                        <Text style={ (creaditStatus == 'bank') ? styles.activeStatusText : styles.deActiveStatusText }>
                            BANK TRANSFER
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View style={{ flex: 0.3 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Invoice
                </Text>
                <Text style={{ fontSize: 30,textAlign: 'center'}}>Welcome</Text>
                {/* <Text style={{ fontSize: 15,textAlign: 'center'}}>INVOICE: {(savedOrderResonce != undefined)? savedOrderResonce[0]['invoice'] : ''}</Text> */}
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

            <View style={{ flex: 0.5 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Signature
                </Text>
                        <View style={styles.container}>
                            <SignatureScreen
                                ref={ref}
                                onOK={handleSignature} 
                            />
                            {/* <View style={styles.row}>
                                <Button
                                    title="Clear"
                                    onPress={handleClear}
                                />
                                <Button
                                title="Confirm"
                                onPress={handleConfirm}
                                />
                            </View> */}
                        </View>
            </View>

            <View  style={{ flex: 0.11 ,width: '100%' }}>
                <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                    Remarks
                </Text>
                <Input placeholder="Add Remarks" value={remarks} allowFontScaling={false} onChange={(value) => {setRemarks(value.nativeEvent.text)}}/>
            </View>
            <View  style={{ flex: 0.05 ,width: '100%' }}>
                <Button title="Print" onPress={() => { SaveOrders() }} />
            </View>
        </View>
	);
}
const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
    },
    container: {
        // alignItems: 'center',
        height: 100,
        padding: 10,
        flex: 1
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
	activeStatus: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 18,
		borderRadius: 15,
		paddingVertical: 10,
		borderColor: Colors.primary ,
		borderWidth: 2
	},
	deActiveStatus: {
		paddingHorizontal: 18,
		borderRadius: 15,
		paddingVertical: 10,
		marginHorizontal: 10 ,
		borderColor: Colors.primary ,
		borderWidth: 2
	},
	activeStatusText: {
		color: 'white',
        fontSize: 12
	},
	deActiveStatusText: {
		color: Colors.primary,
        fontSize: 12
	},
});