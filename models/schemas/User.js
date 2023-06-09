const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const ObjectID = mongoose.Schema.Types.ObjectId



const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "firstname can't be blank"]
  },
  lastname: {
    type: String,
    required: [true, "lastname can't be blank"]
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username can't be blank"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "email can't be blank"],
    index: true,
    validate: [isEmail, "invalid email"]
  },
  telephone: {
    type: String,
    unique: true,
    required: [true, "telephone can't be blank"],
    index: true,
    
  },
  password: {
    type: String,
    required: [true, "password can't be blank"]
  },
  picture: {
    type: String,
    required: [true, "picture can't be blank"]
  },
  dob: [{
    type: Date,
    required: true
  }],
  location:{
    type: String
  },
  bio:{
    type: String,
    default: "Hi, I'm looking to find employment in your firm!"
  },
  cvs: [{
    type: ObjectID,
    ref: 'CV'
    }],
  isPaid:{
    type: Boolean,
    default: false
    },
  verified:{
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },

}, {minimize: false, timestamps: true});





//the following pre find populates the stated fields. It's beautiful!
userSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({ path: "_id picture username", options: { _recursed: true } });
  next();
});

//the following pre save ensures that the password field is salted and hashed
userSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);

      user.password = hash
      // console.log(`this is what the hash is ${hash}`)
      next();
    })

  })

})

userSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
}

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({email});
  if(!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('invalid email or password')
  return user
}


const User = mongoose.model('User', userSchema);

module.exports = User
