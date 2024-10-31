@nearBindgen
export class Rating {
    message : string;
    sender : string;
    courseId:string;
    rate:i32;
    hasUpdated: bool;
    constructor (sender:string , courseId:string , rate:f64 , message:string ="" ){
        this.message = message;
        this.sender = sender;
        this.courseId = courseId;
        this.rate = <i32>rate;
        this.hasUpdated = false;
    }
}