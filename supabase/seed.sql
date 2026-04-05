-- ============================================
-- Seed Data — Run after schema.sql
-- ============================================

-- === DESTINATIONS ===
INSERT INTO destinations (slug, title_en, title_he, tag_en, tag_he, image_url, gradient, highlights_en, highlights_he, best_time_en, best_time_he, cta_url, cta_text_en, cta_text_he, sort_order) VALUES
('dubai', 'Dubai, UAE', 'דובאי', 'Luxury', 'יוקרה',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
 'linear-gradient(135deg, #4facfe33, #00f2fe33)',
 ARRAY['Desert safari & BBQ dinner', 'Burj Khalifa observation deck', 'Dubai Mall & souks', 'Dhow cruise dinner', 'Beach resorts & water parks'],
 ARRAY['ספארי מדברי וארוחת ערב BBQ', 'תצפית בורג'' חליפה', 'דובאי מול ושוקים', 'שייט דאו לארוחת ערב', 'אתרי נופש וחופים'],
 'Nov-Mar', 'נוב-מרץ',
 'https://tic.dubai.co.il/affiliate/', 'Browse Dubai Attractions', 'גלו אטרקציות בדובאי', 1),

('india', 'India', 'הודו', 'Adventure', 'הרפתקה',
 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
 'linear-gradient(135deg, #f5af1933, #f1293333)',
 ARRAY['Taj Mahal & Golden Triangle', 'Kerala backwaters cruise', 'Rajasthan palace tours', 'Street food experiences', 'Spiritual & yoga retreats'],
 ARRAY['טאג'' מאהל ומשולש הזהב', 'שייט בתעלות קראלה', 'סיורי ארמונות רג''סטאן', 'חוויות אוכל רחוב', 'ריטריטים רוחניים ויוגה'],
 'Oct-Mar', 'אוק-מרץ',
 '#trip-form', 'Plan My India Trip', 'תכננו טיול להודו', 2),

('athens', 'Athens, Greece', 'אתונה, יוון', 'History', 'היסטוריה',
 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
 'linear-gradient(135deg, #667eea33, #764ba233)',
 ARRAY['Acropolis & Parthenon tour', 'Plaka neighborhood walk', 'Greek island day trips', 'Traditional taverna dining', 'Ancient Agora exploration'],
 ARRAY['סיור אקרופוליס ופרתנון', 'סיור ברובע פלאקה', 'טיולי יום לאיים יווניים', 'ארוחות בטברנה מסורתית', 'חקירת האגורה העתיקה'],
 'Apr-Jun, Sep-Oct', 'אפר-יוני, ספט-אוק',
 '#trip-form', 'Plan My Athens Trip', 'תכננו טיול לאתונה', 3),

('rome', 'Rome, Italy', 'רומא, איטליה', 'Culture', 'תרבות',
 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
 'linear-gradient(135deg, #ffecd233, #fcb69f33)',
 ARRAY['Colosseum & Vatican tour', 'Trastevere food walk', 'Day trip to Amalfi Coast', 'Pasta making class', 'Trevi Fountain & Piazzas'],
 ARRAY['סיור קולוסיאום והוותיקן', 'סיור אוכל בטרסטווארה', 'טיול יום לחוף אמלפי', 'סדנת הכנת פסטה', 'מזרקת טרווי והפיאצות'],
 'Apr-Jun, Sep-Oct', 'אפר-יוני, ספט-אוק',
 '#trip-form', 'Plan My Rome Trip', 'תכננו טיול לרומא', 4),

('barcelona', 'Barcelona, Spain', 'ברצלונה, ספרד', 'Vibrant', 'תוסס',
 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
 'linear-gradient(135deg, #f093fb33, #f5576c33)',
 ARRAY['Sagrada Familia & Gaudi tour', 'La Boqueria market visit', 'Gothic Quarter walking tour', 'Beach & tapas experience', 'Montserrat day trip'],
 ARRAY['סגרדה פמיליה וסיור גאודי', 'ביקור בשוק לה בוקריה', 'סיור הליכה ברובע הגותי', 'חוף וחוויית טאפאס', 'טיול יום למונסראט'],
 'May-Jun, Sep-Oct', 'מאי-יוני, ספט-אוק',
 '#trip-form', 'Plan My Barcelona Trip', 'תכננו טיול לברצלונה', 5),

('london', 'London, UK', 'לונדון', 'Classic', 'קלאסי',
 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
 'linear-gradient(135deg, #a18cd133, #6190e833)',
 ARRAY['Big Ben & Parliament tour', 'Tower of London visit', 'West End theatre show', 'Camden & Borough markets', 'Day trip to Stonehenge'],
 ARRAY['סיור ביג בן והפרלמנט', 'ביקור במגדל לונדון', 'הצגה בווסט אנד', 'שוקי קמדן ובורו', 'טיול יום לסטונהנג'''],
 'May-Sep', 'מאי-ספט',
 '#trip-form', 'Plan My London Trip', 'תכננו טיול ללונדון', 6),

('vietnam', 'Vietnam', 'וייטנאם', 'Exotic', 'אקזוטי',
 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80',
 'linear-gradient(135deg, #11998e33, #38ef7d33)',
 ARRAY['Ha Long Bay cruise', 'Hanoi Old Quarter tour', 'Ho Chi Minh City exploration', 'Mekong Delta boat trip', 'Vietnamese cooking class'],
 ARRAY['שייט במפרץ הא לונג', 'סיור ברובע העתיק של האנוי', 'סיור בהו צ''י מין סיטי', 'טיול סירה בדלתא המקונג', 'סדנת בישול וייטנאמית'],
 'Feb-Apr, Oct-Dec', 'פבר-אפר, אוק-דצמ',
 '#trip-form', 'Plan My Vietnam Trip', 'תכננו טיול לוייטנאם', 7);

-- === TESTIMONIALS ===
INSERT INTO testimonials (author_name, author_initials, trip_label, review_text, stars, sort_order) VALUES
('Yuval Levy', 'YL', '10+ טיולים עם פטל',
 'אני אישית סגרתי אצל פטל המקסימה לפחות כבר 10 טיולים ואני חייב לציין שכל טיול היה יותר טוב מהשני. היא מקצועית מאוד, מדריכה ברמה הכי טובה שיש, זמינה ונותנת את המקסימום כדי שתהנו. ממליץ בחום ללא ספק כי הסוכנת נסיעות הכי טובה שיש, יורדת לפרטים קטנים, מקצועית ברמות!!!',
 5, 1),

('Irit Ganon', 'IG', 'טיול משפחתי לדובאי',
 'סגנו לדובאי כל המשפחה עם פטל. שהיתה קשובה לנו מהתחילה הראשונה של תכנון הנסיעה, היעד, הזמנים, האטרקציות ועד הרגע הנחיתה חזרה הביתה. תמיד בדקה שאנחנו מסודרים, היתה זמינה עבורנו בכל שלב גם בארץ וגם בחו״ל. ממליצים בחום רב לנסוע עם פטל!',
 5, 2),

('טל קרן כץ', 'TK', 'טיסה לארה״ב דרך לונדון',
 'אני רוצה לשתף על פטל הסוכנת שעזרה לי להזמין את הטיסה לארצות הברית עם קונקשן דרך לונדון. ההזמנה הזאת לא הייתה פשוטה בכלל. היו פרטים קטנים, עניינים טכניים ושינויים שהתעוררו בדרך, והיא פשוט הייתה שם לכל דבר. זמינה, מקצועית, סבלנית ומדויקת. ממליצה מכל הלב!',
 5, 3),

('Aviya Cohen', 'AC', 'מטיילת קבועה',
 'בכל הנסיעות שלי עם פטל תמיד ידעתי שיש על מי לסמוך, היא הייתה זמינה מעל שעה מכל מקום בעולם ובכל צרה מצאה עבורי פתרון! ממליצה כל כך על השירות הנהדר, הנחמדות והפתרונות המהירים לכל בעיה!',
 5, 4),

('אביתר כהן', 'AK', 'Google Review',
 'שירות מספר אחד, אין שני לאישה הזאת! זמינה 24/7 ולא סתם כמו כל החרטטנים בחוץ, באמת זמינה תמיד כל הזמן להכל. אין דברים כאלו, מומלץ ביותר!',
 5, 5),

('עת הדולר', 'EH', 'טיול לזנזיבר',
 'פטל אירגנה לנו את הטיול לזנזיבר לפני שנה בצורה הטובה ביותר. מקצועית ברמה מדהימה, חוויה הכי טובה לנסוע כשיש מישהו שאתה סומך עליו!',
 5, 6),

('Avri Bareket', 'AB', 'Google Review',
 'פוך נהדרת, שירות מצוין, אכפתיות וזמינות בכל שעה. שווה לגמרי את העמלה. ונותן שקט בכל נסיעה. מומלץ בחום.',
 5, 7),

('Einav Maler', 'EM', 'Google Review',
 'סוכנת נסיעות מקסימה, עונה במהירות ודואגת להכל!',
 5, 8);
