import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
//import { Cbo } from '../common/cbo.model';
import { EcranGrille } from '../AZ_services/ecran_grille';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
import { ActivatedRoute } from '@angular/router';
import { Cbo } from '../AZ_common/cbo.model';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html'
})
@Injectable()
export class ReferencesComponent extends EcranGrille
{
	public m_nom_tab:string='';
	//m_cbo_type_lieu:Cbo;
	//m_cbo_initialisee:boolean=false;
	/*
	m_cbo_deg: Cbo;
	m_cbo_type_loge: Cbo;
	m_cbo_rite: Cbo;
	m_cbo_ville: Cbo;
	m_cbo_initialisee:boolean=false;
	*/
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder, public override modalService: ModalService,public activatedRoute:ActivatedRoute)
	{
		super(httpClient,formBuilder,modalService);
		this.m_blocs=new Array(4);
		var cols=new Array(9);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_cmpt","id_cmpt",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("nom_cmpt","Nom",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,300);
		cols[3]=new ColonneEcran("id_instr","Instrument",TypeColEcran.CleEtrangere,true,ModifCol.Modifiable,false,true,200);
		cols[4]=new ColonneEcran("id_instrWITH","Instrument",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,200);
		cols[5]=new ColonneEcran("grands","Grands",TypeColEcran.Booleen,true,ModifCol.Modifiable,true,true,80);
		cols[6]=new ColonneEcran("moyens","Moyens",TypeColEcran.Booleen,true,ModifCol.Modifiable,true,true,80);
		cols[7]=new ColonneEcran("petits","Petits",TypeColEcran.Booleen,true,ModifCol.Modifiable,true,true,80);
		cols[8]=new ColonneEcran("dep","Dépendances",TypeColEcran.Dependances,true,ModifCol.Modifiable,false,true,250);
		//cols[9]=new ColonneEcran("doc_db","Def BLOB",TypeColEcran.DefDocDb,true,ModifCol.Modifiable,false,true,250);
		//cols[10]=new ColonneEcran("doc_db","Voir BLOB",TypeColEcran.VoirDocDb,true,ModifCol.Modifiable,false,true,250);
		this.m_blocs[0]=new Bloc(this.httpClient,this,"cmpt","cmpt","Comptines","G",500,"exec AZcmptSelect","exec AZcmptMaj @etat@,@id_cmpt@,@nom_cmpt@,@id_instr@,@grands@,@moyens@,@petits@","id_cmpt",cols);
		cols=new Array(4);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,false,100);
		cols[1]=new ColonneEcran("id_instr","id_instr",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,80);
		cols[2]=new ColonneEcran("nom_instr","Nom",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,200);
		cols[3]=new ColonneEcran("dep","Dépendances",TypeColEcran.Dependances,true,ModifCol.Modifiable,false,true,250);
		this.m_blocs[1]=new Bloc(this.httpClient,this,"instr","instr","Instruments","G",500,"exec AZinstrSelect","exec AZinstrMaj @etat@,@id_instr@,@nom_instr@","id_instr",cols);
		cols=new Array(11);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_lieu","id_lieu",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,100);
		cols[2]=new ColonneEcran("nom_lieu","Nom",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,300);
		cols[3]=new ColonneEcran("ad_lieu","Adresse",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,200);
		cols[4]=new ColonneEcran("id_ville","Ville",TypeColEcran.CleEtrangere,true,ModifCol.Modifiable,false,true,200);
		cols[5]=new ColonneEcran("id_villeWITH","id_villeWITH",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,200);
		cols[6]=new ColonneEcran("lat_lieu","Latitude",TypeColEcran.Flottant,true,ModifCol.Obligatoire,false,true,120);
		cols[7]=new ColonneEcran("lon_lieu","Longitude",TypeColEcran.Flottant,true,ModifCol.Obligatoire,false,true,120);
		cols[8]=new ColonneEcran("id_type_lieu","Type de lieu",TypeColEcran.CleEtrangere,true,ModifCol.Obligatoire,false,true,120);
		cols[9]=new ColonneEcran("id_type_lieuWITH","id_type_lieuWITH",TypeColEcran.Chaine,false,ModifCol.NonModifiable,true,false,200);
		cols[10]=new ColonneEcran("dep","Dépendances",TypeColEcran.Dependances,true,ModifCol.Modifiable,false,true,250);
		this.m_blocs[2]=new Bloc(this.httpClient,this,"lieu","lieu","Lieux","G",500,"exec AZlieuSelect","exec AZlieuMaj @etat@,@id_lieu@,@nom_lieu@,@ad_lieu@,@id_ville@,@lat_lieu@,@lon_lieu@,@id_type_lieu@","id_lieu",cols);
		cols=new Array(4);
		cols[0]=new ColonneEcran("etat","etat",TypeColEcran.Chaine,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("id_ville","id_ville",TypeColEcran.ClePrimaire,true,ModifCol.NonModifiable,false,true,80);
		cols[2]=new ColonneEcran("nom_ville","Nom",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,200);
		cols[3]=new ColonneEcran("dep","Dépendances",TypeColEcran.Dependances,true,ModifCol.Modifiable,false,true,250);
		this.m_blocs[3]=new Bloc(this.httpClient,this,"ville","ville","Villes","G",500,"exec AZvilleSelect","exec AZvilleMaj @etat@,@id_ville@,@nom_ville@","id_ville",cols);
		this.m_classe_boutons=new Array(this.m_blocs.length);
//console.log('references: fin du constructeur');
	}
	ngOnInit(): void
	{
//console.log('EcranGrille: ngOnInit');
		
/* 		if(!this.m_cbo_initialisee)
		{
		
			this.m_cbo_deg=new Cbo(this.httpClient,'deg');
			this.m_cbo_deg.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
			this.m_cbo_type_loge=new Cbo(this.httpClient,'type_loge');
			this.m_cbo_type_loge.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
			this.m_cbo_rite=new Cbo(this.httpClient,'rite');
			this.m_cbo_rite.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
			this.m_cbo_ville=new Cbo(this.httpClient,'ville');
			this.m_cbo_ville.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
		

			this.m_cbo_type_lieu=new Cbo(this.httpClient,'type_lieu');
console.log('AAA='+this.m_cbo_type_lieu.m_nom_table);
			this.m_cbo_type_lieu.GenererListeStd().then(res=>{},err=>{this.MessageErreur(err);});
			
//console.log('BBB='+this.m_cbo_type_lieu.m_liste_items[0].m_id+" ; "+this.m_cbo_type_lieu.m_liste_items[0].m_lib);
			this.m_cbo_initialisee=true;
			
		} */
		
		this.activatedRoute.params.forEach(params =>
		{
            let userId = params["userId"];
			this.m_nom_tab=''+this.activatedRoute.snapshot.paramMap.get("nom_ecran");
//console.log('Appel de ChangementDeGrille('+this.m_nom_tab+')');
			this.ChangementDeGrille(this.m_nom_tab);
//console.log('references.ngOnInit: m_nom_tab='+this.m_nom_tab+', avant appel de InitColDefs');
			this.InitColDefs();
//console.log('apres InitColDefs');
			this.Init();
//console.log('apres Init');
        })
	}	
}
