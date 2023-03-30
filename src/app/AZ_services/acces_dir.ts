//import { stringify } from '@angular/compiler/src/util';
import { TypeNd,Nd } from '../AZ_common/dir.model';
import { HttpClient } from '@angular/common/http';
import { GlobalConstantes } from '../AZ_common/global_cst';

export class AccesDir
{
	m_retour_brut:string='';
	private m_start_object: string='{';
	private m_end_object: string="}";
	private m_start_array: string="[";
	private m_end_array: string="]";
//	url: string='https://bertrandgajac.hopto.org:9003/AccesBdPm/';
	lire_dir='LireDir.php?nom_dir=';
	constructor(private httpClient: HttpClient){}
	m_nb_nd:number=0;
	m_tab_nd: Nd[]=new Array(0);
	m_tampon_bd: string='';
	m_string_json: string='';
	m_tab_json:any[]=new Array(0);

	m_tampon_dir: string='';
	m_ind: number=0;
	MessageException(msg: string): string
	{
		/*
		var url:string = GlobalConstantes.m_url_bd;
//console.log('acces_bd.FaireUrl: url='+url);
		if(!url.endsWith('/'))url+='/';
		url+=GlobalConstantes.m_serveur_bd;
		if(!url.endsWith('/'))url+='/';
//console.log('acces_bd:FaireUrl final='+url);
		return url;
		*/
		return msg;
	}
	/*
	FaireUrl():string
	{
		var url:string = GlobalConstantes.m_url_bd+GlobalConstantes.m_serveur_bd;
		if(!url.endsWith('/'))url+='/';
//console.log('acces_bd:FaireUrl='+url);
		return url;
	}
	FaireUrl():string
	{
		var url:string = GlobalConstantes.m_base_url;
		if(url=='localhost:4200') url='localhost';
//console.log('acces_bd.FaireUrl: url='+url);
		if(!url.endsWith('/'))url+='/';
		url+=GlobalConstantes.m_serveur_bd;
		if(!url.endsWith('/'))url+='/';
//console.log('acces_bd:FaireUrl final='+url);
		return url;
	}
	*/
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
	/*
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
	*/
	Tabd(ind: number): string
	{
		return this.m_tampon_bd.substring(this.m_ind,this.m_ind+1);
	}
	LireDir(nom_dir:string)
	{
		let promise = new Promise((resolve, reject) =>
		{
			var sep:string="|";
			var params=nom_dir;
//			var url_req: string=this.url+this.lire_dir+params;
			var url_req: string=GlobalConstantes.FaireUrl()+this.lire_dir+params;
//console.log('lireDir: url_req='+url_req);
//console.log('url_req='+url_req);
			this.httpClient.get(url_req, {responseType: 'text'} )
			.toPromise()
			.then
			(
				res =>
				{
					var str_res:string=""+res;
console.log('str_res='+str_res);
					if(str_res.startsWith('Erreur'))
					{
						reject(str_res);
					}
					else
					{
						this.m_retour_brut= ""+res;
						this.DecoderDir();
						resolve('OK');
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
	DecoderDir():string
	{
//console.log("Debut de DecoderDir("+donnees+")");
//console.log("donnees.length="+donnees.length);
//			this.m_tab_nom_col=new Array(0);
		this.m_nb_nd=0;
		this.m_tab_nd=new Array(0);
		this.m_tampon_bd=this.m_retour_brut;	//str_split(donnees);
		this.m_ind=0;
		var c=this.m_tampon_bd[this.m_ind];
//			Tracer("c=".$c);
		if(this.m_tampon_bd[this.m_ind]!=this.m_start_array)
			return this.MessageException("DecoderDir: Pas de caractère de début");
		this.m_ind++;
		var fini:boolean=false;
		var id_nd:number=this.m_nb_nd+1;
		while(fini==false)
		{
			var c=this.m_tampon_bd[this.m_ind];
//console.log('c='+c);
			if(c==this.m_end_array)
				fini=true;
			else
			{
console.log('AD.DecoderDir; id_nd='+id_nd+', m_ind='+this.m_ind);
				var nom_nd:string=this.LireNomPropriete();
				var td:string=this.m_tampon_bd[this.m_ind];
				var type_nd:TypeNd;
				if(td=="D")
					type_nd=TypeNd.Rep;
				else
					type_nd=TypeNd.Fic;
//console.log('nouveau nd: '+nom_nd+':'+td);
				this.m_tab_nd.push(new Nd(id_nd,nom_nd,type_nd,-1,false,false,false));
				id_nd++;
			}
			this.m_ind++;
			c=this.m_tampon_bd[this.m_ind];
//console.log('à la fin c='+c);
			if (c==",")
			{
				this.m_ind++;
			}
//console.log('fin de boucle: m_ind='+this.m_ind+', donnees.length='+donnees.length);
/*
			if(this.m_ind>=donnees.length)
			{
console.log("Fin anormale de DecoderDir: id_nd="+id_nd);
				return this.MessageException("DecoderDir: Pas de caractère de fin");
			}
*/
		}
//console.log("Fin de DecoderDir: id_nd="+id_nd);
		return 'OK';
	}
}
