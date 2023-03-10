import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-bool-renderer',
  template: `
<input type="checkbox" [ngModel]="bool_val" (change)="onCliquer($event)">
    `
})
//  <input type="checkbox" [ngModel]="bool_val" (change)="onCliquer($event)">

export class BoolRendererComponent implements ICellRendererAngularComp
{
	params:any=null;
	public bool_val:boolean=false;
	m_classe_fonte:string='';

	agInit(parametres:any): void
	{
//console.log('agInit de BoolRendererComponent');
//console.log(parametres);
		this.params = parametres;
		this.bool_val=this.params.value;
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

	onCliquer($event:any)
	{
//console.log('onClick dans btnrenderer');
		if (this.params.onClick instanceof Function)
		{
//console.log('test passé');
//console.log($event);
//console.log(this.params);
//console.log(this.params.nom_col);
			var v_nom_col:string=this.params.nom_col_cliquee;
			// put anything into params u want pass into parents component
			const parametres =
			{
				event: $event,
				checked:$event.target.checked,
				ligne_cliquee: this.params.node.data,
				nom_col_cliquee: v_nom_col
				// ...something
			}
//console.log('avant appel');
			this.params.onClick(parametres);
//console.log('apres appel');
		}
	}
}