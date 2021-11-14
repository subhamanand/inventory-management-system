import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import "datatables.net";
import 'sweetalert2/src/sweetalert2.scss'
import { MatDialog } from '@angular/material/dialog';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  constructor(public dialog: MatDialog, private http: HttpClient, private router: Router) {}


  username: string;
  products: any;
  productCategoryList:any=[];
  productIdList:any=[];
  categorySelected: any;
  selectedProductPrice: any;
  productID:string;
  productName:string;
  productDescription:string;
  productCategory:string;
  productUnits:number;
  token:string;
  httpOptions:any={};


  ngOnInit(): void {
    this.token=localStorage.getItem('token');
    if(this.token==null)
    {
      this.router.navigate(["login"]);

    }
    else{
      var decoded_data = jwt_decode(localStorage.getItem('token'));
      this.username = decoded_data['name'];

    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': this.token
      })
    };
    this.getAllProducts();


  }

  addProduct() {

    var reqBody = {
      "productID": this.productID,
      "productName": this.productName,
      "productDescription": this.productDescription,
      "productCategory": this.productCategory,
      "productUnits": this.productUnits
    };
 
    this.http.post(environment.backendApiUrl + 'add_product', reqBody,this.httpOptions).subscribe(data => {

      if(data['status']==201)
      {
        this.getAllProducts();
        this.closeModal('add');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product Created Successfully',
          showConfirmButton: true
        })
        
      }
      else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }

     
    })

    this.productID=null;
    this.productName=null;
    this.productCategory=null;
    this.productDescription=null;
    this.productUnits=null;
  }

  updateProduct()
  {

    var reqBody = {
      "productID": this.productID,
      "productName": this.productName,
      "productDescription": this.productDescription,
      "productCategory": this.productCategory,
      "productUnits": this.productUnits
    };
    
    this.http.put(environment.backendApiUrl + 'update_product', reqBody,this.httpOptions).subscribe(data => {

      if(data['status']==201)
      {
        this.getAllProducts();
        this.closeModal('update');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product Updated Successfully',
          showConfirmButton: true
        })
      }
      else{

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }

    })

    this.productID=null;
    this.productName=null;
    this.productCategory=null;
    this.productDescription=null;
    this.productUnits=null;

  }

  deleteProduct(){

    this.http.delete(environment.backendApiUrl + 'delete_product?id='+this.productID,this.httpOptions).subscribe(data => {

      if(data['status']==200)
      {
        this.getAllProducts();
        this.closeModal('delete');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product Deleted Successfully',
          showConfirmButton: true
        })

      }
      else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }
     
    })

    this.productID=null;
    this.productName=null;
    this.productCategory=null;
    this.productDescription=null;
    this.productUnits=null;

  }

  getAllProducts() {

    this.http.get(environment.backendApiUrl + 'get_all_products',this.httpOptions).subscribe(data => {
      if(data['status']==200)
      {
        this.products = data["product_list"];
        this.productCategoryList=[];
        this.productIdList=[];
        data["product_list"].forEach(element => {
        this.productCategoryList.push(element['category']);
        this.productIdList.push(element['id']);

        });
        
        var prouductCategorySet = new Set(this.productCategoryList);
        this.productCategoryList=Array.from(prouductCategorySet);


        $("#products_table").DataTable().destroy();
        $(document).ready(function () {
          $('#products_table').DataTable({
            // "scrollY":        "200px",
            // "pagingType": "full_numbers",
            // "paging":         true,
            // "iDisplayLength": 10,
            // dom: 'Bfrtip',
            // lengthMenu: [
            //   [100, -1],
            //   ['100 rows', 'Show all']
            // ],

          });
        });

      }
      else
      {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }
      
    });

  }

  selectCategory(categorySelected) {
    
    this.http.get(environment.backendApiUrl + 'get_all_products?category='+categorySelected,this.httpOptions).subscribe(data => {

      if(data['status']==200)
      {
        this.products = data["product_list"];
        $("#products_table").DataTable().destroy();
        $(document).ready(function () {
          $('#products_table').DataTable({
            // "pagingType": "full_numbers",
            // dom: 'Bfrtip',
            // lengthMenu: [
            //   [100, -1],
            //   ['100 rows', 'Show all']
            // ],
            // "paging": false
  
          });
        });

      }
      else{
          Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }
      
   


      



    })


  }

  selectID(idSelected)
  {

    this.http.get(environment.backendApiUrl + 'get_product_by_id?id='+idSelected,this.httpOptions).subscribe(data => {

      if(data['status']==200)
      {
        this.productName=data['name'];
        this.productCategory=data['category'];
        this.productUnits=data['units'];
        this.productDescription=data['description']
        this.productID=idSelected
      }
      else{
          Swal.fire({
          position: 'center',
          icon: 'error',
          title: data['message'],
          showConfirmButton: true
        })

      }
      

    });

  }

  getModal(type){
    if(type=='add')
    {
      var modal = document.getElementById("addProductModal");
      modal.style.display = "block";
    }
    else if(type=='update')
    {
      var modal = document.getElementById("updateProductModal");
      modal.style.display = "block";
    }
    else
    {
      var modal = document.getElementById("deleteProductModal");
      modal.style.display = "block";
    }
    
  }

  closeModal(type){
    if(type=='add')
    {
      var modal = document.getElementById("addProductModal");
      modal.style.display = "none";
    }
    else if(type=='update')
    {
      var modal = document.getElementById("updateProductModal");
      modal.style.display = "none";
    }
    else
    {
      var modal = document.getElementById("deleteProductModal");
      modal.style.display = "none";
    }
    
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate([''])
  }
}
