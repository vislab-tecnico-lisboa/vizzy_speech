import pyaudio
import wave
import signal
import sys
import os
from time import sleep




def playback(outname):

    chunk_size = 1024
    paudio = pyaudio.PyAudio()
    file_to_play = wave.open(outname, 'rb')
    stream = paudio.open(format = paudio.get_format_from_width(file_to_play.getsampwidth()),
            channels = file_to_play.getnchannels(),
            rate = file_to_play.getframerate(),
            output = True)
    data = file_to_play.readframes(chunk_size)
    try:
        while data != '':
            stream.write(data)
            data = file_to_play.readframes(chunk_size)
        stream.stop_stream()
        stream.close()
        paudio.terminate()
    except KeyboardInterrupt:
        stream.stop_stream()
        stream.close()
        paudio.terminate()
        print 'Closing stream'


if __name__ == '__main__':
    #signal.signal(signal.SIGINT, signal_handler)

    wavDir = os.path.dirname(os.path.abspath(__file__))
    wavPath = wavDir+"/../breath/breath.wav"
    while True:
        try:
            if os.path.exists(wavPath):
                print 'beathing to keep speaker awake... uff...'
                playback(wavPath)
                sleep(10)
            else:
                print 'I CANT BEATHE'
		print 'paht: '+wavPath

        except KeyboardInterrupt:
            print 'Exiting speaker awaker'
            exit(0)
