const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

// Supprime toutes les données liées à un utilisateur
const deleteUserData = async (userId) => {
  await Promise.all([
    mongoose.model('Transaction').deleteMany({ user: userId }),
    mongoose.model('Budget').deleteMany({ user: userId }),
    mongoose.model('AuditLog').deleteMany({ user: userId }),
  ])
}

// Se déclenche avec User.findByIdAndDelete() et User.findOneAndDelete()
userSchema.post('findOneAndDelete', async function (user) {
  if (user) await deleteUserData(user._id)
})

// Se déclenche avec user.deleteOne() (sur un document)
userSchema.post('deleteOne', { document: true, query: false }, async function () {
  await deleteUserData(this._id)
})

module.exports = mongoose.model('User', userSchema)