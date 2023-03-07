import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { Cbo } from '../AZ_common/cbo.model';
import { EcranMaitreDetail } from '../AZ_services/ecran_maitre_detail';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
import { AccesBdService } from '../AZ_services/acces_bd';

@Component({
  selector: 'app-dbdict',
  templateUrl: './dbdict.component.html'
})
@Injectable()
export class DBDictComponent extends EcranMaitreDetail
{
	m_cbo_dbdictm1: Cbo;
	m_cbo_dbdicttype: Cbo;
	m_nom_table:string;
	m_num_dbdict:number;
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
		this.m_nom_ecran="DBDict";
		this.m_blocs=new Array(3);
		var cols=new Array(3);
		cols[0]=new ColonneEcran("id_dbdict","id_dbdict",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("nom_dbdict","Nom table",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,300);
		cols[2]=new ColonneEcran("selfdesc","Self Desc",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,350);
		this.m_blocs[0]=new Bloc(httpClient,this,"dbdict_recherche","maitre","maitre","G",300,"exec AZdbdict__recherche","","id_dbdict",cols);
		cols=new Array(4);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_dbdict","id_dbdict",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("nom_dbdict","Nom table",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,100);
		cols[3]=new ColonneEcran("selfdesc","Self Desc",TypeColEcran.Entier,true,ModifCol.Modifiable,true,true,100);
		this.m_blocs[1]=new Bloc(httpClient,this,"dbdictm1","dbdictm1","DBDictM1","F",300,"exec AZdbdict__dbdictSelect @id@","exec AZdbdict__dbdictMaj @etat@,@id_dbdict@,@nom_dbdict@,@selfdesc@","id_dbdict",cols);
		cols=new Array(10);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_dbdicta1","ID DBDict A1",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,200);
		cols[2]=new ColonneEcran("id_dbdict","ID DBdict",TypeColEcran.Entier,true,ModifCol.NonModifiable,false,true,200);
		cols[3]=new ColonneEcran("champ","Champ",TypeColEcran.Chaine,true,ModifCol.Obligatoire,false,true,150);
		cols[4]=new ColonneEcran("id_dbdicttype","Type",TypeColEcran.CleEtrangere,true,ModifCol.Obligatoire,false,true,150);
		cols[5]=new ColonneEcran("id_dbdicttypeWITH","Type",TypeColEcran.Chaine,false,ModifCol.Obligatoire,true,false,150);
		cols[6]=new ColonneEcran("longueur","Longueur",TypeColEcran.Entier,true,ModifCol.Obligatoire,true,true,150);
		cols[7]=new ColonneEcran("niveau","Niveau",TypeColEcran.Entier,true,ModifCol.Obligatoire,false,true,100);
		cols[8]=new ColonneEcran("idx","Index",TypeColEcran.Entier,true,ModifCol.Obligatoire,true,true,100);
		cols[9]=new ColonneEcran("contrainte","Contrainte",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,300);
		this.m_blocs[2]=new Bloc(httpClient,this,"dbdicta1","dbdicta1","DBDictA1","G",300,"exec AZdbdict__dbdicta1Select @id@","exec AZdbdict__dbdicta1Maj @etat@,@id_dbdicta1@,@id_dbdict@,@champ@,@id_dbdicttype@,@longueur@,@niveau@,@idx@,@contrainte@","id_dbdicta1",cols);
		cols=new Array(7);		
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_dbdicta2","ID DBDict A2",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,200);
		cols[2]=new ColonneEcran("id_dbdict","ID DBdict",TypeColEcran.Entier,true,ModifCol.NonModifiable,false,true,200);
		cols[3]=new ColonneEcran("champ_source","Champ source",TypeColEcran.Chaine,true,ModifCol.Obligatoire,false,true,150);
		cols[4]=new ColonneEcran("table_cible","Table cible",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,150);
		cols[5]=new ColonneEcran("champ_cible","Champ cible",TypeColEcran.Chaine,true,ModifCol.Obligatoire,false,true,150);
		cols[6]=new ColonneEcran("requete","Requête",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,350);
		this.m_blocs[3]=new Bloc(httpClient,this,"dbdicta2","dbdicta2","DBDictA2","G",300,"exec AZdbdict__dbdicta2Select @id@","exec AZdbdict__dbdicta2Maj @etat@,@id_dbdicta2@,@id_dbdict@,@champ_source@,@table_cible@,@champ_cible@,@requete@","id_dbdicta2",cols);
		this.formRecherche=this.formBuilder.group({ m_filtre_nom_table: '', m_filtre_table: 0});
		this.formOngletPrincipal=this.formBuilder.group({m_nom_dbdict: '',m_selfdesc:''});
		this.m_nom_cle_maitre="id_dbdict";
		this.m_tab_col_nom_fic=["Nom table"];
		this.m_classe_boutons=new Array(this.m_blocs.length);
	}
	ngOnInit(): void
	{
		this.m_cbo_dbdictm1=new Cbo(this.httpClient,'dbdict');
		this.m_cbo_dbdictm1.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
		this.m_cbo_dbdicttype=new Cbo(this.httpClient,'dbdicttype');
		this.m_cbo_dbdicttype.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
		this.InitColDefs();
		this.Init();
		this.m_grid_options_maitre.columnDefs=this.m_blocs[0].m_coldefs;
//		this.InitSplitter('splitter_loge');
	}
	override RequeteRecherche():string
	{
		var nom_table=this.formRecherche.get('m_filtre_table').value;
		if(nom_table.length==0||nom_table==0)
			nom_table="null";
		else
			nom_table='"'+nom_table+'"';
		var req_sql_maitre="exec AZdbdict__recherche @id_prs_login@,@nom_table@";
		var req_sql=req_sql_maitre.replace("@nom_table@",nom_table);
		return req_sql;
	}
	override onViderCriteres()
	{
		this.formRecherche.get('m_filtre_nom_table').setValue("");
		this.ReinitialiserCompteur();
	}
	override RequetePourRecupererIdOngletPrincipal()
	{
		var num_dbdict=this.formOngletPrincipal.get('m_id_dbdict').value;
		var sql:string='';
		if(num_dbdict>0)
			sql="select id_dbdict from dbdictm1 where id_dbdict="+num_dbdict;
console.log('dbdict.RequetePourRecupererIdOngletPrincipal: sql='+sql);
		return sql;
	}
	
	
	onGenererSql() {
		console.log("debut GenererSQL");		
//console.log('faire='+faire);		
			const selectedRow = this.gridMaitreApi.getSelectedRows()[0];
			this.m_id_maitre=selectedRow[this.m_nom_cle_maitre];
			console.log("ligne sélectionnée: this.m_id_maitre= "+this.m_id_maitre);
			//this.ChargerDetails(false,false);

			var nb_blocs:number=this.m_blocs.length-1;
			var num_bloc:number=1;
			var i: number;
			var record: any;

/* 			var ab=new AccesBdService(this.httpClient);
			record=ab.m_lignes[1].RecupererVal(0);
console.log("RECORD="+record); */

			for(i=1;i<=nb_blocs;i++) {
				var bloc=this.m_blocs[i];
				var sql=bloc.m_sql_select.replace("@id@",""+this.m_id_maitre);
				
				this.m_blocs[num_bloc].ChargerBlocPourGenererSQL(sql,false,false)
			}
			
			this.ReinitialiserCompteur();
	}
}
