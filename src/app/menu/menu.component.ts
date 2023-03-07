import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
//import { AccesJSon } from '../services/json.service';
import { AccesBdService } from '../AZ_services/acces_bd';
import { Cbo } from '../AZ_common/cbo.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstantes } from '../AZ_common/global_cst';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
//@Injectable()
export class MenuComponent // implements OnInit
{
	m_phase_connexion: boolean;
	m_appel_par_href:boolean;
//	public static m_id_prs: number;
	m_cbo_prs: Cbo;
	m_cbo_fonte:Cbo;
	formConnexion: UntypedFormGroup;
//	formServeur: FormGroup;
	accesBdService: AccesBdService;
	m_compteur:number;
	m_msg_err:string;
	m_classe_fonte:string;
	m_classe_compteur:string;
//	m_tailles_fontes:string[]=['tres_petite','petite','moyenne','grande','tres_grande'];
	m_tailles_fontes:string[]=['tres_petite','moyenne','tres_grande'];
    constructor( private httpClient: HttpClient,private router: Router, public formBuilder:UntypedFormBuilder)
	{
//console.log('debut de constructor de menu');
//		if(!GlobalConstantes.m_url_bd.endsWith('/'))GlobalConstantes.m_url_bd+='/';
		GlobalConstantes.m_serveur_bd="serveur_de_bd";
		this.ClasseCompteur();
		var id_prs=GlobalConstantes.m_id_prs;
//console.log('menu.constructeur: id_prs='+id_prs);
		if (id_prs>0)
		{
			this.m_phase_connexion=false;
			this.ValiderIdPrs(id_prs,"AZAZAZ");
			var num_ecran_appele=GlobalConstantes.m_num_ecran_appele;
			var num_bloc_appele=GlobalConstantes.m_num_bloc_appele;
			var id_appele=GlobalConstantes.m_id_appele;
			var url_ecran:string=this.UrlEcran(num_ecran_appele,num_bloc_appele);
			if(url_ecran==null)
			{
				this.m_msg_err='Erreur: écran inconnu: '+num_ecran_appele;
				console.log(this.m_msg_err);
			}
			else
			{
				this.router.navigate([url_ecran]);
			}
		}
		else
		{
			this.m_phase_connexion=true;
			this.formConnexion=this.formBuilder.group({m_cbo_prs:0, m_mdp: '',m_cbo_fonte:1});
//		this.accesBdService=new AccesBdService(httpClient);
			this.m_cbo_fonte=new Cbo(this.httpClient,'fontes');
			this.m_cbo_fonte.InitialiserListe(this.m_tailles_fontes);
			this.m_cbo_prs=new Cbo(this.httpClient,'prs_login');
			this.DefServeur();
		}		
/*		
		this.authStatus=false;
//		this.formServeur=this.formBuilder.group({m_serveur_bd:''});
		this.formConnexion=this.formBuilder.group({m_cbo_prs:0, m_mdp: '',m_cbo_fonte:1});
		this.accesBdService=new AccesBdService(httpClient);
		this.m_cbo_fonte=new Cbo(this.httpClient,'fontes');
		this.m_cbo_fonte.InitialiserListe(this.m_tailles_fontes);
		this.m_cbo_prs=new Cbo(this.httpClient,'prs_login');
		this.DefServeur();
*/
		/*
		this.m_cbo_prs.GenererListeStd()
		.then(
			res=>
			{
//console.log('cbo_prs: nb_items='+this.m_cbo_prs.m_liste_items.length);
			},
			erreur=>
			{
				console.log('cbo_prs: erreur='+erreur);
			});
		*/
//		this.router=r;
//console.log('fin de constructor de menu');
    }
	ngOnInit(): void
	{
	}
	async ValiderUtilisateur(): Promise<boolean>
	{
//console.log('debut de ngOnInit');
		GlobalConstantes.m_compteur_initialise=true;
		while(true)
		{
			this.m_compteur=GlobalConstantes.m_compteur++;
//console.log('Menu:ValiderUtilisateur(): boucle: compteur='+GlobalConstantes.m_compteur);
			if(GlobalConstantes.m_compteur>600)
			{
//console.log('Menu:ValiderUtilisateur(): compteur='+GlobalConstantes.m_compteur+', id_prs='+GlobalConstantes.m_id_prs);
				this.onDeConnexion();
				GlobalConstantes.m_compteur=0;
			}
			await this.delay(1000);
		}
		return new Promise<boolean>((resolve, reject) => {resolve(true)});
//console.log('fin de ngOnInit');
	}
	DefServeur()
	{
//		var serveur_bd=this.formServeur.get('m_serveur_bd').value;
		var serveur_bd=GlobalConstantes.m_serveur_bd;
//console.log('type de id_prs='+id_prs.constructor.name);
		if(serveur_bd.constructor.name == 'String')
		{
			GlobalConstantes.m_serveur_bd=serveur_bd;
//console.log('MenuComponent: OnDefServeur m_serveur_bd='+GlobalConstantes.m_serveur_bd);
//console.log('MenuComponent: OnDefServeur m_url_bd='+GlobalConstantes.m_url_bd);
			this.m_cbo_prs=new Cbo(this.httpClient,'prs_login');
			this.m_cbo_prs.GenererListeStd()
			.then(
				res=>
				{
//console.log('cbo_prs: nb_items='+this.m_cbo_prs.m_liste_items.length);
				},
				erreur=>
				{
					console.log('cbo_prs: erreur='+erreur);
				});
		}
	}
	ValiderIdPrs(id_prs:number,mdp:string)
	{
		if(id_prs>0)
		{
//			var serveur_bd=this.formConnexion.get('m_serveur_bd').value;
			var req="exec AZvalider_prs_mdp "+id_prs+",'"+mdp+"'";
//console.log('MenuComponent.ValiderIdPrs: req='+req);
			var ab=new AccesBdService(this.httpClient);
			ab.LireValeur(req)
			.then(res =>
			{
//console.log('res='+res);
				var str_res=""+res;
//console.log('1');
				var str_nivos=str_res.split('|',3);
//console.log(str_nivos);
				var nivos:number[]=new Array(3);
//console.log('2');
				var i;
//console.log('3');
				for(i=0;i<3;i++)
					nivos[i]= +str_nivos[i];
//console.log('4');
				if(nivos[0]>0)
				{
//console.log('5');
					this.m_msg_err="";
//console.log('MenuComponent:  classe de GlobalConstantes.m_app='+GlobalConstantes.m_app.constructor.name);
//console.log('MenuComponent:  classe de GlobalConstantes.m_app_doc='+GlobalConstantes.m_app_doc.constructor.name);
//console.log('MenuComponent:  classe de GlobalConstantes.m_renderer='+GlobalConstantes.m_renderer.constructor.name);
//console.log('6');
					GlobalConstantes.m_renderer.removeClass(GlobalConstantes.m_app_doc.body, GlobalConstantes.m_classe_fonte);
//console.log('7');
					this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('10');
					GlobalConstantes.m_renderer.addClass(GlobalConstantes.m_app_doc.body, GlobalConstantes.m_classe_fonte);
//					GlobalConstantes.m_id_prs=id_prs;
					GlobalConstantes.m_nivo_lec=nivos[0];
					GlobalConstantes.m_nivo_ecr=nivos[1];
					GlobalConstantes.m_nivo_exp=nivos[2];
					GlobalConstantes.m_compteur=0;
//console.log('MenuComponent: memorisation de m_id_prs='+GlobalConstantes.m_id_prs);
					this.m_phase_connexion=false;
					if(GlobalConstantes.m_compteur_initialise==false)
						this.ValiderUtilisateur();
//					this.router.navigateByUrl('/');
				}
				else
				{
//console.log('MenuComponent.ValiderIdPrs: nivos[O]<0');
					this.m_msg_err="Mot de passe incorrect";
				}
			},
			erreur =>
			{
				this.m_msg_err=erreur;
			});
//console.log('MenuComponent.ValiderIdPrs: fin');
		}
	}
	onConnexion()
	{
		var id_prs=this.formConnexion.get('m_cbo_prs').value;
		if(id_prs>0)
		{
			var mdp=this.formConnexion.get('m_mdp').value;
			var id_fonte=this.formConnexion.get('m_cbo_fonte').value;
//console.log('8');
			var classe_fonte=this.m_tailles_fontes[id_fonte];
			GlobalConstantes.m_id_prs=id_prs;
			GlobalConstantes.m_classe_fonte=classe_fonte;
//console.log('type de id_prs='+id_prs.constructor.name);
			this.ValiderIdPrs(id_prs,mdp);
		}
		/*
		var id_prs=this.formConnexion.get('m_cbo_prs').value;
//console.log('type de id_prs='+id_prs.constructor.name);
		if(id_prs.constructor.name == 'String')
		{
			var mdp=this.formConnexion.get('m_mdp').value;
//			var serveur_bd=this.formConnexion.get('m_serveur_bd').value;
			var req="exec AZvalider_prs_mdp "+id_prs+",'"+mdp+"'";
//console.log('id_prs='+id_prs);
			var ab=new AccesBdService(this.httpClient);
			ab.LireValeur(req)
			.then(res =>
			{
//console.log('res='+res);
				var str_res=""+res;
				var str_nivos=str_res.split('|',3);
//console.log(str_nivos);
				var nivos:number[]=new Array(3);
				var i;
				for(i=0;i<3;i++)
					nivos[i]= +str_nivos[i];
				if(nivos[0]>0)
				{
					this.m_msg_err="";
//console.log('MenuComponent:  classe de GlobalConstantes.m_app='+GlobalConstantes.m_app.constructor.name);
//console.log('MenuComponent:  classe de GlobalConstantes.m_app_doc='+GlobalConstantes.m_app_doc.constructor.name);
//console.log('MenuComponent:  classe de GlobalConstantes.m_renderer='+GlobalConstantes.m_renderer.constructor.name);
					GlobalConstantes.m_renderer.removeClass(GlobalConstantes.m_app_doc.body, GlobalConstantes.);
					var id_fonte=this.formConnexion.get('m_cbo_fonte').value;
					GlobalConstantes.m_classe_fonte=this.m_tailles_fontes[id_fonte];
					this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
//console.log('fonte='+GlobalConstantes.m_classe_fonte);
					GlobalConstantes.m_renderer.addClass(GlobalConstantes.m_app_doc.body, GlobalConstantes.m_classe_fonte);
					GlobalConstantes.m_id_prs=id_prs;
					GlobalConstantes.m_nivo_lec=nivos[0];
					GlobalConstantes.m_nivo_ecr=nivos[1];
					GlobalConstantes.m_nivo_exp=nivos[2];
					GlobalConstantes.m_compteur=0;
//console.log('MenuComponent: memorisation de m_id_prs='+GlobalConstantes.m_id_prs);
					this.authStatus=true;
					if(GlobalConstantes.m_compteur_initialise==false)
						this.ValiderUtilisateur();
					this.router.navigateByUrl('/');
				}
				else
				{
					this.m_msg_err="Mot de passe incorrect";
				}
			},
			erreur =>
			{
				this.m_msg_err=erreur;
			});
		}
		*/
	}
	onDeConnexion()
	{
		GlobalConstantes.m_id_prs=-1;
		GlobalConstantes.m_compteur=0;
		this.m_phase_connexion=true;
		this.formConnexion.get('m_cbo_prs').setValue(0);
		this.formConnexion.get('m_mdp').setValue("");
		this.router.navigateByUrl('/');
	}
	delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	public static NumEcran(nom_ecran:string):string
	{
		var num_ecran:string='';
		var i:number;
		var	tab_bloc_ref:string[]=['cmpt','instr','lieu','ville'];
		switch (nom_ecran)
		{
			case 'seance':
				num_ecran='1|1';
				break;
			case 'seance_cmpt':
				num_ecran='1|2';
				break;
			case 'interv':
				num_ecran='2|1';
				break;
			default:
				for(i=0;i<tab_bloc_ref.length;i++)
				{
					if(nom_ecran==tab_bloc_ref[i])
						num_ecran='0|'+i;
				}
				break;
		}
//console.log('MenuComponent.NumEcran('+nom_ecran+')='+num_ecran);
		return num_ecran;
	}
	tab_ecrans:string[]=['references','seance','interv'];
	tab_bloc_ref:string[]=['cmpt','instr','lieu','ville'];
	UrlEcran(num_ecran:number,num_bloc:number):string
	{
		var url_ecran:string=this.tab_ecrans[num_ecran];
		if(num_ecran==0)url_ecran+='/'+this.tab_bloc_ref[num_bloc];
		return url_ecran;
	}
	ClasseCompteur()
	{
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				this.m_classe_compteur="compteur_tres_petite";
				break;
			case "petite":
				this.m_classe_compteur="compteur_petite";
				break;
			case "moyenne":
				this.m_classe_compteur="compteur_moyenne";
				break;
			case "grande":
				this.m_classe_compteur="compteur_grande";
				break;
			case "tres_grande":
				this.m_classe_compteur="compteur_tres_grande";
				break;
			default:
				this.m_classe_compteur="compteur_moyenne";
				break;
		}
	}
}
