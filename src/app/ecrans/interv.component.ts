import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { fromEvent } from 'rxjs/observable/fromEvent';
import { UntypedFormBuilder } from '@angular/forms';
import { Cbo } from '../AZ_common/cbo.model';
import { EcranMaitreDetail } from '../AZ_services/ecran_maitre_detail';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
/*
@Component({
  selector: 'app-prs',
//  templateUrl: './prs.component.html',
  styleUrls: ['./prs.component.scss']
})
*/
@Component({
  selector: 'app-interv',
  templateUrl: './interv.component.html'
})
@Injectable()
export class IntervComponent extends EcranMaitreDetail
{
	m_cbo_cmpt: any=null;	//Cbo;
	m_cbo_lieu: any=null;	//Cbo;
	m_cbo_seance: any=null;	//Cbo;
	m_id_interv:number=0;
	m_date_interv_mini:Date | undefined;
	m_date_interv_maxi:Date | undefined;
	m_comm_interv:string='';
	m_tarif_interv:number=0;
	m_fact_interv:number=0;
	m_num_interv:string='';
//	m_resizer;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
//console.log('debut de constructeur de Prscomponent');
		this.m_nom_ecran="Interventions";
		this.m_blocs=new Array(4);
//		this.m_classe_boutons=new Array(4);
		var cols=new Array(8);
		cols[0]=new ColonneEcran("id_interv","id_interv",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("date_interv","Date",TypeColEcran.Date,true,ModifCol.NonModifiable,true,true,110);
		cols[2]=new ColonneEcran("nom_lieu","Lieu",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,180);
		cols[3]=new ColonneEcran("num_interv","N°",TypeColEcran.Chaine,true,ModifCol.NonModifiable,false,true,60);
		cols[4]=new ColonneEcran("nom_seance","Séance",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,180);
		cols[5]=new ColonneEcran("comm_interv","Commentaire",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,450);
//		cols[6]=new ColonneEcran("fact_interv","Facture",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		cols[6]=new ColonneEcran("fact_interv","Facture",TypeColEcran.Booleen,true,ModifCol.NonModifiable,true,true,80);
		cols[7]=new ColonneEcran("tarif_interv","Tarif",TypeColEcran.Flottant,true,ModifCol.NonModifiable,true,true,100);
		this.m_blocs[0]=new Bloc(httpClient,this,"interv__recherche","maitre","Maitre","G","exec AZinterv__recherche","", "id_interv",cols);
		cols=new Array(11);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_interv","id_interv",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("date_interv","Date",TypeColEcran.Date,true,ModifCol.Modifiable,true,true,100);
		cols[3]=new ColonneEcran("id_lieu","Lieu",TypeColEcran.Chaine,true,ModifCol.Obligatoire,false,true,100);
		cols[4]=new ColonneEcran("id_lieuWITH","Lieu",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,100);
		cols[5]=new ColonneEcran("num_interv","Numéro",TypeColEcran.Entier,true,ModifCol.NonModifiable,true,true,100);
		cols[6]=new ColonneEcran("id_seance","id_seance",TypeColEcran.Chaine,true,ModifCol.Obligatoire,false,true,100);
		cols[7]=new ColonneEcran("id_seanceWITH","Loge",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,100);
		cols[8]=new ColonneEcran("comm_interv","Commentaire",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,100);
		cols[9]=new ColonneEcran("fact_interv","Facturé",TypeColEcran.Booleen,true,ModifCol.Modifiable,true,true,100);
		cols[10]=new ColonneEcran("tarif_interv","Tarif",TypeColEcran.Entier,true,ModifCol.Obligatoire,true,true,100);
		this.m_blocs[1]=new Bloc(httpClient,this,"interv","interv","Intervention","F","exec AZinterv__intervSelect @id@","exec AZinterv__intervMaj @etat@,@id_interv@,@date_interv@,@id_seance@,@id_lieu@,@comm_interv@,@tarif_interv@,@fact_interv@,@num_interv@", "id_interv",cols);
		cols=new Array(8);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_seance_cmpt","id_seance_cmpt",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("id_seance","id_seance",TypeColEcran.Entier,false,ModifCol.NonModifiable,false,true,100);
		cols[3]=new ColonneEcran("id_intervWITH","Intervention Date/Lieu",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,true,100);
		cols[4]=new ColonneEcran("nom_cmpt","Comptines de la séance",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,300);
		cols[5]=new ColonneEcran("grands","Grands",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		cols[6]=new ColonneEcran("moyens","Moyens",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		cols[7]=new ColonneEcran("petits","Petits",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		//cols[5]=new ColonneEcran("num_cmpt","Numéro",TypeColEcran.Entier,true,ModifCol.Obligatoire,true,true,100);
		this.m_blocs[2]=new Bloc(httpClient,this,"seance_cmpt","seance_cmpt","Contenu Séance","G","exec AZinterv__seance_cmptSelect @id@","","id_seance_cmpt",cols);
		cols=new Array(9);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_interv_cmpt","id_interv_cmpt",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("id_interv","id_interv",TypeColEcran.Entier,false,ModifCol.NonModifiable,false,true,100);
		cols[3]=new ColonneEcran("id_intervWITH","Intervention Date/Lieu",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,true,100);
		cols[4]=new ColonneEcran("id_cmpt","Comptines hors séance",TypeColEcran.CleEtrangere,true,ModifCol.Modifiable,false,true,300);
		cols[5]=new ColonneEcran("id_cmptWITH","Comptines hors séance",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,300);
		cols[6]=new ColonneEcran("grands","Grands",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		cols[7]=new ColonneEcran("moyens","Moyens",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		cols[8]=new ColonneEcran("petits","Petits",TypeColEcran.BooleenNonModif,true,ModifCol.NonModifiable,true,true,80);
		//cols[5]=new ColonneEcran("num_cmpt","Numéro",TypeColEcran.Entier,true,ModifCol.Obligatoire,true,true,100);
		this.m_blocs[3]=new Bloc(httpClient,this,"interv_cmpt","interv_cmpt","Extra Comptines","G","exec AZinterv__interv_cmptSelect @id@","exec AZinterv__interv_cmptMaj @etat@,@id_interv_cmpt@,@id_interv@,@id_cmpt@","id_interv_cmpt",cols);
		this.formRecherche=this.formBuilder.group({m_filtre_date_interv_mini: '', m_filtre_date_interv_maxi: '', m_filtre_num_interv: '',m_filtre_seance:0,m_filtre_lieu:0});
		this.formOngletPrincipal=this.formBuilder.group({m_id_interv:0,m_date_interv:'',m_id_seance:0,m_id_lieu:0,m_comm_interv:'',m_tarif_interv:0,m_fact_interv:0,m_num_interv:''});
		this.m_nom_cle_maitre="id_interv";
		this.m_tab_col_nom_fic=["date_interv"];
		this.m_classe_boutons=new Array(this.m_blocs.length);
//console.log('fin de constructeur de Prscomponent');
		/* let self=this;
		this.m_grid_options_detail.getRowStyle=function(params)
		{
			var num_bloc_actif=self.m_num_bloc_actif;
//console.log('num_bloc_actif='+num_bloc_actif);
			if(num_bloc_actif==2)
			{
				var test:number=+params.data.id_interv_cmpt;
				if (test < -1111)
				{
//			params.highlighted=true;
//			params.selectable=false;
//console.log('fond rouge');
					return { 'background-color': '#BBB' };
//			return { 'color': '#BBB' };
//			return 'non-modifiable';
				}
			}
		} */
	}
	ngOnInit(): void
	{
console.log('debut de NgInit de Intervcomponent');
		this.m_cbo_seance=new Cbo(this.httpClient,'seance');
		this.m_cbo_seance.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
		this.m_cbo_lieu=new Cbo(this.httpClient,'lieu');
		this.m_cbo_lieu.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
		this.m_cbo_cmpt=new Cbo(this.httpClient,'cmpt');
		this.m_cbo_cmpt.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
		this.InitColDefs();
		this.Init();
		this.m_grid_options_maitre.columnDefs=this.m_blocs[0].m_coldefs;
//		this.InitSplitter('splitter_prs');
		/*
		this.rowClassRules =
		{
			'rag-green-outer': function(params) { return params.data.id_interv_cmpt < 0; },
			'rag-amber-outer': function(params) { return params.data.id_interv_cmpt > 0; }
		}
		*/

// debut
/*
		this.m_splitter = document.getElementById('dragMe');
console.log('resizer');
console.log(this.m_splitter);
		if(this.m_splitter!=null)
		{
/ *
			this.m_au_dessus = this.m_splitter.previousElementSibling;
console.log('leftSide');
console.log(this.m_au_dessus);
			this.m_au_dessous = this.m_splitter.nextElementSibling;
console.log('rightSide');
console.log(this.m_au_dessous);
		const mouseDownHandler = function (e)
		{
			// Get the current mouse position
//			x = e.clientX;
			y = e.clientY;
//			leftWidth = leftSide.getBoundingClientRect().width;

			// Attach the listeners to `document`
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};
		const mouseMoveHandler = function (e)
		{
			// How far the mouse has been moved
//			const dx = e.clientX - x;
			const dy = e.clientY - y;
//			const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
//			leftSide.style.width = `${newLeftWidth}%`;
			this.m_hauteur_grille_maitre+=dy;
			if(this.m_hauteur_grille_maitre<10)this.m_hauteur_grille_maitre=10;
//			resizer.style.cursor = 'row-resize';
		};
* /
/ *
			this.m_splitter.addEventListener('mousedown', this.mouseDownHandler);
			this.m_splitter.addEventListener('mousemove', this.mouseMoveHandler);
//			this.m_splitter.addEventListener('mouseup', this.mouseUpHandler);
			document.addEventListener('mouseup', this.mouseUpHandler);
* /
			this.m_mouse_up$ = fromEvent(this.m_splitter, 'mouseup');
			this.m_mouse_up$.subscribe(_ =>
			{
				console.log('up');
				this.m_splitter_actif=false;
				this.register();
			})
			this.m_mouse_down$ = fromEvent(this.m_splitter, 'mousedown');
			this.m_mouse_down$.subscribe(_ =>
			{
				console.log('down');
				this.m_splitter_actif=true;
			});
			this.m_mouse_leave$ = fromEvent(this.m_splitter, 'mouseleave');
			this.m_mouse_leave$.subscribe(_ =>
			{
				console.log('leave');
				this.m_splitter_actif=false;
			});
			this.register();
		}
// fin
*/
//console.log('fin de NgInit de Intervcomponent');
	}
	override RequeteRecherche():string
	{
		var date_interv_mini=this.formRecherche.get('m_filtre_date_interv_mini').value;
		if(date_interv_mini.length==0)
			date_interv_mini="null";
		else
			date_interv_mini='"'+date_interv_mini+'"';
		var date_interv_maxi=this.formRecherche.get('m_filtre_date_interv_maxi').value;
		if(date_interv_maxi.length==0)
			date_interv_maxi="null";
		else
			date_interv_maxi='"'+date_interv_maxi+'"';
		var id_seance: any;
		id_seance=this.formRecherche.get('m_filtre_seance').value;
//	console.log('type de id_seance='+id_seance.constructor.name);
		if(id_seance.constructor.name != 'String' ||id_seance=="0")
			id_seance="null";
		var id_lieu: any;
		id_lieu=this.formRecherche.get('m_filtre_lieu').value;
//	console.log('type de id_loge='+id_loge.constructor.name);
		if(id_lieu.constructor.name != 'String' ||id_lieu=="0")
			id_lieu="null";
//	console.log('nom_prs='+nom_prs+',loge='+id_loge+',deg_bl='+id_deg_bl+', actif='+actif);
		var req_sql_maitre="exec AZinterv__recherche @id_prs_login@,@date_interv_mini@,@date_interv_maxi@,@id_seance@,@id_lieu@";
		var req_sql=req_sql_maitre.replace("@date_interv_mini@",date_interv_mini).replace("@date_interv_maxi@",date_interv_maxi).replace("@id_seance@",id_seance).replace('@id_lieu@',''+id_lieu);
//console.log('Interv.RequeteRecherche:'+req_sql);
		return req_sql;
	}
	override onViderCriteres()
	{
		this.formRecherche.get('m_filtre_date_interv_mini').setValue("");
		this.formRecherche.get('m_filtre_date_interv_maxi').setValue("");
		this.formRecherche.get('m_filtre_seance').setValue(0);
		this.formRecherche.get('m_filtre_lieu').setValue(0);
		this.ReinitialiserCompteur();
	}
	override RequetePourRecupererIdOngletPrincipal()
	{
		var date_interv=this.formOngletPrincipal.get('m_date_interv').value;
		var id_lieu=this.formOngletPrincipal.get('m_id_lieu').value;
		var sql:string='';
		if(date_interv.length>0 && id_lieu>0)
			sql="select id_interv from interv where date_interv="+this.PreparerDatePourSql(date_interv)+" and id_lieu="+id_lieu;
console.log('interv.RequetePourRecupererIdOngletPrincipal: sql='+sql);
		return sql;
	}

	override RequeteCombobox(nom_onglet:string,num_lig:number,nom_col:string):string
	{
		var req:string="";
		switch(nom_onglet)
		{
			case "seance":
				switch(nom_col)
				{
					case "id_seance":
						var id_seance:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_seance");
						req = "exec AZinit_cbo_bis 'seance',"+id_seance;
console.log('RequeteCombobox: req='+req);
						break;
					case "id_loge_tenue_deb":
						var id_loge:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge");
						req = "exec AZinit_cbo_bis 'loge_tenue_deb',"+id_loge;
						break;
					case "id_loge_tenue_fin":
						var id_loge_tenue_deb:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge_tenue_deb");
						req = "exec AZinit_cbo_bis 'loge_tenue_fin',"+id_loge_tenue_deb;
						break;
				}
				break;
			case "travaux":
			case "degrés":
				switch(nom_col)
				{
					case "id_loge_tenue":
						var id_loge:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge");
						req = "exec AZinit_cbo_bis 'loge_tenue_deb',"+id_loge;
						break;
				}
				break;
		}
		return req;
	}
	/*
	RequeteCombobox(nom_onglet:string,num_lig:number,nom_col:string):string
	{
		var req:string="";
		switch(nom_onglet)
		{
			case "offices":
				switch(nom_col)
				{
					case "id_type_off":
						var id_loge:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge");
						req = "exec AZinit_cbo_bis 'type_off',"+id_loge;
//console.log('RequeteCombobox: req='+req);
						break;
					case "id_loge_tenue_deb":
						var id_loge:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge");
						req = "exec AZinit_cbo_bis 'loge_tenue_deb',"+id_loge;
						break;
					case "id_loge_tenue_fin":
						var id_loge_tenue_deb:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge_tenue_deb");
						req = "exec AZinit_cbo_bis 'loge_tenue_fin',"+id_loge_tenue_deb;
						break;
				}
				break;
			case "travaux":
			case "degrés":
				switch(nom_col)
				{
					case "id_loge_tenue":
						var id_loge:number=this.m_blocs[this.m_num_bloc_actif].ValCelluleParNom(num_lig,"id_loge");
						req = "exec AZinit_cbo_bis 'loge_tenue_deb',"+id_loge;
						break;
				}
				break;
		}
		return req;
	}
	ApresModifValeurChamp(num_lig_ecran_modifiee:number,nom_onglet:string,id_cle_primaire:number,nom_col:string,val_col_new:any)
	{
		switch(nom_onglet)
		{
			case "travaux":
			case "degrés":
				switch(nom_col)
				{
					case "id_loge":
//console.log("ApresModifValeurChamp("+nom_onglet+","+id_cle_primaire+","+nom_col+","+val_col_new+")");
						this.ForcerValeurChamp(num_lig_ecran_modifiee,nom_onglet,id_cle_primaire,"id_loge_tenue",0);
						break;
				}
				break;
		}
	}
	*/
}
