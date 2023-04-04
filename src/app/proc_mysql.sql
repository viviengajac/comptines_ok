--AZinterv__interv_cmptSelect OLD

begin
	select '' as etat,ic.id_interv_cmpt,ic.id_interv,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,ic.id_cmpt,c.nom_cmpt as id_cmptWITH,ic.ordre
	from interv_cmpt ic
    inner join interv i
    inner join cmpt c
    inner join lieu l
	where ic.id_interv=p_id_interv
    and ic.id_interv=i.id_interv
    and c.id_cmpt=ic.id_cmpt
    and i.id_lieu=l.id_lieu;
end

--AZinterv__interv_cmptSelect    OK <--
begin
	select '' as etat,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,c.nom_cmpt as id_cmptWITH,ic.ordre,ic.id_cmpt
    from interv i
    left join lieu l on l.id_lieu=i.id_lieu
    left join interv_cmpt ic on i.id_interv=ic.id_interv
    left join cmpt c on c.id_cmpt=ic.id_cmpt
	where ic.id_interv=p_id_interv;
end
--
    and ic.id_cmpt=c.id_cmpt;

--AZinterv__seance_cmptSelect    OK <--
begin
	select '' as etat,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,i.id_seance,sc.id_seance_cmpt,c.nom_cmpt
	from interv i
	left join lieu l on l.id_lieu=i.id_lieu
	left join seance_cmpt sc on i.id_seance=sc.id_seance
	left join cmpt c on c.id_cmpt=sc.id_cmpt
	where id_interv=p_id_interv and i.id_seance is not null;
end
--



--AZinterv_intervMaj_OLD
begin
	if (p_etat ='U') then
        if (p_id_seance = 0) then
            set p_id_seance = NULL;
        end if;
		update interv set date_interv=p_date_interv,id_seance=p_id_seance,id_lieu=p_id_lieu,comm_interv=p_comm_interv,tarif_interv=p_tarif_interv,fact_interv=p_fact_interv,num_interv=p_num_interv where id_interv=p_id_interv;
	elseif (p_etat = 'I') then
		insert into interv (date_interv,id_seance,id_lieu,comm_interv,tarif_interv,fact_interv,num_interv) values (p_date_interv,p_id_seance,p_id_lieu,p_comm_interv,p_tarif_interv,p_fact_interv,p_num_interv);
	elseif (p_etat = 'D') then
		delete from interv where id_interv=p_id_interv;
	end if;
end
--AZinterv_intervMaj -- en cours
begin
	declare p_num_auto int;
	if (p_etat ='U') then
        if (p_id_seance = 0) then
            set p_id_seance = NULL;
        end if;
		update interv set date_interv=p_date_interv,id_seance=p_id_seance,id_lieu=p_id_lieu,comm_interv=p_comm_interv,tarif_interv=p_tarif_interv,fact_interv=p_fact_interv,num_interv=p_num_interv where id_interv=p_id_interv;
	elseif (p_etat = 'I') then
		SELECT MAX(num_interv)+1 into p_num_auto FROM interv WHERE id_lieu = p_id_lieu;
		insert into interv (date_interv,id_seance,id_lieu,comm_interv,tarif_interv,fact_interv,num_interv) values (p_date_interv,p_id_seance,p_id_lieu,p_comm_interv,p_tarif_interv,p_fact_interv,p_num_auto);
	elseif (p_etat = 'D') then
		delete from interv where id_interv=p_id_interv;
	end if;
end

--AZseance__seance_cmptSelect
begin
	select '' as etat,C.id_cmpt,C.nom_cmpt as id_cmptWITH,C.id_instr,I.nom_instr,S.id_cmpt,S.id_seance_cmpt,S.id_seance
	from cmpt C    
    left join instr I on I.id_instr=C.id_instr
    inner join seance_cmpt S on S.id_seance=p_id_seance
    where S.id_cmpt=C.id_cmpt and nom_cmpt=C.nom_cmpt;
end
--

--AZvilleSelect
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZvilleSelect`()
begin
	SELECT '' as etat,id_ville,nom_ville
    FROM `ville`
    ORDER BY id_ville;
 end$$
DELIMITER ;
--

--AZinstrMaj
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZvilleMaj`(IN `p_etat` CHAR, IN `p_id_ville` INT, IN `p_nom_ville` VARCHAR(30))
begin
	if (p_etat ='U') then
-- select current_date() into v_date_debog;
-- insert into debog(date_msg,msg) values (v_date_debog,concat('AZloge__tenueMaj: lib_tenue=',p_lib_tenue));
		update ville set nom_ville=p_nom_ville where id_ville=p_id_ville;
	elseif (p_etat = 'I') then
		insert into ville (nom_ville) values (p_nom_ville);
	elseif (p_etat = 'D') then
		delete from ville where id_ville=p_id_ville;
	end if;
end$$
DELIMITER ;
----AZlieuMaj
begin
	if (p_etat ='U') then
		update lieu set nom_lieu=p_nom_lieu,ad_lieu=p_ad_lieu,id_ville=p_id_ville,lat_lieu=p_lat_lieu,lon_lieu=p_lon_lieu,id_type_lieu=p_id_type_lieu where id_lieu=p_id_lieu;
	elseif (p_etat = 'I') then
		insert into lieu (nom_lieu,ad_lieu,id_ville,lat_lieu,lon_lieu,id_type_lieu) values (p_nom_lieu,p_ad_lieu,p_id_ville,p_lat_lieu,p_lon_lieu,p_id_type_lieu);
	elseif (p_etat = 'D') then
		delete from lieu where id_lieu=p_id_lieu;
	end if;
end
--AZlieuMaj  // pour éviter les erreurs quand lat_lieu et/ou lon_lieu ne sont pas renseignés OLD?
begin
	if (p_etat ='U') then
		update lieu set nom_lieu=p_nom_lieu,ad_lieu=p_ad_lieu,id_ville=p_id_ville,lat_lieu=p_lat_lieu,lon_lieu=p_lon_lieu,id_type_lieu=p_id_type_lieu where id_lieu=p_id_lieu;
	elseif (p_etat = 'I') then
        if (p_id_seance = 0) then
            set p_id_seance = NULL;
        end if;
		insert into lieu (nom_lieu,ad_lieu,id_ville,lat_lieu,lon_lieu,id_type_lieu) values (p_nom_lieu,p_ad_lieu,p_id_ville,p_lat_lieu,p_lon_lieu,p_id_type_lieu);
	elseif (p_etat = 'D') then
		delete from lieu where id_lieu=p_id_lieu;
	end if;
end
--
--AZinterv__intervSelect
begin
	select '' as etat,i.id_interv,i.date_interv,i.id_seance,i.id_lieu,i.comm_interv,i.tarif_interv,i.fact_interv,i.num_interv,l.id_lieu,l.nom_lieu
	from interv i
    inner join lieu l on l.id_lieu=i.id_lieu
	where i.id_interv=p_id_interv;
end

--
--AZinterv__intervMaj
begin
	if (p_etat ='U') then
        if (p_id_seance = 0) then
            set p_id_seance = NULL;
        end if;
		update interv set date_interv=p_date_interv,id_seance=p_id_seance,id_lieu=p_id_lieu,comm_interv=p_comm_interv,tarif_interv=p_tarif_interv,fact_interv=p_fact_interv,num_interv=p_num_interv where id_interv=p_id_interv;
	elseif (p_etat = 'I') then
		insert into interv (date_interv,id_seance,id_lieu,comm_interv,tarif_interv,fact_interv,num_interv) values (p_date_interv,p_id_seance,p_id_lieu,p_comm_interv,p_tarif_interv,p_fact_interv,p_num_interv);
	elseif (p_etat = 'D') then
		delete from interv where id_interv=p_id_interv;
	end if;
end

--AZdbdict__recherche
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__recherche`(IN `p_id_prs` INT, IN `p_id_dbdict` VARCHAR(20))
begin
	select id_dbdict,nom_dbdict,selfdesc
	from dbdictm1
		where 1=1
			and (id_dbdict like p_id_dbdict or p_id_dbdict is null)
    	order by id_dbdict asc;
end$$
DELIMITER ;
--AZcmptMaj
begin
    if(p_id_instr = 0) then
    	set p_id_instr = NULL;
    end if;
	if (p_etat ='U') then
		update cmpt set nom_cmpt=p_nom_cmpt,id_instr=p_id_instr,id_theme=p_id_theme,grands=p_grands,moyens=p_moyens,petits=p_petits where id_cmpt=p_id_cmpt;
	elseif (p_etat = 'I') then
		insert into cmpt (nom_cmpt,id_instr,id_theme,grands,moyens,petits) values (p_nom_cmpt,p_id_instr,p_id_theme,p_grands,p_moyens,p_petits);
	elseif (p_etat = 'D') then
		delete from cmpt where id_cmpt=p_id_cmpt;
	end if;
end

--AZinit_cbo
begin
	if (p_nom_tab='prs') then
		select id_prs,concat(nom_prs,' ',prenom_prs) from prs order by 2;
    elseif(p_nom_tab='seance') then
		select id_seance,nom_seance from seance where nom_seance is not null order by 2;
    elseif(p_nom_tab='lieu') then
		select id_lieu,nom_lieu from lieu order by 2;
    elseif(p_nom_tab='cmpt') then
		select id_cmpt,nom_cmpt from cmpt order by 2;
	elseif(p_nom_tab='instr') then
		select id_instr,nom_instr from instr order by 2;
	elseif(p_nom_tab='etat_prs') then
		select id_etat_prs,nom_etat_prs from etat_prs order by 2;
	elseif (p_nom_tab='prs_login') then
		select id_prs,concat(nom_prs,' ',prenom_prs) from prs order by 2 desc;
	elseif (p_nom_tab='actions') then
		select id_actions,nom from actions order by 2;
	elseif (p_nom_tab='transactions') then
		select id_actions,nom from actions order by 2;
	elseif (p_nom_tab='transetat') then
		select id_transetat,lib_transetat from transetat order by 2;
    elseif (p_nom_tab='type_lieu') then
		select id_type_lieu,lib_type_lieu from type_lieu order by 2;
    elseif (p_nom_tab='dbdict') then
		select id_dbdict,nom_dbdict from dbdictm1 order by 2;
    elseif (p_nom_tab='ville') then
		select id_ville,nom_ville from ville order by 2;
	elseif (p_nom_tab='theme') then
		select id_theme,nom_theme from theme order by 2;
	elseif (p_nom_tab='interv') then
		select id_interv,num_interv from interv order by 2;
	elseif (p_nom_tab='dbdicttype') then
		select id_dbdicttype,lib_dbdicttype from dbdicttype order by 2;
	end if;
end
--

--AZstats
--
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZstats`()
begin
	select 'Jan',count(*) as nb from interv where month(date_interv)=1 and year(date_interv)=p_annee
	union select 'Fev',count(*) as nb from interv where month(date_interv)=2 and year(date_interv)=p_annee
	union select 'Mar',count(*) as nb from interv where month(date_interv)=3 and year(date_interv)=p_annee
	union select 'Avr',count(*) as nb from interv where month(date_interv)=4 and year(date_interv)=p_annee
	union select 'Mai',count(*) as nb from interv where month(date_interv)=5 and year(date_interv)=p_annee
	union select 'Juin',count(*) as nb from interv where month(date_interv)=6 and year(date_interv)=p_annee
	union select 'Juil',count(*) as nb from interv where month(date_interv)=7 and year(date_interv)=p_annee
	union select 'Aout',count(*) as nb from interv where month(date_interv)=8 and year(date_interv)=p_annee
	union select 'Sep',count(*) as nb from interv where month(date_interv)=9 and year(date_interv)=p_annee
	union select 'Oct',count(*) as nb from interv where month(date_interv)=10 and year(date_interv)=p_annee
	union select 'Nov',count(*) as nb from interv where month(date_interv)=11 and year(date_interv)=p_annee
	union select 'Dec',count(*) as nb from interv where month(date_interv)=12 and year(date_interv)=p_annee;
 end$$
DELIMITER ;
--AZstats id=0 _OK
--
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZstats`()
begin
	if (p_annee='0') then
		select concat(year(date_interv),'-',right(concat("0",month(date_interv)),2)) as ym,count(*) as nb from interv group by ym order by ym;
	else
		select 'Jan',count(*) as nb from interv where month(date_interv)=1 and year(date_interv)=p_annee
		union select 'Fev',count(*) as nb from interv where month(date_interv)=2 and year(date_interv)=p_annee
		union select 'Mar',count(*) as nb from interv where month(date_interv)=3 and year(date_interv)=p_annee
		union select 'Avr',count(*) as nb from interv where month(date_interv)=4 and year(date_interv)=p_annee
		union select 'Mai',count(*) as nb from interv where month(date_interv)=5 and year(date_interv)=p_annee
		union select 'Juin',count(*) as nb from interv where month(date_interv)=6 and year(date_interv)=p_annee
		union select 'Juil',count(*) as nb from interv where month(date_interv)=7 and year(date_interv)=p_annee
		union select 'Aout',count(*) as nb from interv where month(date_interv)=8 and year(date_interv)=p_annee
		union select 'Sep',count(*) as nb from interv where month(date_interv)=9 and year(date_interv)=p_annee
		union select 'Oct',count(*) as nb from interv where month(date_interv)=10 and year(date_interv)=p_annee
		union select 'Nov',count(*) as nb from interv where month(date_interv)=11 and year(date_interv)=p_annee
		union select 'Dec',count(*) as nb from interv where month(date_interv)=12 and year(date_interv)=p_annee;
	end if;
 end$$
DELIMITER ;
--STACKED
begin
	if (p_annee='0') then
		select concat(year(date_interv),'-',right(concat("0",month(date_interv)),2)) as ym,count(*) as nb from interv group by ym order by ym;
	else
		select 'Jan',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=1 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Fev',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=2 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Mar',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=3 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Avr',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=4 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Mai',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=5 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Juin',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=6 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Juil',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=7 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Août',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=8 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Sep',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=9 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Oct',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=10 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Nov',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=11 and year(i.date_interv)=p_annee group by nom_lieu
		union
		select 'Dec',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=12 and year(i.date_interv)=p_annee group by nom_lieu;
	end if;
--tests
		select 'Jan',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=1 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Fev',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=2 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Mar',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=3 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Avr',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=4 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Mai',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=5 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Juin',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=6 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Juil',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=7 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Août',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=8 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Sep',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=9 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Oct',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=10 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Nov',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=11 and year(i.date_interv)=2021 group by nom_lieu
		union
		select 'Dec',count(*) as nb,l.nom_lieu from interv i left join lieu l on l.id_lieu=i.id_lieu where month(i.date_interv)=12 and year(i.date_interv)=2021 group by nom_lieu;
--

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZstats`()
begin
	select 'Jan',count(*) as nb from interv where month(date_interv)=1 and year(date_interv)=2023
	union select 'Fev',count(*) as nb from interv where month(date_interv)=2 and year(date_interv)=2023
	union select 'Mar',count(*) as nb from interv where month(date_interv)=3 and year(date_interv)=2023
	union select 'Avr',count(*) as nb from interv where month(date_interv)=4 and year(date_interv)=2023
	union select 'Mai',count(*) as nb from interv where month(date_interv)=5 and year(date_interv)=2023
	union select 'Juin',count(*) as nb from interv where month(date_interv)=6 and year(date_interv)=2023
	union select 'Juil',count(*) as nb from interv where month(date_interv)=7 and year(date_interv)=2023
	union select 'Aout',count(*) as nb from interv where month(date_interv)=8 and year(date_interv)=2023
	union select 'Sep',count(*) as nb from interv where month(date_interv)=9 and year(date_interv)=2023
	union select 'Oct',count(*) as nb from interv where month(date_interv)=10 and year(date_interv)=2023
	union select 'Nov',count(*) as nb from interv where month(date_interv)=11 and year(date_interv)=2023
	union select 'Dec',count(*) as nb from interv where month(date_interv)=12 and year(date_interv)=2023;
 end$$
DELIMITER ;

--AZstats_bertrand
delimiter //
create procedure AZstats (p_id_prs_login int,p_id_type_stt int,p_id_terr int)
begin
-- select top 200 count(*) over() as nb_lig,l.id_loge,l.nom_loge,l.id_obed,o.nom_obed as id_obedWITH,l.id_orient,orient.nom_orient as id_orientWITH,num_loge as Numéro,l.id_type_loge,tl.lib_type_loge as id_type_logeWITH
    declare v_id_loge_login int;
    declare v_id_deg_login int;
    declare v_num_deg_login int;
    declare v_nivo_lec_login int;
    declare v_id_terr_login int;
    declare v_id_type_stt int;
    select p.id_loge,id_deg_av,nivo_lec,id_terr into v_id_loge_login,v_id_deg_login,v_nivo_lec_login,v_id_terr_login
        from prs p
        inner join loge l on p.id_loge=l.id_loge
        where id_prs=p_id_prs_login;
    if(v_id_deg_login is null) then
        set v_num_deg_login=1;
    else
        select num_deg into v_num_deg_login from deg where id_deg=v_id_deg_login;
    end if;
    if(p_id_terr is null) then
    /*
        select nom_terr,id_deg_bl,count(*)
            from prs p
            inner join loge l on p.id_loge=l.id_loge
            inner join terr t on l.id_terr=t.id_terr
            inner join etat_prs e on p.id_etat_prs=e.id_etat_prs
            where e.actif=1
            and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
            group by nom_terr,id_deg_bl
            order by 1,2;
    */
        if(p_id_type_stt=12)then
            select nom_terr,d.id_deg,AZnb_membres_par_terr_et_deg(t.id_terr,d.id_deg) as nb
                from terr t
                inner join deg d on d.avancement=0
                where 1=1
--                and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
                group by nom_terr,d.id_deg
                order by 1,2;
        else
            select nom_terr,'F' as nom_genre, AZnb_membres_par_terr_et_genre(id_terr,1) as nb
                from terr
            union
            select nom_terr,'S' as nom_genre,AZnb_membres_par_terr_et_genre(id_terr,0) as nb
                from terr
            union
            select nom_terr,'_Indef' as nom_genre,AZnb_membres_par_terr_et_genre(id_terr,-1) as nb
                from terr
            group by nom_terr,nom_genre
            order by 1,2;
        end if;
    else
        if(p_id_type_stt=12)then
            select nom_loge,d.id_deg,AZnb_membres_par_loge_et_deg(l.id_loge,d.id_deg) as nb
                from loge l
                inner join deg d on d.avancement=0
                inner join type_loge tl on l.id_type_loge=tl.id_type_loge
                where l.active=1 and tl.nom_type_loge='Bleue' and l.id_terr=p_id_terr
                and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
                group by nom_loge,d.id_deg
                order by 1,2;
        else
            select nom_loge,'F' as nom_genre, AZnb_membres_par_loge_et_genre(id_loge,0) as nb
                from loge l
                inner join type_loge tl on l.id_type_loge=tl.id_type_loge
                where l.active=1 and tl.nom_type_loge='Bleue' and l.id_terr=p_id_terr
                and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
            union
            select nom_loge,'S' as nom_genre,AZnb_membres_par_loge_et_genre(id_loge,1) as nb
                from loge l
                inner join type_loge tl on l.id_type_loge=tl.id_type_loge
                where l.active=1 and tl.nom_type_loge='Bleue' and l.id_terr=p_id_terr
                and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
            union
            select nom_loge,'_Indef' as nom_genre,AZnb_membres_par_loge_et_genre(id_loge,-1) as nb
                from loge l
                inner join type_loge tl on l.id_type_loge=tl.id_type_loge
                where l.active=1 and tl.nom_type_loge='Bleue' and l.id_terr=p_id_terr
                and ((v_nivo_lec_login=2 and (l.id_loge=v_id_loge_login or l.id_loge in (select id_loge from loge_prs where id_prs=p_id_prs_login))) or (v_nivo_lec_login=3 and l.id_terr=v_id_terr_login) or v_nivo_lec_login=4)
            group by nom_loge,nom_genre
            order by 1,2;
        end if;
    end if;
end; //
delimiter ;


--AZdbdict__dbdictSelect
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdictSelect`(IN `p_id_dbdict` INT)
begin
	select '' as etat,id_dbdict,nom_dbdict,selfdesc
	from dbdictm1
	where id_dbdict=p_id_dbdict;
end$$
DELIMITER ;
--
--AZdbdict__dbdictMaj
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdictMaj`(IN `p_etat` CHAR, IN `p_id_dbdict` INT, IN `p_nom_dbdict` VARCHAR(20), IN `p_selfdesc` VARCHAR(40))
begin
	if (p_etat ='U') then
		update dbdictm1 set nom_dbdict=p_nom_dbdict,selfdesc=p_selfdesc where id_dbdict=p_id_dbdict;
	elseif (p_etat = 'I') then
		insert into dbdictm1 (nom_dbdict,selfdesc) values (p_nom_dbdict,p_selfdesc);
	elseif (p_etat = 'D') then
		delete from dbdictm1 where id_dbdict=p_id_dbdict;
	end if;
end$$
DELIMITER ;
--
--AZdbdict__dbdicta1Select
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdicta1Select`(IN `p_id_dbdict` INT)
begin
	select '' as etat,d.nom_dbdict,d.selfdesc,a.id_dbdicta1,a.id_dbdict,a.champ,a.id_dbdicttype,t.id_dbdicttype,t.lib_dbdicttype as id_dbdicttypeWITH,a.longueur,a.niveau,a.idx,a.contrainte
	from dbdictm1 d
    inner join dbdicta1 a on d.id_dbdict=a.id_dbdict
	left join dbdicttype t on a.id_dbdicttype=t.id_dbdicttype
    where d.id_dbdict=p_id_dbdict;
end$$
DELIMITER ;
--
--AZdbdict__dbdicta1Maj
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdicta1Maj`(IN `p_etat` CHAR, IN `p_id_dbdicta1` INT, IN `p_id_dbdict` INT, IN `p_champ` VARCHAR(20), IN `p_id_dbdicttype` INT, IN `p_longueur` INT,IN `p_niveau` INT, IN `p_idx` INT, IN `p_contrainte` VARCHAR(20))
begin
	if (p_etat ='U') then
		update dbdicta1 set champ=p_champ,id_dbdicttype=p_id_dbdicttype,longueur=p_longueur,niveau=p_niveau,idx=p_idx,contrainte=p_contrainte
        where id_dbdicta1=p_id_dbdicta1;
	elseif (p_etat = 'I') then
		insert into dbdicta1 (id_dbdict,champ,id_dbdicttype,longueur,niveau,idx,contrainte) values (p_id_dbdict,p_champ,p_id_dbdicttype,p_longueur,p_niveau,p_idx,p_contrainte);
	elseif (p_etat = 'D') then
		delete from dbdicta1 where id_dbdicta1=p_id_dbdicta1;
	end if;
end$$
DELIMITER ;
--
--AZdbdict__dbdicta2Select
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdicta2Select`(IN `p_id_dbdict` INT)
begin
	select '' as etat,d.nom_dbdict,d.selfdesc,a.id_dbdicta2,a.id_dbdict,a.champ_source,a.table_cible,a.champ_cible,a.requete
	from dbdictm1 d
    inner join dbdicta2 a on d.id_dbdict=a.id_dbdict
    where d.id_dbdict=p_id_dbdict;
end$$
DELIMITER ;
--
--AZdbdict__dbdicta2Maj
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZdbdict__dbdicta2Maj`(IN `p_etat` CHAR, IN `p_id_dbdicta2` INT, IN `p_id_dbdict` INT, IN `p_champ_source` VARCHAR(20), IN `p_table_cible` VARCHAR(20), IN `p_champ_cible` VARCHAR(20), IN `p_requete` VARCHAR(80))
begin
	if (p_etat ='U') then
		update dbdicta2 set champ_source=p_champ_source,table_cible=p_table_cible,champ_cible=p_champ_cible,requete=p_requete
        where id_dbdicta2=p_id_dbdicta2;
	elseif (p_etat = 'I') then
		insert into dbdicta2 (id_dbdict,champ_source,table_cible,champ_cible,requete) values (p_id_dbdict,p_champ_source,p_table_cible,p_champ_cible,p_requete);
	elseif (p_etat = 'D') then
		delete from dbdicta2 where id_dbdicta2=p_id_dbdicta2;
	end if;
end$$
DELIMITER ;
--
--MAJ Angular version 15.2.0
--ng update @angular/cli@15.2.0 @angular/core@15.2.0
--
--AZinterv__interv_cmptSelect
begin
	select '' as etat,i.id_interv,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,c.nom_cmpt as id_cmptWITH,ic.ordre,ic.id_cmpt,ic.id_interv_cmpt
    from interv i
    left join lieu l on l.id_lieu=i.id_lieu
    left join interv_cmpt ic on i.id_interv=ic.id_interv
    left join cmpt c on c.id_cmpt=ic.id_cmpt
	where ic.id_interv=p_id_interv;
end
--
--AZinterv__seance_cmptSelect
select '' as etat,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,i.id_seance,sc.id_seance_cmpt,c.nom_cmpt
from interv i
left join lieu l on l.id_lieu=i.id_lieu
left join seance_cmpt sc on i.id_seance=sc.id_seance
left join cmpt c on c.id_cmpt=sc.id_cmpt
where i.id_interv=p_id_interv
--
--AZinterv__intervSelect
begin
	select '' as etat,i.id_interv,i.date_interv,i.id_seance,i.id_lieu,i.comm_interv,i.tarif_interv,i.fact_interv,i.num_interv,l.id_lieu,l.nom_lieu
	from interv i
    inner join lieu l on l.id_lieu=i.id_lieu
	where i.id_interv=p_id_interv;
end

--AZcmptSelect
begin
	SELECT '' as etat,c.nom_cmpt,c.id_instr,c.id_cmpt,i.nom_instr as id_instrWITH,c.grands,c.moyens,c.petits,(SELECT count(*) FROM `seance_cmpt` as sc WHERE sc.id_cmpt=c.id_cmpt) as nb
    FROM `cmpt` as c
    LEFT JOIN `instr` as i ON c.id_instr=i.id_instr
    ORDER BY nom_cmpt;
 end

 --
begin
	SELECT '' as etat,c.id_cmpt,c.nom_cmpt,c.id_instr,i.nom_instr as id_instrWITH,c.id_theme,t.nom_theme as id_themeWITH,c.grands,c.moyens,c.petits,(SELECT count(*) FROM `seance_cmpt` as sc WHERE sc.id_cmpt=c.id_cmpt) as nb
    FROM `cmpt` as c
    LEFT JOIN `instr` as i ON c.id_instr=i.id_instr
	LEFT JOIN `theme` as t ON c.id_theme=t.id_theme
    ORDER BY nom_cmpt;
 end



 --AZcmptSelect_OLD
 begin
	SELECT '' as etat,c.nom_cmpt,c.id_instr,c.id_cmpt,i.nom_instr as id_instrWITH,c.grands,c.moyens,c.petits
    FROM `cmpt` as c
    LEFT JOIN `instr` as i ON c.id_instr=i.id_instr
    ORDER BY nom_cmpt;
 end
 --AZthemeSelect
 DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZthemeSelect`()
begin
	SELECT '' as etat,id_theme,nom_theme
    FROM `theme`
    ORDER BY id_theme;
 end$$
DELIMITER ;
--AZthemeMaj
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZthemeMaj`(IN `p_etat` CHAR, IN `p_id_theme` INT, IN `p_nom_theme` VARCHAR(30))
begin
	if (p_etat ='U') then
		update theme set nom_theme=p_nom_theme where id_theme=p_id_theme;
	elseif (p_etat = 'I') then
		insert into theme (nom_theme) values (p_nom_theme);
	elseif (p_etat = 'D') then
		delete from theme where id_theme=p_id_theme;
	end if;
end$$
DELIMITER ;
--AZthemeMaj
begin
    if(p_id_instr = 0) then
    	set p_id_instr = NULL;
    end if;
	if (p_etat ='U') then
	update cmpt set nom_cmpt=p_nom_cmpt,id_instr=p_id_instr,id_theme=p_id_theme,grands=p_grands,moyens=p_moyens,petits=p_petits where id_cmpt=p_id_cmpt;
	elseif (p_etat = 'I') then
		insert into cmpt (nom_cmpt,id_instr,id_theme,grands,moyens,petits) values (p_nom_cmpt,p_id_instr,p_id_theme,p_grands,p_moyens,p_petits);
	elseif (p_etat = 'D') then
		delete from cmpt where id_cmpt=p_id_cmpt;
	end if;
end

--AZseance__recherche
begin
	select S.id_seance,S.num_seance,S.nom_seance
	from seance S
		where 1=1
			and ((exists (SELECT 1 FROM seance_cmpt as sc WHERE sc.id_seance = S.id_seance and sc.id_cmpt = p_filtre_seance)) or p_filtre_seance is null)
    	order by num_seance asc;
end
--AZseance__recherche_OLD
begin
	select S.id_seance,S.num_seance,S.nom_seance
	from seance S
		where 1=1
			and (S.id_seance like p_id_seance or p_id_seance is null)
    	order by num_seance asc;
end


--liste comptines INSERT
INSERT INTO `cmpt`(`id_cmpt`, `nom_cmpt`, `id_instr`, `id_theme`, `grands`, `moyens`, `petits`, `doc_db`)
VALUES
(NULL,'Araignée Nez',NULL,NULL,0,0,0,''),
(NULL,'Au secours voilà le loup ! ',NULL,NULL,0,0,0,''),
(NULL,"Bato sur l'eau la rivière la rivière",NULL,NULL,0,0,0,''),
(NULL,'Bébette qui monte',NULL,NULL,0,0,0,''),
(NULL,'Bergère rouli roula',NULL,NULL,0,0,0,''),
(NULL,'Bertrand le vieux serpent',NULL,NULL,0,0,0,''),
(NULL,'Boîte tous les animaux',NULL,NULL,0,0,0,''),
(NULL,'Chaperon rouge (petit chou, petit chou)',NULL,NULL,0,0,0,''),
(NULL,'Cinq dans le nid',NULL,NULL,0,0,0,''),
(NULL,'Cinq petits moutons assis sur la barrière',NULL,NULL,0,0,0,''),
(NULL,'Coccinelle demoiselle',NULL,NULL,0,0,0,''),
(NULL,'Cubes boum badabra',NULL,NULL,0,0,0,''),
(NULL,'Dans la forêt lointaine',NULL,NULL,0,0,0,''),
(NULL,'Dans sa maison un grand cerf',NULL,NULL,0,0,0,''),
(NULL,'En revenant de St Denis',NULL,NULL,0,0,0,''),
(NULL,'Escargot Berlingot',NULL,3,0,0,0,''),
(NULL,'Fourmi main',NULL,NULL,0,0,0,''),
(NULL,'Goutte goutelette de pluie',NULL,NULL,0,0,0,''),
(NULL,"Gypsie l'araignée monte l'escalier",NULL,2,0,0,0,''),
(NULL,"Hugo l'escargot",NULL,3,0,0,0,''),
(NULL,'Il était une bergère et ri et ron petit patapon',NULL,NULL,0,0,0,''),
(NULL,"Il était petit homme qui n'avait pas de maison",NULL,NULL,0,0,0,''),
(NULL,'Il était un petit navire',NULL,NULL,0,0,0,''),
(NULL,'Il pleut il mouille',NULL,NULL,0,0,0,''),
(NULL,'Il pleut, il pleut bergère',NULL,NULL,0,0,0,''),
(NULL,"J'ai pas peur j'ai pas peur",NULL,NULL,0,0,0,''),
(NULL,"J'aime la galette",NULL,NULL,0,0,0,''),
(NULL,"Jamais on a vu jamais on n'verra",NULL,NULL,0,0,0,''),
(NULL,'Je pars en voyage',NULL,NULL,0,0,0,''),
(NULL,'Je suis la galette la galette la galette',NULL,NULL,0,0,0,''),
(NULL,'Je te tiens par la barbichette',NULL,NULL,0,0,0,''),
(NULL,'Jean petit qui danse',NULL,NULL,0,0,0,''),
(NULL,'La poulette ce matin',NULL,NULL,0,0,0,''),
(NULL,'La sorcière est une mégère',NULL,NULL,0,0,0,''),
(NULL,"L'araignée Gypsie",NULL,2,0,0,0,''),
(NULL,"L'as-tu vu petit bonhomme",NULL,NULL,0,0,0,''),
(NULL,'Le fermier dans son pré',NULL,NULL,0,0,0,''),
(NULL,'Le mille pattes',NULL,NULL,0,0,0,''),
(NULL,"Les petits poissons dans l'eau nagent",NULL,NULL,0,0,0,''),
(NULL,'Les petits poussins ont bien du chagrin',NULL,NULL,0,0,0,''),
(NULL,"L'était une p'tite poule grise",NULL,NULL,0,0,0,''),
(NULL,'Lili la chenille',NULL,NULL,0,0,0,''),
(NULL,"Maman les p'tits bato qui vont sur l'eau",NULL,NULL,0,0,0,''),
(NULL,'Mazurkaline',NULL,NULL,0,0,0,''),
(NULL,'Meunier tu dors ton moulin va trop vite',NULL,NULL,0,0,0,''),
(NULL,'Mon âne a bien mal à la tête',NULL,NULL,0,0,0,''),
(NULL,'Mon beau sapin',NULL,NULL,0,0,0,''),
(NULL,'Mon petit chat pourquoi es-tu si triste',NULL,NULL,0,0,0,''),
(NULL,'Mon petit lapin a bien du chagrin',NULL,NULL,0,0,0,''),
(NULL,"Mon petit lapin s'est sauvé dans le jardin",NULL,NULL,0,0,0,''),
(NULL,'Mon petit oiseau a pris sa volée',NULL,NULL,0,0,0,''),
(NULL,'Monsieur Pouce',NULL,NULL,0,0,0,''),
(NULL,'Mouche mouchelette',NULL,NULL,0,0,0,''),
(NULL,'Neige neige blanche',NULL,NULL,0,0,0,''),
(NULL,'Noël des animaux',2,NULL,0,0,0,''),
(NULL,'Oh ! Une tite bulle',NULL,NULL,0,0,0,''),
(NULL,'Partir train bateau avion ?',NULL,NULL,0,0,0,''),
(NULL,'Passez pompom les macarons',NULL,NULL,0,0,0,''),
(NULL,"Petit limaçon n'a pas de maison",NULL,NULL,0,0,0,''),
(NULL,'Petit renne au nez rouge',NULL,NULL,0,0,0,''),
(NULL,'Petrouchka ne pleure pas',NULL,NULL,0,0,0,''),
(NULL,"Pluie, pluie, pluie va-t'en",NULL,NULL,0,0,0,''),
(NULL,"Pomme de reinette et pomme d'api",NULL,NULL,0,0,0,''),
(NULL,'Poule en haut poule en bas',NULL,NULL,0,0,0,''),
(NULL,"Prom'nons nous dans les bois",NULL,NULL,0,0,0,''),
(NULL,"Petit poisson petit oiseau s'aimaient d'amour",NULL,NULL,0,0,0,''),
(NULL,"Quand le p'tit bossu va chercher du pain",NULL,NULL,0,0,0,''),
(NULL,'Quatre canetons',NULL,NULL,0,0,0,''),
(NULL,'Que fait ma main',NULL,NULL,0,0,0,''),
(NULL,"Qu'est-ce que c'est un parapluie",NULL,NULL,0,0,0,''),
(NULL,'Qui craint le grand méchant loup',NULL,NULL,0,0,0,''),
(NULL,'Qui étais-tu allé voir avant ?',NULL,NULL,0,0,0,''),
(NULL,"Rock'n'roll des galinacés",NULL,NULL,0,0,0,''),
(NULL,'Savez-vous planter les choux',NULL,NULL,0,0,0,''),
(NULL,"Sur le pont d'Avignon",NULL,NULL,0,0,0,''),
(NULL,'Tape tape petite main',NULL,NULL,0,0,0,''),
(NULL,'Tombe, tombe, tombe la pluie',NULL,NULL,0,0,0,''),
(NULL,'Torpedo',NULL,NULL,0,0,0,''),
(NULL,'Trois parapluies, un petit, un moyen, un gros',NULL,NULL,0,0,0,''),
(NULL,'Trois petits renards',NULL,NULL,0,0,0,''),
(NULL,'Trois poules vont au champ',2,NULL,0,0,0,''),
(NULL,"Trois p'tits minous",NULL,NULL,0,0,0,''),
(NULL,"Un beau matin le p'tit escargot",NULL,3,0,0,0,''),
(NULL,'Un éléphant qui se balançait',NULL,NULL,0,0,0,''),
(NULL,"Un escargot qui s'en allait à la foire",NULL,3,0,0,0,''),
(NULL,'Un jour dans sa cabane un tout petit bonhomme',2,NULL,0,0,0,''),
(NULL,"Un poisson au fond d'un étang",NULL,NULL,0,0,0,''),
(NULL,"Un p'tit canard au bord de l'eau il est si beau",NULL,NULL,0,0,0,''),
(NULL,"Un p'tit soleil tout chaud tout rond",NULL,NULL,0,0,0,''),
(NULL,'Un tout petit papillon vole vole',NULL,NULL,0,0,0,''),
(NULL,"Une petite coccinelle s'est posée",NULL,NULL,0,0,0,''),
(NULL,'Une poule sur un mur',NULL,NULL,0,0,0,''),
(NULL,'Une souris blanche, rose, brune, noire',NULL,1,0,0,0,''),
(NULL,'Une souris verte',NULL,1,0,0,0,''),
(NULL,'Vague vague vaguelo',NULL,NULL,0,0,0,''),
(NULL,"Vive le vent d'hiver",NULL,NULL,0,0,0,''),
(NULL,'Vole vole vole papillon au dessus de...',NULL,NULL,0,0,0,'')