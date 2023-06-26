//import { stringify } from '@angular/compiler/src/util';
import { TypeColEcran,ColDef, Cellule, Ligne,ColonneEcran,ColonneSql } from '../AZ_common/ecran.model';
/*
export class CellRendererParams
{
	constructor(public onClick:(e: any)=>string,public label: string){}
}

export class ColDefBtnVoirDoc implements ColDef
{
//	constructor(public field: string, public sortable: boolean, public filter: boolean, public hide: boolean, public headerName: string,public cellRenderer: string,public cellRendererParams:string)
	constructor(public field: string, public sortable: boolean, public filter: boolean, public hide: boolean, public headerName: string,public resizable:boolean=true,public cellRenderer: string, public cellRendererParams: CellRendererParams)
	{
	}
}
export class ColDefBtnDefDoc implements ColDef
{
//	constructor(public field: string, public sortable: boolean, public filter: boolean, public hide: boolean, public headerName: string,public cellRenderer: string,public cellRendererParams:string)
	constructor(public field: string, public sortable: boolean, public filter: boolean, public hide: boolean, public headerName: string,public resizable:boolean=true,public cellRenderer: string, public cellRendererParams: CellRendererParams)
	{
	}
}
*/
export class AccesJSon
{
	private m_start_object: string='{';
	private m_end_object: string="}";
	private m_start_array: string="[";
	private m_end_array: string="]";
	m_colonnes_sql: ColonneSql[]=new Array(0);
	m_nb_val: number=0;
	m_tab_val: any[]=new Array(0);
	m_nb_lig: number=0;
	m_lignes: Ligne[]=new Array(0);
	m_type_cnx: string='';
	m_tampon: string='';
	m_string_json: string='';
	m_tab_json:any[]=new Array(0);

	SpecifierTypeCnx(type_cnx: string)
	{
		this.m_type_cnx=type_cnx;
	}
	WriteStartObject()
	{
		this.m_tampon += this.m_start_object;
	}
	WriteEndObject()
	{
		this.m_tampon += this.m_end_object;
	}
	WritePropertyName(nom_prop: string)
	{
		this.m_tampon += nom_prop + ":";
	}
	WritePropertyNumber(nom_prop: string)
	{
		this.m_tampon += nom_prop + ":";
	}
	WriteValue(val: string)
	{
		this.m_tampon += val;
	}
	WriteStartArray()
	{
		this.m_tampon += this.m_start_array;
	}
	WriteEndArray()
	{
		this.m_tampon += this.m_end_array;
	}
	WriteSeparateurLigCol()
	{
		this.m_tampon+=",";
	}
	TranscrireEnJSonUneTable(cols: ColonneSql[],ligs:Ligne[])
	{
//Tracer("debut objet liste de tables");
		this.m_tampon="";
		this.WriteStartObject();
//Tracer("propriete tables");
		this.WritePropertyName("t");
		this.WriteValue("1");
		this.WriteStartArray();
		var num_table:number;
		var i:number;
		var j:number;
		for(num_table=0;num_table<1;num_table++)
		{
//Tracer("debut objet table");
			this.WriteStartObject();
//Tracer("propriete colonnes");
//T(")debut tableau colonnes(");
			var nb_col:number=cols.length;
			this.WritePropertyName("c");
			this.WriteValue(""+nb_col);
//				$this->WriteValue($nb_col);
			this.WriteStartArray();
//Tracer("nb_col=$nb_col");
			for (i=0;i<nb_col;i++)
			{
//T(")debut objet colonne(");
				this.WriteStartObject();
//T(")propriete nom de colonne(");
				this.WritePropertyName(cols[i].m_nom_col);
				this.WriteValue(""+cols[i].m_type_col);
//					$this->WriteValue($type_col_int);
//T(")fin objet colonne(");
				this.WriteEndObject();
			}
//T(")fin tableau colonnes(");
			this.WriteEndArray();
//				print ",";
			this.WriteSeparateurLigCol();
//T(")propriete lignes(");
//T(")debut tableau des lignes(");
			var nb_lig:number=ligs.length;
			this.WritePropertyName("l");
			this.WriteValue(""+nb_lig);
//				$this->WriteValue($nb_lig);
			this.WriteStartArray();
//Tracer("nb_lig=($nb_lig)");
			for(i=0;i<ligs.length;i++)
			{
//T(")debut objet ligne(");
				this.WriteStartObject();
//T(")propriete statut(");
				this.WritePropertyName("v");
				this.WriteValue(""+ligs[i].m_cellules.length);
//T(")debut tableau des valeurs(");
//						$this->WritePropertyByName("v","%nb_cel%");
				this.WriteStartArray();
				for(j=0;j<ligs[i].m_cellules.length;j++)
				{
					this.WriteStartObject();
					this.WritePropertyName(""+ligs[i].m_cellules[j].m_num_col);
					var val=ligs[i].m_cellules[j].m_val;
					var val_format=val;
					// formatage de la cellule
					switch(cols[ligs[i].m_cellules[j].m_num_col].m_type_col)
					{
						case 3:
//console.log('cellule date: val avant format='+val);
							if(val.length==10)
								val_format=val.substring(0,4)+val.substring(5,7)+val.substring(8);
							else if (val.length==19)	//cas date heure (AAAA-MM-DDThh:mm:ss)
								val_format=val.substring(0,4)+val.substring(5,7)+val.substring(8,10)+val.substring(11,13)+val.substring(14,16)+val.substring(17,19);
							else	//cas où la cellule n'a pas été éditée; val reste déjà formaté 
								val_format=val;								
//console.log('MMMM2= cellule date: val apres format='+val_format);
							break;
					}
					this.WriteValue(val_format);
//console.log('TranscrireEnJSonUneTable: écriture cellule: numero de colonne='+ligs[i].m_cellules[j].m_num_col+', valeur='+val_format);
					this.WriteEndObject();
				}
//T(")fin tableau des valeurs(");
				this.WriteEndArray();
//T(")fin objet ligne(");
				this.WriteEndObject();
			}
//T(")fin tableau des lignes(");
			this.WriteEndArray();
//T(")fin objet table(");
			this.WriteEndObject();
		}
		this.WriteEndArray();
		this.WriteEndObject();
		return this.m_tampon;
	}
	m_tampon_bd: string='';
	m_ind: number=0;
	MessageException(msg: string): string
	{
		var msg_err='Erreur: ' + msg + " à l'indice " + this.m_ind;
//		console.log (msg_err);
		return msg_err;
	}
		
	LireNomPropriete(): string
	{
		var fini: number;
		var nom_prop: string;
		fini=0;
		nom_prop="";
		while(fini==0)
		{
			if(this.m_tampon_bd[this.m_ind]==":")
				fini=1;
			else
			{
				nom_prop+=this.m_tampon_bd[this.m_ind];
			}
			this.m_ind++;
		}
		return nom_prop;
	}
	LireValPropriete(): string
	{
		var fini: number;
		var val_prop: string;
		fini=0;
		val_prop="";
		while(fini==0)
		{
			if(this.m_tampon_bd[this.m_ind]=="}")
				fini=1;
			else
			{
				if (this.m_tampon_bd[this.m_ind] == "\t")
					val_prop+= " ";
				else
					val_prop+=this.m_tampon_bd[this.m_ind];
				this.m_ind++;
			}
		}
		return val_prop;
	}
		
	LireEntier(): number
	{
		var fini_entier=0;
		var val_entier=0;
		var c: string;
//Tracer("debut LireEntier");
		while(fini_entier==0)
		{
			c=this.m_tampon_bd[this.m_ind];
//Tracer("c=($c)");
			if(c == '0' || c == '1' || c == '2' || c == '3' || c == '4' || c == '5' || c == '6' || c == '7' || c == '8' || c == '9')
			{
//Tracer("val_entier 1=($val_entier)");
				val_entier*=10;
//Tracer("val_entier 2=($val_entier)");
				val_entier+= +c;
//Tracer("val_entier 3=($val_entier)");
				this.m_ind++;
			}
			else
				fini_entier=1;
		}
//Tracer("retour de LireEntier: val_entier=($val_entier)");
		return val_entier;
	}
	Tabd(ind: number): string
	{
		return this.m_tampon_bd.substring(this.m_ind,this.m_ind+1);
	}
	DecoderTableJSon(donnees:string):string
	{
		var nom_prop: string;
		var fini_tables: number;
		var fini_col: number;
		var nom_col: string;
		var type_col: number;
		var fini_lig: number;
		var une_ligne: Ligne;
		var fini_col_lig: number;
		var num_col: number;
		var val_col: string;
		var une_cellule: Cellule;
		var nb_tab: number;
		var nb_col: number;
		var num_col: number;
		var nb_lig: number;
		var ind_lig: number;
console.log("JSON.Debut de DecoderTableJSon("+donnees+")");
//			this.m_tab_nom_col=new Array(0);
		this.m_nb_val=0;
		this.m_tab_val=new Array(0);
		this.m_tampon_bd=donnees;	//str_split(donnees);
		this.m_ind=0;
		var c=this.m_tampon_bd[this.m_ind];
//			Tracer("c=".$c);
		if(this.Tabd(this.m_ind)!=this.m_start_object)
			return this.MessageException("DecoderTableJSon: Pas de caractère de début");
		this.m_ind++;
		nom_prop=this.LireNomPropriete();
		if(nom_prop!="t")
			return this.MessageException("DecoderTableJSon: Pas de propriété tables ('t')");
		nb_tab=this.LireEntier();
		if(this.Tabd(this.m_ind)!=this.m_start_array)
			return this.MessageException("DecoderTableJSon: Pas de début du tableau des tables");
		this.m_ind++;
		fini_tables=0;
		while(fini_tables==0)
		{
			if(this.Tabd(this.m_ind)==this.m_end_array)
			{
				//plus de table a decoder
				fini_tables=1;
			}
			else
			{
//Tracer("Debut de table");
				if(this.Tabd(this.m_ind)!=this.m_start_object)
					return this.MessageException("DecoderTableJSon: Pas de caractère de début de table");
				this.m_ind++;
				nom_prop=this.LireNomPropriete();
//Tracer("nom_prop=".$nom_prop);
				if(nom_prop!="c")
					return this.MessageException("DecoderTableJSon: Pas de propriété colonnes d'une table ('c')");
				nb_col=this.LireEntier();
				if(this.Tabd(this.m_ind)!=this.m_start_array)
					return this.MessageException("DecoderTableJSon: Pas de début du tableau des colonnes");
				this.m_ind++;
				this.m_colonnes_sql=new Array(nb_col);
				fini_col=0;
				num_col=0;
				while(fini_col==0)
				{
					if(this.Tabd(this.m_ind)==this.m_end_array)
					{
						//plus de colonne a decoder
						fini_col=1;
					}
					else
					{
						if(this.Tabd(this.m_ind)!=this.m_start_object)
							return this.MessageException("DecoderTableJSon: Pas de caractère de début de colonne");
						this.m_ind++;
						nom_col=this.LireNomPropriete();
//						this.m_tab_nom_col[this.m_nb_col]=nom_col;
						type_col=this.LireEntier();
//						this.m_tab_type_col[this.m_nb_col]=type_col;
						this.m_colonnes_sql[num_col]=new ColonneSql(nom_col,type_col);
//console.log('dans DecoderTableJSon: tab_nom_col['+this.m_nb_col+']='+this.m_tab_nom_col[this.m_nb_col]);
						num_col++;
						if(this.Tabd(this.m_ind)!=this.m_end_object)
							return this.MessageException("DecoderTableJSon: Pas de caractère de fin de colonne");
						this.m_ind++;
					}
				}
				if(this.Tabd(this.m_ind)!=this.m_end_array)
					return this.MessageException("DecoderTableJSon: Pas de fin du tableau des colonnes");
				this.m_ind++;
//Tracer("fin des colonnes");
				if(this.Tabd(this.m_ind)!=",")
					return this.MessageException("DecoderTableJSon: Pas de séparateur :");
				this.m_ind++;
				nom_prop=this.LireNomPropriete();
//Tracer("nom_prop=".$nom_prop);
				if(nom_prop!="l")
					return this.MessageException("DecoderTableJSon: Pas de propriété lignes d'une table ('l')");
				this.m_nb_lig=this.LireEntier();
//				console.log('nb_lig lu='+this.m_nb_lig);
				if(this.Tabd(this.m_ind)!=this.m_start_array)
					return this.MessageException("DecoderTableJSon: Pas de début du tableau des lignes");
				this.m_ind++;
//console.log("Debut des lignes");
				fini_lig=0;
				ind_lig=0;
				this.m_lignes=new Array(this.m_nb_lig);
				while(fini_lig==0)
				{
//console.log('ind_lig='+ind_lig);
					if(this.Tabd(this.m_ind)==this.m_end_array)
					{
						//plus de ligne a decoder
//console.log('end_array => fin des lignes');
						fini_lig=1;
					}
					else
					{
//						une_ligne=new Ligne();
//console.log('nouvelle ligne');
						if(this.Tabd(this.m_ind)!=this.m_start_object)
							return this.MessageException("DecoderTableJSon: Pas de caractère de début de ligne");
//console.log('1');
						this.m_ind++;
//console.log('2');
						nom_prop=this.LireNomPropriete();
//console.log('3');
//Tracer("nom_prop=".$nom_prop);
						if(nom_prop!="v")
							return this.MessageException("DecoderTableJSon: Pas de propriété cellules d'une ligne d'une table ('v')");
//console.log('4');
						var nb_cel=this.LireEntier();
//console.log('nb_cel='+nb_cel);
						var tab_cellules:Cellule[]=new Array(nb_cel);
//Tracer("Debut d'une ligne: ind=".$this->ind);
						if(this.Tabd(this.m_ind)!=this.m_start_array)
							return this.MessageException("DecoderTableJSon: Pas de caractère de début du tableau des valeurs de la ligne");
						this.m_ind++;
//						console.log('nb_col='+nb_col);
//							this.m_tab_cellules=new Array(nb_col);
						fini_col_lig=0;
						var num_cel:number=0;
						while(fini_col_lig==0)
						{
//console.log('num_cel='+num_cel);
							if(this.Tabd(this.m_ind)==this.m_end_array)
							{
								//plus de colonne a decoder pour cette ligne
								fini_col_lig=1;
							}
							else
							{
//Tracer("Debut d'une valeur de ligne: ind=".$this->ind);
								if(this.Tabd(this.m_ind)!=this.m_start_object)
									return this.MessageException("DecoderTableJSon: Pas de caractère de début d'une valeur de la ligne");
								this.m_ind++;
//Tracer("Avant LireEntier: ind=".$this->ind);
								num_col=this.LireEntier();
//Tracer("Apres LireEntier: ind=".$this->ind.", num_col=".$num_col);
								if(this.Tabd(this.m_ind)!=":")
									return this.MessageException("DecoderTableJSon: Pas de séparateur entre numéro de colonne et valeur");
								this.m_ind++;
//Tracer("Avant LirePropriete: ind=".$this->ind);
								val_col=this.LireValPropriete();
//Tracer("Apres LirePropriete: ind=".$this->ind.", val_col=".$val_col);
								if(this.Tabd(this.m_ind)!=this.m_end_object)
									return this.MessageException("DecoderTableJSon: Pas de caractère de fin d'une valeur de la ligne");
								this.m_ind++;
//								une_cellule=new Cellule(num_col,val_col);
//								une_cellule.m_num_col=num_col;
//								une_cellule.m_val_col=val_col;
//									$une_ligne->m_cellules[$une_ligne->m_nb_cellules]=$une_cellule;
//									$une_ligne->m_nb_cellules++;
//console.log('nouvelle cellule('+num_col+','+val_col+')');
								tab_cellules[num_cel++]=new Cellule(num_col,val_col);
//Tracer("Fin d'une valeur de ligne: ind=".$this->ind);
							}
						}
						if(this.Tabd(this.m_ind)!=this.m_end_array)
							return this.MessageException("DecoderTableJSon: Pas de caractère de fin du tableau des valeurs de la ligne");
						this.m_ind++;
						if(this.Tabd(this.m_ind)!=this.m_end_object)
							return this.MessageException("DecoderTableJSon: Pas de caractère de fin de ligne");
						this.m_ind++;
//console.log("ajout d'une nouvelle ligne");
						this.m_lignes[ind_lig]=new Ligne(tab_cellules);
						ind_lig++;
					}
				}
				if(this.Tabd(this.m_ind)!=this.m_end_array)
					return this.MessageException("DecoderTableJSon: Pas de fin du tableau des lignes");
				this.m_ind++;
				if(this.Tabd(this.m_ind)!=this.m_end_object)
					return this.MessageException("DecoderTableJSon: Pas de fin d'une table");
				this.m_ind++;
			}
		}
		if(this.Tabd(this.m_ind)!=this.m_end_array)
			return this.MessageException("DecoderTableJSon: Pas de fin du tableau des tables");
		this.m_ind++;
		if(this.Tabd(this.m_ind)!=this.m_end_object)
			return this.MessageException("DecoderTableJSon: Pas de caractère de fin");
		return 'OK';
	}
	// types de colonnes venant du serveur
	//	1:	entier
	//	2: varchar
	//	3: date
	//	4: booleen
	FormaterValeur(type_col:TypeColEcran,val_col:any):string
	{
		var val_format:string='';
		switch(type_col)
		{
			case TypeColEcran.ClePrimaire:
				val_format=val_col;
				break;
			case TypeColEcran.Chaine:
//console.log('nom_col_ecran='+nom_col_ecran+', val_col='+val_col);
				val_format='"'+val_col.replace(/"/g,"\\\"")+'"';
				break;
			case TypeColEcran.Entier:
			case TypeColEcran.Flottant:
				val_format=val_col;
				break;
			case TypeColEcran.CleEtrangere:
				val_format=val_col;
				break;
			case TypeColEcran.Date:
//console.log('JSon.FormaterValeur(Date): val_col='+val_col);
				if(val_col.length==8)
				{
//console.log('champ date:'+val_col);
					var annee=val_col.substring(0,4);
					var mois=val_col.substring(4,6);
					var jour=val_col.substring(6);
//											val_col="\""+annee+"-"+mois+"-"+jour+"T00:00:00.000Z\"";
					val_col='"'+annee+'-'+mois+'-'+jour+'"';
				}
				else if (val_col.length==10)
				{
					val_col="\""+val_col+"\"";
				}
				val_format=val_col;
				break;
			case TypeColEcran.DateHeure:
//console.log("UUUU555= longueur= "+val_col.length+" ; val_col="+val_col);
//console.log('JSon.FormaterValeur(DateHeure): val_col='+val_col);
				var annee=val_col.substring(0,4);
				var mois=val_col.substring(4,6);
				var jour=val_col.substring(6,8);
				var heure:any="00";
				var minute:any="00";
				var seconde:any="00";
				if(val_col.length>=10)
					var heure=val_col.substring(8,10);
				if(val_col.length>=12)
					var minute=val_col.substring(10,12);
				if(val_col.length>=14)
					var seconde=val_col.substring(12,14);				
				val_col='"'+annee+'-'+mois+'-'+jour+'T'+heure+':'+minute+':'+seconde+'"';
//console.log("UUUU888 val_col="+val_col);
				val_format=val_col;
				break;
			case TypeColEcran.Booleen:
				val_format=val_col;
				break;
			case TypeColEcran.VoirDocDb:
			case TypeColEcran.DefDocDb:
			case TypeColEcran.VoirDocFs:
			case TypeColEcran.DefDocFs:
				val_format=val_col;
				break;
		}
		return val_format;
	}
	DonnerStringJSon(tab_cols_ecran: ColonneEcran[],tab_cols_sql: ColonneSql[],tab_ligs:Ligne[], remplacer_nom_col_par_header: boolean, pour_excel:boolean): string
	{
		var nb_lig: number;
		var i:number;
		var j:number;
		var k:number;
		var nb_cel:number;
		var trouve:boolean;
		var nom_col_ecran: string;
		var num_col_sql:number;
		var type_col: number;
		var val_col: string;
//		var invisible: boolean;
		var header: string;
		var nb_col_ecran:number;
		var nb_col_sql:number;
		var num_col_sql_etat:number= -1;
		var ligne_supprimee:boolean;
		var a_inserer:boolean;
		if(tab_cols_sql===undefined)
			return "";
		nb_lig=tab_ligs.length;
		nb_col_ecran=tab_cols_ecran.length;
		nb_col_sql=tab_cols_sql.length;
//console.log('JSon.DonnerStringJson: nb_cols_ecran='+nb_col_ecran+', nb_col_sql='+nb_col_sql+', nb_lig='+nb_lig);
		for(i=0;i<nb_col_sql;i++)
		{
			if(tab_cols_sql[i].m_nom_col=="etat")
			{
				num_col_sql_etat=i;
			}
		}
//console.log('debut de donnerstringjson: supp_col_invisibles='+supp_col_invisibles+', remplacer_nom_col='+remplacer_nom_col_par_header+', nb_col='+nb_col+', nb_lig='+nb_lig);
// console.log('lg de tab_cols='+tab_cols.length);
//		   this.m_tab_prs=new Array(nb_lig);
//		   this.m_tab_lig=new Array(nb_lig);
		this.m_string_json="[";
		this.m_tab_json=new Array(0);
		var debut:boolean=true;
//console.log('tableau des colonnes SQL');
//console.log(tab_cols_sql);
//console.log('tableau des lignes');
//console.log(tab_ligs);
		for(i=0;i<nb_lig;i++)
		{
//console.log('***********************lig['+i+']: ');
			nb_cel=tab_ligs[i].m_cellules.length;
			ligne_supprimee=false;
			for(j=0;j<nb_cel;j++)
			{
				if(tab_ligs[i].m_cellules[j].m_num_col==num_col_sql_etat)
				{
					if(tab_ligs[i].m_cellules[j].m_val=="D")
					{
					   ligne_supprimee=true;
					}
				}
			}
//console.log('ligne['+i+']: supprimee='+ligne_supprimee);
			if(!ligne_supprimee)
			{
				if(!debut)
					this.m_string_json+=",";
				else
					debut=false;
				this.m_string_json+="{";
				var debut_ligne: boolean=true;
				for(j=0;j<nb_col_ecran;j++)
				{
					var trouve:boolean=false;
					nom_col_ecran=tab_cols_ecran[j].m_nom_col;
					type_col=tab_cols_ecran[j].m_type_col;
//console.log('json.DonnerStringJSon avant utilisation de m_inser_ecran');
					if(pour_excel)
						a_inserer=tab_cols_ecran[j].m_inser_excel;
					else
					{
//console.log('j='+j);
//console.log(tab_cols_ecran[j]);
						a_inserer=tab_cols_ecran[j].m_inser_ecran;
//console.log('json.DonnerStringJSon apres utilisation de m_inser_ecran');
					}
					header=tab_cols_ecran[j].m_lib_col;
					num_col_sql=-1;
//console.log('col('+j+')='+nom_col_ecran);
					if(a_inserer)
					{
						for(k=0;k<nb_col_sql;k++)
						{
//console('colonne SQL numero'+k);
//console.log('nom dans tab_col['+k+']='+tab_cols[k].m_nom_col+' et header='+tab_cols[k].m_lib_col);
							if(nom_col_ecran==tab_cols_sql[k].m_nom_col)
							{
								num_col_sql=k;
							}
						}
//console.log("j="+j+",num_col_sql="+num_col_sql);
//if(supp_col_invisibles)
//console.log('col['+j+']='+nom_col+', invisible='+invisible);
//invisible=false;
						if(!debut_ligne)
							this.m_string_json+=",";
						else
							debut_ligne=false;
//console.log('recherche de la colonne '+nom_col_ecran+', num_col_sql='+num_col_sql);
						for(k=0;k<nb_cel;k++)
						{
							if(tab_ligs[i].m_cellules[k].m_num_col == num_col_sql)
							{
								trouve=true;
								val_col=tab_ligs[i].m_cellules[k].m_val;
								if(remplacer_nom_col_par_header)
									this.m_string_json+='"'+header+'":';
								else
									this.m_string_json+='"'+nom_col_ecran+'":';
								var val_format=this.FormaterValeur(type_col,val_col);
								this.m_string_json+=val_format;
//console.log('cellule['+k+']=('+nom_col_ecran+','+val_format+')');
							}
						}
						if(!trouve)
						{
							if(remplacer_nom_col_par_header)
								this.m_string_json+='"'+header+'":""';
							else
								this.m_string_json+='"'+nom_col_ecran+'":""';
//console.log("colonne non trouvee");
						}
					}
				}
				this.m_string_json+="}";
			}
	   }
	   this.m_string_json+="]";
	   /*
	   this.m_coldefs=new Array(nb_col_affichees);
	   for(i=0;i<nb_col_affichees;i++)
	   {
		   this.m_coldefs[i]=coldefs[i];
	   }
	   */
//if(supp_col_invisibles)
//console.log("m_string_json="+this.m_string_json);
	   return this.m_string_json;
	}
	DonnerStringFormulaireJSon(tab_cols_ecran: ColonneEcran[],tab_cols_sql: ColonneSql[],tab_ligs: Ligne[],remplacer_nom_col_par_header: boolean,pour_excel:boolean): string
	{
		var nb_col_ecran: number=tab_cols_ecran.length;
		var nb_lig: number=tab_ligs.length;
		var i:number;
		var j:number;
		var k:number;
		var nb_cel:number;
		var trouve:boolean;
		var nom_col_ecran: string;
		var type_col: number;
		var val_col: string;
		var debut:boolean;
		var a_inserer: boolean;
		var header: string;
		var num_col_sql:number= -1;
//console.log('JSon.DonnerStringFormulaireJSon: nb_lig='+nb_lig);
//console.log(tab_cols_ecran);
//		   this.m_tab_prs=new Array(nb_lig);
//		   this.m_tab_lig=new Array(nb_lig);
		debut=true;
		this.m_string_json="[";
		for(i=0;i<nb_lig;i++)
		{
		   nb_cel=tab_ligs[i].m_cellules.length;
//console.log('lig['+i+']: nb_cel='+nb_cel);
			for(j=0;j<nb_col_ecran;j++)
			{
//console.log('j='+j);
				nom_col_ecran=tab_cols_ecran[j].m_nom_col;
				header=tab_cols_ecran[j].m_lib_col;
				type_col=tab_cols_ecran[j].m_type_col;
				if(pour_excel)
					a_inserer=tab_cols_ecran[j].m_inser_excel;
				else
					a_inserer=tab_cols_ecran[j].m_inser_ecran;
				/*
				switch(type_col)
				{
					case 1:	// entier
						if(nom_col.startsWith("id_"))
							invisible=true;
						break;
					case 2:	// string
						if(nom_col.startsWith("id_") && nom_col.endsWith("WITH"))
							header=nom_col.substring(3,nom_col.length-4);
						if(nom_col=="etat")
							invisible=true;
						break;
					case 3:	// date
						break;
					case 4:	// booleen
						break;
				}
				*/
				if(a_inserer)
				{
					for(k=0;k<tab_cols_sql.length;k++)
					{
//console.log('k='+k);
//console.log('nom dans tab_col['+k+']='+tab_cols[k].m_nom_col+' et header='+tab_cols[k].m_lib_col);
						if(nom_col_ecran==tab_cols_sql[k].m_nom_col)
						{
							num_col_sql=k;
						}
					}
//				console.log('nom_col='+nom_col+', invisible='+invisible);
					if(!debut)
					{
						this.m_string_json+=",";
					}
					else
						debut=false;
					this.m_string_json+='{"Donnée":"'+header+'","Valeur":';
					trouve=false;
					for(k=0;k<nb_cel;k++)
					{
//console.log('cellule '+k+'/'+nb_cel);
						if(tab_ligs[i].m_cellules[k].m_num_col == num_col_sql)
						{
							trouve=true;
							val_col=tab_ligs[i].m_cellules[k].m_val;
//					   this.m_string_json+='"'+nom_col+'":';
							var val_format=this.FormaterValeur(type_col,val_col);
							this.m_string_json+=val_format;
//console.log('cellule['+k+']=('+nom_col+','+val_col+'): type_col='+type_col);
//console.log(this.m_string_json);
						}
					}
					if(!trouve)
					{
						this.m_string_json+='""';
					}
					this.m_string_json+="}";
				}
			}
	   }
	   this.m_string_json+="]";
	   return this.m_string_json;
	}
}
