import os,sys
import json
import requests
import argparse
import mariadb
from decimal import Decimal
from dotenv import dotenv_values, load_dotenv
from datetime import date, datetime

def custom_serializer(obj):
    """Convert non-serializable objects like Decimal and datetime to serializable types."""
    if isinstance(obj, Decimal):
        return float(obj)  # or str(obj) if you prefer
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()  # Converts date/datetime to an ISO 8601 string
    raise TypeError(f"Type {type(obj)} not serializable")


# config = dotenv_values(".env.prod")
load_dotenv('.env.prod')
def connect_db():
    try:
        
        conn = mariadb.ConnectionPool(
            user=f"{os.environ['DB_USER']}per",
            password=os.environ['DB_PASS'],
            host=os.environ['DB_HOST'],
            port=int(os.environ['DB_PORT']),
            pool_name="image",
            pool_size=1
        )
        # Instantiate Cursor
        return conn
 
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")

def get_data(maker):
    try:
        if ' ' in maker:
            maker = maker.replace(' ', '-')
        if '.' in maker:
            maker = maker.replace('.', '-')
        url = f"https://raw.githubusercontent.com/keycap-archivist/database/master/db/{maker}.json"
        res = requests.get(url=url)
        if res.status_code == 200:
            return json.loads(res.text)
        else:
            print(f"Couldn't get {maker}")
            return None
    except Exception as e:
        print(f"{e}")
        return None

def get_catalog():
    catalog = {}
    
    try:
        url = f"https://raw.githubusercontent.com/keycap-archivist/database/master/db/catalog.json"
        res = requests.get(url=url)
        if res.status_code == 200:
            data = json.loads(res.text)
            for x in data:
                catalog[x['id']] = x
            return catalog
        else:
            print(f"Couldn't get catalog")
            return None
    except Exception as e:
        print(f"{e}")
        return None

def parse_src(data, maker, sculpt, cw, cw_id):
    img = ''
    for x in data['sculpts']:
        n = x['name']
        if x['name'].lower() == sculpt.lower():
            for color in x['colorways']:
                cn = color['name']
                ci = color['img']
                try:
                    # if cw == 'S. Lime': 
                    #     print(x['name'], color['name'], color['id'], sculpt, cw, cw_id, color['img'])
                    if cw_id:
                        if color['id'].lower().strip() == cw_id.lower().strip():
                            img = color['img']
                    elif color['name'].lower().strip() == cw.lower().strip():
                        img = color['img']
                    else:
                        pass

                except Exception as e:
                    print(f"Failed because : {e}")
    # if img != '': print(img)
    return img

def cleanup_connections(conn):
    
    cur = conn.cursor()
    cur.execute(f"select id from information_schema.processlist where command = 'Sleep' AND host like '192.%' AND time > 300")
    ids = cur.fetchall()
    for x in ids:
        print(f"Killing {x[0]}")
        cur.execute(f"kill {x[0]}")
    conn.close()

def main():
    # parser = argparse.ArgumentParser()
    # parser.add_argument('-m', '--maker', dest="maker", required=True)
    # parser.add_argument('-s', '--sculpt', dest="sculpt", required=True)
    # parser.add_argument('-c', '--colorway', dest="colorway", required=True)
    
    start_time = datetime.now()
    print(start_time)
    # args = parser.parse_args()
    conn = connect_db().get_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM keyboard.makers')
    makers = cur.fetchall()
    cur.execute('select * from keyboard.all_purchases ORDER BY id DESC')
    purchases = cur.fetchall()
    keycap = {}
    maker_lookup = {}
    columns = [desc[0] for desc in cur.description]
    result = [dict(zip(columns, purch)) for purch in purchases]
    json_result = json.dumps(result, indent=4, default=custom_serializer)
    with open('results_output.json', 'w') as f:
        f.write(json_result)
    for maker in makers:
        if maker[5]: maker_lookup[str(maker[0])] = maker
        if maker[4] != "":
            keycap[maker[0]] = maker[4]
    print(f"Makers: {len(makers)}")
    print(f"Purchases: {len(purchases)}")
    catalog = get_catalog()
    for p in json.loads(json_result):
            if p['selfHostedImage'] == 0:
                try:
                    lookup = catalog[p['archivist_id']]
                    i = parse_src(lookup, p['maker_name'], p['entity'], p['detail'], p['ka_id'])
                    if i != p['image']:
                        print(f"UPDATE keyboard.purchases SET image='{i}', image_250='{i.replace('keycaps/', 'keycaps/250/')}', image_720='{i.replace('keycaps/', 'keycaps/720/')}' WHERE id = {p['id']}; {p['maker_id']}, {p['sculpt']}, {p['detail']}, {p['image']}")
                        cur.execute(f"UPDATE keyboard.purchases SET image='{i}', image_250='{i.replace('keycaps/', 'keycaps/250/')}', image_720='{i.replace('keycaps/', 'keycaps/720/')}' WHERE id = {p['id']}")
                except Exception as e:
                    # pass
                    print(f"Couldn't parse catalog for {p['maker_name']}, {p['sculpt']}, {p['detail']}: {e}")
            # else:
            #     print(self_hosted)
    conn.commit()
    cleanup_connections(conn)
    conn.close()
    


    t = datetime.now() - start_time
    print(t.seconds/60, t.seconds)
    return 0

if __name__ == "__main__":
    sys.exit(main())
