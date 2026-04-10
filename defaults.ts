import { Language, PreSetDietPlan, WorkoutDay } from './types';

export const getDietPlans = (language: Language): PreSetDietPlan[] => {
    const isEn = language === 'en';
    return [
        {
            id: 'diet1',
            title: isEn ? 'Diet List - 1 (Classic & Sustainable)' : 'Diyet Listesi - 1 (Klasik & Uygulanabilir)',
            description: isEn ? 'A sustainable, classic diet program with balanced macro distribution.' : 'Dengeli makro dağılımı ile sürdürülebilir, klasik bir diyet programı.',
            totalMacros: { calories: 2050, protein: 185, fat: 90, carbs: 130, fiber: 35 },
            meals: [
                {
                    id: 'd1_m1', title: isEn ? 'Breakfast' : 'Kahvaltı', completed: false,
                    description: isEn ? '3 whole eggs, 200g yogurt + 40g oats, Tomato/Cucumber, 10 olives' : '3 tam yumurta, 200g yoğurt + 40g yulaf, Domates/Salatalık, 10 zeytin',
                    macros: { calories: 550, protein: 35, fat: 30, carbs: 35, fiber: 8 }
                },
                {
                    id: 'd1_m2', title: isEn ? 'Lunch' : 'Öğle Yemeği', completed: false,
                    description: isEn ? '200g grilled chicken breast, 80g basmati rice (weighed dry), Green Salad, 1 tbsp olive oil' : '200g ızgara tavuk göğüs, 80g basmati pirinç (kuru tartım), Yeşil Salata, 1 yk zeytinyağı',
                    macros: { calories: 600, protein: 50, fat: 15, carbs: 60, fiber: 5 }
                },
                {
                    id: 'd1_m3', title: isEn ? 'Snack' : 'Ara Öğün', completed: false,
                    description: isEn ? '1 apple or banana, 15 almonds (raw)' : '1 elma veya muz, 15 badem (çiğ)',
                    macros: { calories: 200, protein: 5, fat: 10, carbs: 25, fiber: 4 }
                },
                {
                    id: 'd1_m4', title: isEn ? 'Dinner' : 'Akşam', completed: false,
                    description: isEn ? '200g ground beef (low fat), 250g potatoes (boiled/baked), Vegetable saute' : '200g dana kıyma (az yağlı), 250g patates (haşlama/fırın), Sebze sote',
                    macros: { calories: 700, protein: 55, fat: 35, carbs: 45, fiber: 8 }
                }
            ]
        },
        {
            id: 'diet2',
            title: isEn ? 'Diet List - 2 (Intermittent Fasting Model)' : 'Diyet Listesi - 2 (Aralıklı Oruç Modeli)',
            description: isEn ? '2 main meals and 1 snack. Ideal for busy schedules.' : '2 ana öğün ve 1 ara öğün üzerine kurulu. Yoğun çalışanlar için ideal.',
            totalMacros: { calories: 1950, protein: 175, fat: 80, carbs: 135, fiber: 30 },
            meals: [
                {
                    id: 'd2_m1', title: isEn ? 'First Meal (12:00)' : 'İlk Öğün (12:00)', completed: false,
                    description: isEn ? '4 eggs (scrambled with veggies), 100g feta cheese, 2 slices whole wheat bread' : '4 yumurta (sebzeli menemen), 100g beyaz peynir, 2 dilim tam buğday ekmeği',
                    macros: { calories: 650, protein: 45, fat: 35, carbs: 40, fiber: 5 }
                },
                {
                    id: 'd2_m2', title: isEn ? 'Snack (16:00)' : 'Ara Öğün (16:00)', completed: false,
                    description: isEn ? '1 protein bar or shake, 1 fruit' : '1 protein bar veya shake, 1 meyve',
                    macros: { calories: 300, protein: 25, fat: 8, carbs: 30, fiber: 3 }
                },
                {
                    id: 'd2_m3', title: isEn ? 'Last Meal (20:00)' : 'Son Öğün (20:00)', completed: false,
                    description: isEn ? '250g fish (salmon/sea bass), large mixed salad, 1 tbsp olive oil, 200g sweet potato' : '250g balık (somon/levrek), büyük karışık salata, 1 yk zeytinyağı, 200g tatlı patates',
                    macros: { calories: 800, protein: 60, fat: 35, carbs: 50, fiber: 10 }
                }
            ]
        },
        {
            id: 'diet3',
            title: isEn ? 'Diet List - 3 (Economic & Student Friendly)' : 'Diyet Listesi - 3 (Ekonomik & Öğrenci Dostu)',
            description: isEn ? 'High protein sources using budget-friendly foods (Eggs, Chicken Breast, Curd Cheese).' : 'Uygun bütçeli gıdalarla yüksek protein (Yumurta, Tavuk Göğsü, Lor Peyniri).',
            totalMacros: { calories: 2000, protein: 180, fat: 80, carbs: 135, fiber: 30 },
            meals: [
                {
                    id: 'd3_m1', title: isEn ? 'Breakfast' : 'Kahvaltı', completed: false,
                    description: isEn ? '2 eggs + 100g curd cheese omelet, 2 slices whole wheat bread, Olives, Greens' : '2 yumurta + 100g lor omlet, 2 dilim tb ekmek, Zeytin, Yeşillik',
                    macros: { calories: 500, protein: 35, fat: 25, carbs: 35, fiber: 6 }
                },
                {
                    id: 'd3_m2', title: isEn ? 'Lunch' : 'Öğle Yemeği', completed: false,
                    description: isEn ? '200g chicken, 80g bulgur pilaf, Salad, 1 tbsp olive oil' : '200g tavuk, 80g bulgur pilavı, Salata, 1 yk zeytinyağı',
                    macros: { calories: 550, protein: 45, fat: 15, carbs: 50, fiber: 8 }
                },
                {
                    id: 'd3_m3', title: isEn ? 'Snack' : 'Ara Öğün', completed: false,
                    description: isEn ? '200g yogurt, 1 banana, 20g almonds' : '200g yoğurt, 1 muz, 20g badem',
                    macros: { calories: 350, protein: 15, fat: 15, carbs: 35, fiber: 5 }
                },
                {
                    id: 'd3_m4', title: isEn ? 'Dinner' : 'Akşam', completed: false,
                    description: isEn ? '200g salmon (or fish), 150g beans, Vegetable saute' : '200g somon, 150g barbunya, Sebze sote',
                    macros: { calories: 600, protein: 45, fat: 35, carbs: 30, fiber: 15 }
                }
            ]
        }
    ];
};

export const getWorkoutPlan = (language: Language): WorkoutDay[] => {
    const isEn = language === 'en';
    return [
        // CALISTHENICS - MONDAY
        {
            id: 'Mon',
            title: 'Calisthenics',
            exercises: [
                { id: 'c1a', name: 'Push-up', sets: 4, reps: '12-15', completed: false, description: isEn ? 'Place hands shoulder-width apart, keep your body in a straight line from head to heels. Lower your chest to the floor with controlled tempo, then push back up. Engage your core throughout the movement.' : 'Elleri omuz genişliğinde yere koyun. Vücudu baştan topuklara düz bir çizgide tutun. Göğsünüzü kontrollü bir şekilde yere indirin, sonra yukarı itin. Hareket boyunca karın kaslarını sıkı tutun.' },
                { id: 'c1b', name: 'Bodyweight Squat', sets: 4, reps: '20', completed: false, description: isEn ? 'Stand with feet shoulder-width apart. Push hips back and bend knees, keeping chest up and back straight. Go below parallel, then drive through heels to stand. Keep knees tracking over toes.' : 'Ayakları omuz genişliğinde açın. Kalçayı geriye iterek dizleri bükün, göğüs dik ve sırt düz. Paralelin altına inin, topuklardan iterek kalkın. Dizlerin ayak parmaklarının üzerinde kalmasına dikkat edin.' },
                { id: 'c1c', name: 'Plank', sets: 3, reps: '45-60 sec', completed: false, description: isEn ? 'Support your body on forearms and toes. Keep your body in a straight line, core tight, glutes squeezed. Don\'t let hips sag or pike up. Breathe steadily throughout.' : 'Vücudu dirsekler ve ayak parmakları üzerinde destekleyin. Vücudu düz bir çizgide tutun, karın sıkı, kalça kasılı. Kalçanın düşmesine veya yükselmesine izin vermeyin. Düzenli nefes alın.' },
                { id: 'c1d', name: 'Jumping Jack', sets: 3, reps: '40 sec', completed: false, description: isEn ? 'Start standing with arms at sides. Jump feet out while raising arms overhead. Jump back to starting position. Maintain a steady, rhythmic pace for cardio benefit.' : 'Ayakta, kollar yanda başlayın. Ayakları açarken kolları başın üzerine kaldırın. Başlangıç pozisyonuna geri atlayın. Kardiyo faydası için sabit ve ritmik bir tempo koruyun.' }
            ]
        },
        // WEIGHT - TUESDAY
        {
            id: 'Tue',
            title: 'GYM',
            exercises: [
                { id: 'w1a', name: 'Bench Press', sets: 4, reps: '3-5', completed: false, description: isEn ? 'Lie on bench, grip bar slightly wider than shoulders. Unrack and lower bar to mid-chest with control. Press up explosively. Keep feet flat, back slightly arched, shoulder blades retracted. Do not hit failure on heavy sets.' : 'Sehpaya yatın, barı omuz genişliğinden biraz geniş tutun. Barı kontrollü şekilde göğüs ortasına indirin. Patlayıcı şekilde yukarı itin. Ayaklar yerde, sırt hafif kemerli, kürek kemikleri sıkışık. Ağır setlerde failure\'a gitmeyin.' },
                { id: 'w1b', name: 'Barbell Row', sets: 3, reps: '5', completed: false, description: isEn ? 'Bend at hips with knees slightly bent, back flat at 45 degrees. Pull bar to lower chest/upper abs, squeezing shoulder blades together. Lower with control. Keep core tight throughout.' : 'Dizler hafif bükük, kalçadan öne eğilin, sırt 45 derecede düz. Barı alt göğüs/üst karın bölgesine çekin, kürek kemiklerini sıkıştırın. Kontrollü indirin. Karın kasları hareket boyunca sıkı.' },
                { id: 'w1c', name: 'Overhead Press', sets: 3, reps: '4-6', completed: false, description: isEn ? 'Stand with bar at shoulder height. Press bar straight up, moving head slightly back then forward as bar passes. Lock out at top. Keep core braced and avoid excessive back arch.' : 'Barı omuz hizasında tutarak ayakta durun. Barı düz yukarı itin, bar geçerken başı hafif geri sonra öne alın. Tepede kilitleyin. Karın sıkı, aşırı bel kemeri yapmayın.' },
                { id: 'w1d', name: 'Pull-up / Lat Pulldown', sets: 3, reps: '6', completed: false, description: isEn ? 'Grip bar wider than shoulders. Pull yourself up until chin clears bar (or pull bar to upper chest). Focus on driving elbows down and back. Lower with control.' : 'Barı omuz genişliğinden geniş tutun. Çene barı geçene kadar kendinizi çekin (veya barı üst göğse çekin). Dirsekleri aşağı ve geriye sürmeye odaklanın. Kontrollü inin.' },
                { id: 'w1e', name: 'Incline Dumbbell Press', sets: 2, reps: '6-8', completed: false, description: isEn ? 'Set bench to 30-45 degrees. Press dumbbells up, converging slightly at top without touching. Focus on upper chest contraction. Lower with control to shoulder level.' : 'Sehpayı 30-45 dereceye ayarlayın. Dambılları yukarı itin, tepede birbirine değdirmeden yaklaştırın. Üst göğüs kasılmasına odaklanın. Omuz seviyesine kontrollü indirin.' },
                { id: 'w1f', name: 'Decline Dumbbell Press', sets: 3, reps: '8-10', completed: false, description: isEn ? 'Lie on decline bench, press dumbbells up over lower chest. Lower to sides of chest with elbows at 45 degrees. Focus on lower chest engagement.' : 'Eğimli sehpaya (baş aşağı) yatın, dambılları alt göğüs üzerinde yukarı itin. Dirsekler 45 derecede, göğsün yanlarına indirin. Alt göğüs kasılmasına odaklanın.' }
            ]
        },
        // CALISTHENICS - WEDNESDAY
        {
            id: 'Wed',
            title: 'Calisthenics',
            exercises: [
                { id: 'c2a', name: 'Incline Push-up', sets: 4, reps: '10-15', completed: false, description: isEn ? 'Place hands on elevated surface (bench, chair, stairs). Perform push-up with body in straight line. Easier than floor push-ups, great for building strength or high-rep endurance.' : 'Elleri yüksek bir yüzeye koyun (sehpa, sandalye, merdiven). Vücudu düz tutarak şınav yapın. Yerden şınavdan daha kolay, güç geliştirmek veya yüksek tekrar dayanıklılığı için harika.' },
                { id: 'c2b', name: 'Walking Lunge', sets: 3, reps: '20 steps', completed: false, description: isEn ? 'Step forward into a lunge, lowering back knee toward floor. Push through front heel to step forward into next lunge. Keep torso upright, core engaged. Alternate legs continuously.' : 'Öne adım atarak lunge pozisyonuna inin, arka diz yere doğru. Ön topuktan iterek bir sonraki lunge\'a adım atın. Gövde dik, karın sıkı. Bacakları sürekli değiştirin.' },
                { id: 'c2c', name: 'Mountain Climber', sets: 3, reps: '40 sec', completed: false, description: isEn ? 'Start in push-up position. Drive one knee toward chest, then switch legs rapidly. Keep hips low and core tight. Maintain steady breathing despite the cardio intensity.' : 'Şınav pozisyonunda başlayın. Bir dizi göğse doğru çekin, sonra hızlıca bacak değiştirin. Kalça alçak, karın sıkı. Kardiyo yoğunluğuna rağmen düzenli nefes alın.' },
                { id: 'c2d', name: 'Hollow Hold', sets: 3, reps: '30-40 sec', completed: false, description: isEn ? 'Lie on back, press lower back firmly into floor. Raise legs and shoulders off ground, arms extended overhead. Create a "banana" shape. Don\'t let lower back arch up.' : 'Sırt üstü yatın, beli yere sıkıca bastırın. Bacakları ve omuzları yerden kaldırın, kollar başın üzerinde uzatılmış. "Muz" şekli oluşturun. Belin yerden kalkmasına izin vermeyin.' }
            ]
        },
        // WEIGHT - THURSDAY
        {
            id: 'Thu',
            title: 'GYM',
            exercises: [
                { id: 'w2a', name: 'Lateral Raise', sets: 3, reps: '12-15', completed: false, description: isEn ? 'Stand with dumbbells at sides. Raise arms out to sides until parallel with floor, slight bend in elbows. Lower with control. Focus on side delt contraction, avoid swinging.' : 'Dambılları yanlarda tutarak ayakta durun. Kolları yere paralel olana kadar yanlara kaldırın, dirseklerde hafif bükülme. Kontrollü indirin. Yan omuz kasılmasına odaklanın, sallanmayın.' },
                { id: 'w2b', name: 'Face Pull / Rear Delt Fly', sets: 3, reps: '12-15', completed: false, description: isEn ? 'Using cable or bands, pull toward face with elbows high. Squeeze rear delts and upper back at peak contraction. Excellent for shoulder health and posture.' : 'Kablo veya bant kullanarak, dirsekler yukarıda yüze doğru çekin. Tepe kasılmada arka omuz ve üst sırtı sıkın. Omuz sağlığı ve duruş için mükemmel.' },
                { id: 'w2c', name: 'Cable Fly', sets: 2, reps: '12-15', completed: false, description: isEn ? 'Set cables at mid-height. Step forward, bring handles together in front of chest with slight elbow bend. Squeeze chest hard at peak, control the stretch on return.' : 'Kabloları orta yükseklikte ayarlayın. Öne adım atın, tutamakları göğsün önünde hafif dirsek bükümüyle birleştirin. Tepede göğsü sıkın, dönüşte gerilmeyi kontrol edin.' },
                { id: 'w2d', name: 'Biceps Curl', sets: 2, reps: '8-10', completed: false, description: isEn ? 'Stand with dumbbells, palms forward. Curl weights up keeping elbows stationary at sides. Squeeze biceps at top, lower with control. Avoid swinging or using momentum.' : 'Dambılları avuç içleri öne bakacak şekilde tutun. Dirsekleri sabit tutarak ağırlıkları yukarı kıvırın. Tepede biceps\'i sıkın, kontrollü indirin. Sallanmaktan veya momentum kullanmaktan kaçının.' },
                { id: 'w2e', name: 'Triceps Pushdown', sets: 2, reps: '10-12', completed: false, description: isEn ? 'Using cable with rope or bar, push down until arms are fully extended. Keep elbows locked at sides throughout. Squeeze triceps at bottom, control the return.' : 'Kablo ile ip veya bar kullanarak kollar tamamen düz olana kadar aşağı itin. Dirsekleri hareket boyunca yanlarda sabit tutun. Altta triceps\'i sıkın, dönüşü kontrol edin.' }
            ]
        },
        // WEIGHT - SATURDAY
        {
            id: 'Sat',
            title: 'GYM',
            exercises: [
                { id: 'w3a', name: 'Squat', sets: 4, reps: '3-5', completed: false, description: isEn ? 'Bar on upper back, feet shoulder-width. Break at hips and knees simultaneously, descend below parallel. Drive up through heels, keeping chest up and core braced. Heavy weight, focus on form.' : 'Bar üst sırtta, ayaklar omuz genişliğinde. Kalça ve dizlerden aynı anda kırın, paralelin altına inin. Topuklardan iterek kalkın, göğüs dik ve karın sıkı. Ağır kilo, forma odaklanın.' },
                { id: 'w3b', name: 'Romanian Deadlift', sets: 3, reps: '5-6', completed: false, description: isEn ? 'Hold bar with overhand grip. Hinge at hips, pushing them back while keeping slight knee bend. Lower bar along legs until hamstring stretch, then drive hips forward to stand.' : 'Barı üstten kavrayın. Kalçadan bükülün, dizlerde hafif bükülme koruyarak kalçayı geriye itin. Barı hamstring gerilene kadar bacaklar boyunca indirin, sonra kalçayı öne iterek kalkın.' },
                { id: 'w3c', name: 'Leg Press', sets: 2, reps: '8', completed: false, description: isEn ? 'Sit in machine with back flat against pad. Place feet hip-width on platform. Lower weight until knees are 90 degrees, then push through heels. Don\'t lock knees at top.' : 'Makinede sırt pede yaslanmış şekilde oturun. Ayakları kalça genişliğinde platforma koyun. Dizler 90 derece olana kadar indirin, topuklardan itin. Tepede dizleri kilitlemeyin.' },
                { id: 'w3d', name: 'Leg Curl', sets: 2, reps: '10-12', completed: false, description: isEn ? 'Lie face down on machine. Curl weight toward glutes, squeezing hamstrings at peak. Lower with control, don\'t let weight slam down. Focus on mind-muscle connection.' : 'Makinede yüzüstü yatın. Ağırlığı kalçaya doğru kıvırın, tepede hamstring\'leri sıkın. Kontrollü indirin, ağırlığın düşmesine izin vermeyin. Kas-zihin bağlantısına odaklanın.' },
                { id: 'w3e', name: 'Standing Calf Raise', sets: 3, reps: '12-15', completed: false, description: isEn ? 'Stand on edge of step or calf raise machine. Rise up on toes as high as possible, squeezing calves at top. Lower heels below platform level for full stretch.' : 'Basamak kenarında veya baldır kaldırma makinesinde durun. Ayak parmaklarında olabildiğince yükseğe kalkın, tepede baldırları sıkın. Tam gerilme için topukları platform seviyesinin altına indirin.' }
            ]
        },
        // CALISTHENICS - SUNDAY
        {
            id: 'Sun',
            title: 'Calisthenics',
            exercises: [
                { id: 'c3a', name: 'Bench Dip', sets: 4, reps: '10-12', completed: false, description: isEn ? 'Sit on edge of bench, hands beside hips. Slide off and lower body by bending elbows to 90 degrees. Push back up. Keep back close to bench, don\'t flare elbows too wide.' : 'Sehpanın kenarına oturun, eller kalçanın yanında. Kaydırarak inin ve dirsekleri 90 dereceye bükerek vücudu indirin. Yukarı itin. Sırt sehpaya yakın, dirsekleri çok açmayın.' },
                { id: 'c3b', name: 'Pike Push-up', sets: 3, reps: '10-12', completed: false, description: isEn ? 'Start in downward dog position, hips high. Bend elbows and lower head toward floor between hands. Push back up. This targets shoulders like an overhead press.' : 'Aşağı bakan köpek pozisyonunda başlayın, kalça yukarıda. Dirsekleri bükerek başı eller arasında yere doğru indirin. Yukarı itin. Bu hareket omuzları overhead press gibi çalıştırır.' },
                { id: 'c3c', name: 'Glute Bridge', sets: 3, reps: '15', completed: false, description: isEn ? 'Lie on back, knees bent, feet flat. Drive through heels to lift hips toward ceiling, squeezing glutes hard at top. Lower with control. Don\'t hyperextend lower back.' : 'Sırt üstü yatın, dizler bükük, ayaklar yerde. Topuklardan iterek kalçayı tavana doğru kaldırın, tepede kalça kaslarını sıkın. Kontrollü indirin. Beli aşırı germeyin.' },
                { id: 'c3d', name: 'High Knees', sets: 3, reps: '40 sec', completed: false, description: isEn ? 'Run in place, driving knees up toward chest as high as possible. Pump arms in running motion. Keep a fast pace for cardio conditioning and leg endurance.' : 'Yerinde koşun, dizleri olabildiğince yükseğe göğse doğru kaldırın. Kolları koşu hareketiyle sallayın. Kardiyo ve bacak dayanıklılığı için hızlı tempo koruyun.' }
            ]
        }
    ];
};

export const getWorkoutNotes = (language: Language): string[] => {
    const isEn = language === 'en';
    return isEn ? [
        "No failure on compound movements.",
        "Controlled tempo for isolation and calisthenics.",
        "Calisthenics days should not be intense enough to interfere with weight days."
    ] : [
        "Compound hareketlerde failure yok.",
        "İzole ve kalistenikte kontrollü tempo.",
        "Kalistenik günler ağırlık günlerini baltalamayacak şiddette uygulanır."
    ];
};

export const getPostureRoutine = (language: Language): WorkoutDay[] => {
    const isEn = language === 'en';
    return [
        {
            id: 'Day1',
            title: isEn ? 'Day 1 - Neck & Shoulders' : 'Gün 1 – Boyun & Omuz Odaklı',
            exercises: [
                { id: 'p1a', name: 'Chin Tuck (Supine/Standing)', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/watch?v=u8C5LgpK3r4' },
                { id: 'p1b', name: 'Pectoralis Stretch (Doorway Stretch)', sets: 2, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=MZxBzSveakY' },
                { id: 'p1c', name: 'Scapular Retraction', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/watch?v=UHlhyti-RBQ' },
                { id: 'p1d', name: 'Sternocleidomastoid Stretch', sets: 3, reps: '20 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=s_TdSVFpLdg' },
                { id: 'p1e', name: 'Wall Slides', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/shorts/7auEc73ncGU' }
            ]
        },
        {
            id: 'Day2',
            title: isEn ? 'Day 2 - Lower Back & Core' : 'Gün 2 – Bel & Core Odaklı',
            exercises: [
                { id: 'p2a', name: 'Pelvic Tilt', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/watch?v=ZIQjHtghzqw' },
                { id: 'p2b', name: 'Glute Bridge', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/shorts/ktSiNvWzYWY' },
                { id: 'p2c', name: 'Plank', sets: 2, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/shorts/v25dawSzRTM' },
                { id: 'p2d', name: 'Side Plank', sets: 2, reps: '20 sec', completed: false, videoUrl: 'https://www.youtube.com/shorts/sKMD_pbNm7w' }
            ]
        },
        {
            id: 'Day3',
            title: isEn ? 'Day 3 - Feet & Balance' : 'Gün 3 – Ayak & Denge Odaklı',
            exercises: [
                { id: 'p3a', name: 'Short Foot Exercise', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/watch?v=DoEIW4Y8MEo' },
                { id: 'p3b', name: 'Toe Curl with Towel', sets: 2, reps: '12', completed: false, videoUrl: 'https://www.youtube.com/shorts/RoEmHev3KZ8' },
                { id: 'p3c', name: 'Calf Stretch (Gastrocnemius & Soleus)', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=y01ri_43G50' },
                { id: 'p3d', name: 'Single-Leg Balance', sets: 3, reps: '20 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=Dtgh2_LFkBQ' }
            ]
        },
        {
            id: 'Day4',
            title: isEn ? 'Day 4 - Trunk & Shoulder Strength' : 'Gün 4 – Gövde & Omuz Güçlendirme',
            exercises: [
                { id: 'p4a', name: 'Bird Dog', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/watch?v=QABW99qPiNM' },
                { id: 'p4b', name: 'Band Rows', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/shorts/bBpK36TAQww' },
                { id: 'p4c', name: 'Scapular Push-Up', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/shorts/3TsOKiUDzw0' },
                { id: 'p4d', name: 'Dead Bug', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/watch?v=o4GKiEoYClI' },
                { id: 'p4e', name: 'Cat-Cow Stretch', sets: 3, reps: '10', completed: false, videoUrl: 'https://www.youtube.com/shorts/oMDrs7dPtxI' }
            ]
        },
        {
            id: 'Day5',
            title: isEn ? 'Day 5 - Stretching & Mobility' : 'Gün 5 – Esneme & Mobilite',
            exercises: [
                { id: 'p5a', name: 'Pectoralis Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=MZxBzSveakY' },
                { id: 'p5b', name: 'Sternocleidomastoid Stretch', sets: 3, reps: '20 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=s_TdSVFpLdg' },
                { id: 'p5c', name: 'Hip Flexor Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=DXuStgWuJV8' },
                { id: 'p5d', name: 'Calf Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=y01ri_43G50' }
            ]
        },
        {
            id: 'Day6',
            title: isEn ? 'Day 6 - Integrated Posture Routine' : 'Gün 6 – Entegre Duruş Rutini',
            exercises: [
                { id: 'p6a', name: 'Chin Tuck', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/watch?v=u8C5LgpK3r4' },
                { id: 'p6b', name: 'Wall Slides', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/shorts/7auEc73ncGU' },
                { id: 'p6c', name: 'Glute Bridge', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/shorts/ktSiNvWzYWY' },
                { id: 'p6d', name: 'Short Foot Exercise', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/watch?v=DoEIW4Y8MEo' },
                { id: 'p6e', name: 'Scapular Retraction', sets: 3, reps: '20', completed: false, videoUrl: 'https://www.youtube.com/watch?v=UHlhyti-RBQ' }
            ]
        },
        {
            id: 'Day7',
            title: isEn ? 'Day 7 - Rest / Light Activity' : 'Gün 7 – Dinlenme / Hafif Aktivite ve Esneme',
            exercises: [
                { id: 'p7a', name: isEn ? 'Light Walk' : 'Hafif yürüyüş', sets: 1, reps: '20 min', completed: false },
                { id: 'p7b', name: 'Pectoralis Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=MZxBzSveakY' },
                { id: 'p7c', name: 'Sternocleidomastoid Stretch', sets: 3, reps: '20 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=s_TdSVFpLdg' },
                { id: 'p7d', name: 'Hip Flexor Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=DXuStgWuJV8' },
                { id: 'p7e', name: 'Calf Stretch', sets: 3, reps: '30 sec', completed: false, videoUrl: 'https://www.youtube.com/watch?v=y01ri_43G50' }
            ]
        }
    ];
};

export const getPostureNotes = (language: Language): string[] => {
    const isEn = language === 'en';
    return isEn ? [
        "You can rest for 30–60 seconds between sets.",
        "For stretching exercises, a 'mild tension' is sufficient; do not force it to the point of pain.",
        "Over time, you can increase the duration/repetitions of plank, bridge, and balance exercises."
    ] : [
        "Egzersizlerde set araları 30–60 saniye dinlenebilirsin.",
        "Germe hareketlerinde (stretch) 'hafif gerginlik' yeterli, ağrıya zorlamamalısın, canını yakma.",
        "Zamanla plank, köprü ve denge hareketlerinin süre/tekrarlarını artırabilirsin."
    ];
};
