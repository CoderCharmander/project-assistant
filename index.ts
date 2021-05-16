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

import https from 'https'
import express from 'express'
import certfiles from './certfiles'
import actionsApp from './actions-app'

const app = express();
const actionsSubroute = express().use(express.json(), actionsApp)
app.post('/action-webhook', actionsSubroute)
app.use('/tracks', express.static('audiofiles'))

app.get('/', (req, res) => {
    res.send('Hello World');
})

certfiles().then(certs => {
    const server = https.createServer(certs, app)
    console.log('Listening on port 1443 in 3, 2, 1')
    server.listen(1443)
})