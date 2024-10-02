import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ByCategoryComponent } from './components/by-category/by-category.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RateComponent } from './components/rate/rate.component';
import { SearchComponent } from './components/search/search.component';
import { SignFormComponent } from './components/sign-form/sign-form.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthGuard } from './guard/auth.guard';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPayPalModule } from 'ngx-paypal';
import { BillComponent } from './components/bill/bill.component';
import { DeliveryPolicyComponent } from './components/delivery-policy/delivery-policy.component';
import { ContactCustomerComponent } from './components/contact-customer/contact-customer.component';
import { ReturnPolicyComponent } from './components/return-policy/return-policy.component';
import { FaqComponent } from './components/faq/faq.component';
import { WarrantyPolicyComponent } from './components/warranty-policy/warranty-policy.component';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';

registerLocaleData(vi);



//  đường dẫn chuyển hướng website 
const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'all-product', component: AllProductComponent },
  { path: 'by-category/:id', component: ByCategoryComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'bill', component: BillComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'search/:keyword', component: SearchComponent },
  { path: 'search', component: AllProductComponent },
  { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuard] },
  { path: 'sign-form', component: SignFormComponent },
  { path: 'about', component: AboutComponent },
  { path: 'delivery-policy',component: DeliveryPolicyComponent},
  {path: 'size-guide',component:ContactCustomerComponent},
  {path: 'payment-guide',component:FaqComponent},
  {path: 'warranty-policy',component:WarrantyPolicyComponent},
  {path: 'return-policy',component:ReturnPolicyComponent},
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: NotFoundComponent },

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AllProductComponent,
    ByCategoryComponent,
    CartComponent,
    CheckoutComponent,
    NotFoundComponent,
    OrderDetailComponent,
    ProductDetailComponent,
    ProfileComponent,
    RateComponent,
    SearchComponent,
    SignFormComponent,
    ForgotPasswordComponent,
    FavoriteComponent,
    ContactComponent,
    AboutComponent,
    BillComponent,
    DeliveryPolicyComponent,
    ContactCustomerComponent,
    ReturnPolicyComponent,
    FaqComponent,
    WarrantyPolicyComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    OrderModule,
    NgxPayPalModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
    NgbModule,
    NzCarouselModule,
    NzIconModule,
     // NgModule,
     ToastrModule.forRoot({
      timeOut: 2500,
      // progressBar: true,
      progressAnimation: 'increasing',
      // preventDuplicates: true,
      closeButton: true,
      // newestOnTop: false,
    }),
  ],
  providers: [AuthGuard, Location, {provide: LocationStrategy, useClass: HashLocationStrategy}, { provide: NZ_I18N, useValue: vi_VN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
