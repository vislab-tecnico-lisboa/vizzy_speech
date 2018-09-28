
import yaml

import sys
import os


def main():
	if len(sys.argv) < 2:
		print('you need to provide the name of the yaml file located at $VIZZY_SPEECH_SERVERS/sentences_files')
	else:
		with open(os.path.join("../sentences_files",sys.argv[1]), 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
		    except yaml.YAMLError as exc:
		        print(exc)
	for sentence in sentences:
		pass # code to talk

if __name__ == '__main__':
	main()