import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { Customer } from '../../common/Customer';
import { Favorites } from '../../common/Favorites';
import { ImageDTO } from '../../common/ImageDTO';
import { Product } from '../../common/Product';
import { Rate } from '../../common/Rate';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { FavoritesService } from '../../services/favorites.service';
import { ImageService } from '../../services/image.service';
import { ProductService } from '../../services/product.service';
import { RateService } from '../../services/rate.service';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  [x: string]: any;

  product!: Product;
  products: Product[] = [];
  id!: number;
  isLoading = true;
  size!: string;
  public isValid: boolean = true;

  customer!: Customer;
  favorite!: Favorites;
  favorites: Favorites[] = [];
  totalLike!: number;

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails: CartDetail[] = [];

  rates: Rate[] = [];
  rateAll: Rate[] = [];
  countRate!: number;
  error: string = "";

  image!: ImageDTO;
  images: ImageDTO[] = [];

  itemsComment: number = 5;
  itemsSize: string = 'S';
  quantity: number = 1;
  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private favoriteService: FavoritesService,
    private sessionService: SessionService,
    private rateService: RateService,
    private imageService: ImageService,
  ) {
    route.params.subscribe(val => {

      this.ngOnInit();
    })
  }

  slideConfig = { "slidesToShow": 7, "slidesToScroll": 2, "autoplay": true };
  slideConfig1 = { "slidesToShow": 3, "slidesToScroll": 2, "autoplay": true };
  ngOnInit(): void {
    this.modalService.dismissAll();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.id = this.route.snapshot.params['id'];
    this.getProduct();
    this.getRates();
    this.getTotalLike();
    this.getAllRate();
    this.getImages();

  }

  setItemsComment(size: number) {
    this.getProduct();
    this.getRates();
    this.getTotalLike();
    this.getAllRate();

    this.itemsComment = size;
    console.log(this.itemsComment);

  }
  plusQuantity() {
    if (this.quantity < this.product.quantity) {
      this.quantity += 1;
    }
    if (this.quantity == this.product.quantity) {
      this.error = "Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này";
    }

  }
  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.error = "";
    }
  }
  getImages() {
    this.imageService.getByProduct(this.id).subscribe(data => {
      this.images = data as ImageDTO[];
    }, error => {
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    })
  }
  getProduct() {
    this.productService.getOne(this.id).subscribe(data => {
      this.isLoading = false;
      this.product = data as Product;
      this.productService.getSuggest(this.product.category.categoryId, this.product.productId).subscribe(data => {
        this.products = data as Product[];
      })
    }, error => {
      this.toastr.error('Sản phẩm không tồn tại!', 'Hệ thống');
      this.router.navigate(['/home'])
    })
  }

  getRates() {
    this.rateService.getByProduct(this.id).subscribe(data => {
      this.rates = data as Rate[];
    }, error => {
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    })
  }

  getAllRate() {
    this.rateService.getAll().subscribe(data => {
      this.rateAll = data as Rate[];
    })
  }

  getAvgRate(id: number): number {
    let avgRating: number = 0;
    this.countRate = 0;
    for (const item of this.rates) {
      if (item.product.productId === id) {
        avgRating += item.rating;
        this.countRate++;
      }
    }
    return this.countRate == 0 ? 0 : Math.round(avgRating / this.countRate * 10) / 10;

  }
  getAvgRatesp(id: number): number {
    let avgRating: number = 0;
    this.countRate = 0;
    for (const item of this.rateAll) {
      if (item.product.productId === id) {
        avgRating += item.rating;
        this.countRate++;
      }
    }
    return this.countRate == 0 ? 0 : Math.round(avgRating / this.countRate * 10) / 10;

  }

  toggleLike(id: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }

    this.favoriteService.getByProductIdAndEmail(id, email).subscribe(data => {
      if (data == null) {
        this.customerService.getByEmail(email).subscribe(data => {
          this.customer = data as Customer;
          this.favoriteService.post(new Favorites(0, new Customer(this.customer.userId), new Product(id))).subscribe(data => {
            this.toastr.success('Thêm thành côn sản phẩm!', 'Hệ thống');
            this.favoriteService.getByEmail(email).subscribe(data => {
              this.favorites = data as Favorites[];
              this.favoriteService.setLength(this.favorites.length);
              this.getTotalLike();
            }, error => {
              this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
            })
          }, error => {
            this.toastr.error('Thêm thất bại!', 'Hệ thống');
          })
        })
      } else {
        this.favorite = data as Favorites;
        this.favoriteService.delete(this.favorite.favoriteId).subscribe(data => {
          this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
          this.favoriteService.getByEmail(email).subscribe(data => {
            this.favorites = data as Favorites[];
            this.favoriteService.setLength(this.favorites.length);
            this.getTotalLike();
          }, error => {
            this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
          })
        }, error => {
          this.toastr.error('Lỗi!', 'Hệ thống');
        })
      }
    })
  }

  getTotalLike() {
    this.favoriteService.getByProduct(this.id).subscribe(data => {
      this.totalLike = data as number;
    })
  }

  addCart(productId: number, price: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }
    else {
      if (this.quantity > this.product.quantity) {
        this.toastr.warning("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này");
        this.quantity=this.product.quantity;
      }
      else {     
        this.cartService.getCart(email).subscribe(data => {
          this.cart = data as Cart;
          if (this.size == null) {
            this.toastr.warning('Hãy chọn kích thước sản phẩm', 'Hệ thống');
          }
          else {
            this.cartDetail = new CartDetail(0, this.quantity, price, new Product(productId), new Cart(this.cart.cartId), this.size);
            this.cartService.postDetail(this.cartDetail).subscribe(data => {
              this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
              this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
                this.cartDetails = data as CartDetail[];
                this.cartService.setLength(this.cartDetails.length);
              })
            }, error => {
              this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
              this.router.navigate(['/home']);
              window.location.href = "/";
            })
          }
        })
      }
    }

  }
  addCart1(productId: number, price: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }

    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.cartDetail = new CartDetail(0, this.quantity, price, new Product(productId), new Cart(this.cart.cartId), 'S');
      this.cartService.postDetail(this.cartDetail).subscribe(data => {
        this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
        this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
          this.cartDetails = data as CartDetail[];
          this.cartService.setLength(this.cartDetails.length);
        })
      }, error => {
        this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
        this.router.navigate(['/home']);
        window.location.href = "/";
      })

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
}
