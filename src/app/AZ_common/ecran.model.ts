import { ItemCbo } from '../AZ_common/cbo.model';
import { Ecran } from '../AZ_services/ecran';

export enum TypeColEcran { ClePrimaire=1,Chaine=2,Entier=3,CleEtrangere=4,Date=5,Booleen=6,VoirDocDb=7,DefDocDb=8,VoirDocFs=9,DefDocFs=10,Flottant=11,DateHeure=12,Dependances=13,Select=14, Detail=15,Image=16 }
export enum ModifCol { NonModifiable=1, Modifiable=2, Obligatoire=3 }
export class ColonneEcran
{
	constructor(public m_nom_col:string,public m_lib_col: string,public m_type_col:TypeColEcran,public m_visible:boolean,public m_modifiable: ModifCol,public m_inser_excel:boolean,public m_inser_ecran:boolean,public m_largeur:number) {}
	public EstModifiable():boolean
	{
		var modifiable:boolean=false;
		if(this.m_modifiable==ModifCol.Modifiable||this.m_modifiable==ModifCol.Obligatoire)
			modifiable=true;
		return modifiable;
	}
	public NomTablePourCbo():string
	{
		const nom_table=this.m_nom_col.substring(3);
		return nom_table;
	}
}
export enum TypeColSql {Entier=1,Chaine=2,Date=3,Booleen=4,Flottant=5}
export class ColonneSql
{
	constructor(public m_nom_col:string,public m_type_col:TypeColSql) {}
}
export class Cellule
{
	constructor(public m_num_col: number,public	m_val: any){}
}
	
export class Ligne
{
	constructor(public m_cellules:Cellule[]){}
	RecupererVal(num_col:number):any
	{
		var val:any;
		var i:number;
		for(i=0;i<this.m_cellules.length;i++)
		{
			if(this.m_cellules[i].m_num_col==num_col)
			{
				val=this.m_cellules[i].m_val;
			}
		}
		return val;
	}
}
export class ColDef
{
//	constructor(public field: string, public headerName: string, public sortable: boolean, public filter: any, public hide: boolean,public resizable:boolean,public editable:boolean,public width:number, public cellClass:string,public headerClass:string[])
	constructor(public field: string, public headerName: string, public sortable: boolean, public filter: any, public hide: boolean,public resizable:boolean,public editable:boolean,public width:number, public cellClass:string,public headerClass:string[],public cellEditorPopup:boolean)
	{
		this.wrapText=true;
		this.autoHeight=true;
//		this.cellStyle={ "white-space": "normal" }
//		this.cellStyle={ "white-space": "normal" }
		this.cellStyle={ "padding-left": 0, "padding-right": 0 }
	}
	public wrapText:boolean=true;
	public autoHeight:boolean=true;
//	public cellStyle: { "white-space": "normal" }
//	public cellStyle: { "white-space": "normal" }
	public cellStyle: { "padding-left": 0, "padding-right": 0 }
}
export class ColumnCbo extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean,public override width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,true);
		this.editable = false;
	}
	public valueFormatter: any;
	cellEditor: string='';
	cellEditorParams:any=null;
}
export class ColumnSelect extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean,public override width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,true);
	}
	public valueFormatter: any;
	cellEditor: string='agSelectCellEditor';
	cellEditorParams:any=null;
}
export class ColumnDate extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.editable = false;
	}
//	cellEditor: string='dateEditor';
	cellEditor: string='';
}
export class ColumnDateHeure extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.editable = false;
	}
//	cellEditor: string='datetimeEditor';
	cellEditor: string='';
}
export class ColumnVoirDoc extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='btnVoirDocRenderer';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnDefDoc extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='btnDefDocRenderer';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnDependances extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='btnDependancesRenderer';
		this.editable = false;
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnDetail extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='btnDetailRenderer';
		this.editable = false;
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnBool extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='boolRenderer';
		this.editable = false;
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnImg extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
//		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass,false);
		this.cellRenderer='ImgRenderer';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class DefChamp
{
	private m_num_champ:number=0;
	private m_nom_champ:string='';
	private m_lib_champ:string='';
	private m_code_type_champ:string='';
	private m_visible:boolean=true;
	private m_code_type_modif_champ:string='';
	private m_inser_excel:boolean=false;
	private m_inser_ecran:boolean=true;
	private m_lg_champ:number=0;
}