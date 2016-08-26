var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    // TODO: Add a user Schema
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	displayName: String,
	bio: String,
	createdAt: { type: Date, default: Date.now }
}, { collection: 'authUsers' });

// TODO: Add the code for Bcrypt
userSchema.pre('save', function(done) {
	var user = this;
	if (!user.isModified('password')) {
		return done();
	}
	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if(err) { return done(err); }
		bcrypt.hash(user.password, salt, null,
			function(err, hashedPassword) {
				if (err) { return done(err) }
				user.password = hashedPassword;
				done();
			});
	});
});


userSchema.methods.name = function() {
	return this.displayName || this.username;
};

userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};

var User = mongoose.model('User', userSchema);

module.exports = User;
