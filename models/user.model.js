// import mongoose from 'mongoose';
// import validator from 'validator';
// import bcrypt from 'bcryptjs'; // ✅ import bcryptjs

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'User must have a name'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'User must have an email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please provide a valid email']
//   },
//   photo: {
//     type: String,
//     default: 'default.jpg'
//   },
//   password: {
//     type: String,
//     required: [true, 'User must have a password'],
//     minlength: 8,
//     select: false
//   },
//   confirmPassword: {
//     type: String,
//     required: [true, 'Please confirm your password'],
//     validate: {
//       // Only works on SAVE and CREATE
//       validator: function (el) {
//         return el === this.password;
//       },
//       message: 'Passwords are not the same!'
//     }
//   }
// });

// // ✅ PRE-SAVE MIDDLEWARE to hash password
// userSchema.pre('save', async function (next) {
//   // Only hash the password if it's been modified or is new
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12 (salt rounds)
//   this.password = await bcrypt.hash(this.password, 12);

//   // Remove confirmPassword (won't be saved in DB)
//   this.confirmPassword = undefined;
//   next();
// });


// // INSTANCE METHOD to validate password
// userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// const User = mongoose.model('User', userSchema);
// export default User;

import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password; // Only works on SAVE & CREATE
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date // ✅ Track password changes
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// ✅ Update `passwordChangedAt` when password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Sometimes JWT is issued before this is saved, so subtract 1s
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ✅ Compare entered password with hashed password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ✅ Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp; // true means password was changed
  }
  return false; // false means password not changed after JWT issued
};

const User = mongoose.model('User', userSchema);
export default User;

