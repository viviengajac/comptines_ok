// https://htmldom.dev/create-resizable-split-views/
// https://mikesknowledgebase.azurewebsites.net/pages/Services/WebServices-Page8.7.htm
// https://stackblitz.com/edit/angular-mousemove-after-mouse-down?file=app%2Fapp.component.ts
// https://stackoverflow.com/questions/26233180/resize-a-div-on-border-drag-and-drop-without-adding-extra-markup
import { Injectable } from '@angular/core';
//import { fromEvent } from 'rxjs/observable/fromEvent';
import { skipUntil, takeUntil } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from '../AZ_services/excel.service';
import { Bloc } from '../AZ_services/bloc';
import { Cellule,TypeColEcran } from '../AZ_common/ecran.model';
import { OptionsGrille } from '../AZ_common/grille.model';
import { ModalService } from '../AZ_modal/modal.service';
import { Ecran } from './ecran';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { AccesBdService } from '../AZ_services/acces_bd';
import { MenuComponent } from '../menu/menu.component';

@Injectable()
export class EcranMaitreDetail extends Ecran // implements OnInit
{
//	m_onglets: Bloc[];
	m_json_maitre: any=null;
	m_nb_lignes_maitre:number=0;
	gridMaitreApi: any=null;
	gridMaitreColumnApi: any=null;
	m_id_maitre: number=-1;
	m_nom_cle_maitre: string='';
	m_grid_options_maitre:any=null;	//	OptionsGrille;
	gridDetailApi: any=null;
	gridDetailColumnApi: any=null;
	m_json_detail: any=null;
	m_row_index_maitre:number=-1;
	m_onglet_principal:boolean=false;
	m_grid_options_detail:any=null;	// OptionsGrille;
	m_style_champs_onglet_principal:string='';
	m_idx_detail:number=-1;
	m_hauteur_grille_maitre:number=200;
	m_style_grille_maitre:string='';
	m_style_bloc_maitre:string='';
	/*
	m_y_splitter:number;
	m_nom_splitter:string;
	m_splitter:any;
	m_mouse_up$:any=null;
	m_mouse_down$:any=null;
	m_mouse_down_sub:any;
	m_mouse_move$:any=null;
//	m_mouse_hold$:any;
	m_mouse_leave$:any=null;
	sub: any;
	m_splitter_actif:boolean=false;
	*/
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
//console.log("EcranMaitreDetail: constructor: debut");
		super(httpClient,formBuilder,modalService);
		this.m_grid_options_maitre=new OptionsGrille(this);
//		this.m_grid_options_maitre.rowHeight=25;
		var hauteur_grille_maitre:number=300;
		var style_champs_onglet_principal="width: 300px;";
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				style_champs_onglet_principal="width: 300px;";
				hauteur_grille_maitre=150;
				break;
			case "petite":
				style_champs_onglet_principal="width: 400px;";
				hauteur_grille_maitre=300;
				break;
			case "moyenne":
				style_champs_onglet_principal="width: 500px;";
				hauteur_grille_maitre=300;
				break;
			case "grande":
				style_champs_onglet_principal="width: 600px;";
				hauteur_grille_maitre=300;
				break;
			case "tres_grande":
				style_champs_onglet_principal="width: 700px;";
				hauteur_grille_maitre=300;
				break;
		}
		this.m_style_champs_onglet_principal=style_champs_onglet_principal;
		/*
		this.m_y_splitter=hauteur_grille_maitre;
		*/
		this.DefinirHauteurGrilleMaitre(hauteur_grille_maitre);
		this.m_grid_options_detail=new OptionsGrille(this);
//		this.m_grid_options_detail.getRowClass=this.ChangerClasseLignesDetail;
//		this.m_grid_options_detail.getRowStyle=this.ChangerStyleLignesDetail;
		/*
		let self=this;
		this.m_grid_options_detail.getRowStyle=function(params)
		{
			var num_bloc_actif=self.m_num_bloc_actif;
console.log('num_bloc_actif='+num_bloc_actif);
			var test:number=+params.data.id_interv_cmpt;
			if (test < 0)
			{
//			params.highlighted=true;
//			params.selectable=false;
console.log('fond rouge');
				return { 'background-color': '#BBB' };
//			return { 'color': '#BBB' };
//			return 'non-modifiable';
			}
		}
		*/
//console.log("EcranMaitreDetail: constructor: fin: hauteur_grille_maitre="+this.m_hauteur_grille_maitre);
	}
	/*
	ChangerClasseLignesDetail(params)
	{
console.log('EcranMaitreDetail.ChangerClasseLignesDetail');
console.log(params);
//console.log(params.data);
//console.log(params.data.id_interv_cmpt);
console.log('params.data[0]='+params.data[1]);
		var donnees=params.data;
console.log('donnees');
console.log(donnees);
		for(var i=0;i<params.data.length;i++)
		{
console.log('params.data['+i+']='+params.data[i]);
		}
		var test:number=0;
		var num_bloc_actif=params.context.componentParent.m_bloc_actif;
console.log('num_bloc_actif='+num_bloc_actif);
		var nom_bloc_actif=this.m_blocs[params.context.componentParent.m_bloc_actif].m_nom_bloc;
console.log('nom_bloc_actif='+nom_bloc_actif);
		test=+params.data.id_interv_cmpt;
		if (test < 0)
		{
//			params.highlighted=true;
//			params.selectable=false;
console.log('fond rouge');
//			return { 'background-color': '#BBB' };
//			return { 'color': '#BBB' };
			return 'non-modifiable';
		}
	}
	*/
	/*
	ChangerStyleLignesDetail(params)
	{
console.log('EcranMaitreDetail.ChangerStyleLignesDetail');
console.log(params);
console.log(params.data);
console.log(params.data.id_interv_cmpt);
		var donnees=params.data;
console.log('donnees');
console.log(donnees);
console.log(donnees[0]);
console.log(donnees.length);
//console.log('num_bloc_actif='+this.m_num_bloc_actif);
		for(var i=0;i<params.data.length;i++)
		{
console.log('params.data['+i+']='+params.data[i]);
		}
		var num_bloc_actif=params.context.componentParent.m_bloc_actif;
console.log('num_bloc_actif='+num_bloc_actif);
//		var nom_bloc_actif=this.m_blocs[params.context.componentParent.m_bloc_actif].m_nom_bloc;
//console.log('nom_bloc_actif='+nom_bloc_actif);
		var test:number=+params.data.id_interv_cmpt;
		if (test < 0)
		{
//			params.highlighted=true;
//			params.selectable=false;
console.log('fond rouge');
			return { 'background-color': '#BBB' };
//			return { 'color': '#BBB' };
//			return 'non-modifiable';
		}
	}
	*/
/*
	InitSplitter()
	{
		this.m_splitter = document.getElementById('splitter');
console.log('EcranMaitreDetail.InitSplitter');
//console.log('resizer');
//console.log(this.m_splitter);
		if(this.m_splitter!=null)
		{
			this.m_mouse_up$ = fromEvent(this.m_splitter, 'mouseup');
			this.m_mouse_up$.subscribe(_ =>
			{
console.log('up');
				this.m_splitter_actif=false;
//				this.EnregistrerSplitter();
			})
			this.m_mouse_down$ = fromEvent(this.m_splitter, 'mousedown');
			/ *
			this.m_mouse_down$.subscribe(_ =>
			{
console.log('down');
				this.m_splitter_actif=true;
				this.m_y_splitter=-1;
			});
			* /
			this.m_mouse_down$.subscribe((e) =>
			{
console.log('down');
				this.m_splitter_actif=true;
				this.m_y_splitter=e.y;
			});
			this.m_mouse_leave$ = fromEvent(this.m_splitter, 'mouseleave');
			this.m_mouse_leave$.subscribe(_ =>
			{
console.log('leave');
				this.m_splitter_actif=false;
			});
			this.EnregistrerSplitter();
		}
	}
	EnregistrerSplitter()
	{
		try
		{
			this.sub.unsubscribe();
		}
		catch (err)
		{
      
		}
		finally
		{

		}
		this.m_splitter_actif=false;
		let mousemove$ = fromEvent(this.m_splitter, 'mousemove');
		mousemove$ = mousemove$.pipe(skipUntil(this.m_mouse_down$));
		mousemove$ = mousemove$.pipe(takeUntil(this.m_mouse_up$));
		this.sub = mousemove$.subscribe((e: any) =>
		{
			if(this.m_splitter_actif)
			{
//			this.mouseX = e.clientX;
//				this.m_nb_lignes_maitre=e.clientY;
//			this.m_splitter_actif=true;
console.log('debut mouse move souris:'+e.x+', '+e.y+', y_splitter='+this.m_y_splitter);
				if(this.m_y_splitter<0)
					this.m_y_splitter=e.y;
				else
				{
					const dy = e.y - this.m_y_splitter;
					this.m_y_splitter = e.y;
//					this.m_y_splitter = e.clientY;
					var h=this.m_hauteur_grille_maitre+dy;
					if(h<10)h=10;
//console.log('h='+h);
					this.DefinirHauteurGrilleMaitre(h);
				}
console.log('fin mouse move souris:'+e.x+', '+e.y+', y_splitter='+this.m_y_splitter);
			}
		})
	}
	DesouscrireSplitter()
	{
		if(this.m_mouse_down$!=null)this.m_mouse_down$.unsubscribe();
		if(this.m_mouse_move$!=null)this.m_mouse_move$.unsubscribe();
		if(this.m_mouse_up$!=null)this.m_mouse_up$.unsubscribe();
		if(this.m_mouse_leave$!=null)this.m_mouse_leave$.unsubscribe();
	}
	SouscrireSplitter()
	{
		if(this.m_splitter!=null)
		{
console.log('1');
			this.m_mouse_down$ = fromEvent(this.m_splitter, 'mousedown');
			this.m_mouse_move$ = fromEvent(this.m_splitter, 'mousemove');
			this.m_mouse_up$ = fromEvent(this.m_splitter, 'mouseup');
			this.m_mouse_leave$ = fromEvent(this.m_splitter, 'mouseleave');
console.log('2');
			this.m_mouse_down$.subscribe((e) =>
			{
console.log('down');
				this.m_splitter_actif=true;
				this.m_y_splitter = e.y;
			})
console.log('3');
			this.m_mouse_move$.subscribe((e) =>
			{
console.log('move: splitter_actif='+this.m_splitter_actif);
				if(this.m_splitter_actif)
				{
					const dy=e.y-this.m_y_splitter;
					this.m_y_splitter = e.y;
					var h=this.m_hauteur_grille_maitre+dy;
					if(h<10)h=10;
console.log('h='+h);
					this.DefinirHauteurGrilleMaitre(h);
				}
			})
console.log('4');
			this.m_mouse_up$.subscribe((e) =>
			{
console.log('up');
				this.m_splitter_actif=false;
				this.DesouscrireSplitter();
			})
console.log('5');
			this.m_mouse_leave$.subscribe((e) =>
			{
console.log('leave');
				this.m_splitter_actif=false;
				this.DesouscrireSplitter();
			})
console.log('6');
		}
	}
*/
/*
	InitSplitter(nom_splitter:string)
	{
		/ *
		if(this.m_mouse_down$!=null)
			this.m_mouse_down$.unsubscribe();
		if(this.m_mouse_down$!=null)
			this.m_mouse_down$.unsubscribe();
		* /
		this.m_splitter = document.getElementById(nom_splitter);
console.log('EcranMaitreDetail.InitSplitter');
//console.log('resizer');
//console.log(this.m_splitter);
		if(this.m_splitter!=null)
		{
console.log('1');
			this.m_mouse_down$ = fromEvent(this.m_splitter, 'mousedown');
console.log('mouse_down');
console.log(this.m_mouse_down$);
			this.m_mouse_move$ = fromEvent(this.m_splitter, 'mousemove');
			this.m_mouse_up$ = fromEvent(this.m_splitter, 'mouseup');
			this.m_mouse_leave$ = fromEvent(this.m_splitter, 'mouseleave');
console.log('2');
			this.m_mouse_down_sub=this.m_mouse_down$.subscribe((e) =>
			{
console.log('down');
				this.m_splitter_actif=true;
				this.m_y_splitter = e.y;
				this.m_mouse_down_sub.unsubscribe();
			})
console.log('3');
			this.m_mouse_move$.subscribe((e) =>
			{
console.log('move: splitter_actif='+this.m_splitter_actif);
				if(this.m_splitter_actif)
				{
					const dy=e.y-this.m_y_splitter;
					this.m_y_splitter = e.y;
					var h=this.m_hauteur_grille_maitre+dy;
					if(h<10)h=10;
console.log('h='+h);
					this.DefinirHauteurGrilleMaitre(h);
				}
			})
console.log('4');
			this.m_mouse_up$.subscribe((e) =>
			{
console.log('up');
				this.m_splitter_actif=false;
				this.m_mouse_down$.subscribe((e) =>
				{
console.log('down');
					this.m_splitter_actif=true;
					this.m_y_splitter = e.y;
					this.m_mouse_down_sub.unsubscribe();
				})
			})
console.log('5');
			this.m_mouse_leave$.subscribe((e) =>
			{
console.log('leave');
				this.m_splitter_actif=false;
				this.m_mouse_down$.subscribe((e) =>
				{
console.log('down');
					this.m_splitter_actif=true;
					this.m_y_splitter = e.y;
					this.m_mouse_down_sub.unsubscribe();
				})
			})
console.log('6');
/ *
			// switchMap is extremely helpful
			// map source observable to inner observable. remember it as switch to new observable.
			this.m_mouse_hold$ = this.m_mouse_down$.switchMap(()=> this.m_mouse_move$).takeUntil(this.m_mouse_up$);
console.log('9');

			this.sub = this.m_mouse_hold$.subscribe((e) =>
			{
				this.m_y_splitter = e.y;
			});
console.log('10');
* /
		}
	}
	/ *
	unsub()
	{
		if(this.sub)
		{
			this.sub.unsubscribe();
		}
	}
	EnregistrerSplitter()
	{
		this.m_mouse_hold$ = this.m_mouse_down$.switchMap(()=> this.m_mouse_move$).takeUntil(this.m_mouse_up$);
		this.sub = this.m_mouse_hold$.subscribe((e) =>
		{
			this.m_y_splitter = e.y;
		})
	}
	*/
	onAugmenterTaille()
	{
		this.DefinirHauteurGrilleMaitre(this.m_hauteur_grille_maitre+10);
	}
	onDiminuerTaille()
	{
		this.DefinirHauteurGrilleMaitre(this.m_hauteur_grille_maitre-10);
	}
	DefinirHauteurGrilleMaitre(h:number)
	{
//console.log('EcranMaitreDetail.DefinirHauteurGrilleMaitre('+h+')');
		this.m_hauteur_grille_maitre=h;
		this.m_style_grille_maitre="width: 100%; height: "+h+"px;";
		this.m_style_bloc_maitre="border:2px solid #000;width: 100%; height: "+h+"px; overflow: auto;padding: 2px; min-height: 80px;resize:vertical; box-sizing: border-box;";
	}
	onColumnMaitreResized(event:any)
	{
//console.log('resetRowHeights');
		this.gridMaitreApi.resetRowHeights();
	}
	onColumnDetailResized(event:any)
	{
		this.gridDetailApi.resetRowHeights();
	}
	onGridMaitreReady(params:any)
	{
//console.log('EcranMaitreDetail.onGridMaitreReady');
//console.log(this.m_grid_options_maitre);
		this.gridMaitreApi = params.api;
		this.gridMaitreColumnApi = params.columnApi;
		this.m_blocs[0].InitGridApi(params.api,params.columnApi);
//console.log('EcranMaitreDetail.onGridMaitreReady: m_id_appele='+GlobalConstantes.m_id_appele);
		if(GlobalConstantes.m_id_appele>0)
		{
			this.DefinirHauteurGrilleMaitre(10);
			this.AppelerHref(GlobalConstantes.m_id_appele,GlobalConstantes.m_num_bloc_appele);
		}
	}
	RestaurerCboSpecifiques()
	{
	}
	async onRowClickMaitre(event:any)
	{
console.log('onRowClickMaitre: m_row_index_maitre='+this.m_row_index_maitre+', nouvel index='+event.rowIndex);
		var i:number;
		var modif: boolean=false;
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
//console.log('EcranMaireDetail: appel de messagebox: 1');
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
			this.RestaurerCboSpecifiques();
			const selectedRow = this.gridMaitreApi.getSelectedRows()[0];
console.log('selectedRow, nom_cle_maitre='+this.m_nom_cle_maitre);
console.log(selectedRow);
			this.m_id_maitre=selectedRow[this.m_nom_cle_maitre];
console.log('id_maitre='+this.m_id_maitre);
			this.ChargerDetails(false,false);
			this.ReinitialiserCompteur();
			this.m_row_index_maitre=event.rowIndex;
		}
		else
		{
			// reselectionner la ligne precedente definie par m_id_maitre
			this.gridMaitreApi.forEachNode((node: { setSelected: (arg0: boolean) => any; rowIndex: number; }) => node.setSelected(node.rowIndex==this.m_row_index_maitre));
		}
	}
	AppelerHref(id:number,num_bloc:number)
	{
//console.log('EcranMaitreDetail.AppelerHref('+id+','+num_bloc+')');
		var id_maitre:number=id;
		if(num_bloc>1)
		{
			const nom_table=this.m_blocs[num_bloc].m_nom_table;
			const req="exec AZtrouver_id_maitre '"+nom_table+"',"+id;
//console.log('EcranMaitreDetail.AppelerHref: req='+req);
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
//console.log('EcranMaitreDetail.AppelerHref: res='+res);
						var id:number= +str_res;
						id_maitre = id;
//console.log('EcranMaitreDetail.AppelerHref: id_maitre='+id_maitre);
						this.m_id_maitre=id_maitre;
						this.m_num_bloc_actif=num_bloc;
//console.log('EcranMaitreDetail.AppelerHref: m_id_maitre='+this.m_id_maitre);
						this.ChargerDetails(false,false);
						/*
						var idx:number=this.m_blocs[num_bloc].NumLig(id);
console.log('EcranMaitreDetail.AppelerHref: idx='+idx);
						this.gridDetailApi.forEachNode(node=> {if(node.rowIndex == idx)node.setSelected(true)})
						*/
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
			this.m_id_maitre=id;
//console.log('EcranMaitreDetail.AppelerHref: m_id_maitre='+this.m_id_maitre);
			this.ChargerDetails(false,false);
		}
		this.ReinitialiserCompteur();
	}
	override RequeteRecherche():string
	{
		return "";
	}
	override AfficherApresRecherche()
	{
		this.m_nb_lignes_maitre=this.m_blocs[0].m_lignes.length;
		this.AfficherBloc(0,false,false);
		var i:number;
		for(i=1;i<this.m_blocs.length;i++)
		{
//console.log('onBtnRecherche: i='+i);
			this.m_blocs[i].SupprimerToutesLesLignes();
			this.m_blocs[i].m_modif=false;
			this.AfficherBloc(i,false,false);
			this.m_classe_boutons[i]="btn_onglet_inactif_"+GlobalConstantes.m_classe_fonte;
		}
	}
	/*
	async onBtnRecherche()
	{
//console.log('onBtnRecherche');
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
			this.LancerUneRecherche(0)
			.then
			(res=>
			{
				this.m_json_detail='';
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
	onGridDetailReady(params:any)
	{
		this.gridDetailApi = params.api;
		this.gridDetailColumnApi = params.columnApi;
		var i:number;
		for(i=1;i<this.m_blocs.length;i++)
		{
			this.m_blocs[i].InitGridApi(params.api,params.columnApi);
		}
	}
	async ChargerDetails(supp_col_invisibles: boolean,remplacer_nom_col_par_header:boolean)
	{
console.log('ChargerDetails');
console.log('id_maitre='+this.m_id_maitre);
		this.m_idx_detail-1;
		if(this.m_id_maitre > 0)
		{
console.log('id_maitre='+this.m_id_maitre);
			var nb_blocs:number=this.m_blocs.length-1;
			var i: number;
			var num_bloc:number=1;
			var en_cours: boolean=false;
//			this.m_num_onglet_actif=1;
			for(i=1;i<=nb_blocs;i++)
			{
				while(en_cours===true)
				{
//console.log('attente (i='+i+')');
					await this.delay(10);
				}
//console.log('apres attente (i='+i+')');
				en_cours=true;
				var bloc=this.m_blocs[i];
				this.m_blocs[i].m_modif=false;
				var sql=bloc.m_sql_select.replace("@id@",""+this.m_id_maitre);
//console.log('EcranMaitreDetail.ChargerDetails: sql='+sql);
				this.m_blocs[num_bloc].ChargerBloc(sql,supp_col_invisibles, remplacer_nom_col_par_header)
				.then(res =>
				{
//console.log('apres then: nom_onglet='+onglet.m_lib_onglet);
					var str_res:string=""+res;
//console.log('str_res='+str_res);
					if(str_res.startsWith('Erreur'))
					{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 4');
						this.MessageErreur(str_res);
					}
//console.log('EcranMaitreDetail.ChargerDetails: id_appele='+GlobalConstantes.m_id_appele+', num_bloc_appele='+GlobalConstantes.m_num_bloc_appele+', num_bloc='+num_bloc);
					if(GlobalConstantes.m_id_appele>0 && GlobalConstantes.m_num_bloc_appele==num_bloc)
					{
						this.m_idx_detail=this.m_blocs[num_bloc].NumLig(GlobalConstantes.m_id_appele);
//console.log('EcranMaitreDetail.ChargerDetails: m_idx_detail='+this.m_idx_detail);
					}
					num_bloc++;
					en_cours=false;
//console.log('EcranMaitreDetail.ChargerDetails: ChargerBloc fait');
				},
				erreur=>
				{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 5');
					this.MessageErreur(erreur);
				});
			}
//console.log('EcranMaitreDetail.ChargerDetails: fin de la boucle sur les blocs');
			while(en_cours===true)
			{
				await this.delay(100);
			}
			num_bloc=1;
			if(this.m_num_bloc_actif>0)
				num_bloc=this.m_num_bloc_actif;
			var nom=this.m_blocs[num_bloc].m_nom_bloc;
//console.log('retour a '+nom);
			this.onBtnDetail(nom);
		}
	}
	onBtnDetail(nom_btn: string)
	{
//console.log('onBtnDetail('+nom_btn+') id_maitre='+this.m_id_maitre);
		if(this.m_id_maitre>0)
		{
//console.log('id_maitre='+this.m_id_maitre);
			var i:number;
			for(i=1;i<this.m_blocs.length;i++)
			{
				var classe_bouton=this.m_blocs[i].m_modif?"btn_onglet_inactif_modif":"btn_onglet_inactif";
				classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
				this.m_classe_boutons[i]=classe_bouton;
//console.log('comparaison de '+nom_btn+' et '+this.m_blocs[i].m_nom_bloc);
				if(nom_btn==this.m_blocs[i].m_nom_bloc)
				{
//console.log('trouve');
					this.m_num_bloc_actif=i;
				}
			}
//console.log('onBtnDetail: num_onglet_actif='+this.m_num_onglet_actif);
//			this.m_col_detail=this.m_onglets[this.m_num_onglet_actif].m_coldefs;
//			this.m_grid_options_detail.columnDefs=this.m_col_detail;
			var remplacer_nom_col_par_header:boolean=false;
			var pour_excel:boolean=false;
//			this.m_classe_boutons[this.m_num_onglet_actif]=this.m_onglets[this.m_num_onglet_actif].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
//console.log('onBtnDetail: avant AfficherBloc');
			this.AfficherBloc(this.m_num_bloc_actif, remplacer_nom_col_par_header,pour_excel);
//console.log('onBtnDetail: apres AfficherBloc');
			this.ReinitialiserCompteur();
//		this.AfficherDetail(this.m_num_onglet_actif,false);
		}
	}
	onHrefDetail(nom_ecran: string)
	{
//console.log('onBtnDetail('+nom_ecran+')');
		if(this.m_id_maitre>0)
		{
//console.log('passage id_maitre>0');
			var i:number;
			var nom_champ_bouton='id_'+nom_ecran;
			var bloc:Bloc=this.m_blocs[1];
			for(i=0;i<bloc.m_colonnes_ecran.length;i++)
			{
				if(bloc.m_colonnes_ecran[i].m_visible==true)
				{
					var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
					if(nom_champ==nom_champ_bouton)
					{
						var num_col_sql=bloc.NumeroColonneSql(nom_champ);
//console.log('num_col_sql='+num_col_sql);
						var nom_champ_ts:string="m_"+nom_champ;
						var val=this.formOngletPrincipal.get(nom_champ_ts).value;
//console.log('AfficherOngletDetailPrincipal: nom_champ='+nom_champ+', val='+val);
						if(val===undefined)
						{
						}
						else
						{
//console.log('appel de AppelerHref');
							MenuComponent.AppelerHref(nom_ecran,val);
						}
					}
				}
			}
		}
	}
	async AfficherBloc(num_bloc: number,RemplacerNomColParHeader:boolean, PourExcel:boolean )
	{
//console.log('AfficherBloc('+num_bloc+')');
		if(num_bloc==1&& PourExcel==false)
		{
			if(this.m_id_maitre>0)
			{
				// onglet principal
				this.m_onglet_principal=true;
//				this.AfficherOngletDetailPrincipal();
				this.AfficherOngletFormulaire(num_bloc);
			}
		}
		else if(num_bloc>=0)
		{
			var MaitreOuDetail:string = num_bloc==0?"M":"D";
			var FormulaireOuGrille=this.m_blocs[num_bloc].m_type_bloc;
			this.m_onglet_principal=num_bloc==1;
			var string_json:string=this.m_blocs[num_bloc].PreparerAffichageBloc(RemplacerNomColParHeader,PourExcel);
//console.log('AfficherBloc: num_onglet='+num_onglet+', string_json='+string_json);
			if(num_bloc == 0)
			{
				this.m_json_maitre=JSON.parse(string_json);
//				this.m_grid_options_maitre.rowData=this.m_json_maitre;
				this.gridMaitreApi.setRowData(this.m_json_maitre);
//				this.gridMaitreApi.sizeColumnsToFit();
//				this.m_grid_options_maitre.rowData=this.m_json_maitre;
/*
console.log('classe de m_json_maitre='+this.m_json_maitre.constructor.name);
console.log('m_col_maitre.length='+this.m_col_maitre.length);
var i:number;
for(i=0;i<this.m_col_maitre.length;i++)
{
	console.log('col_maitre['+i+']=('+this.m_col_maitre[i].field);
}
*/
			}
			else if(string_json.length>0)
			{
//console.log('donnees pour conversion en JSON='+string_json);
//console.log('string_json='+string_json);
				var i:number;
				/*
				this.m_col_detail=new Array(this.m_onglets[this.m_num_onglet_actif].m_coldefs.length);
				for(i=0;i<this.m_col_detail.length;i++)
				{
					this.m_col_detail[i]=this.m_onglets[this.m_num_onglet_actif].m_coldefs[i];
//console.log('colonne '+i);
//console.log('classe de col_detail['+i+']='+this.m_col_detail[i].constructor.name);
//console.log('coldef['+i+']=('+this.m_col_detail[i].field+','+this.m_col_detail[i].headerName);
/ *
 if(this.m_col_detail[i].constructor.name=='ColumnCbo')
 {
	console.log('ConsoleCbo: nb_items=');
	console.log(this.m_col_detail[i].cellEditorParams);
 }
 * /
				}
				*/
				await this.delay(300);
//				this.m_grid_options_detail.columnDefs=this.m_col_detail;
//console.log('this.m_col_detail');
//console.log(this.m_col_detail);
//				this.gridDetailApi.setColumnDefs(this.m_col_detail);
				this.m_json_detail=JSON.parse(string_json);
				if(PourExcel==false && this.m_num_bloc_actif>=0)
				{
//console.log('EcranMaitreDetail.AfficherBloc: num_bloc_actif='+this.m_num_bloc_actif);
//console.log('blocs:');
//console.log(this.m_blocs);
					this.gridDetailApi.setColumnDefs(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
					this.gridDetailApi.setRowData(this.m_json_detail);
				}
//				this.gridDetailApi.sizeColumnsToFit();
//console.log('AfficherBloc: this.m_grid_options_detail.columnDefs.length='+this.m_grid_options_detail.columnDefs.length);
//console.log(this.m_col_detail);
			}
		}
//console.log('fin de Afficherbloc');
//		return promise;
		if(num_bloc>0)
		{
			var classe_bouton:string=this.m_blocs[num_bloc].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
			classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
			this.m_classe_boutons[num_bloc]=classe_bouton;
//console.log('EcranMaitreDetail.AfficherBloc à la fin: classe_bouton='+classe_bouton);
//console.log('EcranMaitreDetail.AfficherBloc à la fin: idx='+this.m_idx_detail);
			if(this.m_idx_detail>=0)
			{
				this.gridDetailApi.forEachNode
				((node: { rowIndex: number; setSelected: (arg0: boolean) => void; })=>
					{
//						console.log('node.rowIndex='+node.rowIndex);
						if(node.rowIndex == this.m_idx_detail)node.setSelected(true)
					}
				)
				this.gridDetailApi.ensureIndexVisible(this.m_idx_detail);
				this.m_idx_detail=-1;
			}
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
		if(this.m_id_maitre>0)
		{
			var num_lig=this.m_blocs[0].NumLig(this.m_id_maitre);
//console.log('DefNomFic: num_lig='+num_lig+', m_id_maitre='+this.m_id_maitre);
			var i: number;
			for(i=0;i<this.m_tab_col_nom_fic.length;i++)
			{
				if(i>0)
					nom_fic+="_";
				nom_fic+=""+this.m_blocs[0].ValCelluleParNom(num_lig,this.m_tab_col_nom_fic[i]);
			}
		}
		return nom_fic;
	}
	async onExcelDetails()
	{
		if(this.m_id_maitre > 0)
		{
//console.log('selectedRow='+selectedRow);
			var nb_blocs:number=this.m_blocs.length-1;
			var contenu_blocs: string[]=new Array(nb_blocs);
			var nom_blocs: string[]=new Array(nb_blocs);
			var i: number;
			var num_bloc:number=0;
			var en_cours: boolean=false;
			var pour_excel:boolean=true;
			this.m_num_bloc_actif=1;
			for(i=1;i<=nb_blocs;i++)
			{
//console.log('apres attente (i='+i+')');
				var bloc=this.m_blocs[i];
//console.log('onExcel1: i='+i+', nom_onglet='+onglet.m_lib_onglet);
				var remplacer_nom_col_par_header: boolean=true;
//console.log('appel de voirbloc apres attente boucle precedente');
				this.AfficherBloc(i, remplacer_nom_col_par_header,pour_excel);
				await this.delay(300);
//console.log('apres then: nom_onglet='+onglet.m_lib_onglet);
				nom_blocs[num_bloc]=bloc.m_lib_bloc;
				contenu_blocs[num_bloc]=this.m_json_detail;
//console.log('nom_onglet['+num_onglet+'] ='+nom_onglets[num_onglet]);
				num_bloc++;
			}
//console.log('onExcel: fin de la boucle');
			var nom_fic=this.DefNomFic();
			var excelService: ExcelService = new ExcelService();
			excelService.exportAsExcelFile(nom_blocs, contenu_blocs, nom_fic);
			var nom=this.m_blocs[1].m_nom_bloc;
//console.log('retour a '+nom);
			this.onBtnDetail(nom);
		}
		else
		{
//console.log('EcranMaireDetail: appel de messagebox: 3');
			this.MessageBox("Il faut d'abord sélectionner une ligne dans la grille de recherche");
		}
		this.ReinitialiserCompteur();
	}
	onExcelMaitre()
	{
		var nom_blocs: string[] = [this.m_nom_ecran];
		var string_json=this.m_blocs[0].DonnerStringJSon(true,true);
//console.log('onexcelmaitre: string_json='+string_json);
		var contenu_blocs: string[] = [JSON.parse(string_json)];
		var nom_fic=this.m_nom_ecran;
		var excelService: ExcelService = new ExcelService();
		excelService.exportAsExcelFile(nom_blocs, contenu_blocs, nom_fic);
		this.ReinitialiserCompteur();
	}
	async onCreer()
	{
//console.log('EcranMaitreDetail.onCreer');
		if(this.m_id_maitre>0)
		{
//console.log('onCreer: 1');
			var faire:boolean=true;
			var i:number;
			if(this.m_num_bloc_actif==1)
			{
				var modif:boolean=false;
				for(i=1;i<this.m_blocs.length;i++)
				{
					if(this.m_blocs[i].m_modif)
						modif=true;
				}
				if(modif)
				{
					this.m_retour_modal="";
//console.log('EcranMaireDetail: appel de messagebox: 4');
					this.MessageBox("L'objet courant est modifié")
					while(this.m_retour_modal=="")
					{
						await this.delay(500);
					}
					if(this.m_retour_modal=="Cancel")
						faire=false;
				}
				if(faire)
				{
					for(i=1;i<this.m_blocs.length;i++)
					{
						this.m_blocs[i].SupprimerToutesLesLignes();
					}
					this.m_blocs[1].m_modif=false;
				}
			}
			if(faire)
			{
//console.log('EcranMaitreDetail.onCreer: 2');
				var id_cle_primaire=this.m_blocs[this.m_num_bloc_actif].CreerUneLigne();
//console.log('EcranMaitreDetail.onCreer: id_cle_primaire='+id_cle_primaire);
//				id_cle_primaire=undefined;
//console.log('onCreer: id_cle_primaire='+id_cle_primaire+', num_bloc_actif='+this.m_num_bloc_actif);
				if(this.m_num_bloc_actif>1)
				{
//console.log('onCreer: 3: nom_cle_maitre='+this.m_nom_cle_maitre);
					var num_col_cle_maitre=this.m_blocs[this.m_num_bloc_actif].NumeroColonneSql(this.m_nom_cle_maitre);
//console.log('onCreer: 4: num_col_cle_maitre='+num_col_cle_maitre+', id_maitre='+this.m_id_maitre);
					var cel:Cellule=new Cellule(num_col_cle_maitre,this.m_id_maitre);
//console.log('onCreer: 5: cel='+cel+', id_cle_primaire='+id_cle_primaire);
//console.log(this.m_blocs[this.m_num_bloc_actif]);
					var num_lig=this.m_blocs[this.m_num_bloc_actif].NumLig(id_cle_primaire);
//console.log('onCreer: 6: num_lig='+num_lig+', id_cle_primaire='+id_cle_primaire);
//console.log('num_lig='+num_lig+', nb_cellules avant ajout='+this.m_onglets[this.m_num_onglet_actif].m_lignes[num_lig].m_cellules.length);
//console.log('nouvelle cellule=('+num_col_cle_maitre+','+this.m_id_maitre+')');
					this.m_blocs[this.m_num_bloc_actif].m_lignes[num_lig].m_cellules.push(cel);
//console.log('nouvelle ligne');
//console.log(this.m_blocs[this.m_num_bloc_actif].m_lignes[num_lig]);
				}
				else
				{
					this.ViderOngletPrincipal();
					this.m_id_maitre=-1;
				}
				var pour_excel:boolean=false;
				this.AfficherBloc(this.m_num_bloc_actif,false,pour_excel);
			}
			// }
		}
		else
		{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 6');
			this.MessageErreur("Il faut sélectionner l'objet courant");
		}
	}
	ViderOngletPrincipal()
	{
//console.log('EcranMaitreDetail.ViderOngletPrincipal');
		var i:number;
		var bloc:Bloc=this.m_blocs[1];
//console.log(bloc);
		for(i=0;i<bloc.m_colonnes_ecran.length;i++)
		{
//console.log('i='+i);
			if(bloc.m_colonnes_ecran[i].m_visible==true && bloc.m_colonnes_ecran[i].m_inser_ecran==true)
			{
				var nom_champ=bloc.m_colonnes_ecran[i].m_nom_col;
				var nom_champ_ts:string="m_"+nom_champ;
				var val:any;
				var faire:boolean=true;
				switch(bloc.m_colonnes_ecran[i].m_type_col)
				{
					case TypeColEcran.Chaine:
						val="";
						break;
					case TypeColEcran.CleEtrangere:
						val=undefined;
						break;
					case TypeColEcran.Entier:
					case TypeColEcran.Flottant:
						val=0;
						break;
					case TypeColEcran.Date:
					case TypeColEcran.DateHeure:
						val="";
						break;
					case TypeColEcran.Booleen:
						val=0;
						break;
					default:
						faire=false;
						break;
				}
				if(faire)
					this.formOngletPrincipal.get(nom_champ_ts).setValue(val);
//console.log('AfficherOngletDetailPrincipal: nom_champ='+nom_champ+', val='+val);
			}
		}
		this.m_blocs[1].m_modif=true;
		this.ToucherBlocActif();
	}
	async onSupprimer()
	{
		if(this.m_id_maitre>0)
		{
			var faire:boolean=true;
			var num_bloc:number=this.m_num_bloc_actif;
			if(this.m_num_bloc_actif==1)
			{
				var i:number;
				var modif:boolean=false;
				for(i=2;i<this.m_blocs.length;i++)
				{
					if(this.m_blocs[i].m_modif)
						modif=true;
				}
				if(modif)
				{
					this.m_retour_modal="";
//console.log('EcranMaireDetail: appel de messagebox: 5');
					this.MessageBox("L'objet courant est modifié")
					while(this.m_retour_modal=="")
					{
						await this.delay(500);
					}
					if(this.m_retour_modal=="Cancel")
						faire=false;
				}
				if(faire)
				{
					for(i=2;i<this.m_blocs.length;i++)
					{
						this.m_blocs[i].SupprimerToutesLesLignes();
					}
					this.m_blocs[1].SupprimerUneLigne(this.m_id_maitre);
//					this.m_blocs[1].m_modif=false;
//console.log('EcranMaitreDetail.onSupprimer: avant vidage onglet principal: m_num_bloc='+this.m_num_bloc_actif);
					this.ViderOngletPrincipal();
				}
			}
			else
			{
				// suppression d'une ligne d'un onglet detail
//console.log("nom_onglet_actif="+this.m_num_onglet_actif);
				const selectedRow = this.gridDetailApi.getSelectedRows()[0];
				var nom_champ=this.m_blocs[num_bloc].m_nom_cle_primaire;
				var id_detail=selectedRow[nom_champ];
//console.log("nom_champ="+nom_champ);
				this.m_blocs[num_bloc].SupprimerUneLigne(id_detail);
//console.log('OnSupprimer: id_a_supprimer='+id_detail);
			}
			var pour_excel:boolean=false;
			this.AfficherBloc(num_bloc,false,pour_excel);
		}
		else
		{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 7');
			this.MessageErreur("Il faut sélectionner l'objet courant");
		}
	}
	RequetePourRecupererIdOngletPrincipal():string
	{
		return "";
	}
	async onSauver()
	{
		console.log("AA EMD.Sauver");
		try
		{
			var en_cours: boolean=false;
			var num_bloc:number=1;
			this.TransfererOngletFormulaire(num_bloc);
			/*
			var bloc=this.m_blocs[num_bloc];
			this.m_blocs[num_bloc].Sauver()
			.then(res =>
			{
//console.log('apres then: num_onglet='+this.m_num_onglet_actif+', res='+res);
				var str_res:string=""+res;
				if(str_res.startsWith('Erreur'))
				{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 8');
					this.MessageErreur(str_res);
				}
				else
				{
					this.ToucherBloc(num_bloc);
				}
//console.log('onglet['+this.m_num_onglet_actif+']: modif repasse a false');
			},
			err =>
			{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 9');
					this.MessageErreur(err);					
			});
			*/
			for(num_bloc=this.m_blocs.length-1;num_bloc>0;num_bloc--)
			{
				var bloc=this.m_blocs[num_bloc];
				while(en_cours===true)
				{
//console.log('attente (i='+i+')');
					await this.delay(10);
				}
//console.log('sauver: onglet='+onglet.m_nom_onglet);
				en_cours=true;
				this.m_blocs[num_bloc].Sauver()
				.then(res =>
				{
//console.log('apres then: num_onglet='+this.m_num_onglet_actif+', res='+res);
					var str_res:string=""+res;
					if(str_res.startsWith('Erreur'))
					{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 8');
						this.MessageErreur(str_res);
					}
					else
					{
						this.ToucherBloc(num_bloc);
					}
					en_cours=false;
//console.log('onglet['+this.m_num_onglet_actif+']: modif repasse a false');
				},
				err =>
				{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 9');
						this.MessageErreur(err);					
				});
			}
			while(en_cours===true)
			{
//console.log('attente (i='+i+')');
				await this.delay(10);
			}
			if(this.m_num_bloc_actif==1)
			{
				var sql=this.RequetePourRecupererIdOngletPrincipal();
				if(sql.length>0)
				{
//console.log('EcranMaitreDetail.Sauver: sql pour recuperer id onglet principal='+sql);
					var ab=new AccesBdService(this.httpClient);
					ab.LireValeur(sql)
					.then
					(
						res =>
						{
//console.log('res='+res);
							var str_res:string=""+res;
							if(str_res.startsWith('Erreur'))
							{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 10');
								this.MessageErreur(str_res);
							}
							else if(str_res.length>0)
							{
								this.m_id_maitre= +str_res;
//console.log('id_maitre='+this.m_id_maitre);
							this.ChargerDetails(false,false);
							}
//console.log('contenu='+contenu);
						},
						err =>
						{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 11');
							this.MessageErreur(err);
						}
					);
				}
				else
				{
//					this.m_blocs[this.m_num_bloc_actif].m_modif=false;
					this.ToucherBlocActif();
				}
			}
			else
			{
				this.ChargerDetails(false,false);
//				this.ToucherBlocActif();
			}
			this.ReinitialiserCompteur();
		}
		catch(e)
		{
			var msg:string=(e as Error).message;
			var pile:string=""+(e as Error).stack;
			var msg_complet:string=msg+'§§§'+pile;
//console.log('EcranMaitreDetail.onSauver: erreur: msg_complet='+msg_complet);
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 12');
			this.MessageErreur(msg_complet);
		}
	}
	/*
	ModifValeurChamp(num_bloc:number,nom_col_modifiee:string,id_cle_primaire:number,val_col_new: any)
	{
//console.log('EcranMaitreDetail.ModifValeurChamp('+num_bloc+','+nom_col_modifiee+','+id_cle_primaire+','+val_col_new+')');
		if(id_cle_primaire<-GlobalConstantes.m_nb_max_lig_creees)
		{
			this.MessageErreur('Ligne non modifiable');
		}
		else
		{
			this.m_blocs[num_bloc].ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
			this.m_classe_boutons[num_bloc]="btn_onglet_actif_modif_"+GlobalConstantes.m_classe_fonte;
		}
	}
	*/
	onCellValueMaitreChanged(event:any)
	{
		this.onCellValueChanged(event,"M");
	}
	onCellValueDetailChanged(event:any)
	{
		this.onCellValueChanged(event,"D");
	}
	onCellValueChanged(event:any,maitre_ou_detail:string)
	{
		try
		{
//console.log('EcranMaitreDetail.onCellValueChanged');
			var val_col_new=""+event.newValue;
			var val_col_old=""+event.oldValue;
			if(event.newValue===undefined)
				val_col_new="";
//console.log('EcranMaitreDetail.onCellValueDetailChanged: nouvelle valeur='+val_col_new+', ancienne valeur='+val_col_old+', colonne='+event['column']['colId']);
//console.log(event);
			if(val_col_new!=val_col_old)
			{
//console.log('EcranMaitreDetail.onCellValueDetail: changement de valeur');
//		event.data.id_loge_tenue=0;
//console.log('nouvelle valeur='+val_col_new+', ancienne valeur='+val_col_old+', colonne='+event['column']['colId']);
				var num_bloc:number;
				if(maitre_ou_detail=="M")
					num_bloc=0;
				else
					num_bloc=this.m_num_bloc_actif;
//				var num_col_sql_modifiee:number;
				var nom_col_cle_primaire=this.m_blocs[num_bloc].m_colonnes_ecran[1].m_nom_col;
				var id_cle_primaire:number;
				var nom_col_modifiee:string;
				var num_lig_ecran_modifiee:number=-1;
				var faire:boolean=true;
//console.log('EcranMaitreDetail.onCellValueChanged: num_bloc'+num_bloc);
				if(num_bloc!=1)
				{
					nom_col_modifiee=event['column']['colId'];
					num_lig_ecran_modifiee=event.rowIndex;
//					num_col_sql_modifiee=this.m_blocs[num_bloc].NumeroColonneSql(nom_col_modifiee);
					var selectedRow:any;
					if(maitre_ou_detail=="M")
						selectedRow = this.gridMaitreApi.getSelectedRows()[0];
					else
						selectedRow = this.gridDetailApi.getSelectedRows()[0];
//console.log('selectedRow');
//console.log(selectedRow);
					id_cle_primaire=selectedRow[nom_col_cle_primaire];
//console.log('nom_col_cle_primaire='+nom_col_cle_primaire+', id_cle_primaire='+id_cle_primaire);
//console.log('EcranMaitreDetail.onCellValueDetail: id_cle_primaire='+id_cle_primaire);
					if(id_cle_primaire<-GlobalConstantes.m_nb_max_lig_creees)
					{
//console.log('EcranMaitreDetail.onCellValueDetail: event');
//console.log(event);
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 13');
						this.MessageErreur('Ligne non modifiable');
//						event.node.setDataValue(nom_col_modifiee,event.oldValue);
						if(maitre_ou_detail=="M")
							this.gridMaitreApi.undoCellEditing();
						else
							this.gridDetailApi.undoCellEditing();
//console.log('apres undo');
						faire=false;
					}
					else if(id_cle_primaire===undefined)
					{
//console.log('nouvelle ligne');
					}
				}
				else	// est utilise quand l'onglet principal est une ag-grid
				{
					num_lig_ecran_modifiee=event['node'].rowIndex;
					nom_col_modifiee=event['node'].data.donnee;
//					num_col_sql_modifiee=this.m_blocs[num_bloc].NumeroColonneSqlParLibCol(nom_col_modifiee);
					id_cle_primaire=this.m_id_maitre;
//console.log('nom_col_modifiee='+nom_col_modifiee+', num_col_sql_modifiee='+num_col_sql_modifiee);
				}
				if(faire)
				{
console.log('avant appel de ModifValeurChamp('+nom_col_modifiee+','+id_cle_primaire+','+val_col_new+')');
					this.ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
console.log('apres appel de ModifValeurChamp');
					this.ApresModifValeurChamp(num_lig_ecran_modifiee,this.m_blocs[num_bloc].m_nom_bloc,id_cle_primaire,nom_col_modifiee,val_col_new);
				}
			}
		}
		catch(e)
		{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 14');
			this.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
		}
	}
	onRowClickDetail(event:any)	//	appele apres un click sur une cellule d'une grille
	{
//console.log('onRowClickDetail: nouvel index='+event.rowIndex);
		const selectedRow = this.gridDetailApi.getSelectedRows()[0];
//console.log(selectedRow);
		var id_detail=selectedRow[this.m_blocs[this.m_num_bloc_actif].m_nom_cle_primaire];
//console.log('iddetail='+id_detail);
//console.log(event);
// modif pour éviter une erreur quand on clique dans un cbo avant d'avoir cliqué sur une ligne
		if(this.m_nom_col_cliquee=='')
			this.m_blocs[this.m_num_bloc_actif].PersonnaliserCelluleCbo(id_detail,this.m_blocs[this.m_num_bloc_actif].m_nom_cle_primaire);
		else if(this.m_nom_col_cliquee!=undefined)
			this.m_blocs[this.m_num_bloc_actif].PersonnaliserCelluleCbo(id_detail,this.m_nom_col_cliquee);
		// OLD AVANT MODIF this.m_blocs[this.m_num_bloc_actif].PersonnaliserCelluleCbo(id_detail,this.m_nom_col_cliquee);
//		this.m_col_detail=this.m_onglets[this.m_num_onglet_actif].m_coldefs;
		this.m_grid_options_detail.columnDefs=this.m_blocs[this.m_num_bloc_actif].m_coldefs;	// this.m_col_detail;
		this.gridDetailApi.setColumnDefs(this.m_blocs[this.m_num_bloc_actif].m_coldefs);
//console.log('m_col_detail');
//console.log(this.m_col_detail);
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
	AfficherOngletDetailPrincipal()
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
//console.log('RafraichirEcran');
		/*
		this.AfficherBloc(this.m_num_onglet_actif,false,false);
		this.gridDetailApi.setColumnDefs(this.m_onglets[this.m_num_onglet_actif].m_coldefs);
		*/
		var sql=this.m_blocs[this.m_num_bloc_actif].m_sql_select.replace("@id@",""+this.m_id_maitre);
		this.m_blocs[this.m_num_bloc_actif].ChargerBloc(sql,false, false)
		.then(res =>
		{
//console.log('apres then: nom_onglet='+onglet.m_lib_onglet);
			var str_res:string=""+res;
//console.log('str_res='+str_res);
			if(str_res.startsWith('Erreur'))
			{
//console.log('appel de MessageErreur depuis EcranMaitreDetail: 16');
				this.MessageErreur(str_res);
			}
			else
			{
				this.AfficherBloc(this.m_num_bloc_actif,false,false);
			}
		});
	}
	/*
	ToucherBlocActif()
	{
		var classe_bouton:string=this.m_blocs[this.m_num_bloc_actif].m_modif?"btn_onglet_actif_modif":"btn_onglet_actif";
		classe_bouton+="_"+GlobalConstantes.m_classe_fonte;
		this.m_classe_boutons[this.m_num_bloc_actif]=classe_bouton;
		this.m_classe_bouton_actif=classe_bouton;
	}
	*/
}
