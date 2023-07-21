import { Component,ViewChild,ViewContainerRef,AfterViewInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
//import { ICellEditorParams } from 'ag-grid-community';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-img-renderer',
  template: `<img width="50" [src]="img_src" >`
})
//  template: `<img width="100" [ngModel]="src">`
export class ImgRendererComponent implements ICellRendererAngularComp //,AfterViewInit
{
	public params:any=null;
	public img_src:string='vide.jpg';
	agInit(params:any): void
	{
		this.params = params;
//console.log('ImgRenderercomponent');
//console.log(params);
//console.log(params.node.data);
		var nom_photo=GlobalConstantes.FaireUrl()+'BLOBS/vide.jpg';
		var type_fic=this.params.node.data['id_type_ficWITH'];
//console.log('type_fic='+type_fic);
		switch(type_fic)
		{
			case '.jpg':
			case '.gif':
			case '.png':
				nom_photo=this.params.node.data['img'].replace('[BLOBS]',GlobalConstantes.FaireUrl()+'BLOBS');
				break;
		}
//console.log('nom_photo='+nom_photo);
		this.img_src=nom_photo;
	}
	refresh(parametres?: any): boolean
	{
//console.log('refresh de cboeditorcomponent: voir parametres');
//console.log(parametres);
		return true;
	}
	isCancelAfterEnd(): boolean
	{
		return false;
	}
	isPopup()
	{
		return true;
	}
}