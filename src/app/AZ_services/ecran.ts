import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BtnVoirDocRendererComponent } from '../AZ_renderers/btn-voir-doc-renderer.component';
import { BtnDefDocRendererComponent } from '../AZ_renderers/btn-def-doc-renderer.component';
import { BtnDependancesRendererComponent } from '../AZ_renderers/btn-dependances-renderer.component';
import { BoolRendererComponent } from '../AZ_renderers/bool-renderer.component';
import { BoolRendererNonModifComponent } from '../AZ_renderers/bool-renderer-non-modif.component';
import { DateEditorComponent } from '../AZ_renderers/date-editor.component';
import { DatetimeEditorComponent } from '../AZ_renderers/datetime-editor.component';
import { CboEditorComponent } from '../AZ_renderers/cbo-editor.component';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { ModalService } from '../AZ_modal/modal.service';
import { Bloc } from '../AZ_services/bloc';
import { Cbo } from '../AZ_common/cbo.model';
@Injectable()
export class Ecran // implements OnInit
{
	public m_nom_ecran: string;
	public formRecherche: UntypedFormGroup;
	public frameworkComponents: any;
	public m_msg_err:string;
	public m_sql_err:string;
	public m_data_err:string;
	public m_pile_err:string;
	public m_msg_info:string;
	public m_retour_modal:string;
	public m_tab_col_nom_fic: string[];
	public m_nom_col_cliquee:string;
	public m_classe_fonte:string;
	public m_hauteur_entete:number;
	public m_interdit_ecr:boolean;
	public m_interdit_exp:boolean;
	public m_hauteur_ligne_grille:number;
	public m_derniere_req_specifique:string;
	public m_classe_label_onglet_principal:string;
	public m_cbo_tmp:Cbo;
	public m_classe_grille:string;
	public m_classe_entete:string;
	public m_titre:string;
	public m_blocs:Bloc[];
	public m_num_bloc_actif:number=-1;
	public m_classe_boutons: string[];
	public m_classe_bouton_actif:string;
	public m_undoRedoCellEditing = true;			
	public m_undoRedoCellEditingLimit = 20;
	public m_pourcent_telechargement:number;
	public m_fin_telechargement:boolean;

	constructor(public httpClient: HttpClient, public formBuilder:UntypedFormBuilder,public modalService:ModalService)
	{
//console.log('Ecran: constructor');
		this.frameworkComponents = {btnVoirDocRenderer: BtnVoirDocRendererComponent,btnDefDocRenderer: BtnDefDocRendererComponent,btnDependancesRenderer: BtnDependancesRendererComponent,boolRenderer: BoolRendererComponent,boolRendererNonModif: BoolRendererNonModifComponent,dateEditor:DateEditorComponent,datetimeEditor:DatetimeEditorComponent,cboEditor:CboEditorComponent};
		this.m_classe_fonte=GlobalConstantes.m_classe_fonte;
		this.ReinitialiserCompteur();
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				this.m_hauteur_entete=20;
				this.m_classe_grille="ag-theme-alpine-pm-tp";
				this.m_classe_entete="entete_tres_petite";
				break;
			case "petite":
				this.m_hauteur_entete=30;
				this.m_classe_grille="ag-theme-alpine-pm-p";
				this.m_classe_entete="entete_petite";
				break;
			case "moyenne":
				this.m_hauteur_entete=35;
				this.m_classe_grille="ag-theme-alpine-pm-m";
				this.m_classe_entete="entete_moyenne";
				break;
			case "grande":
				this.m_hauteur_entete=40;
				this.m_classe_grille="ag-theme-alpine-pm-g";
				this.m_classe_entete="entete_grande";
				break;
			case "tres_grande":
				this.m_hauteur_entete=45;
				this.m_classe_grille="ag-theme-alpine-pm-tg";
				this.m_classe_entete="entete_tres_grande";
				break;
			default:
				this.m_hauteur_entete=25;
				this.m_classe_grille="ag-theme-alpine-pm-m";
				this.m_classe_entete="entete_moyenne";
				break;
		}
//console.log('ecran.service: m_classe_grille='+this.m_classe_grille);
		if(GlobalConstantes.m_nivo_ecr==2)
			this.m_interdit_ecr=false;
		else
			this.m_interdit_ecr=true;
		if(GlobalConstantes.m_nivo_exp==2)
			this.m_interdit_exp=false;
		else
			this.m_interdit_exp=true;
		this.m_classe_label_onglet_principal="label_onglet_principal_"+GlobalConstantes.m_classe_fonte;
	}
	Init()
	{
//		this.ReinitialiserCompteur();
		var id_prs=GlobalConstantes.m_id_prs;
		var authStatus=id_prs>0;
		var ecran=document.getElementById('ecran');
		if(authStatus)
		{
			ecran.style.visibility='visible';
			this.ReinitialiserCompteur();
		}
		else
		{
			ecran.style.visibility='hidden';
		}
	}
	InitColDefs()
	{
		var i:number;
//console.log('ecran.InitColDefs: m_blocs.length='+this.m_blocs.length);
		for(i=0;i<this.m_blocs.length;i++)
		{
//console.log('i='+i);
			this.m_blocs[i].InitColDefs();
			this.m_classe_boutons[i]="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
		}
//console.log('ecran.InitColDefs: fin');
	}
	RequeteRecherche():string
	{
		return "";
	}
	LancerUneRecherche(num_bloc:number)
	{
		var promise = new Promise((resolve, reject) =>
		{
//console.log('Ecran.LancerUneRecherche');
			this.ReinitialiserCompteur();
			var req_sql=this.RequeteRecherche().replace('@id_prs_login@',''+GlobalConstantes.m_id_prs);
//console.log('apres appel de RequeteRecherche: req_sql='+req_sql);
			this.m_blocs[num_bloc].ChargerBloc(req_sql,false, false)
			.then
			(res=>
			{
//console.log('apres chargerbloc');
				var str_res=""+res;
	//console.log('str_res='+str_res);
				if(str_res.startsWith('Erreur'))
				{
					reject(str_res);
				}
				else
				{
//					this.m_nb_lignes_maitre=this.m_blocs[0].m_lignes.length;
//					this.AfficherBloc(num_bloc,false,false);
					resolve("OK");
				}
			},
			erreur=>
			{
				reject('Erreur: '+erreur);
			});
		});
		return promise;
	}
	delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	/*
	DefinirRowHeight(params):number
	{
//console.log('DefinirRowHeight');
//console.log(params);
		var hauteur_ligne:number=25;
		var facteur:number=1.0;
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				hauteur_ligne=20;
				facteur=0.5;
				break;
			case "petite":
				hauteur_ligne=30;
				facteur=0.6;
				break;
			case "moyenne":
				hauteur_ligne=35;
				facteur=0.7;
				break;
			case "grande":
				hauteur_ligne=40;
				facteur=0.8;
				break;
			case "tres_grande":
				hauteur_ligne=45;
				facteur=1.0;
				break;
		}
		var hauteur_avant_modif=params.node.rowHeight;
		var hauteur=hauteur_avant_modif;		// *facteur;
console.log('hauteur_avant='+hauteur_avant_modif+', apres='+hauteur);
		return hauteur;
//		return hauteur_ligne;
	}
	DefinirHauteurLigneGrille():number
	{
		var hauteur_ligne:number=25;
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				hauteur_ligne=20;
				break;
			case "petite":
				hauteur_ligne=30;
				break;
			case "moyenne":
				hauteur_ligne=35;
				break;
			case "grande":
				hauteur_ligne=40;
				break;
			case "tres_grande":
				hauteur_ligne=45;
				break;
		}
//console.log('hauteur_ligne='+hauteur_ligne);
		return hauteur_ligne;
	}
	*/
	ReinitialiserCompteur()
	{
		GlobalConstantes.m_compteur=0;
	}
	MessageErreur(msg:string)
	{
//console.log('EcranService.MessageErreur('+msg+')');
		var tab=msg.split('§');
		this.m_msg_err=tab[0];
		this.m_sql_err=tab[1];
		this.m_data_err=tab[2];
		this.m_pile_err=tab[3];
//console.log('msg_err=('+this.m_msg_err);
//console.log('sql_err='+this.m_sql_err);
//console.log('date_err='+this.m_data_err);
//console.log('pile_err='+this.m_pile_err);
		this.modalService.open('erreur');
	}
	MessageBox(msg:string)
	{
		this.m_retour_modal="";
		this.m_msg_info=msg;
//console.log('avant appel de modal_service');
		this.modalService.open('info');
//console.log('fin de voirbloc');
	}
	DefNomFic()
	{
		return "";
	}
	RafraichirEcran()
	{
	}
	// dans la fonction onFocusIn() ;  il fallait remplacer path par composedPath()
	onFocusIn(event)
	{
		var i:number;
		var nom_col:string="";
		for(i=0;i<event.composedPath().length && nom_col.length==0;i++)
		{
			var t:any=event.composedPath()[i];
			if(t.constructor.name=='HTMLDivElement')
			{
				var col_id=t.getAttribute('col-id');
				if(col_id!=undefined)
				{
					nom_col=col_id;
				}
			}
		}
		this.m_nom_col_cliquee=nom_col;
	}
	RequeteCombobox(nom_onglet:string,num_lig:number,nom_col:string):string
	{
		return "";
	}
	ApresModifValeurChamp(num_lig_modifiee:number,nom_onglet:string,num_lig:number,nom_col:string,val_col:any)
	{
	}
	ForcerValeurChamp(num_lig_ecran_modifiee:number,nom_onglet:string,id_cle_primaire:number,nom_col:string,val_col:any)
	{
		var i:number;
		for(i=0;i<this.m_blocs.length;i++)
		{
			if(this.m_blocs[i].m_nom_bloc==nom_onglet)
			{
				this.m_blocs[i].ForcerValeurChamp(num_lig_ecran_modifiee,nom_col,id_cle_primaire,val_col);
			}
		}
	}
    closeModal(id: string)
	{
        this.modalService.close(id);
    }
    closeModalbis(id: string,param:string)
	{
//console.log('closebis:param='+param);
		this.m_retour_modal=param;
		this.modalService.close(id);
    }
	ToucherBlocActif()
	{
		var classe_bouton:string = this.ToucherBloc(this.m_num_bloc_actif);
		this.m_classe_bouton_actif=classe_bouton;
	}
	ToucherBloc(num_bloc:number):string
	{
		var classe_bouton:string=this.m_blocs[num_bloc].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
		classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
//console.log('EecranService.ToucherBlocActif: classe_bouton='+classe_bouton+' pour onglet numero '+this.m_num_bloc_actif);
		this.m_classe_boutons[this.m_num_bloc_actif]=classe_bouton;
		return classe_bouton;
	}
	onViderCriteres()
	{
	}
	PreparerChainePourSql(ch:string):string
	{
		var ret:string="'"+ch.replace(/\'/g,"\'\'")+"'";
		return ret;
	}
	PreparerDatePourSql(dt:string):string
	{
		var ret:string="'"+dt+"'";
		return ret;
	}
}
