from flask import request, jsonify
from flask_cors import CORS, cross_origin
from db_connection import *
import jwt
from . import routes
import configparser
from functools import wraps
config = configparser.ConfigParser()
config.read('config.ini')

prefix = '/admin'


def token_auth(f):
   @wraps(f)
   def decorator():
       token = None
       print(request.headers)
       if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
 
       if not token:
            return jsonify({'message': 'a valid token is missing','status':401})
       try:
            data = jwt.decode(token, config['AUTH']['secret_key'], algorithms=["HS256"])
            db = get_db_conection()
            cursor = db.cursor()
            cursor.execute(
                'SELECT * FROM user_details WHERE email_id = %s', (data['email'],))
            user = cursor.fetchone()
            print('user length',user)

       except pymysql.err.MySQLError:
            return jsonify({'message': 'Database connection error','status':500})

       except pymysql.err.DatabaseError:
            return jsonify({'message': 'Database connection error','status':500})        

       except Exception as e:
            return jsonify({'message': str(e),'status':401})
 
       return f(user)
   return decorator



@routes.route(prefix + '/register', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def register_user():
    content = request.get_json()
    email = content['email']
    name = content['name']
    phone = content['phone']
    age = content['age']
    country = content['country']
    password = content['password']

    try:
        db = get_db_conection()
        cursor = db.cursor()

        cursor.execute(
            'INSERT INTO user_details(email_id,name,phone,age,country,password) VALUES (%s,%s,%s,%s,%s,%s)',
            (email, name, phone, age, country, password))
        
        db.commit()
        return jsonify({"message": "Registered Successfully", "status": 201})

    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500})        

    except Exception as e:
        print(e)
        return jsonify({"message": "Error encountered","status": 400})
    finally:
        db.close()


@routes.route(prefix+'/login', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def user_login():
    try:
        if request.method == 'POST':
            db = get_db_conection()
            body = request.get_json()
            email = body['username']
            password = body['password']
            db = get_db_conection()
            cursor = db.cursor()
            cursor.execute(
                'SELECT * FROM user_details WHERE email_id = %s AND password = %s', (email, password,))
            account = cursor.fetchone()
            print(account)

            # if account exists in user_details table
            if account:
                encoded_data = jwt.encode({'id':account[6],'email': account[0],'name':account[2]}, config['AUTH']['secret_key'], algorithm='HS256')
                return jsonify({"encodedData":encoded_data, "status":200})
            else:
                return jsonify({"message":"Authorization failed","status":401})

    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500})        

    except Exception as e:
        print(e)
        db.close()
        return jsonify({"message":"Error encountered","status":500})
    finally:
        db.close()




@routes.route(prefix + '/add_product', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@token_auth
def add_product(user):
    print(user)
    try:
        if request.method == 'POST':
            body = request.get_json()
            productID = body['productID']
            productName = body['productName']
            productDescription = body['productDescription']
            productCategory = body['productCategory']
            productUnits = body['productUnits']
            db = get_db_conection()
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO products(id,category,name,description,units) VALUES (%s,%s,%s,%s,%s)', (productID, productCategory,productName,productDescription,int(productUnits)))
            db.commit()
            
            return jsonify({"message": "Product created","status": 201})

    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500})        

    except Exception as e:
        print(e)
        return jsonify({"message": str(e),"status": 500})
    finally:
        db.close()



@routes.route(prefix + '/update_product', methods=['PUT'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@token_auth
def update_product(user):
    try:
        if request.method == 'PUT':
            body = request.get_json()
            print('req',body)
            productID = body['productID']
            productName = body['productName']
            productDescription = body['productDescription']
            productCategory = body['productCategory']
            productUnits = body['productUnits']
            db = get_db_conection()
            cursor = db.cursor()
            cursor.execute(
                'UPDATE products set category=%s,name=%s,description=%s,units=%s where id=%s', (productCategory,productName,productDescription,int(productUnits),productID))
            db.commit()
            return jsonify({"message": "Product updated","status": 201})

    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500}) 

    except Exception as e:
        print(e)
        return jsonify({"message": str(e),"status": 500})
    finally:
        db.close()


@routes.route(prefix + '/delete_product', methods=['DELETE'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@token_auth
def delete_product(user):
    try:
        if request.method == 'DELETE':
            productID=request.args.get('id')           
            db = get_db_conection()
            cursor = db.cursor()
            cursor.execute(
                'DELETE from products where id=%s', (productID))
            db.commit()
            return jsonify({"message": "Product deleted","status": 200})
    
    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500}) 

    except Exception as e:
        print(e)
        return jsonify({"message": str(e),"status": 500})
    finally:
        db.close()


@routes.route(prefix + '/get_all_products', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@token_auth
def get_all_products(user):
    print(user)
    try:
        if request.method == 'GET':
            
            if request.args.get('category'):

                category=request.args.get('category')
                if category =='all':
                    product_list = []
                    db = get_db_conection()
                    cursor = db.cursor()
                    cursor.execute(
                        "SELECT * FROM products")
                    products=cursor.fetchall()
                    for product in products:
                        product_list.append({

                            "id": product[0],
                            "category":product[1],
                            "name": product[2],
                            "description":product[3],
                            "units":product[4]

                        })

                    return jsonify({"product_list": product_list,"status": 200})
                else:
                    product_list = []
                    db = get_db_conection()
                    cursor = db.cursor()
                    cursor.execute(
                        "SELECT * FROM products where category= %(category)s",{'category':category})
                    products=cursor.fetchall()
                    for product in products:
                        product_list.append({

                            "id": product[0],
                            "category":product[1],
                            "name": product[2],
                            "description":product[3],
                            "units":product[4]

                        })

                    return jsonify({"product_list": product_list,"status": 200})

            else:
                product_list = []
                db = get_db_conection()
                cursor = db.cursor()
                cursor.execute(
                    "SELECT * FROM products")
                products = cursor.fetchall()

                for product in products:
                    product_list.append({

                        "id": product[0],
                        "category":product[1],
                        "name": product[2],
                        "description":product[3],
                        "units":product[4]

                    })

                return jsonify({"product_list": product_list,"status": 200})
                
    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500}) 

    except Exception as e:
        print(e)
        return jsonify({"message": str(e),"status": 500})
    finally:
        db.close()


@routes.route(prefix + '/get_product_by_id', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@token_auth
def get_product_by_id(user):
    try:
        if request.method == 'GET':
            
            if request.args.get('id'):

                id=request.args.get('id')
                product_list = []
                db = get_db_conection()
                cursor = db.cursor()
                cursor.execute(
                    "SELECT * FROM products where id= %(id)s",{'id':id})
                products=cursor.fetchall()

                return jsonify({"category": products[0][1],"name": products[0][2],"description": products[0][3],"units": products[0][4],"status": 200})

    except pymysql.err.MySQLError:
        return jsonify({'message': 'Database connection error','status':500})

    except pymysql.err.DatabaseError:
        return jsonify({'message': 'Database connection error','status':500})                 

    except Exception as e:
        print(e)
        return jsonify({"message": str(e),"status": 500})
    finally:
        db.close()
