import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
/*
import { Bloc } from '../AZ_services/bloc';
import { Cellule,TypeColEcran } from '../AZ_common/ecran.model';
import { OptionsGrille } from '../AZ_common/grille.model';
*/
import { ModalService } from '../AZ_modal/modal.service';
import { Ecran } from './ecran';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { AccesBdService } from '../AZ_services/acces_bd';
@Injectable()
export class EcranStat extends Ecran
{
    public options_stt: any=null;	// AgChartOptions;
	nom_type_stt:string='';
	
	nb_grp_x:number=0;
	nb_grp_y:number=0;
	tab_nom_grp_x:string[]=new Array(0);
	tab_nom_grp_y:string[]=new Array(0);
	tab_donnees:any[]=new Array(0);
	tab_series:SerieStt[]=new Array(0);
	id_type_stt:number=0;
    constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
	{
 		super(httpClient, formBuilder,modalService);
//console.log('SttComponent.constructor: debut');
		var val_grp:number[]=[10,20];
		this.tab_series=new Array(1);
		this.tab_series[0]=new SerieStt('?');
//		this.options_stt=new OptionStt(this.tab_donnees,'?',this.tab_series);
		this.options_stt =
		{
            data: this.tab_donnees,
            title:{ text: 'Statistiques', },
            subtitle:{ text: '?', },
            series:
			[
				{ type: 'column', xKey: 'nom_grp', yKey: 'nb_s', stacked: true },
				{ type: 'column', xKey: 'nom_grp', yKey: 'nb_f', stacked: true },
			]	
        };
//console.log('options_stt');
//console.log(this.options_stt);
//console.log('SttComponent.constructor: fin');
    }
	NomTypeStt()
	{
		return '';
	}

	TracerStatsA2Variables()
	{
		try
		{
			this.ReinitialiserCompteur();
//console.log('Debut de TracerStats');
//console.log(this.formRecherche.get('m_filtre_type_stt'));
			var req:string=this.RequeteRecherche();
			if(req!="")
			{
				this.nom_type_stt=this.NomTypeStt();
				var ab=new AccesBdService(this.httpClient);
//console.log('req='+req);
				ab.LireTable(req)
				.then(
				(res) =>
				{
//console.log('carte:AjoutMarqueurs: res='+res);
					var str_res:string=""+res;
					if(!str_res.startsWith("Erreur"))
					{
//console.log('id_type_ss='+num_id_type_stt);
//console.log('nom_type_stt='+this.nom_type_stt);
						this.tab_nom_grp_x=new Array(0);
						this.tab_nom_grp_y=new Array(0);
						var i:number;
						var j:number;
						for(i=0;i<ab.m_lignes.length;i++)
						{
//console.log('SttComponent:TracerStats: avant RecupererVal 0');
							var nom_grp_x:string=ab.m_lignes[i].RecupererVal(0);
//console.log('SttComponent:TracerStats: avant RecupererVal 1');
							var nom_grp_y:string=ab.m_lignes[i].RecupererVal(1);
//console.log('SttComponent:TracerStats: avant RecupererVal 2');
							var trouve:boolean=false;
							for(j=0;j<this.tab_nom_grp_x.length;j++)
							{
								if(nom_grp_x==this.tab_nom_grp_x[j])
									trouve=true;
							}
							if(!trouve)
								this.tab_nom_grp_x.push(nom_grp_x);
							trouve=false;
							for(j=0;j<this.tab_nom_grp_y.length;j++)
							{
								if(nom_grp_y==this.tab_nom_grp_y[j])
									trouve=true;
							}
							if(!trouve)
								this.tab_nom_grp_y.push(nom_grp_y);
						}
//console.log('SttComponent:TracerStats: tab_nom_grp_x');
//console.log(this.tab_nom_grp_x);
						this.tab_series=new Array(this.tab_nom_grp_y.length);
						for(i=0;i<this.tab_nom_grp_y.length;i++)
							this.tab_series[i]=new SerieStt(this.tab_nom_grp_y[i]);
//console.log('nb_type_grp='+this.nb_type_grp+', nb_grp='+this.nb_grp);
						this.tab_donnees=new Array(this.tab_nom_grp_x.length);
						var num_lig:number=0;
						var num_donnee:number=0;
						while(num_lig<ab.m_lignes.length)
						{
							var nom_grp_x:string=ab.m_lignes[num_lig].RecupererVal(0);
//console.log('SttComponent:TracerStats: avant RecupererVal 4');
							var nom_grp_y:string=ab.m_lignes[num_lig].RecupererVal(1);
//console.log('SttComponent:TracerStats: avant RecupererVal 5');
//console.log('SttComponent:TracerStats: num_lig='+num_lig+', nom_grp_x='+nom_grp_x+', nom_grp_y='+nom_grp_y);
							var nb:number=ab.m_lignes[num_lig].RecupererVal(2);
							var tmp_donnees=new Map<string,any>();
							tmp_donnees.set('nom_grp',nom_grp_x);
							tmp_donnees.set(nom_grp_y,+nb);
							/*
							this.tab_donnees[num_donnee]=new Map<string,any>();
							this.tab_donnees[num_donnee].set('nom_grp',nom_grp_x);
							this.tab_donnees[num_donnee].set(nom_grp_y,+nb);
							*/
							var fini:boolean=false;
							while(!fini)
							{
								num_lig++;
								if(num_lig>=ab.m_lignes.length)
								{
									fini=true;
									this.tab_donnees[num_donnee]=Object.fromEntries(tmp_donnees);										
								}
								else
								{
//console.log('SttComponent:TracerStats: avant RecupererVal 6');
									var nom_grp_x_test:string=ab.m_lignes[num_lig].RecupererVal(0);
//console.log('SttComponent:TracerStats: avant RecupererVal 7');
									if(nom_grp_x_test!=nom_grp_x)
									{
										fini=true;
										this.tab_donnees[num_donnee]=Object.fromEntries(tmp_donnees);
										num_donnee++;
									}
									else
									{
//console.log('SttComponent:TracerStats: avant RecupererVal 8');
										nom_grp_y=ab.m_lignes[num_lig].RecupererVal(1);
//console.log('SttComponent:TracerStats: avant RecupererVal 9');
										nb=ab.m_lignes[num_lig].RecupererVal(2);
//console.log('SttComponent:TracerStats: avant RecupererVal 10');
//										this.tab_donnees[num_donnee].set(nom_grp_y,+nb);
										tmp_donnees.set(nom_grp_y,+nb);
									}
								}
							}
						}
/*
console.log('fin de boucle');
for(i=0;i<this.tab_donnees.length;i++)
{
console.log('donnees['+i+']');
console.log(this.tab_donnees[i]);
}
*/
						this.options_stt =
						{
							title:{	text: 'Statistiques',},
							subtitle:{text: this.nom_type_stt},
							data: this.tab_donnees,
							series:this.tab_series
						};
//console.log('option_stt');
//console.log(this.options_stt);
					}
				},
				(error) =>
				{
					var str_err:string=error;
					this.MessageErreur(str_err);
				})
			}
//console.log('fin try');
		}
		catch(e)
		{
			this.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
//			console.log("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
		}
//console.log('fin ngAfterViewInit');
	}
	/*
	onAfficherStt()
	{
		this.TracerStats();
	}
	*/
}
class SerieStt
{
	type:string='column';
	xKey:string='nom_grp';
	yKey:string='';
	stacked:boolean=true;
	constructor(nom_grp:string){this.yKey=nom_grp;}
}
