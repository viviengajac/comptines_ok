import { Injectable } from '@angular/core';
//import { FileSaver } from 'file-saver';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService
{
//	constructor(public fileSaver:FileSaver){}
	public exportAsExcelFile(nom_onglets: string[], json: any[], excelFileName: string): void
	{
//console.log('debut de exportAsExcelFile');
		var i:number;
//console.log('1');
		var classeur: XLSX.WorkBook=XLSX.utils.book_new();
//console.log('2');
		var feuilles: XLSX.WorkSheet[];
//console.log('3');
//		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		for(i=0;i<json.length;i++)
		{
//console.log('4');
			var feuille:XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[i]);
//console.log('5');
			var nom_feuille: string=nom_onglets[i];
// console.log('nom_feuille='+nom_feuille);
			XLSX.utils.book_append_sheet(classeur, feuille, nom_feuille);
//console.log('6');
		}
//console.log('7');
//		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(classeur, { bookType: 'xlsx', type: 'array' });
//		var nom_fic=excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
//console.log('8');
		var maintenant=formatDate(new Date(),'yyyyMMddHHmmss', 'en');
//console.log('10: maintenant='+maintenant);
		var nom_fic=excelFileName + '_export_' + maintenant + EXCEL_EXTENSION;
//console.log('nom_fic='+nom_fic);
//		this.saveAsExcelFile(excelBuffer, nom_fic);
		XLSX.writeFile(classeur,nom_fic);
	}
	/*
	private saveAsExcelFile(buffer: any, fileName: string): void
	{
		const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
//		var fileSaver: FileSaver;
//console.log('classe de fileSaver='+fileSaver.constructor.name);
		FileSaver.saveAs(data, fileName);
	}
	*/
}
