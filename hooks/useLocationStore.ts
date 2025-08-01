// hooks/useLocationStore.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { locationUpdate, locationDataUpdate } from '@/lib/store/location/locationStore';

export const useLocationStore = () => {
    const location = useSelector((state: RootState) => state.locationStore.location);
    const locationData = useSelector((state: RootState) => state.locationStore.data);
    const dispatch = useDispatch();

    const updateLocation = (data: any) => dispatch(locationUpdate(data));
    const updateLocationData = (data: any) => dispatch(locationDataUpdate(data));

    return { location, updateLocation, locationData,updateLocationData };
};
