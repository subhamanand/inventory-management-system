import pymysql
import configparser
config = configparser.ConfigParser()
config.read('config.ini')

def get_db_conection():

    try:
        host = config['DBINFO']['host']
        user = config['DBINFO']['user']
        password = config['DBINFO']['password']
        database = config['DBINFO']['database']
        db = pymysql.connect(
            host=host, user=user, passwd=password, db=database)
        return db
    except pymysql.err.MySQLError as e:
        print('Error: ',str(e))
        raise pymysql.err.MySQLError

    except pymysql.err.DatabaseError as e:
        print('Error: ',str(e))
        raise pymysql.err.DatabaseError

    except Exception as e:
        print('Error: ',str(e))
        raise pymysql.err.MySQLError
