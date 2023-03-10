import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { Bloc } from '../AZ_services/bloc';
import { Cellule,TypeColEcran } from '../AZ_common/ecran.model';
import { OptionsGrille } from '../AZ_common/grille.model';
import { ModalService } from '../AZ_modal/modal.service';
import { Ecran } from './ecran';
import { GlobalConstantes } from '../AZ_common/global_cst';
@Injectable()
export class EcranFormulaire extends Ecran
{
	m_style_champs_onglet_principal:string='';
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
//console.log('constructeur de EcranGrille');
		super(httpClient,formBuilder,modalService);
//console.log('apres appel du pere');
		var style_champs_onglet_principal="width: 300px;";
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				style_champs_onglet_principal="width: 300px;";
				break;
			case "petite":
				style_champs_onglet_principal="width: 400px;";
				break;
			case "moyenne":
				style_champs_onglet_principal="width: 500px;";
				break;
			case "grande":
				style_champs_onglet_principal="width: 600px;";
				break;
			case "tres_grande":
				style_champs_onglet_principal="width: 700px;";
				break;
		}
		this.m_style_champs_onglet_principal=style_champs_onglet_principal;
		this.m_num_bloc_actif=0;
	}
	override RequeteRecherche():string
	{
		var req:string=this.m_blocs[0].m_sql_select;
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
		this.m_blocs[0].m_modif=false;
		this.AfficherBloc(false);
		this.m_classe_boutons[0]="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
	}
	/*
	async onBtnRecherche()
	{
console.log('EcranFormulaire.onBtnRecherche');
console.log('num_bloc_actif='+this.m_num_bloc_actif);
console.log('bloc actif');
console.log(this.m_blocs[this.m_num_bloc_actif]);
		var modif: boolean=this.m_blocs[this.m_num_bloc_actif].m_modif;
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
//				this.m_nb_lignes=this.m_blocs[this.m_num_bloc_actif].m_lignes.length;
//console.log('avant PreparerBloc');
				this.PreparerBloc()
				.then
				(res=>
				{
//console.log('avant AfficherBloc');
/ *
					if(GlobalConstantes.m_id_appele>0)
					{
//console.log('EcranGrille.onBtnRecherche: avant appel de NumLig');
						this.m_idx_detail=this.m_blocs[this.m_num_bloc_actif].NumLig(GlobalConstantes.m_id_appele);
//console.log('EcranGrille.onBtnRecherche: m_idx_detail='+this.m_idx_detail);
					}
* /
					this.AfficherBloc(false);
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
	}
	*/
	async AfficherBloc(RemplacerNomColParHeader:boolean)
	{
//console.log('EcranFormulaire.AfficherBloc');
		var num_bloc:number=0;
		this.AfficherOngletFormulaire(num_bloc);
		var classe_bouton:string=this.m_blocs[num_bloc].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
		classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
		this.m_classe_boutons[num_bloc]=classe_bouton;
	}
	onSauver()
	{
		try
		{
//console.log('EcranFormulaire.onSauver: num_bloc_actif='+this.m_num_bloc_actif);
			this.m_blocs[this.m_num_bloc_actif].Sauver()
			.then(res =>
			{
//console.log('apres then: num_bloc='+this.m_num_bloc_actif+', res='+res);
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
	onChangeEvent(event:any)
	{
		var t:HTMLInputElement=event.target;
		var nom_elem=t.name;
		var val:any=t.value;
		var num_bloc:number=1;
		var num_col_sql_modifiee:number=this.m_blocs[num_bloc].NumeroColonneSql(nom_elem);
		if(num_col_sql_modifiee<0)
		{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 15');
			this.MessageErreur("Element inconnu: "+nom_elem);
		}
		else
		{
			var nom_col_cle_primaire=this.m_blocs[num_bloc].m_nom_cle_primaire;
			var id_cle_primaire=this.m_blocs[1].ValCelluleParNom(0,nom_col_cle_primaire);
//console.log('appel de onChangeEvent: nom_elem='+nom_elem+', num_col_sql_modifiee='+num_col_sql_modifiee+', val='+val);
			this.ModifValeurChamp(nom_elem,id_cle_primaire,val);
		}
	}
	AfficherOngletPrincipal()
	{
console.log('EcranFormulaire.AfficherOngletPrincipal');
		var i:number;
		var bloc:Bloc=this.m_blocs[1];
		for(i=0;i<bloc.m_colonnes_ecran.length;i++)
		{
			if(bloc.m_colonnes_ecran[i].m_visible==true && bloc.m_colonnes_ecran[i].m_inser_ecran==true)
			{
				var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
				var nom_champ_ts:string="m_"+nom_champ;
//console.log('AfficherOngletDetailPrincipal: avant nom_champ='+nom_champ);
				var val:any;
				var v_vrai:boolean=true;
				var v_faux:boolean=false;
				if(this.m_blocs[1].m_lignes.length>0)
				{
					val=bloc.ValCelluleParNom(0,nom_champ);
					if(bloc.m_colonnes_ecran[i].m_type_col==TypeColEcran.Booleen)
					{
						if(val==0)
							val=v_faux;
						else if (val==1)
							val=v_vrai;
					}
//console.log('AfficherOngletDetailPrincipal: val='+val);
				}
				else
				{
					val=undefined;
				}
//console.log('AfficherOngletDetailPrincipal: nom_champ='+nom_champ_ts+', val='+val);
//console.log(this.formOngletPrincipal);
//console.log(this.formOngletPrincipal.get(nom_champ_ts));
				this.formOngletPrincipal.get(nom_champ_ts).setValue(val);
//console.log('AfficherOngletDetailPrincipal: apres SetValue');
			}
		}
	}
	TransfererOngletDetailPrincipal()
	{
//console.log('AfficherOngletDetailPrincipal');
		var i:number;
		var bloc:Bloc=this.m_blocs[1];
		for(i=0;i<bloc.m_colonnes_ecran.length;i++)
		{
			if(bloc.m_colonnes_ecran[i].m_visible==true && bloc.m_colonnes_ecran[i].m_inser_ecran==true)
			{
				var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
				var nom_champ_ts:string="m_"+nom_champ;
				var num_col_sql=bloc.NumeroColonneSql(nom_champ);
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
	*/
	override RafraichirEcran()
	{
//console.log('EcranGrille.RafraichirEcran');
		this.AfficherBloc(false);
	}
}
