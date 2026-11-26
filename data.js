/**
 * CONFIGURACIÓN Y CONTENIDO DEL CALENDARIO DE ADVIENTO
 * Puedes personalizar los nombres, mensajes, fechas y cupones a tu gusto.
 */

const CONFIG = {
  // Nombres de la pareja
  nombreElla: "Mi Amor", // Puedes cambiarlo por su nombre real o apodo (ej: "Valen", "Sofi", "Princesa")
  nombreEl: "Fer",        // Tu nombre

  // Año del calendario (se ajusta automáticamente al año en curso)
  anio: new Date().getFullYear(),

  // Frase principal del encabezado
  titulo: "24 Días Contigo",
  subtitulo: "Un regalo cada día hasta Navidad para recordarte lo mucho que te amo ❤️🎄",

  // Mensaje de la carta final de Nochebuena (Día 24)
  mensajeNavidad: "Eres el mejor regalo que la vida me ha dado. Gracias por cada sonrisa, cada momento y por iluminar mis días. ¡Feliz Navidad, mi vida!",

  // Opciones de configuración
  bloquearPorFecha: true, // Si está en true, solo deja abrir los días correspondientes a la fecha actual (1 al 24 de dic). Se puede desbloquear con el botón de modo prueba.

  // Notificaciones instantáneas a Telegram para Fer
  telegram: {
    activo: true, // Deja en true para recibir el mensaje cuando ella abra una tarjeta
    botToken: "8971019689:AAHVQH_Q3TII0A3xaECt08rurmQG7Bpnk7A", // Token que te da @BotFather
    chatId: "8691253871"       // Tu ID personal que te da @userinfobot
  }
};

// CONTENIDO DE LOS 24 DÍAS
// Tipos disponibles: 
// - 'cupon': Regala un cupón canjeable que se guarda en la billetera
// - 'carta': Mensaje romántico o carta especial
// - 'raspa': Mini-juego de raspar para descubrir sorpresa
// - 'ruleta': Ruleta interactiva de citas/planes
// - 'besos': Frasco interactivo de besos virtuales
// - 'recuerdos': Lista interactiva o galería de momentos
// Campo 'status': "cerrado" | "abierto"
const DIAS_ADVIENTO = [
  {
    dia: 1,
    status: "cerrado",
    icono: "🎁",
    tipo: "cupon",
    titulo: "¡Empieza la cuenta regresiva!",
    subtitulo: "Un inicio dulce para un mes mágico",
    contenido: "Bienvenida a tu calendario de adviento hecho exclusivamente para ti. Durante 24 días tendrás una pequeña sorpresa diaria: cartitas, detalles y cupones especiales. ¡Hoy empezamos con el primero!",
    cupon: {
      id: "cupon-1",
      titulo: "Vale por un Desayuno Sorpresa",
      descripcion: "Válido para un desayuno preparado y servido con todo mi amor en la cama o donde tú prefieras, con tu bebida favorita incluida.",
      icono: "🥞☕",
      color: "from-amber-500 to-orange-600"
    }
  },
  {
    dia: 2,
    status: "cerrado",
    icono: "✨",
    tipo: "recuerdos",
    titulo: "10 Cosas que Amo de Ti",
    subtitulo: "De las millones que existen...",
    contenido: "Hoy no hay cupón, pero hay algo mucho más valioso: un recordatorio de por qué me vuelves loco cada día.",
    lista: [
      "La forma en que se te iluminan los ojos cuando algo te emociona.",
      "Tu risa cuando de verdad te da un ataque de carcajadas.",
      "Cómo me das paz incluso en mis días más pesados.",
      "Tu bondad y la ternura con la que tratas a quienes quieres.",
      "Tus abrazos cuando hace frío (y cuando no, también).",
      "La pasión y dedicación que le pones a tus sueños.",
      "Cómo te ves tan hermosa sin una sola gota de maquillaje.",
      "Nuestras bromas y chistes que solo tú y yo entendemos.",
      "El calor de tu mano cuando caminamos juntos.",
      "El simple hecho de existir y haberme elegido a mí."
    ]
  },
  {
    dia: 3,
    status: "cerrado",
    icono: "🎬",
    tipo: "cupon",
    titulo: "Noche de Cine y Mimos",
    subtitulo: "Tu sala de cine privada",
    contenido: "Para relajarnos y desconectar del mundo juntos.",
    cupon: {
      id: "cupon-2",
      titulo: "Vale por Tarde de Películas y Snacks Ilimitados",
      descripcion: "Válido para elegir la película o maratón de series que tú quieras (sin quejas mías), con palomitas, golosinas y cobijita calientita.",
      icono: "🍿🛋️",
      color: "from-purple-500 to-indigo-600"
    }
  },
  {
    dia: 4,
    status: "cerrado",
    icono: "🪄",
    tipo: "raspa",
    titulo: "Mensaje Secreto Rascable",
    subtitulo: "¡Usa tu dedo o el mouse para raspar la tarjeta!",
    contenido: "Hay una verdad oculta bajo esta capa brillante. Raspa con cuidado para descubrirla:",
    secreto: "Eres la casualidad más bonita que me ha pasado en la vida. Te elegiría mil veces más. 💖"
  },
  {
    dia: 5,
    status: "cerrado",
    icono: "💆‍♀️",
    tipo: "cupon",
    titulo: "Momento Anti-Estrés",
    subtitulo: "Porque te mereces todo el mimo del mundo",
    contenido: "Sé lo mucho que te esfuerzas cada día y a veces el cansancio pesa. Este cupón es para devolverte un poquito de paz.",
    cupon: {
      id: "cupon-3",
      titulo: "Vale por un Masaje Relajante de 30 Minutos",
      descripcion: "Válido para un masaje de espalda, hombros o pies con aceitito o cremita, música suave y cero interrupciones.",
      icono: "🕯️💆‍♀️",
      color: "from-rose-500 to-pink-600"
    }
  },
  {
    dia: 6,
    status: "cerrado",
    icono: "🎵",
    tipo: "carta",
    titulo: "Nuestra Canción y Melodía",
    subtitulo: "La música que suena a ti",
    contenido: "Dicen que la música guarda recuerdos mejor que cualquier fotografía. Cada vez que escucho canciones bonitas de amor, mi mente viaja inmediatamente a ti, a tus gestos y a tu sonrisa. Gracias por ser la mejor melodía de mi vida cotidiana.",
    notaExtra: "💡 Consejo de Fer: ¡Hoy pon nuestra canción favorita y cántala conmigo!"
  },
  {
    dia: 7,
    status: "cerrado",
    icono: "🍦",
    tipo: "cupon",
    titulo: "Un Antojo Dulce",
    subtitulo: "¿Un helado o un café?",
    contenido: "Hoy salimos a endulzarnos la vida como te mereces.",
    cupon: {
      id: "cupon-4",
      titulo: "Vale por Salida por Helado o Café",
      descripcion: "Válido para tu helado favorito de los sabores que se te antojen o una tarde de café y postre.",
      icono: "🍦☕",
      color: "from-emerald-500 to-teal-600"
    }
  },
  {
    dia: 8,
    status: "cerrado",
    icono: "💌",
    tipo: "carta",
    titulo: "Carta: El día que supe que eras tú",
    subtitulo: "Un momento guardado en mi corazón",
    contenido: "Hay momentos en la vida que se quedan grabados para siempre. Recuerdo perfectamente cuando me di cuenta de lo especial que eras para mí: no fue un trueno ni una película, fue tu sencillez, tu complicidad y la paz que sentí a tu lado. En ese instante supe que quería quedarme contigo mucho tiempo.",
    firma: "Con todo mi amor, Fer ❤️"
  },
  {
    dia: 9,
    status: "cerrado",
    icono: "🎡",
    tipo: "ruleta",
    titulo: "Ruleta de Citas Sorpresa",
    subtitulo: "¡Gira para ver qué cita nos toca planear!",
    contenido: "A veces cuesta decidir qué hacer el fin de semana. ¡Deja que el destino amoroso decida por nosotros!",
    opcionesRuleta: [
      "Picnic en el parque con sandwiches y fruta 🧺",
      "Cena romántica hecha en casa a la luz de las velas 🕯️",
      "Paseo nocturno para ver las luces de Navidad 🎄",
      "Tarde de juegos de mesa y postre casero 🎲",
      "Ir a comer hamburguesas o pizza con todo 🍕",
      "Tour de fotos tiernas en nuestro lugar favorito 📸"
    ]
  },
  {
    dia: 10,
    status: "cerrado",
    icono: "👑",
    tipo: "cupon",
    titulo: "Poder Absoluto",
    subtitulo: "Hoy tú tienes la corona",
    contenido: "¿Cansada del 'no sé, lo que tú quieras'? Este cupón resuelve el dilema universal de las parejas.",
    cupon: {
      id: "cupon-5",
      titulo: "Vale por Decisión Total de Comida",
      descripcion: "Válido para elegir qué comemos o cenamos hoy, sin derecho a veto ni 'pero' de mi parte. Lo que tú digas se hace.",
      icono: "🍕👑",
      color: "from-amber-400 to-yellow-600"
    }
  },
  {
    dia: 11,
    status: "cerrado",
    icono: "🌟",
    tipo: "recuerdos",
    titulo: "Nuestras Pequeñas Grandes Victorias",
    subtitulo: "Momentos que nos hacen únicos",
    contenido: "El amor no solo está en las fechas especiales, sino en todas las pequeñas cosas que hemos construido juntos:",
    lista: [
      "Cada vez que nos reímos de algo tonto hasta parecer 2 locos.",
      "Aprender a entendernos con solo una mirada.",
      "Apoyarnos cuando uno de los dos ha tenido un mal día.",
      "Los planes espontáneos que salieron mejor de lo esperado.",
      "Hacer de cualquier lugar común el mejor rincón del mundo con tu compañía."
    ]
  },
  {
    dia: 12,
    status: "cerrado",
    icono: "📸",
    tipo: "cupon",
    titulo: "Recuerdos para Siempre",
    subtitulo: "Capturando sonrisas",
    contenido: "Porque me encanta tener fotos tuyas y fotos de los dos.",
    cupon: {
      id: "cupon-6",
      titulo: "Vale por Sesión de Fotos Juntos",
      descripcion: "Válido para tomarnos todas las fotos que quieras (estilo parejas, divertidas o aesthetic) sin que ponga caras ni me queje.",
      icono: "📸✨",
      color: "from-blue-500 to-cyan-600"
    }
  },
  {
    dia: 13,
    status: "cerrado",
    icono: "🧸",
    tipo: "carta",
    titulo: "Mi Lugar Seguro",
    subtitulo: "En medio del caos",
    contenido: "El mundo a veces va demasiado rápido, hay estrés, pendientes y ruido, pero cuando estoy contigo, todo se calma. Eres mi refugio, el lugar donde puedo ser completamente yo sin miedo. Gracias por darme tanta seguridad y amor sincero.",
    fraseDestacada: "\"En tus brazos encontré el hogar que no sabía que estaba buscando.\""
  },
  {
    dia: 14,
    status: "cerrado",
    icono: "🍩",
    tipo: "cupon",
    titulo: "Antojito a Domicilio",
    subtitulo: "Directo a tu paladar",
    contenido: "¿Día pesado o antojo repentino? Este cupón te salva.",
    cupon: {
      id: "cupon-7",
      titulo: "Vale por un Antojo / Postre a Domicilio",
      descripcion: "Válido para pedirte por delivery o llevarte a casa tu postre, chocolate o antojito favorito cuando más lo necesites.",
      icono: "🍩🛵",
      color: "from-pink-500 to-rose-600"
    }
  },
  {
    dia: 15,
    status: "cerrado",
    icono: "✨",
    tipo: "raspa",
    titulo: "Segunda Tarjeta Rascable",
    subtitulo: "¡Descubre lo que dice el boleto dorado!",
    contenido: "Hay una promesa especial escondida aquí para ti:",
    secreto: "Prometo cuidarte, escucharte, hacerte reír y recordarte todos los días lo mucho que vales. 💍❤️"
  },
  {
    dia: 16,
    status: "cerrado",
    icono: "🏆",
    tipo: "cupon",
    titulo: "El Comodín Sagrado",
    subtitulo: "Úsalo con sabiduría",
    contenido: "Un poder inimaginable ha caído en tus manos el día de hoy...",
    cupon: {
      id: "cupon-8",
      titulo: "Vale por Tener la Razón por 24 Horas",
      descripcion: "Válido para ganar automáticamente cualquier debate amigable o desacuerdo menor. Tienes la razón oficial garantizada por un día completo.",
      icono: "🏆⚖️",
      color: "from-violet-500 to-purple-700"
    }
  },
  {
    dia: 17,
    status: "cerrado",
    icono: "🌠",
    tipo: "carta",
    titulo: "Deseos para Nuestro Futuro",
    subtitulo: "Soñando despiertos",
    contenido: "Cuando pienso en el próximo año y en todo lo que viene, lo que más ilusión me da es saber que estarás en mis planes. Quiero más viajes contigo, más noches de risas, metas cumplidas hombro a hombro y seguir creciendo juntos como el gran equipo que somos.",
    promesa: "Brindo por todo lo que hemos vivido y por todo lo hermoso que nos falta por vivir juntos."
  },
  {
    dia: 18,
    status: "cerrado",
    icono: "🕯️",
    tipo: "cupon",
    titulo: "Cena Romántica",
    subtitulo: "Noche especial para los dos",
    contenido: "Un momento elegante o acogedor solo para nosotros.",
    cupon: {
      id: "cupon-9",
      titulo: "Vale por una Cena Romántica a la Luz de las Velas",
      descripcion: "Válido para una cena deliciosa preparada por mí o en tu restaurante favorito, con ambiente romántico y postrecito.",
      icono: "🍷🍝",
      color: "from-red-500 to-rose-700"
    }
  },
  {
    dia: 19,
    status: "cerrado",
    icono: "💋",
    tipo: "besos",
    titulo: "Frasco de Besos Infinitos",
    subtitulo: "Haz click en el frasco para liberar amor",
    contenido: "Cuando estés triste, me extrañes o simplemente quieras sentirme cerca, abre este frasco y haz click cuantas veces quieras. Cada toque es un beso real esperándote.",
    contadorBesos: 0
  },
  {
    dia: 20,
    status: "cerrado",
    icono: "🛌",
    tipo: "cupon",
    titulo: "Noche Desconectada",
    subtitulo: "Solo tú y yo",
    contenido: "El mejor plan a veces es no hacer nada más que estar juntos.",
    cupon: {
      id: "cupon-10",
      titulo: "Vale por Noche de Pijamada y Cero Celulares",
      descripcion: "Válido para una velada de apagar pantallas del trabajo, ponernos ropa cómoda, platicar horas, comer rico y dormir abrazaditos.",
      icono: "🧸🌙",
      color: "from-indigo-600 to-blue-800"
    }
  },
  {
    dia: 21,
    status: "cerrado",
    icono: "📖",
    tipo: "carta",
    titulo: "Un Poema para Ti",
    subtitulo: "Palabras sinceras",
    contenido: "No hacen falta rimas perfectas cuando el sentimiento es real. Eres la luz suave que ilumina mis días, la risa que espanta mis miedos y el abrazo donde todo vuelve a estar bien. Si tuviera que volver a empezar mi vida, te buscaría mucho antes para amarte más tiempo.",
    autor: "— Fer"
  },
  {
    dia: 22,
    status: "cerrado",
    icono: "🫂",
    tipo: "cupon",
    titulo: "El Abrazo Más Cálido",
    subtitulo: "Recarga de energía inmediata",
    contenido: "Este cupón nunca vence y tiene usos ilimitados.",
    cupon: {
      id: "cupon-11",
      titulo: "Vale por Abrazo de Oso Infinito e Incondicional",
      descripcion: "Válido para un abrazo apretado de esos que te reinician la vida, en cualquier momento, hora o lugar donde lo necesites.",
      icono: "🫂❤️",
      color: "from-teal-500 to-emerald-700"
    }
  },
  {
    dia: 23,
    status: "cerrado",
    icono: "🎄",
    tipo: "carta",
    titulo: "Víspera de Nochebuena",
    subtitulo: "A solo unas horas de Navidad",
    contenido: "Mañana es Nochebuena. Mirando atrás este mes y este año, no tengo dudas de que mi mayor bendición ha sido tenerte a mi lado. Gracias por tu paciencia, tu ternura inagotable y por hacerme el hombre más afortunado. ¡Prepárate para mañana!",
    nota: "Mañana se abrirá la última y más especial puerta del calendario 🎁✨"
  },
  {
    dia: 24,
    status: "cerrado",
    icono: "🎅",
    tipo: "cupon",
    titulo: "¡FELIZ NOCHEBUENA Y NAVIDAD!",
    subtitulo: "La puerta final de nuestro calendario",
    contenido: "¡Llegamos al día 24, mi amor! La Navidad llegó, pero lo más hermoso de esta época no son los regalos bajo el árbol, sino tener a la persona correcta al lado. Eres mi hogar, mi paz y mi mayor amor.",
    cupon: {
      id: "cupon-12",
      titulo: "EL SUPER CUPÓN: Deseo Ilimitado de Amor",
      descripcion: "Válido para pedir lo que tu corazón desee: un viaje, un regalo soñado, un día completo dedicado solo a ti, o cualquier promesa que quieras que sellemos juntos.",
      icono: "🌟👑🎄",
      color: "from-amber-400 via-rose-500 to-red-600"
    }
  }
];
