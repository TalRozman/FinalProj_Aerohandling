export default interface IProfile {
    phoneNum:String,
    address: String,
    birthDate: String,
    user:number,
    needTaxi: boolean,
    image?: string,
    role?:number,
    department?:number,
    type?:number,
}