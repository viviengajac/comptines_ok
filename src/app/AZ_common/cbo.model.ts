import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccesBdService } from '../AZ_services/acces_bd';
import { TypeColSql } from './ecran.model';
//@Injectable()
export class ItemCbo
{
	constructor(public m_id:number=0,public m_lib:string='',public m_selected:boolean=false){}
}
//@Injectable()
export class Cbo
{
	public m_liste_items: ItemCbo[]=new Array(0);
	constructor(public httpClient: HttpClient,public m_nom_table:string) {}
	GenererListe(req:string)
	{
		var promise = new Promise((resolve, reject) =>
		{
			try
			{
				var ab=new AccesBdService(this.httpClient);
//				var req:string="exec AZinit_cbo '"+this.m_nom_table+"'";
//console.log('Cbo.GenererListe: req='+req);
				ab.LireTable(req)
				.then
				(
					res =>
					{
//console.log('CboInit: req='+req+', res='+res);
						var str_res=""+res;
						if(str_res.startsWith('Erreur'))
						{
							reject(res);
						}
						else
						{
							var nb_lig=ab.m_lignes.length;
							this.m_liste_items=new Array(nb_lig+1);
							var tc: ItemCbo = new ItemCbo(0,'');
							this.m_liste_items[0]=tc;
							var i;
							for(i=0;i<nb_lig;i++)
							{
//console.log('Cbo.GenererListe: ligne['+i+']');
//console.log(ab.m_lignes[i]);
								var id=ab.m_lignes[i].m_cellules[0].m_val;
								var lib=ab.m_lignes[i].m_cellules[1].m_val;
								switch(ab.m_colonnes_sql[1].m_type_col)
								{
									case TypeColSql.Date:	// date
										lib=lib.substring(0,4)+'-'+lib.substring(4,6)+'-'+lib.substring(6);
										break;
								}
								var tc: ItemCbo = new ItemCbo(id,lib);
								this.m_liste_items[i+1]=new ItemCbo(id,lib);
							}
							resolve("OK");
						}
					},
					(error) =>
					{
	//					console.log('Erreur: ' + error);
						reject(error);
					}
				)
			}
			catch(e)
			{
				console.log("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
			}
		});
//console.log('Cbo.GenererListe: fin');
		return promise;
	}
	GenererListeStd()
	{
//console.log('Cbo.GenererListeStd');
		var req:string="exec AZinit_cbo '"+this.m_nom_table+"'";
		return this.GenererListe(req);
	}
	InitialiserListe(liste_items: string[])
	{
		//console.log("Init="+liste_items[0]);
		var nb_lig=liste_items.length;
		this.m_liste_items=new Array(nb_lig+1);
		var tc: ItemCbo = new ItemCbo(0,'');
		this.m_liste_items[0]=new ItemCbo(0,'');
		var i;
		for(i=0;i<nb_lig;i++)
		{
			var id=i+1;
			//commencer l'id des items de la liste à 1, 0 étant réservé à la ligne blanche d'initialisation
			//if (liste_items[0]=='2019')
			//	id=i+1;
			var lib=liste_items[i];
			var tc: ItemCbo = new ItemCbo(id,lib);
			this.m_liste_items[i+1]=new ItemCbo(id,lib);
		}
	}
}
/*
export class CboListeItems
{
	constructor(public m_liste_items: ItemCbo[])	{}
}
*/
export class ParamsCbo
{
	constructor(public m_ecran:any=null,public m_liste_items:ItemCbo[]=new Array(0),public m_nom_table:string=''){}
}