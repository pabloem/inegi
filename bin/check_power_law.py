#!/bin/env python
import sys
from sklearn.linear_model import LinearRegression
from scipy import stats
from math import exp
import plfit

if len(sys.argv) < 2:
    print("Usage: ./check_power_law.py series [-float]")
    sys.exit(0)

data = None
if len(sys.argv) >= 3 and sys.argv[2] == '-float':
    data = load_proportions(sys.argv[1])
else:
    data = load_counts(sys.argv[1])


dt = [i+1 for i,amt in enumerate(data) for j in range(amt)]

mf = plfit.plfit(dt,xmin = 1)

"""
rank = [i+1 for i in range(len(data))]

logRank = make_log(rank)
logData = make_log(data)

xmin = 1 #min(data)

lgs = [cnt*log((i+1)/xmin) for i, cnt in enumerate(data)]

n = sum(data)

alpha = 1 + n/sum(lgs)

stdErr = (alpha - 1) / sqrt(n)
"""
