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
import {generateRandString, getCartItemDetails, getDiverId, getListInvoices, getVehicle, imagePrefix} from '../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {searchBuyerByInvoiceNumber, getSaleItemByInvoice} from '../api/apiService';
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
let unableToConnect = 0;

export default function AddQuantity({navigation}) {
const [data, setData] = useState();
// const [totalAmount, setTotalAmount] = useState();
const [loadedData , setLoadedData] = useState();
const [updatedData , setUpdatedData] = useState();
const [loadedActivityIndicator , setLoadedActivityIndicator] = useState(false);
const [printingIndicator , setPrintingIndicator] = useState(false);
const [ActInd , setActInd] = useState(false);
const [creaditStatus , setCreditStatus] = useState(initalPaymentStatus);
const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
const [selectedLoadCount , setSelectedLoadCount] = useState();
const [ device ,setDevice ] = useState();
const [ isBluetoothEnabled ,setisBluetoothEnabled ] = useState(false);
const [ bluetoothName ,setBluetoothName ] = useState();
const [ hasVatProduct ,setHasVatProducts ] = useState(false);
const [ hasNonVatProducts ,setHasNonVatProducts ] = useState(false);

const ref_input2 = useRef();
var paired = [];

useEffect(() => {
    getListInvoice();
    getPrinterNameByDriver()
     

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

function getSaleItemByInv (invoiceNo) {
    return new Promise( (resolve , reject) => {
        getSaleItemByInvoice(invoiceNo).then((res) => {
            resolve(res.data.data);
        });
    } ,(err) =>{
        reject(err)
    })
}

printReceipt = (data) => {
    setPrintingIndicator(true);
    let buyerName = data[0]['buyer_rel'].name;
    let buyerAddress = data[0]['buyer_rel'].address;
    let buyerPhone = data[0]['buyer_rel'].contact_no;
    let invoiceNo = data[0].invoice_no;
      AsyncStorage.getItem('user_id').then((res) => {
            getDiverId(res).then((printerName) => {
                setBluetoothName(printerName)
                BluetoothManager.isBluetoothEnabled().then( (enabled) => {
                    BluetoothManager.enableBluetooth().then( (r) => {
                        
                        setisBluetoothEnabled(true)
                        if (r != undefined) {
                            for (let i = 0; i < r.length; i++) {

                                // AsyncStorage.getItem('printerName').then((res) => {
                                    if(res != null && res != undefined){
                                        if(JSON.parse(r[i]).name == printerName){
                                            paired.push(JSON.parse(r[i]).name);
                                            setDevice(JSON.parse(r[i]).address)

                                            getSaleItemByInv(invoiceNo).then((res) => {
                                                for(let i = 0 ; i < res.length ; i++){
                                                    if( res[i]['sale_item_rel'].itemcategory == 'EGGS' || res[i].has_vat ){
                                                        setHasVatProducts(true)
                                                    }
                                                    if( res[i]['sale_item_rel'].itemcategory != 'EGGS' && !res[i].has_vat ){
                                                        setHasNonVatProducts(true)

                                                    }
                                                    
                                                }
                                                BluetoothManager.connect(JSON.parse(r[i]).address).then( (ress) => {
                                                    printDesign( Object.values(res) , invoiceNo , buyerName ,buyerAddress , buyerPhone );
                                                },(e) => {
                                                    console.log(e['Error']);
                                                    alert(e)
                                                    setPrintingIndicator(false);
                                                });
                                            },(error) => {
                                                alert(error);
                                            });
                                        }
                                    }else{
                                        alert('No Printer available');
                                    }
                                
                                // })
                            }
                        }else{
                            alert('No Device detected');
                        }
                
                    },(err) => {
                        alert(err);
                    });
                },
                    (err) => {
                        alert(err);
                    },
                );
            })
        })
      
};
getPrinterNameByDriver = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('user_id').then((res) => {
            getDiverId(res).then((printerName) => {
                setBluetoothName(printerName)
                BluetoothManager.isBluetoothEnabled().then( (enabled) => {
                    BluetoothManager.enableBluetooth().then( (r) => {
                        
                        setisBluetoothEnabled(true)
                        if (r != undefined) {
                            for (let i = 0; i < r.length; i++) {

                                // AsyncStorage.getItem('printerName').then((res) => {
                                    if(res != null && res != undefined){
                                        if(JSON.parse(r[i]).name == printerName){
                                            try {
                                                paired.push(JSON.parse(r[i]).name);
                                                setDevice(JSON.parse(r[i]).address)
                                                resolve(JSON.parse(r[i]).address);
                                            } catch (e) {
                                                alert(e);
                                            }
                                        }
                                    }else{
                                        alert('No Printer available');
                                    }
                                
                                // })
                            }
                        }else{
                            alert('No Device detected');
                        }
                
                    },(err) => {
                        alert(err);
                    });
                },
                    (err) => {
                        alert(err);
                    },
                );
            })
            resolve();
        })
    })
    
}
printDesign = async (data , invoiceNo , buyerName, buyerAddress , buyerPhone) => {
    let totalAmount = 0;

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
            'INVOICE: '+invoiceNo,
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
            ['Customer','', '','Date:'+data[0].idate],
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
            ['Name:','', '',buyerName],
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
            ['Address:','', '',buyerAddress],
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
            ['Phone:','', '',buyerPhone],
        {},
    );
    await BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
    );
    await BluetoothEscposPrinter.printText('\n\r', {});

    if(hasVatProduct){
        let columnWidthsHeaderPhone = [5,7,7,7,7];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderPhone,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Qty', 'Price','Amount','VAT','Total'],
            {},
        );
    
        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );
        let vatAmount = 0;
        let VatProductTotal = 0;
        let beforeVatPrice = 0;
        let columnWidths = [5,7,7,7,7];
        let columnWidthsTotal = [8,2,8,8,7];
        for(let i = 0 ; i < data.length ; i++){
            if( data[i]['sale_item_rel'].itemcategory == 'EGGS' || data[i].has_vat ){
                let sitem       = data[i]['sale_item_rel']['name'];
                let salePrice   = data[i]['sale_price'];
                let qty         = data[i]['qty'];
                let vat = 0;
                let amount = 0;
                if( data[i]['sale_item_rel'].itemcategory != 'EGGS' ){
                    vat = (( (( ( (data[i]['sale_price'] * data[i]['qty']) * 1.20 ) - (data[i]['sale_price'] * data[i]['qty']))) ).toFixed(2)).toString();
    
                    vatAmount = vatAmount + parseFloat(vat);
                }
                if( data[i]['sale_item_rel'].itemcategory == 'EGGS' ){
                    amount = ((data[i]['sale_price'] * data[i]['qty']).toFixed(2)).toString();
                }else{
                    amount = (( (data[i]['sale_price'] * data[i]['qty']) * 1.20 ).toFixed(2)).toString();
                    
                }
                beforeVatPrice = (beforeVatPrice + parseFloat((qty*salePrice)));
                totalAmount = (parseFloat(totalAmount)+parseFloat(amount));
    
                await BluetoothEscposPrinter.printerAlign(
                    BluetoothEscposPrinter.ALIGN.LEFT,
                );
                await BluetoothEscposPrinter.printText(
                    sitem,
                    {},
                );
                await BluetoothEscposPrinter.printText(
                    '\n\r',
                    {},
                );
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                    ],
                    [(qty*1).toFixed(0), '£'+salePrice,'£'+(qty*salePrice).toFixed(2),'£'+vat, '£'+amount],
                { encoding: 'Cp858',codepage: 13,widthtimes: 0.6 , heigthtimes: 0.6 });
                 await BluetoothEscposPrinter.printText(
                    '-------------------------------\n',
                    {},
                );
            }
        }
        // await BluetoothEscposPrinter.printText(
        //     '--------------------------------\n\r',
        //     {},
        // );
        // await BluetoothEscposPrinter.printColumn(
        //     columnWidthsTotal,
        //     [
        //         BluetoothEscposPrinter.ALIGN.LEFT,
        //         BluetoothEscposPrinter.ALIGN.CENTER,
        //         BluetoothEscposPrinter.ALIGN.CENTER,
        //         BluetoothEscposPrinter.ALIGN.CENTER,
        //         BluetoothEscposPrinter.ALIGN.RIGHT,
        //     ],
        //     ["Total: ", '','£'+(beforeVatPrice).toFixed(2),'£'+(vatAmount).toFixed(2), '£'+(beforeVatPrice + vatAmount).toFixed(2)],
        // {encoding: 'Cp858',codepage: 13});
        // await BluetoothEscposPrinter.printText(
        //     '--------------------------------\n\r',
        //     {},
        // );
        // await BluetoothEscposPrinter.printText('\n\r', {});
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.RIGHT,
        );
         await BluetoothEscposPrinter.printText(
                'Amount Before VAT: '+'£'+(beforeVatPrice).toFixed(2),
                 {encoding: 'Cp858',codepage: 13}
            );
            await BluetoothEscposPrinter.printText(
                '\n\r',
                {},
            );

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.RIGHT,
            );
            // await BluetoothEscposPrinter.printText('Price：30\n\r', {});
            await BluetoothEscposPrinter.printText(
                'VAT: '+'£'+(vatAmount).toFixed(2),
                 {encoding: 'Cp858',codepage: 13}
            );
            await BluetoothEscposPrinter.printText(
                '\n\r',
                {},
            );
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.RIGHT,
            );
            // await BluetoothEscposPrinter.printText('Price：30\n\r', {});
            await BluetoothEscposPrinter.printText(
                'Total: '+'£'+(beforeVatPrice + vatAmount).toFixed(2),
                 {encoding: 'Cp858',codepage: 13}
            );
            await BluetoothEscposPrinter.printText(
                '\n\r',
                {},
            );
    }
    let columnWidthsVat = [12, 4, 8, 8];
    let nonVatTotal = 0;

    if( hasNonVatProducts ){
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

        let columnWidthsHeaderPhoneVat = [10,10,10];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsHeaderPhoneVat,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                ],
                ['Qty', 'Price','Amount'],
            {},
        );

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );

        for(let i = 0 ; i < data.length ; i++){
            if( data[i]['sale_item_rel'].itemcategory != 'EGGS' && !data[i].has_vat  ){
                let sitem = data[i]['sale_item_rel']['name'];
                let salePrice = data[i]['sale_price'];
                let qty = data[i]['qty'];
                let amount = ((data[i]['sale_price'] * data[i]['qty']).toFixed(2)).toString();
                let vat = 0;


                nonVatTotal = (nonVatTotal + parseFloat(amount));
                await BluetoothEscposPrinter.printerAlign(
                    BluetoothEscposPrinter.ALIGN.LEFT,
                );
                await BluetoothEscposPrinter.printText(
                    sitem,
                    {},
                );
                await BluetoothEscposPrinter.printText(
                    '\n\r',
                    {},
                );

                let columnWidthsVat = [10,10,10];
                await BluetoothEscposPrinter.printColumn(
                    columnWidthsVat,
                    [
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                    ],
                    [(qty*1).toFixed(0), '£'+salePrice,'£'+amount],
                {encoding: 'Cp858',codepage: 13});
                await BluetoothEscposPrinter.printText('\n\r', {});
                
            }
        }
                await BluetoothEscposPrinter.printerAlign(
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                );
                await BluetoothEscposPrinter.printText(
                    'Total: £'+(nonVatTotal).toFixed(2),{ encoding: 'Cp858',codepage: 13 },
                );
                await BluetoothEscposPrinter.printText('\n\r', {});

                await BluetoothEscposPrinter.printText(
                    '--------------------------------\n\r',{}
                );

        await BluetoothEscposPrinter.printText(
            '--------------------------------\n\r',
            {},
        );

    }
    await BluetoothEscposPrinter.printColumn(
        columnWidthsVat,
        [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['', '', 'Total: ','£'+(totalAmount+nonVatTotal).toFixed(2)],
        {encoding: 'Cp858',codepage: 13
        },
    );

    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r', {});

    setPrintingIndicator(false);
}

function searchBuyer(text){
    // setActInd(true)
    searchBuyerByInvoiceNumber(text).then((res) => {
        setSelectedLoadCount(res.data.data)
        // setActInd(false)
    })
}

function printData(data){

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
                    {(printingIndicator)?
                        <View style={{ position: 'absolute',height: win.height,width: win.width,backgroundColor: '#e8e8e8',zIndex: 9999,opacity: 0.5,justifyContent: 'center',alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text>Printing your invoice ,Please wait...</Text>
                        </View>
                    :
                        <View></View>
                    }
                    <TextInput placeholder="Search Buyer By Invoice no" placeholderTextColor="lightgrey" style={styles.textInput} onChange={(value) => { searchBuyer(value.nativeEvent.text) } } />
                    <ScrollView vertical='true'>
                        {(selectedLoadCount != undefined && selectedLoadCount != null) ?
                            Object.values(selectedLoadCount).map((l, i) => (
                                (l != null)?
                                <TouchableHighlight key={i}>
                                        <ListItem bottomDivider key={i}>
                                            <ListItem.Content key={i}>
                                                <ListItem.Title key={i} style={{fontSize: 14}} allowFontScaling={false}>
                                                    {l[0]["buyer_rel"].name}
                                                </ListItem.Title>
                                                <ListItem.Subtitle allowFontScaling={false} >
                                                    <Text style={{fontSize: 10}}>{l[0].invoice_no}</Text>
                                                </ListItem.Subtitle>
                                            </ListItem.Content>
                                            <View>
                                                <Pressable style={{backgroundColor: Colors.primary,paddingHorizontal: 20,paddingVertical: 10}} onPress={() => { setPrintingIndicator(true); printReceipt(l) }} >
                                                    <Text style={{color: 'white'}}>Print</Text>
                                                </Pressable>
                                            </View>
                                        </ListItem>
                                    </TouchableHighlight>
                                :
                                    <View></View>
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
textInput:{
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: 17,
    paddingHorizontal: 17,
    borderRadius: 100,
    color: '#000'
}
});