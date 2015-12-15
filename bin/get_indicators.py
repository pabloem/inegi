#!/usr/bin/env python
import sys
import csv
import requests as r
import json

usage = """Usage: ./get_indicators.py input.csv output.csv indicator1,indicator2.. indicatorid1,indicatorid2.."""
if len(sys.argv) < 5:
    print(usage)
    sys.exit(0)

indicators = sys.argv[3].split(",")
ind_names = sys.argv[4].split(",")
    
inf = open(sys.argv[1])
rd = csv.DictReader(inf)

fn = list(rd.fieldnames)
[fn.append(ind_nm) for ind_nm in ind_names]

outf = open(sys.argv[2],'w')
wr = csv.DictWriter(outf,fn)
wr.writeheader()

base = "http://www3.inegi.org.mx//sistemas/api/indicadores/v1//Indicador/"
end = "/es/true/json/f1a4933d-07e8-cdc3-6cfc-832495fffd3c"

for j,ln in enumerate(rd):
    if (j + 1) % 50 == 0: print("Got "+str(j+1)+" elements.")
    mn_id = ln['cv_estado']+ln['cv_municipio']
    for i, ind in enumerate(indicators):
        ind_nm = ind_names[i]
        url = base + ind + "/" + mn_id+end
        m = r.get(url)
        d = json.loads(m.text)
        val = ""
        if 'Data' in d and 'Serie' in d['Data'] and 'CurrentValue' in d['Data']['Serie'][0]:
            val = d['Data']['Serie'][0]['CurrentValue']
        else:
            print("Value not available: "+ind_nm+ " | Place: "+mn_id)
        ln[ind_nm] = val
    wr.writerow(ln)


outf.close()
inf.close()
