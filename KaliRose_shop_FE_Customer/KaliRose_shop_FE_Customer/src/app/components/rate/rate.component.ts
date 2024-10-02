import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../common/Customer';
import { OrderDetail } from '../../common/OrderDetail';
import { Product } from '../../common/Product';
import { Rate } from '../../common/Rate';
import { CustomerService } from '../../services/customer.service';
import { RateService } from '../../services/rate.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  postForm: FormGroup;
  rate!: Rate;
  star: number = 5;

  modalReference!: any;

  @Input() orderDetail!: OrderDetail;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal,
    private rateService: RateService,
    private toastr: ToastrService,
    private sesionService: SessionService,
    private customerService: CustomerService) {
    this.postForm = new FormGroup({
      'id': new FormControl(0),
      'rating': new FormControl(5),
      'comment': new FormControl(null),
      'rateDate': new FormControl(new Date()),
      'user': new FormControl(null),
      'product': new FormControl(null),
      'orderDetail': new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.getRate();
  }

  getRate() {
    this.rateService.getByOrderDetail(this.orderDetail.orderDetailId).subscribe(data => {
      if (this.rate != null) {
        this.star = this.rate.rating;
        this.postForm = new FormGroup({
          'id': new FormControl(this.rate.id),
          'rating': new FormControl(this.rate.rating),
          'comment': new FormControl(this.rate.comment),
          'rateDate': new FormControl(this.rate.rateDate),
          'user': new FormControl(new Customer(this.rate.user.userId)),
          'product': new FormControl(new Product(this.rate.product.productId)),
          'orderDetail': new FormControl(new OrderDetail(this.rate.orderDetail.orderDetailId))
        })
      }
    }, error => {
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    })
  }

  rating() {
    let email = this.sesionService.getUser();

    this.customerService.getByEmail(email).subscribe(data => {
      if (this.postForm.value.id == 0) {
        this.rate = this.postForm.value;
        this.rate.rating = this.star;
        this.rate.orderDetail = this.orderDetail;
        this.rate.product = this.orderDetail.product;
        this.rate.user = data as Customer;

        this.rateService.post(this.rate).subscribe(date => {
          this.toastr.success('Đánh giá thành công!', 'Hệ thống');
          // this.modalService.dismissAll();
          this.modalReference.close();
        }, error => {
          this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
        })
      } else {
        this.rate = this.postForm.value;
        this.rate.rating = this.star;
        this.rateService.put(this.rate).subscribe(date => {
          this.toastr.success('Đánh giá thành công!', 'Hệ thống');
          // this.modalService.dismissAll();
          this.modalReference.close();
        }, error => {
          this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
        })
      }
    }, error => {
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content, { centered: true })
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
