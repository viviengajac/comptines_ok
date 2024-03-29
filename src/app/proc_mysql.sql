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

-- lec_dependances
begin
	declare	v_fini int;
	declare	v_tab_id_tmp varchar(500);
	declare	v_pos int;
	declare	v_id int;
	declare	v_tmp varchar(500);
	declare	v_msmt bit;
	declare v_nb int;
	declare v_ret_recurs char(2);
SET @@GLOBAL.max_sp_recursion_depth = 7;
SET @@SESSION.max_sp_recursion_depth = 7;
-- print 'lec_dependances('+@sens+','+@nom_tab+','+@tab_id+','+convert(varchar,@max_lignes)+','+convert(varchar,@profondeur)+')'
	select locate(';',p_tab_id) into v_pos;
	if (v_pos = 0) then
		set p_tab_id=concat(p_tab_id,';');
	end if;
	select count(*) into v_nb from information_schema.innodb_temp_table_info where name='temp_dep'; -- where n_cols=8;
-- call ap_debog(concat('nb pour temp_dep=',v_nb));
	if(v_nb = 0) then
--		 call ap_debog('avant creer temp table');
		create temporary table temp_dep (id_dep int not null auto_increment,primary key(id_dep),niv int,nom_tab varchar(40),id int,info varchar(300));
	else
		delete from temp_dep;
	end if;
	/*
	select count(*) into v_nb from information_schema.innodb_temp_table_info where n_cols=6; -- where name='temp_dep';
-- call ap_debog(concat('nb pour temp_tab_cle=',v_nb));
	if(v_nb = 0) then
		create temporary table temp_tab_cle (ind int not null auto_increment,primary key(ind),niveau int,nom_col varchar(80),nom_tab2 varchar(80),nom_col2 varchar(80),nom_pk varchar(80));
	end if;
	*/
	select count(*) into v_nb from information_schema.innodb_temp_table_info where name='temp_tab_id'; -- where n_cols=6;
-- call ap_debog(concat('nb pour temp_tab_id=',v_nb));
	if(v_nb = 0) then
		create temporary table temp_tab_id (ind int not null auto_increment,primary key(ind),niveau int,id int);
	else
		delete from temp_tab_id;
	end if;
-- call ap_debog ('lec_dep_recurs 2');
-- call ap_debog('apres creer temp table');
	set v_fini=0;
	set v_tab_id_tmp=p_tab_id;
	while (v_fini = 0) do
-- call ap_debog('avant locate');
		select locate(';',v_tab_id_tmp) into v_pos;
-- call ap_debog(concat('apres locate, v_pos=',v_pos));
-- call ap_debog(concat('v_tab_id=',v_tab_id_tmp,', v_pos=(',v_pos,')'));
-- print 'pos='+convert(varchar,@pos)
		if (v_pos <= 0) then
			set v_fini=1;
		else
			if (v_pos > 1) then
-- call ap_debog(concat('avant v_id=substring..:tab_id_tmp=(',v_tab_id_tmp,'), v_pos=',v_pos));
				set v_id=substring(v_tab_id_tmp,1,v_pos-1);
-- call ap_debog('apres v_id=substring...');
--				set v_id=convert(v_tmp as int(10));
-- print 'id='+convert(varchar,@id)
-- print 'profondeur='+convert(varchar,@profondeur)
-- call ap_debog('avant appel lec_dep_recurs');
				call lec_dep_recurs (p_sens,p_nom_tab,v_id,0,p_max_lignes,p_profondeur,v_ret_recurs);
-- call ap_debog('apres appel lec_dep_recurs');
			end if;
-- call ap_debog('avant v_tmp');
			select substring(v_tab_id_tmp,v_pos+1,999) into v_tmp;
-- call ap_debog('apres v_tmp');
			set v_tab_id_tmp=v_tmp;
-- call ap_debog(concat('apres v_tab_id, v_tab_id_tmp=',v_tab_id_tmp));
		end if;
	end while;
-- call ap_debog('avant drop tab_id');
--	drop table temp_tab_id;
-- call ap_debog('avant drop tab_cle');
--	drop table temp_tab_cle;
-- call ap_debog('apres drop tab_cle');
--	select @msmt=msmt from prj
--	select id_dep,niv,nom_tab,isnull(sql,dbo.fct_rep_dependances(nom_tab,id,@msmt)) as rep,id from #dep order by id_dep
--	select id_dep,niv,nom_tab,dbo.fct_rep_dependances(nom_tab,id,@msmt) as rep,id from #dep order by id_dep
--	select id_dep,niv,nom_tab,fct_rep(nom_tab,id) as rep,id,info from temp_dep order by id_dep;
-- insert into debog(msg) select concat(id_dep,',',niv,',',nom_tab,',',id,',',info) from temp_dep;
-- call ap_debog('apres insert into temp_dep');
	select niv,case isnull(lib_tab) when 1 then t.nom_tab else lib_tab end as nom_tab,id,fct_rep(t.nom_tab,id) as rep,info
	from temp_dep t left outer join AZtab on t.nom_tab=AZtab.nom_tab order by id_dep;
--	drop table temp_tab_cle;
	drop table temp_tab_id;
	drop table temp_dep;
end


-- lec_dep_recurs
begin
	declare	v_niv2 int;
--	declare	v_nb_cles int;
--	declare	v_nom_col varchar(80);
	declare	v_nom_tab_fk varchar(80);
	declare	v_nom_tab_pk varchar(80);
	declare	v_nom_col_fk varchar(80);
	declare	v_nom_col_fk_pk varchar(80);
	declare	v_i	int;
--	declare	v_j	int;
	declare	v_id2 int;
--	declare	v_nb_id	int;
	declare	v_sql varchar(300);
	declare	v_nb_dep int;
--	declare	v_err int;
	declare	v_faire	int;
	declare	v_num_instr int;
	declare	v_msg_erreur varchar(500);
--	declare	v_val_erreur varchar(50);
--	declare	v_ajout int;
--	declare	v_min_ind int;
--	declare	v_max_ind int;
--	declare	v_ligne varchar(50);
	declare	v_nb int;
--	declare	v_app_ds_dep bit;
--	declare v_min_cle int;
--	declare v_max_cle int;
	declare v_retour_recurs char(2);
	declare v_curseur_ok int default 1;
	declare v_debog bit;
	declare v_nom_tab2 varchar(30);
	declare v_req_sql varchar(200);
	declare c_cles_b cursor for
		select nom_tab_fk,nom_col_fk,nom_col_fk_pk
		FROM info_sch_fk where nom_tab_pk=p_nom_tab
		order by 1,2,3;
		/*
		select RC.TABLE_NAME AS FK_TABLE_NAME,KCU.COLUMN_NAME,KCU.REFERENCED_COLUMN_NAME,KCU2.COLUMN_NAME
		FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC
		inner join INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK on FK.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA and FK.CONSTRAINT_NAME = RC.CONSTRAINT_NAME and FK.CONSTRAINT_TYPE = 'FOREIGN KEY'
		inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU on KCU.CONSTRAINT_NAME=RC.CONSTRAINT_NAME
		inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2 on KCU2.TABLE_NAME=RC.TABLE_NAME
		where rc.referenced_table_NAME=p_nom_tab and KCU2.CONSTRAINT_NAME='PRIMARY'
		order by 1,2,3;
		*/
	declare c_cles_h cursor for
		select nom_tab_pk,nom_col_fk,nom_col_fk_pk
		FROM info_sch_fk where nom_tab_fk=p_nom_tab
		order by 1,2,3;
		/*
		select RC.REFERENCED_TABLE_NAME AS FK_TABLE_NAME,KCU.COLUMN_NAME,KCU.REFERENCED_COLUMN_NAME,KCU2.COLUMN_NAME
		FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC
		inner join INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK on FK.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA and FK.CONSTRAINT_NAME = RC.CONSTRAINT_NAME and FK.CONSTRAINT_TYPE = 'FOREIGN KEY'
		inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU on KCU.CONSTRAINT_NAME=RC.CONSTRAINT_NAME
		inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2 on KCU2.TABLE_NAME=RC.TABLE_NAME
		where rc.table_NAME=p_nom_tab and KCU2.CONSTRAINT_NAME='PRIMARY'
		order by 1,2,3;
		*/
	declare c_id cursor for select id FROM temp_tab_id where niveau=p_niveau;
	declare continue handler for not found set v_curseur_ok=0;
	DECLARE exit handler for SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		set v_msg_erreur=concat('Erreur SQL :',@text);
		if (p_sens = 'B') then
			insert into temp_dep (niv,nom_tab,id,info) values (p_niveau+1,v_nom_tab_fk,null,v_msg_erreur);
		else
			insert into temp_dep (niv,nom_tab,id,info) values (p_niveau+1,p_nom_tab,null,v_msg_erreur);
		end if;
		set p_retour='KO';
--		drop table temp_id;
	END;
	set v_debog=1;
	if(v_debog=1) then
		call ap_debog(concat('debut de lec_dep_recurs(',p_sens,',',p_nom_tab,',',p_id,',',p_niveau,',',p_profondeur,')'));
	end if;
	/*
	if (p_niveau > 0) then
		select count(*) into v_nb from temp_dep where nom_tab=p_nom_tab and id=p_id;
		if (v_nb = 0) then
-- call ap_debog(concat('insertion d''une dependance(niveau=',p_niveau,', nom_tab=',p_nom_tab,', id=',p_id));
			insert into temp_dep (niv,nom_tab,id) values (p_niveau,p_nom_tab,p_id);
			set v_faire=1;
		else
			set v_faire=0;
		end if;
	else
		set v_faire=1;
	end if;
	*/
	select count(*) into v_nb from temp_dep where nom_tab=p_nom_tab and id=p_id;
	if (v_nb = 0) then
-- call ap_debog(concat('insertion d''une dependance(niveau=',p_niveau,', nom_tab=',p_nom_tab,', id=',p_id));
		insert into temp_dep (niv,nom_tab,id) values (p_niveau,p_nom_tab,p_id);
		set v_faire=1;
	else
		set v_faire=0;
	end if;
-- call ap_debog ('lec_dep_recurs 4');
	set v_niv2=p_niveau+1;
	if (v_faire>0 and v_niv2<32 and v_niv2<=p_profondeur) then-- Nombre d'imbrication dans T-sql doit �tre inf�rieur a 32
-- call ap_debog ('lec_dep_recurs 5');
		if (p_sens = 'B') then
			if (p_nom_tab = 'prsaaa') then
				set v_nb=0;
			else
				set v_faire=1;
			end if;
		else
			set v_faire=1;
		end if;
		if (v_faire>0) then
-- call ap_debog ('lec_dep_recurs 6');
			if (p_sens = 'B') then
				open c_cles_b;
			else
				open c_cles_h;
			end if;
-- call ap_debog ('lec_dep_recurs 7');
			set v_curseur_ok=1;
			while(v_curseur_ok=1) do
				if(p_sens = 'B') then
					fetch c_cles_b into v_nom_tab_fk,v_nom_col_fk,v_nom_col_fk_pk;
				else
					fetch c_cles_h into v_nom_tab_pk,v_nom_col_fk,v_nom_col_fk_pk;
				end if;
				if(v_curseur_ok=1) then
-- call ap_debog ('lec_dep_recurs 8');
--					delete from temp_tab_id where niveau=p_niveau;
--				create temporary table temp_tab_id (ind int not null auto_increment, primary key(ind),id int);
					if (p_sens = 'B') then
--						select @sql='declare lect_id cursor global for select '+@nom_pk+' from '+@nom_tab2+' where '+@nom_col2+'='+convert(varchar,@id)
-- call ap_debog ('6');
						set v_nom_tab2=v_nom_tab_fk;
						set v_req_sql=concat('insert into temp_tab_id(niveau,id) select ',p_niveau,',',v_nom_col_fk_pk,' from ',v_nom_tab2,' where ',v_nom_col_fk,'=',convert(p_id,char));
-- call ap_debog ('7');
-- call ap_debog(v_req_sql);
-- call ap_debog ('7 bis');
--						set @sql=concat('create or replace view temp_id as select ',v_nom_col_fk_pk,' as id from ',v_nom_tab2,' where ',v_nom_col_fk,'=',convert(p_id,char));
					else
						set v_req_sql=concat('insert into temp_tab_id(niveau,id) select ',p_niveau,',',v_nom_col_fk,' from ',p_nom_tab,' where ',v_nom_col_fk_pk,'=',convert(p_id,char));
--						select @sql='declare lect_id cursor global for select '+@nom_col+' from '+@nom_tab+' where id_'+@nom_tab+'='+convert(varchar,@id)
-- call ap_debog ('6');
						set v_nom_tab2=v_nom_tab_pk;
--						set @sql=concat('create or replace view temp_id as select ',v_nom_col_fk,' as id from ',p_nom_tab,' where ',v_nom_col_fk_pk,'=',convert(p_id,char));
-- call ap_debog ('7');
					end if;
					if(v_debog=1) then
						call ap_debog(concat('sql dyn=',v_req_sql));
					end if;
-- print 'sql='+isnull(@sql,'sql')
--					call sp_executesql (v_sql);
					set @sql=v_req_sql;
					prepare stmt from @sql;
					execute stmt;
					deallocate prepare stmt;
-- call ap_debog('apres exec sql dyn');
					open c_id;
					set v_curseur_ok=1;
					while(v_curseur_ok=1) do
						fetch c_id into v_id2;
						if(v_curseur_ok=1) then
							if (v_id2>0) then
								select count(*) into v_nb_dep from temp_dep;
-- call ap_debog(concat('v_nb_dep=',v_nb_dep));
								if (v_nb_dep < p_max_lignes) then
									set v_niv2=p_niveau+1;
-- call ap_debog(concat('v_niv2=',v_niv2));
									if (v_niv2<32 and v_niv2<=p_profondeur) then -- Nombre d'imbrication dans T-sql doit �tre inf�rieur � 32
										if(v_debog=1) then
											call ap_debog(concat('avant appel recursif(',p_sens,',',v_nom_tab2,',',v_id2,',',v_niv2,')'));
										end if;
										call lec_dep_recurs (p_sens,v_nom_tab2,v_id2,v_niv2,p_max_lignes,p_profondeur,v_retour_recurs);
										if(v_debog=1) then
											call ap_debog('apres appel recursif');
										end if;
									end if;
								end if;
							end if;
						end if;
					end while;
					if(v_debog=1) then
						call ap_debog('fin boucle sur les id');
					end if;
					delete from temp_tab_id where niveau=p_niveau;
					close c_id;
					set v_curseur_ok=1;
				end if;
				set v_i=v_i+1;
			end while;
			if(p_sens='B')then
				close c_cles_b;
			else
				close c_cles_h;
			end if;
			if(v_debog=1) then
				call ap_debog('fin boucle sur les cles');
			end if;
		end if;
	end if;
	set p_retour='OK';
-- print 'fin de lec_dep_recurs('+@sens+','+@nom_tab+','+convert(varchar,@id)+','+convert(varchar,@niveau)+','+convert(varchar,@profondeur)+')'
end


-- AZ_init_cbo 13/06/2023

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



--lec_dependances 13/06/2023
begin
	declare	v_fini int;
	declare	v_tab_id_tmp varchar(500);
	declare	v_pos int;
	declare	v_id int;
	declare	v_tmp varchar(500);
	declare	v_msmt bit;
	declare v_nb int;
	declare v_ret_recurs char(2);
SET @@GLOBAL.max_sp_recursion_depth = 7;
SET @@SESSION.max_sp_recursion_depth = 7;
-- print 'lec_dependances('+@sens+','+@nom_tab+','+@tab_id+','+convert(varchar,@max_lignes)+','+convert(varchar,@profondeur)+')'
	select locate(';',p_tab_id) into v_pos;
	if (v_pos = 0) then
		set p_tab_id=concat(p_tab_id,';');
	end if;
	select count(*) into v_nb from information_schema.innodb_temp_table_info where name='temp_dep'; -- where n_cols=8;
-- call ap_debog(concat('nb pour temp_dep=',v_nb));
	if(v_nb = 0) then
--		 call ap_debog('avant creer temp table');
		create temporary table temp_dep (id_dep int not null auto_increment,primary key(id_dep),niv int,nom_tab varchar(40),id int,info varchar(300));
	else
		delete from temp_dep;
	end if;
	/*
	select count(*) into v_nb from information_schema.innodb_temp_table_info where n_cols=6; -- where name='temp_dep';
-- call ap_debog(concat('nb pour temp_tab_cle=',v_nb));
	if(v_nb = 0) then
		create temporary table temp_tab_cle (ind int not null auto_increment,primary key(ind),niveau int,nom_col varchar(80),nom_tab2 varchar(80),nom_col2 varchar(80),nom_pk varchar(80));
	end if;
	*/
	select count(*) into v_nb from information_schema.innodb_temp_table_info where name='temp_tab_id'; -- where n_cols=6;
-- call ap_debog(concat('nb pour temp_tab_id=',v_nb));
	if(v_nb = 0) then
		create temporary table temp_tab_id (ind int not null auto_increment,primary key(ind),niveau int,id int);
	else
		delete from temp_tab_id;
	end if;
-- call ap_debog ('lec_dep_recurs 2');
-- call ap_debog('apres creer temp table');
	set v_fini=0;
	set v_tab_id_tmp=p_tab_id;
	while (v_fini = 0) do
-- call ap_debog('avant locate');
		select locate(';',v_tab_id_tmp) into v_pos;
-- call ap_debog(concat('apres locate, v_pos=',v_pos));
-- call ap_debog(concat('v_tab_id=',v_tab_id_tmp,', v_pos=(',v_pos,')'));
-- print 'pos='+convert(varchar,@pos)
		if (v_pos <= 0) then
			set v_fini=1;
		else
			if (v_pos > 1) then
-- call ap_debog(concat('avant v_id=substring..:tab_id_tmp=(',v_tab_id_tmp,'), v_pos=',v_pos));
				set v_id=substring(v_tab_id_tmp,1,v_pos-1);
-- call ap_debog('apres v_id=substring...');
--				set v_id=convert(v_tmp as int(10));
-- print 'id='+convert(varchar,@id)
-- print 'profondeur='+convert(varchar,@profondeur)
-- call ap_debog('avant appel lec_dep_recurs');
				call lec_dep_recurs (p_sens,p_nom_tab,v_id,0,p_max_lignes,p_profondeur,v_ret_recurs);
-- call ap_debog('apres appel lec_dep_recurs');
			end if;
-- call ap_debog('avant v_tmp');
			select substring(v_tab_id_tmp,v_pos+1,999) into v_tmp;
-- call ap_debog('apres v_tmp');
			set v_tab_id_tmp=v_tmp;
-- call ap_debog(concat('apres v_tab_id, v_tab_id_tmp=',v_tab_id_tmp));
		end if;
	end while;
-- call ap_debog('avant drop tab_id');
--	drop table temp_tab_id;
-- call ap_debog('avant drop tab_cle');
--	drop table temp_tab_cle;
-- call ap_debog('apres drop tab_cle');
--	select @msmt=msmt from prj
--	select id_dep,niv,nom_tab,isnull(sql,dbo.fct_rep_dependances(nom_tab,id,@msmt)) as rep,id from #dep order by id_dep
--	select id_dep,niv,nom_tab,dbo.fct_rep_dependances(nom_tab,id,@msmt) as rep,id from #dep order by id_dep
--	select id_dep,niv,nom_tab,fct_rep(nom_tab,id) as rep,id,info from temp_dep order by id_dep;
-- insert into debog(msg) select concat(id_dep,',',niv,',',nom_tab,',',id,',',info) from temp_dep;
-- call ap_debog('apres insert into temp_dep');
	select niv,case isnull(lib_tab) when 1 then t.nom_tab else lib_tab end as nom_tab,id,fct_rep(t.nom_tab,id) as rep,info
	from temp_dep t left outer join AZtab on t.nom_tab=AZtab.nom_tab order by id_dep;
--	drop table temp_tab_cle;
	drop table temp_tab_id;
	drop table temp_dep;
end


-- fct_rep 13/06/2023

begin
	declare rep varchar(500) default '';
	declare id_bis int;
	declare id_ter int;
	declare v_temp varchar(500);
	if(nom_tab='AZecr') then
		select nom_ecr into rep from AZecr where id_AZecr=id;
	elseif(nom_tab='AZonglet') then
		select entete into rep from AZonglet where id_AZonglet=id;
	elseif(nom_tab='AZtype_champ') then
		select nom_type_champ into rep from AZtype_champ where id_AZtype_champ=id;
	elseif(nom_tab='cmpt') then
		select nom_cmpt into rep from cmpt where id_cmpt=id;
    elseif(nom_tab='instr') then
		select nom_instr into rep from instr where id_instr=id;
    elseif(nom_tab='lieu') then
		select nom_lieu into rep from lieu where id_lieu=id;
	elseif(nom_tab='interv') then
		select concat(convert(i.date_interv,char)," ; ",i.comm_interv) into rep from interv i
		where i.id_interv=id;
	elseif(nom_tab='prs') then
		select concat(nom_prs,' ',prenom_prs) into rep from prs where id_prs=id;
	elseif(nom_tab='seance') then
		select nom_seance into rep from seance where id_seance=id;
	else
		set rep=concat(nom_tab,id);
	end if;
	return rep;
end


-- create table info_sch_fk

create table info_sch_fk (
    nom_tab_fk varchar(30),
    nom_col_fk varchar(30),
    nom_col_fk_pk varchar(30),
    nom_tab_pk varchar(30),
    nom_col_pk varchar(30)
) engine=innodb;
create unique index i_info_sch_bas_1 on info_sch_fk(nom_tab_fk,nom_col_fk);
insert into info_sch_fk
        select RC.TABLE_NAME,KCU.COLUMN_NAME,kcu3.column_name,rc.referenced_table_name,KCU2.COLUMN_NAME
        FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC
        inner join INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK on FK.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA and FK.CONSTRAINT_NAME = RC.CONSTRAINT_NAME and FK.CONSTRAINT_TYPE = 'FOREIGN KEY'
        inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU on KCU.CONSTRAINT_NAME=RC.CONSTRAINT_NAME and kcu.constraint_schema=rc.constraint_schema
        inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2 on KCU2.TABLE_NAME=RC.referenced_TABLE_NAME and kcu2.constraint_name='PRIMARY' and kcu2.constraint_schema=rc.constraint_schema
        inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU3 on KCU3.TABLE_NAME=RC.TABLE_NAME and kcu3.constraint_name='PRIMARY' and kcu3.constraint_schema=rc.constraint_schema
        where rc.constraint_name like 'fk%' and rc.constraint_schema='test_comptines';


begin
	if (p_etat ='U') then
		update seance_cmpt set id_cmpt=p_id_cmpt,numero=p_numero,intermede=p_intermede
        where id_seance_cmpt=p_id_seance_cmpt;
	elseif (p_etat = 'I') then
		insert into seance_cmpt (id_seance,id_cmpt,numero,intermede) values (p_id_seance,p_id_cmpt,p_numero,p_intermede);
	elseif (p_etat = 'D') then
		delete from seance_cmpt where id_seance_cmpt=p_id_seance_cmpt;
	end if;
end


--
ALTER TABLE `typublic_cmpt`
  ADD CONSTRAINT `fk_typublic_cmpt__cmpt` FOREIGN KEY (`id_cmpt`) REFERENCES `cmpt` (`id_cmpt`),
  ADD CONSTRAINT `fk_typublic_cmpt__typublic` FOREIGN KEY (`id_typublic`) REFERENCES `typublic` (`id_typublic`),
  ADD CONSTRAINT `typublic_ibfk_1` FOREIGN KEY (`id_seance`) REFERENCES `seance` (`id_seance`),
  ADD CONSTRAINT `typublic_ibfk_2` FOREIGN KEY (`id_cmpt`) REFERENCES `cmpt` (`id_cmpt`);

  //ALTER TABLE `seance_cmpt`
  ADD CONSTRAINT `fk_seance_cmpt__cmpt` FOREIGN KEY (`id_cmpt`) REFERENCES `cmpt` (`id_cmpt`),
  ADD CONSTRAINT `fk_seance_cmpt__seance` FOREIGN KEY (`id_seance`) REFERENCES `seance` (`id_seance`),
  ADD CONSTRAINT `seance_cmpt_ibfk_1` FOREIGN KEY (`id_seance`) REFERENCES `seance` (`id_seance`),
  ADD CONSTRAINT `seance_cmpt_ibfk_2` FOREIGN KEY (`id_cmpt`) REFERENCES `cmpt` (`id_cmpt`);
COMMIT;

ALTER TABLE `cmpt`
  ADD CONSTRAINT `fk_cmpt__typublic` FOREIGN KEY (`id_typublic`) REFERENCES `typublic` (`id_typublic`);

--
DROP PROCEDURE IF EXISTS `AZcmptSelect`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZcmptSelect` ()  begin
	SELECT '' as etat,c.id_cmpt,c.nom_cmpt,c.id_instr,i.nom_instr as id_instrWITH,c.id_theme,t.nom_theme as id_themeWITH,tp.id_typublic,tp.nom_typublic as id_typublicWITH,(SELECT count(*) FROM `seance_cmpt` as sc WHERE sc.id_cmpt=c.id_cmpt) as nb
    FROM `cmpt` as c
    LEFT JOIN `instr` as i ON c.id_instr=i.id_instr
	LEFT JOIN `theme` as t ON c.id_theme=t.id_theme
	LEFT JOIN `typublic` as tp ON c.id_typublic=tp.id_typublic
    ORDER BY nom_cmpt;
 end$$


 DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZtypublicSelect`()
begin
	SELECT '' as etat,id_typublic,nom_typublic
    FROM `typublic`
    ORDER BY id_typublic;
 end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AZtypublicMaj`(IN `p_etat` CHAR, IN `p_id_typublic` INT, IN `p_nom_typublic` VARCHAR(30))
begin
	if (p_etat ='U') then
		update typublic set nom_typublic=p_nom_typublic where id_typublic=p_id_typublic;
	elseif (p_etat = 'I') then
		insert into typublic (nom_typublic) values (p_nom_typublic);
	elseif (p_etat = 'D') then
		delete from typublic where id_typublic=p_id_typublic;
	end if;
end$$
DELIMITER ;

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
	elseif (p_nom_tab='typublic') then
		select id_typublic,nom_typublic from typublic order by 2;
	elseif (p_nom_tab='interv') then
		select id_interv,num_interv from interv order by 2;
	elseif (p_nom_tab='dbdicttype') then
		select id_dbdicttype,lib_dbdicttype from dbdicttype order by 2;
	end if;
end


-- MAJ 19/06/2023 AZinterv_interv__cmptSelect
begin
	select '' as etat,i.id_interv,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,c.id_cmpt,c.nom_cmpt as id_cmptWITH,c.id_typublic,tp.id_typublic,tp.nom_typublic as id_typublicWITH,ic.ordre,ic.id_cmpt,ic.id_interv_cmpt
    from interv i
    left join lieu l on l.id_lieu=i.id_lieu
    left join interv_cmpt ic on i.id_interv=ic.id_interv
    left join cmpt c on c.id_cmpt=ic.id_cmpt
	left join typublic tp on tp.id_typublic=c.id_typublic
	where ic.id_interv=p_id_interv;
end



--AZinterv__seance_cmptSelect
begin
	select '' as etat,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,i.id_seance,sc.id_seance_cmpt,c.id_cmpt,c.nom_cmpt,tp.id_typublic,tp.nom_typublic as id_typublicWITH
	from interv i
	left join lieu l on l.id_lieu=i.id_lieu
	left join seance_cmpt sc on i.id_seance=sc.id_seance
	left join cmpt c on c.id_cmpt=sc.id_cmpt
	left join typublic tp on tp.id_typublic=c.id_typublic
	where id_interv=p_id_interv and i.id_seance is not null;
end



-- en cours
begin
	select '' as etat,concat(i.date_interv,' ',l.nom_lieu) as id_intervWITH,i.id_seance,sc.id_seance_cmpt,sc.numero,sc.seq,sc.intermede,c.id_cmpt,c.nom_cmpt,tp.id_typublic,tp.nom_typublic as id_typublicWITH
	from interv i
	left join lieu l on l.id_lieu=i.id_lieu
	left join seance_cmpt sc on i.id_seance=sc.id_seance
	left join cmpt c on c.id_cmpt=sc.id_cmpt
	left join typublic tp on tp.id_typublic=c.id_typublic
	where id_interv=p_id_interv and i.id_seance is not null
	order by sc.numero;
end
--
--AZseance__seance_cmptSelect
begin
	select '' as etat,c.id_cmpt,c.nom_cmpt as id_cmptWITH,c.id_instr,i.nom_instr,sc.id_cmpt,sc.id_seance_cmpt,sc.id_seance,sc.numero,sc.intermede
	from seance_cmpt sc
    left join cmpt c on sc.id_seance=p_id_seance
    left join instr i on i.id_instr=c.id_instr
    where sc.id_cmpt=c.id_cmpt and nom_cmpt=c.nom_cmpt
	order by sc.numero;
end
begin
	select '' as etat,c.id_cmpt,c.nom_cmpt as id_cmptWITH,c.id_instr,i.nom_instr,sc.id_cmpt,sc.id_seance_cmpt,sc.id_seance,sc.numero,sc.intermede
	from seance_cmpt sc
    left join cmpt c on sc.id_seance=p_id_seance
    left join instr i on i.id_instr=c.id_instr
	order by sc.numero;
end

--AZseance__seance_cmptMaj
begin
	if (p_etat ='U') then
		update seance_cmpt set id_cmpt=p_id_cmpt,id_seance=p_id_seance
        where id_seance_cmpt=p_id_seance_cmpt;
	elseif (p_etat = 'I') then
		insert into seance_cmpt (id_seance,id_cmpt) values (p_id_seance,p_id_cmpt);
	elseif (p_etat = 'D') then
		delete from seance_cmpt where id_seance_cmpt=p_id_seance_cmpt;
	end if;
end

--AZ_seance__seance_cmptMaj 
begin
	if (p_etat ='U') then
		update seance_cmpt set id_cmpt=p_id_cmpt,numero=p_numero,seq=p_seq,intermede=p_intermede
        where id_seance_cmpt=p_id_seance_cmpt;
	elseif (p_etat = 'I') then
		insert into seance_cmpt (id_seance,id_cmpt,numero,seq,intermede) values (p_id_seance,p_id_cmpt,p_numero,p_seq,p_intermede);
	elseif (p_etat = 'D') then
		delete from seance_cmpt where id_seance_cmpt=p_id_seance_cmpt;
	end if;
end