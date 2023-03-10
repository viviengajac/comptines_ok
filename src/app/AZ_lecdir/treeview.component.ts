import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as FileSaver from 'file-saver';
import { TypeNd } from '../AZ_common/dir.model';
import { AccesDir } from '../AZ_services/acces_dir';
import { AccesBdService } from '../AZ_services/acces_bd';
import { Ecran } from '../AZ_services/ecran';
import { GlobalConstantes } from '../AZ_common/global_cst';
export class TvNd
{
	public m_ouvert:boolean=false;
	m_repertoire:string='';
	m_nd_fils:Array<TvNd>=[];
	m_nom_nd:string='';
	m_type_nd:any=null;	// TypeNd;
	m_ecran:any=null;	//	Ecran;
	public m_classe_nd:string='';
	constructor(public httpClient:HttpClient,ecran:Ecran,nom?:string,type?:TypeNd,repertoire?:string)
	{
//console.log('TvNd.constructor: debut');
//		this.m_ecran=ecran;
		this.m_nom_nd = nom?nom:'node';
		this.m_type_nd=type?type:TypeNd.Rep;
		this.m_repertoire=repertoire?repertoire:'';
		if(this.m_type_nd==TypeNd.Rep)
			this.m_classe_nd='dir';
		else
			this.m_classe_nd='fic';
		this.m_ecran=ecran;
		this.m_ouvert=false;
//console.log('TvNd.constructor: m_classe_nd='+this.m_classe_nd);
	}
}
@Component({
  selector: 'treeview',
  templateUrl: `./treeview.component.html`,
  styleUrls: [`./treeview.component.css`]
})
export class TreeViewComponent
{
	@Input() m_nd: any=null;	//TvNd;
	public m_classe_nd:string='';
	constructor(public httpClient: HttpClient)
	{
		if(this.m_nd===undefined || this.m_nd==null)
		{
		}
		else
		{
//console.log('TreeViewComponent.constructor: this.m_nd');
//console.log(this.m_nd);
			this.m_classe_nd=this.m_nd.m_type_nd==TypeNd.Rep?'dir':'fic';
		}
	}
	Ouvrir():string
	{
//console.log('treeview.ouvrir');
		var ret:string='OK';
		var ecran=this.m_nd.m_ecran;
		try
		{
			ecran.ReinitialiserCompteur();
//console.log('m_nd');
//console.log(this.m_nd);
//console.log('m_nd.m_type_nd='+this.m_nd.m_type_nd+', m_nd.m_ouvert='+this.m_nd.m_ouvert+', m_nd_fils='+this.m_nd.m_nd_fils.length);
			if(this.m_nd.m_type_nd==TypeNd.Rep)
			{
				this.m_nd.m_ouvert=true;
				if(this.m_nd.m_nd_fils.length==0)
				{
//console.log('ouverture de repertoire');
//				this.m_classe_nd='dir';
					var ad: AccesDir=new AccesDir(this.httpClient);
//console.log('treeview.Ouvrir('+this.m_nd.m_repertoire+')');
					ad.LireDir(this.m_nd.m_repertoire)
					.then
					(res=>
					{
						var i:number;
						this.m_nd.m_nd_fils=new Array(ad.m_tab_nd.length);
//console.log('treeview.Ouvrir: apres LecDir: nb nd='+ad.m_tab_nd.length);
						for(i=0;i<ad.m_tab_nd.length;i++)
						{
							var nom=ad.m_tab_nd[i].m_nom_nd;
							var type=ad.m_tab_nd[i].m_type_nd;
							var rep=this.m_nd.m_repertoire+'/'+ad.m_tab_nd[i].m_nom_nd;
							var it:TvNd=new TvNd(this.httpClient,ecran,nom,type,rep);
							this.m_nd.m_nd_fils[i]=it;
//console.log('nd['+i+']');
						}
//console.log('fin de la boucle: length='+this.m_nd.m_nd_fils.length);
					},
					err=>
					{
//						ret=err;
						ecran.MessageErreur(err);
					});
				}
			}
			else
			{
//			this.m_classe_nd='fic';
				var tab_car=this.m_nd.m_repertoire.split('');
//console.log('tab_car='+tab_car);
				var i:number=tab_car.length;
				var type_fic:string="";
				for(i=tab_car.length-1;i>0;i--)
				{
					if(tab_car[i]==".")
					{
						type_fic=this.m_nd.m_repertoire.substring(i);
					}
				}
//console.log('Treeview.Ouvrir: type_fic='+type_fic);
				/*
				var ab=new AccesBdService(this.httpClient);
				var type_mime:string=ab.DonnerTypeMime(type_fic);
				if(type_mime.length==0)
				{
					ret='Erreur: type de fichier inconnu: '+type_fic;
					ecran.MessageErreur(ret);
				}
				else
				{
					ab.LireFic(this.m_nd.m_repertoire)
					.then
					(
						res =>
						{
							var str_res:string=""+res;
							if(str_res.startsWith('Erreur'))
//								ret = str_res;
								ecran.MessageErreur(str_res);
							else
							{
//console.log('retour_brut='+ab.m_retour_brut);
								const byteArray = new Uint8Array(atob(ab.m_retour_brut).split('').map(char => char.charCodeAt(0)));
								const data: Blob = new Blob([byteArray], {type: type_mime});
								var maintenant=formatDate(new Date(),'yyyyMMddHHmmss', 'en');
								FileSaver.saveAs(data, this.m_nd.m_repertoire + '_export_' + maintenant + type_fic);
//								this.m_ecran.MessageBox('OK');
							}
						},
//console.log('contenu='+contenu);
						err =>
						{
//							ret=err;
							ecran.MessageErreur(err);
						}
					);
				}
				*/
				var ab=new AccesBdService(this.httpClient);
				ab.SpecifierEcran(ecran);
				var type_mime:string=ab.DonnerTypeMime(type_fic);
//console.log('Treeview.ouvrir: type_mime='+type_mime);
				if(type_mime.length==0)
				{
					ecran.MessageErreur('Erreur: type de fichier inconnu: '+type_fic);
				}
				else
				{
					ab.LireTailleFic(this.m_nd.m_repertoire)
					.then
					(
						res =>
						{
							var str_res:string=""+res;
//console.log('Treeview.Ouvrir: retour de LireTailleFic='+str_res);
							if(str_res.startsWith('Erreur'))
								ecran.MessageErreur(str_res+'§sql§data§pile');
							else
							{
//console.log('LireBlob: retour='+ab.m_retour_brut);
/*
						const byteArray = new Uint8Array(atob(ab.m_retour_brut).split('').map(char => char.charCodeAt(0)));
						const data: Blob = new Blob([byteArray], {type: type_mime});
*/
								ab.LireFic(this.m_nd.m_repertoire)
								.then
								(
									res =>
									{
//console.log('Treeview.Ouvrir: fin de lirefic');
										const data: Blob = new Blob([ab.m_buffer_blob], {type: type_mime});
										var maintenant=formatDate(new Date(),'yyyyMMddHHmmss', 'en');
										FileSaver.saveAs(data, this.m_nd.m_repertoire + '_export_' + maintenant + type_fic);
//										ecran.MessageBox('OK');
									},
									err =>
									{
										str_res=""+err;
										ecran.MessageErreur(str_res+'§sql§data§pile');
									}
								);
							}
//console.log('contenu='+contenu);
						},
						err =>
						{
							ecran.MessageErreur(err+'§sql§data§pile');
						}
					);
				}
			}
		}
		catch(e)
		{
			ecran.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
		}
		return ret;
	}
	Fermer()
	{
		this.m_nd.m_ouvert = false;
	}
	OuvrirFermer()
	{
		if(GlobalConstantes.m_nivo_lec>2)
		{
			if(this.m_nd.m_ouvert)
				this.Fermer();
			else
				this.Ouvrir();
		}
	}
}
