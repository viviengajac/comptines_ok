import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule, AgGridAngular } from 'ag-grid-angular';
import { MenuComponent } from './menu/menu.component';
import { BtnVoirDocRendererComponent } from './AZ_renderers/btn-voir-doc-renderer.component';
import { BtnDefDocRendererComponent } from './AZ_renderers/btn-def-doc-renderer.component';
import { BtnDependancesRendererComponent } from './AZ_renderers/btn-dependances-renderer.component';
import { BoolRendererComponent } from './AZ_renderers/bool-renderer.component';
import { BoolRendererNonModifComponent } from './AZ_renderers/bool-renderer-non-modif.component';
import { DateEditorComponent } from './AZ_renderers/date-editor.component';
import { DatetimeEditorComponent } from './AZ_renderers/datetime-editor.component';
import { CboEditorComponent } from './AZ_renderers/cbo-editor.component';
import { TreeViewComponent } from './AZ_lecdir/treeview.component';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { MatInputModule} from '@angular/material/input';
import { ModalModule } from './AZ_modal/modal.module';
import { ReferencesComponent } from './ecrans/references.component';
import { IntervComponent } from './ecrans/interv.component';
import { SeanceComponent } from './ecrans/seance.component';
import { DBDictComponent } from './ecrans/dbdict.component';
import { LecDirComponent } from './AZ_lecdir/lecdir.component';
import { ReqComponent } from './ecrans/req.component';
import { DependancesComponent } from './AZ_dependances/dependances.component';
import { CarteComponent } from './carte/carte.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrjComponent } from './ecrans/prj.component';

//import { CboGridEditor } from './cbo-grid-editor/cbo-grid.editor';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BtnVoirDocRendererComponent,
    BtnDefDocRendererComponent,
    BtnDependancesRendererComponent,
    BoolRendererComponent,
    BoolRendererNonModifComponent,
    DateEditorComponent,
    DatetimeEditorComponent,
	  CboEditorComponent,
    ReferencesComponent,
    IntervComponent,
    SeanceComponent,
    LecDirComponent,
    TreeViewComponent,
    ReqComponent,
    DependancesComponent,
    CarteComponent,
    DBDictComponent,
    PrjComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ModalModule,
    AgGridModule,
    LeafletModule
    //AgGridModule.withComponents([BtnVoirDocRendererComponent,BtnDefDocRendererComponent,BtnDependancesRendererComponent,BoolRendererComponent,DateEditorComponent,DatetimeEditorComponent,CboEditorComponent])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
