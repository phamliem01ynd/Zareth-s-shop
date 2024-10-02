import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { Product } from '../../common/Product';
import { CartService } from '../../services/cart.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  product!: Product;

  discount!: number;
  amount!: number;
  amountReal!: number;
  quantity : number = 1;
  error:string="";
  
  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService) {

  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.discount = 0;
    this.amount = 0;
    this.amountReal = 0;
    this.getAllItem();
  }
  getAllItem() {
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
        this.cartDetails = data as CartDetail[];
        this.cartService.setLength(this.cartDetails.length);
        this.cartDetails.forEach(item => {
          this.amountReal += item.product.price * item.quantity;
          this.amount += item.price;
        })
        this.discount = this.amount - this.amountReal;
      })
    })
  }

  update(id: number, quantity: number) {

    this.cartService.getOneDetail(id).subscribe(data => {
      this.cartDetail = data as CartDetail;
      if (quantity >= this.cartDetail.product.quantity || quantity == this.cartDetail.product.quantity) {
        this.toastr.warning("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này")
      
        this.cartDetail.quantity = this.cartDetail.product.quantity;
        this.cartDetail.price = (this.cartDetail.product.price * (1 - this.cartDetail.product.discount / 100)) * this.cartDetail.quantity;
        this.cartService.updateDetail(this.cartDetail).subscribe(data => {
          this.ngOnInit();
        }, error => {
          this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
        })
      } else {
        this.cartDetail.quantity = quantity;
        this.cartDetail.price = (this.cartDetail.product.price * (1 - this.cartDetail.product.discount / 100)) * this.cartDetail.quantity;
        this.cartService.updateDetail(this.cartDetail).subscribe(data => {
          this.ngOnInit();
        }, error => {
          this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
        })
      }
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteDetail(id).subscribe(data => {
          this.toastr.success('Xoá thành công!', 'Hệ thống');
          this.ngOnInit();
        }, error => {
          this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  // public getImageByProduct(imageBase64: string): any {
  //   if (imageBase64 != null && imageBase64 != undefined && imageBase64 != '') {
  //     const img = new Image();
  //     img.src = `data:image/jpeg;base64,${imageBase64}`;
  //     return img.src;
  //   }
  //   return null;
  // }
  // plusQuantity(){
  //   if(this.quantity<this.product.quantity){
  //   this.quantity += 1;}
  //   if(this.quantity==this.product.quantity){
  //     this.error="Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này";
  //   }
   
  // }
  // subtractQuantity(){
  //   if(this.quantity > 1){
  //     this.quantity -= 1;
  //     this.error="";
  //   }
  // }

}
