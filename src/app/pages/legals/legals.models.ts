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

 export interface Question{ 
    id:number
    question: string
    answer: string
    cat?: string
 }

 export interface CatsListResponse{
    cats: Cat[]
}

export interface Cat{
    catCode: string; 
    enDesc: string;
    esDesc: string; 
}

export interface QyADataModal{
    lenguage: "ES"|"EN",
    editMode: boolean,
    question?: Question 
}