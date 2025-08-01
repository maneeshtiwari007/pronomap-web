import api from './axios'
import propertyData from '@/lib/api/properties.json';
export const ApiServices = {
    async getPropertyDetail(params:any){
        const propertyList:any = propertyData;
        const response:any = propertyList?.find((item:any)=>item?.slug===params)//await api.get('business/list?'+params);
        //return response?.data;
        return response;
    },
    async getFeaturedPropertyList(){
        const propertyList:any = propertyData;
        const response:any = propertyList?.slice(0, 6);//await api.get('business/list?'+params);
        //return response?.data;
        return response;
    },
    async getNewLunchedProperty(){
        const propertyList:any = propertyData;
        const response:any = propertyList?.find((item:any)=>item?.tags?.includes('New Launch'));//await api.get('business/list?'+params);
        //return response?.data;
        return (response?.length > 1)?response:[response];
    },
    async getDistinctLocationList(){
        const propertyList:any = propertyData;
        const distinctLocations = Array.from(
        new Set(propertyList?.map((p:any) => p?.location))
        );
        const response:any = distinctLocations;//await api.get('business/list?'+params);
        //return response?.data;
        return response?.slice(0,5);
    },
    async getPropertyBasedOnLocation(location:any=''){
        const propertyList:any = propertyData;
        const response:any = propertyList?.filter((item:any)=>item?.location?.includes(location));//await api.get('business/list?'+params);
        //return response?.data;
        return (response?.length > 0)?response:[response];//?.slice(0,3);
    },
    async getApiData(){
        const response:any = await api.get('http://localhost:8000/roles');
        return response?.data;
    }
}