import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-btn-def-doc-renderer',
  template: `
<input type="file" (change)="onCliquer($event)" [disabled]="inactif" class=" {{m_classe_fonte }} ">
    `
})
// était en 2nd paramètre de onCliquer() ligne au dessus:   ,$event.target.files
export class BtnDefDocRendererComponent implements ICellRendererAngularComp
{
	params;
	inactif: boolean;
	label: string;
	m_classe_fonte:string;

	agInit(parametres): void
	{
//console.log('agInit de btnDefDocRenderer: params.onclick='+parametres.onClick+', params.label='+parametres.label+', params.actif='+parametres.actif+', value=' + parametres.value);
		this.params = parametres;
		if(this.params.value>0 && GlobalConstantes.m_nivo_ecr==2)
			this.inactif = false;
		else
			this.inactif=true;
		this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('BtnDefDocRendererComponent: value='+this.params.value+', inactif='+this.inactif);
		this.label = this.params.label || null;
	}

	refresh(parametres?: any): boolean
	{
		return true;
	}

	// ne marche plus avec deux paramètres: onCliquer($event,$file)
	onCliquer($event)
	{
//console.log('BtnDefdoc: onClick dans btnrenderer');
		if (this.params.onClick instanceof Function)
		{
//console.log('test passé');
			// put anything into params u want pass into parents component
			const parametres =
			{
				event: $event,
				//fic: $file,
				detail: this.params.node.data
				// ...something
			}
//console.log('avant appel');
			this.params.onClick(parametres);
//console.log('apres appel');
		}
	}
}