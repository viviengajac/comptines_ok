import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferencesComponent } from './ecrans/references.component';
import { IntervComponent } from './ecrans/interv.component';
import { SeanceComponent } from './ecrans/seance.component';
import { LecDirComponent } from './AZ_lecdir/lecdir.component';
import { MenuComponent } from './menu/menu.component';
import { ReqComponent } from './ecrans/req.component';
import { DependancesComponent } from './dependances/dependances.component';
import { CarteComponent } from './carte/carte.component';
import { DBDictComponent } from './ecrans/dbdict.component';
//import { ConnexComponent } from './connex/connex.component';

const routes: Routes =
[
	{ path: 'menu', component: MenuComponent },
	{ path: 'interv', component: IntervComponent },
	{ path: 'seance', component: SeanceComponent },
	{ path: 'dbdict', component: DBDictComponent },
	{ path: 'fic', component: LecDirComponent },
	{ path: 'req', component: ReqComponent },
	{ path: 'dependances', component: DependancesComponent },
	{ path: 'references/:nom_ecran', component: ReferencesComponent },
	{ path: 'carte', component: CarteComponent },
//	{ path: '', component: MenuComponent },
//	{ path: 'not-found', component: MenuComponent },
	{ path: '**', redirectTo: 'not-found' }
];

@NgModule({
  // ne marche plus: imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
