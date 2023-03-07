import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT,Location } from '@angular/common';
import { GlobalConstantes } from './AZ_common/global_cst';
import { NavigationEnd,Router } from '@angular/router';
/*
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy
{
	m_appel_par_href:boolean;
	title = 'Comptines';
    constructor	(@Inject(DOCUMENT) private document: Document,private renderer: Renderer2,private router:Router,private loc_angular:Location)
	{
//console.log('classe de renderer='+this.renderer.constructor.name);
	}

    ngOnInit(): void
	{
		GlobalConstantes.m_app=this;
		GlobalConstantes.m_app_doc=this.document;
		GlobalConstantes.m_renderer=this.renderer;
		GlobalConstantes.m_classe_fonte='moyenne';
//		GlobalConstantes.m_base_url=window.location.href;
//console.log('app.component.onNgInit: location=');
//console.log(this.loc_angular);
//console.log('base url='+window.location+' ou '+window.location.origin+' ou '+window.location.href+' ou '+window.location.pathname);
//console.log('AppComponent: ngOnInit: classe de GlobalConstantes.m_app='+GlobalConstantes.m_app.constructor.name);
//console.log('AppComponent: ngOnInit: classe de GlobalConstantes.m_app_doc='+GlobalConstantes.m_app_doc.constructor.name);
//console.log('AppComponent: ngOnInit: classe de GlobalConstantes.m_renderer='+GlobalConstantes.m_renderer.constructor.name);
/*
		this.router.events.subscribe(value => { this.url=this.router.url.toString();});
console.log('AppComponent: ngOnInit: this.router');
console.log(this.router);
console.log('AppComponent: ngOnInit: this.router.currentUrlTree');
console.log(this.router.currentUrlTree);
console.log('AppComponent: ngOnInit: this.url');
console.log(this.url);
*/
		const p='p=';
		const idx=window.location.href.indexOf(p);
//console.log('app_component.ngOnInit: idx='+idx);
		if(idx>0)
		{
			const params=window.location.href.substring(idx+p.length);
//console.log('app_component.ngOnInit: params bruts='+params);
			const tab_params:string[]=params.split('|');
//console.log('app_component.ngOnInit: params tab='+tab_params);
//console.log('app_component.ngOnInit: params[0]='+tab_params[0]);
			GlobalConstantes.m_id_prs = +tab_params[0];
			GlobalConstantes.m_num_ecran_appele= +tab_params[1];
			GlobalConstantes.m_num_bloc_appele= +tab_params[2];
			GlobalConstantes.m_id_appele = +tab_params[3];
			GlobalConstantes.m_classe_fonte= GlobalConstantes.NomClasseFonte(+tab_params[4]);
			this.m_appel_par_href=true;
//console.log('app_component.ngOnInit: params='+GlobalConstantes.m_id_prs+','+GlobalConstantes.m_num_ecran_appele+','+GlobalConstantes.m_id_appele+','+GlobalConstantes.m_classe_fonte);
			this.router.navigate(['menu']);
		}
		else
		{
			this.m_appel_par_href=false;
		}
		/*
		const sep='&';
		const tab_params:string[]=['id_prs','nom_ecran','id','fonte'];
		var traiter_query_params:boolean=false;
		var par1:boolean=false;
		var par2:boolean=false;
		var par3:boolean=false;
		var par4:boolean=false;
		for(let param of tab_params)
		{
			const p=param+'=';
			const idx=window.location.href.indexOf(p);
			if(idx>0)
			{
				var val:string;
				var val2:string;
				var val_num:number;
				const test=window.location.href.substring(idx);
				const idx_f=test.indexOf(sep);
				if(idx_f>0)
				{
					val=test.substring(0,idx_f);
				}
				else
				{
					val=test;
				}
				val2=val.substring(p.length);
//console.log('param='+param+', val='+val+', lg de val='+val.length+', val2='+val2);
//console.log('app.component.ngOnInit: m_id_prs avant='+GlobalConstantes.m_id_prs);
				switch(param)
				{
					case 'id_prs':
						val_num = +val2;
//console.log('app.component.ngOnInit: val='+val2+', val_num='+val_num);
						GlobalConstantes.m_id_prs = val_num;
						par1=true;
//console.log('app.component.ngOnInit: m_id_prs='+GlobalConstantes.m_id_prs);
						break;
					case 'nom_ecran':
						GlobalConstantes.m_ecran_appele=val2;
						par2=true;
//console.log('app.component.ngOnInit: m_ecran_appele='+GlobalConstantes.m_ecran_appele);
						break;
					case 'fonte':
						GlobalConstantes.m_classe_fonte=val;
						par3=true;
//console.log('app.component.ngOnInit: m_ecran_appele='+GlobalConstantes.m_ecran_appele);
						break;
					case 'id':
						val_num = +val2;
//console.log('app.component.ngOnInit: val='+val2+', val_num='+val_num);
						GlobalConstantes.m_id_appele = val_num;
						par4=true;
//console.log('app.component.ngOnInit: m_id_appele='+GlobalConstantes.m_id_appele);
						break;
				}
			}
		}
		if (par1 && par2 && par3 && par4)
		{
			this.router.navigate(['menu']);
		}
		*/
//console.log('fin de AppComponent.constructeur: global_cst.id_prs='+GlobalConstantes.m_id_prs);
		var fonte=GlobalConstantes.m_classe_fonte;
        this.renderer.addClass(this.document.body, fonte);
    }

    ngOnDestroy(): void
	{
		var fonte=GlobalConstantes.m_classe_fonte;
        this.renderer.removeClass(this.document.body, fonte);
    }
}
