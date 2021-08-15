import os,sys
import json
import requests
import argparse
import mariadb
from dotenv import dotenv_values, load_dotenv

# config = dotenv_values(".env.prod")
load_dotenv('.env.prod')
def connect_db():
    try:
        conn = mariadb.connect(
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASS'],
            host=os.environ['DB_HOST'],
            port=int(os.environ['DB_PORT']))

        # Instantiate Cursor
        return conn
 
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")

def get_data(maker):
    url = f"https://raw.githubusercontent.com/keycap-archivist/database/master/db/{maker}.json"
    res = requests.get(url=url)
    if res.status_code == 200:
        return json.loads(res.text)
    else:
        return None

def parse_src(data, maker, sculpt, cw):
    img = ''
    for x in data['sculpts']:
        if x['name'] == sculpt:
            for color in x['colorways']:
                if color['name'] == cw:
                    img = color['img']
    return img

def main():
    # parser = argparse.ArgumentParser()
    # parser.add_argument('-m', '--maker', dest="maker", required=True)
    # parser.add_argument('-s', '--sculpt', dest="sculpt", required=True)
    # parser.add_argument('-c', '--colorway', dest="colorway", required=True)
    
    # args = parser.parse_args()
    conn = connect_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM keyboard.makers')
    makers = cur.fetchall()
    cur.execute('select * from keyboard.all_purchases')
    purchases = cur.fetchall()
    keycap = {}
    for maker in makers:
        keycap[maker[0]] = maker[4]

    for purchase in purchases:
        # print(purchase)
        p_id = purchase[0]
        sculpt = purchase[3]
        cw = purchase[2]
        m_id = purchase[5]
        maker = keycap[m_id]
        d = get_data(maker)
        if d:
            i = parse_src(d, maker, sculpt, cw)
            if i:
                # print(f"UPDATE keyboard.purchases SET image = '{i}' WHERE id = {p_id}")
                print(maker, sculpt, cw)
                cur.execute(f"UPDATE keyboard.purchases SET image = '{i}' WHERE id = {p_id}")
    conn.commit()
    conn.close()
    # sys.exit()

    
    # d = get_data(args.maker)
    # i = parse_src(d, args.maker, args.sculpt, args.colorway)
    # print(i)
    return 0

if __name__ == "__main__":
    sys.exit(main())