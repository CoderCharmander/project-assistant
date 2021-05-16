# Project Assistant
This is a Google Assistant Action to play the audio tracks from Project English books.

## Usage
You need to obtain the audio files from Oxford University. If you plan to embed this in a public application, you
have to ask permission.

For personal use, you can run `exercise_scraper.py` to automatically download the audio files and write the page and
exercise numbers properly into `tracks.json`.

You can then upload the contents of `actions-app/` into an Actions SDK project. You have to configure a webhook URL,
and probably you also want at least a dynamic DNS domain name.

You also have to obtain a TLS/SSL certificate. I suggest Let's Encrypt because it's free and only requires you to
install Certbot.

Now you have to create a `.env` file that contains something like this:
```env
CERTDIR = /etc/letsencrypt/live/your.domain.here
```

If everything went right, you should be able to say "Talk to Project Assistant" on any Assistant-enabled device where
you are logged in with the same Google account you used to create the Actions project.

## Track storage

`tracks.json` is a list of objects which follow the same schema:
```json
{
	"page": 1,
	"exercises": ["1a", "1b"],
	"audiofile": "somefile.mp3"
}
```
`page` specifies the page the exercise is on; `exercises` lists the exercises the track is attached to; and `audiofile`
is the filename under `audiofiles/`.