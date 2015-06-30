#!/bin/sh
dirpath=`pwd`
project=z.wilddog.com
tarfile=${project}.resouces.tar.gz
host=root@10.18.2.200

tar zcvf ${tarfile} *
echo "####################package success#############################"
echo "package file $tarfile"
echo "please scp to target: \n\
step 1: scp  $tarfile $host:/data/www/${project} \n\
step 2: ssh  $host  \n\
step 3: cd /data/www/${project} \n\
step 4: tar zxvf $tarfile \n\
step 5: rm $tarfile \n"
