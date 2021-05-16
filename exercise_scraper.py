# Project Assistant - play audio tracks from the Project English book
# Copyright (C) 2021 András El Koulali
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import bs4
import urllib.request
import urllib.parse
import os.path
import re
import json
import time
from collections import namedtuple

if not os.path.isdir('audiofiles'):
	os.makedirs('audiofiles/')

STARTER_URL = 'https://elt.oup.com/student/project/level3/'
with urllib.request.urlopen(STARTER_URL) as page:
	soup = bs4.BeautifulSoup(page, 'html.parser')
links = soup.select('#exercise > #children > ul > li.choice1 > a')

AudioInfo = namedtuple('AudioInfo', ['page', 'exercises', 'audiofile'])
listening_tracks = list()

def scrape_exercises(url):
	exercise_regex = re.compile(r'^Page ([0-9]+), Exercises? ([0-9]+[a-z]?)(?: and ([0-9]+[a-z]?))?')
	soup = bs4.BeautifulSoup(urllib.request.urlopen(url), 'html.parser')
	track_links = soup.select('ul#tracklist li a.track')
	for link in track_links:
		matches = exercise_regex.match(link.string)
		if matches is None:
			raise Exception('This should never happen. The string was ' + link.string)
		page, exercise_a, exercise_b = matches.groups()
		exercises = [exercise_a]
		if exercise_b is not None:
			exercises.append(exercise_b)
		page = int(page)
		components = urllib.parse.urlparse(link['href'])
		filename = os.path.basename(components.path)
		print('Downloading', filename)
		urllib.request.urlretrieve('https://elt.oup.com' + link['href'], os.path.join('audiofiles', filename))
		listening_tracks.append({ "page": page, "exercises":exercises, "audiofile":filename })
		time.sleep(5)

for link in links:
	print(link)
	components = urllib.parse.urlparse(link['href'])
	audio_url = STARTER_URL + components.path + '/audio'
	print('Scraping:', audio_url)
	scrape_exercises(audio_url)
	time.sleep(10) # Don't stress the server

with open('tracks.json', 'w') as trackfile:
	json.dump(listening_tracks, trackfile)