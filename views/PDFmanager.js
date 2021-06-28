import React, {useState} from 'react';
import {Image,ImageBackground,StyleSheet,Text,View,ToastAndroid,Keyboard,Pressable,ActivityIndicator,ScrollView,Dimensions} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import Signature from 'react-native-signature-canvas';
import SignatureScreen from 'react-native-signature-canvas';
import { useRef } from 'react';
import { SaveOrder } from '../api/apiService';
import {Colors} from './../components/Colors';
import {widthToDp, heightToDp} from '../utils/Responsive';
import { BackHandler } from 'react-native';

var paired = [];
let totalAmount = 0;
let setUpdatedDataArray = [];

export default function PDFmanager({navigation , text, onOK}) {
    var totalAmountVat = 0;
    var totalAmountWithoutVat = 0;
    var AmountVat = 0;

    const ref = useRef();
	const win = Dimensions.get('window');

	const [ isLoaderActive ,setIsLoaderActive ] = useState(false);
	const [ isBluetoothEnabled ,setisBluetoothEnabled ] = useState(false);
	const [ device ,setDevice ] = useState();
	const [ savedOrderResonce ,setSavedOrderResponce ] = useState();
	const [ hasNonVatProducts ,setHasNonVatProducts ] = useState(false);
	const [ hasVatProducts ,setHasVatProducts ] = useState(false);
	const [ remarks ,setRemarks ] = useState('');
	const [ base64 ,setBase64 ] = useState('');
    const [creaditStatus , setCreditStatus] = useState('cash');
	const [saveOrderActivIndictor , setSaveOrderActivIndictor] = useState(false);
	const [savedBuyerData , setSavedBuyerData] = useState();
	const [showVAT , setShowVAT] = useState(false);
    const [VatProductTotal , setVatProductTotal] = useState(0);
    const [nonVATTotal , setNonVATTotal] = useState(0);
    const [VATTotal , setVATTotal] = useState(0);
    const [WithoutVatProductTotal , setWithoutVatProductTotal] = useState(0);

	let setBase64Image = '';
    
    useEffect(() => {
        


        AsyncStorage.setItem('selectedLoadedItemsByQty', JSON.stringify({}));
        AsyncStorage.getItem('currentVATstatus').then((res) => {
            if( res == '1' ){
                setShowVAT(true);
            }else{
                setShowVAT(false);
            }
        });
        totalAmountVat = 0;
        AmountVat = 0;
        totalAmountWithoutVat = 0;
        AsyncStorage.getItem('orderSaveReponce').then((result) => {    
            setSavedOrderResponce(JSON.parse(result));
            for(let i = 0 ; i < JSON.parse(result).length ; i++){

                if( JSON.parse(result)[i]['has_vat'] == 1 || JSON.parse(result)[i]['sale_item_rel']['itemcategory'] == 'EGGS'){
                    if(JSON.parse(result)[i]['sale_item_rel']['itemcategory'] == 'EGGS'){
                        let qty = JSON.parse(result)[i]['qty'];
                        let sale_price = JSON.parse(result)[i]['sale_price'];
                        
                        // setVatProductTotal( (parseFloat(VatProductTotal) + (parseFloat(qty)*parseFloat(sale_price))) );
                        totalAmountVat = (parseFloat(totalAmountVat) + (parseFloat(qty)*parseFloat(sale_price))) 
                        AmountVat = (parseFloat(AmountVat) + (parseFloat(qty)*parseFloat(sale_price))) 

                        setVatProductTotal(totalAmountVat);
                        setVATTotal(AmountVat)
                    }
                    if( JSON.parse(result)[i]['has_vat'] == 1 ){
                        let qty = JSON.parse(result)[i]['qty'];
                        let sale_price = JSON.parse(result)[i]['sale_price'];
                        let totalPriceAfterVAT = (((qty*sale_price) *1.20));
                        let amount = (qty*sale_price);

                        AmountVat = (parseFloat(AmountVat) + (parseFloat(qty)*parseFloat(sale_price))) 
                        totalAmountVat = (parseFloat(totalAmountVat) + parseFloat(totalPriceAfterVAT)) 

                        setVatProductTotal(totalAmountVat);
                        setVATTotal(AmountVat)

                    }
                }

                if( JSON.parse(result)[i]['has_vat'] == 0 && JSON.parse(result)[i]['sale_item_rel']['itemcategory'] != 'EGGS' ){
                    
                    if( JSON.parse(result)[i]['has_vat'] == 0 ){
                        let qty = JSON.parse(result)[i]['qty'];
                        let sale_price = JSON.parse(result)[i]['sale_price'];
                        let totalPriceAfterVAT = ( (qty*sale_price) );
                        
                        totalAmountWithoutVat = (parseFloat(totalAmountWithoutVat) + parseFloat(totalPriceAfterVAT)) 
                        setWithoutVatProductTotal(totalAmountWithoutVat)
                    }
                }



                if( JSON.parse(result)[i]['sale_item_rel']['itemcategory'] == 'EGGS' || JSON.parse(result)[i]['sale_item_rel']['itemcategory'] == 'eggs' ){
                    setHasNonVatProducts(true);
                }else{
                    setHasVatProducts(true);
                }

                let amount = ((JSON.parse(result)[i]['sale_price'] * JSON.parse(result)[i]['qty']).toFixed(2)).toString();
                totalAmount = (parseFloat(totalAmount)+parseFloat(amount));
            }
        })

        AsyncStorage.getItem('orderSaveBuyer').then((res) => {
            setSavedBuyerData(JSON.parse(res));
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
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>{
            BackHandler.removeEventListener('hardwareBackPress', () => true)
            AsyncStorage.setItem('orderSaveReponce' , JSON.stringify({}))
            setSavedOrderResponce();
        }
    }, []);
    function handleBackButtonClick() {
        navigation.navigate('Dashboard');
    }
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
        if( hasNonVatProducts ){
            await BluetoothEscposPrinter.printText('\n\r', {});

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
            
            let columnWidths = [5,7,7,7,7];
            let columnWidthsTotal = [8,2,8,8,7];
            for(let i = 0 ; i < savedOrderResonce.length ; i++){
                if( savedOrderResonce[i]['sale_item_rel'].itemcategory == 'EGGS' || savedOrderResonce[i].has_vat){
                    let sitem = savedOrderResonce[i]['sale_item_rel']['name'];
                    let salePrice = savedOrderResonce[i]['sale_price'];
                    let qty = savedOrderResonce[i]['qty'];
                    let vat = 0;
                    let amount = 0;
                    if( savedOrderResonce[i]['sale_item_rel'].itemcategory != 'EGGS' ){
                        vat = (( (( ( (savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']) * 1.20 ) - (savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']))) ).toFixed(2)).toString();
                    }
                    if( savedOrderResonce[i]['sale_item_rel'].itemcategory == 'EGGS' ){
                        amount = ((savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']).toFixed(2)).toString();
                    }else{
                        amount = (( (savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']) * 1.20 ).toFixed(2)).toString();
                    }
    
                    totalAmount = (parseFloat(totalAmount));
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
                        [qty, '$'+salePrice,'$'+(qty*salePrice).toFixed(2),'$'+(vat).toFixed(2), '$'+amount],
                    {});
                    // await BluetoothEscposPrinter.printText('\n\r', {});
                }
            }
            await BluetoothEscposPrinter.printText(
                '--------------------------------\n\r',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidthsTotal,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ["Total: ", '','$'+(VATTotal).toFixed(2),'$'+(VatProductTotal-VATTotal).toFixed(2), '$'+(VatProductTotal).toFixed(2)],
            {});
            await BluetoothEscposPrinter.printText(
                '--------------------------------\n\r',
                {},
            );
            await BluetoothEscposPrinter.printText('\n\r', {});

            
        }
        
        if(WithoutVatProductTotal > 0){

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
    
            for(let i = 0 ; i < savedOrderResonce.length ; i++){
                if( savedOrderResonce[i]['sale_item_rel'].itemcategory != 'EGGS' && !savedOrderResonce[i]['has_vat'] ){
                    let sitem = savedOrderResonce[i]['sale_item_rel']['name'];
                    let salePrice = savedOrderResonce[i]['sale_price'];
                    let qty = savedOrderResonce[i]['qty'];
                    let amount = ((savedOrderResonce[i]['sale_price'] * savedOrderResonce[i]['qty']).toFixed(2)).toString();
                    let vat = 0;


                    totalAmount = (parseFloat(totalAmount));
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
                        [qty, '$'+salePrice,'$'+amount],
                    {});
                    await BluetoothEscposPrinter.printText('\n\r', {});
                }
            }
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.RIGHT,
            );
            await BluetoothEscposPrinter.printText(
                'Total:'+(WithoutVatProductTotal).toFixed(2),
                {
                }
            );
            await BluetoothEscposPrinter.printText('\n\r', {});

            await BluetoothEscposPrinter.printText(
                '--------------------------------\n\r',
                {},
            );
        }

        let columnWidthsVat = [2,2,14,10];
        await BluetoothEscposPrinter.printColumn(
            columnWidthsVat,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['', '', 'Grand Total: ','$'+(WithoutVatProductTotal+VatProductTotal).toFixed(2)],
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
    };

    printReceipt = () => {
        if( device != undefined ){
            BluetoothManager.connect(device).then( (res) => {
    
                printDesign()
            },(e) => {
            });
        }else{
            alert('printer not connected');
        }

    };
    function changeCreditStatus(status) {
		setCreditStatus(status)
	}

	
	return (
        ( win.width > 550)?
            <View style={styles.bodyContainer }>
                <View style={{flexDirection: 'row',borderWidth: 1 ,borderColor: 'red',height: '100%'}}>
                    <View style={{width: '50%'}} >
                              <ScrollView>
                    <View >
                        <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'white',textAlign: 'center'}}>
                            Invoice
                        </Text>
                        <Text style={{ fontSize: 30,textAlign: 'center'}}>UK Inch</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>94 Staceway Worth, Crawley, RH107YR</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>Phone: 07917105510</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>Email: Ekinch2@gmail.com</Text>
                        <Text style={{ fontSize: 15,textAlign: 'left',marginLeft: 20}}>INVOICE: {(savedOrderResonce != undefined)? savedOrderResonce[0]['invoice'] : ''}</Text>
                        <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20,borderBottomColor:'black',borderTopColor:'black',borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1,padding: 10 }}>
                            <Text style={{fontWeight: 'bold',width: 100}}>Customer</Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}>Date: { (savedOrderResonce != undefined) ? savedOrderResonce[0]['ddate'] : ''   }</Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Name: </Text>
                            <Text style={{}}>{(savedBuyerData != undefined) ? savedBuyerData['name'] : ''} </Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Address: </Text>
                            <Text style={{textAlign: 'left'}}>{(savedBuyerData != undefined) ? savedBuyerData['address'] : ''} </Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Phone: </Text>
                            <Text style={{}}>{(savedBuyerData != undefined) ? savedBuyerData['contact_no'] : ''} </Text>
                        </View>
                        {( hasNonVatProducts ) ?
                            <View>
                                {/* <View style={{marginTop: 20,paddingTop: 10,borderTopColor: 'black', borderTopWidth: 1}}><Text style={{justifyContent: 'center',textAlign: 'center',fontWeight:'bold'}}>Items without VAT</Text></View> */}
                                <View style={{ flex: 0.2,borderTopColor: 'black', borderTopWidth: 1, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,borderBottomColor:'black',marginTop: 20,borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1 ,padding: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Qty</Text>
                                    <Text style={{fontWeight: 'bold'}}>Price</Text>
                                    <Text style={{fontWeight: 'bold'}}>Amount</Text>
                                    <Text style={{fontWeight: 'bold'}}>VAT</Text>
                                    <Text style={{fontWeight: 'bold'}}>Total(inc)</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                </View>
                            </View>                                
                        :
                            <View></View>
                        }
                                
                            {(savedOrderResonce != undefined) ?
                                savedOrderResonce.map((value , key) => {
                                    
                                    return (
                                        <View key={key} >
                                            {( value['sale_item_rel'].itemcategory == 'EGGS' ) ?
                                                <View style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}> </Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        {/* <Text style={{ width: 90}}>{value['sale_item_rel'].name}</Text> */}
                                                        <Text style={{ }}>{value['qty']}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'])}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'] * value['qty']).toFixed(2)}</Text>
                                                        <Text style={{ }}>£ 0</Text>
                                                        <Text style={{ }}>£{((value['sale_price'] * value['qty']).toFixed(2)).toString()}</Text>
                                                    </View>
                                                </View>
                                            :
                                                <View></View>
                                            } 
                                            {( value['sale_item_rel'].itemcategory != 'EGGS' && value.has_vat ) ?
                                                
                                                <View style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}> </Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        {/* <Text style={{ width: 90}}>{value['sale_item_rel'].name}</Text> */}
                                                        <Text style={{ }}>{value['qty']}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'])}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'] * value['qty']).toFixed(2)}</Text>
                                                        <Text style={{ }}>£{((((value['qty'] * value['sale_price'])*1.20)) -  (value['qty'] * value['sale_price'])).toFixed(2)}</Text>
                                                        <Text style={{ }}>£{( parseFloat((value['sale_price'] * value['qty']).toFixed(2)) * 1.20).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            :
                                                <View></View>
                                            } 
                                        </View>
                                    )
                                })
                                
                            : 
                                <View></View>
                            }
                            <View style={{flexDirection:'row' ,justifyContent: 'space-between',marginTop: 20}}>
                                <Text></Text>
                                {/* <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Totall:</Text> £{totalAmountVat.toFixed(2)}</Text> */}
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total:</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}></Text> </Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VATTotal).toFixed(2)}</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VatProductTotal-VATTotal).toFixed(2)}</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VatProductTotal).toFixed(2)}</Text></Text>
                            </View>
                            
                            {( WithoutVatProductTotal > 0 ) ?
                                <View>
                                    <Text style={{textAlign: 'center',marginTop: 30,marginBottom: 10}}>*******************************</Text>
                                    {/* <View style={{marginTop: 20,paddingTop: 10,borderTopColor: 'black', borderTopWidth: 1}}><Text style={{justifyContent: 'center',textAlign: 'center',fontWeight:'bold'}}>Items with VAT</Text></View> */}
                                    <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',borderTopColor: 'black', borderTopWidth: 1,paddingHorizontal: 20,borderBottomColor:'black',borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1 ,padding: 10}}>
                                        <Text style={{fontWeight: 'bold'}}>Qty</Text>
                                        <Text style={{fontWeight: 'bold'}}>Price</Text>
                                        {/* <Text style={{fontWeight: 'bold'}}>VAT</Text> */}
                                        <Text style={{fontWeight: 'bold'}}>Amt(inc)</Text>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                    </View>
                                </View>
                            :
                                <View></View>
                            }
                            
                            {(savedOrderResonce != undefined) ?
                                savedOrderResonce.map((value , key) => {

                                    return (
                                        <View key={key} >
                                            {( value['sale_item_rel'].itemcategory != 'EGGS' && !value.has_vat  ) ?
                                                <View key={key} style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}></Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        <Text style={{ }}>{value['qty']}</Text>
                                                        <Text style={{ }}>£{value['sale_price']}</Text>
                                                        {/* <Text style={{ }}>£ 0</Text> */}
                                                        <Text style={{ }}>£{((value['sale_price'] * value['qty']).toFixed(2)).toString()}</Text>
                                                    </View>
                                                    {/* <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        <Text style={{ width: 90}}>{}</Text>
                                                        <Text style={{ }}>{}</Text>
                                                        <Text style={{ fontWeight: 'bold'}}>VAT</Text>
                                                        <Text style={{ }}>£{((value['sale_price']*100) / 120).toFixed(2)}</Text>
                                                    </View> */}

                                                </View>
                                            :
                                                <View></View>
                                            }
                                        </View>
                                    )
                                })
                            : 
                                <View></View>
                            }
                            {(WithoutVatProductTotal > 0)?    
                                <View style={{flexDirection:'row' ,justifyContent: 'space-between',marginTop: 20}}>
                                    <Text></Text>
                                    {/* <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total:</Text> £{(totalAmountWithoutVat).toFixed(2)}</Text> */}
                                    <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total: £{(WithoutVatProductTotal).toFixed(2)}</Text></Text>
                                </View>
                            :
                                <View></View>
                            }
                        <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{fontWeight: 'bold',width: 100}}></Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}>Grand Total:</Text>
                            <Text style={{fontWeight: 'bold'}}>£{(VatProductTotal + WithoutVatProductTotal).toFixed(2)}</Text>
                        </View>
                    </View>
                </ScrollView>

                    </View>
                    <View style={{ width: '50%'}}>
                        <View style={{ flex: 2.5 ,width: '100%' }}>
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
    
                        <View  style={{ flex: 1 ,width: '100%' }}>
                            <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'lightgrey',textAlign: 'center'}}>
                                Remarks
                            </Text>
                            <Input row="4" placeholder="Add Remarks" value={remarks} allowFontScaling={false} onChange={(value) => {setRemarks(value.nativeEvent.text)}}/>
                        </View>
                        <View  style={{ flex: 1 ,width: '100%' }}>
                            <Button title="Print" onPress={() => { printReceipt() }} />
                        </View>
                        <View style={{flex: 2}}></View>
    
                    </View>
                </View>
            </View>
    
        :
        <View style={styles.bodyContainer}>
            <View style={{ flex: 0.35 ,width: '100%' }}>
                <ScrollView>
                    <View >
                        <Text style={{fontSize: 20, color: 'black', fontWeight: '700',backgroundColor: 'white',textAlign: 'center'}}>
                            Invoice
                        </Text>
                        <Text style={{ fontSize: 30,textAlign: 'center'}}>UK Inch</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>94 Staceway Worth, Crawley, RH107YR</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>Phone: 07917105510</Text>
                        <Text style={{ fontSize: 15,textAlign: 'center'}}>Email: Ekinch2@gmail.com</Text>
                        <Text style={{ fontSize: 15,textAlign: 'left',marginLeft: 20}}>INVOICE: {(savedOrderResonce != undefined)? savedOrderResonce[0]['invoice'] : ''}</Text>
                        <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20,borderBottomColor:'black',borderTopColor:'black',borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1,padding: 10 }}>
                            <Text style={{fontWeight: 'bold',width: 100}}>Customer</Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}>Date: { (savedOrderResonce != undefined) ? savedOrderResonce[0]['ddate'] : ''   }</Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Name: </Text>
                            <Text style={{}}>{(savedBuyerData != undefined) ? savedBuyerData['name'] : ''} </Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Address: </Text>
                            <Text style={{textAlign: 'left'}}>{(savedBuyerData != undefined) ? savedBuyerData['address'] : ''} </Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection:'row',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{width: 100}}>Phone: </Text>
                            <Text style={{}}>{(savedBuyerData != undefined) ? savedBuyerData['contact_no'] : ''} </Text>
                        </View>
                        {( hasNonVatProducts ) ?
                            <View>
                                {/* <View style={{marginTop: 20,paddingTop: 10,borderTopColor: 'black', borderTopWidth: 1}}><Text style={{justifyContent: 'center',textAlign: 'center',fontWeight:'bold'}}>Items without VAT</Text></View> */}
                                <View style={{ flex: 0.2,borderTopColor: 'black', borderTopWidth: 1, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,borderBottomColor:'black',marginTop: 20,borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1 ,padding: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Qty</Text>
                                    <Text style={{fontWeight: 'bold'}}>Price</Text>
                                    <Text style={{fontWeight: 'bold'}}>Amount</Text>
                                    <Text style={{fontWeight: 'bold'}}>VAT</Text>
                                    <Text style={{fontWeight: 'bold'}}>Total(inc)</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                </View>
                            </View>                                
                        :
                            <View></View>
                        }
                                
                            {(savedOrderResonce != undefined) ?
                                savedOrderResonce.map((value , key) => {
                                    
                                    return (
                                        <View key={key} >
                                            {( value['sale_item_rel'].itemcategory == 'EGGS' ) ?
                                                <View style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}> </Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        {/* <Text style={{ width: 90}}>{value['sale_item_rel'].name}</Text> */}
                                                        <Text style={{ }}>{value['qty']}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'])}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'] * value['qty']).toFixed(2)}</Text>
                                                        <Text style={{ }}>£ 0</Text>
                                                        <Text style={{ }}>£{((value['sale_price'] * value['qty']).toFixed(2)).toString()}</Text>
                                                    </View>
                                                </View>
                                            :
                                                <View></View>
                                            } 
                                            {( value['sale_item_rel'].itemcategory != 'EGGS' && value.has_vat ) ?
                                                
                                                <View style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}> </Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        {/* <Text style={{ width: 90}}>{value['sale_item_rel'].name}</Text> */}
                                                        <Text style={{ }}>{value['qty']}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'])}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'] * value['qty']).toFixed(2)}</Text>
                                                        <Text style={{ }}>£{((((value['qty'] * value['sale_price'])*1.20)) -  (value['qty'] * value['sale_price'])).toFixed(2)}</Text>
                                                        <Text style={{ }}>£{( parseFloat((value['sale_price'] * value['qty']).toFixed(2)) * 1.20).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            :
                                                <View></View>
                                            } 
                                        </View>
                                    )
                                })
                                
                            : 
                                <View></View>
                            }
                            <View style={{flexDirection:'row' ,justifyContent: 'space-between',marginTop: 20}}>
                                <Text></Text>
                                {/* <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Totall:</Text> £{totalAmountVat.toFixed(2)}</Text> */}
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total:</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}></Text> </Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VATTotal).toFixed(2)}</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VatProductTotal-VATTotal).toFixed(2)}</Text></Text>
                                <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}> £{(VatProductTotal).toFixed(2)}</Text></Text>
                            </View>
                            
                            {( WithoutVatProductTotal > 0 ) ?
                                <View>
                                    <Text style={{textAlign: 'center',marginTop: 30,marginBottom: 10}}>*******************************</Text>
                                    {/* <View style={{marginTop: 20,paddingTop: 10,borderTopColor: 'black', borderTopWidth: 1}}><Text style={{justifyContent: 'center',textAlign: 'center',fontWeight:'bold'}}>Items with VAT</Text></View> */}
                                    <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',borderTopColor: 'black', borderTopWidth: 1,paddingHorizontal: 20,borderBottomColor:'black',borderLeftColor:'transparent',borderRightColor:'transparent',borderWidth: 1 ,padding: 10}}>
                                        <Text style={{fontWeight: 'bold'}}>Qty</Text>
                                        <Text style={{fontWeight: 'bold'}}>Price</Text>
                                        {/* <Text style={{fontWeight: 'bold'}}>VAT</Text> */}
                                        <Text style={{fontWeight: 'bold'}}>Amt(inc)</Text>
                                    </View>
                                    <View style={{marginTop: 10}}>
                                    </View>
                                </View>
                            :
                                <View></View>
                            }
                            
                            {(savedOrderResonce != undefined) ?
                                savedOrderResonce.map((value , key) => {

                                    return (
                                        <View key={key} >
                                            {( value['sale_item_rel'].itemcategory != 'EGGS' && !value.has_vat  ) ?
                                                <View key={key} style={{ borderBottomColor: '#ededed', borderBottomWidth: 1,paddingVertical: 15 }}>
                                                    <Text style={{ width: '100%',marginLeft: 20}}><Text style={{ fontWeight: 'bold' }}></Text>{value['sale_item_rel'].name}</Text>
                                                    <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        <Text style={{ }}>{(value['qty']).toFixed(2)}</Text>
                                                        <Text style={{ }}>£{(value['sale_price'])}</Text>
                                                        {/* <Text style={{ }}>£ 0</Text> */}
                                                        <Text style={{ }}>£{((value['sale_price'] * value['qty']).toFixed(2)).toString()}</Text>
                                                    </View>
                                                    {/* <View key={key} style={{flex: 0.2,flexDirection: 'row',justifyContent:'space-between',paddingHorizontal: 20}}>
                                                        <Text style={{ width: 90}}>{}</Text>
                                                        <Text style={{ }}>{}</Text>
                                                        <Text style={{ fontWeight: 'bold'}}>VAT</Text>
                                                        <Text style={{ }}>£{((value['sale_price']*100) / 120).toFixed(2)}</Text>
                                                    </View> */}

                                                </View>
                                            :
                                                <View></View>
                                            }
                                        </View>
                                    )
                                })
                            : 
                                <View></View>
                            }
                            {(WithoutVatProductTotal > 0)?    
                                <View style={{flexDirection:'row' ,justifyContent: 'space-between',marginTop: 20}}>
                                    <Text></Text>
                                    {/* <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total:</Text> £{(totalAmountWithoutVat).toFixed(2)}</Text> */}
                                    <Text style={{marginRight: 20}}><Text style={{fontWeight: 'bold'}}>Total: £{(WithoutVatProductTotal).toFixed(2)}</Text></Text>
                                </View>
                            :
                                <View></View>
                            }
                        <View style={{ flex: 0.2, flexDirection:'row',justifyContent: 'space-between',paddingHorizontal: 20,marginTop: 20}}>
                            <Text style={{fontWeight: 'bold',width: 100}}></Text>
                            <Text style={{fontWeight: 'bold'}}></Text>
                            <Text style={{fontWeight: 'bold'}}>Grand Total:</Text>
                            <Text style={{fontWeight: 'bold'}}>£{(VatProductTotal + WithoutVatProductTotal).toFixed(2)}</Text>
                        </View>
                    </View>
                </ScrollView>

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
                <Button title="Print" onPress={() => { printReceipt() }} />
            </View>
        </View>
	);
}
const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
        // justifyContent: 'space-around',
    },
    container: {
        // alignItems: 'center',
        height: 200,
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