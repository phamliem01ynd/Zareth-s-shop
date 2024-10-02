import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../common/Order';
import { OrderDetail } from '../../common/OrderDetail';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderDetails!: OrderDetail[];
  order!: Order;

  @Input() id!: number;

  constructor(private modalService: NgbModal, private orderService: OrderService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getOrder();
    this.getItems();
  }

  getOrder() {
    this.orderService.getById(this.id).subscribe(data => {
      this.order = data as Order;
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getItems() {
    this.orderService.getByOrder(this.id).subscribe(data => {
      this.orderDetails = data as OrderDetail[];
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  finish() {
    this.ngOnInit();
  }

  // public getImageByProduct(imageBase64: string): any {
  //   if (imageBase64 != null && imageBase64 != undefined && imageBase64 != '') {
  //     const img = new Image();
  //     img.src = `data:image/jpeg;base64,${imageBase64}`;
  //     return img.src;
  //   }
  //   return null;
  // }
}
