# 💰 NexisBudget API

Une API REST sécurisée dédiée à la gestion de budget, conçue avec la stack Node.js, Express et MongoDB. 

---

## 💡 Philosophie & Choix Techniques

L'objectif principal de cette API est de garantir la fiabilité des données financières de l'utilisateur tout en maintenant une architecture modulaire et facile à faire évoluer.

- Validation stricte des données : Utilisation de Zod pour valider le corps des requêtes HTTP (formats, types, valeurs obligatoires) avant tout traitement métier.
- Sécurité : Hachage des mots de passe avec bcryptjs et protection des routes via jetons JWT (*Bearer Token*).
- Intégrité de la BDD : Implémentation d'un système de suppression en cascade. La suppression d'un compte utilisateur nettoie automatiquement l'ensemble de ses transactions, budgets et journaux d'audit associés.
- Qualité de code : Couverture complète des endpoints à l'aide de tests d'intégration automatisés avec Jest et Supertest.

---

## 🛠 Tech Stack

- Runtime : Node.js
- Framework Web : Express.js
- Base de données : MongoDB via Mongoose (ORM)
- Validation : Zod
- Sécurité : JsonWebToken, Bcryptjs, CORS
- Tests : Jest, Supertest, SonarQube
- Documentation : Swagger UI

---

## 📁 Architecture du Projet

Le projet suit une organisation simplifiée à la racine :

```
nexis-budget/
├── config/              
├── controllers/         
├── middleware/        
├── models/              
├── node_module/        
├── routes/             
├── schemas/             
├── tests/             
├── utils/             
├── validations/
├── .env
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
└── server.js        
