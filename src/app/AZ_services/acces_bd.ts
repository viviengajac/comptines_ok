import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccesJSon } from '../AZ_services/json.service';
import { ColonneSql, Ligne, TypeColSql } from '../AZ_common/ecran.model';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { Ecran } from './ecran';

@Injectable()
export class AccesBdService
{
	m_retour_brut:string|undefined='';
	m_contenu_blob:string='';
	m_buffer_blob:any=null;	//Uint8Array;
	m_colonnes_sql:any=null;	// ColonneSql[];
	m_lignes:any=null;	// Ligne[];
	m_fini:boolean=false;
	m_etape_finie:boolean=false;
	m_octet_debut:number=0;
	m_taille_blob:number=0;
	m_taille_bloc:number=0;
	m_taille_lue:number=0;
	m_ecran:any=null;	//	Ecran;
	m_pourcent_telechargement:number=0;
	m_fin_telechargement:boolean=false;
//	url: string='https://bertrandgajac.hopto.org:9003/AccesBdPm/';
//	url: string='http://bertrandgajac.hopto.org/AccesBdPm/';
//	url: string='localhost/AccesBdPm/';
	lire_ensemble_de_tables='LireEnsembleDeTables.php?sql=';
	lire_blob='LireBlob.php?params=';
	lire_partiel_blob='LirePartielBlob.php?params=';
	lire_taille_blob='LireTailleBlob.php?params=';
	lire_une_valeur='LireUneValeur.php?sql=';
	ecrire_blob='EcrireBlob.php?params=';
	ecrire_table='EcrireTable.php?sql=';
	exec_sql='ExecSql.php?sql=';
	lire_taille_fic='LireTailleFic.php?params=';
	lire_partiel_fic='LirePartielFic.php?params=';
	lire_fic='LireFic.php?nom_fic=';
	constructor(private httpClient: HttpClient){}
	SpecifierEcran(ecran:Ecran)
	{
		this.m_ecran=ecran;
	}
	LireValeur(req:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_url_bd+GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var url_req: string=url+this.lire_une_valeur+req;
//console.log('LireValeur: url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_retour_brut = res;
//console.log('LireValeur: retour_brut='+this.m_retour_brut);
					resolve(res);
				},
				(error) =>
				{
//	console.log('Erreur: ' + error.message);
					reject(error.message);
				}
			)
		});
		return promise;
	}
	LireTable(req:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
//console.log('acces_bd.LireTable: url='+url);
		let promise = new Promise((resolve, reject) =>
		{
			if(url==null)
				reject('URL non défini');
			else
			{
				var url_req: string=url+this.lire_ensemble_de_tables+req;
//console.log('AccesBd.LireTable: url_req='+url_req);
				this.httpClient.get(url_req, {responseType: 'text'} )
				.toPromise()
				.then
				(
					res =>
					{
						var str_res:string=""+res;
						if(!str_res.startsWith('{t:'))
						{
							if(!str_res.startsWith('Erreur'))
							{
								str_res='Erreur: '+res;
							}
							reject(str_res);
						}
						else
						{
//console.log('AccesBd.LireTable: lecture faite: ' + res);
							var aj = new AccesJSon();
							var ret: string = aj.DecoderTableJSon(str_res);
							var nb_col=aj.m_colonnes_sql.length;
							this.m_colonnes_sql=new Array(nb_col);
							var i;
							for(i=0;i<nb_col;i++)
							{
								this.m_colonnes_sql[i]=new ColonneSql(aj.m_colonnes_sql[i].m_nom_col,aj.m_colonnes_sql[i].m_type_col);
							}
							var nb_lig=aj.m_lignes.length;
							this.m_lignes=new Array(nb_lig);
//console.log('AccesBd.LireTable: nb_lig=' + nb_lig);
//console.log(aj);
							for(i=0;i<nb_lig;i++)
							{
								this.m_lignes[i]=aj.m_lignes[i];
							}
							this.m_retour_brut = res;
//console.log('retour_brut='+this.m_retour_brut);
							resolve('OK');
						}
					},
					(error) =>
					{
						var msg_err:string='Erreur: ' + error;
//console.log("LireTable: ret en erreur: "+msg_err+'!!!')
						reject(msg_err);
					}
				)
			}
		});	
		return promise;
	}
	LireTailleBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
			var url_req: string=url+this.lire_taille_blob+params;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					if(res!=undefined)
					{
						this.m_taille_blob= +res;
						resolve('OK');
					}
					else
					{
						var msg_err:string='Erreur: taille du BLOB non définie';
						reject(msg_err);
					}
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	LirePartielBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string,octet_debut:number,taille_bloc:number)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic+sep+octet_debut+sep+taille_bloc;
			var url_req: string=url+this.lire_partiel_blob+params;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_retour_brut= res;
					resolve('OK');
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	delay(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
	/*
	async LireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
			var url_req: string=url+this.lire_taille_blob+params;
console.log('LireBlob:url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_taille_blob= +res;
					this.m_taille_blob= 100000;
console.log('LireBlob: taille_blob='+this.m_taille_blob);
					this.m_buffer_blob=new Uint8Array(this.m_taille_blob);
					this.m_taille_bloc=10000;
					this.m_taille_lue=0;
					this.m_octet_debut=0;
					this.m_fini=false;
					this.m_etape_finie=true;
					while(!this.m_fini)
					{
						while(!this.m_etape_finie)
						{
							await this.delay(10);
						}
						this.m_etape_finie=false;
						var url_req2:string=url+this.lire_partiel_blob+params+sep+this.m_octet_debut+sep+this.m_taille_bloc;
console.log('LireBlob:url_req2='+url_req2);
						this.httpClient.get(url_req2, {responseType: 'text'} )
						.toPromise()
						.then
						(
							res =>
							{
console.log('LireBlob: lire partiel fait');
								this.m_etape_finie=true;
								var retour_brut:string=res;
								var byteArrayTmp = new Uint8Array(atob(retour_brut).split('').map(char => char.charCodeAt(0)));
								this.m_buffer_blob.set(byteArrayTmp,this.m_octet_debut);
								this.m_octet_debut+=byteArrayTmp.length;
console.log('LireBlob: octet_debut='+this.m_octet_debut+', talle_blob='+this.m_taille_blob);
								if(this.m_octet_debut>=this.m_taille_blob)
								{
									this.m_fini=true;
								}
							},
							(error) =>
							{
console.log('LireBlob: erreur sur LirePartielBlob'+error.message);
								var msg_err:string='Erreur: ' + error.message;
								this.m_fini=true;
								reject(msg_err);
							}
						)
					}
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	*/
	/*
	LireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
			var url_req: string=url+this.lire_blob+params;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_retour_brut=res;
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	*/
	async LireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		var sep:string="|";
		var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
		var url_req: string=url+'LireTailleBlob.php?params='+params;
//console.log('LireBlob:url_req='+url_req);
		this.m_buffer_blob=new Uint8Array(this.m_taille_blob);
		this.m_taille_bloc=10000;
		this.m_taille_lue=0;
		this.m_octet_debut=0;
		this.m_pourcent_telechargement=0;
		this.m_fin_telechargement=false;
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
//console.log('LireBlob:url_req2='+url_req2);
			this.httpClient.get(url_req2, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
//console.log('LireBlob: lire partiel fait');
					etape_finie=true;
					this.m_retour_brut=res;
					if(this.m_retour_brut!=undefined)
					{
						var retour_brut:string=this.m_retour_brut;
//console.log('LireBlob: lire partiel fait 1');
						const byteArrayTmp = new Uint8Array(atob(retour_brut).split('').map(char => char.charCodeAt(0)));
//console.log('LireBlob: lire partiel fait 2');
						this.m_buffer_blob.set(byteArrayTmp,this.m_octet_debut);
//console.log('LireBlob: lire partiel fait 3');
						this.m_octet_debut+=byteArrayTmp.length;
						this.m_pourcent_telechargement=100.0*this.m_octet_debut/this.m_taille_blob;
//console.log('pourcent telechargement='+this.m_pourcent_telechargement);
//console.log(this.m_ecran);
						if(this.m_ecran!=null)
						{
							this.m_ecran.m_pourcent_telechargement=this.m_pourcent_telechargement;
						}
//console.log('LireBlob: octet_debut='+this.m_octet_debut+', talle_blob='+this.m_taille_blob);
						if(this.m_octet_debut>=this.m_taille_blob)
						{
							fini=true;
							this.m_fin_telechargement=true;
							if(this.m_ecran!=null)
							{
								this.m_ecran.m_fin_telechargement=true;
							}
						}
					}
				},
				(error) =>
				{
//console.log('LireBlob: erreur sur LirePartielBlob'+error.message);
					var msg_err:string='Erreur: ' + error.message;
					fini=true;
//						reject(msg_err);
				}
			)
		}
	}
	LireTailleFic(nom_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var url_req: string=url+this.lire_taille_fic+nom_fic;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					if(res != undefined)
					{
						this.m_taille_blob= +res;
//console.log('LireTailleFic('+nom_fic+')='+this.m_retour_brut);
						resolve('OK');
					}
					else
					{
						var msg_err:string='Erreur: taille de fichier non définie';
						reject(msg_err);
					}
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	/*
	LireFic(nom_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var url_req: string=url+this.lire_fic+nom_fic;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_retour_brut=res;
					resolve('OK');
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	*/
	LirePartielFic(nom_fic:string,octet_debut:number,taille_bloc:number)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=nom_fic+sep+octet_debut+sep+taille_bloc;
			var url_req: string=url+this.lire_partiel_fic+params;
//console.log('lireBlob: sql='+sql+', type_fic='+type_fic+', nom_fic='+nom_fic);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					this.m_retour_brut= res;
					resolve('OK');
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	async LireFic(nom_fic:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		var sep:string="|";
		var params=nom_fic;
//		var url_req: string=url+'LireTailleFic.php?params='+params;
//console.log('LireFic:url_req='+url_req);
		this.m_buffer_blob=new Uint8Array(this.m_taille_blob);
		this.m_taille_bloc=10000;
		this.m_taille_lue=0;
		this.m_octet_debut=0;
		this.m_pourcent_telechargement=0;
		this.m_fin_telechargement=false;
		var fini:boolean=false;
		var etape_finie:boolean=true;
		while(!fini)
		{
			while(!etape_finie)
			{
				await this.delay(10);
			}
			etape_finie=false;
			var url_req2:string=url+'LirePartielFic.php?params='+params+sep+this.m_octet_debut+sep+this.m_taille_bloc;
//console.log('LireFic:url_req2='+url_req2);
			this.httpClient.get(url_req2, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
//console.log('LireFic: lire partiel fait');
					etape_finie=true;
					this.m_retour_brut=res;
//console.log('LireFic: lire partiel fait 1');
//console.log(this.m_retour_brut);
					if(this.m_retour_brut!=undefined)
					{
						var retour_brut:string=this.m_retour_brut;
						const byteArrayTmp = new Uint8Array(atob(retour_brut).split('').map(char => char.charCodeAt(0)));
//console.log('LireFic: lire partiel fait 2');
						this.m_buffer_blob.set(byteArrayTmp,this.m_octet_debut);
//console.log('LireFic: lire partiel fait 3');
						this.m_octet_debut+=byteArrayTmp.length;
//console.log('LireFic: lire partiel fait 4');
						this.m_pourcent_telechargement=100.0*this.m_octet_debut/this.m_taille_blob;
//console.log('pourcent telechargement='+this.m_pourcent_telechargement);
//console.log(this.m_ecran);
						if(this.m_ecran!=null)
						{
							this.m_ecran.m_pourcent_telechargement=this.m_pourcent_telechargement;
						}
//console.log('LireFic: octet_debut='+this.m_octet_debut+', talle_blob='+this.m_taille_blob);
						if(this.m_octet_debut>=this.m_taille_blob)
						{
							fini=true;
							this.m_fin_telechargement=true;
							if(this.m_ecran!=null)
							{
								this.m_ecran.m_fin_telechargement=true;
							}
						}
					}
				},
				(error) =>
				{
//console.log('LireFic: erreur sur LirePartielFic'+error.message);
					var msg_err:string='Erreur: ' + error.message;
					fini=true;
//						reject(msg_err);
				}
			)
		}
	}
	EcrireBlob(db_ou_fs:string,nom_table:string,id_doc:number,type_fic:string, contenu: string |ArrayBuffer)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=db_ou_fs+sep+nom_table+sep+id_doc+sep+type_fic;
			var url_req: string=url+this.ecrire_blob+params;
//console.log('EcrireBlob: sql='+url_req);
//console.log('EcrireBlob: contenu=[[['+contenu+']]]');
//console.log('EcrireBlob: url_req='+url_req);
			this.httpClient.post(url_req, contenu , {responseType: 'text'})
			.toPromise()
			.then
			(
				res =>
				{
//console.log('EcrireBlob: retour normal='+res);
					resolve(""+res);

				},
				(error) =>
				{
//console.log('EcrireBlob: retour en erreur='+error.message);
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	EcrireTable(sql:string, contenu: string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var url_req: string=url+this.ecrire_table+sql;
console.log('EcrireTable: url_req='+url_req);
console.log('EcrireTable: contenu=[[['+contenu+']]]');
			this.httpClient.post(url_req, contenu , {responseType: 'text'})
			.toPromise()
			.then
			(
				res =>
				{
//console.log('EcrireTable: retour de http='+res);
					var str_res:string=""+res;
console.log('EcrireTable: retour de http='+str_res);
					if(!str_res.startsWith('Erreur'))
					{
						resolve('OK');
					}
					else
					{
						resolve(str_res);
					}
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
console.log('Erreur='+msg_err);
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	ExecSql(sql:string)
	{
//		if(GlobalConstantes.m_serveur_bd.length>0)this.url=GlobalConstantes.m_serveur_bd;
		const url=GlobalConstantes.FaireUrl();
		let promise = new Promise((resolve, reject) =>
		{
			var url_req: string=url+this.exec_sql+sql;
//console.log('EcrireTable: url_req='+url_req);
//console.log('EcrireTable: contenu=[[['+contenu+']]]');
			this.httpClient.post(url_req, null,{responseType: 'text'})
			.toPromise()
			.then
			(
				res =>
				{
//console.log('EcrireTable: retour de http='+res);
					var str_res:string=""+res;
					if(!str_res.startsWith('Erreur'))
					{
						resolve('OK');
					}
					else
					{
						resolve(str_res);
					}
				},
				(error) =>
				{
					var msg_err:string='Erreur: ' + error.message;
					reject(msg_err);
				}
			)
		});
		return promise;
	}
	DonnerTypeMime(type_fic:string)
	{
//console.log('type_fic='+type_fic);
		var type_mime: string="";
		switch(type_fic)
		{
			case '.bmp':
				type_mime="image/bmp";
				break;
			case '.csv':
				type_mime="text/csv";
				break;
			case '.doc':
				type_mime="application/msword";
				break;
			case '.docx':
				type_mime="application/vndopenxmlformats-officedocument.wordprocessingml.document";
				break;
			case '.gif':
				type_mime="image/gif";
				break;
			case '.htm':
			case '.html':
				type_mime="text/html";
				break;
			case '.jpeg':
			case '.jpg':
				type_mime="image/jpeg";
				break;
			case '.mp3':
				type_mime="audio/mpeg";
				break;
			case '.pdf':
				type_mime="application/pdf";
				break;
			case '.txt':
				type_mime="text/txt";
				break;
			case '.xls':
			case '.xlsx':
				type_mime="application/vnd.ms-excel";
				break;
			case ".fdc":
				type_mime="application/octet-stream";
				break;
			default:
				break;
		}
		return type_mime;
	}
	/*
	uploadAndProgress(files: File[])
	{
		console.log(files)
		var formData = new FormData();
		Array.from(files).forEach(f => formData.append('file',f))
		this.httpClient.post('https://file.io', formData, {reportProgress: true, observe: 'events'})
		.subscribe(event =>
		{
			if (event.type === HttpEventType.UploadProgress)
			{
				this.percentDone = Math.round(100 * event.loaded / event.total);
			}
			else if (event instanceof HttpResponse)
			{
				this.uploadSuccess = true;
			}
		});
	}
	*/
	ValCelluleParNom(num_lig:number,nom_col_sql:string)
	{
		var num_col_sql:number=this.NumeroColonneSql(nom_col_sql);
		return this.ValCelluleParNum(num_lig,num_col_sql);
	}
	ValCelluleParNum(num_lig:number,num_col_sql:number)
	{
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
	}
	NumeroColonneSql(nom_col_sql: string)
	{
		var i:number;
		var num_col:number=-1;
//console.log('Bloc.NumeroColonneSql: nom_col cherchée='+nom_col);
//console.log(this.m_colonnes_sql);
		for(i=0;i<this.m_colonnes_sql.length;i++)
		{
//console.log('NumeroColonneSql: colonne_sql['+i+']='+this.m_colonnes_sql[i].m_nom_col);
			if(this.m_colonnes_sql[i].m_nom_col==nom_col_sql)
				num_col=i;
		}
//console.log('NumeroColonneSql('+nom_col+')='+num_col);
		return num_col;
	}
}
