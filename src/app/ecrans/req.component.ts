import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { Cbo } from '../AZ_common/cbo.model';
import { EcranGrille } from '../AZ_services/ecran_grille';
import { Bloc } from '../AZ_services/bloc';
import { TypeColEcran,TypeColSql,ColonneEcran,ModifCol } from '../AZ_common/ecran.model';
import { ModalService } from '../AZ_modal/modal.service';
/*
@Component({
  selector: 'app-prs',
//  templateUrl: './prs.component.html',
  styleUrls: ['./prs.component.scss']
})
*/
@Component({
  selector: 'app-req',
  templateUrl: './req.component.html'
})
@Injectable()
export class ReqComponent extends EcranGrille
{
	constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
		super(httpClient, formBuilder,modalService);
//console.log('debut de constructeur de Prscomponent');
		this.m_nom_ecran="Requetes";
		this.m_blocs=new Array(1);
//		this.m_classe_boutons=new Array(4);
		var cols=new Array(1);
		cols[0]=new ColonneEcran("id_req","id_req",TypeColEcran.ClePrimaire,false,ModifCol.NonModifiable,false,true,100);
		this.m_blocs[0]=new Bloc(httpClient,this,"req","req","Sql","G",300,"exec AZreq__recherche","", "id_req",cols);
		this.formRecherche=this.formBuilder.group({m_sql: ''});
		this.m_classe_boutons=new Array(this.m_blocs.length);
		this.m_num_bloc_actif=0;
//console.log('fin de constructeur de Prscomponent');
	}
	ngOnInit(): void
	{
//console.log('debut de NgInit de Prscomponent');
		this.InitColDefs();
		this.Init();
//console.log('fin de NgInit de Prscomponent');
	}
	override RequeteRecherche():string
	{
		var req:string=this.formRecherche.get('m_sql').value;
		return req;
	}
	override PreparerBloc()
	{
		var promise = new Promise((resolve, reject) =>
		{
			var nb_cols:number=this.m_blocs[0].m_colonnes_sql.length;
//console.log("ReqComponent: PreparerBloc: nb_col="+nb_cols);
			var cols=new Array(nb_cols);
			var i:number=0;
			for(i=0;i<nb_cols;i++)
			{
				var nom_col=this.m_blocs[0].m_colonnes_sql[i].m_nom_col;
				var type_col_sql=this.m_blocs[0].m_colonnes_sql[i].m_type_col;
				var type_col:TypeColEcran=TypeColEcran.Chaine;
				switch(type_col_sql)
				{
					case TypeColSql.Entier:
						type_col=TypeColEcran.Entier;
						break;
					case TypeColSql.Flottant:
						type_col=TypeColEcran.Flottant;
						break;
					case TypeColSql.Chaine:
						type_col=TypeColEcran.Chaine;
						break;
					case TypeColSql.Date:
						type_col=TypeColEcran.Date;
						break;
					case TypeColSql.Booleen:
						type_col=TypeColEcran.Booleen;
						break;
				}
				cols[i]=new ColonneEcran(nom_col,nom_col,type_col,true,ModifCol.NonModifiable,true,true,100);
			}
			this.m_blocs[0].m_colonnes_ecran=cols;
//			this.ChangementDeGrille("req");
			this.InitColDefs();
			this.Init();
			resolve("OK");
		});
		return promise;		
	}
}
