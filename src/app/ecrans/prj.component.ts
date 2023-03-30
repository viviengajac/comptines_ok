import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { fromEvent } from 'rxjs/observable/fromEvent';
import { UntypedFormBuilder } from '@angular/forms';
import { EcranFormulaire } from '../AZ_services/ecran_formulaire';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
import { GlobalConstantes } from '../AZ_common/global_cst';
@Component({
  selector: 'app-prj',
  templateUrl: './prj.component.html'
})
@Injectable()
export class PrjComponent extends EcranFormulaire
{
	m_nom_prj:string='';
	m_rep_fic:string='';
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
//console.log('debut de constructeur de Prjcomponent');
		this.m_nom_ecran="Projet";
		this.m_blocs=new Array(1);
//		this.m_classe_boutons=new Array(4);
		var cols=new Array(3);
		cols[0]=new ColonneEcran("id_prj","id_prj",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		cols[1]=new ColonneEcran("nom_prj","Nom",TypeColEcran.Chaine,true,ModifCol.NonModifiable,true,true,150);
		cols[2]=new ColonneEcran("rep_fic","Répertoire des fichiers",TypeColEcran.Chaine,true,ModifCol.Obligatoire,true,true,120);
		this.m_blocs[0]=new Bloc(httpClient,this,"prj","projet","projet","F","exec AZprjSelect","", "id_prj",cols);
//		this.m_blocs[0]=new Bloc(httpClient,this,"prj","projet","projet","F",300,"exec AZprjSelect","exec AZprjMaj @etat@,@id_prj@,@nom_prj@,@rep_fic@", "id_prj",cols);
		this.formOngletPrincipal=this.formBuilder.group({m_nom_prj:'',m_rep_fic:''});
//		this.m_tab_col_nom_fic=["nom_prs","prenom_prs"];
		this.m_classe_boutons=new Array(this.m_blocs.length);
console.log('fin de constructeur de Prjcomponent');
	}
	ngOnInit(): void
	{
console.log('debut de NgInit de Prjcomponent');
		this.Init();
		this.onRecherche();
//console.log('fin de NgInit de Prjcomponent');
	}
	override onSauver()
	{
//console.log('PrjComponent.onSauver: form element');
//console.log(this.formOngletPrincipal.get('m_rep_fic'));
		GlobalConstantes.m_rep_fic=this.formOngletPrincipal.get('m_rep_fic').value;
//console.log('PrjComponent.onSauver: rep_fic='+GlobalConstantes.m_rep_fic);
	}
	onRecherche()
	{
		var rep:string=GlobalConstantes.m_rep_fic;
		console.log("m_rep_fic="+GlobalConstantes.m_rep_fic);
		super.onBtnRecherche();
/* 		if(rep.length==0)
		{
			super.onBtnRecherche();
			console.log("rep.length=0");
		}
		else
		{
			this.formOngletPrincipal.get('m_rep_fic').setValue(rep);
		} */
	}
}
