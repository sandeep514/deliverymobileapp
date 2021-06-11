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
  Pressable
} from 'react-native';
import {Colors} from './../components/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListItem, Avatar, Header, Button, Input} from 'react-native-elements';
import MainScreen from '../layout/MainScreen';
import {useState, useEffect} from 'react';
import {generateRandString, getCartItemDetails, getListInvoices, getVehicle, imagePrefix} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SaveOrder} from '../api/apiService';
import { ActivityIndicator } from 'react-native';
import { useRef } from 'react';
import { BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

const win = Dimensions.get('window');

let setTotalAmount = 0;
let setUpdatedDataArray = [];
let currentSelectedId = '';
let currentSelectedLoadName = '';
let selectedVehicle = '';
let selectedRoute = '';
let selectedDriver = '';
let selectedBuyerId = '';
let valuetem = '';

let updatedValue= '';
let initalPaymentStatus = 'cash';
export default function AddQuantity({navigation}) {
  	const [data, setData] = useState();
  	// const [totalAmount, setTotalAmount] = useState();
	const [loadedData , setLoadedData] = useState();
	const [updatedData , setUpdatedData] = useState();
	const [loadedActivityIndicator , setLoadedActivityIndicator] = useState(false);
	const [ActInd , setActInd] = useState(false);
	const [creaditStatus , setCreditStatus] = useState(initalPaymentStatus);
	const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
	const [selectedLoadCount , setSelectedLoadCount] = useState();
	const [ device ,setDevice ] = useState();
	const [ isBluetoothEnabled ,setisBluetoothEnabled ] = useState(false);

	const ref_input2 = useRef();
    var paired = [];

	useEffect(() => {
        getListInvoice();
            BluetoothManager.isBluetoothEnabled().then( (enabled) => {
            BluetoothManager.enableBluetooth().then( (r) => {
                
                setisBluetoothEnabled(true)
                console.log("kjhnjkmnk")
                if (r && r.length > 0) {
                    for (var i = 0; i < r.length; i++) {
                        
                        // if(JSON.parse(r[i]).name == "BlueTooth Printer"){
                            try {
                                console.log(JSON.parse(r[i]).name)
                                paired.push(JSON.parse(r[i]).name);
                                setDevice(JSON.parse(r[i]).address)
                            } catch (e) {
                                alert(e);
                            }
                        // }
                    }
                }else{

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

    } , [])

    function getListInvoice(){
        AsyncStorage.getItem('selectedVehicleNo').then((value) => {
			let selectedVehNo  = value;
			AsyncStorage.getItem('user_id').then((value) => {
				let driverId =  value;
                getListInvoices(driverId , selectedVehNo).then((data) => {
                    setSelectedLoadCount(data.data.data)
                });
			});
		});
    }
    printReceipt = (data) => {
        console.log(data)
        if( device != undefined ){
            BluetoothManager.connect(device).then( (res) => {
                console.log('here')
                // printDesign()
            },(e) => {
            });
        }else{
            alert('printer not connected');
        }
    };
    printDesign = async () => {

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.setBlob(0);
            await BluetoothEscposPrinter.printText('UK Inch\n\r', {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 3,
                heigthtimes: 3,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.setBlob(0);
            await BluetoothEscposPrinter.printText('94 Staceway Worth, Crawley, RH107YR\n\r', {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printText('Phone: 07917105510\n\r', {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printText('Email: Ekinch2@gmail.com\n\r', {
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
                '\n\r',
                {},
            );
        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {}  ,
        );
        let columnWidthsHeader = [12, 2, 2, 16];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeader,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Customer','', '','Date:'+savedOrderResonce[0]['ddate']],
            {},
        );
        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {}  ,
        );

        let columnWidthsHeaderName = [9, 1, 1, 20];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderName,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Name:','', '',savedBuyerData['name']],
            {},
        );
        let columnWidthsHeaderAddress = [9,1,1,20];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderAddress,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Address:','', '',savedBuyerData['address']],
            {},
        );
        let columnWidthsHeaderMobile = [9,1,1,20];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderMobile,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Phone:','', '',savedBuyerData['contact_no']],
            {},
        );
        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
        );
        await BluetoothEscposPrinter.printText(
            'Items without VAT',
            {encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1
            }
        );
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});

        let columnWidthsHeaderPhone = [12,4,8,8];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderPhone,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Items','Qty', 'Price','Amount'],
            {},
        );

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
        let columnWidths = [12, 4, 8, 8];
            for(let i = 0 ; i < savedOrderResonce.length ; i++){
                if( savedOrderResonce[i]['sale_item_rel'].itemcategory == 'EGGS' ){
                    let sitem = savedOrderResonce[i]['sale_item_rel']['name'];
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
                        [sitem, qty, '$'+salePrice, '$'+amount],
                    {});
                    await BluetoothEscposPrinter.printText('\n\r', {});
                }
            }
        
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printText(
                '*************************',
                {encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1
            });
            
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
        );
        await BluetoothEscposPrinter.printText(
            'Items with VAT',
            {encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1
            }
        );
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});

        let columnWidthsHeaderPhoneVat = [12,4,8,8];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderPhoneVat,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Items','Qty', 'Price','Amount'],
            {},
        );

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
        let columnWidthsVat = [12, 4, 8, 8];
            for(let i = 0 ; i < savedOrderResonce.length ; i++){
                if( savedOrderResonce[i]['sale_item_rel'].itemcategory != 'EGGS' ){
                    let sitem = savedOrderResonce[i]['sale_item_rel']['name'];
                    let salePrice = savedOrderResonce[i]['sale_price'];
                    let qty = savedOrderResonce[i]['qty'];
                    let amount = ((savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']).toFixed(2)).toString();
    
                    totalAmount = (parseFloat(totalAmount));
    
                    await BluetoothEscposPrinter.printColumn(
                        columnWidthsVat,
                        [
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.CENTER,
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [sitem, qty, '$'+salePrice, '$'+amount],
                    {});
                    await BluetoothEscposPrinter.printText('\n\r', {});
                }
            }
        

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
        await BluetoothEscposPrinter.printColumn(
            columnWidthsVat,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['', '', 'Total: ','$'+(totalAmount).toFixed(2)],
            {
            },
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

        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printText('\n\r', {});
    }

    function printData(data){
        console.log(data)
    }
	return (
		<MainScreen>
			<View style={{flex:1}}>
				{(ActInd == true) ?
					<View style={{ flex:1,position:'absolute',justifyContent:'center',height:'100%',width: '100%',backgroundColor: '#ededed',zIndex:9999,opacity: 0.5}} >
						<ActivityIndicator size="large" color={Colors.primary} />
					</View>
				:
					<View style={styles.itemListSection}>
                        <ScrollView vertical='true'>
                            {(selectedLoadCount != undefined) ?
                                Object.values(selectedLoadCount).map((l, i) => (
                                    <TouchableHighlight key={generateRandString()}>
                                        <ListItem bottomDivider key={generateRandString()}>
                                            <ListItem.Content key={generateRandString()}>
                                                <ListItem.Title key={generateRandString()} style={{fontSize: 14}} allowFontScaling={false}>
                                                    {l[0].buyer}
                                                </ListItem.Title>
                                                <ListItem.Subtitle allowFontScaling={false} >
                                                    <Text style={{fontSize: 10}}>{l[0].invoice_no}</Text>
                                                </ListItem.Subtitle>
                                            </ListItem.Content>
                                            <View>
                                                <Pressable style={{backgroundColor: Colors.primary,paddingHorizontal: 20,paddingVertical: 10}} onPress={() => { printReceipt(l[0]) }} ><Text style={{color: 'white'}}>Print</Text></Pressable>
                                            </View>
                                        </ListItem>
                                    </TouchableHighlight>
                                ))
                            : 
                                <View>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                </View>
                            }
                        </ScrollView>
                    </View>
				}
			</View>
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
    flex: 1.9,
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
	color: '#000'
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
		color: 'white'
	},
	deActiveStatusText: {
		color: Colors.primary
	},
});