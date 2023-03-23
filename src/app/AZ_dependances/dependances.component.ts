import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
//import { Cbo } from '../common/cbo.model';
import { EcranGrille } from '../AZ_services/ecran_grille';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
import { ActivatedRoute } from '@angular/router';
//import { Cbo } from '../common/cbo.model';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-dependances',
  templateUrl: './dependances.component.html'
})
@Injectable()
export class DependancesComponent extends EcranGrille
{
/*
	public m_serveur_bd:string;
*/
//	public m_nom_tab:string='';
	public m_str_id:string='';
	private sub: any=null;
	public m_nom_tab:string='';
	constructor(public override httpClient: HttpClient, public override formBuilder:FormBuilder, public override modalService: ModalService,public override activatedRoute:ActivatedRoute)
	{
		super(httpClient,formBuilder,modalService,activatedRoute);
//console.log('DependancesComponent.constructor');
		this.m_blocs=new Array(1);
		var cols=new Array(5);
		cols[0]=new ColonneEcran("niv","Niveau",TypeColEcran.Entier,true,ModifCol.NonModifiable,true,true,50);
		cols[1]=new ColonneEcran("nom_tab","Type",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,300);
		cols[2]=new ColonneEcran("id","Nom",TypeColEcran.Entier,false,ModifCol.NonModifiable,false,true,100);
		cols[3]=new ColonneEcran("rep","Libellé",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,500);
		cols[4]=new ColonneEcran("info","Autre",TypeColEcran.Chaine,true,ModifCol.Modifiable,true,true,250);
		this.m_blocs[0]=new Bloc(this.httpClient,this,"dep","dep","Dépendances","G","exec lec_dependances '@sens@','@nom_tab@',@id@,@nb_lignes_max@,@profondeur_max@","","id",cols);
		this.formRecherche=this.formBuilder.group({m_filtre_nb_lignes_max: 2000, m_filtre_profondeur_max: 2});
		this.m_classe_boutons=new Array(this.m_blocs.length);
		/*
		this.m_serveur_bd=this.activatedRoute.snapshot.queryParamMap.get('serveur_bd');
		this.m_nom_tab=this.activatedRoute.snapshot.queryParamMap.get('nom_tab');
		this.m_str_id=this.activatedRoute.snapshot.queryParamMap.get('id');
//		this.activatedRoute.paramMap.subscribe((params: any) => { this.m_nom_tab = params.get('nom_tab'); this.m_id=params.get('id');})
//		this.activatedRoute.paramMap.subscribe((params: any) => { this.m_serveur_bd=params.get('serveur_bd'); this.m_nom_tab = params.get('nom_tab'); this.m_id=params.get('id');})
console.log('dependances: fin du constructeur: serveur_bd='+this.m_serveur_bd);
		GlobalConstantes.m_serveur_bd=this.m_serveur_bd.replace( /!/g , '/');
		*/
//console.log('dependances: fin du constructeur');
	}
	override ngOnInit(): void
	{
//console.log('dependances.ngOnInit: base url='+location.origin);
//console.log('activatedRoute');
//console.log(this.activatedRoute);
/*
		var nom_tab:string;
		var str_id:string;
*/
/*
		var nom_tab=this.activatedRoute.snapshot.paramMap.get("nom_tab");
		var str_id=this.activatedRoute.snapshot.paramMap.get("id");
console.log('dependances.ngOnInit: m_nom_tab='+this.m_nom_tab+', id='+str_id+' avant appel de InitColDefs');
		this.InitColDefs();
		this.m_blocs[0].m_sql_select=this.m_blocs[0].m_sql_select.replace('@nom_table@',nom_tab).replace('@id@',str_id);
console.log('apres InitColDefs');
		this.Init();
console.log('apres Init');
*/
//		this.sub = this.activatedRoute.params.subscribe(params => { this.m_nom_tab = params['nom_tab'];   });
		
		/*
		this.activatedRoute.params.forEach(params =>
		{
			var nom_tab=this.m_nom_tab;	//	this.activatedRoute.snapshot.paramMap.get("nom_tab");
			var str_id=this.activatedRoute.snapshot.paramMap.get("id");
//			nom_tab='cerem';
//			str_id='13';
console.log('dependances.ngInit('+nom_tab+','+str_id+')');
			this.ChangementDeGrille(nom_tab);
//console.log('references.ngOnInit: m_nom_tab='+this.m_nom_tab+', avant appel de InitColDefs');
			this.InitColDefs();
//console.log('apres InitColDefs');
			this.Init();
//console.log('apres Init');
        })
		*/
		/*
//console.log('dependances.ngInit('+this.m_nom_tab+','+this.m_str_id+')');
		this.InitColDefs();
//console.log('apres InitColDefs');
//		this.Init();
//console.log('apres Init');
		this.m_num_bloc_actif=0;
		*/
		/*
		var sql_select=this.m_blocs[0].m_sql_select;
		var select_adapte=sql_select.replace('@sens@','B').replace('@nom_tab@',this.m_nom_tab).replace('@id@',''+this.m_id);
		this.m_blocs[0].m_sql_select=select_adapte;
		*/
//		this.onBtnRecherche();
/*
		this.activatedRoute.params.forEach(params =>
		{
//            let userId = params["userId"];
			this.m_nom_tab=this.activatedRoute.snapshot.paramMap.get("nom_table");
//console.log('Appel de ChangementDeGrille('+nom_tab+')');
//			this.ChangementDeGrille(nom_tab);
//console.log('references.ngOnInit: m_nom_tab='+this.m_nom_tab+', avant appel de InitColDefs');
			this.InitColDefs();
//console.log('apres InitColDefs');
			this.Init();
//console.log('apres Init');
        })
*/
		this.m_num_bloc_actif=0;
		this.m_nom_tab=MenuComponent.NomTablePourDependances(GlobalConstantes.m_num_bloc_appele);
//console.log('DependancesComponent.ngOnInit: m_nom_tab='+this.m_nom_tab);
//console.log('DependancesComponent.ngOnInit: id_appele='+GlobalConstantes.m_id_appele);
		this.InitColDefs();
//console.log('apres InitColDefs');
		this.Init();
	}
	override RequeteRecherche():string
	{
		var sql_select=this.m_blocs[0].m_sql_select;
		var nb_lignes_max=this.formRecherche.get('m_filtre_nb_lignes_max').value;
		var profondeur_max=this.formRecherche.get('m_filtre_profondeur_max').value;
//		var nom_tab=MenuComponent.NomTableRef[this.m_num_bloc_actif];
		var req_sql=sql_select.replace('@sens@','B').replace('@nom_tab@',this.m_nom_tab).replace('@id@',''+GlobalConstantes.m_id_appele).replace('@nb_lignes_max@',nb_lignes_max).replace('@profondeur_max@',profondeur_max);
		return req_sql;
	}
}
