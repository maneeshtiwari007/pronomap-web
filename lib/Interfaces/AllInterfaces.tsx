export interface EnquiryListCardInterface {
    item?:any
    onChangeEnquiryStatus?:Function,
    userInformation?:any
}
export interface GooglePlacesAutocompleteInterface {
    onChangeLocation?:Function;
    data?:any;
    childClass?:any;
    className?:any;
    marginClass?:any;
    addHiddenInput?:boolean
}

export interface SessionStorageInteface {
    create:Function;
    get:Function;
    remove:Function;
}

export interface BusinessDetailSidePannelCallToActionTopInteface {
    apiData?:any;
}

export interface SessionUserInterface {
    user?: any,
    signOut?: Function
}

export interface BlogListingComponentInterface {
    params?:any
}
export interface BlogIconsInterface {
    params?:BlogIconsParamsInterface
}
export interface BlogIconsParamsInterface {
    index?:number
}
export interface SupportTicketListCardInterface {
    item?:any
    onChangeSupportStatus?:Function,
    userInformation?:any;
    onClickReply?:Function
}

export interface SupportChatCardInterface {
    type?:string;
    chat?:any
}

export interface ConfirmationAlertInterface {
    data?:any;
    onConfirm?:Function;
    onCancel?:Function;
    isOpenPopup?:boolean
}