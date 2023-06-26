import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { Cbo } from '../AZ_common/cbo.model';
import { EcranMaitreDetail } from '../AZ_services/ecran_maitre_detail';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';

@Component({
  selector: 'app-seance',
  templateUrl: './seance.component.html'
})
@Injectable()
export class SeanceComponent extends EcranMaitreDetail
{
	m_cbo_cmpt: any=null;	//Cbo;
	m_cbo_seance: any=null;	//Cbo;
	m_nom_seance:string='';
	m_id_cmpt:number=0;
	m_id_seance:number=0;
	m_num_seance:number=0;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
		this.m_nom_ecran="Séances";
		this.m_blocs=new Array(3);
		var cols=new Array(3);
		cols[0]=new ColonneEcran("id_seance","id_seance",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("num_seance","Numéro",TypeColEcran.Entier,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("nom_seance","Nom",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,350);
		this.m_blocs[0]=new Bloc(httpClient,this,"seance_recherche","maitre","maitre","G","exec AZseance__recherche","","id_seance",cols);
		cols=new Array(4);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_seance","id_seance",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("nom_seance","Nom",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,100);
		cols[3]=new ColonneEcran("num_seance","Numéro",TypeColEcran.Entier,true,ModifCol.Modifiable,true,true,100);
		this.m_blocs[1]=new Bloc(httpClient,this,"seance","seance","Séance","F","exec AZseance__seanceSelect @id@","exec AZseance__seanceMaj @etat@,@id_seance@,@nom_seance@,@num_seance@","id_seance",cols);
		cols=new Array(7);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_seance_cmpt","id_seance_cmpt",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("id_seance","id_seance",TypeColEcran.Entier,false,ModifCol.NonModifiable,false,true,100);
		cols[3]=new ColonneEcran("numero","#",TypeColEcran.Entier,true,ModifCol.Modifiable,true,true,50);
		cols[4]=new ColonneEcran("id_cmpt","Comptine",TypeColEcran.CleEtrangere,true,ModifCol.Obligatoire,false,true,400);
		cols[5]=new ColonneEcran("seq","*",TypeColEcran.Entier,true,ModifCol.Modifiable,false,true,50);
		cols[6]=new ColonneEcran("intermede","Intermède",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,800);
		//cols[5]=new ColonneEcran("grands","Grands",TypeColEcran.Booleen,true,ModifCol.NonModifiable,true,true,80);
		//cols[6]=new ColonneEcran("moyens","Moyens",TypeColEcran.Booleen,true,ModifCol.NonModifiable,true,true,80);
		//cols[7]=new ColonneEcran("petits","Petits",TypeColEcran.Booleen,true,ModifCol.NonModifiable,true,true,80);
		// j'ai commenté la ligne ColonneEcran("num_cmpt", et retiré le paramètre ,@num_cmpt@ de la ligne suivante dans l'exec AZseance__seance_cmptMaj ; num_cmpt ne correspond à aucun champ d'aucune table de la bd, à voir plus tard si besoin
		// idem pour interv.component.ts
		this.m_blocs[2]=new Bloc(httpClient,this,"seance_cmpt","comptines","Déroulé","G","exec AZseance__seance_cmptSelect @id@","exec AZseance__seance_cmptMaj @etat@,@id_seance_cmpt@,@id_seance@,@id_cmpt@,@numero@,@seq@,@intermede@","id_seance_cmpt",cols);
		this.formRecherche=this.formBuilder.group({ m_filtre_nom_seance: '', m_filtre_seance: 0});
		this.formOngletPrincipal=this.formBuilder.group({m_id_seance: '',m_nom_seance: '',m_num_seance:''});
		this.m_nom_cle_maitre="id_seance";
		this.m_tab_col_nom_fic=["Nom"];
		this.m_classe_boutons=new Array(this.m_blocs.length);
	}
	ngOnInit(): void
	{
		this.m_cbo_cmpt=new Cbo(this.httpClient,'cmpt');
		this.m_cbo_cmpt.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
		/* this.m_cbo_seance=new Cbo(this.httpClient,'seance');
		this.m_cbo_seance.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);}); */
		this.m_cbo_seance=new Cbo(this.httpClient,'cmpt');
		this.m_cbo_seance.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
		this.InitColDefs();
		this.Init();
		this.m_grid_options_maitre.columnDefs=this.m_blocs[0].m_coldefs;
//		this.InitSplitter('splitter_loge');
	}
	override RequeteRecherche():string
	{
		var id_cmpt=this.formRecherche.get('m_filtre_seance').value;
		console.log("filtre="+this.formRecherche.get('m_filtre_seance').value);
		if(id_cmpt.length==0||id_cmpt==0)
			id_cmpt="null";
		else
			id_cmpt='"'+id_cmpt+'"';
		var req_sql_maitre="exec AZseance__recherche @id_prs_login@,@filtre_seance@";
		var req_sql=req_sql_maitre.replace("@filtre_seance@",id_cmpt);
		return req_sql;

/* 		var nom_seance=this.formRecherche.get('m_filtre_seance').value;
		console.log("filtre="+this.formRecherche.get('m_filtre_seance').value);
		if(nom_seance.length==0||nom_seance==0)
			nom_seance="null";
		else
			nom_seance='"'+nom_seance+'"';
		var req_sql_maitre="exec AZseance__recherche @id_prs_login@,@nom_seance@";
		var req_sql=req_sql_maitre.replace("@nom_seance@",nom_seance);
		return req_sql; */
	}
	override onViderCriteres()
	{
		this.formRecherche.get('m_filtre_nom_seance').setValue("");
		this.ReinitialiserCompteur();
	}
	override RequetePourRecupererIdOngletPrincipal()
	{
		var num_seance=this.formOngletPrincipal.get('m_num_seance').value;
		var sql:string='';
		if(num_seance>0)
			sql="select id_seance from seance where num_seance="+num_seance;
console.log('seance.RequetePourRecupererIdOngletPrincipal: sql='+sql);
		return sql;
	}
}
