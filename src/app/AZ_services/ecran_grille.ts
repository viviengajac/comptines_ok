import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ExcelService } from '../AZ_services/excel.service';
import { OptionsGrille } from '../AZ_common/grille.model';
import { ModalService } from '../AZ_modal/modal.service';
import { Ecran } from './ecran';
import { GlobalConstantes } from '../AZ_common/global_cst';
@Injectable()
export class EcranGrille extends Ecran
{
//	m_onglets: Bloc[];
//	m_classe_boutons: string[];
	m_nb_lignes:number=0;
	gridApi: any=null;
	gridColumnApi: any=null;
	m_grid_api_initialisee:boolean=false;
	m_grid_options:any=null;	// OptionsGrille;
//	m_num_onglet_actif:number=-1;
//	m_classe_bouton_actif:string;
	m_idx_detail:number=-1;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
//console.log('constructeur de EcranGrille');
		super(httpClient,formBuilder,modalService);
//console.log('apres appel du pere');
		this.m_grid_options=new OptionsGrille(this);
	}
	onColumnResized(event:any)
	{
		this.gridApi.resetRowHeights();
	}
	onGridReady(params:any)
	{
//console.log('ecran_grille.onGridReady');
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		var i:number;
		for(i=0;i<this.m_blocs.length;i++)
		{
			this.m_blocs[i].InitGridApi(params.api,params.columnApi);
		}
		this.m_grid_api_initialisee=true;
		if(GlobalConstantes.m_id_appele>0)
			this.onBtnRecherche();
	}
	/*
	AppelerHref(id:number,num_bloc:number)
	{
console.log('EcranGrille.AppelerHref('+id+','+num_bloc+')');
//		const nom_table=this.m_blocs[num_bloc].m_nom_table;
//		this.ChangementDeGrille(nom_table);
		if(id>0)
		{
console.log('EcranGrille.AppelerHref: avant appel de NumLig');
			this.m_idx_detail=this.m_blocs[num_bloc].NumLig(id);
console.log('EcranGrille.AppelerHref: m_idx_detail='+this.m_idx_detail);
		}
		this.onBtnRecherche();
	}
	*/
	async ChangementDeGrille(nom_tab:string)
	{
//console.log('EcranGrille.ChangementDeGrille: nom_tab='+nom_tab);
		var i:number;
		for(i=0;i<this.m_blocs.length;i++)
		{
//console.log('ChangementDeGrille: i='+i);
			if(this.m_blocs[i].m_nom_bloc==nom_tab)
			{
//console.log('ChangementDeGrille: trouve');
				this.m_num_bloc_actif=i;
				this.m_titre=this.m_blocs[this.m_num_bloc_actif].m_lib_bloc;
//console.log('ChangementDeGrille: titre='+this.m_titre);
				if(this.m_grid_api_initialisee)
					this.AfficherBloc(false,false);
			}
		}
//console.log('EcranGrille.ChangementDeGrille: fin');
		this.ReinitialiserCompteur();
	}
	override RequeteRecherche():string
	{
		var req:string="";
		if(this.m_num_bloc_actif>=0)
		{
			req=this.m_blocs[this.m_num_bloc_actif].m_sql_select;
		}
		return req;
	}
	PreparerBloc()
	{
		var promise = new Promise((resolve, reject) =>
		{
			resolve("OK");
		});
		return promise;		
	}
	override AfficherApresRecherche()
	{
		this.m_nb_lignes=this.m_blocs[this.m_num_bloc_actif].m_lignes.length;
//console.log('avant PreparerBloc');
		this.PreparerBloc()
		.then
		(res=>
		{
//console.log('avant AfficherBloc');
			if(GlobalConstantes.m_id_appele>0)
			{
//console.log('EcranGrille.onBtnRecherche: avant appel de NumLig');
				this.m_idx_detail=this.m_blocs[this.m_num_bloc_actif].NumLig(GlobalConstantes.m_id_appele);
//console.log('EcranGrille.onBtnRecherche: m_idx_detail='+this.m_idx_detail);
			}
			this.AfficherBloc(false,false);
			/*
					this.m_classe_bouton_actif="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
					this.m_classe_boutons[this.m_num_bloc_actif]=this.m_classe_bouton_actif;
			*/
//console.log('avant ToucherBlocActif');
			this.ToucherBlocActif();
		},
		err=>
		{
			this.MessageErreur(err+'§sql§data§EcranGrilleService.onBtnRecherche: retour de PreparerBloc');
		});
	}
	override NumBlocPourRecherche()
	{
		return this.m_num_bloc_actif;
	}
	/*
	async onBtnRecherche()
	{
//console.log('EcranGrille.onBtnRecherche');
//console.log('num_bloc_actif='+this.m_num_bloc_actif);
//console.log('bloc actif');
//console.log(this.m_blocs[this.m_num_bloc_actif]);
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
			this.MessageBox("L'objet courant est modifié")
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
			this.LancerUneRecherche(this.m_num_bloc_actif)
			.then
			(res=>
			{
//console.log('apres LancerUneRecherche');
				this.m_nb_lignes=this.m_blocs[this.m_num_bloc_actif].m_lignes.length;
//console.log('avant PreparerBloc');
				this.PreparerBloc()
				.then
				(res=>
				{
//console.log('avant AfficherBloc');
					if(GlobalConstantes.m_id_appele>0)
					{
//console.log('EcranGrille.onBtnRecherche: avant appel de NumLig');
						this.m_idx_detail=this.m_blocs[this.m_num_bloc_actif].NumLig(GlobalConstantes.m_id_appele);
//console.log('EcranGrille.onBtnRecherche: m_idx_detail='+this.m_idx_detail);
					}
					this.AfficherBloc(false,false);
					/ *
					this.m_classe_bouton_actif="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
					this.m_classe_boutons[this.m_num_bloc_actif]=this.m_classe_bouton_actif;
					* /
//console.log('avant ToucherBlocActif');
					this.ToucherBlocActif();
				},
				err=>
				{
					this.MessageErreur(err+'§sql§data§EcranGrilleService.onBtnRecherche: retour de PreparerBloc');
				});
			},
			err=>
			{
				this.MessageErreur(err+'§sql§data§EcranGrilleService.onBtnRecherche: retour de LancerUneRecherche');
			});
//console.log('onBtnRecherche: i='+i);
//			this.m_blocs[this.m_num_bloc_actif].SupprimerToutesLesLignes();
//			this.m_blocs[this.m_num_bloc_actif].m_modif=false;
//			this.AfficherBloc(false,false);
		}
		if(faire)
		{
			this.LancerUneRecherche(0)
			.then
			(res=>
			{
//				this.m_json_detail='';
				this.m_nb_lignes_maitre=this.m_blocs[0].m_lignes.length;
				this.AfficherBloc(0,false,false);
				for(i=1;i<this.m_blocs.length;i++)
				{
//console.log('onBtnRecherche: i='+i);
					this.m_blocs[i].SupprimerToutesLesLignes();
					this.m_blocs[i].m_modif=false;
					this.AfficherBloc(i,false,false);
					this.m_classe_boutons[i]="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
				}
			},
			err=>
			{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 3');
				this.MessageErreur(err);
			});
		}
	}
	*/
	async AfficherBloc(RemplacerNomColParHeader:boolean, PourExcel:boolean )
	{
		/*
//console.log('EcranGrille.AfficherBloc: num_bloc_actif='+this.m_num_bloc_actif);
		var string_json:string=this.m_blocs[this.m_num_bloc_actif].PreparerAffichageBloc(RemplacerNomColParHeader,PourExcel);
//console.log('AfficherBloc: num_onglet='+num_onglet+', string_json='+string_json);
//console.log('donnees pour conversion en JSON='+string_json);
//console.log('Bloc.AfficherBloc: string_json='+string_json);
		this.gridApi.setColumnDefs(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
		var json:any;
		if(string_json.length>0)
		{
//console.log('EcranGrille.AfficherBloc: avant parsage: string_json='+string_json);
			json=JSON.parse(string_json);
//console.log('EcranGrille.AfficherBloc: apres parsage');
//console.log('EcranGrille.AfficherBloc: voir ColDefs');
//console.log(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
		}
		else
			json=new Array(0);
//console.log('afficherbloc: classe de json='+this.m_json.constructor.name);
		await this.delay(300);
		this.gridApi.setRowData(json);
//				this.gridDetailApi.sizeColumnsToFit();
//console.log('fin de Afficherbloc');
//		return promise;
*/
		this.m_blocs[this.m_num_bloc_actif].AfficherBloc(RemplacerNomColParHeader,PourExcel);
		/*
		var classe_bouton:string=this.m_blocs[this.m_num_bloc_actif].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
		classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
		this.m_classe_boutons[this.m_num_bloc_actif]=classe_bouton;
		this.m_classe_bouton_actif=classe_bouton;
		*/
		this.ToucherBlocActif();
		this.m_nb_lignes=this.m_blocs[this.m_num_bloc_actif].m_lignes.length;
		if(this.m_idx_detail>=0)
		{
			this.gridApi.forEachNode
			((node: { rowIndex: number; setSelected: (arg0: boolean) => void; })=>
				{
//					console.log('node.rowIndex='+node.rowIndex);
					if(node.rowIndex == this.m_idx_detail)node.setSelected(true)
				}
			)
			this.gridApi.ensureIndexVisible(this.m_idx_detail);
			this.m_idx_detail=-1;
		}
	}
	/*
	delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	*/
	override DefNomFic():string
	{
		var nom_fic: string='';
		if(this.m_num_bloc_actif>=0)
		{
			nom_fic=this.m_blocs[this.m_num_bloc_actif].m_lib_bloc;
		}
		return nom_fic;
	}
	onExcel()
	{
		var nom_blocs: string[] = [this.m_blocs[this.m_num_bloc_actif].m_lib_bloc];
		var string_json=this.m_blocs[this.m_num_bloc_actif].DonnerStringJSon(true,true);
//console.log('onexcelmaitre: string_json='+string_json);
		var contenu_blocs: string[] = [JSON.parse(string_json)];
		var nom_fic=this.DefNomFic();
		var excelService: ExcelService = new ExcelService();
		excelService.exportAsExcelFile(nom_blocs, contenu_blocs, nom_fic);
		this.ReinitialiserCompteur();
	}
	async onCreer()
	{
		var id_cle_primaire=this.m_blocs[this.m_num_bloc_actif].CreerUneLigne();
//console.log('EcranGilleService.onCreer: id_cle_primaire='+id_cle_primaire);
		var pour_excel:boolean=false;
		this.AfficherBloc(false,pour_excel);
	}
	async onSupprimer()
	{
		var faire:boolean=true;
//console.log("nom_onglet_actif="+this.m_num_onglet_actif);
		const selectedRow = this.gridApi.getSelectedRows()[0];
		var nom_champ=this.m_blocs[this.m_num_bloc_actif].m_nom_cle_primaire;
		var id=selectedRow[nom_champ];
//console.log("nom_champ="+nom_champ);
		this.m_blocs[this.m_num_bloc_actif].SupprimerUneLigne(id);
//console.log('OnSupprimer: id_a_supprimer='+id_detail);
		var pour_excel:boolean=false;
		this.AfficherBloc(false,pour_excel);
	}
	async onSauver()
	{
		try
		{
//console.log('onSauver: num_bloc_actif='+this.m_num_bloc_actif);
			this.m_blocs[this.m_num_bloc_actif].Sauver()
			.then(res =>
			{
//console.log('apres then: num_onglet='+this.m_num_onglet_actif+', res='+res);
				var str_res:string=""+res;
				if(str_res.startsWith('Erreur'))
				{
					this.MessageErreur(str_res+'§sql§data§EcranGrilleService.onSauver');
				}
				else
				{
					/*
					this.m_classe_bouton_actif="btn_onglet_actif_"+GlobalConstantes.m_classe_fonte;
					this.m_classe_boutons[this.m_num_bloc_actif]=this.m_classe_bouton_actif;
					*/
					this.ToucherBlocActif();
				}
//console.log('onglet['+this.m_num_onglet_actif+']: modif repasse a false');
			},
			err =>
			{
				this.MessageErreur(err+'§sql§data§EcranGrilleService.onSauver');
			});
		}
		catch(e)
		{
			this.MessageErreur("Erreur: "+(e as Error).message+'§sql§data§EcranGrilleService.onSauver');
		}
	}
	/*
	ModifValeurChamp(nom_col_modifiee:string,id_cle_primaire:number,val_col_new: any)
	{
		if(id_cle_primaire<-GlobalConstantes.m_nb_max_lig_creees)
		{
			this.MessageErreur('Ligne non modifiable');
		}
		else
		{
//console.log('EcranGrilleService.ModifValeurChamp('+nom_col_modifiee+','+id_cle_primaire+')');
			this.m_blocs[this.m_num_bloc_actif].ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
			/ *
			this.m_classe_bouton_actif="btn_onglet_actif_modif_"+GlobalConstantes.m_classe_fonte;
			this.m_classe_boutons[this.m_num_bloc_actif]=this.m_classe_bouton_actif;
			* /
			this.ToucherBlocActif();
		}
	}
	*/
	onCellValueChanged(event:any)
	{
		var nom_col_modifiee:string='';
		var id_cle_primaire:number=-1;
		try
		{
			var val_col_new=""+event.newValue;
			var val_col_old=""+event.oldValue;
			if(event.newValue===undefined)
				val_col_new="";
			if(val_col_new!=val_col_old)
			{
				var nom_col_cle_primaire=this.m_blocs[this.m_num_bloc_actif].m_colonnes_ecran[1].m_nom_col;
				nom_col_modifiee=event['column']['colId'];
				var num_lig_ecran_modifiee:number=-1;
				var faire:boolean=true;
				var selectedRow = this.gridApi.getSelectedRows()[0];
				id_cle_primaire=selectedRow[nom_col_cle_primaire];
//console.log('EcranGrilleService: nom_col_cle_primaire='+nom_col_cle_primaire);
//console.log(selectedRow);
//console.log('EcranGrilleService.onCellValueDetailChanged: nouvelle valeur='+val_col_new+', ancienne valeur='+val_col_old+', colonne='+event['column']['colId']);
//console.log('EcranGrilleService.onCellValueDetailChanged: id_cle_primaire='+id_cle_primaire);

//console.log('nouvelle valeur='+val_col_new+', ancienne valeur='+val_col_old+', colonne='+event['column']['colId']);
//				var num_col_sql_modifiee:number=this.m_blocs[this.m_num_bloc_actif].NumeroColonneSql(nom_col_modifiee);
//console.log('nom_col_cle_primaire='+nom_col_cle_primaire+', id_cle_primaire='+id_cle_primaire);
				if(id_cle_primaire===undefined)
				{
//console.log('nouvelle ligne');
				}
//console.log('EcranGrilleService.OnCellValueChanged: appel de ModifValeurChamp('+nom_col_modifiee+','+id_cle_primaire+')');
				this.ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
			}
		}
		catch(e)
		{
			this.MessageErreur("Erreur: "+(e as Error).message+'§sql§nom_col_modifiee='+nom_col_modifiee+',id_cle_primaire='+id_cle_primaire+'§EcranGrilleService.onCellValueChanged');
		}
	}
	onRowClick(event:any)
	{
//console.log('EcranGrille.onRowClickDetail: nouvel index='+event.rowIndex);
		const selectedRow = this.gridApi.getSelectedRows()[0];
//console.log(selectedRow);
		var id=selectedRow[this.m_blocs[this.m_num_bloc_actif].m_nom_cle_primaire];
//console.log('id='+id);
//console.log('nom_col_cliquee='+this.m_nom_col_cliquee);
		if(this.m_nom_col_cliquee!=undefined)
			this.m_blocs[this.m_num_bloc_actif].PersonnaliserCbo(id,this.m_nom_col_cliquee);
//						this.m_col[num_col]=nouvelle_col;
//console.log(this.gridColumnApi.constructor.name);
		this.m_grid_options.columnDefs=this.m_blocs[this.m_num_bloc_actif].m_coldefs;
		this.gridApi.setColumnDefs(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
	}
	override RafraichirEcran()
	{
//console.log('EcranGrille.RafraichirEcran');
		this.AfficherBloc(false,false);
		this.gridApi.setColumnDefs(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
	}
}
