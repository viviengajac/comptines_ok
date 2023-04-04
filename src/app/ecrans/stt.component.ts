import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccesBdService } from '../AZ_services/acces_bd';
import { GlobalConstantes } from '../AZ_common/global_cst';
import { Ecran } from '../AZ_services/ecran';
import { UntypedFormBuilder } from '@angular/forms';
import { ModalService } from '../AZ_modal/modal.service';
import { Cbo } from '../AZ_common/cbo.model';
import { AgChartOptions, AgAreaSeriesOptions, AgCartesianSeriesTooltipRendererParams } from 'ag-charts-community';
@Component({
    selector: 'my-app',
    templateUrl: './stt.component.html'
})
export class SttComponent extends Ecran
{
    public options_stt: any=null;    // AgChartOptions;
    m_cbo_type_stt: any=null;    // Cbo;
    nb_ligne:number=0;
    tab_nom_grp:string[]=new Array(0);
    nom_type_stt:string='';
    tab_donnees:DonneesStt[]=new Array(0);

    tab_series:SerieStt[]=new Array(0);
    id_type_stt:number=0;
	m_cbo_annee: any=null;	//	Cbo;
    annee_string:string;
    m_liste_annees:string[]=new Array(0);
    constructor(public override httpClient: HttpClient, public override formBuilder:UntypedFormBuilder,public override modalService:ModalService)
    {
        super(httpClient, formBuilder,modalService);
//console.log('SttComponent.constructor: debut');
        this.formRecherche=this.formBuilder.group({ m_filtre_type_stt:0,m_filtre_terr:0,m_cbo_annee:0 });
        var val_grp:number[]=[10,20];
        this.tab_series=new Array(1);
        this.tab_series[0]=new SerieStt('?');
        this.options_stt =
        {
            data: this.tab_donnees,
            title:{ text: 'Statistiques', },
            subtitle:{ text: 'Par année', },
            series: [{
                type: 'column',
                xKey: 'nom_grp',
                yKey: 'nb',                
                yName: "Interventions",
                tooltip: { renderer: renderer },
            }],
        };
//console.log('options_stt');
//console.log(this.options_stt);
//console.log('SttComponent.constructor: fin');
    }
    
    ngOnInit(): void
    {
//console.log('SttComponent.ngOnInit: debut');
        let annee_base:number=2020;
        let date_actuelle:Date=new Date();
        let date_actuelle_string:string=date_actuelle.toLocaleString();
        let annee_actuelle_string:string=date_actuelle_string.substring(6,10);
        let annee_actuelle:number=+annee_actuelle_string;
        while(annee_base<=annee_actuelle) {
            this.annee_string=annee_base.toString();
            this.m_liste_annees.push(this.annee_string);
            annee_base++;
        }
        //console.log("liste="+this.m_liste_annees);
        this.m_cbo_type_stt=new Cbo(this.httpClient,'type_stt');
        this.m_cbo_type_stt.GenererListeStd().then((res:string)=>{},(err:string)=>{this.MessageErreur(err);});
        this.m_cbo_annee=new Cbo(this.httpClient,'annees');
        this.m_cbo_annee.InitialiserListe(this.m_liste_annees);
        this.Init();
//console.log('SttComponent.ngOnInit: debut');
    }
    TracerStats()
    {
        try
        {
            var ab=new AccesBdService(this.httpClient);
//console.log('Debut de TracerStats');
//console.log(this.formRecherche.get('m_filtre_type_stt'));
            var sql:string="exec AZstats @id_prs_login@,@annee@";
            var val_annee: any;
            var annee: any;
            val_annee=this.formRecherche.get('m_cbo_annee').value;
            if (val_annee==0) {
                annee='0';
                this.options_stt =
                {
                    data: this.tab_donnees,
                    title:{ text: "Nombre d'interventions", },
                    subtitle:{ text: 'Par mois travaillés depuis 2020', },
                    series: [{
                        type: 'column',
                        xKey: 'nom_grp',
                        yKey: 'nb',
                        yName: "Interventions",
                        tooltip: { renderer: renderer },
                    }],
                };
            }
            else {
                annee=this.m_cbo_annee.m_liste_items[val_annee].m_lib;
                this.options_stt =
                {
                    data: this.tab_donnees,
                    title:{ text: "Nombre d'interventions", },
                    subtitle:{ text: "Pour l'année "+annee, },
                    yName: "Interventions",
                    tooltip: { renderer: renderer },
                };
            }
//console.log("val_annee="+val_annee);
//console.log("annee="+annee);
            var req=sql.replace('@annee@',''+annee).replace('@id_prs_login@',''+GlobalConstantes.m_id_prs_login);
            //var req=sql.replace('@id_type_stt@',''+id_type_stt).replace('@id_terr@',''+id_terr).replace('@id_prs_login@',''+GlobalConstantes.m_id_prs_login);
//console.log('req='+req);
            ab.LireTable(req)
            .then(
            (res) =>
            {
//console.log('carte:AjoutMarqueurs: res='+res);
                var str_res:string=""+res;
                if(!str_res.startsWith("Erreur"))
                {
                    var nb_type_grp:number=0;
                    this.tab_donnees=new Array(0);
                    var i:number;
                    var j:number;
//console.log('id_type_ss='+num_id_type_stt);                    
                    this.nb_ligne=ab.m_lignes.length;
                    this.tab_donnees=new Array(this.nb_ligne);
                    for(i=0;i<this.nb_ligne;i++)
                    {
//console.log("ligne"+i+"="+ab.m_lignes[i]);
                        var nom_mois:string=ab.m_lignes[i].RecupererVal(0);
                        var val:number=ab.m_lignes[i].RecupererVal(1);          
                        this.tab_donnees[i]=new DonneesSttInterv(nom_mois,val);
//console.log(this.tab_donnees[i]);
//console.log('id_type_stt='+id_type_stt);
//console.log(val);
                    }
                    const options= { ...this.options_stt };
                    options.data=this.tab_donnees;
//                        options.series=this.series_deg;
                    this.options_stt=options;
//console.log('options_stt');
//console.log(this.options_stt);                    
                }
            },
            (error) =>
            {
                var str_err:string=error;
                this.MessageErreur(str_err);
            })
//console.log('fin try');
        }
        catch(e)
        {
            this.MessageErreur("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
//            console.log("Erreur: "+(e as Error).message+"\n"+(e as Error).stack);
        }
//console.log('fin ngAfterViewInit');
    }
    onAfficherStt()
    {
        //console.log();
        this.TracerStats();
    }
}
class DonneesStt
{
    public nom_grp:string='';
    constructor(n:string,){this.nom_grp=n;}
}
class DonneesSttInterv extends DonneesStt
{
    public nb:number=0;
    constructor(n:string,a:number)
    {
        super(n);
        this.nb=+a;
    }
}
class DonneesSttIntervStacked extends DonneesStt
{
    public nb:number=0;
    public lieu:string;
    constructor(n:string,a:number,l:string)
    {
        super(n);
        this.nb=+a;
        this.lieu=l;
    }
}
class DonneesSttDegre extends DonneesStt
{
    public AA:number=0;
    public CC:number=0;
    public MM:number=0;
    public MMII:number=0;
    constructor(n:string,a:number,c:number,m:number,mi:number)
    {
        super(n);
        this.AA=a;
        this.CC=c;
        this.MM=m;
        this.MMII=mi;
    }
}
class DonneesSttGenre extends DonneesStt
{
    public FF:number=0;
    public SS:number=0;
    public _Indef:number=0;
    constructor(n:string,s:number,f:number,i:number)
    {
        super(n);
        this._Indef=s;
        this.FF=f;
        this.SS=i;
    }
}
class SerieStt
{
    type:string='column';
    xKey:string='nom_grp';
    yKey:string='';
    stacked:boolean=true;
    constructor(nom_grp:string){this.yKey=nom_grp;}
}
class OptionStt
{
    data:DonneesStt[]=[];
    title:string='Statistiques';
    subtitle:string='';
    series:SerieStt[]=[];
    constructor(d:DonneesStt[],s:string,ser:SerieStt[]){this.data=d;this.subtitle=s;this.series=ser;}
}
function renderer(params: AgCartesianSeriesTooltipRendererParams) {
    return {
      title: params.xValue,
      content: params.yValue.toFixed(0),
    };
  }