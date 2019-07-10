#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
import actionlib
from woz_dialog_msgs.msg import SpeechActionGoal, SpeechFeedback, SpeechActionFeedback, SpeechResult, SpeechGoal, SpeechAction, SpeechActionResult

import sys
import os

reload(sys)
sys.setdefaultencoding('utf8')

import rospkg

import pyaudio
import wave
import sys

import hashlib

from google.cloud import texttospeech




def playback(outname):
    chunk_size = 1024
    paudio = pyaudio.PyAudio()
    file_to_play = wave.open(outname, 'rb')
    stream = paudio.open(format = paudio.get_format_from_width(file_to_play.getsampwidth()),
                         channels = file_to_play.getnchannels(),
                         rate = file_to_play.getframerate(),
                         output = True)
    data = file_to_play.readframes(chunk_size)
    while data != '':
         stream.write(data)
         data = file_to_play.readframes(chunk_size)
    stream.stop_stream()
    stream.close()
    paudio.terminate()

class TtsActionServer(object):
    _feedback = SpeechFeedback()
    _result = SpeechResult()

    def __init__(self, name):
        rospack = rospkg.RosPack()

        rospackagepath = rospack.get_path('vizzy_speech_servers')

        self._rospackagepath = rospackagepath

        basepath = rospackagepath+"/credentials/google.json"
        
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = basepath

        self.client = texttospeech.TextToSpeechClient()


        #check if wav directory exists. If it doesn't then create it
        wavdir = rospackagepath+"/wav"

        if not os.path.exists(wavdir):
            print("wav directory doesn't exist. Creating it...")
            os.makedirs(wavdir)

        self._action_name = name
        self._as = actionlib.SimpleActionServer(self._action_name, SpeechAction, execute_cb=self.execute_cb, auto_start = False)
        self._as.start()

    def execute_cb(self, goal):

        language = goal.language
        voice = goal.voice
        message = goal.message
        speed = goal.speed

        print(goal)

        #speed = goal.MEDIUM

        filename = language+"/"+voice+"/speed_"+str(speed)+"/"+hashlib.sha256(message.encode('utf-8')).hexdigest()+".wav"
        audio_type = 'wav'

        print(message)

        if message == "EMPTY":
            self._result.success = True
            self._feedback.status = self._feedback.FREE
            self._as.publish_feedback(self._feedback)
            self._as.set_succeeded(self._result)
            return



        #check if language voice and speed folders exist. if not, create them
        if not os.path.exists(self._rospackagepath+"/wav/"+language+"/"+voice+"/speed_"+str(speed)):
            print("wav directory doesn't exist. Creating it...")
            os.makedirs(self._rospackagepath+"/wav/"+language+"/"+voice+"/speed_"+str(speed))

        #check if the file already exists. if it does, play it
        wavPath = self._rospackagepath+"/wav/"+filename

        
        #file exists. play it
        if os.path.exists(wavPath):
            print("file exists. playing it ^^")
            self._feedback.status = self._feedback.SPEAKING
            self._as.publish_feedback(self._feedback)
            playback(wavPath)
            self._result.success = True
            self._feedback.status = self._feedback.FREE
            self._as.publish_feedback(self._feedback)
            self._as.set_succeeded(self._result)

        #file doesnt exist. fetch it from the internet
        else:
            self._feedback.status = self._feedback.DOWNLOADING
            self._as.publish_feedback(self._feedback)
            message = unicode(message,'utf-8')

            rospy.loginfo("Speech goal received.")

            if speed == goal.XSLOW:
                speed_num = 0.5
            elif speed == goal.SLOW:
                speed_num = 0.75
            elif speed == goal.MEDIUM:
                speed_num = 1.0
            elif speed == goal.FAST:
                speed_num = 1.25
            elif speed == goal.VERYFAST:
                speed_num = 1.50
            else:
                speed_num = 1.0

            try:

                synthesis_input = texttospeech.types.SynthesisInput(text=message)
                voice = texttospeech.types.VoiceSelectionParams(
                    language_code=language,
                    name=voice)
                
                audio_config = texttospeech.types.AudioConfig(
                    audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16,
                    pitch=6.00,
                    speaking_rate=speed_num)
            
                response = self.client.synthesize_speech(synthesis_input, voice, audio_config)

                with open(wavPath, 'wb') as out:
                    out.write(response.audio_content)
                    print("Downloaded speech sentence")
                
                self._feedback.status = self._feedback.SPEAKING
                self._as.publish_feedback(self._feedback)
                playback(wavPath)
                self._result.success = True
                self._as.set_succeeded(self._result)
                self._feedback.status = self._feedback.FREE
                self._as.publish_feedback(self._feedback)

                

            except Exception as e:
                print(e)
                print('Unable to download the file, no internet connection')
                wavPath = self._rospackagepath+"/extra_sounds/speech_fail.wav"
                playback(wavPath)
                self._as.set_aborted(self._result)
                self._feedback.status = self._feedback.FREE
                self._as.publish_feedback(self._feedback)


if __name__ == '__main__':
    rospy.init_node('gcloud_tts_action_server')
    server = TtsActionServer(rospy.get_name())
    rospy.spin()
