#!/usr/bin/env python3
"""Build Card Quest: inline src/style.css and src/js/*.js (in file-name order) into one self-contained index.html."""
import glob,os
here=os.path.dirname(os.path.abspath(__file__))
shell=open(os.path.join(here,'src/shell.html')).read()
css=open(os.path.join(here,'src/style.css')).read()
js=''.join(open(f).read() for f in sorted(glob.glob(os.path.join(here,'src/js/*.js'))))
out=shell.replace('/*@CSS*/',css).replace('/*@JS*/',js)
open(os.path.join(here,'index.html'),'w').write(out)
print('built index.html',len(out),'bytes')
