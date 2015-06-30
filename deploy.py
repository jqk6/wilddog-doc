#!/usr/bin/env python

import pexpect
import sys
import os
import datetime

time=datetime.datetime.now().strftime('%Y%m%d%H%M%S')
localPath = os.getcwd()
pathSp = localPath.split('/')
localDir = pathSp[len(pathSp)-1]
remote = 'root@10.18.2.200'
remotePath = '/data/www'
remoteDir = 'z.wilddog.com'
tgz = localDir+".tar.gz"
pexpect.run('tar -cvf %s %s '%(tgz,localDir),cwd='..')
pexpect.run('scp %s %s:%s'%(tgz,remote,remotePath),cwd="..")


#ssh
ssh = pexpect.spawn('ssh',[remote])
fout = file('deploy.log','w')
ssh.logfile = fout
ssh.expect('#')

# cd to /data/www
ssh.sendline("cd %s"%(remotePath))
ssh.expect('#')
#backupfile
ssh.sendline("mv %s %s"%(remoteDir,remoteDir+"."+time))
ssh.expect('#')

#unzip file
ssh.sendline('tar -xvf %s'%(tgz))
ssh.expect('#')

#replect z.wilddog.com
ssh.sendline('mv %s %s'%(localDir,remoteDir))
ssh.expect('#')

#cd to z.wilddog.com
ssh.sendline('cd %s'%(remoteDir))
ssh.expect('#')

# stop
ssh.sendline('forever stop ./bin/www')
ssh.expect('#')

# start
ssh.sendline('forever start ./bin/www')
ssh.expect('#')
