import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './client';

export const imagePrefix = 'https://staging.tauruspress.co.uk/';

export const checkLogin = ( postedData ) => {
	return new Promise( (resolve , reject) => {
		apiClient.post('driver-login' , { username : postedData.username , password : postedData.password}).then((response) => {
			if(response.data.status == true){
				resolve(response);
			}else{
				reject('Wrong User Details.');
			}
		});
	});
  // return 'true';
};

// get list vehicle
export const getVehicle = () => {
	return new Promise( (resolve , reject) => {
		apiClient.get('get-vehicles' ).then( (response) => {
			if( response.data.status == true ) {
				resolve(response.data.data);
			}else{
				reject('No vehicle available right now.');
			}
		} );
	})
}

// get list loads
export const getVehicleLoads = () => {
	return new Promise( (resolve , reject) => {
		apiClient.get('get-demands-list-by-vehicle/3' ).then( (response) => {
			if(response.status == 200){
				if( response.data.data.length > 0 ){
					resolve(response.data.data);
				}else{
					reject('No load available.');
				}
			}else{
				reject('No load available.');
			}
		} );
	})
}

// get list loads
// export const getVehicleLoads = () => {
	// 	return new Promise( (resolve , reject) => {
// 		apiClient.get('get-vehicles' ).then( (response) => {
// 			if( response.data.status == true ) {
	// 				resolve(response.data.data);
// 			}else{
	// 				reject('No vehicle available right now.');
// 			}
// 		} );
// 	})
// }



export const getItemsByVehicleAndLoads = ( vehicheId , load_numbers ) => {
	return new Promise( (resolve , reject) => {
		apiClient.post('get-load-items-by-vehicle-load' , { vehicle_id : vehicheId , load_numbers : JSON.parse(load_numbers)}).then((response) => {
			if(response.data.status == true){
				resolve(response);
			}else{
				reject(response.data.error);
			}
		});
	});
};
export const getVehicleLoadCount = ( vehicheId , load_numbers ) => {
	return new Promise( (resolve , reject) => {
		apiClient.post('get-count-by-vehicle-load' , { vehicle_id : vehicheId , load_numbers : JSON.parse(load_numbers)}).then((response) => {
			if(response.data.status == true){
				resolve(response);
			}else{
				reject(response.data.error);
			}
		});
	});
};


export const getSavedNotes = (  ) => {
	return new Promise( (resolve , reject) => {
		let vehicheNumber = '';
		AsyncStorage.getItem('vehicle_no').then((value) => {
			vehicheNumber = value;
			apiClient.get( 'get-vehile-notes/'+vehicheNumber ).then((response) => {
				if(response.data.status == true){
					resolve(response);
				}else{
					reject(response.data.error);
				}
			});
		});
	});
};

export const SaveVehicleNotes = ( newComment ) => {
	return new Promise( (resolve , reject) => {
		let vehicheNumber = '';
		AsyncStorage.getItem('vehicle_no').then((value) => {
			vehicheNumber = value;
			apiClient.post('save-vehile-notes' , { vehicle_number : vehicheNumber , comments : newComment}).then((response) => {
				if(response.data.status == true){
					resolve(response);
				}else{
					reject(response.data.error);
				}
			});
		});
	});
};

//get Today sale
export const getTodaySale = ( vehicheNumber , driverId ) => {
	return new Promise( (resolve , reject) => {
		apiClient.get( 'get-today-sales/'+vehicheNumber+'/'+driverId ).then((response) => {
			if(response.data.status == true){
				resolve(response);
			}else{
				reject(response.data.error);
			}
		});
	});
};


// https://staging.tauruspress.co.uk/backend/public/api/get-buyer-priortity-by-driver/12/4
//get Today sale
export const getPriorityDrivers = ( driverId , routeId ) => {
	return new Promise( (resolve , reject) => {
		console.log(driverId , routeId);
		apiClient.get( 'get-buyer-priortity-by-driver/'+driverId+'/'+routeId ).then((response) => {
			if(response.data.status == true){
			
				resolve(response);
			}else{
				reject(response.data.error);
			}
		});
	});
};