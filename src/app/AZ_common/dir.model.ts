
export enum TypeNd { Rep=1,Fic=2}
export class Nd
{
	constructor(public m_id_nd:number,public m_nom_nd:string,public m_type_nd:TypeNd,public m_id_nd_pere:number,public selectionne:boolean,public clique:boolean,public expanse:boolean) {}
}
