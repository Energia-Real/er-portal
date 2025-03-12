import { GeneralResponse, NotificationMessages } from '@app/shared/models/general-models';

export interface QyAListResponse{
    cats: CatQyA[]
}

export interface CatQyA{
    lenguage:string
    desc: string
    catCode: string
    questions: Question[]
 }

 interface Question{ 
    id:number
    question: string
    answer: string
 }