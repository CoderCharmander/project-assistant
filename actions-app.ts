/*
 * Project Assistant - play audio tracks from the Project English book
 * Copyright (C) 2021 András El Koulali
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { actionssdk } from 'actions-on-google'
import { conversation, Media } from '@assistant/conversation'
import { get_audio, Track, TrackSpecifier } from './files'

const app = conversation({ debug: false })

function mediaFromTrack(track: Track) {
	return new Media({
		mediaObjects: [
			{
				name: `Page ${track.page} exercise ${track.exercises.join(' and ')}`,
				url: `https://cch-pi.dynv6.net:1443/tracks/${track.audiofile}`
			}
		]
	})
}

app.handle('greeting', conv => {
    conv.add('Hello! The Project book is ready!')
    if (!conv.user.lastSeenTime) {
    	conv.add('You can ask me to play tracks from the Project English book level 3. Try to ask "play page 76 exercise 1B"!')
    }
})

app.handle('bye', conv => {
    conv.add('Goodbye.')
})

app.handle('request', conv => {
	if (!conv.session.params || !conv.session.params['requested']) {
		return
	}
	conv.add('Say "play again" to hear the audio again, say "quit" to exit Project Assistant, or request another exercise to play it.')
})

app.handle('play_again', conv => {
	if (!conv.session.params || !conv.session.params['track']) {
		conv.add('You didn\'t play any audio yet! Try to ask "play page 78 exercise 2B"!')
		return
	}
	conv.add('Playing again in 3, 2, 1.')
	conv.add(mediaFromTrack(conv.session.params['track']))
})

app.handle('play_track', conv => {
	if (!conv.intent.params || !conv.intent.params['exercise'] || !conv.intent.params['page']) {
		conv.add('Please provide a page number and an exercise.')
		return;
	}
	const exercise: String = conv.intent.params['exercise'].resolved
	const page: Number = conv.intent.params['page'].resolved
	const track = get_audio({ exercise, page })
	if (!track) {
		conv.add('I can\'t find any listening task that matches this exercise. Please try again.')
		if (conv.scene.next) {
			conv.session.params!['requested'] = false
			conv.scene.next.name = 'ExerciseRequest'
		}
		return;
	}
	conv.add(`Playing exercise ${exercise} on page ${page} in 3, 2, 1.`)
	conv.add(mediaFromTrack(track))
	if (conv.session.params) {
		conv.session.params['requested'] = true
		conv.session.params['track'] = track
	}
})

export default app