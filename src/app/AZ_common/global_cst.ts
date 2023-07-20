//import { AppComponent } from '../app.component';
//import { MenuComponent } from '../menu/menu.component';
import { DefEcran } from '../AZ_services/ecran';
export class GlobalConstantes
{
//	public static apiURL: string = "https://bertrandgajac.hopto.org:9003/";
	public static m_base_url:string=window.location.origin;
	public static m_url:string='';
    public static m_id_prs_login: number=-1;
    public static m_compteur=0;
	public static m_compteur_initialise=false;
	public static m_classe_fonte:string='moyenne';
	public static m_renderer:any
	public static m_app:any;
	public static m_app_doc:any;
	public static m_nivo_lec:number;
	public static m_nivo_ecr:number;
	public static m_nivo_exp:number;
//	public static m_url_bd: string = "http://bertrandgajac.hopto.org/";
//	public static m_url_bd: string = location.origin;
	public static m_serveur_bd:string;
	public static m_num_ecran_appele:number;
	public static m_num_bloc_appele:number;
	public static m_id_appele:number;
	public static m_init_faite:boolean=false;
	public static m_nb_max_lig_creees:number=1111;
	public static m_rep_fic:string='';
	public static m_nom_col_select_id='SelectId';
	public static m_def_ecrans:Array<DefEcran>=new Array();
	public static InitUrl()
	{
//console.log('GlobalConstantes.InitUrl: début');
		var url=window.location.href;
		var href_menu='/menu';
		if(url.endsWith(href_menu))
			url=url.substring(0,url.length-href_menu.length);
//console.log('premiere url='+url);
		var i=url.indexOf('?p=');
//console.log('i='+i);
		if (i>0)
		{
			url=url.substring(0,i);
		}
//console.log('derniere url='+url);
		this.m_url=url;
	}
	public static DonnerUrl()
	{
//console.log('GlobalConstantes.DonnerUrl: début: url.length='+this.m_url.length);
		if(this.m_url.length==0)
			this.InitUrl();
//console.log('GlobalConstantes.DonnerUrl: fin: url='+this.m_url);
		return this.m_url;
	}
	public static NumClasseFonte(classe_fonte:string):number
	{
		var num_classe_fonte:number=2;
		switch (classe_fonte)
		{
			case 'tres_petite':
				num_classe_fonte=0;
				break;
			case 'petite':
				num_classe_fonte=1;
				break;
			case 'moyenne':
				num_classe_fonte=2;
				break;
			case 'grande':
				num_classe_fonte=3;
				break;
			case 'tres_grande':
				num_classe_fonte=4;
				break;
		}
		return num_classe_fonte;
	}
	public static NomClasseFonte(num_classe_fonte:number):string
	{
		var nom_classe_fonte:string='moyenne';
		switch (num_classe_fonte)
		{
			case 0:
				nom_classe_fonte='tres_petite';
				break;
			case 1:
				nom_classe_fonte='petite';
				break;
			case 2:
				nom_classe_fonte='moyenne';
				break;
			case 3:
				nom_classe_fonte='grande';
				break;
			case 4:
				nom_classe_fonte='tres_grande';
				break;
		}
		return nom_classe_fonte;
	}
	public static FaireUrl():string
	{
		var url:string = GlobalConstantes.m_base_url;
//console.log('GlobalConstantes:FaireUrl debut='+url);
		if(url==null)
		{
			url=location.origin;
		}
		if(url.endsWith('localhost:4200')) url=url.replace('localhost:4200','localhost');
//console.log('GlobalConstantes.FaireUrl: url='+url);
		if(!url.endsWith('/'))url+='/';
//console.log('GlobalConstantes:FaireUrl final='+url);
		return url;
	}
	public static FaireUrlPourPhp():string
	{
		var url:string = GlobalConstantes.FaireUrl();
		if(!url.endsWith('/'))url+='/';
		url+=GlobalConstantes.m_serveur_bd;
		if(!url.endsWith('/'))url+='/';
		url+='std/';
		return url;
	}
	public static LireDefEcrans(def_ecrans:Array<DefEcran>)
	{
		this.m_def_ecrans=def_ecrans;
	}
}