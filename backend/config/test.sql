-- ============================================================
-- TALENT CONNECT - Schéma de base de données MySQL + Données de test
-- ============================================================

CREATE DATABASE IF NOT EXISTS talent_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talent_connect;

-- ------------------------------------------------------------
-- Table : users (candidats + admins)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255)  NOT NULL,
  role          ENUM('candidat','admin') NOT NULL DEFAULT 'candidat',
  telephone     VARCHAR(20)   DEFAULT NULL,
  cv_url        VARCHAR(255)  DEFAULT NULL,
  photo_url     VARCHAR(255)  DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Table : companies (sociétés recruteurs)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  secteur       VARCHAR(100)  DEFAULT NULL,
  adresse       VARCHAR(255)  DEFAULT NULL,
  telephone     VARCHAR(20)   DEFAULT NULL,
  logo_url      VARCHAR(255)  DEFAULT NULL,
  site_web      VARCHAR(255)  DEFAULT NULL,
  statut        ENUM('actif','suspendu') NOT NULL DEFAULT 'actif',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Table : jobs (offres d'emploi)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  company_id      INT           NOT NULL,
  titre           VARCHAR(200)  NOT NULL,
  description     TEXT          NOT NULL,
  competences     TEXT          DEFAULT NULL,
  localisation    VARCHAR(150)  DEFAULT NULL,
  type_contrat    ENUM('CDI','CDD','Stage','Freelance','Alternance') NOT NULL DEFAULT 'CDI',
  salaire_min     DECIMAL(12,2) DEFAULT NULL,
  salaire_max     DECIMAL(12,2) DEFAULT NULL,
  experience      VARCHAR(100)  DEFAULT NULL,
  statut          ENUM('en_attente','approuve','refuse') NOT NULL DEFAULT 'en_attente',
  motif_refus     TEXT          DEFAULT NULL,
  expires_at      DATE          DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Table : applications (candidatures)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  job_id        INT           NOT NULL,
  user_id       INT           NOT NULL,
  lettre        TEXT          DEFAULT NULL,
  cv_url        VARCHAR(255)  DEFAULT NULL,
  statut        ENUM('nouvelle','en_cours','acceptee','refusee') NOT NULL DEFAULT 'nouvelle',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_job  FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
  CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, user_id)
);

-- ============================================================
-- DONNEES DE TEST
-- ============================================================

-- ------------------------------------------------------------
-- 1. COMPTE ADMINISTRATEUR
--    Email : admin@talentconnect.mg
--    Mot de passe : Admin@1234
-- ------------------------------------------------------------
INSERT INTO users (nom, email, mot_de_passe, role) VALUES
('Administrateur', 'admin@talentconnect.mg', '$2b$10$Ku3mLwMT1gMwqY.4qL5sEuiJh2ZOe3b0kOakj7j6bJ9HfAkqe3VPW', 'admin');

-- ------------------------------------------------------------
-- 2. SOCIETES — Mot de passe pour toutes : Societe@1234
-- ------------------------------------------------------------
INSERT INTO companies (nom, email, mot_de_passe, description, secteur, adresse, telephone, site_web, statut) VALUES
(
  'OrangeCo Digital',
  'rh@orangeco.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Agence de transformation digitale specialisee dans le developpement web et mobile, le cloud et la cybersecurite.',
  'Informatique',
  'Lot 3 Ankadifotsy, Antananarivo 101',
  '+261 20 22 123 45',
  'https://orangeco.mg',
  'actif'
),
(
  'MGConseil RH',
  'contact@mgconseil.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Cabinet de conseil en ressources humaines et management. Nous accompagnons les entreprises dans leur croissance humaine.',
  'Conseil & RH',
  'Immeuble Ivato Business Center, Ivato',
  '+261 34 11 222 33',
  'https://mgconseil.mg',
  'actif'
),
(
  'Atomik Agency',
  'jobs@atomik.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Studio de design et communication visuelle. Nous creons des identites de marque, des sites web et des campagnes digitales.',
  'Design & Communication',
  'Rue Rainandriamampandry, Fianarantsoa',
  '+261 33 44 555 66',
  'https://atomik.mg',
  'actif'
),
(
  'Bima Madagascar',
  'recrutement@bima.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Compagnie assurance digitale leader a Madagascar. Nous proposons des solutions assurance accessibles via mobile.',
  'Assurance & Finance',
  'Avenue de l Independence, Toamasina',
  '+261 20 53 678 90',
  'https://bima.mg',
  'actif'
),
(
  'TelecomMG',
  'rh@telecommg.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Operateur telecom et internet fournissant des services de connectivite a travers toute l ile.',
  'Telecommunications',
  'Zone Industrielle Forello, Antananarivo',
  '+261 20 22 987 65',
  'https://telecommg.mg',
  'actif'
),
(
  'DigiMada Solutions',
  'emploi@digimada.mg',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Startup specialisee dans le developpement de solutions SaaS pour le marche africain. Fintech, e-commerce et EdTech.',
  'Startup & SaaS',
  'La Villette, Antananarivo 101',
  '+261 38 00 111 22',
  'https://digimada.mg',
  'suspendu'
);

-- ------------------------------------------------------------
-- 3. CANDIDATS — Mot de passe pour tous : Candidat@1234
-- ------------------------------------------------------------
INSERT INTO users (nom, email, mot_de_passe, role, telephone) VALUES
('Jean Rakoto',         'jean.rakoto@gmail.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 34 11 000 01'),
('Soa Razafy',          'soa.razafy@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 33 22 000 02'),
('Hery Andriamaro',     'hery.andriamaro@yahoo.fr',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 38 33 000 03'),
('Nirina Rajaonarison', 'nirina.rajo@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 32 44 000 04'),
('Fanja Rasolofo',      'fanja.rasolofo@gmail.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 34 55 000 05'),
('Tojo Andriantsoa',    'tojo.andriantsoa@mail.mg',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 33 66 000 06'),
('Lalao Randriamasy',   'lalao.randriamasy@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 38 77 000 07'),
('Zo Rabemananjara',    'zo.rabema@yahoo.fr',           '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 32 88 000 08'),
('Mamy Ratsimanetrika', 'mamy.ratsi@gmail.com',         '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 34 99 000 09'),
('Hasina Ralaivita',    'hasina.ralaivita@mail.mg',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'candidat', '+261 33 00 000 10');

-- ------------------------------------------------------------
-- 4. OFFRES D EMPLOI
--    company_id : 1=OrangeCo 2=MGConseil 3=Atomik 4=Bima 5=TelecomMG 6=DigiMada
-- ------------------------------------------------------------
INSERT INTO jobs (company_id, titre, description, competences, localisation, type_contrat, salaire_min, salaire_max, experience, statut, motif_refus, expires_at) VALUES

(1, 'Developpeur Full-Stack React Node.js',
 'Vous integrerez notre equipe technique pour developper et maintenir nos applications web et API REST en methode Agile.\n\nMissions:\n- Developpement frontend en React\n- Conception API REST en Node.js Express\n- Optimisation des performances\n- Revues de code et documentation technique',
 'React.js, Node.js, Express, MySQL, Git, REST API, Docker',
 'Antananarivo', 'CDI', 2500000, 3200000, '2 ans minimum', 'approuve', NULL, '2026-07-31'),

(1, 'Ingenieur DevOps Cloud AWS',
 'Nous cherchons un ingenieur DevOps pour automatiser nos pipelines CI/CD et gerer notre infrastructure cloud AWS.\n\nMissions:\n- Mise en place pipelines CI/CD\n- Administration AWS (EC2, S3, RDS, Lambda)\n- Monitoring et alerting production\n- Collaboration avec les equipes dev',
 'AWS, Docker, Kubernetes, Terraform, CI/CD, Linux, Python',
 'Antananarivo', 'CDI', 3000000, 4000000, '3 ans minimum', 'approuve', NULL, '2026-06-30'),

(1, 'Chef de Projet Digital',
 'Nous recrutons un chef de projet pour piloter nos projets clients de transformation digitale de bout en bout.\n\nMissions:\n- Planification et suivi projets (delais budget qualite)\n- Interface clients et equipes techniques\n- Redaction specifications fonctionnelles\n- Animation reunions de pilotage et reporting',
 'Gestion de projet, Agile, Scrum, MS Project, JIRA, communication client',
 'Antananarivo', 'CDI', 2200000, 2800000, '3 ans en gestion de projet digital', 'en_attente', NULL, '2026-08-15'),

(2, 'Responsable Marketing et Communication',
 'MGConseil RH recherche un Responsable Marketing pour developper la notoriete de nos services et generer des leads qualifies.\n\nMissions:\n- Definition et execution strategie marketing\n- Gestion reseaux sociaux et site web\n- Creation de contenus (articles newsletters videos)\n- Organisation evenements professionnels\n- Suivi des KPIs',
 'Marketing digital, SEO/SEA, reseaux sociaux, Adobe Suite, Google Analytics',
 'Antananarivo', 'CDI', 1800000, 2400000, '2 ans en marketing B2B', 'approuve', NULL, '2026-07-15'),

(2, 'Consultant RH Junior',
 'Rejoignez notre cabinet en tant que consultant RH junior pour accompagner nos clients PME dans leurs processus de recrutement.\n\nMissions:\n- Redaction et diffusion des offres\n- Sourcing et preselection candidats\n- Conduite entretiens de recrutement\n- Suivi integration nouvelles recrues',
 'Recrutement, entretiens, SIRH, communication, Excel',
 'Antananarivo', 'CDD', 1200000, 1600000, 'Debutant accepte', 'approuve', NULL, '2026-05-31'),

(2, 'Formateur en Developpement Personnel',
 'Nous cherchons un formateur pour animer nos sessions de formation en soft skills aupres de cadres et managers.\n\nMissions:\n- Conception et animation modules de formation\n- Coaching individuel de cadres\n- Evaluation des acquis et suivi post-formation',
 'Pedagogie, communication, leadership, coaching, PowerPoint',
 'Antananarivo - Toamasina', 'Freelance', 800000, 1500000, '3 ans en formation ou coaching',
 'refuse',
 'La description de poste ne correspond pas aux standards de publication. Veuillez preciser le nombre d heures de formation mensuel et le cadre contractuel exact.',
 '2026-06-30'),

(3, 'Designer UI/UX',
 'Atomik Agency cherche un designer UI/UX creatif pour rejoindre notre studio base a Fianarantsoa.\n\nMissions:\n- Conception interfaces web et mobile (wireframes prototypes)\n- Creation identites visuelles et chartes graphiques\n- Collaboration avec les developpeurs\n- Veille sur les tendances design',
 'Figma, Adobe XD, Illustrator, Photoshop, HTML/CSS notions',
 'Fianarantsoa', 'CDI', 1500000, 2000000, '1 an en design UI/UX', 'approuve', NULL, '2026-07-30'),

(3, 'Stagiaire Developpeur Web',
 'Stage de fin d etudes pour un developpeur web passione souhaitant acquerir une experience concrete en agence creative.\n\nMissions:\n- Integration maquettes HTML/CSS/JavaScript\n- Developpement sites WordPress\n- Participation aux projets clients',
 'HTML, CSS, JavaScript, WordPress, Figma notions',
 'Fianarantsoa', 'Stage', 600000, 600000, 'Etudiant Bac+2 minimum en informatique ou multimedia', 'approuve', NULL, '2026-06-15'),

(4, 'Comptable Senior',
 'Bima Madagascar recrute un comptable experimente pour gerer l ensemble des operations comptables et financieres.\n\nMissions:\n- Tenue comptabilite generale et analytique\n- Preparation etats financiers mensuels et annuels\n- Declarations fiscales et sociales\n- Supervision equipe de 2 comptables juniors\n- Audit interne et controle de gestion',
 'Comptabilite generale, SYSCOHADA, Sage, Excel avance, fiscalite malagasy',
 'Toamasina', 'CDI', 2000000, 2600000, '4 ans en comptabilite idealement en assurance ou finance', 'approuve', NULL, '2026-08-31'),

(4, 'Agent Commercial Terrain',
 'Nous recrutons des agents commerciaux dynamiques pour developper notre portefeuille clients dans les regions.\n\nMissions:\n- Prospection et acquisition nouveaux clients\n- Presentation et vente produits assurance\n- Fidelisation du portefeuille existant\n- Reporting hebdomadaire des activites',
 'Vente, prospection, communication, permis B, mobile',
 'Toamasina', 'CDD', 900000, 1400000, 'Experience en vente appreciee debutant accepte', 'approuve', NULL, '2026-06-30'),

(5, 'Ingenieur Reseaux et Telecoms',
 'TelecomMG recherche un ingenieur reseaux pour renforcer son equipe technique en charge de l infrastructure nationale.\n\nMissions:\n- Administration et maintenance reseau fibre optique\n- Configuration equipements Cisco et Huawei\n- Supervision du NOC (Network Operations Center)\n- Resolution incidents niveau 2 et 3\n- Redaction documentation technique reseau',
 'Cisco, Huawei, MPLS, BGP, OSPF, fibre optique, Linux, Wireshark',
 'Antananarivo', 'CDI', 2800000, 3500000, '3 ans en administration reseau', 'approuve', NULL, '2026-09-30'),

(5, 'Technicien Support Niveau 2',
 'Rejoignez notre centre assistance pour assurer le support technique de nos clients entreprises et particuliers.\n\nMissions:\n- Prise en charge et resolution tickets niveau 2\n- Diagnostic problemes de connectivite\n- Installation et configuration equipements clients\n- Redaction rapports intervention',
 'Reseaux IP, TCP/IP, Wi-Fi, support telephonique, ITSM',
 'Antananarivo', 'CDI', 1400000, 1800000, '1 an en support technique ou helpdesk', 'en_attente', NULL, '2026-07-15'),

(6, 'Developpeur Mobile React Native',
 'DigiMada Solutions recrute un developpeur mobile pour creer et maintenir nos applications iOS et Android.\n\nMissions:\n- Developpement applications cross-platform React Native\n- Integration API REST et services tiers\n- Optimisation performances et experience utilisateur\n- Tests unitaires et end-to-end',
 'React Native, JavaScript, TypeScript, Git, REST API, Redux',
 'Antananarivo', 'CDI', 2200000, 3000000, '2 ans en developpement mobile', 'en_attente', NULL, '2026-07-31');

-- ------------------------------------------------------------
-- 5. CANDIDATURES
--    users  : 1=admin 2=Jean 3=Soa 4=Hery 5=Nirina
--             6=Fanja 7=Tojo 8=Lalao 9=Zo 10=Mamy 11=Hasina
--    jobs   : 1=FullStack 2=DevOps 3=ChefProjet 4=Marketing
--             5=ConsultantRH 6=Formateur 7=Designer 8=Stagiaire
--             9=Comptable 10=Commercial 11=Ingenieur 12=Support 13=Mobile
-- ------------------------------------------------------------

-- Jean Rakoto (id=2)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(1, 2, 'Madame Monsieur,\n\nPassionne de developpement web depuis 4 ans, j ai acquis une solide experience en React et Node.js au sein d une startup locale. Votre annonce correspond parfaitement a mon profil et a mes aspirations professionnelles. Je suis particulierement attire par la culture technique d OrangeCo Digital.\n\nJean Rakoto', 'acceptee'),
(4, 2, 'Madame Monsieur,\n\nJe me permets de vous adresser ma candidature pour le poste de Responsable Marketing. Bien que mon profil soit principalement technique, j ai developpe de solides competences en communication digitale et marketing de contenu.\n\nCordialement, Jean Rakoto', 'refusee'),
(11, 2, 'Madame Monsieur,\n\nIngenieur de formation avec une specialisation en reseaux, je suis tres interesse par le poste d Ingenieur Reseaux au sein de TelecomMG. Mon experience avec les equipements Cisco et les protocoles BGP et OSPF me permet de repondre a vos exigences.\n\nJean Rakoto', 'nouvelle');

-- Soa Razafy (id=3)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(1, 3, 'Madame Monsieur,\n\nDiplomee en informatique de l universite d Antananarivo, j ai 3 ans d experience en developpement full-stack. J ai notamment travaille sur des projets e-commerce avec React et une API Node.js.\n\nSoa Razafy', 'en_cours'),
(7, 3, 'Madame Monsieur,\n\nJe candidate au poste de Designer UI/UX chez Atomik Agency. Passionnee de design, j ai realise plusieurs projets freelance d identite visuelle et d interfaces mobiles.\n\nSoa Razafy', 'nouvelle');

-- Hery Andriamaro (id=4)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(2, 4, 'Madame Monsieur,\n\nIngenieur systeme avec 4 ans d experience sur AWS et des certifications AWS Solutions Architect, je souhaite integrer votre equipe DevOps. J ai pilote la migration cloud d une infrastructure hebergeant 50 microservices.\n\nHery Andriamaro', 'en_cours'),
(11, 4, 'Madame Monsieur,\n\nFort de 5 ans en administration reseau chez un operateur regional, je maitrise les protocoles BGP, OSPF et MPLS ainsi que les equipements Cisco et Huawei.\n\nHery Andriamaro', 'acceptee');

-- Nirina Rajaonarison (id=5)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(4, 5, 'Madame Monsieur,\n\nTitulaire d un master en Marketing Digital, j ai 3 ans d experience en marketing B2B. Je suis convaincu de pouvoir developper la notoriete de MGConseil RH et generer des leads qualifies.\n\nNirina Rajaonarison', 'acceptee'),
(5, 5, 'Madame Monsieur,\n\nJe postule pour le poste de Consultant RH Junior. Recemment diplome en Gestion des Ressources Humaines, je suis enthousiaste a l idee de demarrer ma carriere dans un cabinet reconnu.\n\nNirina Rajaonarison', 'nouvelle');

-- Fanja Rasolofo (id=6)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(9, 6, 'Madame Monsieur,\n\nComptable DSCG avec 5 ans d experience dans le secteur bancaire a Madagascar, je maitrise le referentiel SYSCOHADA et le logiciel Sage. Le poste chez Bima Madagascar represente un defi que je souhaite relever.\n\nFanja Rasolofo', 'en_cours'),
(10, 6, 'Madame Monsieur,\n\nAyant exerce pendant 2 ans comme agent commercial dans une societe de microfinance, je connais les techniques de vente et la prospection terrain a Madagascar.\n\nFanja Rasolofo', 'nouvelle');

-- Tojo Andriantsoa (id=7)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(8, 7, 'Madame Monsieur,\n\nEtudiant en 3eme annee de licence informatique a l EMIT, je recherche un stage de 6 mois pour valider mon diplome. J ai developpe plusieurs sites web en HTML/CSS/JavaScript et un blog WordPress.\n\nTojo Andriantsoa', 'acceptee'),
(1, 7, 'Madame Monsieur,\n\nJe souhaite postuler pour le poste de Developpeur Full-Stack. Je maitrise React et Node.js et j ai realise 2 projets personnels avec ces technologies.\n\nTojo Andriantsoa', 'refusee');

-- Lalao Randriamasy (id=8)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(7, 8, 'Madame Monsieur,\n\nDesigner graphique depuis 3 ans, j utilise quotidiennement Figma et la suite Adobe pour des projets d identite de marque et d interfaces mobiles. Je suis basee a Fianarantsoa.\n\nLalao Randriamasy', 'en_cours'),
(4, 8, 'Madame Monsieur,\n\nPassionnee de marketing et de communication, je souhaite rejoindre MGConseil RH pour developper sa presence digitale. J ai gere les reseaux sociaux d une PME pendant 2 ans.\n\nLalao Randriamasy', 'nouvelle');

-- Zo Rabemananjara (id=9)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(11, 9, 'Madame Monsieur,\n\nIngenieur telecoms diplome de l ESPA, je possede une certification CCNA et une experience de 2 ans en maintenance reseau. Integrer TelecomMG serait pour moi l opportunite ideale de progresser.\n\nZo Rabemananjara', 'en_cours'),
(2, 9, 'Madame Monsieur,\n\nSpecialise en cloud et DevOps, j ai deploye des architectures AWS pour deux startups locales. Je souhaite rejoindre OrangeCo Digital pour travailler sur des projets d envergure.\n\nZo Rabemananjara', 'nouvelle');

-- Mamy Ratsimanetrika (id=10)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(5, 10, 'Madame Monsieur,\n\nJe viens d obtenir ma licence en Gestion des Ressources Humaines et je suis a la recherche d un premier poste. Le cabinet MGConseil jouit d une excellente reputation.\n\nMamy Ratsimanetrika', 'nouvelle'),
(10, 10, 'Madame Monsieur,\n\nCommercial dans l ame, j ai effectue plusieurs stages en vente BtoC. Je souhaite integrer Bima Madagascar pour developper mes competences dans le secteur de l assurance digitale.\n\nMamy Ratsimanetrika', 'en_cours');

-- Hasina Ralaivita (id=11)
INSERT INTO applications (job_id, user_id, lettre, statut) VALUES
(1, 11, 'Madame Monsieur,\n\nDeveloppeur Full-Stack avec 3 ans d experience sur React et Node.js, j ai contribue a plusieurs projets SaaS. Je suis particulierement interesse par les defis techniques d OrangeCo Digital.\n\nHasina Ralaivita', 'nouvelle'),
(9, 11, 'Madame Monsieur,\n\nExpert comptable avec 6 ans d experience dont 2 en cabinet d audit, je maitrise parfaitement le SYSCOHADA et la reglementation fiscale malagasy.\n\nHasina Ralaivita', 'en_cours');