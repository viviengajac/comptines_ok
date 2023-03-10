import { Component,ViewChild,ViewContainerRef,AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-date-editor',
  template: `
	<input type="date" (change)="changeEvent($event)" value="{{ma_date}}">
    `
})
export class DateEditorComponent implements ICellEditorAngularComp,AfterViewInit
{
	public ma_date:string='';
	public params:any=null;
@ViewChild('input', { read: ViewContainerRef }) public input:any;
	agInit(params:any): void
	{
//console.log('agInit de btnRenderer: params.onclick='+parametres.onClick+', params.label='+parametres.label);
		this.params = params;
//console.log('DataEditorComponent.agInit: params='+params+', params.data='+params.data+', params.data.type='+params.data.type+', params.value='+params.value);
		this.ma_date=params.value;
	}
	refresh(parametres?: any): boolean
	{
		return true;
	}
	changeEvent(event:any)
	{
		// Return date object
		this.ma_date=""+event.target.value;
//console.log('DateEditorComponent: ma_date='+this.ma_date);
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