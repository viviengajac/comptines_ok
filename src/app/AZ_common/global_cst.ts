import { AppComponent } from '../app.component';
export class GlobalConstantes
{
//	public static apiURL: string = "https://bertrandgajac.hopto.org:9003/";
	public static m_base_url:string=window.location.origin;
	public static m_url:string=window.location.href;
    public static m_id_prs: number=-1;
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
		url+=GlobalConstantes.m_serveur_bd;
		if(!url.endsWith('/'))url+='/';
//console.log('GlobalConstantes:FaireUrl final='+url);
		return url;
	}
}