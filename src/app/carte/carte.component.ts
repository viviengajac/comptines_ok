import { Component, Injectable, AfterViewInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { AccesBdService } from '../AZ_services/acces_bd';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { Ecran } from '../AZ_services/ecran';
import { UntypedFormBuilder } from '@angular/forms';
import { ModalService } from '../AZ_modal/modal.service';
import { Cbo } from '../AZ_common/cbo.model';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html'
})
@Injectable()
export class CarteComponent extends Ecran
{
	m_cbo_lieu: any=null;	// Cbo;
/* 	m_cbo_orients: Cbo;
	m_cbo_terr: Cbo;
	m_cbo_loges: Cbo; */
	private map:any=null;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
		this.formRecherche=this.formBuilder.group({ m_filtre_loge:0,m_filtre_terr:0,m_filtre_orient:0});
	}
	ngOnInit(): void
	{
		this.m_cbo_lieu=new Cbo(this.httpClient,'lieu');
		this.m_cbo_lieu.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
/* 		this.m_cbo_orients=new Cbo(this.httpClient,'orient');
		this.m_cbo_orients.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
		this.m_cbo_terr=new Cbo(this.httpClient,'terr');
		this.m_cbo_terr.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
		this.m_cbo_loges=new Cbo(this.httpClient,'loge');
		this.m_cbo_loges.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);}); */
		this.Init();
	}
	override delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	ngAfterViewInit()
	{
		this.TracerCarte();
	}
	async TracerCarte()
	{
console.log('AAA avant init map');
		var lon_centre:number;
		var lat_centre:number;
		var zoom_centre:number;
		//var test_init="0";
		//var req="select AZcentrer_carte(''+0)";
		var req="select AZcentrer_carte(0)";
		var ab=new AccesBdService(this.httpClient);
//console.log('1');
		ab.LireValeur(req)
		.then(res =>
		{
			var str_res=''+res;
			if(str_res.startsWith('Erreur'))
				this.MessageErreur(str_res);
			else
			{
				console.log('BBB carteComponent.onBtnRecherche: retour de LireValeur='+str_res);
				const tab_params:string[]=str_res.split(',');
				lat_centre=parseFloat(tab_params[0]);
				lon_centre=parseFloat(tab_params[1]);
				//zoom_centre=parseInt(tab_params[2]);
				zoom_centre=10;
			}
/* 		},
		(error) =>
		{
			var str_err:string=error;
			this.MessageErreur(str_err);
		}); */

			console.log("CCC lat_centre="+lat_centre+" ; lon_centre="+lon_centre+" ; zoom="+zoom_centre);
			this.map = new L.Map('map',
			{
				layers:
				[
					tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					{
						maxZoom: 18,
						attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					})
				],
				zoom: zoom_centre,
				center: latLng(lat_centre, lon_centre)
				//center: latLng(46.303558, 6.0164252)
			});
		},
		(error) =>
		{
			var str_err:string=error;
			this.MessageErreur(str_err);
		});
		try
		{
//console.log('avant appel AZlister_temple');
			var nb_lieux:number=0;
			//var nom_temple:string;
			var nom_lieu:string;
			var type_lieu:string;
			var lat_t:number;
			var lon_t:number;
			var lat_v:number;
			var lon_v:number;
			var nom_terr:string;
			var lat:number;
			var lon:number;
			var liste_interv:string;
			var i:number;
			var j:number;
			var ab=new AccesBdService(this.httpClient);
//console.log('1');
// avant modifs:			ab.LireTable("call AZlister_temples")
			ab.LireTable("call AZlister_lieux")
			.then(res =>
			{
//console.log('carte:AjoutMarqueurs: res='+res);
				var str_res:string=""+res;
				if(!str_res.startsWith("Erreur"))
				{
					nb_lieux=ab.m_lignes.length;
//console.log("carte: AjoutMarqueurs: nb_temples="+nb_temples);
					for(i=0;i<nb_lieux;i++)
					{
//console.log("carte: AjoutMarqueurs: num_ligne="+i+": m_cellules="+ab.m_lignes[i].m_cellules);
//console.log(ab.m_lignes[i].m_cellules);
//console.log("carte: AjoutMarqueurs: num_ligne="+i+": nb_cellules="+ab.m_lignes[i].m_cellules.length+": cellules[1]="+ab.m_lignes[i].m_cellules[1].m_val);
						var app:string='';
						//nom_temple=ab.m_lignes[i].RecupererVal(0);
						nom_lieu=ab.m_lignes[i].RecupererVal(0);
						//lat_t=ab.m_lignes[i].RecupererVal(1);
						//lon_t=ab.m_lignes[i].RecupererVal(2);
						lat_v=ab.m_lignes[i].RecupererVal(3);
						lon_v=ab.m_lignes[i].RecupererVal(4);
						if(lat_t===undefined) // faut-il remplacer par == parce que lat_t est un number?
						{
							lat=lat_v;
							app='Approx: ';
						}
						else
						{
							lat=lat_t;
						}
						if(lon_t===undefined)
						{
							lon=lon_v;
						}
						else
						{
							lon=lon_t;
						}
						//liste_loges=ab.m_lignes[i].RecupererVal(5);
						//nom_terr=ab.m_lignes[i].RecupererVal(6);
						type_lieu=ab.m_lignes[i].RecupererVal(6);
						liste_interv=ab.m_lignes[i].RecupererVal(7);
//console.log('lieu: '+nom_lieu+','+lat_t+','+lon_t+','+lat_v+','+lon_v+','+type_lieu+','+liste_interv);
						var vignette='Lieu: <b>'+nom_lieu+'</b><br>Coord: <b>'+lat+', '+lon+'</b><br>Interventions:<div class="interv-list">';
						if(liste_interv===undefined)
						{
						}
						else
						{
							var tab_interv:string[]=liste_interv.split('§')
							var nb_interv:number=tab_interv.length;
							var debut:string;
							for(j=0;j<nb_interv;j++)
							{
//console.log("VVV tab_interv[j]"+tab_interv[j]);
								var id_date_interv=tab_interv[j];
								var tab_une_interv:string[]=id_date_interv.split('#');
								var id_interv:number=parseInt(tab_une_interv[0]);
								var date_interv:string=tab_une_interv[1];
								var date_interv_fr=date_interv.substring(8,10)+"/"+date_interv.substring(5,7)+"/"+date_interv.substring(0,4);
								var test_url:string=GlobalConstantes.m_base_url;
								test_url.replace('localhost:4200','localhost');
console.log('WWW interv['+j+']: vignette '+vignette+" date_interv="+date_interv+" date_fr="+date_interv_fr);

								var num_fonte=GlobalConstantes.NumClasseFonte(GlobalConstantes.m_classe_fonte);
								var params_url:string='?p='+GlobalConstantes.m_id_prs_login+'|4|1|'+id_interv+'|'+num_fonte;
								var url:string=GlobalConstantes.m_url+params_url;
								//console.log('CarteComponent.AppelerHref: url='+url);
								//window.open(url,'_blank');
								if (j>0)
									debut = '<br>';
								else
									debut = '';
								vignette+=debut+'<a target="_blank" href="'+ url +'" style="font-weight: bold">N°'+(j+1)+' - '+date_interv_fr+'</a>';
								//vignette+='<br><a href="'+GlobalConstantes.m_base_url+'?p='+GlobalConstantes.m_id_prs+'|2|1|'+id_interv+'|'+GlobalConstantes.m_classe_fonte+'" target="_blank">'+date_interv_fr+'</a>';
								//vignette+='<br><a href="'+GlobalConstantes.m_base_url+'/interv?serveur_bd='+GlobalConstantes.m_id_prs+'|2|1|'+id_interv+'|'+GlobalConstantes.m_classe_fonte+'" target="_blank">'+date_interv_fr+'</a>';
//console.log('vignette='+vignette);
							}
							vignette+='</div>';
						}
//console.log('avant insertion marqueur: lat='+lat+', lon='+lon+', vignette='+vignette);
		// avant modifs: var temple=L.icon({iconUrl:'assets/'+nom_terr+'.jpg',shadowUrl:'assets/'+nom_terr+'.jpg',iconSize:[16, 16],shadowSize:[16, 16],iconAnchor:[8, 8],shadowAnchor: [8, 8],popupAnchor:  [0, -10]});
						var temple=L.icon({iconUrl:'assets/'+type_lieu+'.png',shadowUrl:'assets/'+type_lieu+'.png',iconSize:[16, 16],shadowSize:[16, 16],iconAnchor:[8, 8],shadowAnchor: [8, 8],popupAnchor:  [0, -10]});
						if(temple===undefined)
						{
						}
						else
						{
							const marker = L.marker([lat, lon], {icon: temple});
//console.log('1');
							marker.addTo(this.map).bindPopup(vignette);
//console.log('2');
						}
					}
				}
			},
			(error) =>
			{
				var str_err:string=error;
				this.MessageErreur(str_err);
//console.log('carte:AjoutMarqueurs: err='+str_err);
//console.log('erreur dans ChargerBloc:'+str_err);
//				reject(str_err);
			})
//console.log('fin try');
		}
		catch(e)
		{
			this.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
//			console.log("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
		}
//console.log('fin ngAfterViewInit');
	}
	onAfficherCarte()
	{
		//var id_loge: any;
		//id_loge=this.formRecherche.get('m_filtre_loge').value;
//	console.log('type de id_loge='+id_loge.constructor.name);
		//if(id_loge.constructor.name != 'String' ||id_loge=="0")
		//	id_loge="null";
		var id_terr: any;
		id_terr=this.formRecherche.get('m_filtre_terr').value;
//	console.log('type de id_obed='+id_obed.constructor.name);
		if(id_terr.constructor.name != 'String' ||id_terr=="0")
			id_terr="null";
		//var id_orient: any;
		//id_orient=this.formRecherche.get('m_filtre_orient').value;
//	console.log('type de id_orient='+id_orient.constructor.name);
		//if(id_orient.constructor.name != 'String' ||id_orient=="0")
		//	id_orient="null";
//	console.log('nom_loge='+nom_loge+',id_obed='+id_obed+', id_orient='+id_orient);
		//var req_sql="select AZcentrer_carte(@id_loge@,@id_terr@,@id_orient@)";
		//var req=req_sql.replace("@id_loge@",id_loge).replace('@id_terr@',''+id_terr).replace('@id_orient@',''+id_orient);
		var req_sql="select AZcentrer_carte(@id_terr@)";
		var req=req_sql.replace('@id_terr@',''+id_terr);
		var ab=new AccesBdService(this.httpClient);
//console.log('1');
		ab.LireValeur(req)
		.then
		(
			res =>
			{
				var str_res=''+res;
				if(str_res.startsWith('Erreur'))
					this.MessageErreur(str_res);
				else
				{
//console.log('carteComponent.onBtnRecherche: retour de LireValeur='+str_res);
					const tab_params:string[]=str_res.split(',');
					var lat:number=parseFloat(tab_params[0]);
					var lon:number=parseFloat(tab_params[1]);
					var zoom:number=parseInt(tab_params[2]);
//console.log('carteComponent.onBtnRecherche: retour de LireValeur: lat='+lat+', lon='+lon+', zoom='+zoom);
//console.log(this.map);
					if(zoom == 0)
					{
						this.MessageErreur("Localisation non définie");
					}
					else if(zoom == 6)
					{
						this.MessageErreur("Pas de coordonnées pour ce lieu")
					}
					else
					{
						this.map.setView([lat,lon],zoom);
					}
//console.log('fait');
				}
			},
			err =>
			{
				this.MessageErreur(err);
			}
		);
	}
}

