import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-btn-voir-doc-renderer',
  template: `
    <button type="button" (click)="onCliquer($event)" [disabled]="inactif" class=" {{m_classe_fonte}} ">{{label}}</button>
    `
})
export class BtnVoirDocRendererComponent implements ICellRendererAngularComp
{
	params;
	label: string;
	inactif:boolean;
	m_classe_fonte:string;

	agInit(parametres): void
	{
		this.params = parametres;
		if(parametres.value>0 && GlobalConstantes.m_nivo_exp==2)
			this.inactif=false;
		else
			this.inactif=true;
		this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('agInit de btnVoirDocRenderer: params.value='+parametres.value+', inactif='+this.inactif);
		this.label = this.params.label || null;
	}

	refresh(parametres?: any): boolean
	{
		return true;
	}

	onCliquer($event)
	{
//console.log('onClick dans btnrenderer');
		if (this.params.onClick instanceof Function)
		{
//console.log('test passé');
			// put anything into params u want pass into parents component
			const parametres =
			{
				event: $event,
				detail: this.params.node.data
				// ...something
			}
//console.log('avant appel');
			this.params.onClick(parametres);
//console.log('apres appel');
		}
	}
}