import { Component,ViewChild,ViewContainerRef,AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-date-editor',
  template: `
	<input type="datetime-local" (change)="changeEvent($event)" value="{{ma_date}}" class="{{m_classe_fonte}}">
    `
})
export class DatetimeEditorComponent implements ICellEditorAngularComp //,AfterViewInit
{
	public ma_date:string='';
	public params:any=null;
	public m_classe_fonte:string='';
	public modifiable:string='';
@ViewChild('input', { read: ViewContainerRef }) public input: any;
	agInit(params: any): void
	{
//console.log('agInit de btnRenderer: params.onclick='+parametres.onClick+', params.label='+parametres.label);
		this.params = params;
		this.m_classe_fonte=params.colDef.cellClass;
		if (params.modifiable == false)
			this.modifiable='pointer-events: none';
//console.log('DataEditorComponent.agInit: params='+params+', params.data='+params.data+', params.data.type='+params.data.type+', params.value='+params.value);
		/*
		if(params.value.endsWith(":00")) {
			this.ma_date=params.value.substring(0,17)+"01";
		}
		else {
			this.ma_date=params.value;
		}
		*/
		if(params.value.length!=19)
		{
			//console.log("CHANGE= "+params.value+"+:00")
			this.ma_date=params.value+":00";
		}
		else
			this.ma_date=params.value;
	}
	refresh(parametres?: any): boolean
	{
		return true;
	}
	changeEvent(event:any)
	{
		// Return date object
		/*
		if(event.target.value.endsWith(":00")) {
			this.ma_date=""+event.target.value+":00";
		}
		else {
			this.ma_date=""+event.target.value;
		}
		*/
		//dans certains cas où les secondes sont = à 00, le champ de saisie de la date renvoie une valeur fausse avec heures et minutes uniquement
		//on ajoute les secondes pour éviter une erreur
		if(event.target.value.length!=19)
		{
			//console.log("CHANGEEvent= "+event.target.value+"+:00")
			this.ma_date=event.target.value+":00";
		}
		else
			//this.ma_date=event.target.value;
			this.ma_date=""+event.target.value;
//console.log('XXXX= DateHeureEditorComponent: ma_date='+this.ma_date);
		if (this.params.onClick instanceof Function)
		{
//console.log('changeEvent de cboeditorcomponent: voir event');
//console.log(event);
/*
			var t:HTMLInputElement=event.target;
//console.log(t);
			var nom_elem=t.name;
//console.log(nom_elem);
			var val:any=t.value;
//console.log(val);
			this.m_id=val;
*/
//console.log('CboEditorComponent: m_id='+this.m_id);
			const parametres =
			{
				event: event,
				date_saisie:this.ma_date,
				ligne_cliquee: this.params.node.data,
				nom_col_cliquee: this.params.nom_col_cliquee
				// ...something
			}
//console.log('avant appel');
			this.params.onClick(parametres);
//console.log('apres appel');
		}
	}
	getValue()
	{
		return this.ma_date;
	}
	isCancelAfterEnd(): boolean
	{
		return false;
	}
	/*
	ngAfterViewInit()
	{
	}
	*/
}