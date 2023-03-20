import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ModalService } from '../AZ_modal/modal.service';
import { Ecran } from '../AZ_services/ecran';
import { TypeNd } from '../AZ_common/dir.model';
import { TvNd } from './treeview.component';
import { AccesBdService } from '../AZ_services/acces_bd';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { AccesDir } from '../AZ_services/acces_dir';

@Component({
  selector: 'app-lecdir',
  templateUrl: './lecdir.component.html'
})
@Injectable()
export class LecDirComponent extends Ecran
{
	m_nd:TvNd;	//=null;	// TvNd;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient,formBuilder,modalService);
		this.m_nd=new TvNd(this.httpClient,this,'/',TypeNd.Rep,'c:');
//		this.formRecherche=this.formBuilder.group({ m_filtre_nom_dir: 'C:/Users/bertr/Documents/oitar/territoire_pm_nouveau'});
	}
	ngOnInit(): void
	{
//console.log('debut de NgInit de Lecdir');
		this.Init();
		if(GlobalConstantes.m_rep_fic=='')
		{
			var req:string='select rep_fic from prj';
			var ab=new AccesBdService(this.httpClient);
			ab.LireValeur(req)
			.then
			(
				res =>
				{
					var str_res=''+res;
					if(str_res.startsWith('Erreur'))
					{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 1');
						this.MessageErreur(str_res);
					}
					else
					{
//console.log('Lecdir.ngOnInit: res='+res);
						GlobalConstantes.m_rep_fic= str_res;
//console.log('Lecdir.ngOnInit: aprs LireValeur rep_fic='+GlobalConstantes.m_rep_fic);
						/*
						var ad: AccesDir=new AccesDir(this.httpClient);
//console.log('treeview.Ouvrir('+this.m_nd.m_repertoire+')');
						ad.LireDir(GlobalConstantes.m_rep_fic)
						.then
						(res=>
						{
//console.log('fin de la boucle: length='+this.m_nd.m_nd_fils.length);
							this.m_nd=new TvNd(this.httpClient,this,'/',TypeNd.Rep,GlobalConstantes.m_rep_fic);
						},
						err=>
						{
//							ret=err;
							ecran.MessageErreur("Erreur: le répertoire "+GlobalConstantes.m_rep_fic+" n'existe pas"););
						});
						*/
						this.TesterRep();
//console.log('EcranMaitreDetail.AppelerHref: id_maitre='+id_maitre);
					}
				},
				err =>
				{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 2');
					this.MessageErreur(err);
				}
			);
		}
		else
		{
//		this.m_nd=new TvNd(httpClient,this,'/',TypeNd.Rep,'C:/Users/bertr/Documents/oitar/territoire_pm_nouveau');
//console.log('Lecdir.ngOnInit:fin: rep_fic='+GlobalConstantes.m_rep_fic);
			this.TesterRep();
		}
//console.log('fin de NgInit de Prjcomponent');
	}
	TesterRep()
	{
//console.log('LecDirComponent.TesterRep: '+GlobalConstantes.m_rep_fic);
		var ad: AccesDir=new AccesDir(this.httpClient);
		ad.LireDir(GlobalConstantes.m_rep_fic)
		.then
		(res=>
		{
			var str_res:string=""+res;
//console.log('str_res='+str_res);
			if(str_res.startsWith('Erreur'))
			{
				this.MessageErreur(str_res);
			}
			else
			{
				this.m_nd=new TvNd(this.httpClient,this,'/',TypeNd.Rep,GlobalConstantes.m_rep_fic);
			}
		},
		err=>
		{
//			ret=err;
			this.MessageErreur('Erreur: répertoire '+GlobalConstantes.m_rep_fic+' inexistant');
		});
	}
}
