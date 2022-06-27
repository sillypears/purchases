import os, sys
import json
import requests
from pprint import pprint

def get_catalog(url, conf):
    catalog = {}
    res = requests.get(url)
    if res.status_code == 200:
        catalog = json.loads(res.text)
    return catalog

def get_prop(obj, prop):
    try:
        return obj[prop]
    except:
        return ''

def parse_catalog(catalog, conf):
    makers = {}
    for maker in catalog:
        mid = get_prop(maker, 'id')
        site = get_prop(maker, 'website')
        discord = get_prop(maker, 'discord')
        ig = get_prop(maker, 'instagram')
        name = get_prop(maker, 'name')
        twitch = get_prop(maker, 'twitch')
        art_col = get_prop(maker, 'artisanCollector')
        logo = get_prop(maker, 'logo')
        reddit = get_prop(maker, 'reddit')
        makers[name.lower()] = {
            'mid': mid,
            'site': site,
            'discord': discord,
            'ig': ig,
            'name': name,
            'twitch': twitch,
            'artCol': art_col,
            'logo': logo,
            'reddit': reddit
            }
    return makers

def main():

    conf = {}
    cat = get_catalog('https://raw.githubusercontent.com/keycap-archivist/website/master/src/db/catalog.json', conf)
    makers = parse_catalog(cat, conf)
    if len(sys.argv) > 1:
        pprint(makers[sys.argv[1]])
    else:
        pprint(makers.keys())
    return 0

if __name__ == "__main__":
    sys.exit(main())