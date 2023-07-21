import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';
// voir https://www.quirksmode.org/dom/inputfile.html
@Component({
  selector: 'app-btn-def-doc-renderer',
  template: `
<input type="file" id="DefDocRenderer" (change)="onCliquer($event)" [disabled]="inactif" class=" {{ m_classe_fonte }} ">
<!--input type="file" id="DefDocRenderer" (change)="onCliquer($event)" [disabled]="inactif" class="hidden">
<label for="DefDocRenderer" class=" {{ m_classe_fonte }} ">Définir</label-->
<!--input type="file" id="selectedFile" style="display: none;" (change)="onCliquer($event)" />
<input type="button" value="Définir" onclick="document.getElementById('selectedFile').click();" [disabled]="inactif" class=" {{ m_classe_fonte }} " /-->`
})
//<input type="file" (change)="onCliquer($event,$event.target.files)" [disabled]="inactif" class=" {{m_classe_fonte }} ">
export class BtnDefDocRendererComponent implements ICellRendererAngularComp
{
	params:any=null;
	inactif: boolean=false;
	label: string='';
	m_classe_fonte:string='';

	agInit(parametres:any): void
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

	onCliquer($event:any)
	{
//console.log('BtnDefdoc: onClick dans btnrenderer');
		if (this.params.onClick instanceof Function)
		{
//console.log('test passé');
			// put anything into params u want pass into parents component
			const parametres =
			{
				event: $event,
//				fic: $file,
				ligne_cliquee: this.params.node.data
				// ...something
			}
//console.log('avant appel');
			this.params.onClick(parametres);
//console.log('apres appel');
		}
	}
}