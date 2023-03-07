import { AccesBdService } from '../AZ_services/acces_bd';
import { AccesJSon } from '../AZ_services/json.service';
import { HttpClient } from '@angular/common/http';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { TypeColEcran,TypeColSql,ColDef, ColonneEcran,ColonneSql,Ligne,Cellule,ColumnCbo,ColumnDate,ColumnDateHeure,ColumnVoirDoc,ColumnDefDoc,ColumnDependances,ColumnBool,ModifCol,ParamsCbo,ColumnBoolNonModif } from '../AZ_common/ecran.model';
import { Cbo,CboListeItems,ItemCbo } from '../AZ_common/cbo.model';
import { Ecran } from './ecran';
import { formatDate } from '@angular/common';
import * as FileSaver from 'file-saver';

export class Bloc
{
	m_coldefs: any[];
//	m_lignes_org:Ligne[];
	m_lignes:Ligne[]=new Array(0);
	m_colonnes_sql: ColonneSql[];
	m_modif:boolean=false;
	gridApi:any;
	gridColumnApi:any;
	m_nouvelle_cbo:ColumnCbo;
	
		
	m_taille_blob:number;
	m_buffer_blob:Uint8Array;
	m_taille_bloc:number;
	m_taille_lue:number;
	m_octet_debut:number;
	m_fini:boolean;
	m_etape_finie:boolean;

	
	constructor(public httpClient:HttpClient,public m_ecran:Ecran,public m_nom_table:string,public m_nom_bloc:string,public m_lib_bloc:string,public m_type_bloc:string,public m_hauteur_grille, public m_sql_select: string, public m_sql_update: string, public m_nom_cle_primaire: string,public m_colonnes_ecran: ColonneEcran[]){}
	InitGridApi(grid_api:any,grid_column_api:any)
	{
		this.gridApi=grid_api;
		this.gridColumnApi=grid_column_api;
//console.log(grid_api);
//console.log(grid_api.gridOptions);
//console.log(grid_api.setRowHeight);
	}
	LargeurColonne(largeur_std:number):number
	{
		var facteur:number=1;
		switch(GlobalConstantes.m_classe_fonte)
		{
			case "tres_petite":
				facteur=0.8;
				break;
			case "petite":
				facteur=1.0;
				break;
			case "moyenne":
				facteur=1.2;
				break;
			case "grande":
				facteur=1.5;
				break;
			case "tres_grande":
				facteur=1.8;
				break;
		}
		return largeur_std*facteur;
	}
	InitColumnCbo(col:ColDef,nom_table:string)
	{
		var promise = new Promise((resolve, reject) =>
		{
			this.m_nouvelle_cbo=new ColumnCbo(col.field,col.headerName,col.sortable,col.filter,col.hide,col.resizable,col.editable,col.width,col.cellClass,col.headerClass);
			var cbo_tmp:Cbo=new Cbo(this.httpClient,nom_table);
			cbo_tmp.GenererListeStd()
			.then(
			res=>
			{
				this.m_nouvelle_cbo.valueFormatter=this.formatterCbo(cbo_tmp.m_liste_items);
//				this.m_nouvelle_cbo.cellEditorParams=new CboFiltre(cbo_tmp.m_liste_items);
				this.m_nouvelle_cbo.cellEditorParams=new ParamsCbo(this.m_ecran,new CboListeItems(cbo_tmp.m_liste_items),nom_table);
//console.log('InitColumnCbo');
//console.log(this.m_nouvelle_cbo);
				resolve('OK');
			}
			,err=>
			{
				this.m_ecran.MessageErreur(err+'§sql§data§pile');
				reject(err);
			});
		});
		return promise;
	}
	ClassesEntete(col:ColonneEcran):string[]
	{
		var classes:string[]=new Array(2);
		classes[0]=this.m_ecran.m_classe_fonte;
		if(col.m_modifiable==ModifCol.Obligatoire)
			classes[1]='obligatoire';
		else if (col.m_modifiable==ModifCol.NonModifiable)
			classes[1]='non_modifiable';
		else
			classes[1]="modifiable";
		return classes;
	}
	async InitColDefs()
	{
//console.log('bloc.InitColDefs pour le bloc '+this.m_nom_bloc);
		var nb_col:number=0;
		var i;
		for(i=0;i<this.m_colonnes_ecran.length;i++)
		{
//console.log('bloc.Initcoldefs: i='+i);
			var col: ColonneEcran=this.m_colonnes_ecran[i];
//console.log('m_inser_ecran='+col.m_inser_ecran);
			if(col.m_inser_ecran)
				nb_col++;
		}
//console.log('InitColDefs: num_onglet='+i+', nbcols='+nb_col);
		var cols:any[]=new Array(nb_col);
		this.m_coldefs=new Array(cols.length);
		var num_col:number=0;
		for(i=0;i<this.m_colonnes_ecran.length;i++)
		{
//console.log('Initcoldefs: i='+i);
			var col: ColonneEcran=this.m_colonnes_ecran[i];
			var largeur:number=this.LargeurColonne(col.m_largeur);
			var classe_cellule:string=this.m_ecran.m_classe_fonte;
			var classes_header:string[]=this.ClassesEntete(col);
			if(col.m_inser_ecran)
			{
//console.log('colonne: '+col.m_nom_col+', largeur='+largeur+', classes_header='+classes_header[0]+','+classes_header[1]);
				switch(col.m_type_col)
				{
					case TypeColEcran.CleEtrangere:
//console.log('clé étrangère');
						var col1:ColDef=new ColDef(col.m_nom_col,col.m_lib_col,true,true,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						var nom_table=col.NomTablePourCbo();
						var fini:boolean=false;
						this.InitColumnCbo(col1,nom_table)
						.then(
						res=>
						{
//console.log('init cbo');
//console.log(this.m_nouvelle_cbo);
							cols[num_col]=this.m_nouvelle_cbo;
							fini=true;
						},
						err=>
						{
							this.m_ecran.MessageErreur('Erreur '+err+'§sql§data§pile');
							fini=true;
						}
						);
						while(!fini)
						{
							await this.delay(50);
						}
						break;
					case TypeColEcran.Date:	// date
//console.log('colonne date: '+col.m_nom_col);
						cols[num_col]=new ColumnDate(col.m_nom_col,col.m_lib_col,true,true,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						break;
					case TypeColEcran.DateHeure:	// dateheure
//console.log('colonne dateheure: '+col.m_nom_col);
						cols[num_col]=new ColumnDateHeure(col.m_nom_col,col.m_lib_col,true,true,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						break;
					case TypeColEcran.VoirDocDb:
						cols[num_col]=new ColumnVoirDoc(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick: this.onBtnVoirDocDbClick.bind(this),label: 'VoirDb'};
						break;
					case TypeColEcran.DefDocDb:
						cols[num_col]=new ColumnDefDoc(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick: this.onBtnDefDocDbClick.bind(this),label:'DéfinirDb'};
						break;
					case TypeColEcran.VoirDocFs:
						cols[num_col]=new ColumnVoirDoc(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick:this.onBtnVoirDocFsClick.bind(this),label: 'Voir'};
						break;
					case TypeColEcran.DefDocFs:
						cols[num_col]=new ColumnDefDoc(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick:this.onBtnDefDocFsClick.bind(this),label:'Définir'};
						break;
					case TypeColEcran.Dependances:
						cols[num_col]=new ColumnDependances(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick:this.onBtnDependancesClick.bind(this),label:'Dépendances'};
						break;
					case TypeColEcran.Booleen:
						cols[num_col]=new ColumnBool(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						cols[num_col].cellRendererParams={onClick:this.onBoolClick.bind(this)};
						break;
					case TypeColEcran.BooleenNonModif:
							cols[num_col]=new ColumnBoolNonModif(col.m_nom_col,col.m_lib_col,true,false,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
							cols[num_col].cellRendererParams={onClick:this.onBoolClick.bind(this)};
							break;
					default:
						cols[num_col]=new ColDef(col.m_nom_col,col.m_lib_col,true,true,!col.m_visible,true,col.EstModifiable(),largeur,classe_cellule,classes_header);
						break;
				}
				this.m_coldefs[num_col]=cols[num_col];
//console.log('colonne '+num_col+' definie');
//console.log('coldefs=(field='+this.m_onglets[i].m_coldefs[num_col].field+'),(hide='+this.m_onglets[i].m_coldefs[num_col].hide+')');
				num_col++;
			}
		}
		/*
		catch(e)
		{
console.log('bloc.InitColDefs: erreur:'+(e as Error).message);
//			this.m_ecran.MessageErreur("Erreur: "+(e as Error).message);
		}
		*/
	}
	onBtnVoirDoc(id_doc:number,db_ou_fs:string): string
	{
//console.log('onBtnVoirDoc');
//console.log('onBtnVoirDoc: id_doc='+id_doc+', db_ou_fs='+db_ou_fs);
		var num_lig:number=this.NumLig(id_doc);
//console.log('onBtnVoirDoc: num_lig='+num_lig);
		var type_fic=this.ValCelluleParNom(num_lig,'id_type_ficWITH');
//console.log('onBtnVoirDoc: type_fic='+type_fic);
		var nom_fic_base=this.m_ecran.DefNomFic().replace(/\'/g,"_").replace(/ /g,"_");
//console.log('nom_fic_base='+nom_fic_base);
		var nom_doc: string=this.ValCelluleParNom(num_lig,'nom_doc');
//console.log('nom_doc='+nom_doc);
		var	nom_fic: string=this.ValCelluleParNom(num_lig,'id_type_docWITH');
		var nom_fic_complet:string=nom_fic_base+'_'+nom_fic;
		if(!(nom_doc === undefined) && nom_doc.length>0)
		{
			nom_fic_complet+='_'+nom_doc;
		}
//console.log('type_fic='+type_fic+', nom_fic='+nom_fic+', nom_fic_base='+nom_fic_base);
//console.log('nom_fic_complet='+nom_fic_complet+', type_fic='+type_fic+', nom_fic='+nom_fic+', nom_fic_base='+nom_fic_base);
		var ab=new AccesBdService(this.httpClient);
		var type_mime:string=ab.DonnerTypeMime(type_fic);
		if(type_mime.length==0)
		{
			this.m_ecran.MessageErreur('Erreur: type de fichier inconnu: '+type_fic);
		}
		else
		{
//console.log('retour_brut='+ab.m_retour_brut);
			ab.LireTailleBlob(db_ou_fs,this.m_nom_table,id_doc,type_fic)
			.then
			(
				res =>
				{
					ab.SpecifierEcran(this.m_ecran);
					var str_res:string=""+res;
					if(str_res.startsWith('Erreur'))
						this.m_ecran.MessageErreur(str_res+'§sql§data§pile');
					else
					{
//console.log('LireBlob: retour='+ab.m_retour_brut);
/*
						const byteArray = new Uint8Array(atob(ab.m_retour_brut).split('').map(char => char.charCodeAt(0)));
						const data: Blob = new Blob([byteArray], {type: type_mime});
*/
						ab.LireBlob(db_ou_fs,this.m_nom_table,id_doc,type_fic)
						.then
						(
							res =>
							{
//console.log('Bloc.OnBtnVoirDoc: fin de lireblob');
								const data: Blob = new Blob([ab.m_buffer_blob], {type: type_mime});
								var maintenant=formatDate(new Date(),'yyyyMMddHHmmss', 'en');
								FileSaver.saveAs(data, nom_fic_complet + '_export_' + maintenant + type_fic);
//								this.m_ecran.MessageBox('OK');
							},
							err =>
							{
								str_res=""+err;
								this.m_ecran.MessageErreur(str_res+'§sql§data§pile');
							}
						);
					}
//console.log('contenu='+contenu);
				},
				err =>
				{
					this.m_ecran.MessageErreur(err+'§sql§data§pile');
				}
			);
		}
		this.ReinitialiserCompteur();
		return 'OK';
	}
	onBtnVoirDocDbClick(e): string
	{
//console.log('rowdata='+this.rowDataClicked1);
		var str_id_doc=e.detail[this.m_nom_cle_primaire];
		return this.onBtnVoirDoc(str_id_doc,"db");
	}
	onBtnVoirDocFsClick(e): string
	{
//console.log('rowdata='+this.rowDataClicked1);
		var str_id_doc=e.detail[this.m_nom_cle_primaire];
		return this.onBtnVoirDoc(str_id_doc,"fs");
	}
	contenu_fic: string |ArrayBuffer;
	fic: File;
	async onBtnDefDoc(id_doc:number,fic:File,db_ou_fs:string)
	{
//console.log('debut de onBtnDefDoc');
//console.log(fic);
//		var str_id_doc=e.detail["def_doc"];
		this.ReinitialiserCompteur();
		const max_size = 150000;
		var faire:boolean=true;
		var num_lig:number=this.NumLig(id_doc);
//console.log('onBtnDefDocClick: num_lig='+num_lig);
		if(num_lig<0)
		{
			this.m_ecran.MessageErreur("Il faut d'abord sauver la ligne");
			faire=false;
		}
		else
		{
			if(fic.size>max_size)
			{
				this.m_ecran.m_retour_modal="";
				this.m_ecran.MessageBox("Fichier très gros (taille max=100000 octets): voulez-vous continuer ?")
				while(this.m_ecran.m_retour_modal=="")
				{
//console.log('attente');
					await this.delay(500);
				}
//console.log('fin d attente: '+this.m_ecran.m_retour_modal);
				if(this.m_ecran.m_retour_modal=="Cancel")
					faire=false;
			}
		}
//console.log('faire='+faire);
		if(faire)
		{
//console.log('classe de fic='+this.fic.constructor.name);
//console.log('type de fic='+this.fic.type);
//console.log('nom de fic='+this.fic.name);
			let fileReader: FileReader = new FileReader();
			let self = this;
//		var contenu: string;
			fileReader.onloadend = function(x)
			{
				self.contenu_fic = (""+fileReader.result).split(',')[1];
//console.log('contenu du fichier='+self.contenu_fic);
				var type_mime: string=self.fic.type;
//console.log('type_mime='+type_mime);
				var type_fic:string="";
				switch(type_mime)
				{
					case "application/excel":
						type_fic='.xls';
						break;
					case "application/msword":
						type_fic='.doc';
						break;
					case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
						type_fic='.docx';
						break;
					case "application/vndopenxmlformats-officedocument.wordprocessingml.document":
						type_fic='.docx';
						break;
					case "image/bmp":
						type_fic='.bmp';
						break;
					case "text/csv":
						type_fic='.csv';
						break;
					case "image/gif":
						type_fic='.gif';
						break;
					case "image/jpeg":
						type_fic='.jpg';
						break;
					case "text/html":
						type_fic='.html';
						break;
					case "application/pdf":
						type_fic='.pdf';
						break;
					case "text/plain":
						type_fic='.txt';
						break;
					case "application/octet-stream":
//console.log('trouve');
						const nom_fic:string=fic.name;
						const idx=nom_fic.indexOf('.');
						if(idx>0)
						{
							const ext=nom_fic.substring(idx);
//console.log('ext'+ext);
							var ab=new AccesBdService(self.httpClient);
							ab.LireValeur("select id_type_fic from type_fic where code_type_fic='"+ext+"'")
							.then
							(
								res =>
								{
//console.log('res='+res);
									var str_res:string=""+res;
									if(str_res.startsWith('Erreur'))
										self.m_ecran.MessageErreur(str_res+'§sql§data§pile');
									else if(str_res.length>0)
									{
//console.log('LireBlob: retour='+ab.m_retour_brut);
										type_fic=ext;
									}
//console.log('contenu='+contenu);
								},
								err =>
								{
									self.m_ecran.MessageErreur(err+'§sql§data§pile');
								}
							);
						}
						break;
					default:
						break;
				}
				if(type_fic.length==0)
				{
					self.m_ecran.MessageErreur("Erreur: le type de fichier n'est pas connu: "+type_mime);
				}
				else
				{
					var nom_table=self.m_nom_table;
//console.log('onBtnDefDoc: nom_table='+nom_table);
					var ab=new AccesBdService(self.httpClient);
					ab.EcrireBlob(db_ou_fs,nom_table,id_doc,type_fic,self.contenu_fic)
					.then(res =>
					{
//console.log('retour='+res);
						var str_res:string=""+res;
						if(str_res.startsWith('Erreur'))
							self.m_ecran.MessageErreur(str_res+'§sql§data§pile');
						else
						{
							self.m_ecran.RafraichirEcran();
							self.m_ecran.MessageBox("OK");
						}
					},
					error =>
					{
						var msg='retour de EcrireBlob='+error.message;
//console.log(msg);
						self.m_ecran.MessageErreur(msg);
					});
				}
			}
			fileReader.readAsDataURL(this.fic);
		}
		this.ReinitialiserCompteur();
		return 'OK';
	}
	onBtnDefDocDbClick(e)
	{
//console.log('debut de onBtnDefDocClick');
		var str_id_doc=e.detail[this.m_nom_cle_primaire];
		this.fic=e.fic[0];
		return this.onBtnDefDoc(str_id_doc,this.fic,"db");
	}
	onBtnDefDocFsClick(e)
	{
//console.log('debut de onBtnDefDocClick');
		var str_id_doc=e.detail[this.m_nom_cle_primaire];
		this.fic=e.fic[0];
		return this.onBtnDefDoc(str_id_doc,this.fic,"fs");
	}
	onBtnDependances(nom_table:string,str_id:string)
	{
//console.log('debut de onBtnDependances');
//		const url=this.route.snapshot.params.prenom;
//		var url:string='dependances/'+GlobalConstantes.m_serveur_bd.replace(/\//g,'!')+'/'+nom_table+'/'+str_id;
//		var url:string='/dependances?nom_tab='+nom_table+'&id='+str_id;
		var url:string='/dependances?serveur_bd='+GlobalConstantes.m_serveur_bd+'&nom_tab='+nom_table+'&id='+str_id;
//console.log('appel dependances: url='+url);
		window.open(url,'_blank');
		this.ReinitialiserCompteur();
		return 'OK';
	}
	onBtnDependancesClick(e)
	{
//console.log('debut de onBtnDefDocClick');
		var nom_table=this.m_nom_table;
		var str_id=e.detail[this.m_nom_cle_primaire];
		return this.onBtnDependances(nom_table,str_id);
	}
	onBoolClick(e): string
	{
console.log('onBoolClick');
console.log("e= "+e);
console.log("e.checked= "+e.checked);
		var str_id=e.detail[this.m_nom_cle_primaire];
		var val_col:boolean=e.checked;
console.log("val_col= "+val_col);
console.log('event='+e.event);
console.log('composedPath()='+e.event.composedPath());
console.log('composedPath()[4]='+e.event.composedPath()[4]);
// on remplace event.path par event.composedPath()
		var t:HTMLInputElement=e.event.composedPath()[4];
console.log("t= "+t);
		var nom_col:string=t.getAttribute('col-id');
console.log('nom_col='+nom_col);
//		var nom_col:string=e.event.path[2].attributes.col-id.value;
console.log('str_id='+str_id+', return_value='+val_col+', nom_col='+nom_col);
//		var num_col_sql=this.NumeroColonneSql(nom_col);
		this.ModifValeurChamp(nom_col,str_id,val_col);
		return 'OK';
	}
	formatterCbo(options:ItemCbo[])
	{
		return (params) =>
		{
//console.log('formatterCbo: nb items='+options.length);
			var i:number;
			for(i=0;i<options.length;i++)
			{
				if(options[i].m_id==params.value)
					return options[i].m_lib;
			}
			return 'id='+params.value;
		}
	}
	delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	ValCelluleParNum(num_lig:number,num_col_sql:number)
	{
//console.log('BlocService.debut de ValCelluleParNum('+num_lig+','+num_col_sql+')');
//console.log(this);
		var i:number;
		for(i=0;i<this.m_lignes[num_lig].m_cellules.length;i++)
		{
//console.log('BlocService.ValCelluleParNum: i='+i);
			if(this.m_lignes[num_lig].m_cellules[i].m_num_col==num_col_sql)
			{
				var val_cel=this.m_lignes[num_lig].m_cellules[i].m_val;
				switch(this.m_colonnes_sql[num_col_sql].m_type_col)
				{
					case TypeColSql.Date:
//console.log('dans ValCellule: date='+val_cel);
						if(val_cel.length==8)
						{
							var annee:number=val_cel.substring(0,4);
							var mois:number=val_cel.substring(4,6);
							var jour:number=val_cel.substring(6);
							val_cel=annee+'-'+mois+'-'+jour;
						}
//console.log('dans ValCellule: aprs_formatage='+val_cel);
						break;
				}
//console.log('retour de ValCelluleParNum: val_cel='+val_cel);
				return val_cel;
			}
		}
//console.log('fin anormale de ValCelluleParNum('+num_lig+','+num_col_sql+')');
	}
	ValCelluleParNom(num_lig:number,nom_col_sql:string)
	{
		var num_col_sql:number=this.NumeroColonneSql(nom_col_sql);
//console.log('ValCelluleParNom('+nom_col_sql+'): num_col_sql='+num_col_sql);
		return this.ValCelluleParNum(num_lig,num_col_sql);
	}
	EcrireVal(num_lig:number,num_col_sql:number,val_col:any)
	{
//console.log('BlocService.EcrireVal('+num_lig+','+num_col_sql+','+val_col+')');
//console.log(this);
		var num_cel=this.NumCel(num_lig,num_col_sql);
//console.log('num_cel='+num_cel);
		if(num_cel>=0)
		{
			this.m_lignes[num_lig].m_cellules[num_cel].m_val=val_col;
//console.log('modification enregistree');
		}
		else
		{
//console.log('creation de cellule');
			var cel:Cellule=new Cellule(num_col_sql,val_col);
			this.m_lignes[num_lig].m_cellules.push(cel);
//console.log('cellule ajoutee');
		}
	}
	NumeroColonneSql(nom_col: string)
	{
		var i:number;
		var num_col:number=-1;
//console.log('Bloc.NumeroColonneSql: nom_col cherchée='+nom_col);
//console.log(this.m_colonnes_sql);
		for(i=0;i<this.m_colonnes_sql.length;i++)
		{
//console.log('NumeroColonneSql: colonne_sql['+i+']='+this.m_colonnes_sql[i].m_nom_col);
			if(this.m_colonnes_sql[i].m_nom_col==nom_col)
				num_col=i;
		}
//console.log('NumeroColonneSql('+nom_col+')='+num_col);
		return num_col;
	}
	NumeroColonneSqlClePrimaire()
	{
		return this.NumeroColonneSql(this.m_nom_cle_primaire);
	}
	NumeroColonneEcran(nom_col: string)
	{
		var i:number;
		var num_col:number=-1;
//console.log('dans ChercherColonneSql: nom_col cherchée='+nom_col);
		for(i=0;i<this.m_colonnes_ecran.length;i++)
		{
//console.log('colonne_sql['+i+']='+this.m_colonnes_sql[i].m_nom_col);
			if(this.m_colonnes_ecran[i].m_nom_col==nom_col)
				num_col=i;
		}
//console.log('ChercherColonneSql('+nom_col+')='+num_col);
		return num_col;
	}
	NumeroColonneSqlParLibCol(lib_col: string)
	{
		var i:number;
		var nom_col:string;
		for(i=0;i<this.m_colonnes_ecran.length;i++)
		{
			if(this.m_colonnes_ecran[i].m_lib_col==lib_col)
				nom_col=this.m_colonnes_ecran[i].m_nom_col;
		}
		var num_col=this.NumeroColonneSql(nom_col);
		return num_col;
	}
	NumeroColDef(nom_col: string)
	{
		var i:number;
		var num_col:number=-1;
//console.log('dans ChercherColonneSql: nom_col cherchée='+nom_col);
		for(i=0;i<this.m_coldefs.length;i++)
		{
//console.log('colonne_sql['+i+']='+this.m_colonnes_sql[i].m_nom_col);
			if(this.m_coldefs[i].field==nom_col)
				num_col=i;
		}
//console.log('ChercherColonneSql('+nom_col+')='+num_col);
		return num_col;
	}
	NumLig(id_cle_primaire:number):number
	{
//console.log('BlocService.NumLig:nom_col_cle_primaire='+this.m_nom_cle_primaire+', id_cle_primaire='+id_cle_primaire);
		var num_col_cle_primaire:number=this.NumeroColonneSql(this.m_nom_cle_primaire);
//console.log('Bloc.NumLig:num_col_cle_primaire='+num_col_cle_primaire);
		var i:number;
		for(i=0;i<this.m_lignes.length;i++)
		{
//console.log('NumLig: i='+i);
			var cle_test=this.ValCelluleParNum(i,num_col_cle_primaire);
//console.log('NumLig: cle_test='+cle_test+', id_cle_primaire='+id_cle_primaire);
			if(cle_test==id_cle_primaire)
			{
//console.log('retour normal');
				return i;
			}
		}
//console.log('retour -1');
		return -1;
	}
	NumCel(num_lig:number,num_col_sql:number)
	{
		var i:number;
//console.log('blocservice.NumCel('+num_lig+','+num_col_sql+')');
//console.log(this);
		for(i=0;i<this.m_lignes[num_lig].m_cellules.length;i++)
		{
			if(this.m_lignes[num_lig].m_cellules[i].m_num_col==num_col_sql)
				return i;
		}
		return -1;
	}
	DonnerStringJSonPourGenererSql(remplacer_nom_col_par_header: boolean, pour_excel: boolean): string
	{
		var aj = new AccesJSon();
		var string_json:string;
		string_json=aj.DonnerStringJSon(this.m_colonnes_ecran,this.m_colonnes_sql,this.m_lignes, remplacer_nom_col_par_header,pour_excel);
		console.log("DDD bloc.ts: this="+this+" ;bloc.DonnerStringJSonPourGenererSql="+string_json);
		return string_json;
	}
	DonnerStringJSon(remplacer_nom_col_par_header: boolean, pour_excel: boolean): string
	{
		var aj = new AccesJSon();
		var string_json:string;
		console.log("DD0");
		string_json=aj.DonnerStringJSon(this.m_colonnes_ecran,this.m_colonnes_sql,this.m_lignes, remplacer_nom_col_par_header,pour_excel);
		console.log("DD2 bloc.ts: this="+this+" ;bloc.DonnerStringJson="+string_json);
		return string_json;
	}
	DonnerStringFormulaireJSon(remplacer_nom_col_par_header: boolean,pour_excel: boolean): string
	{
		var aj = new AccesJSon();
		var string_json:string;
		string_json=aj.DonnerStringFormulaireJSon(this.m_colonnes_ecran,this.m_colonnes_sql,this.m_lignes, remplacer_nom_col_par_header,pour_excel);
		return string_json;
	}
	SupprimerUneLigne(id_cle_primaire:number)
	{
		var num_lig:number=this.NumLig(id_cle_primaire);
		var num_col:number=this.NumeroColonneSql("etat");
		var etat:string=this.ValCelluleParNum(num_lig,num_col);
		if(etat==="I")
		{
			this.m_lignes.splice(num_lig,1);
			var i:number;
			var modif:boolean=false;
			for(i=0;i<this.m_lignes.length;i++)
			{
				etat=this.ValCelluleParNum(i,num_col);
				if(etat=="U"|| etat=="D"||etat=="I")
					modif=true;
			}
			this.m_modif=modif;
		}
		else
		{
			if(id_cle_primaire<-1111)
			{
				this.m_ecran.MessageErreur('Ligne non modifiable');
			}
			else
			{
//console.log('BlocService.SupprimerUneLigne: appel de EcrireVal('+num_lig+','+num_col+',D)');
				this.EcrireVal(num_lig,num_col,"D");
				this.m_modif=true;
			}
		}
	}
	SupprimerToutesLesLignes()
	{
		this.m_lignes=new Array(0);
	}
	ReinitialiserCompteur()
	{
		GlobalConstantes.m_compteur=0;
	}
	ChargerBloc(req_sql: string,SuppColInvisibles: boolean,RemplacerNomColParHeader:boolean )
	{
		var promise = new Promise((resolve, reject) =>
		{
			try
			{
//console.log('AAA apres declaration promise: req='+req_sql);
//console.log('apres declaration promise: id_maitre='+this.m_id_maitre);
				var ab=new AccesBdService(this.httpClient);
//console.log('CCCC Bloc.ChargerBloc('+req_sql+')');
				ab.LireTable(req_sql)
				.then(res =>
				{
//console.log('bloc:ChargerBloc: res='+res);
					var i:number;
					var j:number;
					var str_res:string=""+res;
					if(!str_res.startsWith("Erreur"))
					{
//console.log('requete executee: nb_colonnes='+ab.m_colonnes_sql.length);
//						this.InitialiserColonnesSql(ab.m_colonnes_sql);

						this.m_colonnes_sql=new Array(ab.m_colonnes_sql.length);
						for(i=0;i<ab.m_colonnes_sql.length;i++)
						{
							this.m_colonnes_sql[i]=ab.m_colonnes_sql[i];
							// verification du type de colonne par rapport aux colonnes_ecran
							// car parfois SQL donne des types de colonne incorrects, dans le cas des dates
							for(j=0;j<this.m_colonnes_ecran.length;j++)
							{
								if(this.m_colonnes_ecran[j].m_nom_col==this.m_colonnes_sql[i].m_nom_col)
								{
//console.log("GGGG="+this.m_colonnes_sql[i].m_nom_col+" ; "+this.m_colonnes_ecran[j].m_nom_col);
									switch(this.m_colonnes_ecran[j].m_type_col)
									{
										case TypeColEcran.Date:
											if(this.m_colonnes_sql[i].m_type_col==TypeColSql.Chaine)
												this.m_colonnes_sql[i].m_type_col=TypeColSql.Date;
											break;
									}
								}
							}
						}
						const suffixe_date=" 00:00:00.000";
						this.m_lignes=new Array(ab.m_lignes.length);
//		this.m_lignes_org=new Array(lignes.length);
						var num_col:number;
// console.log("bloc: InitialiserLignes: nb_lignes="+lignes.length);
						for(i=0;i<ab.m_lignes.length;i++)
						{
//console.log("bloc: ChargerBloc: num_ligne="+i);
//console.log(ab);
//console.log("bloc: ChargerBloc: num_ligne="+i+": m_cellules="+ab.m_lignes[i].m_cellules);
//console.log("bloc: ChargerBloc: num_ligne="+i+": nb_cellules="+ab.m_lignes[i].m_cellules.length+": cellules[1]="+ab.m_lignes[i].m_cellules[1].m_val);
							for(j=0;j<ab.m_lignes[i].m_cellules.length;j++)
							{
								num_col=ab.m_lignes[i].m_cellules[j].m_num_col;
								switch(this.m_colonnes_sql[num_col].m_type_col)
								{
									case TypeColSql.Date:
										var val_col=ab.m_lignes[i].m_cellules[j].m_val;
										if(val_col.endsWith(suffixe_date))
										ab.m_lignes[i].m_cellules[j].m_val=val_col.substring(0,val_col.length-suffixe_date.length);
										break;
								}
							}
// console.log("bloc: InitialiserLignes: fin pour num_ligne="+i);
							this.m_lignes[i]=ab.m_lignes[i];
//console.log("bloc: ChargerBloc: num_ligne="+i+": nb_cellules="+ab.m_lignes[i].m_cellules.length+": cellules[1]="+ab.m_lignes[i].m_cellules[1].m_val);
//			this.m_lignes_org[i]=lignes[i];
						}

//					this.InitialiserLignes(ab.m_lignes);
						resolve('OK');
					}
					else
					{
						reject(str_res);
					}
				},
				(error) =>
				{
					var str_err:string=error;
//console.log('erreur dans ChargerBloc:'+str_err);
					reject(str_err);
				})
			}
			catch(e)
			{
				this.m_ecran.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
			}
		});
//console.log('Bloc.ChargerBloc:fin de ChargerBloc');
		return promise;
	}
	AfficherBloc(RemplacerNomColParHeader:boolean, PourExcel:boolean ):string
	{
		var FormulaireOuGrille=this.m_type_bloc;
		var string_json:string;
		if(FormulaireOuGrille == "G")
		{
			string_json=this.DonnerStringJSon(RemplacerNomColParHeader,PourExcel);
//console.log('AfficherBloc: string_json='+string_json);
		}
		else
		{
			string_json=this.DonnerStringFormulaireJSon(RemplacerNomColParHeader,PourExcel);
		}
		return string_json;
	}
	CreerUneLigne():number
	{
		var id_cle_primaire=0;
		if(this.m_colonnes_sql===undefined)
		{
			this.m_ecran.MessageErreur("Il faut d'abord initialiser l'écran en faisant une recherche");
		}
		else
		{
			var num_col_cle_primaire=this.NumeroColonneSql(this.m_nom_cle_primaire);
//console.log('BlocService.CreerUneLigne: nom_cle_primaire='+this.m_nom_cle_primaire+', num_col_cle_primaire='+num_col_cle_primaire);
			var i:number;
			var j:number;
			// les lignes normales non modifiables ont des id_cle_primaire<-1111
			// les lignes nouvellement creees ont des id_cle_primaire compris entre -1 et -1110
			// on aura un probleme si on cree 1111 lignes en une seule fois...
			for(i=0;i<this.m_lignes.length;i++)
			{
				for(j=0;j<this.m_lignes[i].m_cellules.length;j++)
				{
					if(this.m_lignes[i].m_cellules[j].m_num_col==num_col_cle_primaire)
					{
						var id=this.m_lignes[i].m_cellules[j].m_val;
						if(id<id_cle_primaire &&id> -1111 )
							id_cle_primaire=id;
					}
				}
			}
			id_cle_primaire--;
//console.log('BlocService.CreerUneLigne: id_cle_primaire='+id_cle_primaire);
			var nb_cels:number=2;
			var cels:Cellule[]=new Array(nb_cels);
			var num_col_etat=this.NumeroColonneSql("etat");
			cels[0]=new Cellule(num_col_etat,"I");
			cels[1]=new Cellule(num_col_cle_primaire,id_cle_primaire);
			var lig:Ligne=new Ligne(cels);
//console.log(lig);
			var num_lig=this.m_lignes.push(lig);
			this.m_modif=true;
		}
		return id_cle_primaire;
	}
	Sauver()
	{
		var promise = new Promise((resolve, reject) =>
		{
			var nb_lignes_modif:number=0;
			var num_col_etat=this.NumeroColonneSql("etat");
			var i:number;
			var j:number;
			var k:number;
//console.log('BlocService.Sauver: nom_bloc='+this.m_nom_bloc+', nb_lignes='+this.m_lignes.length+', num_col_etat='+num_col_etat);
			for(i=0;i<this.m_lignes.length;i++)
			{
				var etat=this.ValCelluleParNum(i,num_col_etat);
//console.log('etat='+etat);
				if(etat=="U" ||etat == "D" || etat =="I")
					nb_lignes_modif++;
			}
//console.log('onglet: '+this.m_nom_bloc+', nb_lignes_modif='+nb_lignes_modif);
			if(nb_lignes_modif==0)
			{
				resolve('OK');
			}
			else
			{
				var nb_col_a_sauver:number=0;
				for(i=0;i<this.m_colonnes_sql.length;i++)
				{
					var nom_col="@"+this.m_colonnes_sql[i].m_nom_col+"@";
//console.log('BlocService.Sauver: colonne('+i+')='+nom_col);
					if(this.m_sql_update.includes(nom_col))
					{
//console.log('A sauver');
						nb_col_a_sauver++;
					}
				}
//console.log('nb_col_a_sauver='+nb_col_a_sauver);
				var cols:ColonneSql[]=new Array(nb_col_a_sauver);
				var num_col:number=0;
				for(i=0;i<this.m_colonnes_sql.length;i++)
				{
					var nom_col="@"+this.m_colonnes_sql[i].m_nom_col+"@";
					if(this.m_sql_update.includes(nom_col))
						cols[num_col++]=this.m_colonnes_sql[i];
				}
//console.log('colonnes à sauvegrader');
//console.log(cols);
				var lignes:Ligne[]=new Array(nb_lignes_modif);
				var num_lig:number=0;
				for(i=0;i<this.m_lignes.length;i++)
				{
					var etat=this.ValCelluleParNum(i,num_col_etat);
//console.log('ligne '+i+', etat='+etat);
					if(etat=="U" ||etat == "D" || etat == "I")
					{
//console.log('cellules de la ligne');
//console.log(this.m_lignes[i].m_cellules);
						var nb_cel:number=0;
						for(j=0;j<this.m_lignes[i].m_cellules.length;j++)
						{
							num_col=this.m_lignes[i].m_cellules[j].m_num_col;
							nom_col=this.m_colonnes_sql[num_col].m_nom_col;
//console.log('cell('+j+'): nom_col='+nom_col+', num_col='+num_col);
							for(k=0;k<cols.length;k++)
							{
								if(cols[k].m_nom_col==nom_col)
								{
									// la colonne fait partie des colonnes à sauver
									nb_cel++;
								}
							}
						}
						var cels:Cellule[]=new Array(nb_cel);
//console.log('nb_cels a sauver='+cels.length);
						var num_cel:number=0;
						for(j=0;j<this.m_lignes[i].m_cellules.length;j++)
						{
							num_col=this.m_lignes[i].m_cellules[j].m_num_col;
							nom_col=this.m_colonnes_sql[num_col].m_nom_col;
//console.log('cellule['+j+']: nom='+nom_col+', num_col='+num_col);
							for(k=0;k<cols.length;k++)
							{
								if(cols[k].m_nom_col==nom_col)
								{
//console.log('Sauvegarde: création cellule '+nom_col+' avec la valeur '+this.m_lignes[i].m_cellules[j].m_val);
									cels[num_cel++]=new Cellule(k,this.m_lignes[i].m_cellules[j].m_val);
								}
							}
						}
						lignes[num_lig++]=new Ligne(cels);
					}
				}
//console.log('il y a '+lignes.length+' lignes a sauver');
				var aj = new AccesJSon();
				var ab = new AccesBdService(this.httpClient);
console.log("AA0 bloc.ts fonction Sauver(): avant var string_json=aj.TranscrireEnJSonUneTable(cols,lignes) ; cols="+cols+" ;lignes="+lignes);
				var string_json=aj.TranscrireEnJSonUneTable(cols,lignes);
console.log("AA1 bloc.ts fonction Sauver(): après var string_json=aj.TranscrireEnJSonUneTable(cols,lignes) ; string_json='"+string_json+"'");
//				var sql:string=this.m_sql_update.replace(/@,@/g,",@");
//				sql=sql.substring(0,sql.length-1);
console.log("AAA bloc.ts fonction Sauver(): appel de EcrireTable: sql='"+this.m_sql_update+"' ; string_json='"+string_json+"'");
				ab.EcrireTable(this.m_sql_update,string_json)
				.then(res =>
				{
//console.log('apres then: num_onglet='+this.m_nom_bloc+', res='+res);
					var str_res:string=""+res;
					if(str_res.startsWith('Erreur'))
					{
						this.m_ecran.MessageErreur(str_res+'§sql§data§pile');
						reject(str_res);
					}
					else
					{
						this.m_modif=false;
						resolve('OK');
					}
//console.log('onglet['+this.m_num_onglet_actif+']: modif repasse a false');
				});
			}
		});
//console.log('Bloc.Sauver: fin');
		this.ReinitialiserCompteur();
		return promise;
	}
	ForcerValeurChamp(num_lig_ecran_modifiee,nom_col_modifiee:string,id_cle_primaire:number,val_col_new:any)
	{
		this.ModifValeurChamp(nom_col_modifiee,id_cle_primaire,val_col_new);
//console.log("Bloc.ForcerValeurChamp("+nom_col_modifiee+","+id_cle_primaire+","+val_col_new+")");
//console.log(this.gridApi);
//console.log(this.gridApi.rowModel);
//console.log(this.gridApi.rowModel.rowsToDisplay);
//console.log(this.gridApi.rowModel.rowsToDisplay[0].data);
//		this.gridApi.rowModel.rowsToDisplay[num_lig_modifiee].date[nom_col_modifiee]=val_col_new;
		const rowNode = this.gridApi.getRowNode(num_lig_ecran_modifiee);
		rowNode.setDataValue(nom_col_modifiee,val_col_new); //		this.gridApi.
	}
	/*
	ModifValeurChampParNumLig(nom_col_modifiee:string,num_lig_modifiee:number,val_col_new: any)
	{
//console.log('Bloc.ModifValeurChampParNumLig(nom_col_modifiee='+nom_col_modifiee+',num_lig_modifiee='+num_lig_modifiee+')');
		var num_col_sql=this.NumeroColonneSql(nom_col_modifiee);
//console.log('ModifValeurChamp: num_col_sql='+num_col_sql);
		var syntaxe_ok:boolean=true;
		switch(this.m_colonnes_sql[num_col_sql].m_type_col)
		{
			case TypeColSql.Date:
//console.log('colonne date: lg='+val_col_new.length+': '+val_col_new);
				if(val_col_new.length!=10 && val_col_new.length!=19)
					syntaxe_ok=false;
				else
				{
					var annee:number=+val_col_new.substring(0,4);
					var sep1:string=val_col_new.substring(4,5);
					var mois:number=+val_col_new.substring(5,7);
					var sep2:string=val_col_new.substring(7,8);
					var jour:number=+val_col_new.substring(8,10);
//console.log('annee='+annee+', sep1='+sep1+', mois='+mois+', sep2='+sep2+', jour='+jour);
					if(val_col_new.length==19)
					{
						var sep3:string=val_col_new.substring(10,11);
						var heure:number=+val_col_new.substring(11,13);
						var sep4:string=val_col_new.substring(13,14);
						var minute:number=+val_col_new.substring(14,16);
						var sep5:string=val_col_new.substring(16,17);
						var seconde:number=+val_col_new.substring(17,19);						
//console.log('LLLL1= annee='+annee+', sep1='+sep1+', mois='+mois+', sep2='+sep2+', jour='+jour+', sep3='+sep3+', heure='+heure+', sep4='+sep4+', minute='+minute+', sep5='+sep5+', seconde='+seconde);
					}
					if(mois<=0||mois>12||jour<=0||jour>31)
						syntaxe_ok=false;
				}
				break;
			case TypeColSql.Booleen:
				val_col_new=val_col_new?"1":"0";
				break;
		}
		if(syntaxe_ok)
		{
			this.m_modif=true;
			// mettre la colonne etat=U
			var num_col_u=this.NumeroColonneSql("etat");
			var etat=this.ValCelluleParNum(num_lig,num_col_u);
//console.log('etat de la ligne='+etat);
			if(etat===undefined ||etat =="")
			{
//console.log('ecrire etat U');
				this.EcrireVal(num_lig,num_col_u,"U");
			}
//console.log('num_col_modifiee='+num_col_modifiee+', id_cle_primaire='+id_cle_primaire);
//console.log('num_col_sql_modifiee='+num_col_sql_modifiee+', nouvelle valeur='+val_col_new+', id_cle_primaire='+id_cle_primaire);
			this.EcrireVal(num_lig,num_col_sql,val_col_new);
			this.m_ecran.ToucherBlocActif();
		}
		else
		{
			this.m_ecran.MessageErreur("Erreur: format incorrect");
		}
		this.ReinitialiserCompteur();
	}
	*/
	ModifValeurChamp(nom_col_modifiee:string,id_cle_primaire:number,val_col_new: any)
	{
console.log('BlocService.ModifValeurChamp(nom_col_modifiee='+nom_col_modifiee+',id_cle_primaire='+id_cle_primaire+')');
		if(id_cle_primaire<-1111)
		{
			this.m_ecran.MessageErreur('Ligne non modifiable');
		}
		else
		{
			var num_lig:number=this.NumLig(id_cle_primaire);
			
			var num_col_sql=this.NumeroColonneSql(nom_col_modifiee);
console.log('BlocService.ModifValeurChamp: num_lig='+num_lig+'num_col_sql='+num_col_sql);
console.log('et '+this.m_colonnes_sql[num_col_sql].m_type_col);
			var syntaxe_ok:boolean=true;
			switch(this.m_colonnes_sql[num_col_sql].m_type_col)
			{
				case TypeColSql.Date:
//console.log('colonne date: lg='+val_col_new.length+': '+val_col_new);
					if(val_col_new.length!=10 && val_col_new.length!=19)
						syntaxe_ok=false;
					else
					{
						var annee:number=+val_col_new.substring(0,4);
						var sep1:string=val_col_new.substring(4,5);
						var mois:number=+val_col_new.substring(5,7);
						var sep2:string=val_col_new.substring(7,8);
						var jour:number=+val_col_new.substring(8,10);
//console.log('annee='+annee+', sep1='+sep1+', mois='+mois+', sep2='+sep2+', jour='+jour);
						if(val_col_new.length==19)
						{
							var sep3:string=val_col_new.substring(10,11);
							var heure:number=+val_col_new.substring(11,13);
							var sep4:string=val_col_new.substring(13,14);
							var minute:number=+val_col_new.substring(14,16);
							var sep5:string=val_col_new.substring(16,17);
							var seconde:number=+val_col_new.substring(17,19);						
//console.log('LLLL1= annee='+annee+', sep1='+sep1+', mois='+mois+', sep2='+sep2+', jour='+jour+', sep3='+sep3+', heure='+heure+', sep4='+sep4+', minute='+minute+', sep5='+sep5+', seconde='+seconde);
						}
						if(mois<=0||mois>12||jour<=0||jour>31)
							syntaxe_ok=false;
					}
					break;
				case TypeColSql.Booleen:
					console.log('bool');
					val_col_new=val_col_new?"1":"0";
					break;
			}
			if(syntaxe_ok)
			{
				this.m_modif=true;
				// mettre la colonne etat=U
				var num_col_u=this.NumeroColonneSql("etat");
				var etat=this.ValCelluleParNum(num_lig,num_col_u);
console.log('etat de la ligne='+etat);
				if(etat===undefined ||etat =="")
				{
//console.log('ecrire etat U');
					this.EcrireVal(num_lig,num_col_u,"U");
				}
//console.log('num_col_modifiee='+num_col_modifiee+', id_cle_primaire='+id_cle_primaire);
//console.log('num_col_sql_modifiee='+num_col_sql_modifiee+', nouvelle valeur='+val_col_new+', id_cle_primaire='+id_cle_primaire);
				this.EcrireVal(num_lig,num_col_sql,val_col_new);
				this.m_ecran.ToucherBlocActif();
			}
			else
			{
				this.m_ecran.MessageErreur("Erreur: format incorrect");
			}
		}
		this.ReinitialiserCompteur();
	}
	async PersonnaliserCbo(id_cle_primaire:number,nom_col_cliquee:string)
	{
//console.log('Bloc.PersonnaliserCbo('+id_cle_primaire+','+nom_col_cliquee+')');
		var num_lig:number=this.NumLig(id_cle_primaire);
		var num_col:number=this.NumeroColonneEcran(nom_col_cliquee);
		var type_col=this.m_colonnes_ecran[num_col].m_type_col;
//console.log('onRowClickDetail: type_col='+type_col);
		switch(type_col)
		{
			case TypeColEcran.CleEtrangere:
				var req:string=this.m_ecran.RequeteCombobox(this.m_nom_bloc,num_lig,nom_col_cliquee);
				if(req==this.m_ecran.m_derniere_req_specifique)
					req="";
				else
					this.m_ecran.m_derniere_req_specifique=req;
//console.log('LigneSelectionnee: req='+req);
				if(req.length>0)
				{
					var fini:boolean=false;
					var cbo_tmp:Cbo=new Cbo(this.httpClient,nom_col_cliquee);
					cbo_tmp.GenererListe(req)
					.then(
					res=>
					{
/*
var i:number;
for(i=0;i<this.m_col_detail.length;i++)
{
	console.log('col_detail['+i+']='+this.m_col_detail[i].field+': classe='+this.m_col_detail[i].constructor.name);
}
*/
//							cols[j].Init(cbo_tmp.m_liste_items);
//						var num_coldef:number=-1;
						var i:number;
						for(i=0;i<this.m_coldefs.length;i++)
						{
//console.log('test coldef['+i+']: field='+this.m_coldefs[i].field);
							if(this.m_coldefs[i].field==nom_col_cliquee)
							{
//								num_coldef=i;
								const nom_table=nom_col_cliquee.substring(3);
								this.m_coldefs[i].cellEditorParams=new ParamsCbo(this.m_ecran, new CboListeItems(cbo_tmp.m_liste_items),nom_table);
								this.gridApi.setColumnDefs(this.m_coldefs);
//console.log('trouve:nb items='+cbo_tmp.m_liste_items.length);
//console.log('trouve:nb items bis='+this.m_coldefs[i].cellEditorParams.m_liste_items.length+', num cel='+i);
							}
						}
						fini=true;
//console.log('LigneSelectionnee: num_coldef='+num_coldef);
						/*
						var col=this.m_coldefs[num_coldef];
						col.cellEditorParams=new CboFiltre(cbo_tmp.m_liste_items);
						var nouvelle_col:ColumnCbo=new ColumnCbo(col.field,col.headerName,col.sortable,col.filter,col.hide,col.resizable,col.editable,col.width,col.cellClass,col.headerClass);
						nouvelle_col.cellEditorParams=new CboFiltre(cbo_tmp.m_liste_items);
//console.log('personnalisation de la combobox '+this.m_nom_col_detail_cliquee+': futur nb items='+cbo_tmp.m_liste_items.length+', num_col='+num_col);
//console.log('avant maj: nb_items='+col.cellEditorParams.m_options.length);
						this.m_coldefs[num_coldef]=nouvelle_col;
						*/
//console.log('classe de la coldef='+this.m_onglets[this.m_num_onglet_actif].m_coldefs[num_col].constructor.name);
//console.log(this.gridDetailColumnApi.constructor.name);
					}
					,err=>
					{
						this.m_ecran.MessageErreur(err+'§sql§data§pile');
						fini=true;
					});
					while(!fini)
					{
//console.log('attente');
						await this.delay(50);
					}
				}
				break;
		}
	}
	/*
	ForcerValeurChamp(id_cle_primaire:number,nom_col:string,val_col:any)
	{
		this.EcrireVal(num_lig:number,this.NumeroColonneSql(nom_col),val_col)
	}
	*/
	/*
	async LireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		var sep:string="|";
		var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
		var url_req: string=url+'LireTailleBlob.php?params='+params;
console.log('LireBlob:url_req='+url_req);
		this.httpClient.get(url_req, {responseType: 'text'} )
		.toPromise()
		.then
		(
			res =>
			{
				this.m_taille_blob= +res;
console.log('LireBlob: taille_blob='+this.m_taille_blob);
				this.m_buffer_blob=new Uint8Array(this.m_taille_blob);
				this.m_taille_bloc=10000;
				this.m_taille_lue=0;
				this.m_octet_debut=0;
				var fini:boolean=false;
				var etape_finie:boolean=true;
				while(!fini)
				{
					while(!etape_finie)
					{
						await this.delay(10);
					}
					etape_finie=false;
					var url_req2:string=url+'LirePartielBlob.php?params='+params+sep+this.m_octet_debut+sep+this.m_taille_bloc;
console.log('LireBlob:url_req2='+url_req2);
					this.httpClient.get(url_req2, {responseType: 'text'} )
					.toPromise()
					.then
					(
						res =>
						{
console.log('LireBlob: lire partiel fait');
							etape_finie=true;
							var retour_brut:string=res;
							var byteArrayTmp = new Uint8Array(atob(retour_brut).split('').map(char => char.charCodeAt(0)));
							this.m_buffer_blob.set(byteArrayTmp,this.m_octet_debut);
							this.m_octet_debut+=byteArrayTmp.length;
console.log('LireBlob: octet_debut='+this.m_octet_debut+', talle_blob='+this.m_taille_blob);
							if(this.m_octet_debut>=this.m_taille_blob)
							{
								fini=true;
							}
						},
						(error) =>
						{
console.log('LireBlob: erreur sur LirePartielBlob'+error.message);
							var msg_err:string='Erreur: ' + error.message;
							fini=true;
//								reject(msg_err);
						}
					)
				}
			},
			(error) =>
			{
				var msg_err:string='Erreur: ' + error.message;
//					reject(msg_err);
			}
		)
	}
	*/
	/*
	async LireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		var sep:string="|";
		var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
		var url_req: string=url+'LireTailleBlob.php?params='+params;
console.log('LireBlob:url_req='+url_req);
		this.m_taille_blob= 10000;
console.log('LireBlob: taille_blob='+this.m_taille_blob);
		this.m_buffer_blob=new Uint8Array(this.m_taille_blob);
		this.m_taille_bloc=10000;
		this.m_taille_lue=0;
		this.m_octet_debut=0;
		var fini:boolean=false;
		var etape_finie:boolean=true;
		while(!fini)
		{
			while(!etape_finie)
			{
				await this.delay(10);
			}
			etape_finie=false;
			var url_req2:string=url+'LirePartielBlob.php?params='+params+sep+this.m_octet_debut+sep+this.m_taille_bloc;
console.log('LireBlob:url_req2='+url_req2);
			this.httpClient.get(url_req2, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
console.log('LireBlob: lire partiel fait');
					etape_finie=true;
					var retour_brut:string=res;
					var byteArrayTmp = new Uint8Array(atob(retour_brut).split('').map(char => char.charCodeAt(0)));
					this.m_buffer_blob.set(byteArrayTmp,this.m_octet_debut);
					this.m_octet_debut+=byteArrayTmp.length;
console.log('LireBlob: octet_debut='+this.m_octet_debut+', talle_blob='+this.m_taille_blob);
					if(this.m_octet_debut>=this.m_taille_blob)
					{
						fini=true;
					}
				},
				(error) =>
				{
console.log('LireBlob: erreur sur LirePartielBlob'+error.message);
					var msg_err:string='Erreur: ' + error.message;
					fini=true;
//						reject(msg_err);
				}
			)
		}
	}
	*/
	ChargerBlocPourGenererSQL(req_sql: string,SuppColInvisibles: boolean,RemplacerNomColParHeader:boolean )
	{
		var promise = new Promise((resolve, reject) =>
		{
			try
			{
//console.log('AAA apres declaration promise: req='+req_sql);
//console.log('apres declaration promise: id_maitre='+this.m_id_maitre);
				var ab=new AccesBdService(this.httpClient);
				var i:number;
//console.log('CCCC Bloc.ChargerBloc('+req_sql+')');
				ab.LireTablePourGenererSQL(req_sql)
				.then(res =>
				{
					/* console.log("ARETOUR"+ab.m_retour_brut+" ;ret="+ab.m_json_decode);
					for(i=0;i<3;i++) {
						console.log("TEST"+i+"= "+ab.m_lignes[i]);
					} */
					/* var str_res:string=""+res;
					console.log("POUR SQL!!!="+str_res);
					var i:number;
					var j:number;
					var str_res:string=""+res;
					if(!str_res.startsWith("Erreur"))
					{
						this.m_colonnes_sql=new Array(ab.m_colonnes_sql.length);
						for(i=0;i<ab.m_colonnes_sql.length;i++)
						{
							this.m_colonnes_sql[i]=ab.m_colonnes_sql[i];
							for(j=0;j<this.m_colonnes_ecran.length;j++)
							{
								if(this.m_colonnes_ecran[j].m_nom_col==this.m_colonnes_sql[i].m_nom_col)
								{
									switch(this.m_colonnes_ecran[j].m_type_col)
									{
										case TypeColEcran.Date:
											if(this.m_colonnes_sql[i].m_type_col==TypeColSql.Chaine)
												this.m_colonnes_sql[i].m_type_col=TypeColSql.Date;
											break;
									}
								}
							}
						}
						const suffixe_date=" 00:00:00.000";
						this.m_lignes=new Array(ab.m_lignes.length);
						var num_col:number;
						for(i=0;i<ab.m_lignes.length;i++)
						{
							for(j=0;j<ab.m_lignes[i].m_cellules.length;j++)
							{
								num_col=ab.m_lignes[i].m_cellules[j].m_num_col;
								switch(this.m_colonnes_sql[num_col].m_type_col)
								{
									case TypeColSql.Date:
										var val_col=ab.m_lignes[i].m_cellules[j].m_val;
										if(val_col.endsWith(suffixe_date))
										ab.m_lignes[i].m_cellules[j].m_val=val_col.substring(0,val_col.length-suffixe_date.length);
										break;
								}
							}
							this.m_lignes[i]=ab.m_lignes[i];
						}
						resolve('OK');
					}
					else
					{
						reject(str_res);
					} */
				},
				(error) =>
				{
					var str_err:string=error;
					reject(str_err);
				})
			}
			catch(e)
			{
				this.m_ecran.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
			}
		});
		return promise;
	}
}
