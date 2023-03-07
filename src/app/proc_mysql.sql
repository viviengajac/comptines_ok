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



--AZinterv_intervMaj
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
--
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
--

--AZlieuMaj  // pour éviter les erreurs quand lat_lieu et/ou lon_lieu ne sont pas renseignés
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
--
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
	elseif (p_nom_tab='dbdicttype') then
		select id_dbdicttype,lib_dbdicttype from dbdicttype order by 2;
	end if;
end
--
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