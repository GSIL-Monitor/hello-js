mkdir -p /home/xiaoju/data1/nginx/logs && ln -sv /home/xiaoju/data1/nginx/logs /home/xiaoju/nginx/logs
mkdir -p /home/xiaoju/webroot/ipd-cloud/application/hcp 


cd /home/xiaoju/nginx
su - xiaoju -c "/home/xiaoju/nginx/sbin/nginx"
