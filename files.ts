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

import fs from 'fs'

export type TrackSpecifier = {
	page: Number,
	exercise: String
}

export type Track = {
	page: Number,
	exercises: String[],
	audiofile: String
}

const tracks: Track[] = JSON.parse(fs.readFileSync('tracks.json', { encoding: 'utf8' }))

export function get_audio(spec: TrackSpecifier): Track | undefined {
	return tracks.find(track => track.page == spec.page &&
	                            track.exercises.some(exerc => exerc == spec.exercise.toLowerCase()))
}
