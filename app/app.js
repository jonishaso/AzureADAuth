/** @format */

import createError from 'http-errors'
import express from 'express'
import method from 'method-override'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { destroySessionUrl, resourceURL } from './config'
import openidConfig from './openId'
import helmet from 'helmet'
import uuid from 'uuid'
import session from 'express-session'
import sessionLoccalStore from 'session-file-store'
import passport from 'passport'
import { OIDCStrategy } from 'passport-azure-ad'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import displayRouter from './routes/display'
import editRouter from './routes/edit'

passport.serializeUser(function(user, done) {
	done(null, user.oid)
})

passport.deserializeUser(function(oid, done) {
	findByOid(oid, function(err, user) {
		done(err, user)
	})
})

// array to hold logged in users
var users = []

var findByOid = function(oid, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i]
		// console.log("we are using user: ", user);
		if (user.oid === oid) {
			return fn(null, user)
		}
	}
	return fn(null, null)
}

passport.use(
	new OIDCStrategy(openidConfig, function(
		iss,
		sub,
		profile,
		accessToken,
		refreshToken,
		done
	) {
		if (!profile.oid) {
			return done(new Error('No oid found'), null)
		}
		// asynchronous verification, for effect...
		process.nextTick(function() {
			findByOid(profile.oid, function(err, user) {
				if (err) {
					return done(err)
				}
				if (!user) {
					// "Auto-registration"
					users.push(profile)
					return done(null, profile)
				}
				return done(null, user)
			})
		})
	})
)

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(helmet())
app.use(helmet.noCache())
app.disable('X-powered-by')
app.use(logger('dev'))
app.use(express.json())
app.use(
	express.urlencoded({
		extended: false
	})
)
app.use(cookieParser())
app.use(method('_method'))
app.use(express.static(path.join(__dirname, 'public')))
var sessionStore = sessionLoccalStore(session)
app.use(
	session({
		genid: (req) => {
			return uuid()
		},
		resave: false,
		saveUninitialized: true,
		secret: 'abd',
		// cookie:{secure:true},
		name: 'kyc',
		store: new sessionStore({
			ttl: 3600,
			encryptEncoding: 'hex',
			path: path.join(__dirname, './sessions/'),
			secret: 'justFine'
		})
	})
)
app.use(passport.initialize())
app.use(passport.session())

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

app.use('/', indexRouter)
app.use('/loginrequired', ensureAuthenticated, usersRouter)
app.use('/display', displayRouter)
app.use('/edit', ensureAuthenticated, editRouter)

app.use('/failed', (req, res, next) => {
	res.send('fail')
})

app.get(
	'/login',
	(req, res) => {
		passport.authenticate('azuread-openidconnect', {
			response: res, // required
			resourceURL: resourceURL, // optional. Provide a value if you want to specify the resource.
			customState: 'my_state', // optional. Provide a value if you want to provide custom state value.
			failureRedirect: '/failed'
		})(req, res)
	},
	function(req, res) {
		console.log('Login was called in the Sample')
		res.redirect('/loginrequired')
	}
)

app.get(
	'/auth/openid/return',
	function(req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res, // required
			failureRedirect: '/failed'
		})(req, res, next)
	},
	function(req, res) {
		console.log('We received a return from AzureAD.')
		res.redirect('/loginrequired')
	}
)

app.post(
	'/auth/openid/return',
	function(req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res, // required
			failureRedirect: '/failed'
		})(req, res, next)
	},
	function(req, res) {
		console.log('We received a return from AzureAD.')
		res.redirect('/loginrequired')
	}
)

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		req.logOut()
		res.redirect(config.destroySessionUrl)
	})
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

export { app }
