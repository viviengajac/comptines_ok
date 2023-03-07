import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-bool-renderer-non-modif',
  template: `
<input type="checkbox" #inputBox style="{{bool_actif}}" [ngModel]="bool_val" (change)="onCliquer($event,inputBox?.checked)">
    `
})
export class BoolRendererNonModifComponent implements ICellRendererAngularComp
{
	params;
	public bool_actif:string;
	public bool_val:boolean;
	m_classe_fonte:string;

	agInit(parametres): void
	{
		this.params = parametres;
		this.bool_val=this.params.value;
		this.bool_actif='pointer-events: none';
/*
console.log('agInit de boolRenderer: value=' + parametres.value+', bool_val='+this.bool_val);
if(this.bool_val)
	console.log('Vrai');
if(!this.bool_val)
	console.log('Faux');
*/
		this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('BtnDefDocRendererComponent: value='+this.params.value+', inactif='+this.inactif);
	}

	refresh(parametres?: any): boolean
	{
		return true;
	}

	/* onCliquer(event: Event & {
		target: HTMLButtonElement
	  }) {
		const { target } = event
		const ischecked = (<HTMLInputElement>event.target).checked
		console.log(target.value);
	  } */

	//onCliquer($event,$checked)
	onCliquer($event,$checked)
	{
console.log('onClick dans btnrenderer');
		if (this.params.onClick instanceof Function)
		{
console.log('test passé');
			// put anything into params u want pass into parents component
			
			const parametres =
			{
				event: $event,
				checked:$checked,
				detail: this.params.node.data
				// ...something
			}
console.log('avant appel');
			this.params.onClick(parametres);
console.log('apres appel');
		}
	}
}