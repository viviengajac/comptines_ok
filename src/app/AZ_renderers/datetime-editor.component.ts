import { Component,ViewChild,ViewContainerRef,AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-date-editor',
  template: `
	<input type="datetime-local" (change)="changeEvent($event)" value="{{ma_date}}">
    `
})
export class DatetimeEditorComponent implements ICellEditorAngularComp,AfterViewInit
{
	public ma_date:string='';
	public params:any=null;
@ViewChild('input', { read: ViewContainerRef }) public input: any;
	agInit(params: any): void
	{
//console.log('agInit de btnRenderer: params.onclick='+parametres.onClick+', params.label='+parametres.label);
		this.params = params;
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
	}
	getValue()
	{
		return this.ma_date;
	}
	isCancelAfterEnd(): boolean
	{
		return false;
	}
	ngAfterViewInit()
	{
	}
}