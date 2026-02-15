/**
 * Large dataset of chat comments for simulation.
 * Grouped by language code and then by category.
 */
const CHAT_DATA = {
    es: {
        general: [
            "Hola a todos!", "Qué tal?", "Me encanta este live", "Salúdame porfa", "Eres el mejor",
            "Jajajaja", "LOL", "Qué risa", "No puedo con esto", "Me muero de risa",
            "Increíble maquillaje", "Esa máscara mola", "Cómo haces eso?", "Tutorial por favor",
            "Te quiero mucho", "Soy tu fan número 1", "Dime hola", "Saludos desde Madrid",
            "Saludos desde México", "Argentina presente!", "Colombia en la casa", "Chile te ve",
            "Qué guapo/a", "Me casaría contigo", "Guapure", "Hermoso/a", "Divino",
            "A qué hora termina el live?", "Llegué tarde?", "Cuándo es el próximo?",
            "Qué música es esa?", "Sube el volumen", "No se escucha bien", "Se ve borroso"
        ],
        cars: [
            "Qué cochazo!", "Ese motor suena increíble", "Cuántos CV tiene?", "Es un V8?", "Derrapa!",
            "Me encanta ese color", "Yo tengo un BMW", "Mercedes o Audi?", "Ferrari es mejor",
            "Súbele las revoluciones", "Qué marca es?", "Es híbrido?", "Eléctrico no me gusta",
            "Gasolina manda", "Turbo?", "Nitro!", "Carreras ilegales?", "Rápido y Furioso",
            "Enséñanos el interior", "Qué llantas", "Tuning", "Acelera!", "Drift king",
            "Cuidado en la curva", "Qué velocidad", "Coche de ensueño", "Lambo?", "Porsche?",
            "Mustang!", "Camaro!", "JDM", "Muscle car", "Supercar", "Hypercar",
            "Cuánto cuesta?", "Consume mucho?", "0 a 100?", "Velocidad máxima?",
            "Ese alerón", "Escape libre", "Petardea", "Fuego por el escape", "Quemando rueda"
        ],
        motos: [
            "Qué moto es esa?", "Caballito!", "Wheelie!", "Dale gas!", "Ese escape suena brutal",
            "Cuidado con el tráfico", "Usa casco siempre", "Rodilla al suelo", "Curvas",
            "Motero", "Biker life", "Dos ruedas", "Ducati o Yamaha?", "Kawasaki ninja",
            "Harley Davidson", "Sonido celestial", "Akrapovic", "Yoshimura", "Escape modificado",
            "Qué cilindrada?", "1000cc?", "600cc?", "Es una 125?", "Rápida",
            "Bonita moto", "Me llevas?", "Ruta el finde", "Quedada motera", "Saludo motero V",
            "Casco chulo", "Chaqueta de cuero", "Protecciones", "Guantes", "Seguridad ante todo"
        ],
        party: [
            "Fiesta!", "Qué temazo", "Sube el volumen", "DJ pon esa", "Baila!", "Qué ambiente",
            "Dónde es la fiesta?", "Invita!", "Copas arriba", "Salud!", "Chin chin",
            "Qué locura", "Desmadre", "Noche épica", "Hasta el amanecer", "No paramos",
            "Ritmo", "Luces", "Humo", "Confeti", "Gente guapa",
            "Esa canción me gusta", "Reggaeton!", "Techno!", "House!", "Perreo intenso",
            "Mueve el esqueleto", "Qué energía", "Vibra alta", "Pasándolo genial",
            "Bebidas?", "Barra libre?", "VIP", "Reservado", "Botellas", "Chupitos"
        ],
        gaming: [
            "Qué juego es?", "Eres pro", "Qué nivel eres?", "Ranked?", "Juega conmigo",
            "Agregame: ProGamer123", "Faltan heals", "Tanquea!", "GG", "WP", "EZ",
            "Noob", "Hacker", "Aimbot", "Wallhack", "Reportado", "Baneado",
            "Qué gráfica tienes?", "FPS?", "Lag?", "Ping alto", "Se trabó",
            "Headshot", "Triple kill", "Penta!", "Ace!", "Victoria", "Derrota",
            "Farmea", "Rushea", "Campero", "Tóxico", "Chat F", "Clip it",
            "Mejor que Faker", "Ese combo", "Ulti lista", "Cooldown", "Mana",
            "Skin legendaria", "Pase de batalla", "Evento", "Nuevo parche", "Nerf", "Buff"
        ],
        fashion: [
            "Qué outfit!", "Me encanta tu ropa", "Dónde compraste eso?", "Marca?", "Estilo",
            "Te queda genial", "Combinación perfecta", "Qué colores", "Tendencia", "Moda 2026",
            "Diseñador?", "Zapatos divinos", "Bolso caro", "Joyas", "Maquillaje on point",
            "Peinado top", "Corte de pelo", "Tinte", "Uñas", "Manicura",
            "Fashion week", "Modelo?", "Pasarela", "Gucci", "Prada", "Zara", "Shein",
            "Haul de ropa", "OOTD", "Look del día", "Elegante", "Casual", "Streetwear",
            "Vintage", "Retro", "Accesorios", "Gafas de sol", "Cinturón", "Reloj"
        ],
        food: [
            "Qué rico", "Tengo hambre", "Qué estás comiendo?", "Receta?", "Ingredientes?",
            "Se ve delicioso", "Ñam ñam", "Buen provecho", "Invita a cenar", "Postre?",
            "Es picante?", "Dulce o salado?", "Comida sana", "Dieta", "Cheat meal",
            "Pizza", "Hamburguesa", "Sushi", "Tacos", "Pasta", "Ensalada",
            "Chef", "Cocinero", "Restaurante?", "Estrellas Michelin?", "Comida rápida",
            "Bebida?", "Agua?", "Refresco?", "Café", "Té", "Cerveza", "Vino",
            "Desayuno", "Almuerzo", "Cena", "Merienda", "Brunch", "Buffet libre"
        ]
    },
    en: {
        general: [
            "Hello everyone!", "What's up?", "Love this live", "Say hi please", "You're the best",
            "Hahahaha", "LOL", "LMAO", "Can't handle this", "Dying of laughter",
            "Amazing makeup", "Cool mask", "How do you do that?", "Tutorial please",
            "Love you so much", "Number 1 fan", "Say hello", "Greetings from London",
            "Greetings from NY", "USA present!", "Canada here", "UK watching",
            "So handsome/beautiful", "Marry me", "Gorgeous", "Stunning", "Divine"
        ],
        cars: [
            "Nice car!", "Engine sounds amazing", "How many HP?", "Is it a V8?", "Drift it!",
            "Love the color", "I have a BMW", "Mercedes or Audi?", "Ferrari is better",
            "Rev it!", "What brand?", "Hybrid?", "Don't like electric",
            "Petrol head", "Turbo?", "Nitro!", "Street racing?", "Fast and Furious",
            "Show interior", "Sick wheels", "Tuning", "Speed up!", "Drift king",
            "Watch the corner", "So fast", "Dream car", "Lambo?", "Porsche?",
            "Mustang!", "Camaro!", "JDM", "Muscle car", "Supercar", "Hypercar"
        ],
        motos: [
            "What bike is that?", "Wheelie!", "Do a wheelie!", "Full throttle!", "Exhaust sounds brutal",
            "Watch traffic", "Wear helmet", "Knee down", "Curves",
            "Biker", "Biker life", "Two wheels", "Ducati or Yamaha?", "Kawasaki ninja",
            "Harley Davidson", "Heavenly sound", "Akrapovic", "Yoshimura", "Custom exhaust",
            "Engine size?", "1000cc?", "600cc?", "Is it a 125?", "Fast bike",
            "Pretty bike", "Take me for a ride?", "Weekend ride", "Bike meet", "Biker wave V"
        ],
        party: [
            "Party time!", "Great song", "Turn it up", "DJ play that", "Dance!", "Great atmosphere",
            "Where is the party?", "Invite me!", "Cheers!", "Bottoms up",
            "Crazy night", "Epic night", "Till dawn", "Don't stop",
            "Rhythm", "Lights", "Smoke", "Confetti", "Beautiful people",
            "Love this track", "Reggaeton!", "Techno!", "House!", "Twerk",
            "Move it", "High energy", "Good vibes", "Having a blast"
        ],
        gaming: [
            "What game?", "You're pro", "What level?", "Ranked?", "Play with me",
            "Add me: ProGamer123", "Need heals", "Tank!", "GG", "WP", "EZ",
            "Noob", "Hacker", "Aimbot", "Wallhack", "Reported", "Banned",
            "What GPU?", "FPS?", "Lag?", "High ping", "Froze",
            "Headshot", "Triple kill", "Penta!", "Ace!", "Victory", "Defeat",
            "Farm", "Rush", "Camper", "Toxic", "Chat F", "Clip it",
            "Better than Faker", "Nice combo", "Ult ready", "Cooldown", "Mana"
        ],
        fashion: [
            "Nice outfit!", "Love your clothes", "Where did you get that?", "Brand?", "Style",
            "Looks great", "Perfect match", "Nice colors", "Trend", "Fashion 2026",
            "Designer?", "Divine shoes", "Expensive bag", "Jewelry", "Makeup on point",
            "Top hairstyle", "Haircut", "Dye", "Nails", "Manicure",
            "Fashion week", "Model?", "Catwalk", "Gucci", "Prada", "Zara", "Shein",
            "Clothing haul", "OOTD", "Look of the day", "Elegant", "Casual", "Streetwear"
        ],
        food: [
            "Yummy", "I'm hungry", "What are you eating?", "Recipe?", "Ingredients?",
            "Looks delicious", "Nom nom", "Enjoy your meal", "Invite for dinner", "Dessert?",
            "Spicy?", "Sweet or salty?", "Healthy food", "Diet", "Cheat meal",
            "Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Salad",
            "Chef", "Cook", "Restaurant?", "Michelin stars?", "Fast food"
        ]
    },
    fr: {
        general: [
            "Salut tout le monde!", "Ça va?", "J'adore ce live", "Dis bonjour stp", "Tu es le meilleur",
            "Mdr", "PTDR", "LOL", "Trop drôle", "Je meurs de rire",
            "Maquillage incroyable", "Masque cool", "Comment tu fais?", "Tuto stp",
            "Je t'aime", "Fan numéro 1", "Dis coucou", "Salutations de Paris",
            "Salutations de Lyon", "France présente!", "Belgique ici", "Suisse regarde"
        ],
        cars: [
            "Belle voiture!", "Quel bruit moteur", "Combien de chevaux?", "C'est un V8?", "Derrapage!",
            "J'adore la couleur", "J'ai une BMW", "Mercedes ou Audi?", "Ferrari mieux",
            "Accélère!", "Quelle marque?", "Hybride?", "J'aime pas électrique",
            "Essence!", "Turbo?", "Nitro!", "Course de rue?", "Fast and Furious",
            "Montre l'intérieur", "Belles jantes", "Tuning", "Vitesse!", "Roi du drift",
            "Attention virage", "Quelle vitesse", "Voiture de rêve", "Lambo?", "Porsche?",
            "Mustang!", "Camaro!", "Supercar", "Hypercar"
        ],
        motos: [
            "Quelle moto?", "Roue arrière!", "Wheelie!", "Gaz!", "Pot d'échappement brutal",
            "Attention trafic", "Mets le casque", "Genou au sol", "Virages",
            "Motard", "Vie de motard", "Deux roues", "Ducati ou Yamaha?", "Kawasaki ninja",
            "Harley Davidson", "Son magnifique", "Akrapovic", "Pot modifié",
            "Cylindrée?", "1000cc?", "600cc?", "C'est une 125?", "Rapide",
            "Belle bécane", "Tu m'emmènes?", "Balade ce week-end", "V motard"
        ],
        party: [
            "C'est la fête!", "Bon son", "Monte le volume", "DJ met ça", "Danse!", "Quelle ambiance",
            "C'est où?", "Invite!", "Santé!", "Tchin tchin",
            "Quelle folie", "Soirée épique", "Jusqu'à l'aube", "On s'arrête pas",
            "Rythme", "Lumières", "Fumée", "Confettis", "Beaux gosses",
            "J'aime cette chanson", "Reggaeton!", "Techno!", "House!", "Perreo",
            "Bouge ton corps", "Quelle énergie", "Bonnes vibes", "On s'éclate"
        ],
        gaming: [
            "Quel jeu?", "T'es pro", "Quel niveau?", "Classé?", "Joue avec moi",
            "Ajoute: ProGamer123", "Besoin de soin", "Tank!", "GG", "WP", "EZ",
            "Noob", "Hacker", "Aimbot", "Wallhack", "Signalé", "Banni",
            "Quelle carte graphique?", "FPS?", "Lag?", "Ping élevé", "Bug",
            "Headshot", "Triple kill", "Penta!", "Victoire", "Défaite",
            "Farm", "Rush", "Campeur", "Toxique", "Chat F", "Clip ça",
            "Mieux que Faker", "Joli combo", "Ulti prêt", "Cooldown", "Mana"
        ],
        fashion: [
            "Belle tenue!", "J'adore tes fringues", "Acheté où?", "Marque?", "Style",
            "Ça te va bien", "Parfait", "Belles couleurs", "Tendance", "Mode 2026",
            "Créateur?", "Chaussures divines", "Sac cher", "Bijoux", "Maquillage top",
            "Coiffure top", "Coupe", "Couleur", "Ongles", "Manucure",
            "Fashion week", "Mannequin?", "Défilé", "Gucci", "Prada", "Zara", "Shein",
            "Haul", "OOTD", "Look du jour", "Élégant", "Décontracté"
        ],
        food: [
            "Délicieux", "J'ai faim", "Tu manges quoi?", "Recette?", "Ingrédients?",
            "Ça a l'air bon", "Miam miam", "Bon appétit", "Invite à dîner", "Dessert?",
            "Épicé?", "Sucré ou salé?", "Nourriture saine", "Régime", "Cheat meal",
            "Pizza", "Burger", "Sushi", "Tacos", "Pâtes", "Salade",
            "Chef", "Cuisinier", "Resto?", "Étoiles Michelin?", "Fast food"
        ]
    },
    de: {
        general: [
            "Hallo zusammen!", "Wie geht's?", "Liebe diesen Live", "Sag hallo bitte", "Du bist der Beste",
            "Hahahaha", "LOL", "Lach mich tot", "Kann nicht mehr", "Sterbe vor Lachen",
            "Tolles Make-up", "Coole Maske", "Wie machst du das?", "Tutorial bitte",
            "Liebe dich", "Fan Nummer 1", "Sag hallo", "Grüße aus Berlin",
            "Grüße aus München", "Deutschland anwesend!", "Österreich hier", "Schweiz schaut zu"
        ],
        cars: [
            "Tolles Auto!", "Motor klingt super", "Wie viel PS?", "Ist das ein V8?", "Drift!",
            "Liebe die Farbe", "Hab einen BMW", "Mercedes oder Audi?", "Ferrari besser",
            "Gib Gas!", "Welche Marke?", "Hybrid?", "Mag kein Elektro",
            "Benzin!", "Turbo?", "Nitro!", "Straßenrennen?", "Fast and Furious",
            "Zeig Innenraum", "Krasse Felgen", "Tuning", "Schneller!", "Drift King",
            "Kurve!", "Welche Geschwindigkeit", "Traumauto", "Lambo?", "Porsche?",
            "Mustang!", "Camaro!", "Supercar", "Hypercar"
        ],
        motos: [
            "Welches Motorrad?", "Wheelie!", "Mach Wheelie!", "Vollgas!", "Auspuff laut",
            "Vorsicht Verkehr", "Trag Helm", "Knie am Boden", "Kurven",
            "Biker", "Biker Leben", "Zwei Räder", "Ducati oder Yamaha?", "Kawasaki Ninja",
            "Harley Davidson", "Himmlischer Sound", "Akrapovic", "Auspuff modifiziert",
            "Hubraum?", "1000cc?", "600cc?", "Ist das ne 125er?", "Schnell",
            "Schönes Bike", "Nimmst mich mit?", "Wochenendtour", "Motorradtreff", "Biker Gruß"
        ],
        party: [
            "Party Zeit!", "Geiler Song", "Lauter", "DJ spiel das", "Tanz!", "Gute Stimmung",
            "Wo ist die Party?", "Lad mich ein!", "Prost!", "Auf uns",
            "Verrückte Nacht", "Episch", "Bis zum Morgen", "Wir hören nicht auf",
            "Rhythmus", "Lichter", "Rauch", "Konfetti", "Schöne Leute",
            "Mag das Lied", "Reggaeton!", "Techno!", "House!", "Twerk",
            "Beweg dich", "Energie", "Gute Vibes", "Spaß haben"
        ],
        gaming: [
            "Welches Spiel?", "Bist Pro", "Welches Level?", "Ranked?", "Spiel mit mir",
            "Add mich: ProGamer123", "Brauche Heal", "Tank!", "GG", "WP", "EZ",
            "Noob", "Hacker", "Aimbot", "Wallhack", "Gemeldet", "Gebannt",
            "Welche Grafikkarte?", "FPS?", "Lag?", "Hoher Ping", "Hängt",
            "Headshot", "Triple Kill", "Penta!", "Sieg", "Niederlage",
            "Farm", "Rush", "Camper", "Toxisch", "Chat F", "Clip es",
            "Besser als Faker", "Gute Combo", "Ulti bereit", "Cooldown", "Mana"
        ],
        fashion: [
            "Tolles Outfit!", "Liebe deine Kleidung", "Woher?", "Marke?", "Stil",
            "Steht dir", "Passt perfekt", "Schöne Farben", "Trend", "Mode 2026",
            "Designer?", "Göttliche Schuhe", "Teure Tasche", "Schmuck", "Make-up top",
            "Frisur top", "Haarschnitt", "Farbe", "Nägel", "Maniküre",
            "Fashion Week", "Model?", "Laufsteg", "Gucci", "Prada", "Zara", "Shein",
            "Haul", "OOTD", "Look des Tages", "Elegant", "Lässig", "Streetwear"
        ],
        food: [
            "Lecker", "Hab Hunger", "Was isst du?", "Rezept?", "Zutaten?",
            "Sieht gut aus", "Nom nom", "Guten Appetit", "Lad zum Essen ein", "Nachtisch?",
            "Scharf?", "Süß oder salzig?", "Gesund", "Diät", "Cheat Meal",
            "Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Salat",
            "Koch", "Restaurant?", "Michelin Sterne?", "Fast Food"
        ]
    }
};

window.CHAT_DATA = CHAT_DATA;
