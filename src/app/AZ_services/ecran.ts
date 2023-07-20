import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BtnVoirDocRendererComponent } from '../AZ_renderers/btn-voir-doc-renderer.component';
import { BtnDefDocRendererComponent } from '../AZ_renderers/btn-def-doc-renderer.component';
import { BtnDependancesRendererComponent } from '../AZ_renderers/btn-dependances-renderer.component';
import { BoolRendererComponent } from '../AZ_renderers/bool-renderer.component';
import { DateEditorComponent } from '../AZ_renderers/date-editor.component';
import { DatetimeEditorComponent } from '../AZ_renderers/datetime-editor.component';
import { CboEditorComponent } from '../AZ_renderers/cbo-editor.component';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { ModalService } from '../AZ_modal/modal.service';
import { Bloc,DefBloc } from '../AZ_services/bloc';
import { Cbo} from '../AZ_common/cbo.model';
import { AccesBdService } from '../AZ_services/acces_bd';
import { Cellule,TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { OptionsGrille } from '../AZ_common/grille.model';
@Injectable()
export class Ecran // implements OnInit
{
	public m_nom_ecran: string='';
	public formRecherche: any=null;	//	UntypedFormGroup;
//	public frameworkComponents: any=null;
	public m_msg_err:string='';
	public m_sql_err:string='';
	public m_data_err:string='';
	public m_pile_err:string='';
	public m_msg_info:string='';
	public m_retour_modal:string='';
	public m_tab_col_nom_fic: string[]=new Array(0);
	public m_nom_col_cliquee:string='';
	public m_classe_fonte:string='';
	public m_hauteur_entete:number=0;
	public m_interdit_ecr:boolean=false;
	public m_interdit_exp:boolean=false;
	public m_hauteur_ligne_grille:number=0;
	public m_derniere_req_specifique:string='';
	public m_classe_label_onglet_principal:string='';
	public m_cbo_tmp:any=null;	//	Cbo;
	public m_classe_grille:string='';
	public m_classe_entete:string='';
	public m_titre:string='';
	public m_blocs:Bloc[]=new Array(0);
	public m_num_bloc_actif:number=-1;
	public m_classe_boutons: string[]=new Array(0);
	public m_classe_bouton_actif:string='';
	public m_undoRedoCellEditing = true;		
	public m_undoRedoCellEditingLimit = 20;
	public m_pourcent_telechargement:number=0;
	public m_fin_telechargement:boolean=false;
	public formOngletPrincipal: any=null;	//  UntypedFormGroup;
//	public m_grid_options_maitre:any=null;	//	OptionsGrille;

	constructor(public httpClient: HttpClient, public formBuilder:UntypedFormBuilder,public modalService:ModalService)
	{
//console.log('Ecran: constructor');
//		this.frameworkComponents = {btnVoirDocRenderer: BtnVoirDocRendererComponent,btnDefDocRenderer: BtnDefDocRendererComponent,btnDependancesRenderer: BtnDependancesRendererComponent,boolRenderer: BoolRendererComponent,dateEditor:DateEditorComponent,datetimeEditor:DatetimeEditorComponent,cboEditor:CboEditorComponent};
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
		var id_prs=GlobalConstantes.m_id_prs_login;
		var authStatus=id_prs>0;
		var ecran=document.getElementById('ecran');
		if(ecran!=null)
		{
			if(authStatus)
			{
				ecran.style.visibility='visible';
			}
			else
			{
				ecran.style.visibility='hidden';
			}
		}
		this.ReinitialiserCompteur();
//		this.m_grid_options_maitre=new OptionsGrille(this);
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
//console.log(this.m_blocs[num_bloc]);
			this.ReinitialiserCompteur();
			var req_sql=this.RequeteRecherche().replace('@id_prs_login@',''+GlobalConstantes.m_id_prs_login);
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
	AfficherBlocMaitre()
	{
	}
	AfficherApresRecherche()
	{
	}
	NumBlocPourRecherche():number
	{
		return 0;
	}
	async onBtnRecherche()
	{
//console.log('Ecran.onBtnRecherche');
		var modif: boolean=false;
		var i:number;
		for(i=0;i<this.m_blocs.length;i++)
		{
			if(this.m_blocs[i].m_modif)
				modif=true;
		}
		var faire:boolean=true;
//console.log('modif='+modif);
		if(modif)
		{
			this.m_retour_modal="";
//console.log('EcranMaireDetail: appel de messagebox: 2');
			this.MessageBox("L'objet courant est modifi?")
			while(this.m_retour_modal=="")
			{
				await this.delay(500);
			}
			if(this.m_retour_modal=="Cancel")
				faire=false;
		}
//console.log('faire='+faire);
		if(faire)
		{
//console.log('Ecran.onBtnRecherche: constructor_name='+this.constructor.name);
//console.log(this.constructor);
//			var num_bloc:number=this.constructor.name=='References'?this.m_num_bloc_actif:0;
//			var num_bloc:number=this instanceof EcranGrille?this.m_num_bloc_actif:0;
			var num_bloc:number=this.NumBlocPourRecherche();
//console.log('Ecran.onBtnRecherche: num_bloc='+num_bloc);
			this.LancerUneRecherche(num_bloc)
			.then
			(res=>
			{
//				this.m_json_detail='';
//console.log('Ecran.onBtnRecherche: avant AfficherApresRecherche');
				this.AfficherApresRecherche();
//console.log('Ecran.onBtnRecherche: apres AfficherApresRecherche');
			},
			err=>
			{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 3');
				this.MessageErreur(err+'§§num_bloc='+num_bloc+'§Ecran.onBtnRecherche.LancerUneRecherche');
			});
		}
	}
	delay(ms: number)
	{
//console.log('appel de delay('+ms+')');
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
		var msg_tmp=''+msg;
// console.log('EcranService.MessageErreur('+msg+')');
		var tab=msg_tmp.split('§');
		this.m_msg_err=tab[0];
		this.m_sql_err=tab[1];
		this.m_data_err=tab[2];
		this.m_pile_err=tab[3];
//console.log('msg_err=('+this.m_msg_err);
//console.log('sql_err='+this.m_sql_err);
//console.log('date_err='+this.m_data_err);
//console.log('pile_err='+this.m_pile_err);
//console.log('Ecran.MessageErreur: avant appel de modal_service');
		this.modalService.open('erreur');
	}
	MessageBox(msg:string)
	{
		this.m_retour_modal="";
		this.m_msg_info=msg;
//console.log('Ecran.MessageBox: avant appel de modal_service');
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
	onFocusIn(event:any)
	{
		var nom_col:string="";
//console.log('Ecran.onFocusIn');
//console.log(event);
		var src = event.srcElement;
		nom_col=src.getAttribute('col-id');
//console.log('nom_col='+nom_col);
		if(nom_col!=undefined)
		{
			this.m_nom_col_cliquee=nom_col;
		}
/*
		var i:number;
		for(i=0;i<event.path.length && nom_col.length==0;i++)
		{
			var t:any=event.path[i];
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
*/
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
	ModifValeurChamp(nom_col_modifiee:string,id_cle_primaire:number,val_col_new: any)
	{
		if(id_cle_primaire<-GlobalConstantes.m_nb_max_lig_creees)
		{
//console.log('appel de MessageErreur depuis Ecran: 1');
			this.MessageErreur('Ligne non modifiable');
		}
		else
		{
//console.log('Ecran.ModifValeurChamp('+nom_col_modifiee+','+id_cle_primaire+', num_bloc_actif='+this.m_num_bloc_actif+')');
			this.m_blocs[this.m_num_bloc_actif].ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
			this.ToucherBlocActif();
		}
	}
	onInverserSelection(num_bloc:number)
	{
//console.log('Ecran.onInverserSelection');
		if(this.m_blocs[num_bloc]!=undefined)
		{
//console.log('test1');
			if(this.m_blocs[num_bloc].m_colonnes_sql!=undefined)
			{
//console.log('test2');
				var i:number;
				for(i=0;i<this.m_blocs[num_bloc].m_colonnes_sql.length;i++)
				{
					if(this.m_blocs[num_bloc].m_colonnes_sql[i].m_nom_col=="SelectId")
					{
						var num_col_sel:number=i;
//console.log('test3');			
						for(i=0;i<this.m_blocs[num_bloc].m_lignes.length;i++)
						{
							var val=this.m_blocs[num_bloc].ValCelluleParNum(i,num_col_sel);
							if(val=="1")
								val="0";
							else
								val="1";
//console.log('ligne '+i+', val='+val);			
							this.m_blocs[num_bloc].EcrireVal(i,num_col_sel,val);
						}
					}
					this.m_blocs[num_bloc].AfficherBloc(false,false);
//console.log('apres forcage');
				}
			}
		}
		this.ReinitialiserCompteur();
	}
	onCellClick(event:any)	//	appele apres un click sur une cellule d'une grille
	{
//console.log('onCellClickDetail');
//console.log(event);
//console.log('cellule cliquee='+event.colDef.field);
//console.log(event.colDef);
		var nom_col:string=event.colDef.field;
		if(nom_col!=undefined)
		{
			this.m_nom_col_cliquee=nom_col;
		}
//console.log('m_col_detail');
//console.log(this.m_col_detail);
	}
	AfficherOngletFormulaire(num_bloc:number)
	{
//console.log('Ecran.AfficherOngletformulaire: d?but');
		var i:number;
		var bloc:Bloc=this.m_blocs[num_bloc];
//console.log(bloc);
		for(i=0;i<bloc.m_colonnes_ecran.length;i++)
		{
//console.log('i='+i);
			if(bloc.m_colonnes_ecran[i].m_visible==true && bloc.m_colonnes_ecran[i].m_inser_ecran==true)
			{
				var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
				var nom_champ_ts:string="m_"+nom_champ;
//console.log('Ecran.AfficherOngletFormulaire: avant nom_champ='+nom_champ);
				var val:any;
				var v_vrai:boolean=true;
				var v_faux:boolean=false;
				if(this.m_blocs[num_bloc].m_lignes.length>0)
				{
					val=bloc.ValCelluleParNom(0,nom_champ);
					if(bloc.m_colonnes_ecran[i].m_type_col==TypeColEcran.Booleen)
					{
						if(val==0)
							val=v_faux;
						else if (val==1)
							val=v_vrai;
					}
//console.log('Ecran.AfficherOngletFormulaire: val='+val);
				}
				else
				{
					val=undefined;
				}
//console.log('Ecran.AfficherOngletFormulaire: nom_champ_ts='+nom_champ_ts+', val='+val);
				this.formOngletPrincipal.get(nom_champ_ts).setValue(val);
//console.log('Ecran.AfficherOngletformulaire: apres SetValue');
			}
		}
//console.log('Ecran.AfficherOngletformulaire: fin');
	}
	TransfererOngletFormulaire(num_bloc:number)
	{
//console.log('Ecran.TransfererOngletformulaire');
		var i:number;
		var bloc:Bloc=this.m_blocs[num_bloc];
//console.log(bloc);
		for(i=0;i<bloc.m_colonnes_ecran.length;i++)
		{
//console.log('i='+i);
			if(bloc.m_colonnes_ecran[i].m_visible==true && bloc.m_colonnes_ecran[i].m_inser_ecran==true && bloc.m_type_bloc=='F')
			{
				var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
				var nom_champ_ts:string="m_"+nom_champ;
				var num_col_sql=bloc.NumeroColonneSql(nom_champ);
//console.log('nom_champ='+nom_champ+', nom_champ_ts='+nom_champ_ts+', num_col_sql='+num_col_sql);
				var val=this.formOngletPrincipal.get(nom_champ_ts).value;
//console.log('AfficherOngletDetailPrincipal: nom_champ='+nom_champ+', val='+val);
				if(val===undefined)
				{
				}
				else
					bloc.EcrireVal(0,num_col_sql,val);
			}
		}
	}
	onModifValFormulaire(event:any)
	{
//console.log('Ecran.onModifValFormulaire');
		var t:HTMLInputElement=event.target;
//console.log(t);
		var nom_elem=t.name;
		var val:any=t.value;
		var num_bloc:number=this.m_num_bloc_actif;
//console.log('num_bloc='+num_bloc);
		var num_col_sql_modifiee:number=this.m_blocs[num_bloc].NumeroColonneSql(nom_elem);
//console.log('num_col_sql_modifiee='+num_col_sql_modifiee);
		if(num_col_sql_modifiee<0)
		{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 15');
			var msg_err:string='Champ inconnu dans la BD'+'§§champ=('+nom_elem+')§pile=(Ecran.onModifValFormulaire)�';
			this.MessageErreur(msg_err);
		}
		else
		{
			var nom_col_cle_primaire=this.m_blocs[num_bloc].m_nom_cle_primaire;
//console.log('nom_col_cle_primaire='+nom_col_cle_primaire);
			var id_cle_primaire=this.m_blocs[num_bloc].ValCelluleParNom(0,nom_col_cle_primaire);
//console.log('appel de onChangeEvent: nom_elem='+nom_elem+', num_col_sql_modifiee='+num_col_sql_modifiee+', val='+val+', id_cle_primaire='+id_cle_primaire);
			this.ModifValeurChamp(nom_elem,id_cle_primaire,val);
		}
	}
	InitBlocs()
	{
		var promise = new Promise((resolve, reject) =>
		{
			try
			{
				var req_sql:string="exec AZlire_config_ecr 'prs'";
				var ab=new AccesBdService(this.httpClient);
				ab.LireTable(req_sql)
				.then(res =>
				{
//console.log('prs:constructeur: res='+res);
					var i:number;
					var j:number;
					var str_res:string=""+res;
					if(!str_res.startsWith("Erreur"))
					{
//console.log('requete executee: nb_cols='+ab.m_colonnes_sql.length);
//						this.InitialiserColonnesSql(ab.m_colonnes_sql);
//console.log("nb_lignes="+ab.m_lignes.length);
						var max_num_bloc:number=0;
						var num_bloc:number=0;
						for(i=0;i<ab.m_lignes.length;i++)
						{
//							num_bloc=ab.m_lignes[i].m_cellules[0].m_val;
							num_bloc=ab.ValCelluleParNom(i,'num_bloc');
							if(num_bloc>max_num_bloc)
								max_num_bloc=num_bloc;
//console.log("max_num_blocs="+max_num_blocs);
						}
						var nb_blocs:number=max_num_bloc+1;
						this.m_blocs=new Array(nb_blocs);
//console.log("max_num_bloc="+max_num_bloc);
						for(num_bloc=0;num_bloc<nb_blocs;num_bloc++)
						{
							var max_num_ch:number=0;
							var num_ch:number=0;
							for(i=0;i<ab.m_lignes.length;i++)
							{
//						var num_bloc_tmp=ab.m_lignes[i].m_cellules[0].m_val;
								var num_bloc_tmp=ab.ValCelluleParNom(i,'num_bloc');
								if(num_bloc_tmp == num_bloc)
								{
//									num_ch=ab.m_lignes[i].m_cellules[8].m_val;
									num_ch=ab.ValCelluleParNom(i,'num_champ');
//console.log('num_ch='+num_ch);
									if(num_ch>max_num_ch)
										max_num_ch=num_ch;							
								}
							}
							var nb_ch:number=max_num_ch+1;
//console.log("bloc numero "+num_bloc+": max_num_champs="+max_num_ch);
							var tab_ch:ColonneEcran[]=new Array(nb_ch);
							var code_type_bloc:string='';
							var nom_bloc:string='';
							var lib_bloc:string='';
							var nom_table:string='';
							var sql_select:string='';
							var sql_update:string='';
							var nom_cle_primaire:string='';
							for(i=0;i<ab.m_lignes.length;i++)
							{
								var num_bloc_tmp=ab.ValCelluleParNom(i,'num_bloc');
								if(num_bloc_tmp == num_bloc)
								{
//console.log('ligne numero '+i);
//console.log(ab.m_lignes[i]);
									if(code_type_bloc=='')
									{
										code_type_bloc=ab.ValCelluleParNom(i,'code_type_bloc');
										nom_bloc=ab.ValCelluleParNom(i,'nom_bloc');
										lib_bloc=ab.ValCelluleParNom(i,'lib_bloc');
										nom_table=ab.ValCelluleParNom(i,'nom_table');
										sql_select=ab.ValCelluleParNom(i,'sql_select');
										sql_update=ab.ValCelluleParNom(i,'sql_update');
										nom_cle_primaire=ab.ValCelluleParNom(i,'nom_cle_primaire');
									}
									num_ch=ab.ValCelluleParNom(i,'num_champ');
									var nom_ch=ab.ValCelluleParNom(i,'nom_champ');
									var lib_ch=ab.ValCelluleParNom(i,'lib_champ');
									var code_type_ch=ab.ValCelluleParNom(i,'code_type_champ');
									var visible:boolean=ab.ValCelluleParNom(i,'visible');
//console.log('nom_ch='+nom_ch+', visible='+visible);
									var code_type_modif_ch=ab.ValCelluleParNom(i,'code_type_modif_champ');
									var inser_excel=ab.ValCelluleParNom(i,'inser_excel');
									var inser_ecran=ab.ValCelluleParNom(i,'inser_ecran');
									var lg_ch=ab.ValCelluleParNom(i,'lg_champ');
									var type_ch:TypeColEcran=TypeColEcran.Entier;
									switch(code_type_ch)
									{
										case "B":
											type_ch=TypeColEcran.Booleen;
											break;
										case "C":
											type_ch=TypeColEcran.Chaine;
											break;
										case "D":
											type_ch=TypeColEcran.Date;
											break;
										case "E":
											type_ch=TypeColEcran.Entier;
											break;
										case "F":
											type_ch=TypeColEcran.Flottant;
											break;
										case "H":
											type_ch=TypeColEcran.DateHeure;
											break;
										case "CP":
											type_ch=TypeColEcran.ClePrimaire;
											break;
										case "CE":
											type_ch=TypeColEcran.CleEtrangere;
											break;
										case "Dp":
											type_ch=TypeColEcran.Dependances;
											break;
										case "DD":
											type_ch=TypeColEcran.DefDocDb;
											break;
										case "DF":
											type_ch=TypeColEcran.DefDocFs;
											break;
										case "VD":
											type_ch=TypeColEcran.VoirDocDb;
											break;
										case "VF":
											type_ch=TypeColEcran.VoirDocFs;
											break;
									}
									var mc:ModifCol=ModifCol.Modifiable;
									switch(code_type_modif_ch)
									{
										case "M":
											mc=ModifCol.Modifiable;
											break;
										case "N":
											mc=ModifCol.NonModifiable;
											break;
										case "O":
											mc=ModifCol.Obligatoire;
											break;
									}
									var ce:ColonneEcran=new ColonneEcran(nom_ch,lib_ch,type_ch,visible,mc,inser_excel,inser_ecran,lg_ch);
									tab_ch[num_ch]=ce;
//console.log("bloc "+num_bloc+": champ "+num_ch+"="+nom_ch);
								}
//console.log("bloc: InitialiserLignes: fin pour num_ligne="+i);
//			this.m_lignes_org[i]=lignes[i];
							}
							this.m_blocs[num_bloc]=new Bloc(this.httpClient,this,nom_table,nom_bloc,lib_bloc,code_type_bloc,sql_select,sql_update,nom_cle_primaire,tab_ch);
						}
//					this.InitialiserLignes(ab.m_lignes);
//console.log('bloc.ChargerBloc: fin correcte');
						this.InitColDefs();
// console.log('m_grid_options_maitre');
//console.log(this.m_grid_options_maitre);
						resolve('OK');
					}
					else
					{
//console.log('requete mal executee: nb_cols='+ab.m_colonnes_sql.length);
						reject(str_res);
					}
				},
				(error) =>
				{
					var str_err:string=error;
					reject(str_err);
//console.log('erreur dans AZlire_config_ecr:'+str_err);
				})
			}
			catch(e)
			{
//console.log('appel de MessageErreur depuis bloc: 14');
				this.MessageErreur("Erreur: "+(e as Error).message+"§§§"+(e as Error).stack);
				reject('KO');
			}
		});
//console.log('Bloc.ChargerBloc:fin de ChargerBloc');
		return promise;
	}
}
export class DefEcran
{
	private m_nom_type_ecran:string='';
	private m_code_ecr:string='';
	private m_nom_ecr:string='';
	private m_lib_ecr:string='';
	private m_blocs:Array<DefBloc>=new Array();
}