import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-btn-detail-renderer',
  template: `
    <button type="button" (click)="onCliquer($event)" class=" {{m_classe_fonte}} ">Détail</button>
    `
})
export class BtnDetailRendererComponent implements ICellRendererAngularComp
{
	params:any=null;
	label: string='';
	m_classe_fonte:string='';

	agInit(parametres:any): void
	{
		this.params = parametres;
		this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('agInit de btnVoirDocRenderer: params.value='+parametres.value+', inactif='+this.inactif);
		this.label = this.params.label || null;
	}

	refresh(parametres?: any): boolean
	{
		return true;
	}

	onCliquer($event:any)
	{
console.log('onClick dans btnDetailRenderer');
		if (this.params.onClick instanceof Function)
		{
//console.log('test passé');
			// put anything into params u want pass into parents component
			const parametres =
			{
				event: $event,
				ligne_cliquee: this.params.node.data
				// ...something
			}
console.log('avant appel');
			this.params.onClick(parametres);
console.log('apres appel');
		}
	}
}