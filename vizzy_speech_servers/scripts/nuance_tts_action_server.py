#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
import actionlib
from woz_dialog_msgs.msg import SpeechActionGoal, SpeechFeedback, SpeechActionFeedback, SpeechResult, SpeechGoal, SpeechAction, SpeechActionResult

import sys
import os

import rospkg

import pyaudio
import wave
import sys

from core import NDEVCredentials, yellow, red, green
from tts import *

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

        basepath = rospackagepath+"/credentials/credentials.json"

        self._creds = NDEVCredentials(basepath)

        if not self._creds.has_credentials():
            print red("Please provide NDEV credentials.")
            sys.exit(-1)
        
        #check if wav directory exists. If it doesn't then create it
        wavDir = rospackagepath+"/wavs"

        if not os.path.exists(wavDir):
            print yellow("wavs directory doesn't exist. Creating it...")
            os.makedirs(wavDir)
        
        self._action_name = name
        self._as = actionlib.SimpleActionServer(self._action_name, SpeechAction, execute_cb=self.execute_cb, auto_start = False)
        self._as.start()

    def execute_cb(self, goal):

        language = goal.language
        voice = goal.voice
        message = goal.message

        filename = language+"/"+voice+"/"+message+".wav"
        audio_type = 'wav'
        
        print message
        
        if message == "EMPTY":
            self._result.success = True
            self._feedback.status = self._feedback.FREE
            self._as.publish_feedback(self._feedback)
            self._as.set_succeeded(self._result)
            return
            			


        #check if language and voice folders exist. if not, create them
        if not os.path.exists(self._rospackagepath+"/wavs/"+language+"/"+voice):
            print yellow("wavs directory doesn't exist. Creating it...")
            os.makedirs(self._rospackagepath+"/wavs/"+language+"/"+voice)

        #check if the file already exists. if it does, play it
        wavPath = self._rospackagepath+"/wavs/"+filename

        #file exists. play it
        if os.path.exists(wavPath):
            print green("file exists. playing it ^^")
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
            
            desired_tts_lang = TTS.get_language_input(language,voice)

            print yellow("\nUsing Language: %s (%s)\tVoice: %s\n" % (desired_tts_lang['display'], desired_tts_lang['properties']['code'], desired_tts_lang['properties']['voice']))

            try:

                sample_rate = 22000
                print yellow("\nUsing Sample Rate: %s\n" % sample_rate)
                synth_req = TTS.make_request(creds=self._creds,
                                        desired_tts_lang=desired_tts_lang,
                                        sample_rate=sample_rate,
                                        nchannels=1,
                                        sample_width=2,
                                        text="_______"+message,
                                        filename=wavPath,
                                        audio_type=audio_type)

                if synth_req.response.was_successful():
                    print "\nText synthesized to file -> %s" % yellow(filename)
                    self._feedback.status = self._feedback.SPEAKING
                    self._as.publish_feedback(self._feedback)
                    playback(wavPath)
                    self._result.success = True
                    self._as.set_succeeded(self._result)
                    self._feedback.status = self._feedback.FREE
                    self._as.publish_feedback(self._feedback)
                else:
                    print red("\nNDEV TTS Error %s" % synth_req.response.error_message)
                    self._as.set_aborted(self._result)
                    self._feedback.status = self._feedback.FREE
                    self._as.publish_feedback(self._feedback)
                    
            except Exception as e:
                print red(e)
                sys.exit(-1)


if __name__ == '__main__':
    rospy.init_node('nuance_speech_tts')
    server = TtsActionServer(rospy.get_name())
    rospy.spin()
