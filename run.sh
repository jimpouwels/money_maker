FILE_NAME=$(date +%Y%m%d_%H%M%S)
cd /home/pouwels/projects/cashmailer
npm run start 2>&1 > /home/pouwels/projects/cashmailer-logs/${FILE_NAME}.txt