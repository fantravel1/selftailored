/* ============================================================
   SelfTailored.com — Main JavaScript
   Interactive Elements, Quiz Engine, Search, Generators
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initScrollReveal();
    initBackToTop();
    initFitSearch();
    initCarousels();
    initQuiz();
    initCapsuleGenerator();
    initTabs();
    initAccordions();
    initCookieBanner();
    initCounters();
    initSmoothScroll();
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.nav-mobile');

    // Scroll effect
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      });
    }

    // Mobile toggle
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     FIT SEARCH (Fix This Fit)
     ============================================================ */
  function initFitSearch() {
    var input = document.querySelector('.fit-search-input');
    var suggestionsBox = document.querySelector('.fit-search-suggestions');
    if (!input || !suggestionsBox) return;

    var fitProblems = getFitProblems();

    input.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      suggestionsBox.innerHTML = '';

      if (query.length < 2) {
        suggestionsBox.classList.remove('active');
        return;
      }

      var matches = fitProblems.filter(function (p) {
        return p.title.toLowerCase().includes(query) ||
               p.keywords.some(function (k) { return k.includes(query); });
      }).slice(0, 6);

      if (matches.length === 0) {
        suggestionsBox.classList.remove('active');
        return;
      }

      matches.forEach(function (match) {
        var div = document.createElement('div');
        div.className = 'fit-search-suggestion';
        div.textContent = match.title;
        div.addEventListener('click', function () {
          input.value = match.title;
          suggestionsBox.classList.remove('active');
          showFitResult(match);
        });
        suggestionsBox.appendChild(div);
      });

      suggestionsBox.classList.add('active');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.fit-search-box')) {
        suggestionsBox.classList.remove('active');
      }
    });

    // Clickable problem cards
    document.querySelectorAll('.fit-problem-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var problemTitle = card.querySelector('h4').textContent;
        var match = fitProblems.find(function (p) {
          return p.title === problemTitle;
        });
        if (match) {
          input.value = match.title;
          showFitResult(match);
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  function showFitResult(problem) {
    var resultsContainer = document.querySelector('.fit-search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'block';

    var html = '<div class="results-panel active">';
    html += '<h3>' + problem.title + '</h3>';
    html += '<div class="result-section"><h4>' + getTranslation('whyItHappens') + '</h4><p>' + problem.why + '</p></div>';
    html += '<div class="result-section"><h4>' + getTranslation('whatToShopFor') + '</h4><p>' + problem.shop + '</p></div>';
    html += '<div class="result-section"><h4>' + getTranslation('whatToTailor') + '</h4><p>' + problem.tailor + '</p></div>';
    html += '<div class="result-section"><h4>' + getTranslation('whatToAvoid') + '</h4><p>' + problem.avoid + '</p></div>';
    html += '</div>';

    resultsContainer.innerHTML = html;
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getFitProblems() {
    var lang = document.documentElement.lang || 'en';

    if (lang === 'es') {
      return [
        { title: 'Los jeans se abren en la cintura', keywords: ['jeans', 'cintura', 'abren', 'gap'], why: 'La cintura del jean es demasiado grande en relacion a tus caderas. Los fabricantes cortan para un ratio cintura-cadera promedio.', shop: 'Busca jeans con cintura curvada, jeans de tiro alto con pretina mas ancha, o marcas especificas para caderas curvas.', tailor: 'Un sastre puede tomar la cintura por $15-25. Es una de las alteraciones mas comunes y faciles.', avoid: 'Evita jeans de tiro bajo si tienes mucha diferencia cintura-cadera. Los cinturones no resuelven el problema.' },
        { title: 'La camisa se abre en el busto', keywords: ['camisa', 'busto', 'botones', 'abre'], why: 'La camisa esta cortada para un busto mas pequeno. La tension crea esas aberturas entre los botones.', shop: 'Busca camisas con corte para busto amplio, con pinzas o paneles laterales elasticos.', tailor: 'Un sastre puede agregar un panel oculto detras de la botonadura o ajustar las pinzas por $20-35.', avoid: 'Evita comprar una talla mas grande solo por el busto — te quedara enorme en los hombros.' },
        { title: 'El blazer queda grande en los hombros', keywords: ['blazer', 'hombros', 'grande', 'saco'], why: 'La costura del hombro cae mas alla de tu hombro real. Esto hace que todo el blazer se vea desproporcionado.', shop: 'Prueba blazers petite aunque no seas baja — tienen hombros mas estrechos. Busca costuras de hombro estructuradas.', tailor: 'Ajustar hombros es una alteracion compleja ($40-60+). Solo vale la pena en prendas de calidad.', avoid: 'Evita blazers oversize si buscas un look profesional estructurado.' },
        { title: 'Los pantalones se arrugan en el tobillo', keywords: ['pantalones', 'tobillo', 'arrugan', 'largo'], why: 'Los pantalones son demasiado largos para tu estatura. El exceso de tela se acumula en el tobillo.', shop: 'Busca marcas que ofrezcan largo petite o regular. Considera pantalones cropped que terminan sobre el tobillo.', tailor: 'Dobladillar pantalones es la alteracion mas barata y rapida: $10-15 generalmente.', avoid: 'Evitar enrollar los pantalones como solucion permanente — se ve casual y descuidado en contextos profesionales.' },
        { title: 'El vestido sube al caminar', keywords: ['vestido', 'sube', 'caminar', 'rides'], why: 'El vestido es demasiado ajustado en las caderas o el tejido no tiene suficiente movimiento. La friccion hace que suba.', shop: 'Busca vestidos con forro o de corte A. Los tejidos con algo de peso caen mejor.', tailor: 'Un sastre puede agregar un forro que reduce la friccion por $25-40.', avoid: 'Evita vestidos bodycon en telas muy rigidas si esto te molesta constantemente.' },
        { title: 'Los tirantes del sosten se ven', keywords: ['sosten', 'tirantes', 'se ven', 'bra'], why: 'La abertura de la prenda es mas amplia que la distancia entre tus tirantes. Es un problema de diseno, no tuyo.', shop: 'Busca sostenes con tirantes ajustables lateralmente o sostenes racerback. Tambien existen clips para cruzar tirantes.', tailor: 'Un sastre puede coser presillas internas para sujetar los tirantes por $5-10 por prenda.', avoid: 'Evita escotes muy amplios sin planificar el sosten que usaras debajo.' }
      ];
    } else if (lang === 'fr') {
      return [
        { title: 'Le jean baille a la taille', keywords: ['jean', 'taille', 'baille', 'gap'], why: 'La taille du jean est trop grande par rapport a vos hanches. Les fabricants coupent pour un ratio taille-hanches moyen.', shop: 'Cherchez des jeans a taille courbee, des jeans taille haute avec une ceinture plus large, ou des marques specialisees pour les hanches courbees.', tailor: 'Un couturier peut reprendre la taille pour 15-25€. C\'est l\'une des retouches les plus courantes et faciles.', avoid: 'Evitez les jeans taille basse si vous avez une grande difference taille-hanches. Les ceintures ne resolvent pas le probleme.' },
        { title: 'La chemise tire au niveau du buste', keywords: ['chemise', 'buste', 'boutons', 'tire'], why: 'La chemise est coupee pour un buste plus petit. La tension cree ces ouvertures entre les boutons.', shop: 'Cherchez des chemises coupees pour buste genereux, avec des pinces ou des panneaux lateraux elastiques.', tailor: 'Un couturier peut ajouter un panneau cache derriere le boutonnage ou ajuster les pinces pour 20-35€.', avoid: 'Evitez d\'acheter une taille plus grande juste pour le buste — le vetement sera trop grand aux epaules.' },
        { title: 'Le blazer est trop large aux epaules', keywords: ['blazer', 'epaules', 'large', 'veste'], why: 'La couture de l\'epaule tombe au-dela de votre epaule reelle. Cela donne un air disproportionne a tout le blazer.', shop: 'Essayez les blazers petite meme si vous n\'etes pas petite — ils ont des epaules plus etroites.', tailor: 'Ajuster les epaules est une retouche complexe (40-60€+). Cela ne vaut la peine que pour des pieces de qualite.', avoid: 'Evitez les blazers oversize si vous cherchez un look professionnel structure.' },
        { title: 'Le pantalon fait des plis a la cheville', keywords: ['pantalon', 'cheville', 'plis', 'long'], why: 'Le pantalon est trop long pour votre taille. L\'exces de tissu s\'accumule a la cheville.', shop: 'Cherchez des marques qui proposent des longueurs petite ou regular. Considerez les pantalons cropped.', tailor: 'Ourler un pantalon est la retouche la moins chere et la plus rapide : 10-15€ generalement.', avoid: 'Evitez de rouler les pantalons comme solution permanente — cela fait decontracte dans des contextes professionnels.' },
        { title: 'La robe remonte en marchant', keywords: ['robe', 'remonte', 'marcher', 'rides'], why: 'La robe est trop ajustee aux hanches ou le tissu n\'a pas assez de mouvement. Le frottement la fait remonter.', shop: 'Cherchez des robes avec doublure ou de coupe trapeze. Les tissus avec un peu de poids tombent mieux.', tailor: 'Un couturier peut ajouter une doublure qui reduit le frottement pour 25-40€.', avoid: 'Evitez les robes moulantes en tissus tres rigides si cela vous derange constamment.' },
        { title: 'Les bretelles du soutien-gorge se voient', keywords: ['soutien-gorge', 'bretelles', 'voient', 'bra'], why: 'L\'encolure du vetement est plus large que la distance entre vos bretelles. C\'est un probleme de conception, pas le votre.', shop: 'Cherchez des soutiens-gorge avec bretelles ajustables lateralement ou des modeles racerback.', tailor: 'Un couturier peut coudre des passants internes pour maintenir les bretelles pour 5-10€ par vetement.', avoid: 'Evitez les decolles tres larges sans planifier le soutien-gorge que vous porterez dessous.' }
      ];
    }

    // English (default)
    return [
      { title: 'Jeans gap at the waist', keywords: ['jeans', 'waist', 'gap', 'gaping', 'denim'], why: 'The waistband is cut for a different waist-to-hip ratio than yours. Mass manufacturers cut for an average ratio, which leaves a gap for many body types.', shop: 'Look for curvy-fit jeans with a contoured waistband, high-rise jeans with a wider waistband, or brands like Good American and NYDJ that cut specifically for curves.', tailor: 'A tailor can take in the waistband for $15-25. This is one of the most common and easiest alterations for jeans.', avoid: 'Avoid low-rise jeans if you have a significant waist-to-hip difference. Belts mask the problem but don\'t fix it.' },
      { title: 'Button-down pulls at the bust', keywords: ['button', 'bust', 'pulling', 'shirt', 'blouse', 'gaping'], why: 'The shirt is cut for a smaller bust. The tension creates those telltale gaps between the buttons, revealing what\'s underneath.', shop: 'Look for shirts designed for fuller busts with hidden plackets, bust darts, or stretch side panels. Brands like Universal Standard and The Shirt excel here.', tailor: 'A tailor can add a hidden placket behind the buttonline or adjust the darts for $20-35. This transforms a $30 shirt into a custom fit.', avoid: 'Don\'t size up for the bust alone — the shoulders and body will be too large. Fix the bust, not the size.' },
      { title: 'Blazer shoulders too wide', keywords: ['blazer', 'shoulders', 'wide', 'jacket', 'suit'], why: 'The shoulder seam falls beyond your actual shoulder point. This throws off the entire blazer\'s proportions and makes you look like you borrowed someone else\'s jacket.', shop: 'Try petite blazers even if you\'re not petite — they have narrower shoulders. Look for set-in sleeves with structured shoulder seams.', tailor: 'Shoulder alterations are complex ($40-60+). Only worth it on quality pieces. A good tailor can narrow the shoulders while keeping the proportions.', avoid: 'Avoid oversized blazers if you want a structured, professional look. The shoulder is the hardest part to alter correctly.' },
      { title: 'Pants bunch at the ankle', keywords: ['pants', 'ankle', 'bunching', 'length', 'hem', 'trousers'], why: 'The pants are too long for your inseam. Excess fabric pools at the ankle, breaking the line and making the pants look sloppy.', shop: 'Look for brands offering petite or regular inseam options. Consider cropped or ankle-length pants that end above the ankle bone.', tailor: 'Hemming pants is the cheapest and fastest alteration: $10-15 typically. Even designer jeans benefit from a proper hem.', avoid: 'Don\'t cuff or roll as a permanent solution — it reads casual and can look unfinished in professional settings.' },
      { title: 'Dress rides up when walking', keywords: ['dress', 'rides up', 'walking', 'shifting', 'skirt'], why: 'The dress is too tight through the hips or the fabric lacks drape. Friction between your legs and the fabric causes it to migrate upward with every step.', shop: 'Look for dresses with a lining or an A-line cut. Fabrics with some weight and drape stay put better. Consider adding a slip.', tailor: 'A tailor can add a lining that reduces friction for $25-40. This simple fix can save an otherwise unwearable dress.', avoid: 'Avoid bodycon styles in stiff fabrics if this is a recurring issue. The combination of tight + rigid maximizes riding up.' },
      { title: 'Bra straps keep showing', keywords: ['bra', 'straps', 'showing', 'visible', 'neckline'], why: 'The garment neckline is wider than the distance between your bra straps. This is a design mismatch, not your problem.', shop: 'Look for bras with adjustable or convertible straps. Racerback, strapless, or low-back bras solve specific neckline issues. Strap clips are a quick fix.', tailor: 'A tailor can sew internal strap keepers (small loops) into the garment for $5-10 per piece. Simple, invisible, effective.', avoid: 'Avoid wide necklines without planning the bra you\'ll wear underneath. Prevention is easier than fixing.' }
    ];
  }

  /* ============================================================
     CAROUSELS
     ============================================================ */
  function initCarousels() {
    document.querySelectorAll('.silhouette-carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.silhouette-track');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      if (!track) return;

      var scrollAmount = 300;

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
      }
    });
  }

  /* ============================================================
     QUIZ ENGINE
     ============================================================ */
  function initQuiz() {
    var quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;

    var questions = quizContainer.querySelectorAll('.quiz-question');
    var progressSteps = quizContainer.querySelectorAll('.quiz-progress-step');
    var currentStep = 0;
    var answers = {};

    // Show first question
    if (questions.length > 0) {
      questions[0].classList.add('active');
      if (progressSteps[0]) progressSteps[0].classList.add('active');
    }

    // Option click handlers
    quizContainer.querySelectorAll('.quiz-option').forEach(function (option) {
      option.addEventListener('click', function () {
        var questionEl = this.closest('.quiz-question');
        questionEl.querySelectorAll('.quiz-option').forEach(function (o) {
          o.classList.remove('selected');
        });
        this.classList.add('selected');

        var questionIndex = Array.from(questions).indexOf(questionEl);
        answers[questionIndex] = this.dataset.value || this.querySelector('h4').textContent;
      });
    });

    // Next/Prev buttons
    quizContainer.querySelectorAll('.quiz-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!answers[currentStep]) {
          btn.style.transform = 'translateX(5px)';
          setTimeout(function () { btn.style.transform = ''; }, 200);
          return;
        }
        navigateQuiz(1);
      });
    });

    quizContainer.querySelectorAll('.quiz-prev').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navigateQuiz(-1);
      });
    });

    // Submit
    quizContainer.querySelectorAll('.quiz-submit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!answers[currentStep]) return;
        showQuizResults(answers);
      });
    });

    function navigateQuiz(direction) {
      questions[currentStep].classList.remove('active');
      if (progressSteps[currentStep]) {
        progressSteps[currentStep].classList.remove('active');
        if (direction > 0) progressSteps[currentStep].classList.add('complete');
        else progressSteps[currentStep].classList.remove('complete');
      }

      currentStep += direction;

      questions[currentStep].classList.add('active');
      if (progressSteps[currentStep]) progressSteps[currentStep].classList.add('active');
    }

    function showQuizResults(answers) {
      var resultsPanel = quizContainer.querySelector('.results-panel');
      if (!resultsPanel) return;

      // Hide all questions
      questions.forEach(function (q) { q.classList.remove('active'); });
      progressSteps.forEach(function (s) { s.classList.add('complete'); });

      // Generate results
      var silhouettes = generateSilhouettes(answers);
      var necklines = generateNecklines(answers);
      var tailoringTips = generateTailoringTips(answers);

      var lang = document.documentElement.lang || 'en';
      var labels = getQuizLabels(lang);

      resultsPanel.innerHTML = '<h3>' + labels.resultTitle + '</h3>' +
        '<div class="result-section"><h4>' + labels.silhouettes + '</h4><div class="result-tags">' +
        silhouettes.map(function (s) { return '<span class="tag">' + s + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="result-section"><h4>' + labels.necklines + '</h4><div class="result-tags">' +
        necklines.map(function (n) { return '<span class="tag">' + n + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="result-section"><h4>' + labels.tailoring + '</h4><div class="result-tags">' +
        tailoringTips.map(function (t) { return '<span class="tag tag-outline">' + t + '</span>'; }).join('') +
        '</div></div>';

      resultsPanel.classList.add('active');
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function getQuizLabels(lang) {
      var labels = {
        en: { resultTitle: 'Your Tailored Blueprint', silhouettes: 'Your Best Silhouettes', necklines: 'Your Best Necklines', tailoring: 'Tailoring Priorities' },
        es: { resultTitle: 'Tu Plano de Estilo', silhouettes: 'Tus Mejores Siluetas', necklines: 'Tus Mejores Escotes', tailoring: 'Prioridades de Sastreria' },
        fr: { resultTitle: 'Votre Plan de Style', silhouettes: 'Vos Meilleures Silhouettes', necklines: 'Vos Meilleurs Decolles', tailoring: 'Priorites de Retouche' }
      };
      return labels[lang] || labels.en;
    }

    function generateSilhouettes() {
      var all = {
        en: ['Structured Column', 'Soft Waist Definition', 'Oversized + Tapered', 'Long Line + Wide Leg', 'Cropped Jacket + High Waist', 'Monochrome Vertical'],
        es: ['Columna Estructurada', 'Cintura Definida Suave', 'Oversized + Afilado', 'Linea Larga + Pierna Ancha', 'Chaqueta Corta + Cintura Alta', 'Monocromo Vertical'],
        fr: ['Colonne Structuree', 'Taille Douce Definie', 'Oversize + Effile', 'Ligne Longue + Jambe Large', 'Veste Courte + Taille Haute', 'Monochrome Vertical']
      };
      var lang = document.documentElement.lang || 'en';
      var options = all[lang] || all.en;
      return shuffleArray(options).slice(0, 3);
    }

    function generateNecklines() {
      var all = {
        en: ['V-Neck', 'Scoop Neck', 'Boat Neck', 'Square Neck', 'Crew Neck', 'Wrap Style'],
        es: ['Cuello en V', 'Cuello Redondo', 'Cuello Barco', 'Cuello Cuadrado', 'Cuello Cerrado', 'Estilo Cruzado'],
        fr: ['Col en V', 'Col Rond', 'Col Bateau', 'Col Carre', 'Col Ras du Cou', 'Style Portefeuille']
      };
      var lang = document.documentElement.lang || 'en';
      var options = all[lang] || all.en;
      return shuffleArray(options).slice(0, 3);
    }

    function generateTailoringTips() {
      var all = {
        en: ['Hem Pants', 'Take In Waist', 'Add Darts', 'Shorten Sleeves', 'Taper Legs'],
        es: ['Dobladillar Pantalones', 'Tomar Cintura', 'Agregar Pinzas', 'Acortar Mangas', 'Afilar Piernas'],
        fr: ['Ourler Pantalons', 'Reprendre la Taille', 'Ajouter des Pinces', 'Raccourcir Manches', 'Effiler Jambes']
      };
      var lang = document.documentElement.lang || 'en';
      var options = all[lang] || all.en;
      return shuffleArray(options).slice(0, 3);
    }
  }

  /* ============================================================
     CAPSULE GENERATOR
     ============================================================ */
  function initCapsuleGenerator() {
    var capsuleTags = document.querySelectorAll('.capsule-tag');
    var capsulePreview = document.querySelector('.capsule-preview');
    if (!capsuleTags.length || !capsulePreview) return;

    var capsuleData = getCapsuleData();

    capsuleTags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        capsuleTags.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        var capsuleName = this.dataset.capsule;
        var data = capsuleData[capsuleName];
        if (!data) return;

        capsulePreview.innerHTML = '';
        data.forEach(function (item) {
          var div = document.createElement('div');
          div.className = 'capsule-item reveal';
          div.innerHTML = '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy"><p>' + item.name + '</p>';
          capsulePreview.appendChild(div);
          // Trigger reveal
          setTimeout(function () { div.classList.add('visible'); }, 50);
        });
      });
    });

    // Activate first tag
    if (capsuleTags[0]) capsuleTags[0].click();
  }

  function getCapsuleData() {
    var lang = document.documentElement.lang || 'en';
    var labels = {
      en: {
        blazer: 'Tailored Blazer', whiteshirt: 'White Button-Down', trousers: 'Straight Trousers', silk: 'Silk Blouse', pencilskirt: 'Pencil Skirt', pumps: 'Classic Pumps',
        tee: 'Fitted Tee', jeans: 'Dark Wash Jeans', sneakers: 'White Sneakers', cardigan: 'Knit Cardigan', chinos: 'Relaxed Chinos', flats: 'Ballet Flats',
        linen: 'Linen Shirt', shorts: 'Tailored Shorts', sundress: 'Wrap Dress', sandals: 'Leather Sandals', hat: 'Sun Hat', tote: 'Canvas Tote',
        lbd: 'Little Black Dress', heels: 'Statement Heels', clutch: 'Evening Clutch', jumpsuit: 'Tailored Jumpsuit', wrap: 'Silk Wrap Top', earrings: 'Drop Earrings'
      },
      es: {
        blazer: 'Blazer Sastre', whiteshirt: 'Camisa Blanca', trousers: 'Pantalon Recto', silk: 'Blusa de Seda', pencilskirt: 'Falda Lapiz', pumps: 'Zapatos de Tacon',
        tee: 'Camiseta Ajustada', jeans: 'Jeans Oscuros', sneakers: 'Zapatillas Blancas', cardigan: 'Cardigan de Punto', chinos: 'Chinos Relajados', flats: 'Bailarinas',
        linen: 'Camisa de Lino', shorts: 'Shorts Sastre', sundress: 'Vestido Cruzado', sandals: 'Sandalias de Cuero', hat: 'Sombrero de Sol', tote: 'Bolsa de Lona',
        lbd: 'Vestido Negro Clasico', heels: 'Tacones Statement', clutch: 'Clutch de Noche', jumpsuit: 'Mono Sastre', wrap: 'Top Cruzado de Seda', earrings: 'Aretes Colgantes'
      },
      fr: {
        blazer: 'Blazer Tailleur', whiteshirt: 'Chemise Blanche', trousers: 'Pantalon Droit', silk: 'Blouse en Soie', pencilskirt: 'Jupe Crayon', pumps: 'Escarpins Classiques',
        tee: 'Tee-shirt Ajuste', jeans: 'Jean Brut', sneakers: 'Baskets Blanches', cardigan: 'Cardigan en Maille', chinos: 'Chinos Decontractes', flats: 'Ballerines',
        linen: 'Chemise en Lin', shorts: 'Short Tailleur', sundress: 'Robe Portefeuille', sandals: 'Sandales en Cuir', hat: 'Chapeau de Soleil', tote: 'Cabas en Toile',
        lbd: 'Petite Robe Noire', heels: 'Talons Statement', clutch: 'Pochette de Soiree', jumpsuit: 'Combinaison Taillee', wrap: 'Haut Portefeuille en Soie', earrings: 'Boucles Pendantes'
      }
    };
    var l = labels[lang] || labels.en;

    return {
      corporate: [
        { name: l.blazer, img: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=300&h=400&fit=crop' },
        { name: l.whiteshirt, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=300&h=400&fit=crop' },
        { name: l.trousers, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' },
        { name: l.silk, img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&h=400&fit=crop' },
        { name: l.pencilskirt, img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0afe0?w=300&h=400&fit=crop' },
        { name: l.pumps, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop' }
      ],
      weekend: [
        { name: l.tee, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop' },
        { name: l.jeans, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop' },
        { name: l.sneakers, img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=400&fit=crop' },
        { name: l.cardigan, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=300&h=400&fit=crop' },
        { name: l.chinos, img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop' },
        { name: l.flats, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop' }
      ],
      travel: [
        { name: l.linen, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop' },
        { name: l.shorts, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&h=400&fit=crop' },
        { name: l.sundress, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop' },
        { name: l.sandals, img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=400&fit=crop' },
        { name: l.hat, img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=400&fit=crop' },
        { name: l.tote, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop' }
      ],
      evening: [
        { name: l.lbd, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop' },
        { name: l.heels, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop' },
        { name: l.clutch, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop' },
        { name: l.jumpsuit, img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop' },
        { name: l.wrap, img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&h=400&fit=crop' },
        { name: l.earrings, img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop' }
      ]
    };
  }

  /* ============================================================
     TABS
     ============================================================ */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabGroup) {
      var tabs = tabGroup.querySelectorAll('.tab');
      var parent = tabGroup.parentElement;
      var contents = parent.querySelectorAll('.tab-content');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); });
          contents.forEach(function (c) { c.classList.remove('active'); });

          this.classList.add('active');
          var target = parent.querySelector(this.dataset.target);
          if (target) target.classList.add('active');
        });
      });
    });
  }

  /* ============================================================
     ACCORDIONS
     ============================================================ */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var item = this.closest('.accordion-item');
        var body = item.querySelector('.accordion-body');
        var isOpen = item.classList.contains('open');

        // Close all in same group
        var group = item.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-item').forEach(function (i) {
            i.classList.remove('open');
            var b = i.querySelector('.accordion-body');
            if (b) b.style.maxHeight = '0';
          });
        }

        if (!isOpen) {
          item.classList.add('open');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     COOKIE BANNER
     ============================================================ */
  function initCookieBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    if (!localStorage.getItem('st_cookies_accepted')) {
      setTimeout(function () {
        banner.classList.add('show');
      }, 1500);
    }

    var acceptBtn = banner.querySelector('.cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('st_cookies_accepted', 'true');
        banner.classList.remove('show');
      });
    }
  }

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(el) {
      var target = parseInt(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(step);
    }
  }

  /* ============================================================
     SMOOTH SCROLL (Anchor Links)
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
          var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     TRANSLATION HELPER
     ============================================================ */
  function getTranslation(key) {
    var lang = document.documentElement.lang || 'en';
    var translations = {
      en: {
        whyItHappens: 'Why It Happens',
        whatToShopFor: 'What to Shop For',
        whatToTailor: 'What to Tailor',
        whatToAvoid: 'What to Avoid'
      },
      es: {
        whyItHappens: 'Por Que Sucede',
        whatToShopFor: 'Que Comprar',
        whatToTailor: 'Que Ajustar',
        whatToAvoid: 'Que Evitar'
      },
      fr: {
        whyItHappens: 'Pourquoi Cela Arrive',
        whatToShopFor: 'Quoi Acheter',
        whatToTailor: 'Quoi Retoucher',
        whatToAvoid: 'Quoi Eviter'
      }
    };
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  }

  /* ============================================================
     UTILITY
     ============================================================ */
  function shuffleArray(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

})();
