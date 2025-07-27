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
    
}