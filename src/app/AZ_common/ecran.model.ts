import { CboListeItems } from '../AZ_common/cbo.model';
import { Ecran } from '../AZ_services/ecran';

export enum TypeColEcran { ClePrimaire=1,Chaine=2,Entier=3,CleEtrangere=4,Date=5,Booleen=6,VoirDocDb=7,DefDocDb=8,VoirDocFs=9,DefDocFs=10,Flottant=11,DateHeure=12,Dependances=13,BooleenNonModif=14}
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
export class ColonneCboEcran extends ColonneEcran
{
	constructor(public override m_nom_col:string,public override m_lib_col: string,public override m_type_col:TypeColEcran,public override m_visible:boolean,public override m_modifiable: ModifCol,public override m_inser_excel:boolean,public override m_inser_ecran:boolean,public override m_largeur:number,public m_nom_table:string)
	{
		super(m_nom_col,m_lib_col,m_type_col,m_visible,m_modifiable,m_inser_excel,m_inser_ecran,m_largeur);
	}
}
export enum TypeColSql { Entier=1,Chaine=2,Date=3,Booleen=4,Flottant=5}
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
	constructor(public field: string, public headerName: string, public sortable: boolean, public filter: any, public hide: boolean,public resizable:boolean,public editable:boolean,public width:number, public cellClass:string,public headerClass:string[])
	{
		this.wrapText=true;
		this.autoHeight=true;
		this.cellStyle={ "white-space": "normal" }
	}
	public wrapText:boolean=true;
	public autoHeight:boolean=true;
	public cellStyle: { "white-space": "normal" }
}
export class ParamsCbo
{
	constructor(public m_ecran:Ecran,public m_liste_items:CboListeItems,public m_nom_table:string){}
}
export class ColumnCbo extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean,public override width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
	}
	public valueFormatter: any;
	cellEditor: string='cboEditor';
	cellEditorParams:ParamsCbo;
//	cellEditorParams:CboFiltre;
}
export class ColumnDate extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
	}
	cellEditor: string='dateEditor';
}
export class ColumnDateHeure extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
	}
	cellEditor: string='datetimeEditor';
}
export class ColumnVoirDoc extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		this.cellRenderer='btnVoirDocRenderer';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnDefDoc extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		this.cellRenderer='btnDefDocRenderer';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnDependances extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		this.cellRenderer='btnDependancesRenderer';
		this.editable = false;
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnBool extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		this.cellRenderer='boolRenderer';
		this.editable = false;
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}
export class ColumnBoolNonModif extends ColDef
{
	constructor(public override field: string, public override headerName: string, public override sortable: boolean, public override filter: any, public override hide: boolean,public override resizable:boolean,public override editable:boolean, width:number,public override cellClass:string,public override headerClass:string[])
	{
		super(field,headerName,sortable,filter,hide,resizable,editable,width,cellClass,headerClass);
		this.cellRenderer='boolRendererNonModif';
	}
	public cellRenderer: string;
	public cellRendererParams:any;
}

