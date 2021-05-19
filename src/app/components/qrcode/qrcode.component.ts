import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  IterableDiffers,
  ViewChildren,
  Renderer2,
} from '@angular/core';
import { Window } from '@popperjs/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { QRCode } from 'src/app/models/studendtData';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QrcodeComponent implements OnInit, AfterViewInit {
  constructor(private renderer : Renderer2) {}
  mediaStreamTrack?: MediaStreamTrack;
  videoDevices: MediaDeviceInfo[] = [];
  navigator!: Navigator;
  stopCamera: boolean = false;
  ultimoLeido : QRCode = {fecha:'',contenido:'',estado:''};
  dataQR: string = '';
  newItemValue: string = '';
  placeholderAddButton: string = 'Ingrese el QR del Analitico';
  listScanner: QRCode[] = [];
  displayedColumns: string[] = [

    'Fecha',
    'Contenido',
    'Estado',
    'Copiar',
    'Eliminar',
  ];


  @ViewChild(QrScannerComponent, { static: false })
  qrScannerComponent!: QrScannerComponent;

  @ViewChild(MatTable) table!: MatTable<QRCode>;

  ngOnInit() {

  }

  ngAfterViewInit() {


    this.qrScannerComponent.getMediaDevices().then((devices) => {
      console.log(devices);

      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          this.videoDevices.push(device);
        }
      }
      if (this.videoDevices.length > 0) {
        let choosenDev;
        for (const dev of this.videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(this.videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe((result: any) => {
      console.log(result);
      this.addItemToList(result);
    });
  }

  deleteItem(index: number) {
    console.log(index);
    this.listScanner.splice(index, 1);
    console.log(this.listScanner);
    this.table.renderRows();
  }

  addItemToList(result: string) {
    console.log(result);
      let lastItem = new QRCode();
      const fecha = new Date();
      lastItem.contenido = result;
      lastItem.fecha = fecha.toLocaleDateString();
      lastItem.estado = 'Listado';
      this.listScanner.push(lastItem);
      this.table.renderRows();
      console.log(this.listScanner);
      this.ultimoLeido = this.listScanner[this.listScanner.length - 1];
  }
}
