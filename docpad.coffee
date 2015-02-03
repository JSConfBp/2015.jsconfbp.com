# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {

	outPath: ''

	srcPath: 'src'  # default

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:

		# Specify some site properties
		site:
			# The production url of our website
			url: "http://jsconfbp.com"

			# Here are some old site urls that you would like to redirect from
			oldUrls: [
			]

			# The default title of our website
			title: "JSConf Budapest"

			# The website description (for SEO)
			description: """
				JSConf Budapest is a JSConf family member 2-day non-profit for-the-community by-the-community conference about JavaScript in Budapest, Hungary.
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				jsconf, javascript, jsconfbp, conference, budapest, jsconf budapest
				"""


		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
			# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

		# Get the prepared site/document description
		getPreparedDescription: ->
			# if we have a document description, then we should use that, otherwise use the site's description
			@document.description or @site.description

		# Get the prepared site/document keywords
		getPreparedKeywords: ->
			# Merge the document keywords with the site keywords
			@site.keywords.concat(@document.keywords or []).join(', ')

		getGruntedStyles: ->
			_ = require 'underscore'
			styles = []
			gruntConfig = require('./grunt-config.json')
			_.each gruntConfig, (value, key) ->
				styles = styles.concat _.flatten _.pluck value, 'dest'
			styles = _.filter styles, (value) ->
				return value.indexOf('.min.css') > -1
			_.map styles, (value) ->
				return value.replace '', ''

		getGruntedScripts: ->
			_ = require 'underscore'
			scripts = []
			gruntConfig = require('./grunt-config.json')
			_.each gruntConfig, (value, key) ->
				scripts = scripts.concat _.flatten _.pluck value, 'dest'
			scripts = _.filter scripts, (value) ->
				return value.indexOf('.min.js') > -1
			_.map scripts, (value) ->
				return value.replace '', ''


	# =================================
	# DocPad Events

	# Here we can define handlers for events that DocPad fires
	# You can find a full listing of events on the DocPad Wiki
	events:

		# Server Extend
		# Used to add our own custom routes to the server before the docpad routes are added
		serverExtend: (opts) ->
			# Extract the server from the options
			{server} = opts
			docpad = @docpad

			# As we are now running in an event,
			# ensure we are using the latest copy of the docpad configuraiton
			# and fetch our urls from it
			latestConfig = docpad.getConfig()
			oldUrls = latestConfig.templateData.site.oldUrls or []
			newUrl = latestConfig.templateData.site.url

			# Redirect any requests accessing one of our sites oldUrls to the new site url
			server.use (req,res,next) ->
				if req.headers.host in oldUrls
					res.redirect(newUrl+req.url, 301)
				else
					next()

		# Write After
		# Used to minify our assets with grunt
		writeAfter: (opts,next) ->
			# Prepare
			docpad = @docpad
			rootPath = docpad.config.rootPath
			balUtil = require 'bal-util'
			_ = require 'underscore'

			# Make sure to register a grunt `default` task
			command = ["#{rootPath}/node_modules/.bin/grunt", 'default']
			
			# Execute
			balUtil.spawn command, {cwd:rootPath,output:true}, ->
				src = []
				gruntConfig = require './grunt-config.json'
				_.each gruntConfig, (value, key) ->
					src = src.concat _.flatten _.pluck value, 'src'
				_.each src, (value) ->
					balUtil.spawn ['rm', value], {cwd:rootPath, output:false}, ->
				balUtil.spawn ['find', '.', '-type', 'd', '-empty', '-exec', 'rmdir', '{}', '\;'], {cwd:rootPath+'', output:false}, ->
				next()

			# Chain
			@
}

# Export our DocPad Configuration
module.exports = docpadConfig