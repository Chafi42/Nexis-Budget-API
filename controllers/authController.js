const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const generateToken = require("../utils/generateToken");



const formatUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await AuditLog.create({
      user: user._id,
      action: "USER_REGISTER",
      details: `Création du compte : ${user.email}`,
    });

    res.status(201).json({
      message: "Compte créé avec succès !",
      token: generateToken(user._id, user.email),
      user: formatUser(user),
    });
  } catch (error) {
    // Email déjà pris (requêtes simultanées)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
    console.error("Erreur register :", error);
    res.status(500).json({ message: "Erreur lors de la création du compte." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe obligatoires." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    await AuditLog.create({
      user: user._id,
      action: "USER_LOGIN",
      details: "Connexion réussie",
    });

    res.status(200).json({
      message: "Connexion réussie !",
      token: generateToken(user._id, user.email),
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Erreur login :", error);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

const logout = async (req, res) => {
  try {
    if (req.user) {
      await AuditLog.create({
        user: req.user._id,
        action: "USER_LOGOUT",
        details: "Déconnexion de l’utilisateur",
      });
    }
    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (error) {
    console.error("Erreur logout :", error);
    res.status(500).json({ message: "Erreur lors de la déconnexion." });
  }
};

// Modifier son profil
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const emailTaken = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (emailTaken) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
      user.email = normalizedEmail;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès !",
      user: formatUser(updatedUser),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
    console.error("Erreur updateUser :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

// Supprimer un utilisateur (la suppression des transactions, budgets et logs
// est faite automatiquement par le hook dans models/User.js)
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id || req.user._id;

    if (!mongoose.isValidObjectId(userIdToDelete)) {
      return res.status(400).json({ message: "Identifiant invalide." });
    }

    // Un utilisateur ne supprime que son compte, seul un admin peut supprimer les autres
    if (
      String(userIdToDelete) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    await User.findByIdAndDelete(userIdToDelete);

    res
      .status(200)
      .json({
        message: "Utilisateur et toutes ses données supprimés avec succès.",
      });
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l’utilisateur." });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateUser,
  deleteUser,
};
