# CSUpdate
Chrome plugin to improve <a href="https://www.cardsphere.com">Cardsphere</a> functionality. This plugin highlights new packages on the send page, allowing the user to review and update their saved contents for a comparison with the send page at a later time. Various options allow the user top customize their own experience as well.

## Saving Mechanism
- each save stores 4 things in memory:
		- contents under 'saved'
		- contents under '[hash of package settings]_saved'
		- last accessed date under 'saved_last_accessed'
		- last accessed date under '[hash of package settings_last_accessed'
- contents object takes the form:
{ contents: [hash of contents scraped from site],
	price: [scraped from site],
	efficiency: [scraped from site] }
- each content object is stored as a value in the 'saved' or '[hash of package settings]_saved' against a key that is the scraped package username (this works functionally as a hash put/get)

## Options
- ability to only check against packages with the same package settings
- ability to autosave immediately when visiting the cardsphere page
- enable/disable flags
- enable/disable ok button
- change coloring of highlights and flags

## Reach Goals
- enable use of chrome sync storage for package contents - currently, saving has too many keys, maxing out seeming around 180 or so keys. Nesting keys one layer further inside object? Or is even with hashing this too much data to be stored over sync? 

## Known Bugs
- ~~Hash saved by contents with the 'save.js' method differ from those generated when compared saved with 'insert_script.js', leading to flags~~ (Fixed 2/27/2018, 24765015436a1476c8662e51b7bb2fef75dbc69b. Package selector was grabbing flags - workaround by selecting only specific children containing package contents).
