from math import log

def load_counts(fname):
    f = open(fname)
    a = []
    for ln in f:
        a.append(int(ln))
    return list(reversed(a))

def load_proportions(fname):
    f = open(fname)
    a = []
    for ln in f:
        a.append(float(ln))
    return list(reversed(a))

def make_log(lst):
    res = []
    for elm in lst:
        res.append(log(elm))
    return res
