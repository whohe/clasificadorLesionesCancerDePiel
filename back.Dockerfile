FROM debian
ENV TZ=America/Bogota
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update 
RUN apt install -y gcc python3 python3-dev python3-pip wget libffi-dev openssl git python3-tk 
RUN pip3 install datetime  --break-system-packages
RUN pip3 install requests  --break-system-packages
RUN pip3 install pytz  --break-system-packages
RUN pip3 install pandas  --break-system-packages
RUN pip3 install mplfinance  --break-system-packages
RUN pip3 install matplotlib  --break-system-packages
RUN pip3 install scikit-learn --break-system-packages
RUN pip3 install tensorflow[and-cuda] --break-system-packages
RUN pip3 install opencv-python --break-system-packages
RUN pip3 install numpy --break-system-packages
RUN pip3 install Flask --break-system-packages
RUN pip3 install flask-cors --break-system-packages
RUN pip3 install flask-requests --break-system-packages
RUN apt install -y ffmpeg

RUN useradd -u 1000 -m -s /bin/bash who && \
    usermod -aG sudo who
RUN echo 'who:secret' | chpasswd
USER who
#COPY ./src /home/who
WORKDIR /home/who
#CMD python3 server.py
CMD bash
