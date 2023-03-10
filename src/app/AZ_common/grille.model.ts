import { GridOptions } from 'ag-grid-community';
import { Ecran } from '../AZ_services/ecran';

export class RefEcran
{
	constructor(public componentParent:Ecran){}
}
export class OptionsGrille implements GridOptions
{
	public rowData:any;
	public columnDefs:any;
	public rowHeight?:number;
	public getRowHeight:any;
	public context:RefEcran;
//	public getRowClass:any;
	public getRowStyle:any;
	constructor(ecran:Ecran)
	{
		this.context=new RefEcran(ecran);
//		this.getRowHeight=function(params){ return params.node.group ? 50 : 20;}	//  { return params.node.group ? 50 : 20;}
	}
}